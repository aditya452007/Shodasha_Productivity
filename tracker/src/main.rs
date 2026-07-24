#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod poller;

use chrono::{DateTime, Utc};
use poller::{get_active_window_info, ActiveWindowInfo};
use rusqlite::{params, Connection};
use std::thread;
use std::time::Duration;
use tracing::{info, error};
use tracing_subscriber::{fmt, EnvFilter};

#[derive(Debug)]
struct ActiveEntryState {
    id: String,
    app_name: String,
    window_title: String,
    start_time: DateTime<Utc>,
}

fn main() {
    init_logging();
    info!("Starting Shodasha background activity poller...");

    let mut current_state: Option<ActiveEntryState> = None;
    let mut conn_opt: Option<Connection> = None;

    loop {
        if conn_opt.is_none() {
            conn_opt = db::get_db_connection().ok();
        }

        if let Some(ref conn) = conn_opt {
            let now = Utc::now();
            let window_opt = get_active_window_info();

            match window_opt {
                None => {
                    // Lock screen, sleep, or user idle > 5 mins
                    if let Some(state) = current_state.take() {
                        close_entry(conn, &state, now, "idle");
                    }
                }
                Some(win_info) => {
                    let is_same = match &current_state {
                        Some(state) => state.app_name == win_info.app_name && state.window_title == win_info.window_title,
                        None => false,
                    };

                    if is_same {
                        // Extend existing time entry duration
                        if let Some(ref state) = current_state {
                            extend_entry(conn, state, now);
                        }
                    } else {
                        // Close previous active entry if any
                        if let Some(state) = current_state.take() {
                            close_entry(conn, &state, now, "closed");
                        }

                        // Start new time entry
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
            error!("Tracker failed to connect to SQLite database");
        }

        thread::sleep(Duration::from_secs(15));
    }
}

fn create_entry(conn: &Connection, id: &str, info: &ActiveWindowInfo, now: DateTime<Utc>) -> rusqlite::Result<()> {
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

fn close_entry(conn: &Connection, state: &ActiveEntryState, now: DateTime<Utc>, end_reason: &str) {
    let duration = (now - state.start_time).num_seconds();
    let now_str = now.to_rfc3339();
    let _ = conn.execute(
        "UPDATE time_entries SET end_time = ?2, end_reason = ?3, duration_seconds = ?4 WHERE id = ?1",
        params![state.id, now_str, end_reason, duration],
    );
}

fn init_logging() {
    let mut log_dir = dirs::data_dir().unwrap_or_else(|| std::path::PathBuf::from("."));
    log_dir.push("Shodasha");
    log_dir.push("logs");
    std::fs::create_dir_all(&log_dir).ok();

    let log_file = log_dir.join("tracker.log");

    if let Ok(file) = std::fs::OpenOptions::new().create(true).append(true).open(log_file) {
        let subscriber = fmt::Subscriber::builder()
            .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
            .with_writer(std::sync::Arc::new(file))
            .with_ansi(false)
            .finish();
        
        let _ = tracing::subscriber::set_global_default(subscriber);
    }
}
