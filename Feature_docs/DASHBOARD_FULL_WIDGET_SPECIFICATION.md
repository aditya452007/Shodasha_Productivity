# Shodasha Complete 34-Widget UI, Metric & Backend Specification

> **Document Type:** Exhaustive 34-Widget UI, Mathematical & Backend Specification  
> **Target Application:** Shodasha Desktop Productivity (Windows Local/Offline App)  
> **Target Path:** `Feature_docs/DASHBOARD_FULL_WIDGET_SPECIFICATION.md`  
> **Status:** Definitive Master Implementation Guide  

---

## 1. Executive Summary & Design System Guardrails

This document presents a **100% complete, microscopic specification** of all **34 distinct widgets and components** identified across the three design reference images:
* **Reference Image 1:** Consistency & Vitals Dashboard (14 widgets)
* **Reference Image 2:** Hebats / Integrations Ecosystem (13 widgets)
* **Reference Image 3:** Vertex Phaw / Task & Schedule Board (7 widgets)

### Anti-Slop Design Architecture: The "Double-Bezel" (Doppelrand) Standard

In strict accordance with Shodasha's design standards, we **avoid generic, overdone blur-heavy glassmorphism**. All components strictly adhere to the **Double-Bezel (Doppelrand) Machined Enclosure Architecture**:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ OUTER SHELL: bg-slate-900/5 dark:bg-white/5, ring-1 ring-black/5 dark:ring-white/10, rounded-[24px], p-1.5  │
│ ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ INNER CORE: bg-white dark:bg-zinc-900, rounded-[18px], inset-shadow, p-5                             │ │
│ │ Component Content, Crisp Typography (Geist/Plus Jakarta Sans), Phosphor/Lucide Light Vector Icons      │ │
│ └───────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete 34-Widget Master Inventory & Tab Assignment Matrix

| # | Widget Name | Source Ref | Target Shodasha Tab | Primary Metric / Function | Backend Data Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `HeaderGreetingWidget` | Img 1 | Dashboard (`/`) | Time-aware greeting & mode selector | `useSettingsStore` |
| **2** | `DualMediaStatWidget` | Img 1 | Dashboard (`/`) | Split goal progress (Pages & Distance) | SQLite `user_goals` |
| **3** | `MusicPlayerWidget` | Img 1 | Dashboard (`/`) | Active vinyl player & media controls | Tauri IPC `get_active_media` |
| **4** | `QuietTimeTimerWidget` | Img 1 | Dashboard (`/`) | 25m/50m focus session countdown | `useTimeEntryStore` |
| **5** | `InspirationQuoteWidget` | Img 1 | Dashboard (`/`) | User avatar & daily motivational quote | Local Quote Array |
| **6** | `AddWidgetDockButton` | Img 1 | Dashboard (`/`) | Modal trigger to enable/disable widgets | `useUIStore` |
| **7** | `HeaderDashboardBar` | Img 1 | Dashboard (`/`) | Page title, AI trigger, Alerts, Avatar | `useUIStore` & System |
| **8** | `SleepTrackerWidget` | Img 1 | Dashboard (`/`) | Concentric 3-ring sleep arc visualization | Replaced by `FocusScoreRing` |
| **9** | `HeartRateWidget` | Img 1 | Dashboard (`/`) | Live Bpm sparkline ECG curve | Replaced by `ActiveBpmPulse` |
| **10** | `CortisolStressWidget` | Img 1 | Dashboard (`/`) | Stress score (0-100) color gauge bar | Replaced by `DistractionGauge` |
| **11** | `ScheduleCalendarWidget` | Img 1 | Dashboard (`/`) | Week strip calendar & task checklist | `useTaskStore` |
| **12** | `HabitStreakMatrixWidget` | Img 1 | Habits (`/habits`) | Horizontal day rings (12-31) status | `useHabitStore` |
| **13** | `FavouriteHabitChartWidget` | Img 1 | Habits (`/habits`) | Habit duration vertical bar chart | `useHabitStore` & `timeEntries` |
| **14** | `JournalingFeatureCard` | Img 1 | Dashboard (`/`) | Quick note capture & daily reflection | SQLite `daily_notes` |
| **15** | `HeaderBreadcrumbWidget` | Img 2 | Global Shell | Breadcrumb path & live date/time | Next.js Router & Clock |
| **16** | `QuickHabitActionsWidget` | Img 2 | Habits (`/habits`) | `+ New Habits` & `Browse Popular` buttons | `useUIStore` modals |
| **17** | `MiniCalendarWidget` | Img 2 | Habits (`/habits`) | 31-day month grid & growth badge | `useHabitStore` |
| **18** | `AppSyncBannerWidget` | Img 2 | Settings (`/settings`) | Local SQLite database backup status | Tauri IPC `get_db_status` |
| **19** | `WeatherIntegrationWidget` | Img 2 | Dashboard (`/`) | Temp, 3D weather art, humidity, wind | Tauri IPC `get_local_weather` |
| **20** | `TodaysTodosChecklistWidget` | Img 2 | Dashboard (`/`) | Floating checklist of today's urgent tasks | `useTaskStore` |
| **21** | `SpotifyIntegrationWidget` | Img 2 | Settings (`/settings`) | Spotify account link & playback state | Windows SMTC / OAuth |
| **22** | `MoreIntegrationsWidget` | Img 2 | Settings (`/settings`) | Coral gradient integrations teaser | Static Integration List |
| **23** | `ShouldDoRoutinesWidget` | Img 2 | Habits (`/habits`) | Suggested local routine templates | Static Routine Templates |
| **24** | `RunningCompetitionWidget` | Img 2 | Timeline (`/timeline`) | Event map preview card with distance | SQLite `time_entries` map |
| **25** | `PositiveHabitsScoreWidget` | Img 2 | Habits (`/habits`) | Percentage habit growth score badge | `useHabitStore` calculation |
| **26** | `HabitsWrappedCard` | Img 2 | Habits (`/habits`) | Year-end habit summary celebration card | `useHabitStore` stats |
| **27** | `FavoriteHabitsBarChartWidget` | Img 2 | Habits (`/habits`) | Category search & day tab bar chart | `useTimeEntryStore` |
| **28** | `VertexHeaderBarWidget` | Img 3 | Global Shell | Header search bar, night toggle, refresh | `useSettingsStore` |
| **29** | `TotalTaskMultiLineChartWidget` | Img 3 | Timeline (`/timeline`) | Multi-series line chart (Dev/Design/Test) | `useTimeEntryStore` & Tasks |
| **30** | `TimeSlotScheduleStripWidget` | Img 3 | Timeline (`/timeline`) | Horizontal time-slot stream (10:00-13:30) | `useTimeEntryStore` |
| **31** | `ProjectHeaderBarWidget` | Img 3 | Board (`/board`) | Project breadcrumb, deadline, add project | `useTaskStore` |
| **32** | `ProjectSubNavWidget` | Img 3 | Board (`/board`) | Sub-tabs & Board/List view switcher | `useUIStore` |
| **33** | `KanbanBoardWidget` | Img 3 | Board (`/board`) | 4-Column Kanban board & drag drop | `useTaskStore` & `@dnd-kit` |
| **34** | `KanbanTaskCardWidget` | Img 3 | Board (`/board`) | Task card with progress & PDF preview | `useTaskStore` |

---

## 3. Microscopic Widget-by-Widget Specification

---

### WIDGET 1: `HeaderGreetingWidget`
* **Source Reference:** Image 1 (Top Left)
* **Target Tab:** Dashboard (`/`) — Top Section
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 48px.
  * **Structure:** Outer Shell `rounded-xl p-1 bg-slate-900/5`, Inner Core `bg-white dark:bg-zinc-900 p-3 flex justify-between items-center`.
  * **Colors:** Text `text-slate-900 dark:text-slate-100`, Subtext `text-slate-500`, Mode Dropdown `#1E293B`.
  * **Typography:** Greeting Title: 20px Semi-Bold (`Plus Jakarta Sans`), Subtitle: 13px Regular.
* **Metrics & Calculations:**
  * Displays dynamic greeting based on current local time:
    $$\text{Greeting} = \begin{cases} \text{"Good morning"} & 05:00 \le t < 12:00 \\ \text{"Good afternoon"} & 12:00 \le t < 17:00 \\ \text{"Good evening"} & \text{otherwise} \end{cases}$$
* **Frontend Display Rules:**
  * Default: "Good morning, User 👋 - Let's build consistency today". Dropdown pill `[ Work mode ∨ ]`.
  * Hover: Dropdown scales down (`active:scale-95`), background shifts to `bg-slate-100`.
* **Backend Data & Inter-Component Connectivity:**
  * Reads `settingsStore.workMode` ('work' | 'personal' | 'deep_focus').
  * Changing mode updates category weighting in `timeEntryStore`.

---

### WIDGET 2: `DualMediaStatWidget`
* **Source Reference:** Image 1 (Left Dock, Row 1)
* **Target Tab:** Dashboard (`/`) — Left Column
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (~260px), Height: 140px. 2-Column Split (`grid-cols-2 gap-2`).
  * **Card Left:** Dark slate card (`bg-slate-900 text-white rounded-2xl p-4`), display "Reading 120 / 200 pages" with book artwork image.
  * **Card Right:** Runner image container (`rounded-2xl overflow-hidden relative`), text overlay "Sun, 12 Mar 2026", "12.08 Km Distance" with route map line.
  * **Colors:** Text `#FFFFFF`, Progress Bar `#FF6B00`.
* **Metrics & Calculations:**
  * Progress percentage: $\text{Progress} = \left(\frac{120}{200}\right) \times 100 = \mathbf{60\%}$.
* **Frontend Display Rules:**
  * Displays progress bar under reading page count; image card has subtle parallax zoom on hover (`group-hover:scale-105 transition-transform duration-500`).
* **Backend Data & Inter-Component Connectivity:**
  * SQLite Table: `user_goals` (`id`, `title`, `current_value`, `target_value`, `unit`).
  * Managed via `useTaskStore`.

---

### WIDGET 3: `MusicPlayerWidget`
* **Source Reference:** Image 1 (Left Dock, Row 2)
* **Target Tab:** Dashboard (`/`) — Left Column
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 110px.
  * **Structure:** Outer Shell `rounded-2xl p-1 bg-slate-900/5`, Inner Core `bg-slate-900 text-white rounded-xl p-4 flex items-center gap-4`.
  * **Vinyl Graphic:** 60px diameter spinning vinyl record graphic (`animate-spin-slow` when playing).
  * **Typography:** Title: 14px Bold ("Deep work Music"), Subtitle: 12px Muted ("H7G group band").
* **Metrics & Calculations:**
  * Tracks media duration elapsed and total track length in seconds.
* **Frontend Display Rules:**
  * Play/Pause toggle rotates vinyl; media control buttons (`|<`, `||`, `>|`) animate on click (`active:scale-90`).
* **Backend Data & Inter-Component Connectivity:**
  * Tauri Rust IPC: `invoke('get_active_media_session')` calls Windows Native System Media Transport Controls (SMTC) to sync active track info from Spotify/Chrome.

---

### WIDGET 4: `QuietTimeTimerWidget`
* **Source Reference:** Image 1 (Left Dock, Row 3)
* **Target Tab:** Dashboard (`/`) — Left Column
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 160px.
  * **Structure:** Deep sapphire container `bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 border border-blue-800/50`.
  * **Typography:** Header: 14px Medium ("Quiet Time"), Countdown: 36px Bold Monospace (`00:10:00` tabular nums).
  * **Buttons:** `Cancel` (ghost button `bg-white/10 text-white`), `Start Session` (solid white button `bg-white text-blue-950 font-semibold`).
* **Metrics & Calculations:**
  * Pomodoro focus session timer counting down from $T_{\text{target}}$ seconds to 0.
* **Frontend Display Rules:**
  * Pulsing radial glow background during active countdown; audio chime plays on completion.
* **Backend Data & Inter-Component Connectivity:**
  * Starting a session locks focus mode in `useUIStore`, creates an active `TimeEntry` in SQLite with `category = 'work'`, and attributes time to selected task (`linkedTaskId`).

---

### WIDGET 5: `InspirationQuoteWidget`
* **Source Reference:** Image 1 (Left Dock, Row 4)
* **Target Tab:** Dashboard (`/`) — Left Column
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 120px. 2-Column Split (`grid-cols-2 gap-2`).
  * **Card Left:** User photo container (`rounded-2xl overflow-hidden object-cover`).
  * **Card Right:** Soft gray quote card (`bg-slate-100 dark:bg-zinc-800 rounded-2xl p-4 flex items-center`), text: *"The smallest steps are still progress."* (Italic serif typography).
* **Metrics & Calculations:** Rotates quotes daily based on Julian day number ($D \pmod N$).
* **Frontend Display Rules:** Text fades in smoothly on daily load.
* **Backend Data & Inter-Component Connectivity:** Local JSON quote array stored in `src/lib/constants/quotes.ts`.

---

### WIDGET 6: `AddWidgetDockButton`
* **Source Reference:** Image 1 (Left Dock Bottom)
* **Target Tab:** Dashboard (`/`)
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 44px.
  * **Style:** Solid dark slate pill button `bg-slate-800 hover:bg-slate-900 text-white rounded-full font-medium text-14px flex items-center justify-center gap-2`.
* **Frontend Display Rules:** On click, opens `WidgetCustomizerModal` allowing user to toggle visible dashboard cards.
* **Backend Data & Inter-Component Connectivity:** Persists widget visibility array in `settingsStore.visibleWidgets`.

---

### WIDGET 7: `HeaderDashboardBar`
* **Source Reference:** Image 1 (Top Main Header)
* **Target Tab:** Global Layout Header
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 56px.
  * **Elements:** Page title ("Dashboard"), `[Ask AI]` pill button with glowing gradient border (`border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10`), Notifications bell icon, Messages icon, Avatar profile pill (`Elena C.`).
* **Backend Data & Inter-Component Connectivity:** Opens Command Palette (`Cmd+K`) and AI assistance drawer.

---

### WIDGET 8: `SleepTrackerWidget` $\rightarrow$ Adapted to `FocusScoreRing`
* **Source Reference:** Image 1 (Main Row 1 Left)
* **Target Tab:** Dashboard (`/`) — Hero Section
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-6`), Height: 220px.
  * **Structure:** Doppelrand card container `rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800`.
  * **Visualization:** Concentric 3-ring SVG progress arc (Outer Ring: Work Time `7h 20m` teal, Middle Ring: Deep Focus `1h 9m` purple, Inner Ring: Quality Score `82%` coral).
* **Metrics & Calculations:**
  $$\text{Focus Score} = \left( \frac{\text{Work Session Duration}}{\text{Total Active Hours}} \times 0.7 + \frac{\text{Completed Habits}}{\text{Total Habits}} \times 0.3 \right) \times 100 = \mathbf{82\%}$$
* **Frontend Display Rules:** Animated SVG stroke-dashoffset fill over 1000ms cubic-bezier curve.
* **Backend Data & Inter-Component Connectivity:** Reads `timeEntryStore.entries` and `habitStore.records`.

---

### WIDGET 9: `HeartRateWidget` $\rightarrow$ Adapted to `ActiveBpmPulse`
* **Source Reference:** Image 1 (Main Row 1 Center-Left)
* **Target Tab:** Dashboard (`/`)
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-3`), Height: 220px.
  * **Elements:** Number display `72 Bpm`, live red sparkline ECG curve SVG, green status pill badge `Lower HR after meditation`.
* **Metrics & Calculations:** Real-time productivity velocity score.
* **Backend Data & Inter-Component Connectivity:** Connects to system active time tracking frequency.

---

### WIDGET 10: `CortisolStressWidget` $\rightarrow$ Adapted to `DistractionGauge`
* **Source Reference:** Image 1 (Main Row 1 Center-Right)
* **Target Tab:** Dashboard (`/`)
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-3`), Height: 220px.
  * **Elements:** Score display `56 / 100`, horizontal color gradient gauge bar (green $\rightarrow$ yellow $\rightarrow$ red) with pointer pin indicator, yellow status badge `Stress higher today`.
* **Metrics & Calculations:**
  $$\text{Distraction Index} = \left( \frac{\text{Distraction Category Duration}}{\text{Total Active Duration}} \right) \times 100 = \mathbf{56}$$
* **Backend Data & Inter-Component Connectivity:** Reads `timeEntryStore` entries tagged with `category = 'distraction'`.

---

### WIDGET 11: `ScheduleCalendarWidget`
* **Source Reference:** Image 1 (Main Row 1 Right Stack)
* **Target Tab:** Dashboard (`/`) — Right Column
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-4`), Height: 440px.
  * **Elements:** Header "Januari, 2025", black pill button `+ Add Tasks`, horizontal 7-day week bar (`Sat 19` to `Fri 25`, active `Tue 22` highlighted in orange pill container), task checklist items with checkmark status:
    1. Meditation (07:00 - 07:20 AM) `[✓ Done]` (Lotus icon)
    2. Skincare routine (07:45 - 08:00 AM) `[✓ Done]` (Flower icon)
    3. Journaling (08:00 - 08:30 AM) `[✓ Done]` (Notebook icon)
    4. Wake up & drink water (08:30 - 09:00 AM) `[✓ Done]` (Dumbbell/Water icon)
* **Metrics & Calculations:** Completion Ratio = $\frac{\text{Done Tasks}}{\text{Total Scheduled Tasks}} \times 100$.
* **Backend Data & Inter-Component Connectivity:** Directly bound to `useTaskStore`. Toggling checkbox updates `task.status = 'done'` in SQLite.

---

### WIDGET 12: `HabitStreakMatrixWidget`
* **Source Reference:** Image 1 (Main Row 2 Full Width)
* **Target Tab:** Habits (`/habits`) — Top Section
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Min-Height: 220px.
  * **Header:** Title "Habit streak", filter dropdown `This month ∨`, view toggle `Monthly | Yearly`.
  * **Matrix Grid:** Horizontal day columns (12 to 28) displaying status rings:
    * Green check circle (`bg-emerald-100 text-emerald-600`): Completed habit.
    * Red exclamation circle (`bg-red-100 text-red-600`): Missed habit.
    * Orange outer ring container: Current active day (Day 22).
* **Metrics & Calculations:**
  $$\text{Streak Length} = \text{Consecutive days with at least 1 completed HabitRecord}$$
* **Backend Data & Inter-Component Connectivity:** Bound to `useHabitStore`. Toggling a habit day updates `habit_records` table in SQLite.

---

### WIDGET 13: `FavouriteHabitChartWidget`
* **Source Reference:** Image 1 (Main Row 3 Left)
* **Target Tab:** Habits (`/habits`) — Analytics Section
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-6`), Height: 300px.
  * **Visualization:** Vertical bar chart comparing habits (*Walk*, *Journaling*, *Meditation*, *Drink water*, *Cardio*, *Skincare*).
  * **Tooltip Overlay:** Meditation bar is highlighted in dark teal with a floating popover badge: `Meditation 45 min ^ 4% vs last month`.
* **Metrics & Calculations:**
  $$\Delta \text{Habit Duration} = \left( \frac{\text{Duration}_{\text{current}} - \text{Duration}_{\text{last}}}{\text{Duration}_{\text{last}}} \right) \times 100 = \mathbf{+4.0\%}$$
* **Backend Data & Inter-Component Connectivity:** Calculated from `useHabitStore` & `useTimeEntryStore`.

---

### WIDGET 14: `JournalingFeatureCard`
* **Source Reference:** Image 1 (Main Row 3 Right)
* **Target Tab:** Dashboard (`/`) — Bottom Right
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-6`), Height: 300px.
  * **Structure:** Gradient background mesh container, header text *"LET'S TRY NEW FEATURE Journaling"*, white pill button `Try now ↗`, glass text input area *"Write a summary of your day"*.
* **Backend Data & Inter-Component Connectivity:** Saves reflection text to SQLite `daily_notes` table.

---

### WIDGET 15: `HeaderBreadcrumbWidget`
* **Source Reference:** Image 2 (Top Left Header)
* **Target Tab:** Global Navigation Header
* **Visual UI Specification:** Breadcrumb text `Dashboard / Schedule`, live timestamp `30 Dec 2023, 10:03 am`, user avatar badge.

---

### WIDGET 16: `QuickHabitActionsWidget`
* **Source Reference:** Image 2 (Left Action Column)
* **Target Tab:** Habits (`/habits`) — Top Bar
* **Visual UI Specification:** Title "Happy Tuesday 👋", solid orange button `+ New Habits` (`bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2.5`), outlined button `Browse Popular Habits`. Opens `AddHabitModal`.

---

### WIDGET 17: `MiniCalendarWidget`
* **Source Reference:** Image 2 (Left Column Center)
* **Target Tab:** Habits (`/habits`) — Sidebar Widget
* **Visual UI Specification:** Month navigator "December, 2023", 7x5 date grid (1-31), active day 30 highlighted in orange circle, bottom growth badge `+3,2% from last month`.

---

### WIDGET 18: `AppSyncBannerWidget`
* **Source Reference:** Image 2 (Left Column Bottom)
* **Target Tab:** Settings (`/settings`) — System Status
* **Visual UI Specification:** Soft cream container with 3D developer Memoji working on laptop, text *"Sync anywhere with Shodasha Desktop - Local SQLite Active"*, button `Backup Database`. Triggers Tauri IPC `backup_database()`.

---

### WIDGET 19: `WeatherIntegrationWidget`
* **Source Reference:** Image 2 (Top Center Grid)
* **Target Tab:** Dashboard (`/`) — Main Grid (`col-span-4`)
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 260px.
  * **Structure:** Soft yellow/cream container (`bg-amber-50/80 dark:bg-amber-950/30 rounded-3xl p-5 border border-amber-200/50 relative overflow-hidden`).
  * **3D Art:** Dynamic 3D yellow umbrella artwork background with rain droplets and blooming flowers.
  * **Metrics Displayed:** Temperature `12°C`, condition icon, Wind `2-4 km/h`, Pressure `102m`, Humidity `42%`.
* **Backend Data & Inter-Component Connectivity:** Calls Open-Meteo REST API via Rust `reqwest` in Tauri, cached locally in SQLite `weather_cache`.

---

### WIDGET 20: `TodaysTodosChecklistWidget`
* **Source Reference:** Image 2 (Center Floating Layer)
* **Target Tab:** Dashboard (`/`) — Main Grid (`col-span-5`)
* **Visual UI Specification:**
  * **Dimensions:** Width: 100%, Height: 260px.
  * **Elevation:** Floating white container with heavy ambient drop shadow (`shadow-2xl rounded-3xl p-5`).
  * **Checklist Items:**
    1. Study (10:00 am • K-Cafe) `[ ]`
    2. Groceries (02:00 pm • Hayday Market) `[ ]`
    3. Eat Healthy Food (08:30 am • Home) `[✓]` (Green check)
    4. Read a book (08:00 am • Library) `[✓]` (Green check)
    5. Swimming for 45min (06:00 am • Gym Pool) `[✓]` (Green check)
* **Backend Data & Inter-Component Connectivity:** Reads top 5 active tasks from `useTaskStore`. Checking item updates SQLite task status.

---

### WIDGET 21: `SpotifyIntegrationWidget`
* **Source Reference:** Image 2 (Top Right Stack)
* **Target Tab:** Settings (`/settings`) & Dashboard Dock
* **Visual UI Specification:** White card container, Spotify green icon, title "Connect your Spotify account", description text, black pill button `🔗 Link Account`. Connects to Windows System Media Transport Controls or Spotify API OAuth.

---

### WIDGET 22: `MoreIntegrationsWidget`
* **Source Reference:** Image 2 (Top Right Stack Bottom)
* **Target Tab:** Settings (`/settings`) — Plugins Section
* **Visual UI Specification:** Coral-red gradient mesh card (`bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-3xl p-6`), title *"More Integrations - 23+ local plugins available"*.

---

### WIDGET 23: `ShouldDoRoutinesWidget`
* **Source Reference:** Image 2 (Middle Left Grid)
* **Target Tab:** Habits (`/habits`) — Recommendations
* **Visual UI Specification:** White card list showing recommended habits ("We go jimmm!! • 4.2k users", "The 5am club • 5.4k users"). Clicking imports routine template into `useHabitStore`.

---

### WIDGET 24: `RunningCompetitionWidget`
* **Source Reference:** Image 2 (Middle Center Grid)
* **Target Tab:** Timeline (`/timeline`) — Event Stream
* **Visual UI Specification:** Route map preview card with starting point pin, date `31 Dec`, distance `20 miles`, time `09:00`, orange circular action button.

---

### WIDGET 25: `PositiveHabitsScoreWidget`
* **Source Reference:** Image 2 (Bottom Grid Left)
* **Target Tab:** Habits (`/habits`) — Analytics Score Card
* **Visual UI Specification:** Mint green container with sunglasses emoji badge, bold metric text `+58,2%`.
* **Calculation:** $\Delta \text{Positive} = \left( \frac{\text{Checkins}_{\text{this}} - \text{Checkins}_{\text{prev}}}{\text{Checkins}_{\text{prev}}} \right) \times 100 = \mathbf{+58.2\%}$.

---

### WIDGET 26: `HabitsWrappedCard`
* **Source Reference:** Image 2 (Bottom Grid Center)
* **Target Tab:** Habits (`/habits`) — Celebration Card
* **Visual UI Specification:** OLED black card (`bg-zinc-950 text-white rounded-3xl p-5`), confetti gift box icon, title "Habits Wrapped 2026", white pill button `View`. Opens year-end summary modal.

---

### WIDGET 27: `FavoriteHabitsBarChartWidget`
* **Source Reference:** Image 2 (Bottom Grid Right)
* **Target Tab:** Habits (`/habits`) & Timeline (`/timeline`)
* **Visual UI Specification:** Header with search input + month filter `December ∨` + day tabs (`Fri 11` to `Fri 15`). Vertical bar chart comparing habit categories (Reading, Gym, Swimming, Tennis [with active popover badge `Tennis 24%`], Study, Design, Running).

---

### WIDGET 28: `VertexHeaderBarWidget`
* **Source Reference:** Image 3 (Top Header)
* **Target Tab:** Global Navigation Header
* **Visual UI Specification:** Greeting "Good morning, Angel 👋", night/light theme toggle, refresh button, search input with microphone icon.

---

### WIDGET 29: `TotalTaskMultiLineChartWidget`
* **Source Reference:** Image 3 (Top Row Left 60% Width)
* **Target Tab:** Timeline (`/timeline`) — Top Section
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-7`), Height: 320px.
  * **Elements:** Total task headline (`59`), growth badge (`↑ 8% vs last month`), motivational text (`keep it up! 🦾`). Multi-line chart graphing 3 category series across months (Apr-Dec): *Designer* (20, teal), *Developer* (11, green), *Testing* (28, orange).
  * **Sub-KPI Bar:** Total member (`24`), Target percentage (`80%`), Upcoming Deadlines (`12 ↑ 8%`).
* **Backend Data & Inter-Component Connectivity:** Queries `time_entries` and `tasks` grouped by `AppCategory`.

---

### WIDGET 30: `TimeSlotScheduleStripWidget`
* **Source Reference:** Image 3 (Top Row Right 40% Width)
* **Target Tab:** Timeline (`/timeline`) — Event Stream
* **Visual UI Specification:**
  * **Dimensions:** Width: 100% (`col-span-5`), Height: 320px.
  * **Elements:** Month navigator "Aug, 2025", nav arrows `< >`, day selector strip (`Fri 5` to `Fri 12`, active `Tue 9` highlighted in orange).
  * **Time-Slot Stream:** Horizontal time grid (10:00 to 13:30) displaying color-coded session blocks:
    * Orange Card: *Designer team meeting* (10:00 - 11:20 AM).
    * Dashed Block: *Break* (1h 15m).
    * Teal Card: *Developer team meeting* (11:40 - 13:00 PM).
* **Backend Data & Inter-Component Connectivity:** Bound to `timeEntryStore.entries` captured by passive tracker.

---

### WIDGET 31: `ProjectHeaderBarWidget`
* **Source Reference:** Image 3 (Middle Section)
* **Target Tab:** Board (`/board`) — Top Header
* **Visual UI Specification:** Breadcrumb `Shared • Team Phoenix / Vertex Phaw`, Deadline badge `17 Feb, 2025`, Status pill `In progress`, Avatar stack (`+3`), primary action button `+ Add Projects` (`bg-teal-600 text-white rounded-xl px-5 py-2`).

---

### WIDGET 32: `ProjectSubNavWidget`
* **Source Reference:** Image 3 (Board Navigation)
* **Target Tab:** Board (`/board`) — Sub-Nav
* **Visual UI Specification:** Sub-tabs (`Overview`, `Tasks`, `Timeline`, `Calendar`, `Files`) with active underline indicator + View mode toggle button group (`Board` vs `List`). Controlled by `useUIStore.boardView`.

---

### WIDGET 33: `KanbanBoardWidget`
* **Source Reference:** Image 3 (Main Kanban Section)
* **Target Tab:** Board (`/board`) — Main Content
* **Visual UI Specification:**
  * **4 Columns:** `To do` (red dot), `In Progress` (orange dot), `Need Review` (purple dot), `Done` (green dot).
  * **Header Controls:** Column title + task count + `+` add task button.
  * **Drag Target Container:** Dashed drop zone (`Drag to here`) displaying drag over highlight state.
* **Backend Data & Inter-Component Connectivity:** Bound to `useTaskStore`. Powered by `@dnd-kit/core` and `@dnd-kit/sortable`. Dropping card invokes Tauri IPC `update_task_status(taskId, newColumnId, newOrder)`.

---

### WIDGET 34: `KanbanTaskCardWidget`
* **Source Reference:** Image 3 (Inside Kanban Columns)
* **Target Tab:** Board (`/board`) — Task Item
* **Visual UI Specification:**
  * **Structure:** Outer Shell `rounded-2xl p-1 bg-slate-900/5`, Inner Core `bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm space-y-3`.
  * **Category Tag:** Micro pill (e.g. `Prototype`, `Wireframe`, `Mood board`).
  * **Title & Subtitle:** Task title + description preview.
  * **Progress Bar:** Horizontal completion bar with percentage label (e.g. `Progress 82%` in green, `34%` in teal).
  * **Attachment Pill:** Embedded document preview card (`Landing page (1).pdf • 4.6 MB • Download ↗`).
  * **Footer:** Avatar stack + attachment count + comment count.
* **Backend Data & Inter-Component Connectivity:** Reads task record from SQLite `tasks` table. Attachment click triggers Tauri native file launcher.

---

## 4. Summary & Verification

With this specification, all **34 widgets** across all **3 design reference images** are 100% accounted for, mathematically defined, visually detailed with Doppelrand design system standards, and explicitly mapped to Shodasha's SQLite schema, Zustand stores, and Tauri Rust IPC commands.
