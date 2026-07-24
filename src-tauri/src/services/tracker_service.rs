use chrono::{DateTime, Utc};
use rusqlite::{params, Connection};
use std::path::Path;
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

pub fn start_background_tracker() {
    info!("Initializing embedded Windows active application tracker thread...");

    thread::spawn(|| {
        let mut current_state: Option<ActiveEntryState> = None;
        let mut conn_opt: Option<Connection> = None;

        loop {
            if conn_opt.is_none() {
                conn_opt = init_db().ok();
            }

            if let Some(ref conn) = conn_opt {
                let now = Utc::now();
                let window_opt = get_active_window_info();

                match window_opt {
                    None => {
                        // User is idle or screen is locked
                        if let Some(state) = current_state.take() {
                            close_entry(conn, &state, now, "idle");
                        }
                    }
                    Some(win_info) => {
                        let is_same = match &current_state {
                            Some(state) => {
                                state.app_name == win_info.app_name
                                    && state.window_title == win_info.window_title
                            }
                            None => false,
                        };

                        if is_same {
                            // Update current active window duration
                            if let Some(ref state) = current_state {
                                extend_entry(conn, state, now);
                            }
                        } else {
                            // Close previous time entry
                            if let Some(state) = current_state.take() {
                                close_entry(conn, &state, now, "closed");
                            }

                            // Create new active time entry
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

            thread::sleep(Duration::from_secs(10));
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
