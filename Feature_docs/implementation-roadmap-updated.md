# Updated Implementation Roadmap

Based on: redesign.md + gap-analysis.md (all Phase 1-4 findings)
Generated: 2026-07-24

---

## Phase 0: Foundation Fixes (NEW — was not in original redesign.md)

These were discovered as P0 gaps that must be fixed before any feature work begins.

| # | Task | Files | Dependencies |
|---|------|-------|--------------|
| 0.1 | **Persist settings to SQLite** — Create `settings` table in schema, add IPC commands (get_settings, save_settings), wire settingsStore to load/save from DB | `src-tauri/src/db.rs`, `src-tauri/src/commands.rs`, `src/stores/settingsStore.ts`, `src/lib/db.ts` | None |
| 0.2 | **Update habit IPC** — Add `update_habit` command to Rust, wire `habitStore.updateHabit()` to call it | `src-tauri/src/commands.rs`, `src-tauri/src/habit_repo.rs`, `src/stores/habitStore.ts`, `src/lib/db.ts` | None |
| 0.3 | **Persist kanban columns** — Wire taskStore addColumn/renameColumn/deleteColumn/reorderColumns to call existing Rust commands | `src/stores/taskStore.ts`, `src/lib/db.ts` | None |
| 0.4 | **Load fonts via next/font** — Add Geist (or Cabinet Grotesk + Inter) via next/font/google in layout.tsx, remove CSS-only font declarations | `src/app/layout.tsx`, `src/app/globals.css` | None |
| 0.5 | **Add loading/error/initialized to all stores** — AsyncState interface to taskStore, habitStore, timeEntryStore, settingsStore | `src/stores/*.ts` | None |
| 0.6 | **Add `clear_database` IPC command** — Drop all rows from SQLite, call from DataManagement | `src-tauri/src/commands.rs`, `src/components/settings/DataManagement.tsx` | None |

---

## Phase 1: Critical Fixes (unchanged from redesign.md, reordered)

| # | Task | Files | Deps |
|---|------|-------|------|
| 1.1 | Fix missing `'use client'` in TodayProgressCard | `src/components/dashboard/TodayProgressCard.tsx` | None |
| 1.2 | Define all 8 undefined CSS variables in globals.css | `src/app/globals.css` | None |
| 1.3 | Fix `deleteColumn` bug in taskStore | `src/stores/taskStore.ts` | None |
| 1.4 | Fix "Clear Database" to use new `clear_database` IPC | `src/components/settings/DataManagement.tsx` | Phase 0.6 |
| 1.5 | Consolidate uiStore into settingsStore (remove uiStore) | `src/stores/uiStore.ts`, `src/stores/settingsStore.ts`, `src/components/layout/Navbar.tsx` | None |
| 1.6 | Add Sonner toast + basic error feedback for IPC failures | `src/app/layout.tsx`, `src/lib/db.ts` | None |

---

## Phase 2: Design System Foundations (expanded)

| # | Task | Files | Deps |
|---|------|-------|------|
| 2.1 | Complete CSS variable overhaul — all tokens using OKLCH, define spacing/radius/easing/z-index/shadow tokens, remove hardcoded values | `src/app/globals.css` | Phase 1.2 |
| 2.2 | Install shadcn/ui + Sonner + cmdk + Recharts | `package.json`, terminal | None |
| 2.3 | Create shared components: LoadingSkeleton, EmptyState, ErrorBanner, StreamCard | `src/components/ui/*.tsx` | Phase 2.1 |
| 2.4 | Extract streak utility into `src/lib/utils/streak.ts` | NEW file | None |
| 2.5 | Extract formatting utility into `src/lib/utils/format.ts` | NEW file | None |
| 2.6 | Replace hardcoded colors across 22 components with CSS variables | All components (see checklist) | Phase 2.1 |
| 2.7 | Fix HabitHeatmap colors — replace hardcoded emerald levels with CSS vars | `src/components/habits/HabitHeatmap.tsx` | Phase 2.1 |
| 2.8 | Fix `--accent-emerald` → `--accent` in all habits components | 6 habits components | Phase 2.1 |
| 2.9 | Remove 8 backdrop-blur instances (keep only navbar) | Multiple components | None |

---

## Phase 3: Navigation & Shell (updated)

| # | Task | Files | Deps |
|---|------|-------|------|
| 3.1 | Unify Navbar tab colors to single accent | `src/components/layout/Navbar.tsx`, `src/components/ui/gooey-tabs.tsx` | Phase 2.1 |
| 3.2 | Remove tagline "Time & Focus" from Navbar | `src/components/layout/Navbar.tsx` | None |
| 3.3 | Conditionally hide window controls in browser mode | `src/components/layout/Navbar.tsx` | None |
| 3.4 | Add ⌘K command palette | `src/components/ui/CommandPalette.tsx` (NEW), `src/app/layout.tsx` | Phase 2.2 |
| 3.5 | Add Sonner `<Toaster />` to layout | `src/app/layout.tsx` | Phase 1.6 |
| 3.6 | Fix GooeyTabs active-tab persistence flash | `src/components/ui/gooey-tabs.tsx` | None |

---

## Phase 4: Dashboard Redesign (updated)

| # | Task | Files | Deps |
|---|------|-------|------|
| 4.1 | Redesign TodayProgressCard — add 'use client', progress ring, hero stats, loading/empty/error states | `src/components/dashboard/TodayProgressCard.tsx` | Phase 0.5, Phase 2.3 |
| 4.2 | Replace TimeDistributionChart with Recharts | `src/components/dashboard/TimeDistributionChart.tsx` | Phase 2.2 |
| 4.3 | Fix RecentActivityFeed timestamps — relative time ("2h ago", "yesterday") | `src/components/dashboard/RecentActivityFeed.tsx` | Phase 2.5 |
| 4.4 | Add meaningful empty state to HabitQuickToggle (CTA + link to Habits) | `src/components/dashboard/HabitQuickToggle.tsx` | Phase 2.3 |
| 4.5 | Add QuickTaskInput success feedback via Sonner toast | `src/components/dashboard/QuickTaskInput.tsx` | Phase 1.6 |
| 4.6 | Create InsightCard component (daily rotating insight) | `src/components/dashboard/InsightCard.tsx` (NEW) | Phase 0.5 |
| 4.7 | Replace fraction text with progress rings on all metric cards | Dashboard components | Phase 2.3 |

---

## Phase 5: Habits Redesign (expanded)

| # | Task | Files | Deps |
|---|------|-------|------|
| 5.1 | Replace custom SVG charts with Recharts (BarChart for weekly, line for trends) | `src/components/habits/HabitAnalyticsDashboard.tsx` | Phase 2.2, Phase 2.8 |
| 5.2 | Add per-habit streak computation and display | `src/stores/habitStore.ts`, `src/lib/utils/streak.ts` | Phase 2.4 |
| 5.3 | Add loading/empty/error states to all habits components | All habits components | Phase 0.5, Phase 2.3 |
| 5.4 | Replace fraction text (doneCount/30) with progress rings | `HabitCalendar.tsx`, `HabitStatsCard.tsx`, `HabitAchievements.tsx` | Phase 2.3 |
| 5.5 | Fix HabitCalendar horizontal scroll (`overflow-x`) | `src/components/habits/HabitCalendar.tsx` | None |
| 5.6 | Fix HabitHeatmap horizontal scroll (`min-w-[650px]`) | `src/components/habits/HabitHeatmap.tsx` | None |

---

## Phase 6: Timeline Redesign (simplified)

| # | Task | Files | Deps |
|---|------|-------|------|
| 6.1 | Replace hidden date input with shadcn/ui DatePicker | `src/components/timeline/TimelinePage.tsx` | Phase 2.2 |
| 6.2 | Replace mock cumulative data with real computation | `src/stores/timeEntryStore.ts` | Phase 0.5 |
| 6.3 | Replace duplicate charts with single AreaChart + 3 KPI cards | `src/components/timeline/TimelinePage.tsx` | Phase 2.2 |
| 6.4 | Fix ALL CAPS labels to sentence case | Timeline components | None |
| 6.5 | Extract doppelrand pattern into shared StreamCard component | `src/components/ui/StreamCard.tsx`, TimelineStream | Phase 2.3 |
| 6.6 | Add loading/empty/error states to all timeline components | Timeline components | Phase 0.5, Phase 2.3 |

---

## Phase 7: Polish & Micro-interactions (expanded)

| # | Task | Files | Deps |
|---|------|-------|------|
| 7.1 | Add `prefers-reduced-motion` guards to 24 components | All animation components | None |
| 7.2 | Add button press feedback (scale 0.97 on active) to all interactive elements | Global CSS + component updates | None |
| 7.3 | Add Number Ticker animation to stat cards | Magic UI copy-paste | Phase 2.2 |
| 7.4 | Add Confetti on milestone achievements | Magic UI copy-paste | None |
| 7.5 | Add stagger entry animations for lists | Motion variants | None |
| 7.6 | Add standardized tooltip delay (800ms) | Global configuration | None |
| 7.7 | Add aria-labels to all icon-only buttons | All component buttons | None |
| 7.8 | Add hover/focus/active states to all interactive elements | Global CSS | None |
| 7.9 | Add confirmation dialogs for destructive actions | TaskModal, KanbanColumn, habit components | None |
| 7.10 | Add undo support for delete actions (task, habit) | Stores + Sonner | Phase 1.6 |

---

## Phase 8: Passive Insights (unchanged)

| # | Task | Files | Deps |
|---|------|-------|------|
| 8.1 | Create `src/lib/insights.ts` with pattern recognition | NEW file | None |
| 8.2 | Compute peak focus hour | `src/lib/insights.ts` | None |
| 8.3 | Compute best habit/streak insight | `src/lib/insights.ts` | Phase 5.2 |
| 8.4 | Compute distraction ratio trend | `src/lib/insights.ts` | None |
| 8.5 | Build rotating insight pool (5-6 patterns) | `src/lib/insights.ts` | None |
| 8.6 | Display on Dashboard via InsightCard | `src/components/dashboard/InsightCard.tsx` | Phase 4.6 |

---

## Phase 9: Data Integrity & Persistence (NEW — was not a phase)

| # | Task | Files | Deps |
|---|------|-------|------|
| 9.1 | Add data import/restore functionality | `src/components/settings/DataManagement.tsx`, `src-tauri/src` | Phase 0.6 |
| 9.2 | Add `get_settings`/`save_settings` IPC + settings table migration | `src-tauri/src/commands.rs`, `src-tauri/src/db.rs` | Phase 0.1 |
| 9.3 | Wire data retention setting to pruner | `src-tauri/src/prune_service.rs`, `src/stores/settingsStore.ts` | Phase 9.2 |
| 9.4 | Add migration runner (sequential version array) | `src-tauri/src/db.rs` | None |

---

## Priority Matrix (Updated)

### P0 — Must Fix Before Shipping

| Task | Phase | Rationale |
|------|-------|-----------|
| Settings persistence | 0.1 | Data loss without it |
| Habit update IPC | 0.2 | Name/color changes lost |
| Kanban column persistence | 0.3 | Column state lost on restart |
| Font loading via next/font | 0.4 | App uses fallback fonts |
| Store loading/error states | 0.5 | Required by all components |
| Clear Database fix | 1.4 | User trust — button must work |
| 8 undefined CSS variables | 1.2 | Silent rendering bugs |
| Sonner toast + IPC error feedback | 1.6 | User must know when things fail |

### P1 — High Impact

| Task | Phase | Rationale |
|------|-------|-----------|
| Shared components (LoadingSkeleton, etc.) | 2.3 | Needed by all pages |
| Hardcoded color replacement | 2.6 | 22 components affected |
| prefers-reduced-motion | 7.1 | Accessibility violation |
| Relative timestamps | 4.3 | Every activity shows "Today" |
| Per-habit streaks | 5.2 | Core habit metric missing |
| Single accent tab color | 3.1 | Anti-slop violation |
| Replace fraction text | 4.7, 5.4 | UX clarity |
| Aria-labels | 7.7 | Accessibility |

### P2 — Polish

| Task | Phase | Rationale |
|-------|-------|-----------|
| Command palette | 3.4 | Power user feature |
| Confetti on milestones | 7.4 | Delight |
| Number Ticker | 7.3 | Polish |
| Stagger entry animations | 7.5 | Polish |
| Passive insights | 8.x | Differentiation moat |
| Data import | 9.1 | Data sovereignty |
| Undo support | 7.10 | User trust |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Store refactoring breaks existing UI** — Adding AsyncState to all stores requires all consumer components to update | Medium | High | Add new fields alongside existing, migrate components one at a time |
| **CSS variable rename breaks components** — Changing `--accent-emerald` → `--accent` affects 30+ references | Medium | High | Automated grep+replace, verify build |
| **Rust IPC changes require rebuild** — Adding settings persistence requires Tauri rebuild | Low | Medium | Well-scoped, isolated change |
| **Recharts integration breaks chart layouts** — Replacing custom SVGs with Recharts changes dimensions | Medium | Medium | Keep custom SVGs as fallback, compare side-by-side |
| **Font loading changes layout** — next/font may cause CLS if not configured properly | Low | Medium | Use `display: swap`, test on slow connections |

---

## Quick Wins (Most Visible Improvement for Least Effort)

| Task | Effort | Visual Impact | Phase |
|------|--------|---------------|-------|
| Load fonts via next/font | 30 min | 🔥🔥🔥🔥🔥 Entire app typography fixes | 0.4 |
| Define 8 missing CSS variables | 10 min | 🔥🔥🔥🔥 Habits page stops rendering invisible | 1.2 |
| Remove backdrop-blur from 7 components | 30 min | 🔥🔥🔥 Anti-slop compliance | 2.9 |
| Sonner toast + basic error feedback | 1 hour | 🔥🔥🔥 User gets feedback for first time | 1.6 |
| Fix "Clear Database" | 1 hour | 🔥🔥🔥🔥 P0 bug eliminated | 1.4 |
| Unify Navbar to single accent | 30 min | 🔥🔥🔥🔥 Tab bar stops being rainbow | 3.1 |
| Fix relative timestamps | 30 min | 🔥🔥🔥🔥 "Today" bug fixed everywhere | 4.3 |
| Remove tagline from Navbar | 5 min | 🔥🔥 Cleaner header | 3.2 |
