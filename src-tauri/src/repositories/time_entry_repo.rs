use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TimeEntryDb {
    pub id: String,
    pub app_name: String,
    pub window_title: String,
    pub start_time: String,
    pub end_time: Option<String>,
    pub end_reason: Option<String>,
    pub duration_seconds: Option<i64>,
    pub linked_task_id: Option<String>,
    pub created_at: String,
}

pub fn get_time_entries_by_date(conn: &Connection, date: &str) -> Result<Vec<TimeEntryDb>> {
    let day_start = format!("{}T00:00:00", date);
    let day_end = format!("{}T23:59:59", date);
    let mut stmt = conn.prepare(
        "SELECT id, app_name, window_title, start_time, end_time, end_reason, duration_seconds, linked_task_id, created_at
         FROM time_entries
         WHERE start_time <= ?2
           AND (end_time IS NULL OR end_time >= ?1)
         ORDER BY start_time ASC"
    )?;

    let entries = stmt.query_map(params![day_start, day_end], |row| {
        Ok(TimeEntryDb {
            id: row.get(0)?,
            app_name: row.get(1)?,
            window_title: row.get(2)?,
            start_time: row.get(3)?,
            end_time: row.get(4)?,
            end_reason: row.get(5)?,
            duration_seconds: row.get(6)?,
            linked_task_id: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(entries)
}

pub fn get_time_entries_range(conn: &Connection, start_date: &str, end_date: &str) -> Result<Vec<TimeEntryDb>> {
    let range_start = format!("{}T00:00:00", start_date);
    let range_end = format!("{}T23:59:59", end_date);
    let mut stmt = conn.prepare(
        "SELECT id, app_name, window_title, start_time, end_time, end_reason, duration_seconds, linked_task_id, created_at
         FROM time_entries
         WHERE start_time <= ?2
           AND (end_time IS NULL OR end_time >= ?1)
         ORDER BY start_time ASC"
    )?;

    let entries = stmt.query_map(params![range_start, range_end], |row| {
        Ok(TimeEntryDb {
            id: row.get(0)?,
            app_name: row.get(1)?,
            window_title: row.get(2)?,
            start_time: row.get(3)?,
            end_time: row.get(4)?,
            end_reason: row.get(5)?,
            duration_seconds: row.get(6)?,
            linked_task_id: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(entries)
}

pub fn create_time_entry(conn: &Connection, entry: &TimeEntryDb) -> Result<()> {
    conn.execute(
        "INSERT INTO time_entries (id, app_name, window_title, start_time, end_time, end_reason, duration_seconds, linked_task_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            entry.id,
            entry.app_name,
            entry.window_title,
            entry.start_time,
            entry.end_time,
            entry.end_reason,
            entry.duration_seconds,
            entry.linked_task_id,
            entry.created_at,
        ],
    )?;
    Ok(())
}

pub fn update_time_entry(conn: &Connection, entry: &TimeEntryDb) -> Result<()> {
    conn.execute(
        "UPDATE time_entries 
         SET app_name = ?2, window_title = ?3, start_time = ?4, end_time = ?5, end_reason = ?6, duration_seconds = ?7, linked_task_id = ?8
         WHERE id = ?1",
        params![
            entry.id,
            entry.app_name,
            entry.window_title,
            entry.start_time,
            entry.end_time,
            entry.end_reason,
            entry.duration_seconds,
            entry.linked_task_id,
        ],
    )?;
    Ok(())
}

pub fn link_task_to_time_entry(conn: &Connection, time_entry_id: &str, task_id: Option<&str>) -> Result<()> {
    conn.execute(
        "UPDATE time_entries SET linked_task_id = ?2 WHERE id = ?1",
        params![time_entry_id, task_id],
    )?;
    Ok(())
}
