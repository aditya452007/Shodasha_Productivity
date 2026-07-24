use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KanbanColumnDb {
    pub id: String,
    pub name: String,
    pub sort_order: f64,
}

pub fn get_kanban_columns(conn: &Connection) -> Result<Vec<KanbanColumnDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, sort_order FROM kanban_columns ORDER BY sort_order ASC"
    )?;

    let columns = stmt.query_map([], |row| {
        Ok(KanbanColumnDb {
            id: row.get(0)?,
            name: row.get(1)?,
            sort_order: row.get(2)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(columns)
}

pub fn create_kanban_column(conn: &Connection, col: &KanbanColumnDb) -> Result<()> {
    conn.execute(
        "INSERT INTO kanban_columns (id, name, sort_order) VALUES (?1, ?2, ?3)
         ON CONFLICT(id) DO UPDATE SET name = ?2, sort_order = ?3",
        params![col.id, col.name, col.sort_order],
    )?;
    Ok(())
}

pub fn delete_kanban_column(conn: &Connection, id: &str) -> Result<()> {
    conn.execute("DELETE FROM kanban_columns WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn reorder_kanban_columns(conn: &Connection, cols: &[KanbanColumnDb]) -> Result<()> {
    for col in cols {
        create_kanban_column(conn, col)?;
    }
    Ok(())
}
