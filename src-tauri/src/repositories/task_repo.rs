use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TaskDb {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub sort_order: f64,
    pub due_date: Option<String>,
    pub tags: Option<String>, // JSON string array
    pub linked_habit_id: Option<String>,
    pub url: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

pub fn get_all_tasks(conn: &Connection) -> Result<Vec<TaskDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, title, description, status, sort_order, due_date, tags, linked_habit_id, url, created_at, updated_at 
         FROM tasks ORDER BY sort_order ASC, created_at DESC"
    )?;

    let tasks = stmt.query_map([], |row| {
        Ok(TaskDb {
            id: row.get(0)?,
            title: row.get(1)?,
            description: row.get(2)?,
            status: row.get(3)?,
            sort_order: row.get(4)?,
            due_date: row.get(5)?,
            tags: row.get(6)?,
            linked_habit_id: row.get(7)?,
            url: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(tasks)
}

pub fn create_task(conn: &Connection, task: &TaskDb) -> Result<()> {
    conn.execute(
        "INSERT INTO tasks (id, title, description, status, sort_order, due_date, tags, linked_habit_id, url, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            task.id,
            task.title,
            task.description,
            task.status,
            task.sort_order,
            task.due_date,
            task.tags,
            task.linked_habit_id,
            task.url,
            task.created_at,
            task.updated_at,
        ],
    )?;
    Ok(())
}

pub fn update_task(conn: &Connection, task: &TaskDb) -> Result<()> {
    conn.execute(
        "UPDATE tasks 
         SET title = ?2, description = ?3, status = ?4, sort_order = ?5, due_date = ?6, tags = ?7, linked_habit_id = ?8, url = ?9, updated_at = ?10
         WHERE id = ?1",
        params![
            task.id,
            task.title,
            task.description,
            task.status,
            task.sort_order,
            task.due_date,
            task.tags,
            task.linked_habit_id,
            task.url,
            task.updated_at,
        ],
    )?;
    Ok(())
}

pub fn delete_task(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM tasks WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn reorder_task(conn: &Connection, id: &str, status: &str, sort_order: f64, updated_at: &str) -> Result<()> {
    conn.execute(
        "UPDATE tasks SET status = ?2, sort_order = ?3, updated_at = ?4 WHERE id = ?1",
        params![id, status, sort_order, updated_at],
    )?;
    Ok(())
}
