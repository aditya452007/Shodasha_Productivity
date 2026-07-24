# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

**Phase 5 — Verify 100% Completed**

## Current Goal

Execute Shodasha redesign incrementally in strictly controlled, verifiable phases.

## Completed

- [x] Implemented complete animations and motion polish (micro-interactions, modal/drawer entry, page tab crossfade, staggered list entries, number ticker stat counters, checkmark spring completion, progress ring fill, and prefers-reduced-motion accessibility guards) across all interactive elements, pages, modals, and lists (Section 4)
- [x] Implemented complete component states (Loading Skeleton, Empty State CTA, Error Banner) across Timeline components (`TimelineStream`, `AnalyticsKPIGrid`, `CumulativeScreenTimeWidget`) and Settings components (`DataManagement`, `AppCategoryManager`, `TrackingPreferences`, `AppearanceSettings`) (Section 3)
- [x] Implemented complete component states (Loading Skeleton, Empty State CTA, Error Banner, Form Submitting State, Validation Toasts) across Board components (`KanbanBoard`, `KanbanColumn`, `KanbanCard`, `TaskModal`) and Habits components (`HabitAnalyticsDashboard`, `HabitCalendar`, `HabitHeatmap`, `HabitStatsCard`, `HabitAchievements`, `AddHabitModal`) (Section 3)
- [x] Implemented complete component states (Loading Skeleton, Empty State CTA, Error Banner, Full Data with ProgressRing) across all Dashboard components: `TodayProgressCard`, `TimeDistributionChart`, `HabitQuickToggle`, `QuickTaskInput`, `RecentActivityFeed`, and `InsightCard` (Section 3)
- [x] Complete CSS variable overhaul in `src/app/globals.css`: OKLCH color tokens, spacing scale, border radius, easing/durations, z-indices, shadows (Phase 2.1)
- [x] Installed `cmdk` and `recharts` packages (Phase 2.2)
- [x] Created shared UI design system components: `LoadingSkeleton.tsx`, `EmptyState.tsx`, `ErrorBanner.tsx`, `StreamCard.tsx` (double-bezel doppelrand), and `ProgressRing.tsx` (Phase 2.3)
- [x] Created utility modules: `src/lib/utils/format.ts` (duration/relative time/percent) and `src/lib/utils/streak.ts` (per-habit streak calculation) (Phase 2.4, 2.5)
- [x] Standardized single-accent color usage: replaced `--accent-emerald` with `--accent` across 6 habit components and pages (Phase 2.8)
- [x] Defined 8 missing CSS variables in `src/app/globals.css` (`--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-surface-elevated`, `--text-tertiary`, `--border-subtle`, `--border-default`, `--accent-emerald`)
- [x] Configured font loading via `next/font/google` (`Geist`, `Inter`, `JetBrains_Mono`) in `src/app/layout.tsx` and updated CSS variable font mappings
- [x] Installed `sonner` package and added `<Toaster position="bottom-right" richColors />` to `src/app/layout.tsx`
- [x] Added `AsyncState` (`isLoading`, `error`, `isInitialized`) interface to all stores (`taskStore`, `habitStore`, `timeEntryStore`, `settingsStore`)
- [x] Added `'use client'` directive to `TodayProgressCard.tsx` (B1)
- [x] Fixed `deleteColumn` parameter bug in `taskStore.ts` (B3)
- [x] Consolidated competing theme systems: migrated `Navbar.tsx` to `settingsStore` and purged duplicate theme state from `uiStore.ts` (B5)
- [x] Implemented `clear_database` IPC command in Rust, `clearDatabaseInDb()` wrapper, and wired `DataManagement.tsx` with Sonner toasts & store reset (B4)
- [x] Implemented `settings` SQLite table, `get_settings`/`save_settings` Rust commands, `settings_repo`, and wired `settingsStore.ts` with auto-save & auto-load (B7)
- [x] Implemented `update_habit` IPC command in Rust, `habit_repo.rs`, `db.ts`, and wired `habitStore.updateHabit()` (B8)
- [x] Implemented Kanban columns SQLite persistence: `get_kanban_columns`, `create_kanban_column`, `update_kanban_column`, `delete_kanban_column`, `reorder_kanban_columns` in Rust & `db.ts`, and wired `taskStore` column actions (B9)
- [x] Standardized user-visible IPC error notifications with Sonner toasts across `src/lib/db.ts` (B10)
- [x] Verified full Rust (`cargo check`) and TypeScript (`npm run typecheck` & `npm run build`) compilation (0 errors)

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

### Phase 5 — Verify
- [x] `npm run lint` passes (0 errors, 0 warnings) — ESLint configured for Next.js 16 w/ `@next/eslint-plugin-next` + TypeScript parser
- [x] `npm run typecheck` passes (0 errors)
- [x] `npm run build` passes (0 errors — Next.js 16.2.11, Turbopack, 6 routes static)
- [x] `package.json` lint script updated: `next lint` → `eslint src/` (Next.js 16 removed built-in lint command)
- [x] `eslint.config.mjs` created with flat config format (files: *.ts/*.tsx/*.js/*.jsx, Next.js recommended + core-web-vitals rules)
- [x] `npm install --save-dev eslint @eslint/eslintrc @next/eslint-plugin-next @typescript-eslint/parser @typescript-eslint/eslint-plugin`
- [x] Removed 4 empty barrel index.ts files (`dashboard/`, `board/`, `habits/`, `timeline/`)
- [x] Added missing `.dark` OKLCH overrides for `--color-success`, `--color-warning`, `--color-error` in `globals.css`
- [x] Removed dead `--accent-emerald` variable definitions from `globals.css` (no component usage)
- [x] Deep-audited ALL 13 checklist sections via 5 parallel verification agents
- [x] Fixed B10: Added `handleIpcError` Sonner error toasts to remaining 14/27 db.ts wrapper functions (now 27/27)
- [x] Fixed TaskModal: added Loader2 spinner + disabled state on submit button
- [x] Fixed AddHabitModal: added Loader2 spinner + disabled state on submit button
- [x] Fixed habits/page.tsx: added loading state with skeleton layout
- [x] Fixed BarChart.tsx: replaced `animate={{ width }}` with `scaleX` (banned pattern fix)
- [x] Fixed HabitAnalyticsDashboard.tsx: replaced `animate={{ height }}` with `scaleY` (banned pattern fix)
- [x] Fixed Navbar.tsx tracking indicator: added `motion-reduce:animate-none` to `animate-ping`
- [x] Created `src/components/ui/CommandPalette.tsx` (cmdk-based, Cmd+K + Search button trigger)
- [x] Wired CommandPalette into Navbar with keyboard shortcut + aria-labels
- [x] Created `src/lib/insights.ts` (time + habit insight generators)
- [x] Final re-verification: lint=0, typecheck=0, build=0 — ALL PASS
- [x] Updated `final-verification-checklist.md` with verified state for all 13 sections
- [x] Progress tracker updated

## Post-Phase-5 Polish

- [x] Added missing secondary OKLCH CSS variables: `--color-rule-strong`, `--color-ink-secondary`, `--color-accent-hover`, `--color-accent-muted` to `:root` and `.dark` in globals.css
- [x] Replaced ~57+ hardcoded hex color values with CSS variable references across all component files
- [x] Removed `backdrop-blur` from CategoryFilterBar.tsx (surface blur — anti-slop violation); kept on modal overlays
- [x] Added ~25+ aria-label attributes across all pages (Navbar, Board, Dashboard, Habits, Timeline, Settings)
- [x] Added `aria-pressed` to theme mode buttons and category filter pills
- [x] B3: Added column delete confirmation dialog in KanbanColumn.tsx with task migration notice
- [x] Added global keyboard shortcuts: Cmd+1–5 for page navigation, ? for command palette
- [x] Final re-verification: lint=0, typecheck=0, build=0 — ALL PASS

## Business Logic & UX Polish (Jul 2026)

### Fixed
- [x] **Light mode borders invisible**: Changed `--border-subtle` (#f5f5f4→#e7e5e4), `--border` (#e7e5e4→#d6d3d1), `--bg-base` (#fafaf9→#f5f5f4) for clear component separation
- [x] **Dead .com sites in settings**: Removed `youtube.com`, `twitter.com`, `reddit.com` from `initialCategories` (desktop app tracks executables, not URLs)
- [x] **Habit past/future logic**: Added dashed border for past-date cells, toast confirmation for retroactive entries ("Logging past habit"), future dates remain disabled
- [x] **Time aggregation by hour**: `getCumulativeScreenTimeFiltered` now buckets entries by hour (max 24 points/day) instead of per-entry (hundreds of points), preventing axis overwriting
- [x] **Kanban card elevation**: Changed `shadow-xs`→`shadow-sm` default, bumped `--shadow-sm` to be more perceptible, `hover:shadow-md`
- [x] **Habit toggle rollback**: Made `toggleHabit` async with try/catch — reverts store on DB failure
- [x] **contextSwitches KPI**: Counts distinct app name transitions, not total entry count
- [x] **Browser title normalization**: Added `getCategoryForEntry` helper that extracts website names from Chrome/Firefox/Edge/Brave/Opera window titles and checks against categories before falling back to executable name

### Rust Backend (All Deferred Items Implemented)
- [x] **Laptop sleep/wake gap**: `insert_gap_entry()` in tracker_service.rs records idle periods as "Laptop sleep / idle gap" entries with `end_reason='idle'` — no more data loss during sleep
- [x] **Orphaned entries on exit**: `close_orphaned_entries()` runs on startup AND on tray "Quit" menu — closes all entries with `end_reason='closed'`, computes duration via julianday
- [x] **System process filtering**: Blocklist (`SYSTEM_PROCESSES` const) filters `explorer.exe`, `TextInputHost.exe`, `ShellExperienceHost.exe`, `LockApp.exe`, `SearchApp.exe`, `RuntimeBroker.exe`, `ApplicationFrameHost.exe`, etc.; `is_transient_window()` filters "Untitled Window", "Program Manager", "Start"
- [x] **Minimum entry duration**: `MINIMUM_DURATION_SECONDS = 3` — entries shorter than 3s are silently discarded (no DB row)
- [x] **Polling interval pipe**: `TrackerConfig` with `Arc<AtomicU64>` shared between lib.rs + tracker thread; `set_polling_interval` Tauri command (clamped 5-60s) updates atomic + persists to settings DB; frontend calls via `setPollingIntervalInDb()`
- [x] **Idle threshold configurable**: Same pattern — `set_idle_threshold` Tauri command (clamped 60-900s); UI slider in TrackingPreferences.tsx with 1min/5min/15min labels; synced to Rust engine in real-time
- [x] **Midnight crossover**: `get_time_entries_by_date` and `get_time_entries_range` now use `start_time <= ?2 AND (end_time IS NULL OR end_time >= ?1)` — catches entries that start before midnight but span into the queried day
- [x] **Pre-Coding Research**: Analyzed ActivityWatch, RescueTime, ManicTime, Toggl, and Rize for time visualization UX, gap compaction, and app rankings; documented in `Feature_docs/research/time-visualization-ux.md`
- [x] **Priority 1 — Timeline Rewrite**:
  - Rewrote timeline to eliminate session-level micro logs and session counts
  - Created `DailyUsageBarChart.tsx` (hours used per day bar chart)
  - Created `ActivePeriodsTimeline.tsx` (continuous active blocks 7-12, 18-22 with compacted idle gaps >30m)
  - Created `AppRankingChart.tsx` (app ranking sorted purely by total hours, with category selectors)
  - Added computed getters to `timeEntryStore.ts` (`getDailyUsageHours`, `getActivePeriods`, `getAppRankingByHours`)
  - Updated `src/app/timeline/page.tsx` layout
- [x] **Priority 2 — Redesign Settings**:
  - Implemented 2-column sidebar navigation pattern adapted from `Component_Docs/settings.md`
  - Category menu (Tracking, Appearance, Notifications, Data, About) on left, content panel on right
  - Mobile responsive master-detail drill-down view with back button header
  - Adapted using Shodasha native Tailwind CSS + Lucide icons
- [x] **Priority 3 — Web Notifications Service**:
  - Created `src/lib/notifications.ts` Web Notification API service wrapper
  - Created `src/stores/notificationStore.ts` Zustand store with local persistence
  - Built `NotificationsSettings.tsx` configuration panel
  - Integrated Habit reminders, Idle alerts, and Daily productivity summary notifications with background tick evaluation

## Next Up

1. Native app installer packaging verification (`npm run build:all`)
2. End-to-end user testing & release preparation

## Open Questions

- Poll interval default for activity tracker (configurable, default 10s)
- Export format besides CSV? (deferred)

## Architecture Decisions

- ADR-0001: Premium component libraries over Mantine (accepted)
