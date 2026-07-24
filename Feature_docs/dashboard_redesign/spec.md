# Feature Spec: Learnova-Inspired Dashboard Layout Redesign

## 1. Overview & Goal

Redesign the main **Shodasha** dashboard page (`/`) to mirror the clean, structured aesthetic of the Learnova dashboard mockup while preserving Shodasha's native top navigation bar, productivity tracking, habit streaks, and task management backend.

---

## 2. Layout Structure & Wireframe

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] Shodasha          [Dashboard]  [Board]  [Habits]  [Timeline]  [Settings]      🔍 Search (Cmd+K) 🌙  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 Good Morning / Afternoon,
 User 👋
 Let's make today productive!

┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ Focus Time Today      │ │ Focus Score           │ │ Active Tasks          │ │ Habit Consistency     │
│ 4h 15m             📘 │ │ 85%                ⚡ │ │ 3 Pending          📋 │ │ 83%                🎯 │
│ Target: 6.0h Daily    │ │ Productivity Index    │ │ 1 Task Completed Today│ │ 5 of 6 Completed      │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘

┌─────────────────────────────────────────────────────┬─────────────────────────────────────────────────────┐
│ 📅 Today's Schedule & Active Stream         View All│ 📊 Time Distribution & Focus             This Week  │
│ ─────────────────────────────────────────────────── │ ─────────────────────────────────────────────────── │
│ 09:00 AM  ●  Deep Work: Shodasha Refactor  [ Active ]│                 ┌─────────────┐                     │
│ 10:30 AM  ●  Kanban Code Review            [ Done   ]│               ╱                 ╲                   │
│ 02:00 PM  ●  Desktop Activity Tracking     [ Scheduled]             │      72%        │   ● Deep Work  72%│
│                                                     │               │ Focus Ratio     │   ● Neutral    20%│
│                                                     │                ╲               ╱    ● Distract    8%│
│                                                     │                 └─────────────┘                     │
└─────────────────────────────────────────────────────┴─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┬─────────────────────────────┬───────────────────────────────────┐
│ 🎯 Daily Habits & Goals          View All│ 🔥 Current Streak           │ 📈 Performance Overview Monthly   │
│ ─────────────────────────────────────── │ ─────────────────────────── │ ───────────────────────────────── │
│ 30m Daily Deep Reading       [=======] 72%│            (🔥)             │  100|                    * [85]   │
│ Target: Today                           │           12 Days           │   75|                 *           │
│                                         │                             │   50|          *──*               │
│ Complete DSA Refactor        [====   ] 50%│ Keep it up! You're doing    │   25|   *───*                     │
│ Target: 31 Oct                          │ great with daily check-ins. │    0└──┴────┴─────┴────┴───────── │
└─────────────────────────────────────────┴─────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Key Component Architecture

### A. Top Greeting & Header (`HeaderGreetingCard.tsx`)
- Greeting tailored to time of day ("Good Morning / Afternoon / Evening, User 👋").
- Motivational subtitle "Let's make today productive!".
- Quick Data Refresh button with spinning indicator.

### B. Top KPI Metrics Row (`TopKPIGrid.tsx`)
- 4 compact metric cards matching the mockup's top cards:
  1. **Focus Time Today**: Hours logged vs Daily Goal (e.g. `4h 15m`, Target `6.0h`).
  2. **Focus Score**: Productivity index calculation (e.g. `85%`).
  3. **Active Tasks**: Pending kanban tasks count (e.g. `3 Pending`).
  4. **Habit Consistency**: Daily check-in percentage (e.g. `83%`).

### C. Middle Row (60/40 Split Grid)
1. **Today's Schedule & Stream** (`ScheduleActivityCard.tsx` - 60%):
   - Timeline list of today's tasks and active time entries with timestamps and status tags (`Live Class`/`Active`/`Done`).
2. **Learning & Focus Progress Ring** (`LearningProgressCard.tsx` - 40%):
   - Donut progress chart showing Overall Focus Progress % with legend (Deep Work %, Neutral %, Distraction %).

### D. Bottom Row (35/30/35 Split Grid)
1. **Goals & Habits** (`GoalsHabitsCard.tsx` - 35%):
   - Habit completion progress bars with target dates and toggle checkmarks.
2. **Current Streak Hero Card** (`StreakHeroCard.tsx` - 30%):
   - Purple/indigo gradient card with animated flame icon, big text streak counter ("12 Days"), and motivational message.
3. **Performance Overview Chart** (`PerformanceOverviewChart.tsx` - 35%):
   - Smooth curved line/area chart graphing daily focus hours across the current month with tooltips.

---

## 4. Design Skills Compliance
- **`gpt-taste`**: Clean AIDA page structure, wide containers, desaturated accent colors, no meta-labels ("SECTION 01"), micro-physics hover states.
- **`apple-design`**: Spring-damped transitions, translucent glass cards (`backdrop-blur`), spatial consistency, system typography.
- **`design-taste-frontend-v1`**: Strict grid system, SVG icon primitives (Phosphor/Radix/Lucide), mobile layout collapse (`w-full` fallback for screens `<768px`), zero emojis in UI code.
