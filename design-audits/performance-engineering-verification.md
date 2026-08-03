# Performance Engineering Audit — Verification Report

Companion to `performance-engineering-audit.md`. Every claim in the original audit was re-checked against current source (Aug 2026).

Status legend: ✅ verified still true · 🔧 already fixed · ⚠️ moved/downgraded · ❌ outdated (false in current code)

---

## 1. Audit claim verification

### Already implemented (original top-10 fixes now done)

| Original claim | Status | Evidence |
|---|---|---|
| **#1 CRITICAL** — timer interval leak, `cleanupTimerStore()` never called | 🔧 FIXED | `TimerPage.tsx:27-31` calls `cleanupTimerStore()` in `useEffect` cleanup. `NotificationScheduler.tsx:12` clears its interval. No live interval leaks found. |
| **#3 HIGH** — `habitStore` spreads 930-key `records` map per toggle | 🔧 FIXED | `habitStore.ts:83` uses `immer`; `toggleHabit` mutates `state.records[key]` in place (176-178) — single-key update, optimistic + rollback on DB failure. |
| **#5 HIGH** — memo missing on `KanbanCard`/`KanbanColumn` | 🔧 FIXED | `KanbanCard.tsx:3,17` `React.memo`; `KanbanColumn` memoized. |
| **#6 HIGH** — default motion on every `BaseCard` | 🔧 FIXED | `BaseCard.tsx` (121 lines) contains no motion — plain div + CSS `animate-card-enter` (globals.css:560-572). |
| §7.1 MEDIUM — notification interval leak risk | 🔧 FIXED | `NotificationScheduler.tsx:9-13` — interval cleared on unmount; action ref is stable. |
| §5.1 HIGH — `KanbanCard` calls `getTaskLoggedSeconds()` non-reactively | 🔧 FIXED | `KanbanCard.tsx:19` now reads reactive memoized field `taskLoggedSecondsMap[task.id] ?? 0`. |

### Verified still true

| Claim | Status | Evidence |
|---|---|---|
| §5.3 getter functions never referentially stable | ✅ | `timeEntryStore.ts`: `getFilteredEntries` (501), `getKPIsFiltered` (658), `getTopAppsFiltered` (554), `getCumulativeScreenTimeFiltered` (587), `getActivePeriods` (756), `getTotalFocusSecondsToday` (462), `getDailyUsageHours` (722), `getAppRankingByHours` (819) — full recompute per call. |
| §5.1 HIGH — `TaskModal` reads store non-reactively | ✅ | `TaskModal.tsx:119` `useTimeEntryStore.getState().taskLoggedSecondsMap[task.id]` — logged time shown is stale while modal open. Trivial fix: same selector `useTimeEntryStore((s) => s.taskLoggedSecondsMap[task.id])`. |
| §6.1 `StreakDisplay` infinite JS loop | ✅ | `StreakDisplay.tsx:131-133` `y: [-1,1,-1]` `repeat: Infinity` 2.5s. |
| §6.1 `AchievementBadge` infinite JS loop | ✅ | `AchievementBadge.tsx:74-87` `y: [-2,2,-2]` `repeat: Infinity` 3.5s **on every unlocked badge** + `layout` (68). Grows unbounded with unlocked badges. |
| §8 #7 no `will-change` anywhere | ✅ | 0 hits in `src/` and `globals.css` despite ~15 continuous animations. |
| §8 #8 dnd-kit not lazy-loaded | ✅ | `board/page.tsx` imports `KanbanBoard` statically; dnd-kit ships in every page bundle. |
| §6.2 `layout` animations on cards/columns | ✅ | `KanbanCard.tsx:74-75`, `KanbanColumn.tsx:96-97` — layout measure/animations on every card + column during DnD. |

### Outdated / wrong in current code

| Claim | Status | Evidence |
|---|---|---|
| §5.1 CRITICAL — `SkillOctagon` stale-data on dashboard | ⚠️ DOWNGRADED | `SkillOctagon` now used only in `GamificationSettings.tsx:67` (settings page) — correctness risk remains but impact is minimal. |
| §5.2 HIGH — habitStore spread copy | 🔧 FIXED | Immer, see above. |
| §6.1 `XPProgressBar.tsx:163` floating medal loop | ❌ | File is 125 lines; only a one-shot width animation (105-111). Claim obsolete. |
| §7.1 CRITICAL timer leak | 🔧 FIXED | See above. |
| §7.2 `SettingsStore.ts:87-96` classList mutation | ⚠️ MOVED | Store is now `settingsStore.ts`; issue replaced by coarse `persistAllSettings` (see §2.6). |

### Not re-verified (line drift, low value)

`HabitCalendar.tsx:37` tasks subscription · `HabitCalendar.tsx:224-233` motion.tr · `TimelineStream.tsx:111-119` (file is dead code — see §2.4) · `SkillOctagon.computeAxesScores` internals.

---

## 2. New findings (current code)

### HIGH

**2.1 Memoized derived state exists, but components call un-memoized getters in render.**
`timeEntryStore.ts` maintains fully memoized derived fields — `filteredEntries`, `filteredKPIs`, `filteredTopApps`, `filteredCumulativeScreenTime`, `totalFocusSecondsToday`, `taskLoggedSecondsMap` (101-109), recomputed only when source data changes (`computeDerivedState`, 164-349). Yet components bypass them:

| Call site | Getter | Cost |
|---|---|---|
| `HabitAchievements.tsx:25` | `getTotalFocusSecondsToday()` | O(n) per render |
| `ActivePeriodsTimeline.tsx:9-11` + `TimeSlotScheduleStripWidget.tsx:11` | `getActivePeriods(selectedDate)` — **computed twice per timeline render** | O(n log n) each |
| `DailyUsageBarChart.tsx:22-23` | `getDailyUsageHours()` | O(n) per render, re-run on every 15s tick |
| `AppRankingChart.tsx:14` | `getAppRankingByHours()` | O(n log n) per render |
| `TotalTaskMultiLineChartWidget.tsx:13` | `getTotalFocusSecondsToday()` | O(n) per render |
| `KanbanCard.tsx:20-21` | `getSubTasks(task.id)` per card | O(n log n) per card; N cards → O(n² log n) on board render (memo limits re-runs) |
| `KanbanColumn.tsx:81-89` | `parentTasks` + `subTaskMap` rebuilt every render, no `useMemo` | O(n) per column |

Fix: read the memoized fields via granular selectors; move `subTasks` into a store-derived map; store `getActivePeriods` output as a derived field.

**2.2 Timeline page refreshes and re-renders in background tabs.**
`timeline/page.tsx:15` destructures the **entire store** (no selectors) + lines 17-23 run `setInterval(refreshAllData, 15000)` with **no `document.visibilityState` guard** (the only visibility check in the app is `AppInitializer.tsx:21`). Each tick: 2 IPC calls (`fetchTimeEntriesFromDb` + `fetchAppCategoriesFromDb` via `initializeTimeEntries`, 383-384) → full `computeDerivedState` → re-render of every subscribed widget. Same for `NotificationScheduler` (60s, incl. `getIdleSeconds()` IPC per tick, notificationStore.ts:158).
Fix: `if (document.visibilityState !== 'visible') return` in both intervals.

**2.3 `getHabitHp` recomputed per calendar cell.**
`HabitCalendar.tsx:252` calls `getHabitHp(habit, records)` per day cell; `habitHealth.ts:29` iterates a 30-day window per call → ~O(habits × 31 days × 30) ≈ 18,600 iterations per render, and every habit toggle re-renders the whole calendar.
Fix: compute a `habitHpMap` once per render with `useMemo` keyed on `records` (or store it).

### MEDIUM

**2.4 Dead code / duplicated logic.**
- `calculateHabitStreak` (`src/lib/utils/streak.ts:17`) is **never imported**; streak logic is inlined 5+ times (Navbar:50, StreakHeroCard, StreakDisplay, HabitStatsCard, HabitAchievements).
- Components with no import sites: `TimelineStream.tsx`, `DraggableGrid.tsx`, `StreakDisplay` (exported via `gamification/index.ts:6`, imported nowhere), `CumulativeScreenTimeWidget` + `DistributionChartsWidget` (`ActivityDistributionChart.tsx:111,156`), and dashboard candidates `JournalingFeatureCard`, `MusicPlayerWidget` (10s media-session poll, dead anyway), `ScheduleActivityCard`, `InsightCard`, `TodayProgressCard`.

**2.5 Timer persists localStorage every second.**
`timerStore.ts:129` calls `persistState` on every 1s tick → synchronous `localStorage.setItem` once per second while running. Elapsed is already recomputed from `startedAt` on load — persist on start/stop/completion only.

**2.6 `persistAllSettings` writes all 8 settings on any change.**
`settingsStore.ts:30-41` — toggling one setting (e.g. theme) writes polling interval, idle detection, threshold, auto-start, goal, retention, theme, accent via `saveSettingsToDb`. Write only the changed key.

**2.7 Five instances of `LivingFlameIcon`, each running 2 infinite framer loops.**
Used at Navbar 16px, StreakDisplay 18px, HabitStatsCard 26px, StreakHeroCard 20px + 44px. Each runs aura scale/opacity + SVG scale/rotate (`LivingFlameIcon.tsx` ~15-35) with `blur-md` (paint cost), all on framer-motion's rAF. CSS keyframes would move these to the compositor.

**2.8 Infinite JS animations that scale with data.**
`AchievementBadge.tsx:78-85` one infinite loop per unlocked badge (unbounded growth) · `HabitHeatmap.tsx:132-135` 168 `motion.div` cells with `whileHover` spring · `HabitCalendar` motion per cell. All on the rAF loop, none with `will-change`.

**2.9 SVG gooey filter around navbar tabs.**
`gooey-tabs.tsx:179-184` — an SVG blur/color-matrix filter region re-rendered on each tab change.

**2.10 Background IPC polling.**
`NotificationScheduler.tsx:11` fires `checkAndTriggerNotifications` every 60s while the app is minimized — includes `getIdleSeconds()` IPC (notificationStore.ts:158). Same visibility guard as 2.2.

### LOW

- `gamificationStore.awardXP` (92-114): `trackedXPKeys` array with `.includes` + spread copy per award → use a `Set`.
- `taskStore.reorderTasks` (258-288) rewrites `order` on all tasks per drag end — fine at current scale.
- `NumberTicker` setState-per-frame for 400ms per value change — several tickers animate concurrently on dashboard load.
- `TodaysTodosChecklistWidget` — 3 non-memoized task filters per render + hardcoded light-theme palette (`bg-[#FFFDF9] text-slate-900`) inconsistent with the dark app (visual bug).
- Mixed `framer-motion` (~12 files) vs `motion/react` (`KanbanCard.tsx:10`) imports — same code (motion depends on `framer-motion@^12.42.2`, verified in `node_modules/motion/package.json`), zero bundle impact; standardize for consistency.
- `openpets.ts:37` re-implements `isTauri()` (also in `db.ts`/`notifications.ts`) — consolidate.

---

## 3. Updated priority list

1. Route components to memoized store fields / granular selectors (kills §2.1) — largest win, touches timeline + board.
2. Visibility-guard both polling intervals (§2.2, §2.10).
3. Memoize habit HP per habit (§2.3).
4. Memoize `subTaskMap`/`parentTasks`; derive sub-task map in `taskStore` (§2.1).
5. Convert infinite framer loops to CSS keyframes (`LivingFlameIcon`, `AchievementBadge`, `StreakDisplay`) (§2.7, §2.8).
6. Delete dead code (§2.4).
7. Fix `TaskModal.tsx:119` with the reactive selector (audit §5.1).
8. Timer: persist only on state transitions (§2.5).
9. `persistAllSettings` → per-key writes (§2.6).
10. Lazy-load dnd-kit board + add `will-change` hints (audit §8 #7/#8).

---

## 4. Verdict

Both original CRITICALs and three of the top-10 fixes are already implemented (timer cleanup, Immer records, memoized cards/columns, motion-free BaseCard, notification scheduler cleanup). The central remaining problem is architectural but mechanical: **the store already memoizes derived state — components just bypass it via getters**. No new CRITICAL issues found. Remaining: 2 HIGH, 7 MEDIUM, 7 LOW.
