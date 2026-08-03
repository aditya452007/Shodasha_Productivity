# ADR-0002: Standalone Tracker Process with WAL SQLite

**Date:** 2026-07-23

**Status:** Superseded by ADR-0002-R1 (2026-08-02) — see below

## ADR-0002-R1: Superseded — Single-process embedded tracker

The `tracker/` crate was **deleted** (2026-08-02). The standalone tracker binary is
replaced by an **embedded Rust thread** in `src-tauri/src/services/tracker_service.rs`,
which runs in-process and keeps its own SQLite connection. The app is always resident
in the system tray, so the original constraint ("tracking must work when the UI is
closed") is still met — "closed" now means "hidden to tray". This also:

- eliminates the duplicate-writer hazard (two processes could close/overwrite each
  other's open `time_entries` rows → corrupt durations, double-counted analytics);
- removes the second binary from the installer, CI, and the `HKCU\...\Run` launcher;
- keeps WAL + `busy_timeout` + `synchronous=NORMAL` on both connections.

The rest of this document records the original (now rejected) decision, kept for history.

## Context

Shodasha needs to track foreground window activity on Windows. Two constraints drove this decision:
1. Tracking must work **even when the app UI is closed** — the user should not need to keep the app open
2. Tracking must use **minimal CPU/RAM** (< 0.5%, < 10MB)

Options considered:
- **In-process Tauri polling** — Rust code inside the Tauri app polls on a timer. Fails constraint #1 (app must stay in tray)
- **Windows Service** — True system service, runs as SYSTEM. More robust, but significantly more complex to develop, debug, and install
- **Windows Startup program** — Standalone binary registered in HKCU\Run. Runs at user login, no console, minimal resources

## Decision

Use a **separate Rust crate** (`tracker/`) that runs as a Windows Startup program. The Tauri app and tracker share the same SQLite database at `%APPDATA%/Shodasha/data.db` with **WAL (Write-Ahead Logging)** journal mode.

Key architectural properties:
- Two independent Rust binaries, one Rust workspace
- Tracker only writes to SQLite, never reads (except schema check)
- Tauri app only reads from SQLite (except task/habit/category CRUD)
- WAL mode enables concurrent read + write without locks
- Busy timeout of 5 seconds as safety net
- Tracker does NOT run migrations — Tauri app does
- Tracker bundled inside Tauri installer as a resource

## Rationale

1. **Separate process = no dependency on Tauri lifecycle.** Tracker starts at boot. Tauri app opens when user wants it. They don't need each other.
2. **Startup program > Windows Service** for this use case. Services run as SYSTEM (elevated), require complex installation, and are harder to debug. A startup program runs as the user, needs no elevation, and can be registered with a simple registry write.
3. **WAL mode solves the concurrent access problem.** Without WAL, SQLite locks the database file during writes, blocking reads. With WAL, the tracker writes and the Tauri app reads simultaneously with no contention.
4. **Rust is the right choice** — no runtime overhead, no GC pauses, tiny binary (< 3MB stripped), direct Win32 API access via `windows-sys` crate.
5. **Two crates > one binary with modes.** Clean separation of concerns. The tracker has zero UI dependencies. The Tauri app has zero Win32 polling dependencies. Shared schema via a common SQL module.

## Trade-offs

| Pro | Con |
|-----|-----|
| Tracking works 24/7 regardless of app state | Two binaries to build and bundle |
| Minimal CPU/RAM footprint | Must handle concurrent DB access carefully |
| Clean separation of concerns | Startup program stops if user logs off |
| Easy to debug (separate log files) | User can accidentally kill tracker via Task Manager |
| No elevated privileges needed | Cannot track before user login (acceptable for v1) |

## Consequences

- Installer must bundle tracker.exe and register it on first launch
- Uninstaller must clean up registry key and binaries
- Both crates must implement the same `PRAGMA journal_mode=WAL;` on connection open
- Schema migrations must be backward-compatible to support old tracker + new app
- Frontend must handle the case where tracker has never run (no data)
- App may need a "tracker status" indicator so user knows if tracking is active
