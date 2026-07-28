use crate::db::init_db;
use crate::repositories::task_repo::{self, TaskDb};
use crate::repositories::habit_repo::{self, HabitDb, HabitRecordDb};
use crate::repositories::time_entry_repo::{self, TimeEntryDb};
use crate::repositories::app_category_repo::{self, AppCategoryDb};
use crate::repositories::kanban_repo::{self, KanbanColumnDb};
use crate::repositories::settings_repo;
use crate::services::export_service;
use crate::services::openpets_client::{self, OpenPetsStatus, OpenPetsPetInfo, OpenPetsSayResult};
use crate::services::pet_store;
use crate::services::tracker_service;
use crate::TrackerState;
use std::collections::HashMap;
use tauri::command;
use windows_sys::Win32::System::Registry::{
    RegCloseKey, RegCreateKeyW, RegDeleteValueW, RegSetValueExW, HKEY, HKEY_CURRENT_USER, REG_SZ,
};

#[command]
pub fn get_tasks() -> Result<Vec<TaskDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    task_repo::get_all_tasks(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn create_task(task: TaskDb) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    task_repo::create_task(&conn, &task).map_err(|e| e.to_string())
}

#[command]
pub fn update_task(task: TaskDb) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    task_repo::update_task(&conn, &task).map_err(|e| e.to_string())
}

#[command]
pub fn delete_task(id: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    task_repo::delete_task(&conn, &id).map_err(|e| e.to_string())
}

#[command]
pub fn reorder_task(id: String, status: String, sort_order: f64) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let updated_at = chrono::Utc::now().to_rfc3339();
    task_repo::reorder_task(&conn, &id, &status, sort_order, &updated_at).map_err(|e| e.to_string())
}

#[command]
pub fn get_habits() -> Result<Vec<HabitDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    habit_repo::get_habits(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn get_habit_records() -> Result<Vec<HabitRecordDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    habit_repo::get_habit_records(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn create_habit(habit: HabitDb) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    habit_repo::create_habit(&conn, &habit).map_err(|e| e.to_string())
}

#[command]
pub fn update_habit(habit: HabitDb) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    habit_repo::update_habit(&conn, &habit).map_err(|e| e.to_string())
}

#[command]
pub fn delete_habit(id: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    habit_repo::delete_habit(&conn, &id).map_err(|e| e.to_string())
}

#[command]
pub fn toggle_habit_record(id: String, habit_id: String, date: String, done: bool) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    habit_repo::toggle_habit_record(&conn, &id, &habit_id, &date, done).map_err(|e| e.to_string())
}

#[command]
pub fn get_time_entries(date: String) -> Result<Vec<TimeEntryDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    time_entry_repo::get_time_entries_by_date(&conn, &date).map_err(|e| e.to_string())
}

#[command]
pub fn get_time_entries_range(start_date: String, end_date: String) -> Result<Vec<TimeEntryDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    time_entry_repo::get_time_entries_range(&conn, &start_date, &end_date).map_err(|e| e.to_string())
}

#[command]
pub fn link_task_to_time_entry(time_entry_id: String, task_id: Option<String>) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    time_entry_repo::link_task_to_time_entry(&conn, &time_entry_id, task_id.as_deref()).map_err(|e| e.to_string())
}

#[command]
pub fn get_app_categories() -> Result<Vec<AppCategoryDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    app_category_repo::get_app_categories(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn set_app_category(app_name: String, category: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    app_category_repo::set_app_category(&conn, &app_name, &category).map_err(|e| e.to_string())
}

#[command]
pub fn get_kanban_columns() -> Result<Vec<KanbanColumnDb>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    kanban_repo::get_kanban_columns(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn create_kanban_column(col: KanbanColumnDb) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    kanban_repo::create_kanban_column(&conn, &col).map_err(|e| e.to_string())
}

#[command]
pub fn update_kanban_column(col: KanbanColumnDb) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    kanban_repo::create_kanban_column(&conn, &col).map_err(|e| e.to_string())
}

#[command]
pub fn reorder_kanban_columns(cols: Vec<KanbanColumnDb>) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    kanban_repo::reorder_kanban_columns(&conn, &cols).map_err(|e| e.to_string())
}

#[command]
pub fn delete_kanban_column(id: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    kanban_repo::delete_kanban_column(&conn, &id).map_err(|e| e.to_string())
}

#[command]
pub fn get_settings() -> Result<HashMap<String, String>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    settings_repo::get_settings(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn save_settings(settings: HashMap<String, String>) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    settings_repo::save_settings(&conn, &settings).map_err(|e| e.to_string())
}

#[command]
pub fn clear_database() -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute_batch(
        "DELETE FROM tasks;
         DELETE FROM habit_records;
         DELETE FROM habits;
         DELETE FROM time_entries;
         DELETE FROM kanban_columns;
         DELETE FROM app_categories;
         DELETE FROM settings;"
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn export_time_entries_csv(start_date: String, end_date: String) -> Result<String, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    export_service::export_time_entries_csv(&conn, &start_date, &end_date).map_err(|e| e.to_string())
}

#[command]
pub fn export_habits_csv() -> Result<String, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    export_service::export_habits_csv(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn set_auto_start(enable: bool) -> Result<(), String> {
    let subkey: Vec<u16> = "Software\\Microsoft\\Windows\\CurrentVersion\\Run\0".encode_utf16().collect();
    let val_name: Vec<u16> = "ShodashaTracker\0".encode_utf16().collect();

    let mut hkey: HKEY = std::ptr::null_mut();
    unsafe {
        let status = RegCreateKeyW(
            HKEY_CURRENT_USER,
            subkey.as_ptr(),
            &mut hkey,
        );

        if status != 0 {
            return Err("Failed to open HKCU Run registry key".to_string());
        }

        if enable {
            let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;
            let exe_str = format!("\"{}\" --autostart\0", exe_path.to_string_lossy());
            let exe_utf16: Vec<u16> = exe_str.encode_utf16().collect();

            let res = RegSetValueExW(
                hkey,
                val_name.as_ptr(),
                0,
                REG_SZ,
                exe_utf16.as_ptr() as *const _,
                (exe_utf16.len() * 2) as u32,
            );
            RegCloseKey(hkey);
            if res != 0 {
                return Err("Failed to set registry auto-start value".to_string());
            }
        } else {
            RegDeleteValueW(hkey, val_name.as_ptr());
            RegCloseKey(hkey);
        }
    }

    Ok(())
}

#[command]
pub fn set_polling_interval(state: tauri::State<'_, TrackerState>, interval_secs: u64) -> Result<(), String> {
    let clamped = interval_secs.clamp(5, 60);
    state.polling_interval_secs.store(clamped, std::sync::atomic::Ordering::Relaxed);
    let conn = init_db().map_err(|e| e.to_string())?;
    settings_repo::save_setting(&conn, "pollingInterval", &clamped.to_string()).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn set_idle_threshold(state: tauri::State<'_, TrackerState>, threshold_secs: u64) -> Result<(), String> {
    let clamped = threshold_secs.clamp(60, 900);
    state.idle_threshold_secs.store(clamped, std::sync::atomic::Ordering::Relaxed);
    let conn = init_db().map_err(|e| e.to_string())?;
    settings_repo::save_setting(&conn, "idleThreshold", &clamped.to_string()).map_err(|e| e.to_string())?;
    Ok(())
}

// ── OpenPets Desktop Pet Commands ──────────────────────────────────────

#[command]
pub fn openpets_discover() -> OpenPetsStatus {
    openpets_client::discover()
}

#[command]
pub fn openpets_say(message: String, reaction: Option<String>, pet_id: Option<String>) -> Result<OpenPetsSayResult, String> {
    openpets_client::say(&message, reaction.as_deref(), pet_id.as_deref()).map_err(|e| e.to_string())
}

#[command]
pub fn openpets_react(reaction: String, pet_id: Option<String>) -> Result<OpenPetsSayResult, String> {
    openpets_client::react(&reaction, pet_id.as_deref()).map_err(|e| e.to_string())
}

#[command]
pub fn openpets_list_pets() -> Result<Vec<OpenPetsPetInfo>, String> {
    openpets_client::list_pets().map_err(|e| e.to_string())
}

/// Install a pet by downloading directly from the OpenPets catalog (no npx needed)
#[command]
pub fn openpets_install_pet(pet_id: String) -> Result<String, String> {
    let catalog = pet_store::fetch_catalog()?;
    let entry = pet_store::find_in_catalog(&catalog, &pet_id)
        .ok_or_else(|| format!("Pet '{}' not found in catalog", pet_id))?;

    let meta = pet_store::download_and_extract(&entry)?;

    // Also try to copy to OpenPets directory for compatibility
    let openpets_dir = pet_store::openpets_pets_dir().join(&meta.id);
    if !openpets_dir.exists() {
        if std::fs::create_dir_all(&openpets_dir).is_ok() {
            let pet_folder = std::path::Path::new(&meta.spritesheet_path).parent()
                .unwrap_or(std::path::Path::new("."));
            if let Ok(read_dir) = std::fs::read_dir(pet_folder) {
                for file_entry in read_dir {
                    if let Ok(fe) = file_entry {
                        let fname = fe.file_name();
                        let dst = openpets_dir.join(&fname);
                        let _ = std::fs::copy(&fe.path(), &dst);
                    }
                }
            }
        }
    }

    Ok(format!("{} installed successfully", meta.display_name))
}

/// Fetch the pet catalog (returns list of available pets)
#[command]
pub fn openpets_fetch_catalog() -> Result<Vec<pet_store::CatalogEntry>, String> {
    pet_store::fetch_catalog()
}

/// List locally-installed pets (from Shodasha's own store)
#[command]
pub fn openpets_list_installed() -> Result<Vec<pet_store::PetMeta>, String> {
    pet_store::list_installed()
}

/// Run a shell command (for the command-input section)
#[command]
pub fn openpets_run_command(command: String) -> Result<String, String> {
    let output = std::process::Command::new("cmd")
        .args(["/C", &command])
        .output()
        .map_err(|e| format!("Failed to run command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let combined = format!("{}{}", stdout.trim(), stderr.trim());

    if output.status.success() {
        Ok(combined)
    } else {
        Err(if combined.is_empty() { "Command failed with no output".to_string() } else { combined })
    }
}

/// Query the current system idle time in seconds (since last user input)
#[command]
pub fn get_idle_seconds() -> u64 {
    tracker_service::get_user_idle_seconds()
}
