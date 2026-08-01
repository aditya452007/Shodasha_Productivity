use rusqlite::{Connection, Result};
use std::fs;
use std::path::PathBuf;
use tracing::info;

pub fn get_db_path() -> PathBuf {
    let mut path = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("Shodasha");
    fs::create_dir_all(&path).ok();
    path.push("data.db");
    path
}

pub fn init_db() -> Result<Connection> {
    let db_path = get_db_path();
    info!("Initializing SQLite database at: {:?}", db_path);
    let conn = Connection::open(db_path)?;

    // Enable WAL mode & busy timeout for safe concurrent reads/writes
    conn.execute_batch(
        "PRAGMA journal_mode=WAL;
         PRAGMA busy_timeout=5000;
         PRAGMA foreign_keys=ON;",
    )?;

    run_migrations(&conn)?;

    Ok(conn)
}

fn run_migrations(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_version (
            version INTEGER NOT NULL,
            applied_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'todo',
            sort_order REAL NOT NULL DEFAULT 0,
            due_date TEXT,
            tags TEXT,
            linked_habit_id TEXT,
            url TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS habits (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT NOT NULL DEFAULT '#059669',
            linked_task_id TEXT,
            url TEXT,
            priority TEXT NOT NULL DEFAULT 'medium',
            category TEXT NOT NULL DEFAULT 'general',
            reminder_time TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS habit_categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color TEXT NOT NULL DEFAULT '#059669',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS habit_records (
            id TEXT PRIMARY KEY,
            habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
            date TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0,
            UNIQUE(habit_id, date)
        );

        CREATE TABLE IF NOT EXISTS time_entries (
            id TEXT PRIMARY KEY,
            app_name TEXT NOT NULL,
            window_title TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT,
            end_reason TEXT,
            duration_seconds INTEGER,
            linked_task_id TEXT,
            created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(start_time);
        CREATE INDEX IF NOT EXISTS idx_time_entries_task ON time_entries(linked_task_id);

        CREATE TABLE IF NOT EXISTS kanban_columns (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sort_order REAL NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS app_categories (
            id TEXT PRIMARY KEY,
            app_name TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );"
    )?;

    // Safe migrations: add columns if missing
    conn.execute("ALTER TABLE tasks ADD COLUMN url TEXT", []).ok();
    conn.execute("ALTER TABLE habits ADD COLUMN url TEXT", []).ok();
    conn.execute("ALTER TABLE habits ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium'", []).ok();
    conn.execute("ALTER TABLE habits ADD COLUMN category TEXT NOT NULL DEFAULT 'general'", []).ok();
    conn.execute("ALTER TABLE habits ADD COLUMN reminder_time TEXT", []).ok();
    conn.execute("ALTER TABLE tasks ADD COLUMN parent_id TEXT", []).ok();
    conn.execute("ALTER TABLE tasks ADD COLUMN duration TEXT NOT NULL DEFAULT '24h'", []).ok();
    conn.execute("ALTER TABLE tasks ADD COLUMN expires_at TEXT", []).ok();

    // Seed default habit categories on first run
    let category_count: i32 = conn.query_row(
        "SELECT COUNT(*) FROM habit_categories",
        [],
        |row| row.get(0),
    ).unwrap_or(0);

    if category_count == 0 {
        let now = chrono::Utc::now().to_rfc3339();
        let defaults: [(&str, &str, &str); 4] = [
            ("cat_health", "Health & Vitality", "#059669"),
            ("cat_learning", "Learning & Skill", "#7c3aed"),
            ("cat_work", "Work & Projects", "#d97706"),
            ("cat_personal", "Personal & Mind", "#e11d48"),
        ];
        for (id, name, color) in defaults.iter() {
            conn.execute(
                "INSERT OR IGNORE INTO habit_categories (id, name, color, created_at) VALUES (?1, ?2, ?3, ?4)",
                rusqlite::params![id, name, color, now],
            ).ok();
        }
    }

    // Check schema_version
    let version: i32 = conn.query_row(
        "SELECT COALESCE(MAX(version), 0) FROM schema_version",
        [],
        |row| row.get(0),
    ).unwrap_or(0);

    if version == 0 {
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "INSERT INTO schema_version (version, applied_at) VALUES (1, ?1)",
            [now],
        )?;
        info!("Applied schema version 1");
    }

    Ok(())
}
