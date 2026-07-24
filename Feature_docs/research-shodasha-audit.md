# Shodasha — Comprehensive Frontend Audit

> **Date:** 2026-07-24
> **Scope:** Full codebase analysis of `C:\Users\Hp\Shodasha_Productivity`
> **Method:** Exhaustive file-by-file read of all 40+ source files
> **Motto:** Specificity over generalities. File paths and line numbers throughout.

---

## 1. Design System & CSS Architecture

### 1.1 Undefined CSS Variables (CRITICAL)

`globals.css` defines only 20 CSS variables on `:root`. However, components reference **11 additional variables that do not exist**. These fall through to invalid values in CSS, causing silent rendering bugs — especially in dark mode.

| Undefined Variable | First Used In | Impact |
|---|---|---|
| `--border-subtle` | `HabitCalendar.tsx:75` | All habit components render with no border |
| `--accent-emerald` | `HabitsPage.tsx:43` | Badge text reverts to browser default |
| `--bg-secondary` | `HabitCalendar.tsx:75` | Card backgrounds transparent |
| `--bg-primary` | `HabitCalendar.tsx:248` | Cell backgrounds transparent |
| `--bg-tertiary` | `HabitCalendar.tsx:132` | Table header backgrounds missing |
| `--text-tertiary` | `HabitCalendar.tsx:143` | Day-of-week labels invisible |
| `--border-default` | `HabitCalendar.tsx:95` | Button border reverts |
| `--bg-surface-elevated` | `TrackingPreferences.tsx:70` | Slider track uncolored |
| `--accent-emerald` (also) | `HabitCalendar.tsx:79` | Icon background invisible |

**Root cause:** Habit components were written against a different CSS variable set than what `globals.css` provides. The habit components use a naming convention (`--*-subtle`, `--*-secondary`, `--*-primary`) that doesn't match the layout/dashboard convention (`--bg-surface`, `--border`, etc.).

### 1.2 Hardcoded Colors Bypassing Tokens

Anti-slop rule #8 (`ui-context.md:87`) bans hardcoded colors. Violations found:

- **`Navbar.tsx:23-27`** — Tab colors: `bg-emerald-600`, `bg-teal-600`, `bg-violet-600`, `bg-amber-600`, `bg-stone-700` — these are Tailwind literal colors, not CSS variable tokens
- **`HabitAnalyticsDashboard.tsx:356-357`** — Inline `#10b981` for SVG stroke (multiple instances)
- **`HabitAnalyticsDashboard.tsx:286-289`** — Inline `#10b981` for gradient stops
- **`HabitAnalyticsDashboard.tsx:556`** — Inline gradient: `from-emerald-600 to-teal-400`
- **`TodayProgressCard.tsx:137-138`** — Hardcoded `text-amber-600 dark:text-amber-400`
- **`DataManagement.tsx:78`** — `text-violet-600` + `bg-violet-500/10` (purple accent violates anti-slop rule #3)

### 1.3 Border Radius Inconsistency

`ui-context.md:93-98` defines a radius system (6px, 12px, 16px, 8px). However:
- Most components use Tailwind's `rounded-2xl` (16px by default), `rounded-xl` (12px), `rounded-lg` (8px) — mixing levels inconsistently
- Timeline components use a custom `rounded-[2.25rem]` (36px) and `rounded-[2rem]` (32px) "doppelrand" double-bezel style — these aren't in the design token system
- The "doppelrand" pattern (`p-1.5 rounded-[2rem] bg-stone-900/5 ... ring-1 ...`) is used in 6+ timeline/settings components but is a bespoke pattern not documented in ui-context

### 1.4 Shadow System Not Codified

`ui-context.md:102-108` describes shadow values but they aren't defined as CSS variables or Tailwind extensions. Components use ad-hoc shadow classes:
- `shadow-xs` — most cards
- `shadow-xl` — modals
- `shadow-md` — buttons in settings
- Custom `shadow-[inset_0_1px_1px_rgba(...)]` — timeline stream cards

No consistent shadow tier exists. The inset shadow pattern is applied inconsistently (TimelineStream, CategoryFilterBar, all settings sections) and adds visual noise.

### 1.5 Missing Font Loading in `layout.tsx`

`ui-context.md:73` states "Fonts loaded via `next/font` (self-hosted)". However, `src/app/layout.tsx:12-24` does **not** load Cabinet Grotesk, Inter, or JetBrains Mono via `next/font`. The `globals.css` declares them as `font-family` fallbacks, but the actual font files are never referenced. The app falls back to system fonts.

---

## 2. UI Structure & Navigation

### 2.1 Navbar Architecture

**File:** `src/components/layout/Navbar.tsx`

**Positives:**
- Gooey tabs navigation is visually distinctive and uses SVG filter for the "melt" effect
- Tracking status indicator with pulse animation is clear
- Frameless window controls integrated for Tauri

**Issues:**

2.1.1 **No active-tab persistence on page load.** `activeIndex` is derived from `pathname` (`Navbar.tsx:35`), which is correct. However, `GooeyTabs` initializes with `defaultActiveIndex={currentActiveIndex}`, which remounts on every navigation. The motion pill animates correctly but the SVG filter re-applies on each nav change, causing a brief flash.

2.1.2 **Brand wastes horizontal space.** The left-side brand takes ~180px (`Navbar.tsx:76-88`) with "十六" + "SHODASHA" + "Time & Focus" tagline. In a 1200px window, this is ~15% of navbar. The tagline "Time & Focus" at `text-[10px]` is nearly illegible.

2.1.3 **Window controls for non-Tauri context.** `Navbar.tsx:45-67` — minimize/maximize/close buttons check `isTauri()` but on `npm run dev` (browser), they do nothing. The buttons still appear, giving the impression they're broken.

2.1.4 **Tab colors create visual cacophony.** Each tab has a different color (`emerald`, `teal`, `violet`, `amber`, `stone`). When toggling between tabs, the gooey pill changes color, creating inconsistent branding. The anti-slop rule says "Single accent locked" (`ui-context.md:8`).

### 2.2 Page Structure

2.2.1 **Dashboard (`/`):** Clean layout. `max-w-7xl` container with gapless bento grid. However, `RecentActivityFeed` always shows "Today" as the timestamp for every task (`RecentActivityFeed.tsx:43`) — it should show relative time or actual date.

2.2.2 **Board (`/board`):** Minimal wrapper (`page.tsx:9` lines). Good. The `KanbanBoard` component has an `isMounted` state guard that prevents hydration mismatch but causes a flash — columns appear on second render.

2.2.3 **Habits (`/habits`):** Long page with 5 sections. Staggered entry animations (0.05s–0.2s delays) provide a nice cascade on load. However, the motion animations have no `prefers-reduced-motion` guards.

2.2.4 **Timeline (`/timeline`):** Most complex page. 15-second auto-refresh interval (`page.tsx:23`). Four draggable widgets. Date selector with hidden `<input type="date">` trick (`TimelinePage.tsx:116-124`) — the input has `opacity-0` and `cursor-pointer`, making it functionally invisible. Users won't know they can click it.

2.2.5 **Settings (`/settings`):** Staggered children animation on page mount. Four sections. The "Doppelrand" pattern (`p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ...`) is used heavily but inconsistently (category manager uses it, tracking preferences uses it, but they don't share a component).

---

## 3. Components Deep Dive

### 3.1 Dashboard Components

| Component | Lines | States Handled | Issues |
|---|---|---|---|
| `TodayProgressCard` | 148 | Full data only | **Missing `'use client'`** — will fail in static export; no loading state; streak calc duplicated across 3 components; taskProgress shows `0%` when `totalTasks=0` |
| `QuickTaskInput` | 43 | Normal + disabled | Solid. Minor: no feedback on add success |
| `HabitQuickToggle` | 70 | Normal + done, empty | Empty state shows nothing useful (blank card) |
| `TimeDistributionChart` | 77 | Full data only | No empty state (breakdown returns `[{work: 0, label:..., 0%}, ...]` even with no data) |
| `RecentActivityFeed` | 71 | Full data only | No empty/loading state; `slice(0,3)` independent of sort; "Today" for all timestamps |

**Critical:** `TodayProgressCard.tsx` is **not** a client component (no `'use client'`) but uses `useTaskStore`, `useHabitStore`, `useTimeEntryStore`, and `useMemo`. Next.js static export will error at build time.

### 3.2 Board Components

| Component | Lines | States Handled | Issues |
|---|---|---|---|
| `KanbanBoard` | 205 | Full + drag overlay | `isMounted` pattern causes flash; no loading state for initial data |
| `KanbanColumn` | 182 | Normal, empty, drag-over | DnD on column via `useSortable` + `GripVertical` — good. Empty slot with dashed border + "Add a task" — good |
| `KanbanCard` | 139 | Normal, done, dragging, has-tags | Solid. Smooth spring transitions |
| `TaskModal` | 212 | Open/closed, edit mode | Form resets on task change via `useEffect`. No validation feedback. No "unsaved changes" warning |
| `AddColumnModal` | 79 | Open/closed | Minimal. Works. |

**Bug in `KanbanColumn`: `deleteColumn` parameter mismatch**
At `taskStore.ts:200`:
```ts
tasks: state.tasks.map((task) => (task.id === id ? { ...task, status: 'todo' } : task)),
```
This should be `task.status === id` — currently it matches task IDs against column IDs, so **deleting a column doesn't actually move its tasks to 'todo'**. It moves the task whose `id` matches the column `id`, which is coincidental at best.

### 3.3 Habit Components

| Component | Lines | States Handled | Issues |
|---|---|---|---|
| `HabitCalendar` | 295 | Normal, empty, future-disabled | CSS variable mismatch (see §1.1); no loading state; overflow-x scroll on table forces horizontal scroll |
| `HabitAnalyticsDashboard` | 638 | Full data only | Massive component (638 lines); inline SVG with no loading state; multiple custom tooltip systems (hoveredLinePoint, hoveredBarDay, hoveredRingHabit) each with separate state management; no empty state |
| `HabitHeatmap` | 162 | Full data only | No empty state (renders all white cells if no data); `min-w-[650px]` container forces horizontal scroll |
| `HabitStatsCard` | 147 | Full data only | No loading/empty state. Shows "0 / 0 (0%)" when no habits exist |
| `HabitAchievements` | 203 | Full only, locked/unlocked | No loading. Handles locked vs unlocked states well. Hover overlay is well-executed |
| `AddHabitModal` | 192 | Open, edit mode, form validation | Animated via `AnimatePresence`. Color picker with presets + spring animations. Solid |

### 3.4 Timeline Components

| Component | Lines | States Handled | Issues |
|---|---|---|---|
| `CategoryFilterBar` | 132 | Filter states, active pills | Motion pill with `layoutId` for timeframe selector. Search with clear button. Solid |
| `ActivityDistributionChart` | 195 | Full data only | No empty state; `AnalyticsKPIGrid` renders 4 KPIs with "None" / "0%" even with no data |
| `TimelineStream` | 189 | Normal, idle, empty, task-linked | Empty state is well-designed (inner depressed card). Idle entries get Moon icon. Missing: error state |
| `LineChart` | 198 | Normal, empty | Returns `null` if `data.length === 0`. No fallback placeholder |
| `RingChart` | 99 | Normal | No empty state. Renders full ring with 0% slices |
| `BarChart` | 65 | Normal | No empty state |

### 3.5 Settings Components

| Component | Lines | States Handled | Issues |
|---|---|---|---|
| `AppCategoryManager` | 245 | Normal, filtered, empty-search, modal | Handles search with no results. Modal for adding executables. Good. But "Clear" actually only clears `localStorage`, not SQLite |
| `TrackingPreferences` | 154 | All sliders/toggles | Custom switch component with `motion.span` layout animation. Polling interval slider with gradient background. Solid |
| `DataManagement` | 248 | Normal, export success, confirm stages | Two-stage confirmation for DB reset. However, `handleClearDatabase` only calls `localStorage.clear()` and `window.location.reload()` — it **does not clear the actual SQLite database** |
| `AppearanceSettings` | 125 | Theme modes, accent selection | Motion `layoutId` for theme pill animation. Accent color picker with ring selection. Solid |

---

## 4. Charts & Data Visualization

### 4.1 Approach

All charts are **custom SVG built with React + Motion (Framer Motion)**. No Recharts or third-party chart library is used despite `architecture.md:16` listing "Animata graphs + Recharts (if needed)". The custom SVGs are:

| Chart | Location | Type | Animations |
|---|---|---|---|
| Time Distribution | `TimeDistributionChart.tsx` | Stacked horizontal bar (CSS) | `transition-all duration-500` |
| 14-Day Trend | `HabitAnalyticsDashboard.tsx` | Curved line chart (SVG) | `pathLength` animation |
| Per-Habit Rings | `HabitAnalyticsDashboard.tsx` | Donut rings (SVG) | `strokeDasharray` transition |
| Weekday Bars | `HabitAnalyticsDashboard.tsx` | Vertical bars (CSS height) | `height` animation via Motion |
| Cumulative Screen Time | `LineChart.tsx` | Dual-series line chart (SVG) | `pathLength` on both paths |
| Category Ring | `RingChart.tsx` | Multi-slice donut (SVG) | `strokeDasharray` staggered |
| App Duration Bars | `BarChart.tsx` | Horizontal bars (CSS width) | `width` animation via Motion |
| Heatmap | `HabitHeatmap.tsx` | 24-week grid of cells (CSS) | `whileHover` scale spring |

### 4.2 Issues with Custom SVGs

4.2.1 **No Responsive Sizing:** `chartWidth` is hardcoded (800px in `HabitAnalyticsDashboard`, 650px in `LineChart`, 180px in `RingChart`). SVGs use `viewBox` with `w-full h-auto`, which works for width but aspect ratio is locked. The `LineChart.tsx` SVG has `height={220}` but the wrapper has `h-auto`, causing the chart area to compress/expand unpredictably.

4.2.2 **No Loading Skeleton State:** All charts render immediately with empty/default data. The cumulative chart returns placeholder points (`{timestamp: '12:00 AM', ...}`) when empty (`timeEntryStore.ts:306-310`), which gives a false sense of data.

4.2.3 **Hover Tooltip Inconsistency:** Three different tooltip implementations exist:
- `HabitAnalyticsDashboard` uses floating `motion.div` positioned with percentage-based `left/top` relative to SVG dimension ratios (lines 380-398)
- `LineChart` uses a text readout above the SVG and circle radius changes (lines 172-179)
- `HabitHeatmap` uses CSS `group-hover` with absolute positioning (lines 131-146)

Each has different styling, animation, and positioning logic.

4.2.4 **Hardcoded Emerald Color:** `HabitAnalyticsDashboard.tsx` hardcodes `#10b981` for SVG strokes, fills, and gradients (lines 287-288, 356, 361, 368). If the user changes accent color in settings, these charts won't update.

### 4.3 Data Flow to Charts

All chart data flows: **SQLite → Tauri IPC → Zustand store computed getter → React component**. The computed getters (e.g., `getCategoryBreakdownToday`, `getCumulativeScreenTimeFiltered`, `getKPIsFiltered`) are pure functions over `entries` and `categories` state. This means:

- **Every chart re-render recomputes from scratch** — no memoization layer between store and chart
- **Data is computed in the store**, not in a selector/derived atom — this couples chart logic to store internals
- **Filtered data mixes client-side filtering with DB queries** — `getFilteredEntries` filters the in-memory array, but data was loaded by date, not by category. Category filtering is entirely client-side after a date-scoped DB fetch

---

## 5. State Management & Data Flow

### 5.1 Store Architecture

| Store | File | State Size | Computed Getters | Side Effects |
|---|---|---|---|---|
| `uiStore` | `uiStore.ts` | 3 values | 0 | Theme toggle mutates DOM directly |
| `taskStore` | `taskStore.ts` | 2 arrays | 0 | Writes to DB on every mutation |
| `habitStore` | `habitStore.ts` | 2 collections | 0 | Writes to DB + cross-store task mutation |
| `timeEntryStore` | `timeEntryStore.ts` | 8 values | 8 computed getters | Writes to DB on category/task-link changes |
| `settingsStore` | `settingsStore.ts` | 6 values | 0 | Writes to DB + DOM mutation |

### 5.2 Data Flow Pattern

```
AppInitializer.tsx
  ├── taskStore.initializeTasks()     → invoke('get_tasks')
  ├── habitStore.initializeHabits()   → invoke('get_habits') + invoke('get_habit_records')
  └── timeEntryStore.initialize...()  → invoke('get_time_entries') + invoke('get_app_categories')
```

All three fire simultaneously in `useEffect` (`AppInitializer.tsx:9-13`). There is no coordination mechanism — if one fails, the others proceed regardless. No error handling per-store (stores catch at the `db.ts` level and return `null`).

### 5.3 Issues

5.3.1 **Optimistic updates without rollback.** All stores optimistically update Zustand state first, then fire async DB writes. If the DB write fails (caught silently by `db.ts`), the Zustand state is out of sync with SQLite. The app shows data that was never persisted.

5.3.2 **No loading/error state variables.** No store exposes `isInitializing`, `isLoading`, or `error` state. Components cannot distinguish between "no data yet" and "no data exists." The `isRefreshing` flag in `timeEntryStore` is the only loading indicator across all stores.

5.3.3 **Cross-store coupling.** `habitStore.toggleHabit()` (line 86-90) directly calls `useTaskStore.getState().moveTask()` to auto-complete linked tasks. This creates a hard dependency between stores and makes testing habit logic require the task store.

5.3.4 **Stale `updated` reference in taskStore.** At `taskStore.ts:131`:
```ts
const updated = get().tasks.find((t) => t.id === id)
```
This reads state after `set()` was called on line 124, which is inside the same synchronous call. `set()` in Zustand batches synchronously, so `get()` returns the **new** state. This actually works, but the code pattern is misleading — it looks like it's reading stale data.

5.3.5 **`toggleHabitRecordInDb` always creates/deletes records.** The domain rule (#5 in CONTEXT.md) says "HabitRecord is created lazily" — toggling on creates, toggling off deletes. The `toggleHabitRecordInDb` function in `db.ts` uses `invoke('toggle_habit_record', { id, habitId, date, done })` — but the Rust backend signature isn't in the codebase (expected in `src-tauri`). The pattern is unclear whether it upserts or creates/deletes.

5.3.6 **Settings store themes don't sync with UI store.** `settingsStore` manages `themeMode` (light/dark/system) and mutates the DOM. `uiStore` manages `theme` (light/dark) and also mutates the DOM. Both apply the dark class independently — they can conflict. The navbar uses `useUIStore().toggleTheme()` while the settings page uses `useSettingsStore().setThemeMode()` — two theme systems.

5.3.7 **Missing IPC commands.** `architecture.md` lists 15 IPC commands in capabilities. But `db.ts` calls these additional commands not listed:
- `get_tasks` (called in `fetchTasksFromDb`, line 11)
- `get_habit_records` (line 68)
- `create_habit` (line 78)
- `delete_habit` (line 89)
- `toggle_habit_record` (line 96)
- `get_habit_records` (line 68)
- `link_task_to_time_entry` (line 126)
- `set_auto_start` (line 155)
- `export_time_entries_csv` (line 165)
- `export_habits_csv` (line 176)

These will **silently fail at runtime** in Tauri if not registered in capabilities.

---

## 6. UX Audit

### 6.1 Cognitive Load Per Page

| Page | Load Assessment | Problem Areas |
|---|---|---|
| Dashboard | Medium-high | 5 distinct data sections; 3 metrics with fractions; time shown as `h m`; distribution bar with 3 segments; activity feed with mixed item types |
| Board | Low | Single kanban. Columns + cards. Very clear |
| Habits | High | 5 sections stacked vertically: stats (4 cards) → analytics (3 charts) → calendar (matrix table) → achievements (7 cards) → heatmap (24-week grid). The page is **very long** with 110 lines of page.tsx driving ~1,500 lines of components |
| Timeline | High | 4 draggable widgets + filter bar + date navigation + refresh. The KPI grid shows 4 metrics with eyebrow labels that use ALL CAPS ("SYSTEM ON-TIME", "FOCUS LOGS") which reduces readability |
| Settings | Medium | 4 sections with different interaction patterns (search, slider, switch, select, buttons, color picker). The "Doppelrand" double-border styling adds visual complexity |

### 6.2 Information Density Issues

6.2.1 **Habits Page is an information wall.** The user sees: 4 stat cards, a performance insight banner, 3 analytics charts (line + rings + bars), a 31-column matrix table, 7 achievement cards, and a 168-cell heatmap. All on one scroll. There's no progressive disclosure — everything is visible at once.

6.2.2 **Timeline duplicate metrics.** The `AnalyticsKPIGrid` shows "Computer On Time Today" and "Active Screen Time" — these are closely related. The `CumulativeScreenTimeWidget` beneath it shows the same data as a line chart. The `DistributionChartsWidget` shows category breakdown as a ring chart. The user sees the same tracked time data represented 3 different ways on one page.

6.2.3 **Fractional progress indicators everywher.** Dashboard task progress: `3 / 10 (30%)`. Habits checked: `2 / 5`. HabitStatsCard: `2 / 5 (40%)`. Streak: `3 days`. 30-day check-ins: `45 check-ins`. Active habits: `5 Habits`. The user must parse 5+ metrics before acting.

### 6.3 Empty / Loading / Error States

| State | Dashboard | Board | Habits | Timeline | Settings |
|---|---|---|---|---|---|
| Loading | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Static content |
| Empty (no data) | Partial (shows 0/0) | Partial (empty columns) | Partial (calendar shows empty) | Partial (KPI shows "None") | N/A |
| Error | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| First-run | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |

The app has **no loading skeletons, no error states, and no first-run onboarding**. Data loads asynchronously, but every component renders immediately with empty defaults. Users see "0 / 0", "0 Days", "0%" until data arrives.

### 6.4 Interaction Feedback

| Action | Feedback | Missing |
|---|---|---|
| Toggle habit | Check icon spring animation | No haptic/tactile feel; no sound |
| Add task (quick) | Form submits, UI updates | No success toast |
| Move task between columns | DnD animation, card follows cursor | No "dropped" confirmation |
| Refresh data | Spinner icon | Text changes to "Refreshing..." but no completion notification |
| Clear database | Double-confirmation modal | No actual DB call — only localStorage |
| Export CSV | Button label changes to "Exported!" | 3-second timeout resets text; no file-save dialog confirmation |
| Theme toggle | Sun/Moon icon swap | No animation between modes |
| Save task details | Modal closes, no feedback | User doesn't know if save succeeded (no error handling shown) |

### 6.5 Navigation Clarity

- **Tab bar is clear** — icons + labels + gooey active state. Good.
- **No breadcrumbs** — user cannot tell "where they are" within a page (e.g., which habit is being edited)
- **No back navigation** — once you open a modal (TaskModal, AddColumnModal, AddHabitModal), there's no browser back support
- **Date navigation in Timeline** — the chevron buttons + hidden date input + "Back to Today" button are three different mechanisms. Users won't discover the hidden `<input type="date">` (opacity-0, positioned absolute over the date label)

### 6.6 Where Users Will Feel Confused

1. **"Why are my habits not colored?"** — The undefined CSS variables (`--border-subtle`, `--accent-emerald`, etc.) mean habit components render without proper styling. Borders disappear, backgrounds are transparent.

2. **"I cleared my data, but it came back."** — `DataManagement.clearDatabase()` only clears `localStorage`, not the SQLite DB. On next app restart, data reloads from SQLite.

3. **"What does this number mean?"** — Dashboard shows `3 / 10 (30%)` for tasks. Is 30% good? Bad? There's no benchmark, no target, no color coding (red/yellow/green).

4. **"Why are some tabs different colors?"** — Each nav tab has a different Tailwind color. The gooey pill morphs between colors. The branding inconsistency is noticeable.

5. **"My charts are empty."** — All charts render with empty defaults. The `LineChart` returns `null` when `data.length === 0`. The `RingChart` shows "65%" even when there's 0 data — wait, no, it shows the actual value but with a full track circle.

6. **"What's a 'doppelrand'?"** — The double-bezel card pattern appears in Timeline and Settings but isn't used in Dashboard or Habits. It's visually distinctive but inconsistent.

---

## 7. Accessibility Audit

### 7.1 Color-Only Indicators

- **Habit completion status** — Only indicated by color (green dot for done, no dot for not done). Screen reader users cannot distinguish.
- **Category in TimelineStream** — Only color-coded dots (emerald/amber/red) with no text labels on the timeline dots.
- **Heatmap intensity** — Only green shade variation. No pattern or text label.

### 7.2 Missing ARIA Labels

- `KanbanColumn.tsx:86` — `GripVertical` drag handle has `title="Drag column"` but no `aria-label`
- `AddHabitModal.tsx:130-142` — Color swatch buttons have `title={c.name}` but no `aria-label`
- `AppCategoryManager.tsx:141-149` — Category selector buttons have `title` via template but no `aria-label`
- `TimelineStream` — The `<select>` for linking tasks uses `<option value="" disabled>` as placeholder but `aria-label` is missing

### 7.3 Keyboard Navigation

- **GooeyTabs**: Keyboard handling is implemented (`gooey-tabs-shared.ts:64-113`) with Arrow keys, Home/End. Good.
- **KanbanBoard**: Uses `KeyboardSensor` from `@dnd-kit`. Accessible.
- **HabitCalendar**: The checkbox grid cells are `<button>` elements, keyboard-accessible.
- **Settings toggles**: Custom switches (`role="switch"`, `aria-checked`) implemented as `<button>` elements. Accessible.

### 7.4 Reduced Motion

Despite code-standards.md:35 requiring `prefers-reduced-motion` on every animated element:

- `HabitAnalyticsDashboard.tsx` — `motion.path` with `pathLength`, `motion.div` with staggered children — **no reduced-motion guard**
- `HabitCalendar.tsx` — Spring animation on check icon — **no reduced-motion guard**
- `LineChart.tsx` — `pathLength` animation on both series — **no reduced-motion guard**
- `BarChart.tsx` — `width` animation — **no reduced-motion guard**
- `RingChart.tsx` — `strokeDasharray` animation — **no reduced-motion guard**
- `HabitStatsCard.tsx` — `whileTap: scale(0.98)` — **no reduced-motion guard**
- `TodayProgressCard.tsx` — `animate-ping` on tracking indicator — **no reduced-motion guard**

The only component that partially respects reduced motion is `GooeyTabs` with `motion-reduce:transition-none` in `gooey-tabs.tsx:311`.

---

## 8. Code Quality & Maintainability

### 8.1 Missing Type Safety

- `taskStore.ts:59` — `dbTasks.map((t: any))` — `any` type. Same pattern in `habitStore.ts:50`, `timeEntryStore.ts:119`
- `KanbanBoard.tsx:33` — `setActiveColumn<any>` — `any` type
- `ActivityDistributionChart.tsx` — No TypeScript strict types on IPC returns

### 8.2 Barrel Export Inconsistency

- `components/dashboard/index.ts` — `export {}` — empty barrel
- `components/board/index.ts` — `export {}` — empty barrel
- `components/habits/index.ts` — `export {}` — empty barrel
- `components/timeline/index.ts` — `export {}` — empty barrel
- `components/settings/index.ts` — Proper re-exports (only settings has working barrel)

### 8.3 Duplicated Logic

**Streak calculation appears 3 times:**
1. `TodayProgressCard.tsx:28-49` — Dashboard
2. `HabitStatsCard.tsx:17-35` — Habits page stats
3. `HabitAchievements.tsx:61-78` — Achievements system

All three implement the identical algorithm (walk backwards from today, check if any habit was done). This should be a shared utility.

**Duration formatting appears 6+ times:**
`formatDuration` / `formatSeconds` functions exist in: `TimeDistributionChart.tsx:16`, `TimelineStream.tsx:37`, `CategoryFilterBar.tsx:25`, `ActivityDistributionChart.tsx:20`, `LineChart.tsx:21`, `TodayProgressCard.tsx:23` (inline). Each is slightly different (some show "Active" for null, some show "0m").

### 8.4 Inline Comment Density

Components have excessive self-describing comments:
- `HabitAnalyticsDashboard.tsx:263` — `"Continuous volume trend with explicit X & Y axes and gradient velocity"`
- `HabitAnalyticsDashboard.tsx:275` — `"Full Width Line Chart SVG"`
- `KanbanCard.tsx:30` — `"Apple design: spring-like transition"`
- `TodayProgressCard.tsx:54` — `"Background Subtle Gradient wash"`
- `TimelineStream.tsx:107` — `"Doppelrand Double-Bezel Stream Card"`

These comments describe *what* the code does rather than *why*, adding noise without value.

---

## 9. What's Missing

### 9.1 Missing States (Critical)

| State | Where Needed | Current Behavior |
|---|---|---|
| Loading skeleton | Dashboard, Charts, Board, Calendar | Nothing renders until data arrives |
| Error banner | All pages on DB failure | DB errors logged to console only |
| First-run onboarding | Dashboard, Habits, Board | No explanation of what the app does |
| Offline (not Tauri) mode | All pages | Functions imported from Tauri silently fail |
| Network error | None (offline app) | N/A |
| Data freshness indicator | Dashboard, Timeline | Only "Live Sync Active" text badge |
| Empty state for charts | All chart components | Show 0 values or null |

### 9.2 Missing Features (from shape-brief.md)

| Feature | Specified | Implemented |
|---|---|---|
| Per-task time attribution | `shape-brief.md:48` | `timeEntryStore.linkTaskToTimeEntry()` exists but no UI integration beyond TimelineStream select |
| Weekly chart view | `shape-brief.md:57` | Not implemented. `timeEntryStore` has `selectedTimeframe: 'today' \| '7days' \| 'all'` but no weekly chart component |
| Per-habit streak counter | `shape-brief.md:56` | Not implemented. Only global streak exists |
| Skeleton screens | `shape-brief.md:90` | Not implemented anywhere |
| In-app guide on tracking permission denied | `shape-brief.md:91` | Not implemented |
| "Collecting data..." state | `shape-brief.md:88` | Not implemented |
| "XX minutes tracked while away" | `shape-brief.md:93` | Not implemented |

### 9.3 Missing Feedback Mechanisms

- **No toast/notification system** for save confirmations, errors, or async operation results
- **No loading indicator per action** (saving task, toggling habit, exporting CSV)
- **No optimistic update rollback** when DB write fails
- **No confirmation for destructive actions** beyond the DataManagement double-confirm (deleting a column from KanbanColumn has no confirmation)
- **No undo** for any action (delete task, delete habit, clear database)

### 9.4 Missing Architectural Concerns

- **No error boundary** at app level — any render error crashes the entire app
- **No service worker** or offline detection
- **No telemetry or error reporting** (intentional for privacy, but no user-facing "report issue" mechanism either)
- **No data migration strategy** beyond the schema_version table — the existing store code has no migration runner
- **No performance monitoring** — no measurement of IPC call latency, render times, or store subscription counts

---

## 10. Anti-Slop Compliance Report

| Rule | Status | Violations |
|---|---|---|
| No pure black/white | ⚠️ Partial | `AddHabitModal.tsx:143` — `text-white` on Check icon |
| No italic headings | ✅ Clean | All headings are roman |
| No purple/blue gradients | ❌ Violated | `DataManagement.tsx:78` — violet badge; `Navbar.tsx:24-27` — teal, violet tabs |
| No glassmorphism | ❌ Violated | `Navbar.tsx:72` — `backdrop-blur-md` on header |
| No ease-in animations | ✅ Clean | All custom animations use `easeOut` or spring |
| No scale(0) | ⚠️ Partial | `HabitCalendar.tsx:267` — Check icon starts at `scale: 0` on spring animation |
| No hardcoded colors bypassing tokens | ❌ Violated | Multiple (see §1.2) |
| No emoji in UI | ✅ Clean | All icons use lucide-react |
| Single accent locked | ❌ Violated | Navbar tabs have 5 different colors |
| prefers-reduced-motion | ❌ Violated | No guards on 8+ animation components (see §7.4) |

---

## 11. Summary of Critical Issues (P0)

1. **`TodayProgressCard.tsx` missing `'use client'`** — will fail in Next.js static export build
2. **11 undefined CSS variables** — habit components render without styling; undetectable in dev tools without inspecting computed styles
3. **`deleteColumn` bug** — `task.id === id` should be `task.status === id` — tasks aren't migrated when columns are deleted
4. **IPC commands missing from capabilities** — 10+ commands in `db.ts` not listed in `architecture.md` capabilities; will silently fail in Tauri
5. **Clear Database does nothing to SQLite** — only clears localStorage; data persists
6. **Two competing theme systems** — `uiStore.toggleTheme()` and `settingsStore.setThemeMode()` mutate the same DOM attribute with different logic
7. **No loading/error states anywhere** — every component assumes data exists
8. **Reduced motion not respected** — 8+ animation components lack `prefers-reduced-motion` guards
9. **Settings barrel is the only working barrel** — 4 of 5 index.ts files export nothing
10. **Font files not loaded via next/font** — Cabinet Grotesk, Inter, JetBrains Mono declared but never loaded
