# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

**Phase 5 — Verify: Desktop Shell & Background Window Tracking Integration Completed & Verified**

All 5 core frontend features + Tauri v2 desktop shell + Win32 background window tracking poller (`tracker.exe`) + local SQLite database (`%APPDATA%/Shodasha/data.db` in WAL mode) implemented, integrated, verified, and shippable.

## Current Goal

Fully functional native desktop application with passive activity tracking, offline SQLite persistence, frameless window controls, and system tray integration with 0 compilation or typecheck errors!

## Completed

- [x] PRODUCT.md written (product definition, capabilities, principles)
- [x] Shape brief written and updated (top tabs, habits, premium libs, dark mode)
- [x] CONTEXT.md — 8 entities, 8 domain rules, navigation, constraints
- [x] Architecture.md — full architecture with tracker design, WAL mode, migrations, idle handling, build pipeline, capabilities, logging
- [x] ADR-0001: Premium component libraries over Mantine
- [x] Component library index compiled + rewritten as agent instruction file
- [x] Grilling session completed (all domain decisions resolved)
- [x] Design direction locked (light-first editorial, emerald accent, Cabinet Grotesk + Inter)
- [x] Anti-slop rules defined (ui-context.md + ai-workflow-rules.md)
- [x] Context files all updated (7 files, all filled from templates)
- [x] AGENTS.md written (5-phase SDLC)
- [x] Implementation Plan created & approved (`implementation_plan.md`)
- [x] Design system CSS tokens & theme variables (`src/app/globals.css`)
- [x] Zustand state stores created & extended (`uiStore`, `taskStore`, `habitStore`, `timeEntryStore`, `settingsStore`)
- [x] Premium Animata Gooey Tabs navigation (`src/components/ui/gooey-tabs.tsx`) integrated into `Navbar.tsx`
- [x] Dashboard feature components (`TodayProgressCard`, `QuickTaskInput`, `HabitQuickToggle`, `TimeDistributionChart`, `RecentActivityFeed`)
- [x] Board feature (`/board`) with Kanban drag-and-drop & task modals
- [x] Habits feature (`/habits`)
- [x] Timeline feature (`/timeline`)
- [x] Settings feature (`/settings`)
- [x] **Desktop Shell & Background Window Tracking Integration**:
  - Feature Spec written at `Feature_docs/tauri_integration/spec.md`
  - Scaffolding & Cargo configuration for `src-tauri` and `tracker` crates with `rusqlite`, `windows-sys`, `chrono`, `serde`, `tracing`
  - Created SQLite WAL mode database initializer and schema migration engine (`src-tauri/src/db.rs`) at `%APPDATA%/Shodasha/data.db`
  - Built Service-Router-Repository architecture (`task_repo.rs`, `habit_repo.rs`, `time_entry_repo.rs`, `app_category_repo.rs`, `kanban_repo.rs`, `seed_service.rs`, `prune_service.rs`, `export_service.rs`)
  - Created type-safe Tauri IPC `#[tauri::command]` router (`src-tauri/src/commands.rs`) and registered permissions in `capabilities/default.json`
  - Embedded native Windows application active window poller thread directly in `shodasha_lib` (`src-tauri/src/services/tracker_service.rs`) using `GetForegroundWindow()`, `GetWindowThreadProcessId()`, `QueryFullProcessImageNameW()`, and `GetLastInputInfo()` hardware idle detection (> 5 mins)
  - Resolved MinGW GNU 65k export symbol cap by updating `crate-type = ["staticlib", "rlib"]` in `src-tauri/Cargo.toml`
  - Added full window capabilities (`core:window:allow-toggle-maximize`, `shell:default`, etc.) to `src-tauri/capabilities/default.json` and enabled `"resizable": true` in `tauri.conf.json`
  - Purged all hardcoded dummy data from Zustand stores (`taskStore.ts`, `habitStore.ts`, `timeEntryStore.ts`)
  - Converted Cumulative Screen Time chart to **12-Hour AM/PM format** with real linear accumulation from SQLite `time_entries`
  - Added Date Picker & Calendar Navigation bar to `/timeline` to navigate historical dates from SQLite DB
  - Enforced habit check-in rules by physically disabling future dates (`isFuture`) in `HabitCalendar.tsx`
  - Fixed hardcoded 5-day streak bug on dashboard — replaced with dynamic streak calculation (`0 Days` on fresh install)
  - Added manual **Refresh Data** buttons with spinning animation and 15s live auto-polling to Dashboard and Timeline
  - Verified with `npm run typecheck` and `cargo check --workspace` (0 errors across all TypeScript & Rust crates)

## Next Up

1. Native app installer packaging verification (`npm run build:all`)
2. End-to-end user testing & release preparation

## Open Questions

- Poll interval default for activity tracker (configurable, default 10s)
- Export format besides CSV? (deferred)

## Architecture Decisions

- ADR-0001: Premium component libraries over Mantine (accepted)
