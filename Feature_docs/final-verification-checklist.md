# Final Verification Checklist

Generated: 2026-07-24 | Type: EXHAUSTIVE — every change that must happen

---

## 1. All P0 Bugs (Fix Steps)

### B1: Missing `'use client'` in TodayProgressCard
- [x] Add `"use client"` directive at top of `src/components/dashboard/TodayProgressCard.tsx`
- [x] Verify build passes (`next build`)

### B2: 8 Undefined CSS Variables
- [x] Add `--border-subtle` to `:root` and `.dark` in `globals.css`
- [x] Add `--border-default` to `:root` and `.dark`
- [x] Add `--bg-secondary` to `:root` and `.dark`
- [x] Add `--bg-primary` to `:root` and `.dark`
- [x] Add `--bg-tertiary` to `:root` and `.dark`
- [x] Add `--text-tertiary` to `:root` and `.dark`
- [x] Add `--accent-emerald` to `:root` and `.dark` (or replace with `--accent`)
- [x] Add `--bg-surface-elevated` to `:root` and `.dark`

### B3: deleteColumn Parameter Bug
- [x] Fix `taskStore.ts:200`: change `task.id === id` to `task.status === id`
- [x] Verify tasks migrate to 'todo' column on column deletion
- [ ] Add confirmation dialog before allowing column deletion

### B4: "Clear Database" Doesn't Clear SQLite
- [x] Add `clear_database` IPC command to `commands.rs`
- [x] Add `clearDatabaseInDb()` wrapper in `db.ts`
- [x] Update `DataManagement.tsx:handleClearDatabase` to call IPC
- [x] Reset all Zustand stores to initial state after clear
- [x] Show Sonner success toast on completion
- [x] Show Sonner error toast on failure
- [x] Add double-confirmation dialog ("Are you sure? This cannot be undone.")
- [x] Verify data doesn't return on reload

### B5: Two Competing Theme Systems
- [x] Remove `toggleTheme()` from `uiStore.ts`
- [x] Remove `setTheme()` from `uiStore.ts`
- [x] Update Navbar to use `settingsStore.setThemeMode()` instead of `uiStore.toggleTheme()`
- [x] Delete `uiStore.ts` or reduce to non-theme state (activeTab, isTracking)
- [x] Verify theme toggle works from both Navbar and Settings

### B6: Font Files Not Loaded via next/font
- [x] Add `@next/font/google` import for Geist (or Inter + Cabinet Grotesk)
- [x] Add font loading in `layout.tsx`
- [x] Update CSS variables to use next/font class names
- [x] Remove CSS-only font declarations
- [x] Verify fonts load in production build

### B7: Settings Lost on Restart (NEW)
- [x] Add `settings` table to SQLite schema in `db.rs`
- [x] Add `get_settings` IPC command in `commands.rs`
- [x] Add `save_settings` IPC command in `commands.rs`
- [x] Add wrapper functions in `db.ts`
- [x] Update `settingsStore.ts` to load from IPC on init
- [x] Update `settingsStore.ts` to persist on every change
- [x] Verify settings survive app restart

### B8: Habit Update Not Persisted (NEW)
- [x] Add `update_habit` command to `commands.rs`
- [x] Add `update_habit` to `habit_repo.rs`
- [x] Add `updateHabitInDb()` wrapper in `db.ts`
- [x] Wire `habitStore.updateHabit()` to call IPC
- [x] Verify habit name/color changes persist after reload

### B9: Kanban Columns Not Persisted (NEW)
- [x] Wire `taskStore.addColumn()` to call `create_kanban_column` IPC
- [x] Wire `taskStore.renameColumn()` to call new `update_kanban_column` IPC
- [x] Wire `taskStore.deleteColumn()` to call `delete_kanban_column` IPC
- [x] Wire `taskStore.reorderColumns()` to call new `reorder_kanban_column` IPC
- [x] Load columns from IPC on `taskStore.initializeTasks()`
- [x] Verify column state survives reload

### B10: No User-Visible IPC Error Handling (NEW)
- [x] Update all `db.ts` wrappers to show Sonner toast on error (not just console.error)
- [x] Differentiate error types: network vs DB vs permission
- [x] Add retry-state indicator on failed operations

---

## 2. Design System Tokens (Correct Values)

### Colors — Light Mode (OKLCH)
- [ ] `--color-paper: oklch(97% 0.008 80)` — off-white background
- [ ] `--color-paper-elevated: oklch(100% 0 0)` — card surfaces
- [ ] `--color-rule: oklch(88% 0.008 80)` — hairline borders
- [ ] `--color-neutral: oklch(55% 0.008 80)` — secondary text
- [ ] `--color-muted: oklch(45% 0.008 70)` — tertiary text
- [ ] `--color-ink: oklch(18% 0.01 60)` — primary text
- [ ] `--color-accent: oklch(55% 0.19 250)` — accent (blue)
- [ ] `--color-success: oklch(50% 0.15 150)` — green
- [ ] `--color-warning: oklch(55% 0.15 80)` — amber
- [ ] `--color-error: oklch(50% 0.18 30)` — red

### Colors — Dark Mode (OKLCH)
- [ ] `--color-paper: oklch(14% 0.008 40)`
- [ ] `--color-paper-elevated: oklch(18% 0.01 40)`
- [ ] `--color-rule: oklch(28% 0.008 40)`
- [ ] `--color-neutral: oklch(55% 0.008 40)`
- [ ] `--color-muted: oklch(70% 0.006 40)`
- [ ] `--color-ink: oklch(94% 0.006 80)`
- [ ] `--color-accent: oklch(65% 0.19 250)`

### Spacing (4pt scale, rem)
- [ ] `--space-3xs: 0.125rem`
- [ ] `--space-2xs: 0.25rem`
- [ ] `--space-xs: 0.5rem`
- [ ] `--space-sm: 0.75rem`
- [ ] `--space-md: 1rem`
- [ ] `--space-lg: 1.5rem`
- [ ] `--space-xl: 2rem`
- [ ] `--space-2xl: 3rem`

### Border Radius
- [ ] `--radius-sm: 4px`
- [ ] `--radius-md: 8px`
- [ ] `--radius-lg: 12px`
- [ ] `--radius-pill: 9999px`

### Typography
- [ ] `--font-ui: "Geist", system-ui, -apple-system, sans-serif`
- [ ] `--font-mono: "Geist Mono", "SF Mono", "JetBrains Mono", monospace`
- [ ] Fonts loaded via `next/font` in `layout.tsx`
- [ ] Type scale: 0.75rem / 0.875rem / 1rem / 1.25rem / 1.5rem / 2rem

### Easing & Duration
- [ ] `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
- [ ] `--ease-in: cubic-bezier(0.7, 0, 0.84, 0)`
- [ ] `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`
- [ ] `--dur-micro: 120ms`
- [ ] `--dur-short: 220ms`
- [ ] `--dur-long: 420ms`

### Z-Index
- [ ] `--z-base: 1`
- [ ] `--z-raised: 10`
- [ ] `--z-dropdown: 100`
- [ ] `--z-sticky: 200`
- [ ] `--z-modal: 400`
- [ ] `--z-toast: 500`
- [ ] `--z-tooltip: 600`

### Shadows
- [ ] Define `--shadow-sm`, `--shadow-md`, `--shadow-lg` tokens
- [ ] Replace all hardcoded `rgba(...)` shadows with token references
- [ ] Verify dark mode shadows work (no white-tinted inset shadows in dark mode)

---

## 3. Component States (Loading / Empty / Error)

### Dashboard Components
- [ ] TodayProgressCard: loading skeleton | empty CTA | error banner | content with progress ring
- [ ] TimeDistributionChart: loading skeleton | empty "No data yet" | error banner | Recharts bar
- [ ] HabitQuickToggle: loading skeleton | empty "Add your first habit" CTA | error | toggle list
- [ ] QuickTaskInput: disabled during submit | N/A empty | error toast on failure | form
- [ ] RecentActivityFeed: loading skeleton | empty "No recent activity" | error | relative-timestamp list
- [ ] InsightCard: loading skeleton | empty N/A | error "Insight unavailable" | insight text
- [ ] ProgressRing: loading pulse | empty "0%" | N/A error | animated ring

### Board Components
- [ ] KanbanBoard: loading skeleton (column placeholders) | N/A empty (each column handles it) | error banner on drag failure | columns
- [ ] KanbanColumn: loading skeleton | empty "Add a task" placeholder | N/A error | task list
- [ ] KanbanCard: N/A (single item) | N/A | N/A | card with states
- [ ] TaskModal: loading during save | N/A | error on validation/save failure | form

### Habits Components
- [ ] HabitAnalyticsDashboard: loading skeleton | empty "Start tracking habits" CTA | error banner | Recharts
- [ ] HabitCalendar: loading skeleton | empty "No habits yet" CTA | error | month matrix
- [ ] HabitHeatmap: loading skeleton | empty "No data yet" | error | heatmap grid
- [ ] HabitStatsCard: loading skeleton | empty "0 habits" | error | 4 stat cards
- [ ] HabitAchievements: loading skeleton | empty "Complete habits to unlock" | error | achievement grid
- [ ] AddHabitModal: submitting state | N/A | validation error | form

### Timeline Components
- [ ] FilterBar: N/A | N/A | N/A | filter controls
- [ ] TimelineStream: loading skeleton | empty "No entries for this date" | error banner | entry list
- [ ] CumulativeScreenTimeWidget: loading skeleton | empty "Start tracking" | error | Recharts AreaChart
- [ ] AnalyticsKPIGrid: loading skeleton | empty "0s tracked" | error | 3 KPI cards
- [ ] DistributionChartsWidget: loading skeleton | empty "No data" | error | chart

### Settings Components
- [ ] DataManagement: loading (during export) | empty counts | error on export/clear | management UI
- [ ] AppearanceSettings: N/A | N/A | error on save failure | settings form
- [ ] TrackingPreferences: loading (during interval change) | N/A | error on save | settings form
- [ ] AppCategoryManager: loading skeleton | empty "No apps found" | error | category grid

---

## 4. Animations (Trigger, Duration, Easing, Reduced-Motion Fallback)

### Micro-interactions
- [ ] Button press: `scale(0.97)` on `:active`, 120ms `--ease-out`, reduced-motion: skip
- [ ] Button hover: background shift or `translateY(-1px)`, 200ms `--ease-out`, reduced-motion: skip
- [ ] Focus ring: 2px accent, 3px offset, instant (no animation), reduced-motion: N/A
- [ ] Tooltip appear: 800ms delay, 150ms fade-in `--ease-out`, reduced-motion: 0ms delay, skip fade
- [ ] Toggle switch: 220ms `--ease-out` on thumb position, reduced-motion: skip spring, use instant

### Entry Animations
- [ ] Modal/drawer: 420ms `--ease-out`, opacity 0→1 + translateY(8px)→0, reduced-motion: opacity only
- [ ] Page tab switch: 250ms `--ease-in-out` crossfade, reduced-motion: 0ms
- [ ] Stagger list entries: 300ms per item, `--ease-out`, 50ms stagger delay, reduced-motion: all at once
- [ ] Number ticker (stat counters): 400ms `--ease-out` count-up, reduced-motion: show final value

### Feedback Animations
- [ ] Task/habit completion: 200ms spring check animation, reduced-motion: instant state change
- [ ] Toast enter: 400ms slide-in `--ease-out`, reduced-motion: instant appear
- [ ] Toast exit: 300ms slide-out `--ease-in`, reduced-motion: instant disappear
- [ ] Skeleton pulse: CSS animation, 150ms, reduced-motion: static placeholder
- [ ] Progress ring fill: 600ms `--ease-out` stroke-dasharray, reduced-motion: instant fill

### What NOT to animate
- [ ] No keyboard-initiated action animations
- [ ] No page-load orchestrated sequences
- [ ] No `scale(0)` on any element (start from `scale(0.95)`)
- [ ] No `width`/`height`/`top`/`left`/`margin`/`padding` animations
- [ ] No `transition: all`
- [ ] No infinite loops (except functional loaders)
- [ ] No bounce/elastic on UI elements

---

## 5. Aria Labels Required

### Navigation
- [ ] Navbar tabs: `aria-label="Navigate to [page]"`
- [ ] Theme toggle: `aria-label="Switch to [light/dark] mode"`
- [ ] Command palette trigger: `aria-label="Open command palette"`
- [ ] Window controls: `aria-label="[Minimize/Maximize/Close] window"`
- [ ] Active tab indicator: `aria-selected="true"`

### Dashboard
- [ ] Refresh button: `aria-label="Refresh data"`
- [ ] Quick task input: `aria-label="New task title"`
- [ ] Quick task add button: `aria-label="Add task"`
- [ ] Habit toggle buttons: `aria-label="Toggle [habit name] for [date]"`
- [ ] Stat cards: `aria-label="[Metric name]: [value]"`

### Board
- [ ] Add column button: `aria-label="Add new column"`
- [ ] Delete column button: `aria-label="Delete [column name] column"`
- [ ] Add task button: `aria-label="Add task to [column name]"`
- [ ] Drag handles: `aria-label="Drag [card/column name]"`
- [ ] Status toggle: `aria-label="Toggle [task name] status"`
- [ ] Edit task button: `aria-label="Edit [task name]"`

### Habits
- [ ] Color swatches: `aria-label="Select [color name] color"`
- [ ] Delete habit button: `aria-label="Delete [habit name]"`
- [ ] Edit habit button: `aria-label="Edit [habit name]"`
- [ ] Add habit button: `aria-label="Add new habit"`

### Timeline
- [ ] Category filter pills: `aria-pressed="true/false"`
- [ ] Search input: `aria-label="Filter by app name or window title"`
- [ ] Date picker: `aria-label="Select date"`
- [ ] Link task select: `aria-label="Link to task"`

### Settings
- [ ] Export button: `aria-label="Export data as CSV"`
- [ ] Clear database button: `aria-label="Clear all database data"`
- [ ] Theme mode buttons: `aria-pressed="true/false"`
- [ ] Category toggle buttons: `aria-label="Categorize as [work/neutral/distraction]"`

---

## 6. Keyboard Shortcuts Required

### Global
- [ ] `Cmd+K` / `Ctrl+K` — Open command palette
- [ ] `Cmd+1` → Dashboard
- [ ] `Cmd+2` → Board
- [ ] `Cmd+3` → Habits
- [ ] `Cmd+4` → Timeline
- [ ] `Cmd+5` → Settings
- [ ] `Escape` — Close modal/palette
- [ ] `?` — Show keyboard shortcuts help

### Dashboard
- [ ] `n` — New task (when command palette open or focused on quick input)
- [ ] `r` — Refresh data

### Board
- [ ] Arrow keys — navigate between cards (when board is focused)
- [ ] `Space` — Toggle task status
- [ ] `Enter` — Open task detail
- [ ] `Delete` — Delete selected task (with confirmation)
- [ ] `c` — Add new column

### Command Palette
- [ ] Arrow Up/Down — Navigate results
- [ ] `Enter` — Execute selected command
- [ ] `Escape` — Close (already listed)
- [ ] `Backspace` — Go to parent page (in nested commands)

---

## 7. CSS Variables That Must Be Defined

### Color Variables (OKLCH)
- [ ] `--color-paper` / `--color-paper-elevated`
- [ ] `--color-rule` / `--color-rule-strong`
- [ ] `--color-neutral` / `--color-muted`
- [ ] `--color-ink` / `--color-ink-secondary`
- [ ] `--color-accent` / `--color-accent-hover` / `--color-accent-muted`
- [ ] `--color-success` / `--color-warning` / `--color-error`

### Surface Variables (for components)
- [ ] `--bg-base` / `--bg-surface` / `--bg-surface-hover`
- [ ] `--bg-secondary` / `--bg-tertiary` (these were missing)
- [ ] `--bg-surface-elevated` (was missing)
- [ ] `--border` / `--border-strong` / `--border-subtle` / `--border-default`

### Text Variables
- [ ] `--text-primary` / `--text-secondary` / `--text-tertiary` (was missing)
- [ ] `--text-muted`

### Spacing
- [ ] All `--space-*` tokens (see section 2)

### Radius
- [ ] All `--radius-*` tokens (see section 2)

### Easing & Duration
- [ ] All `--ease-*` and `--dur-*` tokens (see section 2)

### Z-Index
- [ ] All `--z-*` tokens (see section 2)

### Font
- [ ] `--font-ui` / `--font-mono`

### Dark Mode
- [ ] `.dark` overrides for ALL color variables
- [ ] Dark mode font-weight reduction (`font-weight: 350` for body)

### Reduced Motion
- [ ] `@media (prefers-reduced-motion: reduce)` block with `animation-duration: 150ms !important`

---

## 8. IPC Commands That Must Be Registered

### Existing, Need Capabilities Registration (Tauri v2)
- [ ] `get_tasks` — registered in `capabilities/default.json`
- [ ] `create_task`
- [ ] `update_task`
- [ ] `delete_task`
- [ ] `reorder_task`
- [ ] `get_habits`
- [ ] `get_habit_records`
- [ ] `create_habit`
- [ ] `update_habit` (NEW)
- [ ] `delete_habit`
- [ ] `toggle_habit_record`
- [ ] `get_time_entries`
- [ ] `get_time_entries_range`
- [ ] `link_task_to_time_entry`
- [ ] `get_app_categories`
- [ ] `set_app_category`
- [ ] `get_kanban_columns`
- [ ] `create_kanban_column`
- [ ] `delete_kanban_column`
- [ ] `update_kanban_column` (NEW)
- [ ] `reorder_kanban_column` (NEW)
- [ ] `export_time_entries_csv`
- [ ] `export_habits_csv`
- [ ] `set_auto_start`
- [ ] `clear_database` (NEW)
- [ ] `get_settings` (NEW)
- [ ] `save_settings` (NEW)

---

## 9. Files That Must Be Created

### New Components
- [ ] `src/components/ui/LoadingSkeleton.tsx`
- [ ] `src/components/ui/EmptyState.tsx`
- [ ] `src/components/ui/ErrorBanner.tsx`
- [ ] `src/components/ui/StreamCard.tsx`
- [ ] `src/components/ui/CommandPalette.tsx`
- [ ] `src/components/dashboard/InsightCard.tsx`
- [ ] `src/components/dashboard/ProgressRing.tsx` (or copy from Magic UI)

### New Utilities
- [ ] `src/lib/utils/streak.ts`
- [ ] `src/lib/utils/format.ts`
- [ ] `src/lib/insights.ts`

### New IPC (Rust)
- [ ] `update_habit` in `commands.rs` + `habit_repo.rs`
- [ ] `update_kanban_column` in `commands.rs` + `kanban_repo.rs`
- [ ] `reorder_kanban_column` in `commands.rs` + `kanban_repo.rs`
- [ ] `clear_database` in `commands.rs`
- [ ] `get_settings` / `save_settings` in `commands.rs`

---

## 10. Files That Must Be Modified

### Critical (P0)
- [ ] `src/app/globals.css` — Complete CSS variable overhaul, add all tokens
- [ ] `src/app/layout.tsx` — Add next/font, Toaster, command palette
- [ ] `src/stores/timeEntryStore.ts` — Add AsyncState, real cumulative data
- [ ] `src/stores/taskStore.ts` — Fix deleteColumn bug, add column persistence
- [ ] `src/stores/habitStore.ts` — Add AsyncState, update habit IPC, per-habit streak
- [ ] `src/stores/settingsStore.ts` — Add AsyncState, settings persistence, remove uiStore dep
- [ ] `src/stores/uiStore.ts` — Remove theme management (deprecate to settingsStore)
- [ ] `src/lib/db.ts` — Add new IPC wrappers, add error toasts
- [ ] `src/components/settings/DataManagement.tsx` — Fix Clear Database, add import
- [ ] `src-tauri/src/commands.rs` — Add new commands
- [ ] `src-tauri/src/db.rs` — Add settings table, migration runner
- [ ] `src-tauri/capabilities/default.json` — Register all IPC commands

### Dashboard
- [ ] `src/components/dashboard/TodayProgressCard.tsx` — Add 'use client', progress ring, states
- [ ] `src/components/dashboard/TimeDistributionChart.tsx` — Recharts replacement
- [ ] `src/components/dashboard/RecentActivityFeed.tsx` — Relative timestamps
- [ ] `src/components/dashboard/HabitQuickToggle.tsx` — Empty state
- [ ] `src/components/dashboard/QuickTaskInput.tsx` — Toast feedback

### Board
- [ ] `src/components/board/KanbanBoard.tsx` — Loading states, hydration fix
- [ ] `src/components/board/KanbanColumn.tsx` — Aria-labels, confirmation dialog
- [ ] `src/components/board/KanbanCard.tsx` — Aria-labels, keyboard nav
- [ ] `src/components/board/TaskModal.tsx` — DatePicker, validation, aria-labels
- [ ] `src/components/board/AddColumnModal.tsx` — Aria-labels

### Habits
- [ ] `src/components/habits/HabitAnalyticsDashboard.tsx` — Recharts, CSS vars, states
- [ ] `src/components/habits/HabitCalendar.tsx` — Fix scroll, CSS vars, progress rings
- [ ] `src/components/habits/HabitHeatmap.tsx` — Fix scroll, CSS vars, a11y
- [ ] `src/components/habits/HabitStatsCard.tsx` — CSS vars, progress rings, states
- [ ] `src/components/habits/HabitAchievements.tsx` — CSS vars, aria-labels
- [ ] `src/components/habits/AddHabitModal.tsx` — CSS vars, aria-labels
- [ ] `src/components/habits/page.tsx` — Add loading state, page structure

### Timeline
- [ ] `src/components/timeline/TimelinePage.tsx` — DatePicker, remove duplicates, states
- [ ] `src/components/timeline/TimelineStream.tsx` — StreamCard, relative time, states
- [ ] `src/components/timeline/CategoryFilterBar.tsx` — Fix colors, remove backdrop-blur
- [ ] `src/components/timeline/LineChart.tsx` — Recharts or fix with CSS vars
- [ ] `src/components/timeline/BarChart.tsx` — Recharts or fix with CSS vars
- [ ] `src/components/timeline/RingChart.tsx` — Recharts or fix with CSS vars
- [ ] `src/components/timeline/KPICard.tsx` — CSS vars, states

### Navigation
- [ ] `src/components/layout/Navbar.tsx` — Single accent, remove tagline, hide window controls

### Settings
- [ ] `src/components/settings/AppearanceSettings.tsx` — Remove backdrop-blur, aria-labels
- [ ] `src/components/settings/TrackingPreferences.tsx` — Remove backdrop-blur
- [ ] `src/components/settings/AppCategoryManager.tsx` — Remove backdrop-blur, fix colors

---

## 11. Files That Must Be Removed

- [ ] `src/components/dashboard/index.ts` (empty barrel)
- [ ] `src/components/board/index.ts` (empty barrel)
- [ ] `src/components/habits/index.ts` (empty barrel)
- [ ] `src/components/timeline/index.ts` (empty barrel)
- [ ] `src/stores/uiStore.ts` (after deprecating theme to settingsStore)

---

## 12. npm Packages to Install

- [ ] `npm install sonner` — Toast notifications
- [ ] `npm install cmdk` — Command palette
- [ ] `npm install recharts` — Chart library
- [ ] `npx shadcn@latest init` — Initialize shadcn/ui
- [ ] `npx shadcn@latest add card skeleton toast button badge`
- [ ] `npx shadcn@latest add dialog drawer dropdown-menu popover`
- [ ] `npx shadcn@latest add table progress calendar date-picker`
- [ ] `npx shadcn@latest add command empty switch input select`
- [ ] `npx shadcn@latest add separator scroll-area`

---

## 13. Build Verification

- [ ] `npm run lint` passes with no errors
- [ ] `npm run typecheck` passes (or `tsc --noEmit`)
- [ ] `npm run build` completes successfully
- [ ] Dark mode renders correctly (no pure black/white, no broken shadows)
- [ ] Light mode renders correctly (no broken shadows)
- [ ] Reduced-motion mode works (no animations on any component)
- [ ] Keyboard navigation works end-to-end
- [ ] No console errors on any page
- [ ] No hardcoded hex colors remain in components
- [ ] No `backdrop-blur` remains (except navbar)
- [ ] No `--accent-emerald` references remain (should be `--accent`)
- [ ] No fraction text patterns remain ("3 / 10", "0 / 0")
- [ ] All timestamps show relative time, not "Today"
