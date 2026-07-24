use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HabitDb {
    pub id: String,
    pub name: String,
    pub color: String,
    pub linked_task_id: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HabitRecordDb {
    pub id: String,
    pub habit_id: String,
    pub date: String,
    pub done: bool,
}

pub fn get_habits(conn: &Connection) -> Result<Vec<HabitDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, color, linked_task_id, created_at FROM habits ORDER BY created_at ASC"
    )?;

    let habits = stmt.query_map([], |row| {
        Ok(HabitDb {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            linked_task_id: row.get(3)?,
            created_at: row.get(4)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(habits)
}

pub fn get_habit_records(conn: &Connection) -> Result<Vec<HabitRecordDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, habit_id, date, done FROM habit_records"
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
        "INSERT INTO habits (id, name, color, linked_task_id, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![habit.id, habit.name, habit.color, habit.linked_task_id, habit.created_at],
    )?;
    Ok(())
}

pub fn delete_habit(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM habits WHERE id = ?1", params![id])?;
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
