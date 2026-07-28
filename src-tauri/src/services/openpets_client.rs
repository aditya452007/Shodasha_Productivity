use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;
use std::path::PathBuf;
use std::sync::mpsc;
use std::time::Duration;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::debug;

const DISCOVERY_FILE_NAME: &str = "OpenPets/runtime/ipc.json";
const IPC_CONNECT_TIMEOUT_MS: u64 = 2000;
const IPC_RESPONSE_TIMEOUT_MS: u64 = 3000;
const MAX_PIPE_BUFFER: usize = 16 * 1024;
const INVALID_HANDLE_VALUE: isize = -1;
const GENERIC_READ: u32 = 0x80000000;
const GENERIC_WRITE: u32 = 0x40000000;
const OPEN_EXISTING: u32 = 3;

type HANDLE = isize;

#[link(name = "kernel32")]
extern "system" {
    fn CreateFileW(
        lpFileName: *const u16,
        dwDesiredAccess: u32,
        dwShareMode: u32,
        lpSecurityAttributes: *mut std::ffi::c_void,
        dwCreationDisposition: u32,
        dwFlagsAndAttributes: u32,
        hTemplateFile: *mut std::ffi::c_void,
    ) -> HANDLE;

    fn CloseHandle(hObject: HANDLE) -> i32;

    fn WriteFile(
        hFile: HANDLE,
        lpBuffer: *const std::ffi::c_void,
        nNumberOfBytesToWrite: u32,
        lpNumberOfBytesWritten: *mut u32,
        lpOverlapped: *mut std::ffi::c_void,
    ) -> i32;

    fn ReadFile(
        hFile: HANDLE,
        lpBuffer: *mut std::ffi::c_void,
        nNumberOfBytesToRead: u32,
        lpNumberOfBytesRead: *mut u32,
        lpOverlapped: *mut std::ffi::c_void,
    ) -> i32;
}

#[derive(Debug, Clone, Serialize)]
pub struct OpenPetsStatus {
    pub available: bool,
    pub default_pet_id: Option<String>,
    pub default_pet_name: Option<String>,
    pub app_version: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct OpenPetsPetInfo {
    pub id: String,
    pub display_name: String,
    pub built_in: bool,
    pub broken: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct OpenPetsSayResult {
    pub sent: bool,
}

#[derive(Debug, Clone)]
pub enum OpenPetsError {
    NotInstalled,
    InvalidDiscovery(String),
    NotRunning(String),
    IpcError { code: String, message: String },
    Timeout(String),
    Platform,
}

impl std::fmt::Display for OpenPetsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OpenPetsError::NotInstalled => write!(f, "OpenPets is not installed"),
            OpenPetsError::InvalidDiscovery(msg) => write!(f, "Invalid OpenPets discovery: {}", msg),
            OpenPetsError::NotRunning(msg) => write!(f, "OpenPets is not running: {}", msg),
            OpenPetsError::IpcError { code, message } => write!(f, "OpenPets IPC error ({}): {}", code, message),
            OpenPetsError::Timeout(msg) => write!(f, "OpenPets timeout: {}", msg),
            OpenPetsError::Platform => write!(f, "OpenPets IPC is only available on Windows"),
        }
    }
}

struct SafeHandle(HANDLE);

unsafe impl Send for SafeHandle {}

#[allow(dead_code)]
#[derive(Deserialize)]
struct DiscoveryFile {
    #[serde(rename = "protocolVersion")]
    protocol_version: u32,
    protocol: String,
    endpoint: String,
    token: String,
    #[serde(rename = "appVersion")]
    app_version: String,
    pid: u32,
    platform: String,
}

#[derive(Serialize)]
struct IpcRequest {
    id: String,
    version: u32,
    token: String,
    method: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    params: Option<Value>,
}

#[allow(dead_code)]
#[derive(Deserialize)]
struct IpcResponse {
    id: Option<String>,
    ok: bool,
    #[serde(default)]
    result: Option<Value>,
    #[serde(default)]
    error: Option<IpcErrorBody>,
}

#[allow(dead_code)]
#[derive(Deserialize)]
struct IpcErrorBody {
    code: String,
    message: String,
}

#[allow(dead_code)]
#[derive(Deserialize)]
struct PetListItem {
    id: String,
    #[serde(rename = "displayName")]
    display_name: String,
    #[serde(default)]
    built_in: bool,
    #[serde(alias = "builtIn")]
    built_in_raw: Option<bool>,
    #[serde(default)]
    broken: bool,
}

fn discovery_path() -> PathBuf {
    dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from(r"C:\Users\Default\AppData\Roaming"))
        .join(DISCOVERY_FILE_NAME)
}

fn read_discovery() -> Result<DiscoveryFile, OpenPetsError> {
    let path = discovery_path();
    let content = std::fs::read_to_string(&path).map_err(|_| OpenPetsError::NotInstalled)?;

    let discovery: DiscoveryFile =
        serde_json::from_str(&content).map_err(|e| OpenPetsError::InvalidDiscovery(e.to_string()))?;

    if discovery.platform != "win32" {
        return Err(OpenPetsError::Platform);
    }
    if discovery.protocol != "openpets-ipc" {
        return Err(OpenPetsError::InvalidDiscovery("unexpected protocol".to_string()));
    }
    if discovery.protocol_version != 1 {
        return Err(OpenPetsError::InvalidDiscovery("unsupported protocol version".to_string()));
    }
    if discovery.token.len() < 16 || discovery.token.len() > 256 {
        return Err(OpenPetsError::InvalidDiscovery("invalid token length".to_string()));
    }

    Ok(discovery)
}

fn to_utf16(s: &str) -> Vec<u16> {
    OsStr::new(s).encode_wide().chain(std::iter::once(0)).collect()
}

fn connect_pipe(pipe_name: &str) -> Result<HANDLE, OpenPetsError> {
    let name_wide = to_utf16(pipe_name);
    let (tx, rx) = mpsc::channel::<Result<HANDLE, OpenPetsError>>();

    std::thread::spawn(move || {
        let handle = unsafe {
            CreateFileW(
                name_wide.as_ptr(),
                GENERIC_READ | GENERIC_WRITE,
                0,
                std::ptr::null_mut(),
                OPEN_EXISTING,
                0,
                std::ptr::null_mut(),
            )
        };

        if handle == INVALID_HANDLE_VALUE {
            let err = std::io::Error::last_os_error();
            let _ = tx.send(Err(OpenPetsError::NotRunning(format!(
                "CreateFileW failed: {}",
                err
            ))));
        } else {
            let _ = tx.send(Ok(handle));
        }
    });

    match rx.recv_timeout(Duration::from_millis(IPC_CONNECT_TIMEOUT_MS)) {
        Ok(result) => result,
        Err(_) => Err(OpenPetsError::Timeout("timed out connecting to OpenPets pipe".to_string())),
    }
}

fn write_pipe(handle: HANDLE, data: &[u8]) -> Result<(), OpenPetsError> {
    let mut bytes_written: u32 = 0;
    let result = unsafe {
        WriteFile(
            handle,
            data.as_ptr() as *const _,
            data.len() as u32,
            &mut bytes_written,
            std::ptr::null_mut(),
        )
    };
    if result == 0 {
        return Err(OpenPetsError::NotRunning(format!(
            "WriteFile failed: {}",
            std::io::Error::last_os_error()
        )));
    }
    Ok(())
}

fn read_pipe(handle: HANDLE) -> Result<String, OpenPetsError> {
    let mut buf = vec![0u8; MAX_PIPE_BUFFER];
    let mut bytes_read: u32 = 0;
    let result = unsafe {
        ReadFile(
            handle,
            buf.as_mut_ptr() as *mut _,
            MAX_PIPE_BUFFER as u32,
            &mut bytes_read,
            std::ptr::null_mut(),
        )
    };
    if result == 0 {
        return Err(OpenPetsError::NotRunning(format!(
            "ReadFile failed: {}",
            std::io::Error::last_os_error()
        )));
    }
    buf.truncate(bytes_read as usize);
    let s = String::from_utf8(buf)
        .map_err(|_| OpenPetsError::InvalidDiscovery("non-UTF8 response from OpenPets".to_string()))?;
    Ok(s)
}

fn send_request(method: &str, params: Option<Value>) -> Result<IpcResponse, OpenPetsError> {
    let discovery = read_discovery()?;
    let handle = connect_pipe(&discovery.endpoint)?;

    let request = IpcRequest {
        id: uuid_v4(),
        version: 1,
        token: discovery.token,
        method: method.to_string(),
        params,
    };

    let request_json = serde_json::to_string(&request).map_err(|e| OpenPetsError::IpcError {
        code: "serialization_error".to_string(),
        message: e.to_string(),
    })?;

    let request_line = format!("{}\n", request_json);
    write_pipe(handle, request_line.as_bytes())?;

    let safe_handle = SafeHandle(handle);
    let (tx, rx) = mpsc::channel::<Result<IpcResponse, OpenPetsError>>();

    std::thread::spawn(move || {
        let result = read_pipe(safe_handle.0).and_then(|response_str| {
            let newline_pos = response_str.find('\n');
            let json_str = match newline_pos {
                Some(pos) => &response_str[..pos],
                None => response_str.trim(),
            };
            serde_json::from_str::<IpcResponse>(json_str).map_err(|e| OpenPetsError::IpcError {
                code: "parse_error".to_string(),
                message: e.to_string(),
            })
        });
        let _ = tx.send(result);
        let _ = unsafe { CloseHandle(safe_handle.0) };
    });

    match rx.recv_timeout(Duration::from_millis(IPC_RESPONSE_TIMEOUT_MS)) {
        Ok(result) => {
            let _ = unsafe { CloseHandle(handle) };
            result
        }
        Err(_) => {
            let _ = unsafe { CloseHandle(handle) };
            Err(OpenPetsError::Timeout("timed out waiting for OpenPets response".to_string()))
        }
    }
    .and_then(|response| {
        if response.ok {
            Ok(response)
        } else {
            let error = response.error.unwrap_or(IpcErrorBody {
                code: "unknown".to_string(),
                message: "OpenPets returned an error".to_string(),
            });
            Err(OpenPetsError::IpcError {
                code: error.code,
                message: error.message,
            })
        }
    })
}

fn uuid_v4() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default();
    let ts: u128 = now.as_nanos();
    let time_low = (ts >> 32) as u32;
    let time_mid = (ts >> 16) as u16;
    let time_hi = ts as u16;
    let clock_seq = ((ts >> 48) as u16 & 0x3FFF) | 0x8000;
    let node = ((ts & 0xFFFF_FFFF_FFFF) as u64) | 0x0100_0000_0000;
    format!(
        "{:08x}-{:04x}-{:04x}-{:04x}-{:012x}",
        time_low, time_mid, time_hi, clock_seq, node
    )
}

pub fn discover() -> OpenPetsStatus {
    match read_discovery() {
        Ok(discovery) => {
            let handle = match connect_pipe(&discovery.endpoint) {
                Ok(h) => h,
                Err(e) => {
                    debug!("OpenPets pipe not available: {}", e);
                    return OpenPetsStatus {
                        available: false,
                        default_pet_id: None,
                        default_pet_name: None,
                        app_version: Some(discovery.app_version),
                    };
                }
            };
            let _ = unsafe { CloseHandle(handle) };
            OpenPetsStatus {
                available: true,
                default_pet_id: None,
                default_pet_name: None,
                app_version: Some(discovery.app_version),
            }
        }
        Err(e) => {
            debug!("OpenPets discovery failed: {}", e);
            OpenPetsStatus {
                available: false,
                default_pet_id: None,
                default_pet_name: None,
                app_version: None,
            }
        }
    }
}

pub fn status() -> OpenPetsStatus {
    match send_request("status", None) {
        Ok(response) => {
            let pet_id = response
                .result
                .as_ref()
                .and_then(|r| r.get("petId").or_else(|| r.get("actualTargetPetId")))
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());
            let pet_name = response
                .result
                .as_ref()
                .and_then(|r| r.get("petName").or_else(|| r.get("actualTargetPetName")))
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());
            let version = response
                .result
                .as_ref()
                .and_then(|r| r.get("appVersion"))
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());
            OpenPetsStatus {
                available: true,
                default_pet_id: pet_id,
                default_pet_name: pet_name,
                app_version: version,
            }
        }
        Err(e) => {
            debug!("OpenPets status failed: {}", e);
            OpenPetsStatus {
                available: false,
                default_pet_id: None,
                default_pet_name: None,
                app_version: None,
            }
        }
    }
}

pub fn list_pets() -> Result<Vec<OpenPetsPetInfo>, OpenPetsError> {
    let response = send_request("pets.list", None)?;
    let data = response.result.ok_or_else(|| OpenPetsError::IpcError {
        code: "no_data".to_string(),
        message: "no result in pets.list response".to_string(),
    })?;

    let pets: Vec<PetListItem> = serde_json::from_value(data).map_err(|e| OpenPetsError::IpcError {
        code: "parse_error".to_string(),
        message: format!("failed to parse pet list: {}", e),
    })?;

    Ok(pets
        .into_iter()
        .map(|p| OpenPetsPetInfo {
            id: p.id,
            display_name: p.display_name,
            built_in: p.built_in || p.built_in_raw.unwrap_or(false),
            broken: p.broken,
        })
        .collect())
}

pub fn say(message: &str, reaction: Option<&str>, pet_id: Option<&str>) -> Result<OpenPetsSayResult, OpenPetsError> {
    let mut params = serde_json::json!({
        "message": message,
    });
    if let Some(r) = reaction {
        params["reaction"] = serde_json::json!(r);
    }
    if let Some(p) = pet_id {
        if !p.is_empty() {
            params["petId"] = serde_json::json!(p);
        }
    }

    let _response = send_request("pet.say", Some(params))?;
    Ok(OpenPetsSayResult { sent: true })
}

pub fn react(reaction: &str, pet_id: Option<&str>) -> Result<OpenPetsSayResult, OpenPetsError> {
    let mut params = serde_json::json!({
        "reaction": reaction,
    });
    if let Some(p) = pet_id {
        if !p.is_empty() {
            params["petId"] = serde_json::json!(p);
        }
    }

    let _response = send_request("pet.react", Some(params))?;
    Ok(OpenPetsSayResult { sent: true })
}
