# Premium Productivity Dashboard — Deep Research Report

> Compiled from research on Endel, Forest, Habitica, TickTick, ATracker, Toggl Track, and related analytics/gamification tools.

---

## 1. Advanced KPI Metrics by Category

### 1.1 Dashboard (Executive Summary Layer)

These are top-level "headline" metrics — what the user sees first.

| # | Metric | Source Inspiration | Visualization | Description |
|---|--------|-------------------|---------------|-------------|
| 1 | **Focus Score** (0-100) | Focus Meter, Endel, zyFOCUS | Ring gauge + number | Composite of time in productive apps × session depth × switch penalty |
| 2 | **Productivity Index** | TrackNexus, Workstatus | Gauge + trend sparkline | Weighted blend of tasks done, focus hours, completion rate |
| 3 | **Execution Score** | LifeOS, HeartMetrics | Radar chart or single score | How well user executes on planned vs. actual |
| 4 | **Wellness/Balance Score** | ZenScore, GreenSignature | Half-ring gauge | Composite of mood, stress, workload, sleep signals |
| 5 | **Performance DNA Score** | The KPI Hub | Radial score + axis bars | History × consistency × improvement velocity × peer benchmark |
| 6 | **Burnout Risk Indicator** | Workstatus, HeartMetrics | Traffic-light badge + trend | Early warning: calendar saturation, after-hours work, meeting load |
| 7 | **MRR of Self (Energy Score)** | Kartib, Endel | Line chart (circadian) | Track energy highs/lows throughout the day |
| 8 | **System Entropy** | LifeOS | Number + bar | Measure of fragmentation — context switches, unfinished tasks |
| 9 | **Velocity Check** | LifeOS | Line chart + Δ badge | Tasks completed per unit time vs. rolling average |
| 10 | **Goal Attainment Rate** | Profit.co OKR | Stacked bar | % of OKRs / goals on track vs. at risk vs. missed |
| 11 | **Health Score (Composite)** | KPI Hub, HeartMetrics | Multi-metric card | 4-5 key indicators rolled into one tile |
| 12 | **LTV:CAC (Personal)** | Definite, Xpherium | Number card | Time invested vs. value produced in key areas |
| 13 | **Capacity Utilization** | Toggl Track, TrackNexus | Gauge | Productive hours ÷ available hours |
| 14 | **Context Switch Index** | Focus Meter, zyFOCUS | Number + severity badge | Estimated switches per hour with cognitive tax |
| 15 | **Momentum Score** | Forest, Duolingo | Flame icon + number | Recent 7-day completion rate weighted by recency |

### 1.2 Habits (Habit Tracker Metrics)

| # | Metric | Source Inspiration | Visualization | Description |
|---|--------|-------------------|---------------|-------------|
| 16 | **Active Streak** | Duolingo, Forest, Trophy | Flame badge + number | Current consecutive days of habit completion |
| 17 | **Longest Streak** | Duolingo, TickTick | Trophy + number | All-time best streak record |
| 18 | **Streak Calendar** | Trophy Gamification Kit | 7-week grid (colored cells) | Visual streak history per habit |
| 19 | **Completion Rate (7/30/90d)** | TickTick, ATracker | Ring + trend | % of habit completions in window |
| 20 | **Habit Consistency Score** | HabitBox, Habitica | Radar or ring | How evenly user maintains all habits (not just one) |
| 21 | **Habit Trend Line** | TickTick Analytics, Habitica | Sparkline + direction arrow | Weekly completion rate over 12 weeks |
| 22 | **Recovery Rate** | Duolingo (streak freeze) | Badge | How quickly user returns after a missed day |
| 23 | **Habit Category Balance** | TickTick, Forest (tags) | Stacked bar or donut | Distribution across health, work, learning, etc. |
| 24 | **Best Time of Day** | TickTick Focus, Endel | Clock heatmap | When user is most consistent with each habit |
| 25 | **Mastery Level** | Habitica XP, Forest species | Level badge per habit | Each habit has XP-based level (1-10+) |
| 26 | **Habit Chaining** | Habitica (quests) | Tree/network graph | How habits trigger or support each other |
| 27 | **Missed Day Count** | TickTick, Habitica | Red counter | Days habit was not completed |
| 28 | **Grace/Flex Used** | Duolingo Streak Freeze | Shield icon | How often user invoked streak protection |
| 29 | **Habit Quality Score** | Custom | Ring icon | Self-rated quality (1-5) per completion, averaged |
| 30 | **Social Accountability** | Forest (friends), Habitica (party) | Number | Tasks done in group sessions vs. solo |

### 1.3 Timeline / Calendar (Time Distribution Metrics)

| # | Metric | Source Inspiration | Visualization | Description |
|---|--------|-------------------|---------------|-------------|
| 31 | **Deep Work Hours** | Endel Focus, Toggl Track | Bar chart (stacked) | Total time in 25+ min uninterrupted blocks |
| 32 | **Peak Productivity Window** | TickTick Focus, zyFOCUS | Horizontal bar / heatmap | Hour of day with highest task completion |
| 33 | **Meeting-to-Work Ratio** | TrackNexus, Toggl | Segmented bar | Meeting hours ÷ deep work hours |
| 34 | **Time Category Distribution** | ATracker, Toggl | Donut or stacked bar | % time across Work, Health, Social, etc. |
| 35 | **Calendar Saturation** | ZenScore, Prisma Calendar | Heatmap + % | How full the calendar is (meetings/events) |
| 36 | **After-Hours Work** | Workstatus, HeartMetrics | Clock badge | Hours worked outside typical window |
| 37 | **Recovery Time** | ZenScore | Number | Gaps between meetings — context recovery |
| 38 | **Day Archetype** | LifeOS, Focus Menu | Label badge | Categorizes day as "Deep Work", "Meetings", "Mixed", "Rest" |
| 39 | **Pomodoro Count** | TickTick, Forest | Number + ring | Total Pomodoro sessions completed today/week |
| 40 | **Interruption Source Breakdown** | Focus Meter | Horizontal bar | Slack, email, social, meetings as % of interrupts |
| 41 | **Focus Block Quality** | Endel, zyFOCUS | Ring color | Rating per block based on length × deepness |
| 42 | **Time Accuracy** | LifeOS (auto-rolling) | % badge | Planned time vs. actual time per task |
| 43 | **Billable vs. Non-billable** | Toggl Track, ATracker | Stacked bar | Work hours categorized by revenue type |
| 44 | **Utilization Rate** | Toggl Track, TrackNexus | Gauge | Productive ÷ available hours |
| 45 | **Day Score** | ATracker, Toggl | Single number 0-100 | Overall day rating combining focus + completion + balance |

### 1.4 Board / Kanban / Tasks (Task Management Metrics)

| # | Metric | Source Inspiration | Visualization | Description |
|---|--------|-------------------|---------------|-------------|
| 46 | **Cycle Time** | Agile/lean, Toggl | Bar + trend | Avg time from "in progress" → "done" |
| 47 | **Throughput** | Agile/lean | Sparkline + Δ | Tasks completed per day/week |
| 48 | **WIP (Work in Progress)** | Kanban | Number card | How many items are actively being worked on |
| 49 | **Completion Rate** | TickTick (achievement) | Ring | % of today's tasks completed |
| 50 | **Overdue Count** | TickTick, Habitica | Red number | Tasks past their due date |
| 51 | **Task Velocity** | zyFOCUS, LifeOS | Line chart | Tasks completed per unit time, rolling avg |
| 52 | **Burndown** | Agile | Area chart | Planned vs. remaining tasks over sprint window |
| 53 | **Eisenhower Quadrant Distribution** | TickTick (matrix), Covey | Scatter plot or 4-square | Tasks by urgent/important matrix |
| 54 | **Priority Adherence** | Custom | % badge | % of completed tasks that were top-priority |
| 55 | **Estimation Accuracy** | Toggl Track | % + Δ badge | Planned duration vs. actual duration |
| 56 | **Task Aging** | Custom | Number | Days since a task entered the board without progress |
| 57 | **Blocked Time** | HeartMetrics, Agile | Bar | Time tasks spend in blocked state |
| 58 | **Batch Size** | Custom | Number | Avg number of tasks completed per work session |
| 59 | **Sprint Goal Success** | Agile OKRs | Boolean + progress bar | Did user achieve the sprint commitment? |
| 60 | **Task Diversity Score** | Custom | Radar | Distribution across project types, contexts, skills |

---

## 2. Visualization Types for Each Metric

### 2.1 Core Visualization Vocabulary

| Visualization | Best For | Example Metrics | Source |
|---------------|----------|----------------|--------|
| **Single Ring / Donut** | Single percentage | Completion rate, Focus Score | Apple Watch, Trophy |
| **Concentric Rings** | 3-5 related metrics | Move/Exercise/Stand, Work/Health/Social | Apple Watch, `multi-layer-radial-chart` |
| **Stacked Donut** | 2-level hierarchy (category + subcategory) | Time by area + sub-area | shadcn stacked donut, amCharts |
| **Half-Ring / Gauge (180°)** | Single status metric — "good enough?" | Focus Score, Balance Score | `multi-layer-radial-chart` (maxSweepDegrees: 270) |
| **Radar / Spider Chart** | Multi-dimensional comparison | Skill axes, Habit balance, Category balance | SkillRadar, GoalOS, shadcn radar |
| **Heatmap (Calendar)** | Daily density over time | Activity streaks, habit completion | GitHub, Prisma Calendar, TickTick |
| **Circular / Polar Heatmap** | Time-of-day patterns | Peak hours, energy cycles | Simplify Charts (radial variant) |
| **Bar (Stacked / Grouped)** | Composition or comparison over time | Time by category, completion by day | Toggl Track, ATracker |
| **Line / Sparkline** | Trend over time | Productivity index, focus trend | Most apps |
| **Area Chart** | Volume over time with cumulative feel | Deep work volume, total focus time | Toggl Analytics |
| **Scatter Plot** | Correlation | Energy vs. task completion | Advanced |
| **Pill / Badge** | Single value, low cognitive load | Streak count, level, burn status | Forest, Habitica |
| **Traffic Light (Green/Yellow/Red)** | Goal status | KPI health, burnout risk | Upgraded AI Scorecard, KPI Tree |
| **Tree / Causal Map** | Root cause & relationships | Metric connections | KPI Tree |
| **Number + Δ (Delta)** | Current value + direction | Velocity, completion rate | Definite, The KPI Hub |
| **Bento Grid** | Mixed-metric overview | Dashboard home | LifeOS, 21st.dev profiles |

### 2.2 Recommended Visualizations per Section

**Dashboard (Top-Level):**
- Focus Score → Ring Gauge (180°) with animated count-up
- Health/Wellness → Concentric Rings (3 rings: Work, Health, Growth)
- Burnout → Traffic light badge + sparkline
- Goal Attainment → Stacked bar (on track / at risk / missed)
- Velocity → Sparkline + Δ percentage

**Habits:**
- Active/Longest Streak → Flame badge + number (Trophy-style)
- Streak Calendar → 7x7 color grid per habit
- Completion Rate → Ring (single) with trend arrow
- Habit Radar → Spider chart of 6-8 habit categories
- Best Time → Clock-heatmap (circular)

**Timeline:**
- Time Distribution → Stacked donut or stacked bar
- Deep Work Hours → Bar chart with comparison line
- Peak Hours → Circular heatmap (hours × days)
- Day Contrast → Bar: deep work vs. meetings vs. admin
- Week Archetype → Label badge with color

**Board:**
- WIP / Throughput → Sparkline cards
- Cycle Time → Horizontal bar (avg + per item)
- Burndown → Area chart
- Eisenhower Matrix → 4-quadrant scatter
- Blocked time → Red bar segment

---

## 3. Radar / Spider Charts for Skills

### 3.1 Key Findings

- **SkillRadar** — Maps professional skills as a radar chart; supports current vs. target overlay; AI-powered action plan; snapshot comparison over time
- **GoalOS Skill Radar** — Hexagonal chart; current vs. target profile; gap bars below show which skills need most attention
- **shadcn/blocks Features Radar** — Three-column trio of radar charts; concentric axis rings; monochrome polygon fills; staggered entrance animations
- **Oracle HCM Skills Spider** — Up to 8 skills at a time; auto-selects largest gap skills; toggle between list and chart view
- **React Levels Chart** — Engineering ladders: Technology, System, People, Process, Influence axes; dropdown selectors per axis
- **Skills Radar Analyzer** — Compare user vs. company requirements; AI gap detection; course recommendations

### 3.2 Design Patterns for Skill Radars

1. **Overlay Mode** — Current (solid fill) + Target (dashed outline) on same chart; gap = learning opportunity
2. **Time Series** — Multiple radar layers with opacity for historical snapshots (last month, last quarter)
3. **Benchmark** — Self vs. peer avg vs. target — three layers with distinct styles
4. **Axes Limitation** — Best with 4-7 axes; beyond 8 becomes unreadable (Oracle caps at 8)
5. **Scale** — 0-5 (None → Aware → Basic → Competent → Advanced → Expert) or 1-10
6. **Gap Bars** — Below the radar, show horizontal bar for each skill gap (current vs. target) — GoalOS pattern

### 3.3 Suggested Axes for Shodasha

**Habit Balance Radar:** Consistency / Recovery / Depth / Diversity / Quality / Duration

**Life Balance Radar:** Work / Health / Learning / Social / Finance / Growth

**Time Management Radar:** Focus / Planning / Adaptability / Boundaries / Reflection / Energy

---

## 4. Heatmaps and Calendar Visualizations

### 4.1 Variants

| Variant | Best For | Examples |
|---------|----------|----------|
| **GitHub-style Calendar** | Daily activity density over a year | Prisma Calendar, TickTick Year View |
| **Monthly Grid** | One month at a time, larger cells, date labels | shadcn stats-calendar-heatmap-month |
| **Circular / Polar** | Time-of-day × day-of-week patterns (hours on circumference) | Simplify Charts Heatmap radial |
| **Compact Strip** | Horizontal scrolling row for low-noise live activity | VLLNT UI Activity Strip |
| **Matrix** | Correlation between 2 dimensions | General purpose |
| **90-Day Window** | Shorter focused range for sprint/quarter tracking | shadcn heatmap calendar |

### 4.2 Implementations

| Library | Features | Link |
|---------|----------|------|
| shadcn Heatmap Calendar | Calendar, radial, matrix, compact variants; color themes; tooltips | Simplify Charts |
| shadcn Calendar Year Overview | 12-month grid; heatmap density per day; yearly stats | shadcn/blocks |
| shadcn Stats Calendar Heatmap Month | 6×7 grid; 5-level emerald ramp; intensity legend | shadcn/blocks |
| Prisma Calendar Heatmap | Daily, weekly, monthly/yearly views; 5-level quartile gradient | Prisma Calendar |
| VLLNT Activity Heatmap | Contribution-style grid; 12-week default; 5-level emerald ramp | VLLNT UI |
| shadcn-calendar-heatmap (gurbaaz27) | Multi-month; weighted dates; preset variants (streaks, temp) | GitHub |
| Heatmap-Builder (Ruby) | SVG generator; OKLCH color interpolation; parametric | GitHub |

### 4.3 Premium Features to Implement

- **5-level intensity gradient** based on quartile distribution (not raw values)
- **Rounded / circular cells** (corner_radius up to cell_size/2)
- **Tooltip on hover** showing exact value + date
- **Category color tinting** — gradient inherits category hue
- **Month spacing** — visual separation between months
- **Compact mode** for dashboards (fewer weeks, smaller cells)
- **Click to drill** — clicking a day shows details in panel below

---

## 5. Streak and Achievement Visualization

### 5.1 Streak Design Patterns

| Component | Features | Source |
|-----------|----------|--------|
| **Streak Card** | Current streak, longest streak, total, weekly calendar, "how it works" | Trophy Gamification UI |
| **Streak Calendar** | 7-week grid; colored cells; gap indicators | Trophy |
| **Streak Badge** | Compact badge showing current count + flame icon | Trophy |
| **Streak Counter** | Animated counter; current + longest; sparkline dots for history | shadcn todo-list-streak-counter |
| **Success Streak Maintained** | Animated counter; weekly context; milestone celebrations | shadcn/blocks |

### 5.2 Achievement Design Patterns

| Component | Features | Source |
|-----------|----------|--------|
| **Achievement Badge** | Locked/unlocked states; progress ring; rarity indicator | Trophy |
| **Achievement Card** | Full card with description, icon, status, progress | Trophy |
| **Achievement Grid** | Grid of badges with series progress | Trophy |
| **Achievement Unlocked** | Celebration animation on unlock | Trophy |
| **Streak Milestone** | Confetti, animated graphic on Day 7/30/50/100/365 | Duolingo |

### 5.3 Gamification Architecture

**Honest Gamification Principles** (VP0 Journal):
- Reward real progress toward value, not vanity metrics
- Avoid guilt-based streak pressure and manufactured urgency
- Let users opt out of competitive elements
- Respect `prefers-reduced-motion` for celebrations
- Do not convey progress with color alone

**Duolingo Mechanics** (VP0 Analysis):
- Streak rewards showing up (not just completion)
- XP makes effort tangible
- Levels mark meaningful thresholds
- Small celebratory moments mark wins
- Streak freeze (grace mechanism) for recovery

**Habitica Mechanics**:
- XP + Gold + HP = 3-currency economy
- HP loss on missed dailies creates real consequence
- Quests with party members for shared accountability
- Equipment/gear as visual progress signal
- Class system (Warrior, Mage, Healer, Rogue) for playstyle choice

### 5.4 Suggested System for Shodasha

| Layer | Element | Trigger | Reward |
|-------|---------|---------|--------|
| **Streaks** | Daily streak counter | Consecutive days of ≥1 check-in | Flame icon, level-up at 7/30/100 |
| **Milestones** | Badge unlocks | Tasks completed (100, 500, 1000) | Unlockable badges with rarity |
| **Levels** | Overall user level | XP from all activities | 1-100 scale, unlocks features |
| **Challenges** | Weekly/monthly quests | "Complete 20 habits this week" | XP bonus + limited badge |
| **Series** | Tiered achievements | Consistency I (7d), II (30d), III (90d) | Badge series with visual evolution |
| **Recovery** | Streak freeze / grace | Allows 1 miss per 7 days without breaking | Shield icon, limited use |
| **Social** | Group challenges | Focus together, team streak | Shared forest / party (Forest/Habitica) |

---

## 6. Donut / Ring Chart Variations

### 6.1 Available Implementations

| Library | Features | Link |
|---------|----------|------|
| **multi-layer-radial-chart** | Pure SVG; animated; rAF tweening; ARIA; gradient; gauge mode | MosheHatab/multi-layer-radial-chart |
| **mantine-rings-progress** | Apple-ring style; glow/neon; per-ring gradients; pulse on completion; tooltip | gfazioli/mantine-rings-progress |
| **shadcn Concentric Rings** | 3-ring Apple Watch style; stroke-dasharray arcs; NumberFlow center | shadcn/blocks |
| **shadcn Stacked Donut** | 2-level (inner + outer ring); pill legend; Recharts Pie + Pie | shadcn/blocks |
| **RGraph Activity Meter** | Multi-ring; icon per ring; grow animation; responsive | RGraph.net |
| **animata Ring Chart** | iOS-style; configurable size/gap/width; dark first | animata.design |
| **amCharts Nested Donut** | Any number of series; automatic nesting; sequential entrance | amCharts |

### 6.2 Design Patterns

1. **Concentric Rings (Apple Watch)** — Multiple metrics, outer to inner: primary → secondary → tertiary. Gap between rings. Rounded caps.
2. **Nested Donut (2-level)** — Outer ring: subcategories; Inner ring: high-level grouping. Legend below.
3. **Single Ring + Center Icon** — One progress ring with icon/number in center. Perfect for habit completion.
4. **Gauge Mode (270°/180°)** — Sweep-limited arc for "not full circle" feel. Good for scores.
5. **Stacked Segments** — Multiple metrics sharing one ring (like a circular stacked bar). Not concentric, but adjacent.
6. **Ring with Overflow** — Allow value > 100% to create overlapping extra lap (like Apple Watch Move).

### 6.3 Technical Implementation Notes

- Use pure SVG: `<circle>` with `stroke-dasharray` + `stroke-dashoffset`
- Animate with `requestAnimationFrame` (not setInterval) for smooth 60fps
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `role="progressbar"` for accessibility
- `prefers-reduced-motion` media query to disable animation
- Use `ResizeObserver` for responsive sizing
- Decouple geometry math from rendering (headless pattern from `multi-layer-radial-chart`)

---

## 7. Focus Score Composites

### 7.1 How Premium Apps Calculate Composite Scores

| Source | Score Name | Inputs | Formula Approach |
|--------|-----------|--------|-----------------|
| **Focus Meter** | Focus Score (0-100) | Time in productive apps × Session depth × Context switch penalty | Weighted product — cheating any axis drops the number |
| **ZenScore** | Wellbeing Score (0-100) | Mood, stress, workload, habits, completion | Recent 7 days weighted by recency |
| **TrackNexus** | Productivity Score | Focus time %, task completion rate, meeting-to-work ratio, collaboration index | 5-metric scorecard vs. 4-week rolling avg |
| **The KPI Hub** | Performance DNA Score | KPI history, consistency, improvement velocity, peer benchmark | Multi-dimensional composite |
| **HeartMetrics** | WHI (Work Happiness Index) | Mood signals, workload, recognition, growth | Transparent weight model with confidence levels |
| **LifeOS** | Execution Score | Task velocity, system entropy, emotional wave | Thermodynamics-inspired |
| **zyFOCUS** | Productivity Score | Tasks done, focus time, notes, events | Not disclosed — premium feature |
| **Focus Menu** | Life Balance Score | Time across 10 life areas, mood, focus | AI-powered with pattern detection |

### 7.2 Building a Composite Score: Framework

```
Focus Score = w₁ × TimeQuality + w₂ × TaskCompletion + w₃ × Consistency + w₄ × BalancePenalty
```

**Step 1: Define axes (each 0-100)**
- **TimeQuality**: Deep work hours ÷ total tracked time (capped at 1.0)
- **TaskCompletion**: Tasks done ÷ tasks planned
- **Consistency**: Rolling 7-day streak factor (1.0 if full, decays to 0)
- **BalancePenalty**: Deduction for overwork, late-night work, missed categories

**Step 2: Weight and normalize**
- Default weights: 0.4 / 0.3 / 0.2 / 0.1 (user-adjustable)
- Normalize each axis to 0-100
- Apply penalty multiplicatively: `Score × (1 - BalancePenalty)`

**Step 3: Show sub-scores**
- Donut showing each axis contribution
- Click to drill into what's dragging the score down

**Step 4: Trend**
- Score over last 7/30/90 days
- Tuesday vs. last Tuesday comparison
- Alert when score drops >20% from norm

### 7.3 Scoring Design Principles

1. **One number beats a dashboard** — Collapsing complexity into a single score makes it behavior-changing (Focus Meter philosophy)
2. **Trend > absolute** — A 55 that used to be "OK" feels different when last week was 48
3. **Transparent breakdown** — Every score must be explainable: "which signals contributed, how weighted, what to do"
4. **Not a surveillance tool** — Private, on-device, no manager visibility
5. **Graceful** — No streak punishment; a meeting-heavy day with low score is correct information, not failure

---

## 8. Information Hierarchy

### 8.1 Dashboard Layout (Top-Down Priority)

```
┌──────────────────────────────────────────────────────┐
│  HEADLINE ROW (Always visible, above the fold)       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Focus Score│ │Streak    │ │Tasks Done│ │Energy    │ │
│  │  (ring)   │ │  (flame) │ │  (number)│ │  (wave)  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
├──────────────────────────────────────────────────────┤
│  TRENDS ROW (Main insight area)                      │
│  ┌──────────────────┐ ┌──────────────────────────────┐│
│  │  Focus Score Trend │  │  Habit Completion Heatmap   ││
│  │  (line chart 7d)   │  │  (calendar grid this month) ││
│  └──────────────────┘ └──────────────────────────────┘│
├──────────────────────────────────────────────────────┤
│  DETAIL ROW (Drill-down widgets)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Habit     │ │Time Dist │ │Skill     │ │Board     │ │
│  │Radar     │ │Stacked   │ │Radar     │ │WIP/cycle │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└──────────────────────────────────────────────────────┘
```

### 8.2 Progressive Disclosure

- **L1 — Glance**: Top row — 4 KPI cards, large numbers/rings, 5-second read
- **L2 — Insight**: Middle section — charts showing trends, patterns, comparisons
- **L3 — Explore**: Detail widgets — interactive (scroll, hover, click-to-drill)
- **L4 — Raw**: Tables, exports, API access

### 8.3 Dashboard Tabs

| Tab | Primary Audience | Key Action |
|-----|-----------------|------------|
| **Overview** | Everyone | "How is my productivity today?" |
| **Habits** | Habit-focussed users | "What habits need attention?" |
| **Timeline** | Time analytics users | "Where is my time going?" |
| **Board** | Task-driven users | "What's blocking me?" |
| **Settings** | Power users | "Configure my metrics" |

---

## 9. Color Coding Strategies

### 9.1 Semantic Color System

| Metric State | Color | Hex | Use Case |
|-------------|-------|-----|----------|
| **Excellent** | Emerald/Success | `#10b981` | Above target, on track |
| **Good** | Blue/Info | `#3b82f6` | Meeting expectations |
| **Warning** | Amber/Warning | `#f59e0b` | Below target, needs attention |
| **Critical** | Red/Destructive | `#ef4444` | Danger zone, action required |
| **Neutral** | Gray/Muted | `#6b7280` | No data, inactive, locked |

### 9.2 Chart-Specific Palettes

**Ring/Donut Charts:**
- Chart-1 (primary metric): `--chart-1 = 221.2 83.2% 53.3%`
- Chart-2 (secondary): `--chart-2 = 212 95% 68%`
- Chart-3: `--chart-3 = 216 92% 60%`
- Chart-4: `--chart-4 = 210 98% 78%`
- Chart-5: `--chart-5 = 212 97% 87%`

**Heatmaps (5-level):**
- Level 0: `bg-muted` (no activity)
- Level 1: `bg-emerald-500/25` (low)
- Level 2: `bg-emerald-500/45` (below avg)
- Level 3: `bg-emerald-500/65` (above avg)
- Level 4: `bg-emerald-500` (high)

**Habit categories (distinct, colorblind-safe):**
- Health: Rose `#e11d48`
- Work: Blue `#2563eb`
- Learning: Violet `#7c3aed`
- Social: Amber `#d97706`
- Growth: Emerald `#059669`
- Admin: Gray `#6b7280`

### 9.3 Accessibility

- Never rely on color alone for status — always add icons, labels, or patterns
- Maintain 4.5:1 contrast ratio for text on colored backgrounds
- Support `prefers-color-scheme: dark` with adjusted palette
- Use dashed patterns (`pattern` prop in `multi-layer-radial-chart`) as secondary differentiator

### 9.4 Color Psychology for Metrics

| Metric Type | Palette Direction | Why |
|-------------|------------------|-----|
| **Score/Index** | Green → Yellow → Red | Familiar traffic-light mapping |
| **Time** | Single hue intensity | Simpler cognitive mapping |
| **Category** | Distinct hues | Differentiation beats hierarchy |
| **Priority** | Red → Orange → Blue | Urgency mapping (red = urgent) |
| **Mood/Energy** | Cool → Warm (blue → orange) | Temperature metaphor |
| **Completion** | Saturation gradient | Empty → full = pale → saturated |

---

## 10. Libraries and Component Recommendations

### 10.1 Chart / Visualization Libraries

| Library | Best For | Install | Notes |
|---------|----------|---------|-------|
| **multi-layer-radial-chart** | Apple-style concentric rings | `npm i multi-layer-radial-chart` | Pure SVG, rAF, ARIA, headless core |
| **Recharts** | Line, bar, area, pie, radar | Already installed | Industry standard for React |
| **Victory** | Advanced radar, polar charts | `npm i victory` | Good for skill radar |
| **reaviz** | Heatmap, calendar heatmap | `npm i reaviz` | Specialized heatmaps |
| **Nivo** | Heatmap, radar, stream | `npm i @nivo/core` | Rich animation, theming |

### 10.2 Gamification UI Kits

| Library | Components | Install |
|---------|-----------|---------|
| **Trophy Gamification UI Kit** | StreakCard, StreakCalendar, StreakBadge, AchievementBadge, AchievementGrid, PointsBadge, LevelsTimeline | `npx shadcn@latest add https://ui.trophy.so` |
| **shadcn/blocks (streak-related)** | dialog-streak-tracker, todo-list-streak-counter, success-streak-maintained | `npx shadcn add <block>` |

### 10.3 Interesting shadcn Blocks for This Dashboard

| Block | Purpose |
|-------|---------|
| `stats-concentric-rings-card` | Apple Watch style 3-ring progress |
| `stats-stacked-donut-card` | 2-level nested donut for time distribution |
| `stats-calendar-heatmap-month` | Month view activity density |
| `features-radar-chart-capability-trio` | Side-by-side radar charts |
| `dialog-streak-tracker` | Streak tracking dialog |
| `todo-list-streak-counter` | Task list with streak indicators |
| `success-streak-maintained` | Celebration when streak continues |
| `calendar-year-overview` | Year heatmap overview |

---

## 11. Key Takeaways for Shodasha

1. **Start with one composite score** (Focus Score) as the headline — make it glanceable, animated, and always visible
2. **Heatmaps are the highest-density visualization** — use them for habits and calendar views
3. **Radar charts work for 5-7 dimensions max** — use for skill balance and life area balance
4. **Gamification must be honest** — reward real progress, avoid guilt, respect reduced motion
5. **Concentric rings are the premium visual anchor** — 3-ring Apple Watch style is instantly familiar
6. **Progressive disclosure is essential** — glance → insight → explore → raw data
7. **Color coding must be accessible** — never color-only status, maintain contrast, support dark mode
8. **Trophy Gamification UI Kit + shadcn blocks** provide 80% of the UI components needed
9. **The Focus Score should be composite and transparent** — show which sub-metrics contribute
10. **Trend > absolute** — every metric should show direction (Δ badge or sparkline)
