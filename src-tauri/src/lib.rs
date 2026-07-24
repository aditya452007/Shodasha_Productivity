pub mod commands;
pub mod db;
pub mod logging;
pub mod repositories;
pub mod services;

use std::sync::atomic::AtomicU64;
use std::sync::Arc;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    WindowEvent, Manager,
};
use tracing::info;

pub struct TrackerState {
    pub polling_interval_secs: Arc<AtomicU64>,
    pub idle_threshold_secs: Arc<AtomicU64>,
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

    let tracker_config = services::tracker_service::TrackerConfig {
        polling_interval_secs: Arc::clone(&polling_interval),
        idle_threshold_secs: Arc::clone(&idle_threshold),
    };
    services::tracker_service::start_background_tracker(tracker_config);

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(TrackerState {
            polling_interval_secs: polling_interval,
            idle_threshold_secs: idle_threshold,
        })
        .setup(|app| {
            let show_item = MenuItemBuilder::with_id("show", "Show Shodasha").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit Shodasha").build(app)?;

            let tray_menu = MenuBuilder::new(app)
                .items(&[&show_item, &quit_item])
                .build()?;

            let _tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        let conn = db::init_db();
                        if let Ok(c) = conn {
                            services::tracker_service::close_orphaned_entries(&c).ok();
                        }
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
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
            commands::get_time_entries,
            commands::get_time_entries_range,
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
