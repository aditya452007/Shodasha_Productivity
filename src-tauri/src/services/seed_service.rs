use rusqlite::{Connection, Result};
use crate::repositories::kanban_repo::{KanbanColumnDb, create_kanban_column, get_kanban_columns};
use tracing::info;

pub fn seed_defaults_if_needed(conn: &Connection) -> Result<()> {
    let existing_columns = get_kanban_columns(conn)?;
    if existing_columns.is_empty() {
        info!("Seeding default kanban columns (To Do, In Progress, Done)...");
        let default_cols = vec![
            KanbanColumnDb {
                id: "todo".to_string(),
                name: "To Do".to_string(),
                sort_order: 0.0,
            },
            KanbanColumnDb {
                id: "in_progress".to_string(),
                name: "In Progress".to_string(),
                sort_order: 1.0,
            },
            KanbanColumnDb {
                id: "done".to_string(),
                name: "Done".to_string(),
                sort_order: 2.0,
            },
        ];

        for col in default_cols {
            create_kanban_column(conn, &col)?;
        }
    }
    Ok(())
}
