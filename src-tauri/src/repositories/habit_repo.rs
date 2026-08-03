use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HabitDb {
    pub id: String,
    pub name: String,
    pub color: String,
    pub linked_task_id: Option<String>,
    pub url: Option<String>,
    pub priority: String,
    pub category: String,
    pub reminder_time: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HabitRecordDb {
    pub id: String,
    pub habit_id: String,
    pub date: String,
    pub done: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HabitCategoryDb {
    pub id: String,
    pub name: String,
    pub color: String,
    pub created_at: String,
}

pub fn get_habits(conn: &Connection) -> Result<Vec<HabitDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, color, linked_task_id, url, priority, category, reminder_time, created_at FROM habits \
         ORDER BY CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, created_at ASC"
    )?;

    let habits = stmt.query_map([], |row| {
        Ok(HabitDb {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            linked_task_id: row.get(3)?,
            url: row.get(4)?,
            priority: row.get(5)?,
            category: row.get(6)?,
            reminder_time: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(habits)
}

pub fn get_habit_records(conn: &Connection) -> Result<Vec<HabitRecordDb>> {
    // Bound to a trailing year — streak/HP/calendar math never needs older
    // history, and it keeps the fetch O(recent records) instead of O(all).
    let mut stmt = conn.prepare(
        "SELECT id, habit_id, date, done FROM habit_records WHERE date >= date('now', '-366 days')"
    )?;

    let records = stmt.query_map([], |row| {
        let done_int: i32 = row.get(3)?;
        Ok(HabitRecordDb {
            id: row.get(0)?,
            habit_id: row.get(1)?,
            date: row.get(2)?,
            done: done_int != 0,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(records)
}

pub fn create_habit(conn: &Connection, habit: &HabitDb) -> Result<()> {
    conn.execute(
        "INSERT INTO habits (id, name, color, linked_task_id, url, priority, category, reminder_time, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![habit.id, habit.name, habit.color, habit.linked_task_id, habit.url, habit.priority, habit.category, habit.reminder_time, habit.created_at],
    )?;
    Ok(())
}

pub fn update_habit(conn: &Connection, habit: &HabitDb) -> Result<()> {
    conn.execute(
        "UPDATE habits SET name = ?2, color = ?3, linked_task_id = ?4, url = ?5, priority = ?6, category = ?7, reminder_time = ?8 WHERE id = ?1",
        params![habit.id, habit.name, habit.color, habit.linked_task_id, habit.url, habit.priority, habit.category, habit.reminder_time],
    )?;
    Ok(())
}

pub fn delete_habit(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM habits WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn get_habit_categories(conn: &Connection) -> Result<Vec<HabitCategoryDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, color, created_at FROM habit_categories ORDER BY created_at ASC"
    )?;

    let categories = stmt.query_map([], |row| {
        Ok(HabitCategoryDb {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(categories)
}

pub fn create_habit_category(conn: &Connection, category: &HabitCategoryDb) -> Result<()> {
    conn.execute(
        "INSERT INTO habit_categories (id, name, color, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![category.id, category.name, category.color, category.created_at],
    )?;
    Ok(())
}

pub fn update_habit_category(conn: &Connection, category: &HabitCategoryDb) -> Result<()> {
    conn.execute(
        "UPDATE habit_categories SET name = ?2, color = ?3 WHERE id = ?1",
        params![category.id, category.name, category.color],
    )?;
    Ok(())
}

pub fn delete_habit_category(conn: &Connection, id: &str) -> Result<()> {
    let tx = conn.unchecked_transaction()?;
    tx.execute(
        "UPDATE habits SET category = 'general' WHERE category = ?1",
        params![id],
    )?;
    tx.execute("DELETE FROM habit_categories WHERE id = ?1", params![id])?;
    tx.commit()?;
    Ok(())
}

pub fn toggle_habit_record(conn: &Connection, id: &str, habit_id: &str, date: &str, done: bool) -> Result<()> {
    if done {
        conn.execute(
            "INSERT INTO habit_records (id, habit_id, date, done) 
             VALUES (?1, ?2, ?3, 1)
             ON CONFLICT(habit_id, date) DO UPDATE SET done = 1",
            params![id, habit_id, date],
        )?;
    } else {
        conn.execute(
            "DELETE FROM habit_records WHERE habit_id = ?1 AND date = ?2",
            params![habit_id, date],
        )?;
    }
    Ok(())
}
