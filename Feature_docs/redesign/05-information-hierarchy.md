# Information Hierarchy System — Shodasha Productivity App

> **Research sources:** `.agent/design-basics/modules/04-ui-ux-principles.md` (F-pattern, progressive disclosure), `.agent/design-basics/modules/03-layout-spacing.md` (8px grid, visual hierarchy), `.agents/skills/apple-design/SKILL.md` (spatial consistency, wayfinding, simplicity principle #6: "Strip the unnecessary so the core purpose shines"), `.agents/skills/emil-design-eng/SKILL.md` (interaction hierarchy, button press feedback, stagger delays), `.agent/ui-checklist/SKILL.md` (navigation, UX copy, component states).

---

## 1. Visual Scanning Zones — The 4-Zone Model

Based on F-pattern (left→right, top→bottom) and Z-pattern scanning behavior, every page divides into four distinct zones ordered by information criticality:

```
┌─────────────────────────────────────────────────────────┐
│  ZONE 1 — NORTH STAR (top-left)                         │
│  Single most important metric. First fixation point.     │
│  Font: 24-32px display, bold, accent color optional.    │
├─────────────────────────────────────────────────────────┤
│  ZONE 2 — GLANCE (top row)                              │
│  3-6 secondary KPIs. Scan in one horizontal pass.       │
│  Font: 14-16px labels, 20-24px values.                  │
├─────────────────────────────────────────────────────────┤
│  ZONE 3 — INSIGHT (middle)                              │
│  Charts, trends, distributions. Visual comprehension.   │
│  Widescreen: 60/40 or 50/50 split.                      │
├─────────────────────────────────────────────────────────┤
│  ZONE 4 — DETAIL (bottom)                               │
│  Raw data, lists, tables, expandable drill-downs.       │
│  Collapsible sections, pagination for 50+ items.        │
└─────────────────────────────────────────────────────────┘
```

### Zone 1 — North Star Definition

| Page | North Star Metric | Rationale |
|------|-------------------|-----------|
| Dashboard | **Focus Time Today** (hours:min) | Primary question: "How productive was I today?" |
| Board | **Tasks Due Today** (count) | "What needs my attention right now?" |
| Habits | **Today's Streak** (days + flame) | "Am I keeping my habits alive?" |
| Timeline | **Total Hours Today** (hours:min) | "How much time have I spent today?" |
| Timer | **Timer Remaining** (mm:ss) | "How much time left in my focus session?" |

### Zone 2 — Glance Metrics Per Page

| Page | KPI 1 | KPI 2 | KPI 3 | KPI 4 | KPI 5 | KPI 6 |
|------|-------|-------|-------|-------|-------|-------|
| Dashboard | Focus Score | Tasks Pending | Habit Consistency | Context Switches | Active Hours Goal | Streak Days |
| Board | To Do count | In Progress count | Done count (today) | Overdue tasks | — | — |
| Habits | Best Streak | Current Streak | Total Check-ins | Completion Rate % | Habits Tracked | This Week |
| Timeline | Total Hours | Active Hours | Deep Work % | Distraction % | Context Switches | Peak Hour |
| Timer | — | — | — | — | — | — |

**Rule:** Maximum 6 KPIs at Zone 2. At 7+, use "Show more →" link or carousel dots. The current Dashboard already has 4 in `TopKPIGrid`; expanding to 6 is acceptable but 6 is the hard ceiling.

### Zone 3 — Insight (Charts & Visualizations)

| Page | Primary Chart | Secondary Chart | Layout |
|------|--------------|-----------------|--------|
| Dashboard | Time Distribution Donut (Deep Work/Neutral/Distraction) | Performance Overview line chart (7-day trend) | 60/40 split (donut 40%, line 60%) |
| Board | Completed Tasks History calendar grid | — | Full width, collapsible |
| Habits | Completion line chart (30-day) | Weekday bar chart + Completion rings | 3-column widget grid |
| Timeline | Daily Usage Hours bar chart | Active Periods timeline + App Ranking | Bar full-width; timeline + ranking 50/50 |
| Timer | — | — | No charts (single-purpose page) |

### Zone 4 — Detail

| Page | Content | Interaction |
|------|---------|-------------|
| Dashboard | Recent Activity feed (latest 10-15 entries) | Scrollable list, "View all" links to Timeline |
| Board | Task cards in Kanban columns + history month | Drag & drop, modal on click, collapsible history |
| Habits | Monthly calendar grid + 24-week heatmap | Scrollable, clickable cells, tooltips |
| Timeline | App ranking by hours | Sortable, category-filterable |
| Timer | Timer history / sessions log | Expandable accordion |

---

## 2. Progressive Disclosure Architecture

### Level 0 — Title + Primary KPI (always visible, no scroll)

```
Dashboard:    "Good Afternoon" + Focus Time Today [2h 34m]
Board:        "Board" + Tasks Due Today [5]
Habits:       "Habits" + Streak [12 Days 🔥]
Timeline:     "Activity & Time Overview" + Total Hours [6h 12m]
Timer:        TimerPage component (self-contained)
```

### Level 1 — Secondary KPIs (visible, compact, one row)

- Dashboard: `TopKPIGrid` — 4 cards → max 6 cards
- Board: Column counts shown in column headers (current pattern: `To Do (3)`)
- Habits: `HabitStatsCard` — 4 compact stat cards
- Timeline: `AnalyticsKPIGrid` — 6 metric cards
- Timer: N/A (single-purpose)

### Level 2 — Charts & Trends (visible, full size)

- Dashboard: Donut ring + Performance line chart
- Board: Completed calendar grid (collapsible by default)
- Habits: Line chart + Completion rings + Weekday bar chart
- Timeline: Daily bar chart + Active periods + App ranking
- Timer: N/A

### Level 3 — Raw Data / Drill-down (expandable, on interaction)

- Dashboard: Recent Activity feed (scrollable, 15 items initially, "Load more")
- Board: Task modal details (click card → modal), history month (toggle)
- Habits: 24-week heatmap (full width, scrollable), achievements log
- Timeline: Category filter (narrows all charts), date picker
- Timer: Session history (accordion)

### Level 4 — Settings / Configuration (modal or separate page)

- Dashboard: Quick Task Input (inline, not modal)
- Board: Add/Edit Task modal
- Habits: Add/Edit Habit modal
- Timeline: Date selector (inline), refresh button (inline)
- Timer: Timer settings (duration presets, sound)

**Key principle:** Levels 0-2 must be visible without scrolling at 1200×800 viewport. Level 3 begins below the fold. Level 4 is always modal or inline action.

---

## 3. Sitemap & Navigation Flow

### Primary Navigation (Top Tab Bar)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [SHODASHA logo]  │  [Dash] [Board] [Habits] [Timeline] [Timer] [Settings] │  [● Tracker Active] [🔍] [🌙] [_][□][×] │
└─────────────────────────────────────────────────────────────────────┘
```

Current GooeyTabs implementation in `Navbar.tsx:27-34` matches this. No changes needed — structure is correct.

### Secondary Navigation (Within Pages)

| Page | Controls | Location |
|------|----------|----------|
| Dashboard | Date filter (Today / Yesterday / This Week) | Top-right, below header |
| Board | Column management (add/rename/delete) | Per-column header |
| Habits | Category filter, view toggle (month/week) | Top bar, below title |
| Timeline | Date picker, day navigation (← →), refresh, range toggle (7d/14d/30d) | Header area |
| Timer | Duration selector, start/pause/reset | Timer card |

### Cross-linking Paths

```
Dashboard → Board:     Click a task in ScheduleActivityCard → navigates to /board
Dashboard → Habits:    Click a habit name in GoalsHabitsCard → navigates to /habits
Dashboard → Timeline:  Click "View all" in insight card → navigates to /timeline
Board → Timeline:      Click time badge on KanbanCard → navigates to /timeline with date filter
Habits → Timer:        Click "Focus" action on habit → opens Timer with habit-linked session
Timeline → Board:      Click app entry with linked task → navigates to /board
```

### Breadcrumb / Context Indicators

- **Active tab highlight** in GooeyTabs (already implemented)
- **Page title + subtitle** at top of each page (already implemented)
- **Back to Today** button when viewing past dates in Timeline (already implemented at line 111-118)
- **No breadcrumb trail needed** — top tab navigation is flat (only 1 level deep per page)

---

## 4. Content Density Rules

### Maximum KPIs Per Zone

| Zone | Max Items | At N+1, do... |
|------|-----------|---------------|
| Zone 1 (North Star) | 1 | N/A — always single |
| Zone 2 (Glance) | 6 | Show scroll arrow or "Show more" link |
| Zone 3 (Insight) | 2 charts | Toggle between chart sets |
| Zone 4 (Detail) | unlimited | Paginate at 50 / "Load more" button |

### Label Character Counts

| Context | Max chars | Example |
|---------|-----------|---------|
| North Star label | 20 | "Focus Time Today" |
| Glance KPI label | 18 | "Tasks Pending" |
| Chart title | 30 | "Time Distribution by Category" |
| Button text | 15 | "New Habit" |
| Tab label | 10 | "Dashboard" |
| Stat card subtitle | 25 | "Yesterday: 4h 12m" |
| Toast message | 60 | "Habit 'Read' checked for today ✓" |

### Truncation vs Abbreviation vs Wrap

| Condition | Action |
|-----------|--------|
| Label > 20 chars | Truncate with ellipsis (`text-ellipsis overflow-hidden whitespace-nowrap`) |
| KPI value + unit | Always show full value; abbreviate unit ("h" not "hours", "m" not "minutes") |
| Habit name in calendar cell | Truncate to 8 chars + "…" on hover show tooltip |
| App name in ranking | Truncate at 20 chars |
| Window title in activity | Truncate at 40 chars, tooltip shows full |

### Minimum Font Sizes Per Zone

| Zone | Minimum | Default | Maximum |
|------|---------|---------|---------|
| Zone 1 — North Star value | 24px | 32px | 48px |
| Zone 1 — North Star label | 12px | 14px | 16px |
| Zone 2 — KPI value | 20px | 24px | 28px |
| Zone 2 — KPI label | 11px | 12px | 14px |
| Zone 3 — Chart title | 12px | 14px | 16px |
| Zone 3 — Chart axis labels | 10px | 11px | 12px |
| Zone 4 — List items | 13px | 14px | 16px |
| Zone 4 — List metadata | 11px | 12px | 13px |
| Tab bar | 11px | 12px | 13px |

### Spacing Density Per Zone

| Zone | Vertical gap | Horizontal gap | Padding (card) | Density |
|------|-------------|----------------|----------------|---------|
| Zone 1 | 8px (between value + label) | — | 16px | Comfortable |
| Zone 2 | 16px (card row to next section) | 12px between cards | 16px | Compact |
| Zone 3 | 24px (section to section) | 16px between charts | 20px | Comfortable |
| Zone 4 | 8px (between list items) | — | 16px | Compact |

---

## 5. Empty States & First-run Experience

### Dashboard — Day 1

```
┌──────────────────────────────────────────────────────────────┐
│  Good Morning! 👋 Welcome to Shodasha                        │
│  Your productivity dashboard will populate as you work.      │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐ │
│  │ 0h 0m      │  │ --         │  │ 0 / --     │  │ 0 Days │ │
│  │ Focus Time │  │ Focus Score│  │ Tasks Done │  │ Streak │ │
│  │ Just start │  │ Complete a │  │ Add your   │  │ Check  │ │
│  │ working!   │  │ task first │  │ first task │  │ a habit│ │
│  └────────────┘  └────────────┘  └────────────┘  └────────┘ │
│                                                              │
│  ┌──────────────────────────────┐  ┌────────────────────────┐│
│  │ 📋 Today's Schedule          │  │ 🎯 Focus Distribution ││
│  │ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │  │   [Empty donut]        ││
│  │ │ No tasks yet              │ │  │   No data yet — start ││
│  │ │ [Create your first task]  │ │  │   tracking to see     ││
│  │ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │  │   your focus breakdown ││
│  └──────────────────────────────┘  └────────────────────────┘│
│                                                              │
│  [💬 Insight: Track your first task to see patterns emerge]   │
└──────────────────────────────────────────────────────────────┘
```

**Structure:** Zone 1 shows 0 values with micro-CTAs in each card. Zone 2 shows empty donut/empty schedule. Zone 3 shows empty insight card. Progressive CTA: "Create your first task" → triggers task creation. Activity tracking begins automatically — no manual action needed.

### Board — Day 1

```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ To Do        │  │ In Progress  │  │ Done         │       │
│  │ ──────────── │  │ ──────────── │  │ ──────────── │       │
│  │              │  │              │  │              │       │
│  │  [Empty]     │  │  [Empty]     │  │  [Empty]     │       │
│  │              │  │              │  │              │       │
│  │ No tasks yet │  │ Move tasks   │  │ Complete     │       │
│  │ [+ Add Task] │  │ here when    │  │ tasks appear │       │
│  │              │  │ you start    │  │ here          │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

**Structure:** All 3 default columns visible. Each column has a contextual placeholder. "To Do" is the primary action column (CTA to add task). Only "To Do" column shows [+ Add Task] button prominently; others explain their purpose. First task creation triggers a toast: "🎉 First task created! Try dragging it to In Progress."

### Habits — Day 1

```
┌──────────────────────────────────────────────────────────────┐
│  Habits Dashboard & Performance    [🏆 Get Started] [+ New]  │
│  Build your routine — add habits to track daily              │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ Best Streak │ │ Current     │ │ Check-ins   │ │ Rate   │ │
│  │ 0 days      │ │ 0 days      │ │ 0 total     │ │ --%    │ │
│  │ Start today │ │ Start today │ │ Add a habit │ │ Add a  │ │
│  │ to begin!   │ │ to begin!   │ │ to log your │ │ habit  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
│                                                              │
│  [📊 Consistency Trends — No data yet. Add your first habit] │
│  [📅 Monthly Tracker — Your habits will appear here]         │
│  [🏅 Achievements — Complete habits to unlock badges]        │
│  [🔥 Heatmap — 24-week consistency will appear here]         │
└──────────────────────────────────────────────────────────────┘
```

**Structure:** Stats cards show 0 with micro-CTAs. All chart/widget areas show empty state with description. Primary CTA is "+ New Habit" button. After adding first habit, show toast: "🎯 First habit added! Check it off today to start your streak." The `HabitStatsCard` and `HabitAnalyticsDashboard` already have loading skeleton states (habits/page.tsx:34-48); these should be extended to empty state variants.

### Timeline — Day 1

```
┌──────────────────────────────────────────────────────────────┐
│  Activity & Time Overview    [📅 Today] [🔄 Refresh]         │
│                                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐ │
│  │ 0h 0m│ │ 0h 0m│ │ 0%   │ │ 0%   │ │ 0    │ │ --:--    │ │
│  │Total │ │Active│ │Deep  │ │Distr.│ │Swtch │ │Peak Hour│ │
│  │hours │ │hours │ │Work  │ │      │ │      │ │          │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘ │
│                                                              │
│  [📊 Daily Usage — Start working to see your daily hours]    │
│  [⏱ Active Periods — Activity data will appear here]        │
│  [🏆 App Ranking — App usage data will appear here]         │
│                                                              │
│  ⚡ Tracking is running in the background.                    │
│     Open apps and Shodasha will log your time automatically. │
└──────────────────────────────────────────────────────────────┘
```

**Structure:** KPI grid shows 0 values. All charts show empty states. Information banner at bottom explains passive tracking. The `AnalyticsKPIGrid` already handles empty data (from earlier polish work). Timeline-specific empty state for chart components.

### Timer — Day 1

```
┌──────────────────────────────────────────────────────────────┐
│                    ⏱ Focus Timer                              │
│                                                              │
│                    ┌──────────┐                               │
│                    │  25:00   │                               │
│                    │   mm:ss  │                               │
│                    └──────────┘                               │
│                                                              │
│           [25 min] [45 min] [60 min] [Custom]                │
│                                                              │
│                    [▶ Start]                                  │
│                                                              │
│  ┌──────────────────────────────────────────────┐            │
│  │ Session History                               │            │
│  │ No sessions yet. Start a timer to begin.      │            │
│  └──────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

**Structure:** Timer face centered. Duration presets. Session history shows empty state. Single-purpose page — minimal chrome.

### Progressive Onboarding — Milestone Triggers

| Threshold | Trigger | Action |
|-----------|---------|--------|
| First task created | Toast | "🎉 First task! You're on your way." |
| First habit checked | Toast | "✅ First check-in! Streak started." |
| 1 hour tracked | Insight card appears | "You tracked your first hour. Here's your focus breakdown." |
| 5 hours tracked | Achievement toast | "5 hours of focus! You're building a rhythm." |
| 3-day streak | Badge unlock | "🔥 3-Day Streak! Consistency is building." |
| 7-day streak | Milestone card | "⭐ One week! You're a habit-maker." |
| 10 tasks completed | Insight card | "10 tasks done. You complete what you start." |
| First week's data | Chart unfurls | Weekly trend becomes available. |

---

## 6. Page-by-Page Zone Mapping (Implementation Blueprint)

### Dashboard (`/`)

```
ZONE 1 — HeaderGreetingCard
  Content: "Good Afternoon, [User]" | Focus Time: 2h 34m today
  Props: timeAwareGreeting, focusTimeToday, date
  Always visible, no scroll

ZONE 2 — TopKPIGrid (4-6 cards, single row)
  Cards: Focus Score | Tasks Pending | Habit Consistency | Context Switches
  Responsive: 4-col grid → 2-col on narrow

ZONE 3 — 60/40 Split
  Left (60%): ScheduleActivityCard → Today's tasks + active process
  Right (40%): LearningProgressCard → Focus Donut (Deep Work / Neutral / Distraction)

ZONE 4a — QuickTaskInput (inline)
  Single-line input + submit button

ZONE 4b — 3-Column Bottom Tier
  Col 1 (35%): GoalsHabitsCard → Habit progress bars
  Col 2 (30%): StreakHeroCard → Flame streak counter
  Col 3 (35%): PerformanceOverviewChart → 7-day focus trend line

ZONE 4c — InsightCard (full width)
  AI-generated insight based on current data
  Empty: "Track more to see personalized insights"
```

### Board (`/board`)

```
ZONE 1 — KanbanBoard (fills viewport)
  Page title + column counts in header

ZONE 2 — Column headers show task counts
  "To Do (3)" | "In Progress (2)" | "Done (5 today)"

ZONE 3 — KanbanCards (drag & drop)
  Each card shows: title, tags, due badge, time badge, sub-task count
  Click → TaskModal (opens at ZONE 3 overlay)

ZONE 4 — Completed Tasks History (collapsible accordion, below board)
  Collapsed: "Completed Tasks History" + chevron
  Expanded: Month calendar grid with per-day completion count
  Monthly navigation (← month →)
```

### Habits (`/habits`)

```
ZONE 1 — Page Title + Streak Badge
  "Habits Dashboard & Performance" [🏆 Daily Consistency]
  "+ New Habit" button top-right

ZONE 2 — HabitStatsCard (4 metrics)
  Best Streak | Current Streak | Total Check-ins | Completion Rate

ZONE 3 — HabitAnalyticsDashboard (3 widgets, reorderable)
  Widget 1: Completion line chart (30-day trend)
  Widget 2: Completion rings (per-habit donuts)
  Widget 3: Weekday bar chart (best/worst days)

ZONE 4a — HabitCalendar (monthly grid)
  Scrollable horizontally, sticky habit names column
  Each cell: clickable checkbox (if within 2-day edit window)

ZONE 4b — HabitAchievements (milestone badges)
  Grid of unlocked/locked achievement cards

ZONE 4c — HabitHeatmap (24-week consistency)
  Scrollable, today highlighted, tooltip on hover
```

### Timeline (`/timeline`)

```
ZONE 1 — Page Title + Date Selector
  "Activity & Time Overview" | date navigator (← [Today] →)
  Refresh button + CategoryFilterBar

ZONE 2 — AnalyticsKPIGrid (6 metrics)
  Total Hours | Active Hours | Deep Work % | Distraction % | Context Switches | Peak Hour

ZONE 3a — DailyUsageBarChart (full width)
  7d/14d/30d range toggle
  Comparison toggle (prev period overlay)
  Click bar → filters ActivePeriods + AppRanking to that date

ZONE 3b — 50/50 Split
  Left: ActivePeriodsTimeline (continuous blocks, compacted idle gaps)
  Right: AppRankingChart (sorted by hours, category toggles)
```

### Timer (`/timer`)

```
ZONE 1 — Timer face (centered)
  Large countdown: mm:ss
  State: idle / running / paused / completed

ZONE 2 — Duration presets
  25m | 45m | 60m | Custom

ZONE 3 — Controls
  Start / Pause / Reset buttons

ZONE 4 — Session History (below timer)
  Expandable list of past sessions
  Each row: duration, date, task link (if any)
```

---

## 7. Navigation Improvements

### Current State (from Navbar.tsx)

The GooeyTabs implementation is excellent — 6 items, icons + labels, active state, keyboard shortcuts (Cmd+1-5). No structural changes needed.

### Recommended Additions

1. **Active tab indicator within page content** — Each page should have a subtle visual reminder of which tab is active (not just the GooeyTabs highlight, but e.g., a colored accent bar under the page title matching the tab color)

2. **Cross-link affordances** — Clickable elements that navigate to another page should show a subtle "opens page" indicator (e.g., `→ Board` suffix, or a small arrow icon)

3. **Command palette integration** — Already implemented (Cmd+K). Should include:
   - "/board" → navigate to board
   - "new task" → open task modal
   - "new habit" → open add habit modal
   - "today" → navigate to today's date on timeline
   - "dark mode" → toggle theme

4. **Keyboard shortcuts display** — Settings page should list all shortcuts:
   - Cmd+1-6: Navigate to tab
   - Cmd+K: Command palette
   - Cmd+N: New task (on Board page)
   - Cmd+E: New habit (on Habits page)
   - Escape: Close modal

### Secondary Navigation Patterns

| Pattern | Used On | Implementation |
|---------|---------|----------------|
| Date picker (inline) | Timeline | Current implementation (lines 91-98): hidden date input behind visible label |
| Filter pills | Timeline (CategoryFilterBar) | Current implementation |
| Toggle pills (7d/14d/30d) | Timeline | Current implementation (DailyUsageBarChart) |
| Section toggle (collapsible) | Board (history) | Current implementation (lines 61-149) |
| Reorderable widgets | Habits | Current implementation (HabitAnalyticsDashboard) |

---

## 8. UX Copy Guidelines

### Tone & Voice

- **Tone:** Direct, encouraging, professional. Never playful to the point of distraction. Never robotic.
- **Personality:** A calm, competent coach. Not a cheerleader. Not a robot.
- **Refer to user as "you"** — direct second person.
- **Refer to the app as "Shodasha"** — third person, not "we" or "I".

### Label Length Rules

| Context | Max chars | Rule |
|---------|-----------|------|
| Page title | 40 | Full descriptive title, sentence case |
| KPI label | 18 | Noun phrase, no articles ("Focus Time" not "Your Focus Time") |
| Button | 15 | Verb + noun ("New Habit", not "Create New Habit") |
| Tab | 10 | Single word noun |
| Chart title | 30 | Descriptive noun phrase |
| Toast | 60 | Action + result, period at end |
| Empty state description | 80 | Imperative + benefit |
| Tooltip | 100 | Just-in-time explanation |

### Time Formatting

| Context | Format | Example |
|---------|--------|---------|
| Focus Time Today | Xh Xm | 2h 34m |
| Timer countdown | MM:SS | 25:00 |
| Duration < 1 hour | Xm | 45m |
| Duration 1-24 hours | Xh Xm | 6h 12m |
| Duration > 24 hours | Xd Xh | 3d 5h |
| Streak count | X Days | 12 Days |
| Date (full) | D MMM, YYYY | 29 Jul, 2026 |
| Date (compact) | D MMM | 29 Jul |
| Percentage | X% | 73% |

### Standardized Action Labels

| Action | Label | Notes |
|--------|-------|-------|
| Create task | New Task | Consistent everywhere |
| Create habit | New Habit | Consistent everywhere |
| Delete task | Delete Task | Confirm dialog required |
| Delete habit | Delete Habit | Confirm dialog required |
| Save changes | Save Changes | Loading state + success toast |
| Cancel | Cancel | Never "Go Back" |
| Close | Close | For modals (X button + label) |
| Refresh | Refresh | For data refresh |
| View all | View All | For "more" links |

### Empty State Copy Templates

| Page/Section | Title | Description | CTA |
|-------------|-------|-------------|-----|
| Dashboard (no data) | Welcome to Shodasha | Your dashboard will populate as you work. Activity tracking is running in the background. | Create your first task |
| Board (no tasks) | No tasks yet | Start organizing your work. Create your first task to get going. | + New Task |
| Board column (empty) | — | Drop tasks here or add new ones | + Add Task |
| Habits (no habits) | Build your routine | Add habits to track daily and watch your streaks grow. | + New Habit |
| Habits (no data this period) | No entries yet | Start checking off your habits to see your progress. | — |
| Timeline (no data) | No activity yet | Start using your computer — Shodasha tracks automatically. | Open an app to begin |
| Timeline (selected date no data) | No activity on this day | This date has no tracked activity. | ← Back to Today |
| Timer (no sessions) | No sessions yet | Start a focus timer to track your deep work sessions. | Start Timer |
| Achievements (none) | Achievements locked | Complete habits consistently to unlock achievement badges. | — |
| Search (no results) | No results found | Try a different search term or clear filters. | Clear filters |
| Error | Something went wrong | We couldn't load this data. Try refreshing. | Refresh |

---

## 9. Content Density Rules Summary

```
┌────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Rule           │ Zone 1   │ Zone 2   │ Zone 3   │ Zone 4   │ Modal    │
├────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Max items      │ 1        │ 6        │ 2 charts │ unlimited│ varies   │
│ Min font size  │ 24px /   │ 20px /   │ 12px     │ 13px     │ 14px     │
│                │ 12px     │ 11px     │          │          │          │
│                │ (value / │ (value / │ (title)  │ (body)   │ (body)   │
│                │ label)   │ label)   │          │          │          │
│ Spacing (gap)  │ 8px      │ 16px     │ 24px     │ 8px      │ 20px     │
│ Card padding   │ 16px     │ 16px     │ 20px     │ 16px     │ 24px     │
│ Density label  │ Comfort  │ Compact  │ Comfort  │ Compact  │ Comfort  │
│ Scroll?        │ Never    │ Never    │ Never    │ Allowed  │ Allowed  │
└────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## 10. Audit Against Current Implementation

| Principle | Current State | Gap |
|-----------|--------------|-----|
| Zone 1 always visible without scroll | ✅ Dashboard has HeaderGreetingCard at top | ✅ |
| Zone 2 max 6 KPIs | ✅ TopKPIGrid = 4, AnalyticsKPIGrid = 6 | ✅ |
| Zone 3 60/40 split | ✅ Dashboard uses lg:grid-cols-12 with 7/5 split | ⚠️ Timeline uses single-bar full-width then 50/50 — acceptable |
| Zone 4 collapsible | ✅ Board history is toggleable | ⚠️ Habits has no collapsible sections (5+ sections always visible) |
| Empty states for all zones | ❌ Some zones show 0 values without context | Dashboard shows InsightCard even when empty |
| Cross-linking | ❌ No cross-page links exist | Clicking a task on dashboard does not navigate to board |
| Label length consistency | ✅ Labels are concise | Minor inconsistencies ("Tasks Pending" vs "Tasks Done") |
| Time formatting | ⚠️ Inconsistent | Some places use "2h 34m", some use "2 hours" |
| Progressive onboarding | ❌ No milestone triggers | App jumps from empty to full data without celebration |
| Keyboard navigation | ✅ Cmd+1-5, K, Escape | Command palette routes already present |

### Immediate Fixes (recommended before further development)

1. Add micro-CTAs to 0-value KPI cards (empty state pointers)
2. Standardize time format across all components to "Xh Xm"
3. Add milestone notification triggers (first task, first hour, first streak)
4. Add click-through links from Dashboard cards to their respective pages
5. Collapse HabitHeatmap and HabitAchievements behind "Show more" to reduce scroll depth on Habits page

---

## Appendix: Content Audit Per Component

| Component | Page | Current Zone | Recommended Zone | Priority |
|-----------|------|-------------|-----------------|----------|
| HeaderGreetingCard | Dashboard | 1 | 1 | — |
| TopKPIGrid | Dashboard | 2 | 2 | — |
| ScheduleActivityCard | Dashboard | 3 | 3 | — |
| LearningProgressCard | Dashboard | 3 | 3 | — |
| QuickTaskInput | Dashboard | 4 | 4 (keep at top of detail zone) | — |
| GoalsHabitsCard | Dashboard | 4 | 4 | — |
| StreakHeroCard | Dashboard | 4 | 2 (move streak to glance) | Medium |
| PerformanceOverviewChart | Dashboard | 4 | 3 (move up to insight) | Medium |
| InsightCard | Dashboard | 4 | 4 | — |
| KanbanBoard | Board | 1-3 | 1-3 | — |
| CompletedHistory | Board | 4 | 4 | — |
| HabitStatsCard | Habits | 1 | 2 (move from zone 1 to 2) | Low |
| HabitAnalyticsDashboard | Habits | 3 | 3 | — |
| HabitCalendar | Habits | 4 | 4 | — |
| HabitAchievements | Habits | 4 | 4 (collapsible) | Low |
| HabitHeatmap | Habits | 4 | 4 (collapsible) | Low |
| CategoryFilterBar | Timeline | 2 | 2 | — |
| AnalyticsKPIGrid | Timeline | 2 | 2 | — |
| DailyUsageBarChart | Timeline | 3 | 3 | — |
| ActivePeriodsTimeline | Timeline | 4 | 3 (move up) | Medium |
| AppRankingChart | Timeline | 4 | 3 (move up) | Medium |
