pub mod commands;
pub mod db;
pub mod logging;
pub mod repositories;
pub mod services;

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::TrayIconBuilder,
    WindowEvent, Manager,
};
use tracing::{info, error};

pub fn run() {
    logging::init_logging();
    info!("Starting Shodasha Tauri v2 desktop application...");

    // Initialize database & run migrations + seeding
    if let Ok(conn) = db::init_db() {
        if let Err(e) = services::seed_service::seed_defaults_if_needed(&conn) {
            error!("Failed to seed defaults: {}", e);
        }
        if let Err(e) = services::prune_service::prune_old_time_entries(&conn, 6) {
            error!("Failed to prune old entries: {}", e);
        }
    } else {
        error!("Failed to initialize database on startup");
    }

    // Start native Windows background active window & application time tracker
    services::tracker_service::start_background_tracker();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Build system tray menu
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
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                // Intercept close button: hide to tray instead of quitting
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
            commands::set_auto_start
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
