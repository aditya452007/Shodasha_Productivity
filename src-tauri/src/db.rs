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

    // Enable WAL mode & busy timeout for safe concurrent reads/writes.
    // synchronous=NORMAL is safe under WAL (no corruption — at worst the last
    // commit is lost on power failure) and avoids an fsync per write.
    conn.execute_batch(
        "PRAGMA journal_mode=WAL;
         PRAGMA busy_timeout=5000;
         PRAGMA foreign_keys=ON;
         PRAGMA synchronous=NORMAL;
         PRAGMA journal_size_limit=67108864;",
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
        CREATE INDEX IF NOT EXISTS idx_time_entries_end_time ON time_entries(end_time);
        CREATE INDEX IF NOT EXISTS idx_time_entries_open ON time_entries(end_time) WHERE end_time IS NULL;
        CREATE INDEX IF NOT EXISTS idx_habit_records_date ON habit_records(date);

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

    // Seed default habit categories. INSERT OR IGNORE keeps this idempotent —
    // it never touches user-created categories and re-runs safely on existing DBs.
    {
        let now = chrono::Utc::now().to_rfc3339();
        let defaults: [(&str, &str, &str); 8] = [
            ("cat_health", "Health & Vitality", "#059669"),
            ("cat_learning", "Learning & Skill", "#7c3aed"),
            ("cat_work", "Work & Projects", "#d97706"),
            ("cat_personal", "Personal & Mind", "#e11d48"),
            ("cat_ui", "Design & UI", "#0284c7"),
            ("cat_language", "Language Learning", "#0d9488"),
            ("cat_coding", "Coding & Algorithms", "#4f46e5"),
            ("cat_comm", "Communication & Confidence", "#c026d3"),
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

    // Version 2: one-time auto-categorization of existing uncategorized habits.
    // Only touches habits still in 'general' so it is safe to re-run, but gated
    // by schema_version so user choices made afterwards are never overwritten.
    if version < 2 {
        auto_categorize_habits(conn)?;
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "INSERT INTO schema_version (version, applied_at) VALUES (2, ?1)",
            [now],
        )?;
        info!("Applied schema version 2 (habit auto-categorization)");
    }

    Ok(())
}

/// Assign uncategorized habits (category = 'general') to a seeded category by
/// keyword matching on the habit name. Rules run in priority order — first
/// match wins — so specific keywords (e.g. "design pattern" → Coding) win
/// over broad ones (e.g. "design" → Design & UI). Pure name matching, never
/// deletes or modifies habit records.
fn auto_categorize_habits(conn: &Connection) -> Result<()> {
    let rules: [(&str, &[&str]); 8] = [
        (
            "cat_language",
            &["english", "spanish", "french", "german", "hindi", "japanese", "korean", "chinese", "vocabulary", "language", "new word", "word of the day"],
        ),
        (
            "cat_comm",
            &["cold message", "record yourself", "interview", "public speak", "speaking", "presentation", "networking", "communication", "confidence"],
        ),
        (
            "cat_coding",
            &["dsa", "algorithm", "leetcode", "hackerrank", "data structure", "system design", "design%pattern", "coding", "programming", "devops", "code"],
        ),
        (
            "cat_ui",
            &["frontend", "front end", "figma", "tailwind", "css", "html", "user interface", "ux", "ui", "design"],
        ),
        (
            "cat_work",
            &["work", "project", "job", "portfolio", "resume", "internship", "freelance", "startup", "career"],
        ),
        (
            "cat_health",
            &["gym", "workout", "fitness", "run", "jog", "yoga", "meditat", "sleep", "water", "walk", "exercise", "stretch", "protein"],
        ),
        (
            "cat_personal",
            &["journal", "diary", "mind", "gratitude", "hobby", "guitar", "piano", "camera", "sketch", "photography"],
        ),
        (
            "cat_learning",
            &["study", "learn", "read", "book", "course", "tutorial", "skill", "practice", "notes", "blog"],
        ),
    ];

    for (category_id, keywords) in rules.iter() {
        let mut clauses: Vec<String> = Vec::new();
        let mut values: Vec<String> = Vec::new();
        for kw in keywords.iter() {
            clauses.push(format!("lower(name) LIKE ?{}", clauses.len() + 1));
            values.push(format!("%{}%", kw.to_lowercase()));
        }
        let where_sql = clauses.join(" OR ");
        let sql = format!(
            "UPDATE habits SET category = ?{} WHERE category = 'general' AND ({})",
            values.len() + 1,
            where_sql
        );
        let mut params: Vec<&dyn rusqlite::ToSql> = Vec::new();
        for v in values.iter() {
            params.push(v);
        }
        params.push(category_id);
        conn.execute(&sql, rusqlite::params_from_iter(params)).ok();
    }

    Ok(())
}
