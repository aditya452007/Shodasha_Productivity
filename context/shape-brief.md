# Shodasha — Shape Brief

## 1. Job and Audience

**Who arrives:** A general user sitting at their Windows desktop who wants to understand where their time goes and feel a sense of productivity growth.

**Their context:** They work on multiple things throughout the day, switching between applications. They want a passive system that tracks this automatically—no manual timers. They want to check off tasks, track habits, and see progress visually.

**Visitor mode:** Operate — the user completes tasks, checks habits, and reviews data. Speed and clarity outrank visual flair.

## 2. Outcome and Proof

**Primary action:** The user manages tasks via a kanban board, tracks habits daily, and sees their productivity analytics on the dashboard.

**Success looks like:** The user opens the app, sees today's progress at a glance, checks off a habit, moves a task to Done, watches their completion streak grow, and reviews which apps consumed their time.

**Product-specific truth:** This is not a timer. The user does not start/stop tracking. The app watches the desktop silently, and the user's job is to move tasks to Done and check habits. The dashboard connects the dots.

## 3. Sitemap & Navigation

```
Shodasha (Desktop App — Tauri Window)

Navigation: Top tab bar (no sidebar)

│
├── 📊 Dashboard (/)
│   ├── Today's Progress card
│   │   ├── Tasks completed vs total
│   │   ├── Active focus time
│   │   └── Habits checked vs total
│   ├── Task Completion Streak
│   ├── Quick Task Entry (inline input)
│   ├── Habit quick-toggles (check off from dashboard)
│   ├── Time Distribution (pie/bar — apps by category)
│   └── Recent Activity feed (latest tasks + app switches)
│
├── 📋 Board (/board)
│   ├── Configurable Kanban Columns (drag & drop)
│   │   ├── User can add, rename, delete, reorder columns
│   │   └── Defaults: To Do / In Progress / Done
│   └── Task Modal (click to open)
│       ├── Title, Description
│       ├── Due date, Tags
│       ├── Optional linked Habit (auto-completes when habit done)
│       ├── Auto-tracked time spent on this task's apps
│       └── Actions (move column, delete)
│
├── ✅ Habits (/habits)
│   ├── Monthly calendar grid
│   │   ├── Individual checkboxes per day per habit
│   │   └── Heatmap color layer (deeper = more habits done)
│   ├── Create / edit habits (name + color)
│   ├── Optionally link a habit to a Task (auto-complete)
│   └── Streak counter per habit
│
├── 📈 Timeline (/timeline)
│   ├── Weekly chart (bar — hours per day)
│   ├── Daily timeline (chronological app/window log)
│   ├── Per-task time attribution (if time entries linked)
│   └── Raw Activity Log (scrollable)
│
└── ⚙️ Settings (/settings)
    ├── App Categories (tag apps as Work/Distraction/Neutral)
    ├── Tracking Preferences (poll interval, excluded apps)
    ├── Data Management (export as CSV, clear history)
    └── About (version, tech)
```

**Navigation pattern:** Top tab bar — compact, always visible. Active tab highlighted. Never a left sidebar.

## 4. Feature Scope — v1

| Feature | Description | Priority |
|---------|-------------|----------|
| **Kanban Board** | Configurable-column board. Create, edit, delete, drag tasks. | P0 |
| **Desktop Activity Tracking** | Background service polls active window every N seconds. Records app name + duration. Runs when app is minimized. | P0 |
| **Dashboard** | Today's progress, habits checked, completion streak, quick-add task + habit toggle, time distribution chart, recent activity. | P0 |
| **Habit Tracking** | Monthly calendar grid with checkboxes + heatmap. Create/edit habits. Streak tracking. Optional link to tasks. | P0 |
| **Timeline Analytics** | Weekly charts + daily timeline. Per-task time attribution. Raw activity log. | P1 |
| **Settings** | App categorization, tracking preferences, data export/clear. | P1 |
| **System Tray** | Minimize to tray, background tracking indicator. | P2 |
| **Multi-project** | Switchable project contexts. | Post-v1 |
| **Notifications** | Reminders, idle alerts, daily summary. | Post-v1 |

## 5. States and Ranges

- **First-run/onboarding:** Empty board with "Create your first task" CTA. Dashboard shows "Start tracking" prompt. Activity tracking begins immediately but shows "Collecting data…" until enough data exists.
- **Empty states:** Each kanban column has a placeholder when empty. Habits page shows "Add your first habit" CTA. Timeline shows "Not enough data yet" for incomplete periods.
- **Loading:** Skeleton screens for charts and board. Tracking status indicator in tab bar.
- **Error:** Tracking permission denied → in-app guide to fix. SQLite errors → "Restart app" prompt.
- **Data ranges:** Day view shows 24h of activity. Week shows 7 days. Month shows 30 days. Task count typically 3–15/day. Habit count typically 3–10. App entries: 5–50/day.
- **Minimized:** App continues tracking in background. Dashboard shows "XX minutes tracked while you were away" on return.

## 6. Interaction and Layout

**Layout topology:**
- Top tab bar with app name, date, tracking status dot (green/red)
- Main content area fills remaining space
- Board has horizontal scroll if columns overflow
- Settings is single-page with sections

**Key interactions:**
- Drag cards between kanban columns (using @dnd-kit)
- Click card → modal or slide-in panel for details
- Click checkbox on dashboard → immediate task completion animation + streak update
- Click habit checkbox on dashboard or habits page → instant toggle
- Timeline date range via toggle pills (Day/Week/Month)
- Charts are interactive (hover for details)
- Dark/light mode toggle in tab bar

**Responsiveness:** Fixed window size (~1200×800) with responsive internal layout. No mobile — Windows desktop only.

## 7. Proposed Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Desktop shell** | Tauri v2 | Native Windows binary, small footprint, Rust backend for system APIs |
| **Frontend framework** | Next.js (static export) | React, file-based routing, app router for structure |
| **UI components** | Premium libraries (Kibo UI, Animata, Smooth UI, HeroUI, Dice UI, COSS UI, Cult UI, Fancy Components, Motion Primitives) | Animated, premium feel — selected per-component from verified index |
| **Drag & drop** | @dnd-kit | The standard for kanban, accessible, flexible |
| **Icons** | Lucide React | Clean, consistent, comprehensive |
| **State management** | Zustand | Lightweight, perfect for local-only app state |
| **Local database** | Tauri SQLite plugin | Persistent, queryable, native perf |
| **Activity tracking** | Tauri Rust backend | Polls `GetForegroundWindow()` (Win32 API) |
| **CSS** | Tailwind CSS | Utility-first, zero-runtime |
| **Charts** | Animata graphs (Bar, Donut, Ring) + Recharts if needed | Animated, free, premium look |
| **Animation** | Motion (Framer Motion) + GSAP | Micro-interactions + scroll/spring animations |

## 8. Constraints

**Binding:**
- Windows-only (Tauri with Win32 API for activity tracking)
- Fully offline — no HTTP calls, no external services
- Single-user — no auth, no accounts
- Static Next.js export (no server needed)
- Top tab bar navigation (never a left sidebar)
- Light + dark mode from v1

**Resolved decisions:**
- [x] Habits domain added as a separate tab with heatmap + checkboxes
- [x] Habit→Task link: auto-completes task (one-way)
- [x] TimeEntry→Task link: optional, for per-task time attribution
- [x] Kanban columns: user-configurable (add, rename, delete, reorder)
- [x] Activity view: weekly chart + daily timeline (both)
- [x] Dashboard: interactive (stats + quick-add + habit quick-toggle)
- [x] Dark mode: v1, light + dark both shipped
- [x] UI libraries: premium/animated, not Mantine/MUI/Radix

**Open:**
- Poll interval for activity tracking: configurable in settings (default?)
- Export format: CSV confirmed; JSON/PDF?
