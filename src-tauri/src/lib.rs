pub mod commands;
pub mod db;
pub mod logging;
pub mod repositories;
pub mod services;

use std::sync::atomic::AtomicU64;
use std::sync::{Arc, Mutex};
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    WebviewUrl, WebviewWindowBuilder, WindowEvent, Manager,
};
use tracing::info;

pub struct TrackerState {
    pub polling_interval_secs: Arc<AtomicU64>,
    pub idle_threshold_secs: Arc<AtomicU64>,
}

pub struct DbState {
    pub conn: Arc<Mutex<rusqlite::Connection>>,
}

/// Create the main window on demand. The window is never created at startup
/// when running with `--autostart` (background mode = Rust core only, ~30 MB
/// instead of a hidden WebView); it is built lazily from the tray "show"
/// handlers and rebuilt after a close-to-tray destroy.
fn create_main_window(app: &tauri::AppHandle) -> tauri::Result<tauri::WebviewWindow> {
    let window = WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
        .title("Shodasha")
        .inner_size(1200.0, 800.0)
        .resizable(true)
        .decorations(false)
        .visible(false)
        .build()?;
    Ok(window)
}

fn show_main_window(app: &tauri::AppHandle) {
    let window = match app.get_webview_window("main") {
        Some(window) => window,
        None => {
            let Ok(window) = create_main_window(app) else {
                return;
            };
            window
        }
    };
    let _ = window.show();
    let _ = window.set_focus();
}

pub fn run() {
    logging::init_logging();
    info!("Starting Shodasha Tauri v2 desktop application...");

    let conn = db::init_db().expect("Failed to initialize database");
    services::seed_service::seed_defaults_if_needed(&conn).ok();
    services::prune_service::prune_old_time_entries(&conn, 6).ok();
    services::tracker_service::close_orphaned_entries(&conn).ok();

    let polling_interval = Arc::new(AtomicU64::new(
        get_setting_default(&conn, "pollingInterval", "10")
            .parse()
            .unwrap_or(10),
    ));
    let idle_threshold = Arc::new(AtomicU64::new(
        get_setting_default(&conn, "idleThreshold", "300")
            .parse()
            .unwrap_or(300),
    ));

    let auto_start_enabled = get_setting_default(&conn, "autoStartEnabled", "true") == "true";
    if auto_start_enabled {
        commands::set_auto_start(true).ok();
    }

    // Share one connection between the main thread and the background tracker
    let shared_conn = Arc::new(Mutex::new(conn));

    let tracker_config = services::tracker_service::TrackerConfig {
        polling_interval_secs: Arc::clone(&polling_interval),
        idle_threshold_secs: Arc::clone(&idle_threshold),
        conn: Arc::clone(&shared_conn),
    };
    services::tracker_service::start_background_tracker(tracker_config);

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .manage(TrackerState {
            polling_interval_secs: polling_interval,
            idle_threshold_secs: idle_threshold,
        })
        .manage(DbState {
            conn: shared_conn,
        })
        .setup(|app| {
            let show_item = MenuItemBuilder::with_id("show", "Show Shodasha").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit Shodasha").build(app)?;

            let tray_menu = MenuBuilder::new(app)
                .items(&[&show_item, &quit_item])
                .build()?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main_window(app),
                    "quit" => {
                        let db = app.state::<DbState>();
                        if let Ok(conn) = db.conn.lock() {
                            services::tracker_service::close_orphaned_entries(&conn).ok();
                        }
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click { button: tauri::tray::MouseButton::Left, .. } = event {
                        show_main_window(tray.app_handle());
                    }
                })
                .build(app)?;

            let is_autostart = std::env::args().any(|arg| arg == "--autostart" || arg == "--minimized");
            if !is_autostart {
                show_main_window(app.handle());
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                // Close-to-tray: destroy the WebView entirely so background RAM
                // drops to the Rust-core footprint; the tray "show" rebuilds it.
                api.prevent_close();
                let _ = window.destroy();

                // Shrink SQLite caches after the UI is gone to minimize
                // background memory footprint.
                let app = window.app_handle();
                let db = app.state::<DbState>();
                if let Ok(conn) = db.conn.lock() {
                    let _ = conn.execute_batch("PRAGMA shrink_memory;");
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_tasks,
            commands::create_task,
            commands::update_task,
            commands::delete_task,
            commands::reorder_task,
            commands::get_habits,
            commands::get_habit_records,
            commands::create_habit,
            commands::update_habit,
            commands::delete_habit,
            commands::toggle_habit_record,
            commands::get_habit_categories,
            commands::create_habit_category,
            commands::update_habit_category,
            commands::delete_habit_category,
            commands::get_time_entries,
            commands::get_time_entry_aggregates,
            commands::link_task_to_time_entry,
            commands::get_app_categories,
            commands::set_app_category,
            commands::get_kanban_columns,
            commands::create_kanban_column,
            commands::update_kanban_column,
            commands::reorder_kanban_columns,
            commands::delete_kanban_column,
            commands::get_settings,
            commands::save_settings,
            commands::clear_database,
            commands::export_time_entries_csv,
            commands::export_habits_csv,
            commands::set_auto_start,
            commands::set_polling_interval,
            commands::set_idle_threshold,
            commands::openpets_discover,
            commands::openpets_say,
            commands::openpets_react,
            commands::openpets_list_pets,
            commands::openpets_install_pet,
            commands::openpets_run_command,
            commands::openpets_fetch_catalog,
            commands::openpets_list_installed,
            commands::get_idle_seconds,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_setting_default(conn: &rusqlite::Connection, key: &str, default: &str) -> String {
    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        rusqlite::params![key],
        |row| row.get::<_, String>(0),
    )
    .unwrap_or_else(|_| default.to_string())
}
