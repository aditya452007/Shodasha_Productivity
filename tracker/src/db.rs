use rusqlite::{Connection, Result};
use std::path::PathBuf;

pub fn get_db_connection() -> Result<Connection> {
    let mut db_path = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    db_path.push("Shodasha");
    db_path.push("data.db");

    let conn = Connection::open(db_path)?;
    conn.execute_batch(
        "PRAGMA journal_mode=WAL;
         PRAGMA busy_timeout=5000;
         PRAGMA foreign_keys=ON;",
    )?;

    Ok(conn)
}
