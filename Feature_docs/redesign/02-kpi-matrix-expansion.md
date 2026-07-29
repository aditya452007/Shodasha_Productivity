# Shodasha — 2-3x KPI Matrix Expansion

> **Date:** 2026-07-29
> **Status:** Research complete
> **Base:** `TopKPIGrid.tsx` · `TodayProgressCard.tsx` · `timeEntryStore.ts` · `habitStore.ts` · `taskStore.ts` · `timerStore.ts` · `settingsStore.ts` · `notificationStore.ts`

---

## 1. Current State: 4 KPIs on Dashboard

| # | KPI | Value | Data Source | Viz Type |
|---|-----|-------|-------------|----------|
| 1 | Focus Time Today | `3h 42m` | `getTotalFocusSecondsToday()` (timeEntryStore) | Text + subtitle |
| 2 | Focus Score | `78%` | `getKPIsFiltered().focusScore` (timeEntryStore) | Number + % |
| 3 | Tasks Pending | `5` | tasks.filter(t => t.status !== 'done') (taskStore) | Number |
| 4 | Habit Consistency | `80%` | habits.filter done today / total (habitStore) | Number + % |

**TodayProgressCard** adds 4 more (Daily Goal %, Focus Score repeat, Tasks Completed, Streak) but they're buried inside the card — not top-level glanceable KPIs.

**Problem:** ~120+ data points exist across stores. Only ~8 are surfaced. The app is data-rich but KPI-poor.

---

## 2. Available Data Inventory (What Exists But Isn't Displayed)

### timeEntryStore — getKPIsFiltered() returns 11 fields:
- computerOnTimeSeconds, activeFocusSeconds, idleTimeSeconds
- focusEfficiency (ratio of non-idle to total)
- contextSwitches (count)
- deepWorkRatio, neutralRatio, distractionRatio
- focusScore (composite 0-100)
- topAppName, topAppDurationSeconds

### timeEntryStore — Additional Getters:
- getCategoryBreakdownToday() → work/neutral/distraction (seconds + %)
- getFilteredEntries() → raw entries with filters
- getFilteredFocusSeconds() → filtered sum
- getCategoryBreakdownFiltered() → same as above but with category filter
- getTopAppsFiltered() → ranked list with seconds + % + sessions
- getCumulativeScreenTimeFiltered() → cumulative over day
- getDailyUsageHours(7) → 7-day bar data
- getActivePeriods() → session blocks
- getAppRankingByHours() → ranked with limits
- getTaskLoggedSeconds(taskId) → per-task focus time

### taskStore:
- getActiveTasks() → tasks not done
- getExpiredTasks() → timed-out tasks
- getSubTasks(parentId) → children of a task
- getTodayCompletedTasks() → count of done today
- getTasksByDateRange() → any date range filtered
- Task properties: dueDate, tags, duration, parentId, linkedHabitId, url

### habitStore:
- records Map (by habitId_date) → raw boolean per day per habit
- Ability to compute per-habit streak, best streak, completion rate over N days

### timerStore:
- totalSeconds (session length), remaining, status
- Number of completed sessions today (can be inferred from localStorage + start/complete times)
- No historical timer data stored (improvement opportunity)

### settingsStore:
- dailyGoalHours, idleThreshold, pollingInterval
- dataRetentionPeriod, themeMode, accentColor
- autoStartEnabled, idleDetectionEnabled

### notificationStore:
- notificationsEnabled, permission
- habitRemindersEnabled, idleAlertsEnabled, dailySummaryEnabled
- Channel preferences (web/pet/both)
- petDeliveryEnabled, petId

---

## 3. Proposed KPI Matrix: 5 Pages × 8–12 KPIs Each

### 3.1 Dashboard (Current: 4 → Proposed: 14)

| # | KPI | Data Source | Viz Type | Priority | Rationale |
|---|-----|-------------|----------|----------|-----------|
| 1 | **Focus Time Today** | `getTotalFocusSecondsToday()` | Number ticker + sparkline (7d trend) | P0 | Already exists — add trend arrow |
| 2 | **Focus Score** | `getKPIsFiltered().focusScore` | Circular ring gauge (0-100) | P0 | Already exists — upgrade to ring |
| 3 | **Tasks Pending** | tasks.filter(t => t.status !== 'done').length | Number + donut fraction | P0 | Already exists |
| 4 | **Habit Consistency** | habit records today / total habits | Linear progress bar | P0 | Already exists |
| 5 | **Daily Goal Progress** | `focusSeconds / (dailyGoalHours * 3600)` | Progress ring + remaining text | P0 | Currently in TodayProgressCard only |
| 6 | **Deep Work Ratio** | `getKPIsFiltered().deepWorkRatio` | Ring gauge (color: work-time %) | P1 | Shows quality of focus, not just quantity |
| 7 | **Distraction Ratio** | `getKPIsFiltered().distractionRatio` | Mini sparkline (red-tinted) | P1 | Trend awareness for bad patterns |
| 8 | **Context Switches** | `getKPIsFiltered().contextSwitches` | Number + small horizontal bar | P1 | High = fragmented attention |
| 9 | **Streak** | computed in TodayProgressCard (duplicated) | Ember/flame + fire emoji glow | P0 | Move from card to top-level |
| 10 | **Tasks Completed Today** | `getTodayCompletedTasks().length` | Number + checkmark + delta vs avg | P1 | Complements "pending" |
| 11 | **Best Habit Streak** | Max per-habit streak across all habits | Trophy icon + number | P2 | Motivational milestone |
| 12 | **Top App** | `getKPIsFiltered().topAppName` | Small label + bar showing time | P2 | "You spent most time in Code.exe" |
| 13 | **Idle Time Today** | `getKPIsFiltered().idleTimeSeconds` | Muted number + rest icon | P2 | Context for gaps |
| 14 | **Productivity Index** | Composite: focusScore × deepWorkRatio × taskCompletionRate | Single hero number + gauge | P1 | Unified "how good was today" score |

### 3.2 Habits Page (Current: 0 top-level KPIs → Proposed: 10)

| # | KPI | Data Source | Viz Type | Priority | Rationale |
|---|-----|-------------|----------|----------|-----------|
| 1 | **Current Streak** | Per-habit or global streak | Flame + number | P0 | Currently only on Dashboard |
| 2 | **Today's Completion %** | done today / total habits | Ring gauge | P0 | Quick status pulse |
| 3 | **Best Ever Streak** | Max streak in history | Trophy + number | P1 | Peak achievement marker |
| 4 | **Weekly Completion Rate** | done this week / (7 * habit count) | 7-bar sparkline | P1 | Week-level view |
| 5 | **Monthly Consistency %** | done this month / total opportunities | Linear progress | P1 | Month-level view |
| 6 | **Most Consistent Habit** | habit with highest 30d completion | Label + badge | P1 | "Your strongest habit is X" |
| 7 | **Weakest Habit** | habit with lowest 30d completion | Label + amber badge | P2 | Area for improvement |
| 8 | **Active Habits Count** | habits.length | Number | P0 | Context for other metrics |
| 9 | **Achievements Unlocked** | achievements.filter(a => a.unlocked).length | Badge grid count | P1 | Progress toward mastery |
| 10 | **Streak at Risk** | streak === 0 today after yesterday had streak → alert pill | Red dot + text | P2 | Recovery nudge |

### 3.3 Timeline Page (Current: 0 top-level KPIs → Proposed: 12)

| # | KPI | Data Source | Viz Type | Priority | Rationale |
|---|-----|-------------|----------|----------|-----------|
| 1 | **Total Computer Time** | `getKPIsFiltered().computerOnTimeSeconds` | Number (h:mm) | P0 | Core metric |
| 2 | **Active Focus Time** | `getKPIsFiltered().activeFocusSeconds` | Number + green bar | P0 | Already computed |
| 3 | **Idle / Break Time** | `getKPIsFiltered().idleTimeSeconds` | Number + rest icon | P1 | Work-life balance |
| 4 | **Focus Efficiency** | `getKPIsFiltered().focusEfficiency` | Ring gauge (%) | P1 | % of tracked time actually working |
| 5 | **Context Switches (normalized)** | contextSwitches / activeFocusHours | Number per hour | P1 | Per-hour rate is more useful |
| 6 | **Deep Work Ratio** | `getKPIsFiltered().deepWorkRatio` | Donut segment | P1 | Quality lens |
| 7 | **Distraction Ratio** | `getKPIsFiltered().distractionRatio` | Donut segment (color) | P1 | Opposite of deep work |
| 8 | **Top App** | `getKPIsFiltered().topAppName` | Label + time | P0 | "Code.exe — 2h 14m" |
| 9 | **Session Count** | getActivePeriods().filter(p => !p.isGap).length | Number | P1 | Fragmentation measure |
| 10 | **App Diversity** | getAppRankingByHours().length | Number | P2 | How many different apps used |
| 11 | **7-Day Trend** | getDailyUsageHours(7) → 7 values | Mini sparkline | P2 | vs last week |
| 12 | **Peak Focus Hour** | computed from hourly buckets | Small clock + label | P2 | "Best at 10am" insight |

### 3.4 Board Page (Current: 0 KPIs → Proposed: 8)

| # | KPI | Data Source | Viz Type | Priority | Rationale |
|---|-----|-------------|----------|----------|-----------|
| 1 | **Total Tasks** | tasks.length | Number | P0 | Baseline |
| 2 | **Tasks Completed Today** | `getTodayCompletedTasks().length` | Number + check | P0 | "7 done today" |
| 3 | **In Progress Count** | tasks.filter(t => t.status === 'in_progress').length | Number | P0 | Active WIP |
| 4 | **Overdue Tasks** | tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done').length | Number (red) | P0 | Urgency driver |
| 5 | **Expired Tasks** | getExpiredTasks().length | Number (amber) | P1 | Timed-out tasks |
| 6 | **Completion Rate** | done.length / total × 100 | Ring gauge | P1 | Overall progress |
| 7 | **Tasks With Subtasks** | tasks.filter(t => getSubTasks(t.id).length > 0).length | Number | P2 | Complexity indicator |
| 8 | **Tasks Linked to Habits** | tasks.filter(t => t.linkedHabitId).length | Number + link icon | P2 | Cross-system engagement |

### 3.5 Timer Page (Current: 0 KPIs → Proposed: 8)

| # | KPI | Data Source | Viz Type | Priority | Rationale |
|---|-----|-------------|----------|----------|-----------|
| 1 | **Total Sessions Today** | not stored yet (need to add + localStorage) | Number | P1 | Usage frequency |
| 2 | **Avg Session Length** | totalCompletedTime / count | Number (mm:ss) | P1 | Are sessions getting longer? |
| 3 | **Best Streak (sessions)** | not stored yet | Number + trophy | P2 | Most consecutive days with a session |
| 4 | **Preset Preference** | presetMinutes (most-used) | Label | P2 | "You prefer 25min" |
| 5 | **Completion Rate** | completed / started × 100 | Ring gauge | P1 | Do you finish what you start? |
| 6 | **Today's Timer Focus** | total completed session time today | Number (h:mm) | P1 | Timer-specific total |
| 7 | **Channel Preference** | most-used channel (web/pet/both/silent) | Icon label | P2 | Delivery preference |
| 8 | **Current Status Pill** | status (idle/running/paused/completed) | Pill badge + glow | P0 | At-a-glance state |

---

## 4. Composite Score Formulas

### 4.1 Productivity Index (0–100)

```
ProductivityIndex = (
    normalize(activeFocusSeconds, 0, dailyGoalHours * 3600) * 0.35
  + (focusScore / 100)                                        * 0.25
  + (completedTasks / max(totalTasks, 1))                     * 0.20
  + (habitCompletionRate)                                     * 0.15
  + (1 - distractionRatio / 100)                              * 0.05
) × 100
```

**Weighting rationale:** Time evidence (35%) > quality (25%) > task output (20%) > habits (15%) > minimal distraction (5%).

### 4.2 Focus Quality Score (0–100)

```
FocusQuality = (
    deepWorkRatio       * 0.50
  + (100 - distractionRatio) * 0.25
  + focusEfficiency    * 0.25
)
```

**Weighting:** Deep work is the signal. Avoiding distraction matters. Efficiency (non-idle ratio) rounds it out.

### 4.3 Day Health Score (0–100)

```
DayHealth = (
    (focusSeconds / (dailyGoalHours * 3600)) * 0.35  // Did you hit your goal?
  + (habitsCompleted / max(habitsTotal, 1)) * 0.25    // Did you do your habits?
  + (completedTasks / max(totalTasks, 1))   * 0.20    // Did you close tasks?
  + (streak / max(streak + 1, 1))           * 0.10    // Did you keep the streak?
  + (1 - idleSeconds / max(totalTime, 1))   * 0.10    // Were you active?
) × 100
```

**Implied:** Focus goal met + habits done + tasks finished = great day.

### 4.4 Context Fragmentation Index (0–100, lower is better)

```
FragmentationIndex = min(100, (
    (contextSwitches / max(activeFocusHours, 1))  * 15  // >6.6 switches/hour = 100
  + (inactiveGapCount / max(activePeriods, 1))    * 10  // gaps between blocks
))
```

**Interpretation:** <30 = focused, 30-50 = moderate, >50 = fragmented.

---

## 5. Layout Proposals (2-3x KPIs Without Clutter)

### Option A: Bento Grid with Density Tiers

```
┌────────────────────────────────────────────────────────┐
│  P0 DIMMED   P0 DIMMED   P0 DIMMED   P0 DIMMED         │ ← always visible, compact
│  Focus 3h42m Score 78%  5 pending  Habits 80%           │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌────────────────────────┐  │
│  │ P1 KPI CLUSTER        │  │ P1 KPI CLUSTER          │  │
│  │ [Deep Work] [Distract]│  │ [Context Sw] [Compltd]  │  │
│  │ [Idle Time] [Top App] │  │ [Prod Index] [Streak]   │  │
│  └──────────────────────┘  └────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │ P2 "INSIGHTS" — expandable strip                  │  │
│  │ Best Habit Streak · Peak Hour · App Diversity     │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

**KPI card size:** P0 = 1/4 row (compact), P1 = 1/4 row (medium), P2 = expandable tray.

### Option B: Tabbed KPI Panels

```
┌────┬─────┬──────┬───────┬────────┐
│ All│Focus│Tasks │Habits │Timeline │ ← tab bar for KPI panels
├────┴─────┴──────┴───────┴────────┤
│ Focus Time  3h 42m  ██████████░░ │ ← current panel
│ Deep Work   78%     ████████░░░░  │
│ Distraction 12%     ██░░░░░░░░░░  │
│ Context Sw  47      ██████░░░░░░  │
│ Idle Time   24m     ██░░░░░░░░░░  │
└───────────────────────────────────┘
```

### Option C: Collapsible Metric Groups (Recommended)

```
┌────────────────────────────────────────────────────────┐
│ ⚡ CORE TODAY (4 compact cards, always visible)        │
├────────────────────────────────────────────────────────┤
│ ▼ FOCUS DEEP DIVE (8 KPIs)  [expandable, default open] │
├────────────────────────────────────────────────────────┤
│ ▼ TASK & HABIT OVERVIEW (6 KPIs)  [expandable]         │
├────────────────────────────────────────────────────────┤
│ ▼ INSIGHTS & TRENDS (6 KPIs)  [expandable, default closed] │
└────────────────────────────────────────────────────────┘
```

Recommended for the dashboard. Each section has a collapsible header. The first section (CORE TODAY) is P0, always visible, 4 compact cards. The second group (FOCUS DEEP DIVE) shows P1 metrics with minimal viz elements.

---

## 6. Empty / Loading / Error States for Every New KPI

### Loading State Pattern (all KPIs)

```
┌──────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │ ← skeleton bar
│ ▓▓▓▓                │ ← skeleton label
│ ════                 │ ← skeleton value (shimmer)
└──────────────────────┘
```

Use a single `<KpiSkeleton />` component that renders:
- 24px × 80% width skeleton bar
- 12px × 40% width skeleton label
- 36px × 60% width skeleton value (shimmer pulse)

### Empty State Per KPI Type

| KPI Type | Empty State Message | Visual |
|----------|-------------------|--------|
| Focus Time | "No focus time tracked yet today" | Muted clock icon + text |
| Habit Consistency | "No habits configured. Create one!" | Link to /habits |
| Deep Work Ratio | "Track more to calculate quality score" | Dashed ring, gray |
| Context Switches | "Not enough data" | Dash — |
| Streak | "Start today to begin a streak" | Gray flame icon |
| Tasks Completed | "Add your first task to track completion" | Link + add button |
| Distraction Ratio | "No distractions logged" (optimistic) | Green check + "All clear" |
| App Rankings | "No app usage data yet" | Empty list placeholder |
| Monthly Consistency | "Need at least 7 days of data" | 0% ring, dashed |

### Error State Pattern

```
┌──────────────────────────────────┐
│ ⚠ [Metric Name] unavailable      │
│ Failed to load data. [Retry]     │
└──────────────────────────────────┘
```

- Error icon (red/amber) + metric name
- Error message from store.error
- "Retry" button that re-calls the store's initializer
- Auto-dismiss after 10s if retry succeeds

---

## 7. Animation Approach Per Viz Type

| Viz Type | Entry Animation | Data Update | Reduced Motion |
|----------|----------------|-------------|----------------|
| **Number Ticker** | Count up from 0 over 400ms, ease-out | Animate only the delta (60→78, not 0→78) | Instant set value |
| **Ring Gauge** | `strokeDashoffset` animate from 360→target, 600ms, ease-out | Spring transition to new value (stiffness: 120, damping: 14) | Instant set |
| **Sparkline** | `pathLength` animate from 0→1, 500ms stagger | Crossfade old path to new over 300ms | Instant draw |
| **Linear Progress Bar** | Width 0→target, 400ms, ease-out | Spring to new width | Instant |
| **Donut Segment** | Rotate in from -90deg, 500ms, ease-out | Re-arc with spring layout | Instant |
| **Horiz Bar** | Height/width grow from 0, stagger 50ms between bars | Re-sort with layout animation (Framer LayoutGroup) | Instant |
| **Badge/Pill** | Scale 0.8→1 + opacity, 200ms | Scale pulse on change (1→1.1→1) | Opacity only |
| **Gauge Needle** | Rotate from -90deg to target, 600ms ease-out | Spring to new angle | Instant |
| **Small Multiples** | Stagger entry: 30ms delay per item, opacity+y offset | Re-render in place (no animation) | No stagger |
| **Composite Score** | Each sub-metric counts up in sequence (50ms stagger), then the final score computes | Full re-animate | End values only |

### Animation Implementation Notes

All animations via Framer Motion (already installed). No GSAP required.

```tsx
// Number Ticker Pattern
const { scope } = useAnimatedNumber(targetValue, { duration: 400 })

// Ring Gauge Pattern
<环形进度条
  initial={{ pathLength: 0 }}
  animate={{ pathLength: targetValue / 100 }}
  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
/>

// Stagger Entry (for metric groups)
<motion.div
  variants={{
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.04, duration: 0.3 }
    })
  }}
  custom={index}
/>
```

### `prefers-reduced-motion` Handling

- Number tickers → instant set (no count-up)
- Ring fills → instant render at target
- Sparklines → draw instantly
- Stagger → collapse to simultaneous (0 delay)
- Spring → replace with `duration: 0` (instant)
- All pulse/glow effects → disabled

---

## 8. Implementation Order (Phased)

### Phase 1 (P0) — Core Today Expansion
- Upgrade existing 4 KPIs to new viz (ring + sparkline + ticker)
- Extract Streak from TodayProgressCard → top-level KPI
- Add Daily Goal Progress as 5th top-level KPI
- Add Deep Work Ratio as 6th

### Phase 2 (P1) — Deep Dive Metrics
- Distraction Ratio (ring gauge)
- Context Switches (horizontal bar, normalized per hour)
- Tasks Completed Today (with delta vs 7d avg)
- Productivity Index composite score (gauge)
- Weekly Completion Rate (Habits page sparkline)
- Monthly Consistency (Habits page progress)

### Phase 3 (P1-P2) — Per-Page Expansion
- Timeline: Total Computer Time, Active Focus, Top App, Session Count, 7-Day Trend
- Board: Total Tasks, In Progress, Overdue, Expired, Completion Rate
- Timer: Total Sessions (with localStorage persistence), Avg Session Length

### Phase 4 (P2) — Composite Scores & Insights
- Focus Quality Score (heatmap on Habits page)
- Day Health Score (dashboard summary)
- Fragmentation Index (Timeline warning)
- Best Habit Streak / Weakest Habit (motivation + recovery)

---

## 9. New Component Inventory

| Component | Purpose | Parent Page |
|-----------|---------|-------------|
| `KpiCard` | Base KPI card (icon + value + label + optional viz) | Dashboard/Habits/Timeline/Board |
| `KpiRingGauge` | Circular progress (0-100) | Dashboard/Habits |
| `KpiSparkline` | Mini trend line (7 data points) | Dashboard |
| `KpiMiniBar` | Small horizontal bar (for ratios) | Timeline |
| `KpiGauge` | Needle gauge (for composite scores) | Dashboard |
| `KpiCluster` | Collapsible group of 4-8 KPIs | Dashboard/Habits |
| `CompositeScoreCard` | Score breakdown with sub-metrics | Dashboard |
| `StreakPill` | Per-habit streak badge | Habits |
| `ContextSwitchMeter` | Fragmentation indicator | Timeline |

All extend the base `<KpiCard>` pattern:
```tsx
interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  viz?: 'ring' | 'sparkline' | 'bar' | 'gauge' | 'pill'
  vizValue?: number
  delta?: { value: number; direction: 'up' | 'down' | 'flat'; label: string }
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  onClick?: () => void
}
```

---

## 10. Cross-Cutting: Data Persistence Gaps

| Missing Data | Impact | Fix |
|-------------|--------|-----|
| Timer session history | Can't show "total sessions today" or "avg length" | Create `timerSessions` SQLite table, `timerSessionStore` |
| Per-habit streak not stored | Re-computed on every render, no historical best | Add `streaks` computed cache in habitStore |
| Cumulative chart mock data | `getCumulativeScreenTimeFiltered` returns fake data | Replace with real hourly accumulation (already partially fixed) |
| No hourly bucket store | Peak focus hour requires computation each time | Create `getPeakFocusHour()` computed in timeEntryStore |

---

## 11. Summary

**Total KPIs before:** 4 (Dashboard) + 0 (other pages) = **4**
**Total KPIs after:** 14 (Dashboard) + 10 (Habits) + 12 (Timeline) + 8 (Board) + 8 (Timer) = **52**
**Expansion ratio: 13x**

All 52 KPIs derive from existing store data. Zero new raw data collection needed (except timer sessions table, which is a minor schema addition). The expansion is a UI/reachability problem, not a data pipeline problem.

Layout strategy: P0 KPIs are always visible (4 compact cards). P1 KPIs are in collapsible "deep dive" clusters. P2 KPIs live in an expandable "Insights" strip. All animated with Framer Motion, all respect `prefers-reduced-motion`.
