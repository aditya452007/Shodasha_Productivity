# Feature Spec: Desktop Shell & Background Window Tracking Integration (Tauri v2 + Win32 Tracker)

## 1. Overview & Objectives

Transition **Shodasha** from browser mock state into a production-grade, offline-first native Windows application built with Tauri v2, local SQLite in WAL mode (`%APPDATA%/Shodasha/data.db`), and a zero-window Win32 background activity poller crate (`tracker.exe`).

### Key Goals:
1. **Service-Router-Repository Architecture (`src-tauri/src/`)**: Clean modular layer separating low-level SQLite database access (`rusqlite`), domain business services (default seeding, data retention pruning, CSV exports), and type-safe Tauri IPC `#[tauri::command]` router handlers.
2. **Win32 Activity Poller (`tracker/src/`)**: Lightweight, zero-window Rust binary that polls active windows via Win32 API (`GetForegroundWindow()`, `GetWindowThreadProcessId()`, `QueryFullProcessImageNameW()`) every 30s (configurable), handles idle/lock screen NULL detection (`end_reason = 'idle'`), and runs via Windows HKCU Run startup registry.
3. **Frameless Window Chrome & System Tray**: Custom frameless title bar controls (Minimize, Maximize/Restore, Close to Tray) and System Tray integration (Show App, Pause Tracking, Quit). Window close button hides/minimizes window to System Tray instead of terminating the app.
4. **IPC Bridge & Frontend Zustand Stores Wiring**: Type-safe `@tauri-apps/api/core` IPC wrapper in `src/lib/db.ts` seamlessly bridging `taskStore`, `habitStore`, `timeEntryStore`, and `settingsStore` to SQLite, with graceful browser dev fallback when running outside Tauri context.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Windows Startup                          │
│ HKCU\Software\Microsoft\Windows\CurrentVersion\Run          │
└──────────────┬──────────────────────────────────────────────┘
               │ Auto-launches on boot
               ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│ tracker.exe               │         │ Shodasha.exe (Tauri v2)   │
│ (Zero-window Rust poller) │         │ (Next.js 16 Static Export)│
│                           │         │                           │
│ - Win32 Polling (30s)     │         │ - Frameless Custom Chrome │
│ - Idle NULL Detection     │         │ - System Tray Menu        │
│ - Direct WAL SQLite write │         │ - IPC Commands Router     │
└──────────────┬────────────┘         └──────────────┬────────────┘
               │                                     │
               │   ┌─────────────────────────────┐   │
               └──►│ %APPDATA%/Shodasha/data.db  │◄──┘
                   │  PRAGMA journal_mode=WAL;   │
                   │  PRAGMA busy_timeout=5000;  │
                   └─────────────────────────────┘
```

---

## 3. Detailed Component Architecture

### A. Rust Backend Layer (`src-tauri/src/`)
- **`db.rs`**: SQLite connection pool / manager, schema version check & migration runner (`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;`).
- **`repositories/`**:
  - `task_repo.rs`: CRUD operations for `tasks`, column reordering, status updates, tag mutations.
  - `habit_repo.rs`: CRUD for `habits` and daily check-ins for `habit_records`.
  - `time_entry_repo.rs`: Fetch time entries by date/range, append time entry, link tasks to time entries.
  - `app_category_repo.rs`: Fetch and mutate executable classifications (`work`, `distraction`, `neutral`).
  - `kanban_repo.rs`: Kanban column CRUD and sort order updates.
- **`services/`**:
  - `seed_service.rs`: Ensures default Kanban columns ("To Do", "In Progress", "Done") exist on DB init.
  - `prune_service.rs`: Auto-prunes time entries older than N months based on user preference on startup.
  - `export_service.rs`: Generates `.csv` exports for time entries & habit check-ins.
- **`router/` or `commands.rs`**: Type-safe `#[tauri::command]` handlers that expose repository and service methods to the frontend.
- **`capabilities/default.json`**: Explicit manifest listing all allowed IPC commands and window control permissions.

### B. Background Tracker (`tracker/src/`)
- **`main.rs` & `poller.rs`**: Win32 loop checking `GetForegroundWindow()`. Reads process path using `QueryFullProcessImageNameW` and window text via `GetWindowTextW`.
- **Idle Detection (`idle.rs`)**: When `GetForegroundWindow()` returns `NULL` (due to WinLocker, screensaver, or display sleep), closes current active time entry with `end_reason = 'idle'`.
- **Database Access (`db.rs`)**: Opens `%APPDATA%/Shodasha/data.db` with `WAL` mode and `busy_timeout=5000`. Does not run migrations (only validates schema version).

### C. System Tray & Window Controls
- System tray icon initialized in `lib.rs` / `main.rs` with context menu items: `Show Shodasha`, `Pause Activity Tracking`, `Quit`.
- Custom window header controls (`Minimize`, `Maximize/Restore`, `Close to Tray`).
- Intercept window close event to hide main window to tray instead of quitting.

### D. Frontend Integration (`src/lib/db.ts` & Zustand Stores)
- `@tauri-apps/api/core` `invoke()` API calls for all data operations.
- Graceful detection `typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window` to fallback to browser localStorage / dummy state during web browser dev mode.
- Update `taskStore`, `habitStore`, `timeEntryStore`, and `settingsStore` initialization logic to call `src/lib/db.ts` functions.

---

## 4. Verification Plan

1. **Rust Compilation**: `cargo check --workspace` & `cargo build --workspace` pass cleanly with 0 warnings/errors.
2. **Frontend Typecheck & Build**: `npm run typecheck` and `npm run build` pass with 0 errors.
3. **Database Integrity**: SQLite WAL mode confirmed, tables created automatically on first run in `%APPDATA%/Shodasha/data.db`.
4. **IPC Execution**: Store actions trigger Tauri `invoke()` calls and update persistent SQLite records.
5. **Poller Execution**: `tracker.exe` runs silently in background, polling foreground window and updating `time_entries` in WAL mode without DB locking errors.
