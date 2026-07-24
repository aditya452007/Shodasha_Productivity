use windows_sys::Win32::Foundation::HWND;
use windows_sys::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_QUERY_LIMITED_INFORMATION,
};
use windows_sys::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};
use windows_sys::Win32::UI::Input::KeyboardAndMouse::{GetLastInputInfo, LASTINPUTINFO};
use windows_sys::Win32::System::SystemInformation::GetTickCount64;
use std::path::Path;

#[derive(Debug, Clone, PartialEq)]
pub struct ActiveWindowInfo {
    pub app_name: String,
    pub window_title: String,
}

pub fn get_user_idle_seconds() -> u64 {
    unsafe {
        let mut lii = LASTINPUTINFO {
            cbSize: std::mem::size_of::<LASTINPUTINFO>() as u32,
            dwTime: 0,
        };
        if GetLastInputInfo(&mut lii) != 0 {
            let uptime = GetTickCount64();
            let last_input = lii.dwTime as u64;
            let now_ms = uptime & 0xFFFF_FFFF;
            let idle_ms = if now_ms >= last_input {
                now_ms - last_input
            } else {
                (0xFFFF_FFFF - last_input) + now_ms
            };
            idle_ms / 1000
        } else {
            0
        }
    }
}

pub fn get_active_window_info() -> Option<ActiveWindowInfo> {
    // If user has been physically idle (no mouse/keyboard) for > 5 minutes (300s), treat as idle
    if get_user_idle_seconds() >= 300 {
        return None;
    }

    unsafe {
        let hwnd: HWND = GetForegroundWindow();
        if hwnd.is_null() {
            return None; // Lock screen / Sleep / Screensaver
        }

        // Get process ID
        let mut process_id: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut process_id);
        if process_id == 0 {
            return None;
        }

        // Get window title
        let mut title_buf = [0u16; 512];
        let len = GetWindowTextW(hwnd, title_buf.as_mut_ptr(), title_buf.len() as i32);
        let window_title = if len > 0 {
            String::from_utf16_lossy(&title_buf[..len as usize])
        } else {
            String::from("Untitled Window")
        };

        // Get process name securely with PROCESS_QUERY_LIMITED_INFORMATION
        let h_process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, process_id);
        let app_name = if !h_process.is_null() {
            let mut img_buf = [0u16; 1024];
            let mut size: u32 = img_buf.len() as u32;
            let res = QueryFullProcessImageNameW(h_process, 0, img_buf.as_mut_ptr(), &mut size);
            windows_sys::Win32::Foundation::CloseHandle(h_process);

            if res != 0 && size > 0 {
                let full_path = String::from_utf16_lossy(&img_buf[..size as usize]);
                Path::new(&full_path)
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("Unknown")
                    .to_string()
            } else {
                "Unknown".to_string()
            }
        } else {
            "Unknown".to_string()
        };

        Some(ActiveWindowInfo {
            app_name,
            window_title,
        })
    }
}
