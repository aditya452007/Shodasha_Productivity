use rusqlite::{Connection, Result};
use crate::repositories::time_entry_repo::get_time_entries_range;
use crate::repositories::habit_repo::{get_habits, get_habit_records};

pub fn export_time_entries_csv(conn: &Connection, start_date: &str, end_date: &str) -> Result<String> {
    let entries = get_time_entries_range(conn, start_date, end_date)?;
    let mut csv = String::from("id,app_name,window_title,start_time,end_time,end_reason,duration_seconds,linked_task_id\n");

    for e in entries {
        csv.push_str(&format!(
            "\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\",\"{}\"\n",
            e.id,
            e.app_name.replace('"', "\"\""),
            e.window_title.replace('"', "\"\""),
            e.start_time,
            e.end_time.unwrap_or_default(),
            e.end_reason.unwrap_or_default(),
            e.duration_seconds.map(|d| d.to_string()).unwrap_or_default(),
            e.linked_task_id.unwrap_or_default()
        ));
    }

    Ok(csv)
}

pub fn export_habits_csv(conn: &Connection) -> Result<String> {
    let habits = get_habits(conn)?;
    let records = get_habit_records(conn)?;
    let mut csv = String::from("habit_id,habit_name,color,date,done\n");

    let habit_map: std::collections::HashMap<_, _> = habits.into_iter().map(|h| (h.id.clone(), h)).collect();

    for r in records {
        if let Some(h) = habit_map.get(&r.habit_id) {
            csv.push_str(&format!(
                "\"{}\",\"{}\",\"{}\",\"{}\",\"{}\"\n",
                r.habit_id,
                h.name.replace('"', "\"\""),
                h.color,
                r.date,
                if r.done { "true" } else { "false" }
            ));
        }
    }

    Ok(csv)
}
