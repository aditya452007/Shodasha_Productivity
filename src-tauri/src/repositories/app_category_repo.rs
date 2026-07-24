use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppCategoryDb {
    pub id: String,
    pub app_name: String,
    pub category: String,
    pub created_at: String,
}

pub fn get_app_categories(conn: &Connection) -> Result<Vec<AppCategoryDb>> {
    let mut stmt = conn.prepare(
        "SELECT id, app_name, category, created_at FROM app_categories ORDER BY app_name ASC"
    )?;

    let categories = stmt.query_map([], |row| {
        Ok(AppCategoryDb {
            id: row.get(0)?,
            app_name: row.get(1)?,
            category: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(categories)
}

pub fn set_app_category(conn: &Connection, app_name: &str, category: &str) -> Result<()> {
    let id = format!("cat_{}", app_name.to_lowercase().replace(".exe", ""));
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO app_categories (id, app_name, category, created_at)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(app_name) DO UPDATE SET category = ?3",
        params![id, app_name, category, now],
    )?;
    Ok(())
}
