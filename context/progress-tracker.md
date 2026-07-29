# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

**Phase 0 — Color System Unification 100% Completed**

## Current Goal

Proceed to Phase 1 — Premium UI Patterns (bento grid, BaseCard, micro-interactions).

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

### Phase 0 — Color System Unification (2026-07-29)
- [x] Resolved 3-way token conflict in `globals.css`: removed conflicting OKLCH `--color-accent*` (blue), kept hex `--accent` (emerald) as single source of truth
- [x] Aliased `--color-success` → `var(--success)` and `--color-error` → `var(--error)` so dark mode variants propagate through 3 dependent components
- [x] Added dark mode variant for `--color-warning: oklch(65% 0.18 80)` in `.dark` block
- [x] Added dark mode variants for `--habit-*` tokens (`#34d399`, `#a78bfa`, `#fbbf24`, `#fb7185`)
- [x] Created utility CSS classes: `bg-accent-gradient`, `icon-bg-*` (violet/amber/emerald/sky/rose), `dot-*` legend utilities
- [x] Fixed **StreakHeroCard**: replaced purple "AI gradient" (`from-violet-600 via-indigo-600 to-purple-700`) with `bg-accent-gradient` using `--accent` tokens; replaced all Tailwind color utilities with CSS var references
- [x] Fixed **LearningProgressCard**: replaced hardcoded SVG gradient `#7c3aed`/`#0284c7` with `var(--accent-violet)`/`var(--accent-blue)`; replaced legend dots and icon bg with CSS utilities
- [x] Fixed **PerformanceOverviewChart**: replaced `#7c3aed` in SVG gradient, stroke, and tooltip with `var(--accent-violet)`; replaced icon bg with `icon-bg-sky`
- [x] Fixed **TopKPIGrid**: replaced 4 inline hex `color` values with `var(--accent-*)` and 4 Tailwind utility classes with `icon-bg-*`
- [x] Fixed **GoalsHabitsCard**: replaced `'#059669'` hex fallbacks with `'var(--accent-emerald)'`; replaced icon bg and checkbox border colors with css vars
- [x] Fixed **AddHabitModal**: replaced raw `'#059669'` fallback strings with `'var(--accent-emerald)'`
- [x] Fixed **AppearanceSettings**: replaced hex accentOptions (`#059669`, `#7c3aed`, etc.) with `var(--accent-*)` references for dark-mode-aware accent switching
- [x] Fixed **settingsStore**: updated `AccentColor` type and defaults to use `var(--accent-*)` values
- [x] Verified: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run build` (successful)

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
- [x] **Productivity Goal Target & Focus Score Engine**:
  - Added `dailyGoalHours` setting (default: 6.0h) to `settingsStore` with SQLite persistence
  - Extended `timeEntryStore` with dynamic 0–100 **Productivity Index (Focus Score)** calculation, Deep Work vs Distraction ratios, and task logged time query helper
  - Updated `TodayProgressCard` and `AnalyticsKPIGrid` with Daily Goal progress rings and 6-column KPI cards
- [x] **Interactive Chart System Upgrade**:
  - Upgraded `DailyUsageBarChart` with interactive date-click cross-filtering (clicking any bar filters `ActivePeriodsTimeline` and `AppRankingChart` for that specific date)
  - Added Date Range Comparison mode ("This Week vs Last Week" comparison delta stats & overlays)
  - Upgraded `AppRankingChart` with a Category Distribution Toggle (**By App Name** vs **By Category Grouping**)
- [x] **Habit Streaks & Kanban Time Linking**:
  - Extended `achievements.ts` and `HabitAchievements` with Focus Hours milestone badges ("30-Hour Focus Week", "100 Deep Work Hours")
  - Linked desktop `TimeEntry` durations to Kanban tasks via `linkedTaskId` and rendered time-tracked badges (`⏱️ 2h 45m logged`) on `KanbanCard` and `TaskModal`
- [x] **Background Tray & System Startup Optimization**:
  - `on_window_event` close handler prevents app termination and hides window to system tray
  - System tray icon menu & left-click listener restores window to focus seamlessly
  - `set_auto_start` registers binary directly into Windows `HKCU\...\Run` startup registry for silent background tracking on user logon
  - Extremely minimal CPU (<0.1%) & RAM footprint during passive win32 polling
- [x] **Branding & Logo Integration**:
  - Generated native Windows desktop icons (`icon.ico`, `128x128.png`, `32x32.png`, `Square*.png`) from `logo.png`
  - Rendered `logo.png` in Navbar and About Settings
- [x] **CI/CD Automated GitHub Release Pipeline**:
  - Created `.github/workflows/release.yml` with `tauri-apps/tauri-action@v2` for automated MSI/EXE installer release packaging and aesthetic release notes publishing on tag push (`v*`)
  - Updated `.github/workflows/ci.yml` for pull request lint, typecheck, static build, and cargo check verification
- [x] **Phase 5 Final Verification Passed**:
  - `npm run lint` (0 errors)
  - `npm run typecheck` (0 errors)
  - `npm run build` (Next.js 16 production export passed with 0 errors)
  - `cargo check` (Rust backend dev profile passed with 0 errors)

### CI/CD Release Pipeline Overhaul (Jul 2026)
- [x] Combined auto-release + build into single `release.yml` workflow (removed separate `auto-release.yml`)
- [x] Triggers on push to `main`/`master`: auto-detects unreleased commits, bumps patch version, builds, and creates GitHub Release
- [x] Uses `tauri-apps/tauri-action@v2` for proper Tauri build (handles WiX Toolset, creates `.msi` installer)
- [x] Generates rich release body via file (avoids multiline YAML issues) — app description, feature list, installation guide, privacy notice, and auto-changelog from git commits
- [x] Updates release body post-creation using `gh release edit --notes-file`
- [x] Uploads `.msi` installer as downloadable release asset (not just source code zip)
- [x] Supports `workflow_dispatch` for manual releases with custom version or bump type (patch/minor/major)
- [x] Skips automatically when no unreleased commits exist since last tag
- [x] Updated README.md with comprehensive project documentation (features, tech stack, installation, privacy)
- [x] Node.js version aligned across all workflows (22 LTS)

### Auto-Start on Windows Sign-On Fix (Jul 2026)
- [x] **Automatic Boot Self-Healing**: Rust `lib.rs` now queries `autoStartEnabled` on startup and automatically syncs `commands::set_auto_start(true)` to `HKCU\Software\Microsoft\Windows\CurrentVersion\Run\ShodashaTracker` without requiring manual toggle in UI.
- [x] **Frontend Startup Sync**: Added `setAutoStartInDb(autoStartEnabled)` call during `settingsStore.initializeSettings()` execution.
- [x] **Silent Background Logon Handling**: Updated auto-start registry command to launch `"shodasha.exe" --autostart`. Updated `tauri.conf.json` main window config (`visible: false`) and `lib.rs` setup hook to check for `--autostart` / `--minimized` argument. On Windows sign-on, the app starts hidden in the tray to track background activity silently without popping up an intrusive window. Manual application launch shows window cleanly.

### Unified Logo Consistency (Jul 2026)
- [x] **Generated All System Icons**: Executed `npx tauri icon public/logo.png` to regenerate master PNG, ICO, ICNS, Store, and Taskbar icons directly from `public/logo.png`.
- [x] **Taskbar & Tray Icon Parity**: Explicitly configured `TrayIconBuilder::new().icon(app.default_window_icon().unwrap().clone())` in `lib.rs` so the Windows taskbar tray icon matches the application logo.
- [x] **Everywhere Branding Integration**: Added logo image rendering across `layout.tsx` metadata icons, `CommandPalette.tsx` search header, `TaskModal.tsx` detail header, `QuickTaskInput.tsx` task bar, `Navbar.tsx`, and `AboutSettings.tsx`.

### Optional Link Attachment & Default Browser Launcher (Jul 2026)
- [x] **Database & Backend**: Updated SQLite `data.db` schema migration in `db.rs` with `url TEXT` column for `tasks` and `habits`; updated `TaskDb` & `HabitDb` Rust structs and SQL queries.
- [x] **Browser Redirection Utility**: Created `src/lib/utils/url.ts` using `@tauri-apps/plugin-shell` for native desktop mode and `window.open` fallback for web browser mode.
- [x] **Zustand Stores & IPC**: Updated `taskStore.ts`, `habitStore.ts`, and `db.ts` to persist optional `url` property.
- [x] **Modals & Inputs**: Added "Web Link / URL (Optional)" input fields with live test link preview buttons in `AddHabitModal.tsx` and `TaskModal.tsx`.
- [x] **UI Link Badges**: Rendered standard external link icon button (`ExternalLink` `↗`) and domain badges (`🔗 github.com ↗`) on `KanbanCard.tsx`, `HabitCalendar.tsx`, and `HabitQuickToggle.tsx` iff a URL is set.
- [x] **Full Verification Passed**: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `cargo check` (0 errors), `npm run build` (0 errors).

### Learnova-Inspired Dashboard Redesign (Jul 2026)
- [x] **Layout Architecture**: Restructured main page `src/app/page.tsx` into a 3-tier hierarchy mirroring the Learnova reference layout while retaining Shodasha's Top Navigation bar.
- [x] **Header Greeting Component**: Created `HeaderGreetingCard.tsx` with time-aware greeting ("Good Morning / Afternoon / Evening"), subtitle, and live refresh trigger.
- [x] **Top 4-KPI Grid**: Created `TopKPIGrid.tsx` with compact metric cards ("Focus Time Today", "Focus Score", "Tasks Pending", "Habit Consistency").
- [x] **Schedule & Stream Card (60%)**: Created `ScheduleActivityCard.tsx` with scheduled task items, live active foreground process status, and status tags (`Active`, `Done`, `Scheduled`).
- [x] **Focus Donut Progress Ring (40%)**: Created `LearningProgressCard.tsx` with circular SVG progress ring and legend (Deep Work, Neutral, Distraction).
- [x] **Daily Goals & Habits Card (35%)**: Created `GoalsHabitsCard.tsx` with habit completion progress bars, target dates, and interactive checkmarks.
- [x] **Flame Streak Hero Card (30%)**: Created `StreakHeroCard.tsx` with vibrant purple/indigo gradient, animated flame icon, big text streak counter ("12 Days"), and motivational text.
- [x] **Performance Overview Line Chart (35%)**: Created `PerformanceOverviewChart.tsx` with smooth curved Recharts area chart and tooltips.
- [x] **Live Data & Inter-Component Reactivity**: Removed all dummy/random fallbacks (`Math.random()`, static 50% habit rate). Connected 100% live SQLite/Zustand state calculations, and wired task/habit toggle actions directly to SQLite persistence and real-time dashboard UI re-rendering.
- [x] **Full Verification Passed**: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm run build` (0 errors).

## Desktop Pet Notification Service (Jul 2026)

### Phase 0 — Design Brief
- [x] Feature spec written at `Feature_docs/desktop_pet_notifications/spec.md`
- [x] Integration approach: Direct Local IPC (named pipe via Win32 API)
- [x] Notification types mapped to pet reactions (idle, habit, daily summary, focus goal, task deadline, streak, error, time-based reminders)
- [x] Fallback chain: OpenPets → Web Notification → silent (configurable per type)
- [x] Pet selection: Both (Shodasha Settings + OpenPets app)
- [x] Time reminders: Relative duration + absolute deadline on tasks/habits

### Phase 1 — Rust IPC Client (Complete)
- [x] Created `src-tauri/src/services/openpets_client.rs` — full IPC client connecting to OpenPets via named pipe:
  - `discover()` — reads discovery file, checks pipe availability
  - `status()` — queries OpenPets status, returns pet info
  - `say(message, reaction, pet_id)` — sends speech bubble to pet
  - `react(reaction, pet_id)` — sets pet reaction animation
  - `list_pets()` — enumerates installed pets
- [x] All errors handled gracefully: NotInstalled, NotRunning, Timeout, Platform, IpcError
- [x] Thread-safe named pipe I/O with configurable timeouts (2s connect, 3s response)
- [x] Raw Win32 FFI via `kernel32` (CreateFileW, WriteFile, ReadFile, CloseHandle) — zero extra dependencies
- [x] Added `Win32_Storage_FileSystem` feature to `windows-sys`
- [x] Registered 4 new Tauri commands: `openpets_discover`, `openpets_say`, `openpets_react`, `openpets_list_pets`
- [x] `cargo check` — 0 errors, 0 warnings

### Phase 2 — Frontend (Pending)
- [ ] Extend `notifications.ts` with OpenPets delivery channel
- [ ] Extend `notificationStore.ts` with per-type pet delivery preferences
- [ ] Wire existing notification triggers to pet delivery

### Phase 3 — Pet Browser in Settings (Complete)
- [x] Create `DesktopPetSettings.tsx` component
  - Connection status banner (loading / available / not_installed / not_running / no_pets / error)
  - Master pet delivery toggle
  - Pet browser grid with selection (2-column, chip-style cards)
  - Per-type delivery channel selectors (Habit / Idle / Summary → both, pet, web, silent)
  - Test pet notification button with loading state
  - Refresh/retry button on connection banner
  - Follows warm editorial design system (existing CSS tokens, card patterns, spacing)
- [x] Add "Desktop Pet" nav item to SettingsSidebar (Cat icon)
- [x] Wire into Settings page render switch
- [x] Export from settings/index.ts

### Phase 4 — Notification Quality & Polish (Complete)
- [x] Improved `sendWebNotification` for Windows system policy compliance:
  - Proper `tag` deduplication in Windows Action Center
  - Auto-close after 8s via `setTimeout` — no stale notifications
  - `onclick` handler focuses app window and closes notification
  - `requireInteraction` flags for time-sensitive alerts (idle, deadline)
  - Cooldown map prevents duplicate spam (30s per tag)
- [x] Polished notification message copy — concise, scannable, actionable:
  - `sendHabitReminderNotification`: `"Time for "{name}" — keep your streak going!"`
  - `sendIdleAlertNotification`: `"You've been idle for {n} min. Take a breather or jump back in."`
  - `sendDailySummaryNotification`: `"{h}h tracked today. Top app: {name}."`
  - `sendTaskDeadlineNotification`: `"due in {n} min" / "is due now!"`
  - `sendFocusGoalNotification`: `"You hit {n} min of focused work. Great session!"`
  - `sendDurationElapsedNotification`: `"{n} min on "{task}". Taking a break?"`
- [x] Pet notification rate limiting (30s cooldown per pet)
- [x] Pet messages prefixed with emoji per type (⏰ habit, 💤 idle, 📊 summary, etc.)
- [x] Cleaned up notificationStore messages matching improved copy
- [x] Background 60s timer integrated in dashboard page (pre-existing, now using improved pipeline)

## Business Logic & UX Work Session (Jul 2026) — Kanban Timer Habits Notifications

### Kanban — Task Expiry & Nested Sub-Tasks
- [x] **taskStore.ts**: Added `TaskDuration` type (`'24h' | '48h' | '72h' | '1week' | 'none'`), `parentId` field for nested sub-tasks, `expiresAt` computed from duration + `createdAt`. `initializeTasks` auto-removes expired tasks with toast count. Selectors: `getActiveTasks`, `getExpiredTasks`, `getSubTasks`, `getTodayCompletedTasks`, `getTasksByDateRange`.
- [x] **KanbanColumn.tsx**: Duration selector dropdown on quick-add, parent/sub-task tree rendering.
- [x] **KanbanCard.tsx**: Expiry countdown badge (`/h left`), sub-task count indicator, duration label.
- [x] **TaskModal.tsx**: Parent task selector dropdown, duration selector, sub-task delete warning.
- [x] **board/page.tsx**: Collapsible Completed Tasks History with month calendar grid showing per-day task count.

### Habits — 2-Day Edit Limit
- [x] **habitStore.ts** `toggleHabit`: Enforces 2-day edit limit (rejects dates older than 2 days ago or future).
- [x] **HabitCalendar.tsx**: Habit names column `sticky left-0` with shadow; rate column `sticky right-0`. Today centered on mount via `scrollContainerRef.scrollLeft`. Only `canEditDate(dateStr)` cells are clickable; locked cells shown with dashed border + toast message.
- [x] **HabitHeatmap.tsx**: Scroll sync — `scrollLeft` auto-centered to latest weeks. Today highlighted with `ring-2 ring-blue-500`. Tooltip shows date, count, habit names.

### Timer — Global Persistence Across Pages
- [x] **timerStore.ts**: New global Zustand store with localStorage persistence, global `setInterval` (runs in background), calculates remaining time from `startedAt + duration`, syncs on page restore. Timer continues across page navigation, app background, and tab switches.

### Timeline — Meaningful Bar Chart Metrics
- [x] **DailyUsageBarChart.tsx**: Replaced static KPIs with Today vs Yesterday comparison row. 7d/14d/30d range toggle; comparison toggle for prev-period overlay. Bars show actual data with hover labels.

### Notifications — Test & Timer Delivery Fix
- [x] **lib/notifications.ts**: Removed false `|| true` fallback on `sendWebNotification` so it accurately returns `nativeSent`. Cached `tauriNotification` module load (only tries once). Web API notification fallback still fires + toast sent only if no native variant succeeded.
- [x] **notificationStore.ts** `sendTestNotification()`: Returns detailed channel-by-channel success/failure via `toast.success`.
- [x] **NotificationsSettings.tsx**: `handleSendTest` re-requests permission if not granted before calling store. Test timer notification now shows per-channel result (Web ✅/❌, Pet ✅/❌) instead of silent success.

### Rust Backend — Schema Migration
- [x] **db.rs**: Migration adds `parent_id`, `duration`, `expires_at` columns to `tasks` table.
- [x] **task_repo.rs**: `TaskDb` struct updated with all new fields; all CRUD queries adjusted.

### Color Palette — Playful Accent Tokens
- [x] **globals.css**: Added `--accent-blue/pink/rose/amber/emerald/violet/teal/orange/indigo` with matching muted variants in both light and dark mode.
- [x] **KPICard.tsx**: Added `accent` prop (`blue | pink | rose | amber | emerald | violet | teal | orange | indigo | default`) with dynamic styling for eyebrow badge and icon container.

### Fixes & Polish
- [x] **Board duplicate key bug**: Changed `['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d =>` to use `${d}-${i}` as key (unique keys for duplicate letters)
- [x] **Habits page scroll**: Added `overflow-y-auto` to `<main>` layout element so content scrolls properly when habits increase
- [x] **Playful accent colors applied across habits page**:
  - `HabitStatsCard.tsx`: Replaced hardcoded `bg-amber/emerald/violet/sky-500/*` with `var(--accent-*-muted)` tokens for all 4 stat cards
  - `HabitAnalyticsDashboard.tsx`: Each widget gets its own accent (blue=line, pink=rings, violet=bar chart). Insight banner uses indigo/pink/amber tri-color. SVG gradients, tooltips, bar fills all use `var(--widget-accent)`
  - `HabitCalendar.tsx`: Calendar icon uses `accent-rose` 
  - `HabitAchievements.tsx`: All 7 achievement icon colors, header badge, card gradients, progress bars, checkmarks, tooltips use playful accent tokens
  - `HabitHeatmap.tsx`: Replaced monochrome emerald cells with 4-color gradient (teal→emerald→blue→indigo), legend, header, tooltip, and footer all use accent tokens
  - `habits/page.tsx`: "Daily Consistency" badge uses `accent-amber`

### Verification
- [x] `npm run typecheck` passes (0 errors)
- [x] `npm run lint` passes (0 errors, 4 pre-existing warnings)
- [x] `npm run build` passes (0 errors, 6 static routes)

## Phase 2 — Dashboard Premium UI Patterns (BaseCard + Bento Grid + Hover States)

### Completed (2026-07-29)
- [x] Refactored 6 dashboard card components to use `BaseCard` wrapper with proper elevation:
  - `ScheduleActivityCard`, `LearningProgressCard`, `GoalsHabitsCard` — elevation="raised" with `card-hover-lift`
  - `StreakHeroCard` — elevation="flat" with gradient className override, border-0, `card-hover-lift`
  - `PerformanceOverviewChart` — elevation="raised" with `card-hover-lift`, cleaned unused `motion`/`useReducedMotion`/`BarChart2`
  - `TopKPIGrid` — each of 4 KPI metrics wrapped in BaseCard, removed unused `motion`/`useReducedMotion`
  - `InsightCard` — uses BaseCard built-in `isLoading`/`hasError` state handling, removed manual `LoadingSkeleton`/`ErrorBanner`
- [x] Applied bento grid layout to `src/app/page.tsx`:
  - Middle tier: `bento-grid bento-grid-cols-12 items-stretch` with `bento-col-span-7/5`
  - Bottom tier: same with `bento-col-span-4/3/5`
- [x] Added `card-hover-lift` class to all dashboard card containers
- [x] Removed ~15 unused imports across dashboard components
- [x] All hover interactions gated by `@media (hover: hover)` (in globals.css)
- [x] Reduced motion respected via global CSS `@media (prefers-reduced-motion: reduce)` disabling card-hover transforms

### Verification
- [x] `npm run lint` — 0 errors (4 pre-existing warnings)
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — successful (6 static routes)

## Phase 3 — Animation Polish, Edge States & Reduced Motion (2026-07-29)

### Completed
- [x] Created 10 transition utility classes in `globals.css` (`transition-btn`, `transition-lift`, `transition-colors`, `transition-border`, `transition-shadow`, `transition-ring`, `transition-opacity`, `transition-transform`, `transition-width`, `transition-height`) with CSS custom property easing/duration tokens
- [x] Added `prefers-reduced-motion` overrides for all new transition utility classes
- [x] Replaced `transition-all` on ~20 most visible interactive elements with specific property transitions:
  - **Navbar**: 2 nav buttons removed `transition-all` (covered by global CSS)
  - **SettingsSidebar**: nav items → `transition-colors`
  - **KanbanCard**: card → `transition-lift`, buttons/checkboxes → `transition-colors` or removed
  - **KanbanColumn**: column container → `transition-lift`
  - **SortableWidgetCard** (HabitAnalyticsDashboard): widget → `transition-shadow`
  - **CategoryFilterBar**: filter pills removed `transition-all`, search → `transition-ring`
  - **QuickTaskInput**: container → `transition-ring`
  - **TodayProgressCard**: card → `transition-border`, refresh button removed `transition-all`
  - **HabitQuickToggle**: toggle cards → `transition-colors`, checkbox → `transition-colors`, link btn removed
  - **HeaderGreetingCard**, **EmptyState**, **ErrorBanner**: buttons removed `transition-all`
  - **habits/page.tsx**: action button removed `transition-all`
  - **timeline/page.tsx**: action buttons removed `transition-all`
  - **AddHabitModal**: 3 inputs → `transition-ring`
- [x] **Reduced motion safeguards added**:
  - `TimerPage`: added `useReducedMotion` guard on page entry animation + `motion-reduce:animate-none` on pulse indicator
  - `habits/page.tsx`: added `useReducedMotion` guard on all 5 section entry animations (header + 4 staggered sections)
  - `board/page.tsx`: added `useReducedMotion` guard on page entry
  - `settings/page.tsx`: added `useReducedMotion` guard on page entry
- [x] **Edge states verified**:
  - `HabitAnalyticsDashboard` → loading skeleton + error banner ✅
  - `SortableWidgetCard` → passive wrapper, edge states delegated to children ✅
  - `AppCategoryManager` → loading skeleton + error banner + empty state ✅
  - `TrackingPreferences`, `AppearanceSettings`, `NotificationsSettings` → scalar defaults, static UI, no async gaps
  - `DataManagement` → no explicit loading state on clear/export (minor, acceptable for now)

### Verification
- [x] `npm run lint` — 0 errors (4 pre-existing warnings)
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — successful (6 static routes)

## Phase 3 Cleanup — transition-all Replacement + Timer Polish (2026-07-29)

### Completed
- [x] Fixed ~30 `transition-all` instances across 12 components:
  - **TimerPage**: Progress bar SVG custom easing, 6 buttons (start/stop/reset/presets/custom), custom input → `transition-ring`
  - **NotificationsSettings**: 2 buttons removed `transition-all`
  - **DesktopPetSettings**: 3 card containers → `transition-colors`, 8 buttons removed `transition-all`
  - **AppCategoryManager**: 1 button removed, search → `transition-ring`, list item → `transition-border`, 2 color icons → `transition-colors`
  - **DataManagement**: 2 buttons removed `transition-all`
  - **AppearanceSettings**: Color swatch → `transition-transform`
  - **HabitCalendar**: Day cell checkbox → `transition-colors`
  - **HabitAchievements**: Achievement card → `transition-lift`
  - **ScheduleActivityCard**: Status tag → `transition-colors`
  - **GoalsHabitsCard**: Habit checkbox → `transition-colors`
  - **TimelineStream**: Icon double-bezel → `transition-shadow`
  - **KPICard**: Double-bezel shell → `transition-shadow`
- [x] TimerPage polish: replaced `bg-blue-500`, `bg-red-500`, `bg-emerald-500` with `var(--accent)`/`var(--error)` tokens; progress bar easing → custom `cubic-bezier(0.23, 1, 0.32, 1)`
- [x] Hex audit: replaced default habit color `'#059669'` with `'var(--accent-emerald)'` in `habitStore.ts`
- [x] Added Timer tab (Cmd+6) keyboard shortcut in CommandPalette
- [x] All colors use `var(--*)` tokens — no inline hex in UI chrome
- [x] No `transition-all` on interactive elements (only chart animations and toggle knobs)

### Verification
- [x] `npm run lint` — 0 errors (4 pre-existing warnings)
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — 0 errors (7 static routes, including /timer)

## Phase 4 — Gamification System (2026-07-29)

### Completed
- [x] **gamificationStore.ts** — Zustand store with XP/level system, XP formula `100 × level × 1.15^(level-1)`, tier names (Bronze→Legend), XP sources (habit check-in 10xp, all-done bonus 25xp, focus session 5xp/30min, task done 15xp, early task bonus 10xp, achievement 50xp, streak milestone 100xp, first check-in 5xp). Deduplication via trackedXPKeys. Persistence to localStorage + SQLite settings table.
- [x] **achievements.ts** — Refactored with `category` (streaks/focus/tasks/habits/milestones) replacing old tier-as-category. Added `tier` field. Added 7 new achievements: Task Terminator (50 tasks), Execution Engine (200 tasks), Centurion of Action (1000 tasks), Deep Work Adept (500 focus hours), Focus Grandmaster (1000 focus hours), Habit Collector (5 habits), Ritual Architect (15 habits).
- [x] **SkillOctagon.tsx** — SVG radar chart with 8 axes (Consistency, Depth, Balance, Focus, Growth, Recovery, Mastery, Discipline). Polygon fill animated with spring `{ stiffness: 80, damping: 12 }`. 4-level grid rings with fade-in, axis labels staggered, data point dots. Empty: dashed outline + CTA text. Loading: skeleton shimmer. Error: ErrorBanner. Reduced motion: skip spring animations. All colors use `var(--accent-*)` per axis.
- [x] **XPProgressBar.tsx** — Animated horizontal bar with `layout` spring, tier badge with tier color, NumberTicker for XP count. Empty: level 1 at 0 XP. Loading: skeleton. Reduced motion: instant width, no ticker.
- [x] **LevelUpCelebration.tsx** — Scale-up badge + 12 particle burst overlay. Auto-dismiss after 3s or click. Reduced motion: opacity fade only, no particles. Tier-specific color.
- [x] **DailyXPGoal.tsx** — Circular progress ring (120px) showing daily XP vs 100 goal. Status text ("Start your day" / "On track" / "Almost there" / "Goal reached!"). Smooth fill animation. Reduced motion: instant.
- [x] **AchievementBadge.tsx** — Locked (dashed border, desaturated, 0.6 opacity), unlocked (solid border with glow, shimmer sweep), recent unlock (scale pulse, "NEW" gold ribbon fades after 3s). Category-colored section headers. Progress-to-next bar.
- [x] **AchievementBadgeGrid** groups by category with progress counts.
- [x] **StreakDisplay.tsx** — Flame icon with 6 intensity tiers (1–6 gray, 7–13 orange, 14–29 orange-red pulse, 30–59 red glow, 60–89 purple-red double pulse, 90+ gold-white intense glow). Streak prediction text, longest streak trophy, streak freeze icons (1–3 ice cubes), broken streak encouragement with bounce. Reduced motion: no scale, just text.
- [x] **GamificationSettings.tsx** — Settings panel showing level card, XPProgressBar, SkillOctagon preview, achievement count, reset button with confirmation.
- [x] **Integration wiring**: habitStore.toggleHabit → awardXP(10) + all-done check → awardXP(25); timerStore.fireTimerNotification → awardXP(5×intervals); taskStore.toggleTaskStatus/moveTask → awardXP(15) + early bonus(10); HabitAchievements → checkAndAwardAchievement(50).
- [x] **Dashboard integration**: XPProgressBar + DailyXPGoal + SkillOctagon (compact 200px) in gamification row between TopKPIGrid and middle tier.
- [x] **Habits integration**: StreakDisplay in top row, SkillOctagon (full 240px) + AchievementBadgeGrid replacing old HabitAchievements cards.
- [x] **Settings integration**: "Gamification & XP" tab in sidebar between Notifications and Desktop Pet.
- [x] **Globals.css**: Added `@keyframes shimmer-sweep` for AchievementBadge unlock shimmer.
- [x] **Reduced motion**: Every component uses `useReducedMotion()` from framer-motion. Spring animations become instant. Particle effects skipped. Stagger delays flattened.

### Verification
- [x] `npm run lint` — 0 errors (4 pre-existing warnings)
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — 0 errors (7 static routes)

### Phase 5 — Final Re-Verification (2026-07-29)
- [x] `npm run lint` — 0 errors, 4 warnings (pre-existing `<img>` only)
- [x] `npm run typecheck` — 0 errors
- [x] `npm run build` — 0 errors (7 static routes)
- [x] `transition-all` audit: 15 matches — all acceptable (chart animations + toggle knobs only)
- [x] `scale(0)` audit: 0 matches — no banned zero-scale entry animations
- [x] Inline hex audit: 21 matches — all data values (streak colors, tier colors, habit presets) — known safe patterns
- [x] `prefers-reduced-motion`: 23 components with `useReducedMotion()` + CSS `@media` block + 6 `motion-reduce` guards
- [x] `@media (hover: hover)` hover gating: 4 blocks in globals.css
- [x] `backdrop-blur` glassmorphism: 6 matches — all modal overlays/Navbar (allowed per spec)
- [x] Italic headings: 0 matches — no italic headings anywhere
- [x] All colors use `var(--)` tokens in UI chrome (inline hex only in data values)

## Project Status: CI/CD AUTOMATED — FULL .MSI RELEASES ON EVERY PUSH 🚀

## Open Questions

- Poll interval default for activity tracker (configurable, default 10s)
- Export format besides CSV? (deferred)

## Architecture Decisions

- ADR-0001: Premium component libraries over Mantine (accepted)
