# Architecture Context

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | Next.js 16 + TypeScript | Static export React framework |
| UI | Tailwind CSS v4 + selected premium libraries | Styling + per-component picks |
| Animation | Motion (Framer Motion) + GSAP | Micro-interactions, spring animations |
| Desktop shell | Tauri v2 | Native Windows shell, system tray, IPC |
| Background tracker | Embedded Rust thread in `src-tauri` | Polls foreground window, runs in-process |
| Database | SQLite (one Tauri-managed connection + tracker-thread connection) | Local persistent storage |
| State | Zustand | Client-side state management |
| Drag | @dnd-kit | Kanban drag & drop |
| Icons | lucide-react | Icon system |
| Charts | Animata graphs + Recharts (if needed) | Animated data viz |
| Logging | `tracing` crate (Rust) | Structured logs to file |

## Rust Project Layout (single crate)

```
shodasha/
├── src-tauri/               # The only Rust crate — Tauri v2 shell
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/        # Tauri v2 permissions manifest
│   │   └── default.json
│   ├── icons/
│   └── src/
│       ├── main.rs          # Entry point, tray menu, startup registration
│       ├── commands.rs      # IPC commands (invoke from frontend)
│       ├── db.rs            # SQLite reads, migrations
│       ├── lib.rs           # Builder, DbState/TrackerState, background tracker thread
│       ├── services/
│       │   └── tracker_service.rs  # Embedded Win32 foreground-window poller thread
│       └── logging.rs       # tracing init
├── src/                     # Next.js frontend (static export)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Dashboard
│   │   ├── board/page.tsx
│   │   ├── habits/page.tsx
│   │   ├── timeline/page.tsx
│   │   └── settings/page.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   ├── board/
│   │   ├── habits/
│   │   ├── timeline/
│   │   └── settings/
│   ├── stores/
│   │   ├── taskStore.ts
│   │   ├── habitStore.ts
│   │   ├── timeEntryStore.ts
│   │   └── uiStore.ts
│   └── lib/
│       ├── db.ts             # invoke() wrappers
│       └── utils.ts
├── Feature_docs/
├── CONTEXT.md
├── AGENTS.md
├── context/
├── docs/adr/
└── package.json
```

## How the Background Tracker Works

```
┌─────────────────────────────────────────────────────┐
│                  Windows Startup                     │
│  HKCU\...\Run — registered by Shodasha on first run │
└──────────┬──────────────────────────────────────────┘
           │ launches Shodasha.exe --autostart (hidden)
           ▼
┌─────────────────────────────────────────────────────┐
│  Shodasha App  (Tauri + Next.js + embedded thread)  │
│                                                     │
│  Tracker thread (tracker_service.rs):               │
│   1. Own SQLite connection (WAL, busy_timeout)      │
│   2. Loop every 5–60s:                              │
│      GetForegroundWindow() → write time_entries     │
│      NULL (idle/lock/sleep) → close with 'idle'     │
│                                                     │
│  Main process:                                      │
│   1. db::init_db() once → DbState (Mutex<Connection>)│
│   2. Serve UI, commands read via shared connection  │
└─────────────────────────────────────────────────────┘
          │
          └─────────── SQLite ────────┘
    %APPDATA%/Shodasha/data.db
    Journal mode: WAL (mandatory)
```

### Step-by-step flow

1. **Install:** Tauri installer places `Shodasha.exe` in Program Files
2. **First launch:** if auto-start is enabled, writes the current exe path to the Windows Run registry (write-on-change — the key is only touched when the value differs)
3. **On boot:** Windows launches `Shodasha.exe --autostart` hidden in the system tray — no window, no console
4. **Startup:** `db::init_db()` opens/creates SQLite with `PRAGMA journal_mode=WAL;` + `busy_timeout=5000;` + `synchronous=NORMAL;`, runs migrations once, seeds defaults. The embedded tracker thread opens its own connection
5. **Poll loop (embedded thread):** every `pollingInterval` seconds (5–60s):
   - Calls `GetForegroundWindow()` Win32 API
   - If result is NULL → system is locked, on screensaver, or asleep → close current TimeEntry with `end_reason = 'idle'`
   - If window changed → close previous entry, open new one
   - If same window → update `end_time` of current entry (extends duration)
6. **User opens app:** window shown from tray; frontend calls `invoke()` commands → Rust reads SQLite via the shared `DbState` connection → returns data
7. **User closes window:** minimizes to tray. App + tracker thread stay alive (background mode)
8. **User quits app from tray:** orphaned entries closed, process exits. Tracker stops with it (same process)
9. **Uninstall:** Installer removes the binary, cleans up Run registry, optionally deletes `%APPDATA%/Shodasha/`

### Idle / Lock / Sleep handling

- `GetForegroundWindow()` returns NULL when the desktop is locked, screensaver active, or during sleep
- When tracker sees NULL after having a valid window: close current entry with `end_reason = 'idle'`
- When tracker sees NULL repeatedly: no-op (don't create empty entries)
- When tracker sees a valid window after NULL: start new entry normally
- This prevents "laptop was locked for 8 hours" from appearing as active time
- **Do NOT** use Windows idle timer API — foreground window check is sufficient for our accuracy needs

### Startup registration

- **Only the main process** can write/remove the Run registry key (not the tracker thread)
- On first launch: prompt user with a dialog — "Allow Shodasha to track your activity at startup?"
- On uninstall: Tauri installer script removes the registry key
- If user declines: no registry entry. The app still tracks while running, but never auto-starts

## How Tauri Is Used

- **Desktop shell:** Wraps Next.js static export (`out/`)
- **System tray:** Close minimizes to tray, quit quits
- **IPC bridge:** Frontend calls `invoke('command_name', args)` → Rust handles it
- **Capabilities (Tauri v2):** All IPC commands must be declared in `src-tauri/capabilities/default.json`. Missing capability = invoke silently fails. Every new command must be added here.
- **Static export:** `next.config.js` sets `output: 'export'`. Tauri loads from `out/` directory.

### Frontend ↔ Rust Communication

```typescript
// src/lib/db.ts
import { invoke } from '@tauri-apps/api/core'

export async function getTimeEntries(date: string): Promise<TimeEntry[]> {
  return invoke('get_time_entries', { date })
}
```

All data operations go through Tauri `invoke()`. Zustand stores call these functions, cache results, notify React components. Never access SQLite directly from the frontend.

## Storage Model

### Database location

`%APPDATA%/Shodasha/data.db`

One connection is opened at startup (migrated once) and shared by all Tauri commands via `DbState { conn: Mutex<Connection> }`. The embedded tracker thread keeps its own dedicated connection. WAL mode enables concurrent reads/writes between them.

### Schema (v1)

```sql
-- Schema version tracking (for migrations)
CREATE TABLE schema_version (
    version INTEGER NOT NULL,
    applied_at TEXT NOT NULL
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    sort_order REAL NOT NULL DEFAULT 0,
    due_date TEXT,
    tags TEXT,  -- JSON array of strings
    linked_habit_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#059669',
    linked_task_id TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE habit_records (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL REFERENCES habits(id),
    date TEXT NOT NULL,  -- YYYY-MM-DD
    done INTEGER NOT NULL DEFAULT 0,
    UNIQUE(habit_id, date)
);

CREATE TABLE time_entries (
    id TEXT PRIMARY KEY,
    app_name TEXT NOT NULL,
    window_title TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    end_reason TEXT,  -- NULL (active), 'idle' (lock/sleep), 'closed'
    duration_seconds INTEGER,  -- computed on close, nullable for active entries
    linked_task_id TEXT,
    created_at TEXT NOT NULL
);
CREATE INDEX idx_time_entries_date ON time_entries(start_time);
CREATE INDEX idx_time_entries_task ON time_entries(linked_task_id);

CREATE TABLE kanban_columns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order REAL NOT NULL DEFAULT 0
);

CREATE TABLE app_categories (
    id TEXT PRIMARY KEY,
    app_name TEXT NOT NULL UNIQUE,  -- e.g. "Code.exe"
    category TEXT NOT NULL,         -- 'work', 'distraction', 'neutral'
    created_at TEXT NOT NULL
);
```

### Schema migrations

- `schema_version` table stores current version (integer)
- The app checks the version on startup and runs pending migrations in order, once (never per command)
- Migrations are Rust functions in `src-tauri/src/db.rs`
- v1 = this schema. v2+ = new migration functions appended

### Concurrent access (WAL mode)

| Concern | Solution |
|---------|----------|
| Tracker thread writing while commands read | `PRAGMA journal_mode=WAL;` — WAL allows one writer + multiple concurrent readers |
| Write contention | `PRAGMA busy_timeout=5000;` — wait up to 5s instead of immediate failure |
| Both connections on same file | Both set WAL, busy_timeout, `synchronous=NORMAL` on open |
| No data corruption | WAL is crash-safe. SQlite has decades of battle testing for this pattern |

### Data pruning

- Time entries older than 6 months are automatically pruned on app startup (configurable in Settings)
- Task and habit data is kept indefinitely (small data set)
- User can manually clear all data from Settings
- The tracker thread only writes current data — it never prunes

### Default seed data

On first database creation the app seeds defaults:
- Three default kanban columns: "To Do" (order 0), "In Progress" (order 1), "Done" (order 2)

## Tauri v2 Capabilities

Every IPC command must be declared in `src-tauri/capabilities/default.json`:

```json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:default",
    "core:window:allow-close",
    "core:window:allow-set-size",
    "core:window:allow-minimize",
    "core:window:allow-show",
    "core:window:allow-hide",
    "core:tray:default",
    {
      "identifier": "shodasha:allowed-commands",
      "allow": [
        "get_time_entries",
        "get_time_entries_range",
        "create_task",
        "update_task",
        "delete_task",
        "reorder_task",
        "get_habits",
        "create_habit",
        "update_habit_record",
        "get_kanban_columns",
        "create_kanban_column",
        "delete_kanban_column",
        "get_app_categories",
        "set_app_category",
        "get_dashboard_stats",
        "export_csv"
      ]
    }
  ]
}
```

When a new invoke command is added to `commands.rs`, it MUST also be added here. Missing capability = silent runtime failure.

## Logging Strategy

### Rust

- Library: `tracing` crate with `tracing-subscriber` for file output
- Log location: `%APPDATA%/Shodasha/logs/`
- Tauri log: `tauri.log` — logs IPC calls, DB errors, auth/startup registration actions
- Log level: `info` in production, `debug` during development
- Log rotation: simple date-based (new file per day, auto-delete after 30 days)
- No PII (window titles contain document names — user must consent)

### Frontend

- `console.log`/`console.error` for development
- In production, only critical errors surfaced to user (no console spam)

## Build Pipeline

Root-level `package.json` orchestrates the build:

```json
{
  "scripts": {
    "dev": "next dev & cargo watch -w src-tauri/src",
    "build:next": "next build",
    "build:tauri": "cargo build --release --manifest-path src-tauri/Cargo.toml",
    "build": "npm run build:next && npm run build:tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "npm run build:next && tauri build"
  }
}
```

Build order: Next.js static export first (produces `out/`), then Tauri (links `out/`).

## Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| App startup | < 2s | Static files, lazy-load non-critical components |
| Background tracking CPU | < 0.5% | 30s polling, no heavy computation |
| Background tracking RAM | < 10MB | Minimal Rust binary, no dependencies |
| Navigation switching | < 50ms | Zustand caches, no DB on tab switch |
| SQLite reads | < 100ms | Indexed on date + task_id |
| SQLite writes (tracker) | < 10ms | Single-row upsert, WAL mode |
| Bundle size (installer) | < 50MB | Rust is small, Next.js is static |

## Invariants

1. No HTTP calls — fully offline, no external dependencies at runtime
2. All colors use CSS variable tokens — one source of truth for light/dark
3. Every animation has a prefers-reduced-motion fallback
4. Activity tracking runs in an embedded Rust thread, not in the webview
5. Zustand stores are the single source of truth for UI — SQLite is persistence layer only
6. Tauri IPC is the only bridge between frontend and data
7. SQLite WAL mode is mandatory — every connection sets it
8. Tauri capabilities manifest must list every IPC command
9. The tracker thread never touches the app_categories table — command handlers own it
