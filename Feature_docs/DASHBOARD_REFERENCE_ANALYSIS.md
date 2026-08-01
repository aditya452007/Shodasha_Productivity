# Shodasha Multi-Section Design Reference Analysis & System Architecture Blueprint

> **Document Type:** Comprehensive Architectural & UI/UX Design Analysis  
> **Target Application:** Shodasha Desktop Productivity (Windows Local/Offline App)  
> **Target Path:** `Feature_docs/DASHBOARD_REFERENCE_ANALYSIS.md`  
> **Status:** Final Master Specification & Multi-Tab Feature Distribution Plan  

---

## 1. Executive Summary & Design Overview

This document provides an exhaustive design, architectural, and mathematical analysis of **three modern productivity UI reference designs**:
1. **Reference Image 1 (Consistency & Vitals Dashboard):** Focuses on sleep/vitals visualization, glassmorphic timers, horizontal habit streak matrices, and favourite habit bar charts.
2. **Reference Image 2 (Hebats / Integrations Ecosystem):** Focuses on 3D weather artwork widgets, Spotify/Media integrations, floating task checklists, positive habit growth metrics, and year-end wrapped cards.
3. **Reference Image 3 (Vertex Phaw / Project & Task System):** Focuses on multi-metric category analytics line charts, horizontal time-slot schedule strips, board/list view toggles, file attachments, and drag-and-drop Kanban micro-interactions.

### Core Architectural Principle: Dedicated 5-Tab Distribution

Rather than overloading the main **Dashboard (`/`)** with every extracted component, Shodasha enforces a clean, modular **5-Tab Navigation Architecture** using our native top tab bar (`Dashboard`, `Board`, `Habits`, `Timeline`, `Settings`). Each tab serves a dedicated, non-overlapping productivity role:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SHODASHA TOP NAVIGATION BAR: [Logo] Shodasha  | [Dashboard] [Board] [Habits] [Timeline] [Settings] | 🔍 🌙  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
   │                      │                     │                    │                      │
   ▼                      ▼                     ▼                    ▼                      ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ DASHBOARD        │ │ BOARD            │ │ HABITS           │ │ TIMELINE         │ │ SETTINGS         │
│ (Daily Overview &│ │ (Kanban Task     │ │ (Habit Streaks,  │ │ (Passive Windows │ │ (Integrations,   │
│  Command Center) │ │  Management &    │ │  Heatmaps &      │ │  Activity Logs & │ │  Weather, SMTC,  │
│                  │ │  Drag-and-Drop)  │ │  Consistency)    │ │  Category Share) │ │  Local Backups)  │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 2. Master Comparative Analysis Matrix (References 1, 2 & 3)

| Dimension / Feature | Image 1: Consistency & Vitals | Image 2: Hebats Integrations | Image 3: Vertex Phaw Task Board | Proposed Shodasha Target Tab |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Theme** | Soft Slate & Navy (`#F4F5F7` / `#1E293B`) | Warm Cream & Peach (`#FBFBFB` / `#FDBA74`) | Crisp Light Gray (`#F8FAFC`) + Teal (`#0D9488`) | Global Dark/Light System Tokens |
| **Hero Focal Point** | Glass Countdown Timer & Sleep Arc Chart | 3D Weather Card & Floating Todos | Multi-Metric Line Chart & Kanban Board | **Dashboard (`/`)** Focus Score |
| **Task Management** | Simple Schedule List with Checkboxes | Today's Todos Floating Checklist | 4-Column Kanban (`To do`, `In Progress`, `Review`, `Done`) | **Board (`/board`)** |
| **Habit Tracking** | Horizontal Day Tracker (12–28) & Bar Chart | Positive Habits % & Habits Wrapped 2023 | N/A | **Habits (`/habits`)** |
| **Time & Schedule** | Quiet Time Session Countdown Timer | Event & Running Competition Cards | Horizontal Time-Slot Schedule Strip (10:00 - 13:30) | **Timeline (`/timeline`)** |
| **Integrations** | Ambient Media Player (Vinyl Graphic) | Weather (3D Art) + Spotify Link Card | Drag-n-Drop File Upload Zone (`.pdf` preview) | **Settings (`/settings`)** & Dock |

---

## 3. In-Depth Analysis of Reference Image 3 (Vertex Phaw / Project & Task System)

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BANNER: Good morning, Angel 👋                  [Night/Light] [Refresh] 🔍 Search.. [🎤]               │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ MAIN ROW 1 (TOP METRICS & TIME-SLOT SCHEDULE)                                                             │
│ ┌─────────────────────────────────────────────────────┬─────────────────────────────────────────────────┐ │
│ │ Total Task: 59 (+8% vs last month)                  │ Aug, 2025                        [ < ] [ > ]    │ │
│ │ Multi-Series Line Chart (Designer 20, Dev 11, Test 28)│ Fri 5  Sat 6  Sun 7  Mon 8  [Tue 9] Wed 10... │ │
│ │ Total member: 24 | Target: 80% | Deadlines: 12 ↑8% │ ┌───────────────────┐  ┌──────────────────────┐ │ │
│ │                                                     │ │ Designer Meeting  │  │ Developer Meeting    │ │ │
│ │                                                     │ │ 10:00 - 11:20 AM  │  │ 11:40 - 13:00 PM     │ │ │
│ └─────────────────────────────────────────────────────┴───────────────────┴──┴──────────────────────┘ │ │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ MAIN ROW 2 (KANBAN TASK BOARD)                                                                            │
│ Shared • Team Phoenix / Vertex Phaw | Deadline: 17 Feb 2025 | Status: In progress | [ + Add Projects ]       │
│ Sub-Tabs: [ Overview | Tasks* | Timeline | Calendar | Files ]                     Views: [ Board* | List ]  │
│ ┌──────────────────┬──────────────────┬─────────────────────────────────┬───────────────────────────────┐ │
│ │ To do        (+) │ In Progress  (+) │ Need Review                 (+) │ Done                      (+) │ │
│ │ ┌──────────────┐ │ ┌──────────────┐ │ ┌─────────────────────────────┐ │ ┌───────────────────────────┐ │ │
│ │ │ Prototype    │ │ │ Wireframe    │ │ │ Mood board                  │ │ │ Drag to here              │ │ │
│ │ │ Change profile│ │ │ Change layout│ │ │ Create unique mood board... │ │ │ (Drop target container)   │ │ │
│ │ │ Progress 82% │ │ │ PDF 4.6MB v  │ │ │ (Card being dragged ↗)      │ │ └───────────────────────────┘ │ │
│ │ └──────────────┘ │ └──────────────┘ │ └─────────────────────────────┘ │                               │ │
└────────────────────┴──────────────────┴─────────────────────────────────┴───────────────────────────────┘
```

### A. Visual Style & Design System Tokens (Image 3)

*   **Color System:**
    *   **Accent Teal:** `#0D9488` / `#14B8A6` (Primary action buttons, active tab pill highlights).
    *   **Accent Orange / Coral:** `#F97316` (Deadline badges, priority warnings, board view toggles).
    *   **Background Canvas:** Crisp cool gray `#F8FAFC` (`hsl(210, 40%, 98%)`).
    *   **Card Containers:** Pure white `#FFFFFF` with hairlines `rgba(0, 0, 0, 0.05)`.
*   **Typography & Micro-Copy:**
    *   Header greeting: 22px Bold (`Good morning, Angel 👋`).
    *   Metric Numbers: 32px Extra Bold tabular numbers (`59`, `80%`, `12`).
    *   Card Labels & Attachments: 12px Medium (`Landing page (1).pdf • 4,6 MB`).

### B. Layout Architecture & Component Breakdown

1.  **Top Metrics & Multi-Series Chart Card (60% Width):**
    *   `TotalTaskOverview`: Headline number (`59`), growth badge (`↑ 8% vs last month`), and motivational quote (`keep it up! 🦾`).
    *   `MultiSeriesLineChart`: 12-month timeline curve (Apr to Dec) tracking three task categories simultaneously: *Designer* (20), *Developer* (11), *Testing* (28) with interactive hover tooltips.
    *   `KPISubBar`: Three inline metric counters: *Total member* (`24`), *Target percentage* (`80%`), and *Upcoming Deadlines* (`12 ↑ 8%`).
2.  **Interactive Schedule & Time-Slot Strip (40% Width):**
    *   `MonthDateStrip`: Month navigator (`Aug, 2025`), horizontal day selector (`Fri 5` to `Fri 12`, with active date `Tue 9` highlighted in orange).
    *   `TimeSlotStream`: Horizontal time grid (10:00 to 13:30) displaying event blocks:
        *   Orange Event Card: *Designer team meeting* (10:00 - 11:20 AM).
        *   Dashed Break Block: *Break* (1h 15m).
        *   Teal Event Card: *Developer team meeting* (11:40 - 13:00 PM).
3.  **Project Header & View Controls:**
    *   `ProjectBreadcrumb`: Path display (`Shared • Team Phoenix / Vertex Phaw`), deadline badge (`17 Feb, 2025`), status pill (`In progress`), member avatar stack (`+3`), and primary action button (`+ Add Projects`).
    *   `SubTabNavigation`: Tab selectors (`Overview`, `Tasks`, `Timeline`, `Calendar`, `Files`) + View toggle (`Board` vs `List`).
4.  **4-Column Kanban Drag-and-Drop Board:**
    *   `KanbanColumnHeader`: Column name (`To do`, `In Progress`, `Need Review`, `Done`) + task count badge + `+` quick add button.
    *   `TaskCard` Micro-Interactions:
        *   *Category Pill:* Micro pill tag (e.g. `Prototype`, `Wireframe`, `Mood board`).
        *   *Progress Bar:* Horizontal completion bar (e.g. `Progress 82%` in green, `34%` in teal).
        *   *Attachment Pill:* Embedded document preview card (`Landing page (1).pdf • 4,6 MB • Download ↗`).
        *   *Drag Target Highlight:* Dashed drop container (`Drag to here`) receiving an actively dragged ghost card (`Mood board`).

---

## 4. Component Interaction & State Flow Architecture

Understanding how components interact across Zustand stores, SQLite, and Tauri IPC is critical to maintaining a responsive, lag-free desktop experience.

```
                                ┌────────────────────────────────────────┐
                                │      Tauri v2 Passive App Tracker      │
                                │   (Polls GetForegroundWindow every 30s)│
                                └───────────────────┬────────────────────┘
                                                    │ IPC Event: 'time-entry-logged'
                                ┌───────────────────▼────────────────────┐
                                │       SQLite Database (WAL Mode)       │
                                └──────┬────────────┬────────────┬───────┘
                                       │            │            │
             ┌─────────────────────────┘            │            └─────────────────────────┐
             ▼                                      ▼                                      ▼
┌──────────────────────────┐          ┌──────────────────────────┐          ┌──────────────────────────┐
│     useTaskStore.ts      │          │    useHabitStore.ts      │          │   useTimeEntryStore.ts   │
├──────────────────────────┤          ├──────────────────────────┤          ├──────────────────────────┤
│ - tasks: Task[]          │          │ - habits: Habit[]        │          │ - entries: TimeEntry[]   │
│ - columns: Column[]      │          │ - records: HabitRecord[] │          │ - categories: Category[] │
│ - toggleTask()           │◄─────────┤ - checkInHabit()         │          │ - logFocusSession()      │
└────────────┬─────────────┘ (Domain   └────────────┬─────────────┘          └────────────┬─────────────┘
             │                Rule 1)               │                                     │
             │ Subscriber                           │ Subscriber                          │ Subscriber
             ▼                                      ▼                                     ▼
┌──────────────────────────┐          ┌──────────────────────────┐          ┌──────────────────────────┐
│  Board Tab (/board)      │          │  Habits Tab (/habits)    │          │  Timeline Tab (/timeline)│
│  - Drag & Drop Kanban    │          │  - Streak Heatmap Matrix │          │  - Multi-Series Chart    │
│  - Task Progress Bars    │          │  - Category Bar Chart    │          │  - App Category Ratio    │
└──────────────────────────┘          └──────────────────────────┘          └──────────────────────────┘
```

### Key Interaction Rules

1.  **Habit $\rightarrow$ Task Completion Sync (Domain Rule 1):**
    *   When a user completes a habit on the **Habits Tab (`/habits`)** or via the **Dashboard Quick Toggle**, `useHabitStore.checkInHabit(habitId, date)` executes.
    *   If `habit.linkedTaskId` exists, `useTaskStore.toggleTask(linkedTaskId)` is automatically triggered, updating the task status to `Done` on the **Board Tab (`/board`)** with a checkmark spring animation.
2.  **Passive Activity $\rightarrow$ Timeline & Focus Ratio Sync:**
    *   The Rust background tracker emits `time-entry-logged` events every 30 seconds.
    *   `useTimeEntryStore` recalculates the active **Focus Ratio** ($\frac{\text{Work Time}}{\text{Total Time}}$).
    *   Updates the **Timeline Tab (`/timeline`)** multi-series category chart and the **Dashboard (`/`)** KPI card simultaneously without requiring a page refresh.
3.  **Kanban Drag & Drop Reordering (`@dnd-kit`):**
    *   Dragging a `TaskCard` between columns updates local optimistic state in `useTaskStore`.
    *   On drop release, triggers Tauri IPC `update_task_status(taskId, newColumnId, newOrder)` to persist changes to SQLite.

---

## 5. Multi-Section Feature Distribution Blueprint (The 5-Tab Architecture)

To ensure the user experience is clean, uncluttered, and purposeful, we distribute all widgets and components across Shodasha's 5 top-level navigation tabs.

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SHODASHA MULTI-TAB COMPONENT MAPPING                                                                      │
├───────────────────┬─────────────────────────────────────────────────┬─────────────────────────────────────┤
│ Target Tab        │ Included Components & Widgets                   │ Source Reference Design             │
├───────────────────┼─────────────────────────────────────────────────┼─────────────────────────────────────┤
│ 1. Dashboard      │ • Top KPI Metrics Grid (Focus Time, Score,      │ Ref 3 (KPIs) + Ref 1 (Timer) +      │
│    (`/*`)         │   Active Tasks, Habit Streak)                   │ Ref 2 (Weather & Todos)             │
│                   │ • Quiet Time Focus Countdown & Ambient Media    │                                     │
│                   │ • Weather Integration Card (Open-Meteo 3D Art)  │                                     │
│                   │ • Today's Schedule & Urgent Todos Checklist     │                                     │
├───────────────────┼─────────────────────────────────────────────────┼─────────────────────────────────────┤
│ 2. Board          │ • 4-Column Kanban Board (To Do, In Progress,    │ Ref 3 (Kanban, Attachments,         │
│    (`/board`)     │   Need Review, Done)                            │ Ref 3 Views & Progress Bars)        │
│                   │ • Drag-and-Drop Card Interactions & Drop Zone   │                                     │
│                   │ • Attachment File Preview Pill (PDF download)   │                                     │
│                   │ • View Toggle (Board View vs List View)         │                                     │
├───────────────────┼─────────────────────────────────────────────────┼─────────────────────────────────────┤
│ 3. Habits         │ • Full-Width Day Tracker Grid (12-31 status)    │ Ref 1 (Day Tracker & Bar Chart) +   │
│    (`/habits`)    │ • Favourite Habit Category Duration Bar Chart   │ Ref 2 (Positive Habits & Wrapped)   │
│                   │ • Positive Habits Score Card (+58.2% growth)    │                                     │
│                   │ • Habits Wrapped Year-End Summary Card          │                                     │
├───────────────────┼─────────────────────────────────────────────────┼─────────────────────────────────────┤
│ 4. Timeline       │ • Multi-Series Category Analytics Line Chart    │ Ref 3 (Multi-Series Line Chart) +   │
│    (`/timeline`)  │ • Horizontal Time-Slot Schedule Stream          │ Ref 3 (Schedule Strip) +            │
│                   │ • App Category Allocation Share (Work/Distract) │ Ref 2 (Detailed Analytics)          │
├───────────────────┼─────────────────────────────────────────────────┼─────────────────────────────────────┤
│ 5. Settings       │ • Weather Integration Settings (Location/Units) │ Ref 2 (Integrations Dock) +         │
│    (`/settings`)  │ • Windows Media / Spotify Integration Toggle    │ Ref 1 (Work Mode Config)            │
│                   │ • Local Database Backup & Sync Status           │                                     │
└───────────────────┴─────────────────────────────────────────────────┴─────────────────────────────────────┘
```

---

### Detailed Tab Specifications

#### Tab 1: Dashboard (`/`) — Daily Command Center
*   **Purpose:** Provide an immediate high-level overview of today's productivity score, urgent tasks, focus timer, and local weather without cluttering the screen.
*   **Grid Layout:** Asymmetric 12-Column Grid (Row 1: 4 KPI Cards 3-3-3-3 | Row 2: Weather 4 / Schedule 5 / Focus Media Timer 3).

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ROW 1: TOP KPI METRIC CARDS (3-3-3-3)                                                                     │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐ │
│ │ 🎯 Focus Time Today   │ │ ⚡ Productivity Score │ │ 📋 Active Tasks       │ │ 🔥 Habit Consistency  │ │
│ │ 4h 45m / 6.0h        │ │ 88% (+5.2%)           │ │ 4 Pending / 2 Done    │ │ 86% Current Streak 12d│ │
│ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘ │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ROW 2: HERO INTEGRATIONS & SCHEDULE (4-5-3)                                                               │
│ ┌─────────────────────────┐ ┌───────────────────────────────┐ ┌─────────────────────────────────────────┐ │
│ │ 🌤️ Weather Integration   │ │ 📋 Today's Todos & Schedule   │ │ 🎵 Media & Focus Session Timer          │ │
│ │ (12°C, 3D Umbrella Art,  │ │ (Floating Checklist, Urgent   │ │ (Glass Timer 00:25:00 +                 │ │
│ │  Humidity, Wind, Press.) │ │  Kanban tasks completion)     │ │  Spotify/Windows Media Controls)        │ │
│ └─────────────────────────┘ └───────────────────────────────┘ └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Tab 2: Board (`/board`) — Kanban Task & Project Management
*   **Purpose:** Deep task management, column customization, drag-and-drop workflow, and file attachments.
*   **Components:**
    *   `BoardHeader`: Project breadcrumb, view toggles (`Board | List`), filter dropdowns, search bar.
    *   `KanbanBoard`: 4 columns (`To do`, `In Progress`, `Need Review`, `Done`).
    *   `TaskCard`: Interactive cards featuring category tags, completion progress bars, PDF/file attachment download buttons, and user avatars.

#### Tab 3: Habits (`/habits`) — Habit Tracker & Heatmaps
*   **Purpose:** Habit creation, daily check-in grids, month/year consistency analysis.
*   **Components:**
    *   `HabitStreakMatrix`: Full-width horizontal date grid (1–31) with colored status rings (Image 1 style).
    *   `HabitCategoryBarChart`: Vertical bar chart comparing habit durations (Meditation, Reading, Gym) with active metric tooltips (`Meditation 45m ^4%`).
    *   `PositiveHabitsCard`: Green growth metric card (`+58.2%`).
    *   `HabitsWrappedCard`: Year-end summary celebration card.

#### Tab 4: Timeline (`/timeline`) — Passive Activity & Time Analytics
*   **Purpose:** In-depth passive Windows app tracking logs, time-slot event streams, and category share charts.
*   **Components:**
    *   `MultiSeriesActivityChart`: Line chart graphing category hours across days/months (Image 3 style).
    *   `TimeSlotScheduleStream`: Visual horizontal time-slot stream (10:00 to 13:30) showing logged app sessions.
    *   `AppCategoryShareChart`: Donut/bar chart breaking down `Work`, `Neutral`, and `Distraction` percentages.

#### Tab 5: Settings (`/settings`) — System Preferences & Integrations
*   **Purpose:** Manage integrations, tracking preferences, app classifications, and local backups.
*   **Components:**
    *   `WeatherIntegrationSettings`: Location input, units toggle (°C / °F), auto-refresh interval.
    *   `MediaIntegrationSettings`: Enable/disable Windows SMTC listener and Spotify Web API token link.
    *   `DataManagement`: SQLite backup export/import and database reset.

---

## 6. Technical Implementation Roadmap

1.  **Phase 0 (Completed):** Multi-Reference Design Analysis & 5-Tab Architecture Blueprint (This Document).
2.  **Phase 1 (Scaffold Stores & Routes):**
    *   Verify Next.js top nav routes (`/`, `/board`, `/habits`, `/timeline`, `/settings`).
    *   Verify Zustand stores (`taskStore`, `habitStore`, `timeEntryStore`, `settingsStore`, `uiStore`).
3.  **Phase 2 (Dashboard `/` Implementation):**
    *   Implement `TopKPIGrid`, `WeatherIntegrationCard`, `TodaysScheduleCard`, and `FocusMediaTimerCard`.
4.  **Phase 3 (Board `/board` & Habits `/habits` Implementation):**
    *   Update `KanbanBoard` with attachment previews, progress bars, and `@dnd-kit` drop target styling (Image 3).
    *   Update `HabitCalendar` with horizontal streak day rings and habit bar charts (Image 1 & 2).
5.  **Phase 4 (Timeline `/timeline` & Verification):**
    *   Implement multi-series activity chart and time-slot schedule stream (Image 3).
    *   Run `npm run typecheck`, `npm run lint`, and `npm run build` to verify 0 compilation errors.
