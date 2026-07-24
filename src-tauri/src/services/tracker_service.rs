use chrono::{DateTime, Utc};
use rusqlite::{params, Connection};
use std::path::Path;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::Duration;
use tracing::{error, info};
use windows_sys::Win32::Foundation::HWND;
use windows_sys::Win32::System::SystemInformation::GetTickCount64;
use windows_sys::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_QUERY_LIMITED_INFORMATION,
};
use windows_sys::Win32::UI::Input::KeyboardAndMouse::{GetLastInputInfo, LASTINPUTINFO};
use windows_sys::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};

use crate::db::init_db;

const SYSTEM_PROCESSES: &[&str] = &[
    "explorer.exe",
    "TextInputHost.exe",
    "ShellExperienceHost.exe",
    "LockApp.exe",
    "SearchApp.exe",
    "RuntimeBroker.exe",
    "ApplicationFrameHost.exe",
    "shellext.exe",
    "Taskmgr.exe",
    "SystemSettings.exe",
    "CompPkgSrv.exe",
    "sihost.exe",
    "StartMenuExperienceHost.exe",
    "SearchIndexer.exe",
    "SecurityHealthSystray.exe",
    "WindowsInternal.ComposableShell.Experiences.TextInput.InputApp.exe",
];

const MINIMUM_DURATION_SECONDS: i64 = 3;

#[derive(Debug, Clone, PartialEq)]
pub struct ActiveWindowInfo {
    pub app_name: String,
    pub window_title: String,
}

#[derive(Debug)]
struct ActiveEntryState {
    id: String,
    app_name: String,
    window_title: String,
    start_time: DateTime<Utc>,
}

pub struct TrackerConfig {
    pub polling_interval_secs: Arc<AtomicU64>,
    pub idle_threshold_secs: Arc<AtomicU64>,
}

impl Default for TrackerConfig {
    fn default() -> Self {
        Self {
            polling_interval_secs: Arc::new(AtomicU64::new(10)),
            idle_threshold_secs: Arc::new(AtomicU64::new(300)),
        }
    }
}

fn is_system_process(app_name: &str) -> bool {
    let lower = app_name.to_lowercase();
    SYSTEM_PROCESSES.iter().any(|&p| lower == p)
}

fn is_transient_window(window_title: &str, app_name: &str) -> bool {
    let lower_title = window_title.to_lowercase();
    let lower_app = app_name.to_lowercase();
    if lower_title.is_empty() || lower_title == "untitled window" || lower_title == "program manager" || lower_title == "start" {
        return true;
    }
    if lower_app == "explorer.exe" && lower_title.contains("desktop") {
        return true;
    }
    false
}

pub fn close_orphaned_entries(conn: &Connection) -> rusqlite::Result<usize> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let affected = conn.execute(
        "UPDATE time_entries SET end_time = ?1, end_reason = 'closed', duration_seconds = CAST((julianday(?1) - julianday(start_time)) * 86400 AS INTEGER) WHERE end_time IS NULL",
        params![now_str],
    )?;
    if affected > 0 {
        info!("Closed {} orphaned time entries on startup", affected);
    }
    Ok(affected)
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

pub fn get_active_window_info(idle_threshold_secs: u64) -> Option<ActiveWindowInfo> {
    if get_user_idle_seconds() >= idle_threshold_secs {
        return None;
    }

    unsafe {
        let hwnd: HWND = GetForegroundWindow();
        if hwnd.is_null() {
            return None;
        }

        let mut process_id: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut process_id);
        if process_id == 0 {
            return None;
        }

        let mut title_buf = [0u16; 512];
        let len = GetWindowTextW(hwnd, title_buf.as_mut_ptr(), title_buf.len() as i32);
        let window_title = if len > 0 {
            String::from_utf16_lossy(&title_buf[..len as usize])
        } else {
            String::from("Untitled Window")
        };

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

        if is_system_process(&app_name) {
            return None;
        }
        if is_transient_window(&window_title, &app_name) {
            return None;
        }

        Some(ActiveWindowInfo {
            app_name,
            window_title,
        })
    }
}

fn insert_gap_entry(conn: &Connection, idle_start: DateTime<Utc>, wake_time: DateTime<Utc>) {
    let gap_id = format!("gap_{}_{}", idle_start.timestamp_millis(), wake_time.timestamp_millis());
    let gap_start = idle_start.to_rfc3339();
    let gap_end = wake_time.to_rfc3339();
    let gap_duration = (wake_time - idle_start).num_seconds();

    if gap_duration < MINIMUM_DURATION_SECONDS {
        return;
    }

    if let Err(e) = conn.execute(
        "INSERT OR IGNORE INTO time_entries (id, app_name, window_title, start_time, end_time, end_reason, duration_seconds, created_at)
         VALUES (?1, 'System (Idle)', 'Laptop sleep / idle gap', ?2, ?3, 'idle', ?4, ?2)",
        params![gap_id, gap_start, gap_end, gap_duration],
    ) {
        error!("Failed to insert sleep gap entry: {}", e);
    } else {
        info!("Recorded sleep/idle gap: {}s from {} to {}", gap_duration, gap_start, gap_end);
    }
}

pub fn start_background_tracker(config: TrackerConfig) {
    info!("Initializing embedded Windows active application tracker thread...");

    let polling_interval = config.polling_interval_secs;
    let idle_threshold = config.idle_threshold_secs;

    thread::spawn(move || {
        let mut current_state: Option<ActiveEntryState> = None;
        let mut idle_start_time: Option<DateTime<Utc>> = None;
        let mut conn_opt: Option<Connection> = None;

        loop {
            if conn_opt.is_none() {
                if let Ok(conn) = init_db() {
                    let _ = close_orphaned_entries(&conn);
                    conn_opt = Some(conn);
                }
            }

            if let Some(ref conn) = conn_opt {
                let now = Utc::now();
                let threshold = idle_threshold.load(Ordering::Relaxed);
                let window_opt = get_active_window_info(threshold);

                match window_opt {
                    None => {
                        if current_state.is_some() {
                            if let Some(state) = current_state.take() {
                                let dur = (now - state.start_time).num_seconds();
                                if dur >= MINIMUM_DURATION_SECONDS {
                                    close_entry(conn, &state, now, "idle");
                                }
                            }
                            idle_start_time = Some(now);
                        } else if idle_start_time.is_none() {
                            idle_start_time = Some(now);
                        }
                    }
                    Some(win_info) => {
                        if let Some(idle_start) = idle_start_time.take() {
                            insert_gap_entry(conn, idle_start, now);
                        }

                        let is_same = match &current_state {
                            Some(state) => {
                                state.app_name == win_info.app_name
                                    && state.window_title == win_info.window_title
                            }
                            None => false,
                        };

                        if is_same {
                            if let Some(ref state) = current_state {
                                extend_entry(conn, state, now);
                            }
                        } else {
                            if let Some(state) = current_state.take() {
                                let dur = (now - state.start_time).num_seconds();
                                if dur >= MINIMUM_DURATION_SECONDS {
                                    close_entry(conn, &state, now, "closed");
                                }
                            }

                            let new_id = format!("time_{}", now.timestamp_millis());
                            if let Ok(_) = create_entry(conn, &new_id, &win_info, now) {
                                current_state = Some(ActiveEntryState {
                                    id: new_id,
                                    app_name: win_info.app_name,
                                    window_title: win_info.window_title,
                                    start_time: now,
                                });
                            }
                        }
                    }
                }
            } else {
                error!("Tracker thread failed to connect to SQLite DB, retrying...");
            }

            let interval = polling_interval.load(Ordering::Relaxed);
            thread::sleep(Duration::from_secs(interval));
        }
    });
}

fn create_entry(
    conn: &Connection,
    id: &str,
    info: &ActiveWindowInfo,
    now: DateTime<Utc>,
) -> rusqlite::Result<()> {
    let now_str = now.to_rfc3339();
    conn.execute(
        "INSERT INTO time_entries (id, app_name, window_title, start_time, end_time, duration_seconds, created_at)
         VALUES (?1, ?2, ?3, ?4, ?4, 0, ?4)",
        params![id, info.app_name, info.window_title, now_str],
    )?;
    Ok(())
}

fn extend_entry(conn: &Connection, state: &ActiveEntryState, now: DateTime<Utc>) {
    let duration = (now - state.start_time).num_seconds();
    let now_str = now.to_rfc3339();
    let _ = conn.execute(
        "UPDATE time_entries SET end_time = ?2, duration_seconds = ?3 WHERE id = ?1",
        params![state.id, now_str, duration],
    );
}

fn close_entry(
    conn: &Connection,
    state: &ActiveEntryState,
    now: DateTime<Utc>,
    end_reason: &str,
) {
    let duration = (now - state.start_time).num_seconds();
    let now_str = now.to_rfc3339();
    let _ = conn.execute(
        "UPDATE time_entries SET end_time = ?2, end_reason = ?3, duration_seconds = ?4 WHERE id = ?1",
        params![state.id, now_str, end_reason, duration],
    );
}
