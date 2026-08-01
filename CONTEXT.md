# Shodasha — Domain Glossary

## Purpose

A personal time-management desktop app that fuses passive Windows activity tracking, habit tracking, and kanban task management. Single user, fully local/offline, Windows-only.

---

## Entities

### Task

A card on the kanban board representing something to do.

- **id** — unique identifier
- **title** — short description of the task
- **description** — optional details
- **status** — which column the card sits in (user-configurable; defaults may include To Do, In Progress, Done)
- **order** — position within the column for drag reordering
- **dueDate** — optional deadline
- **tags** — optional string labels for filtering or grouping
- **linkedHabitId** — optional reference to a Habit; when that habit is marked done for the day, this task auto-completes
- **createdAt**, **updatedAt** — timestamps

### Habit

A recurring behavior tracked once per day (binary: done or not done).

- **id** — unique identifier
- **name** — display name
- **color** — for calendar heatmap and visual distinction
- **linkedTaskId** — optional reference to a Task that auto-completes when this habit is done
- **url** — optional external link opened from the calendar row
- **priority** — `high` / `medium` / `low`; determines list order, XP per check-in (20/10/5) and HP heal/drain amounts
- **category** — id of a HabitCategory (default `general`); deleting a category moves its habits back to `general`
- **reminderTime** — optional daily reminder time (`HH:MM`); Shodasha notifies at this time and sends one overdue catch-up nudge if the app was off when the time passed (once per habit per day, skipped if already done that day)
- **createdAt** — timestamp

### HabitCategory

A user-created grouping for Habits (seeded with Health & Vitality, Learning & Skill, Work & Projects, Personal & Mind on first run).

- **id** — unique identifier (seeded ids: `cat_health`, `cat_learning`, `cat_work`, `cat_personal`)
- **name** — unique display name
- **color** — used for the category chip and balance meter
- **createdAt** — timestamp

### HabitRecord

One day's check-in for a Habit.

- **id** — unique identifier
- **habitId** — references the Habit
- **date** — calendar date (YYYY-MM-DD)
- **done** — boolean

A day without a HabitRecord is implicitly "not done." Records are created only when the habit is toggled on.

### TimeEntry

A logged window/app session captured by the Windows activity tracker.

- **id** — unique identifier
- **appName** — executable or display name of the application (e.g. "Code.exe")
- **windowTitle** — the window title at the time of capture
- **startTime** — when this session began
- **endTime** — when it ended (or null if still active)
- **endReason** — why the entry ended: null (still active), 'idle' (lock/sleep/screensaver), 'closed' (app closed)
- **duration** — computed in seconds on close, nullable for active entries
- **linkedTaskId** — optional reference to a Task (to attribute time spent on a task)
- **createdAt** — timestamp

The tracker polls the foreground window every 30 seconds. Consecutive identical polls are merged into a single TimeEntry. If `GetForegroundWindow()` returns NULL (lock screen, sleep, screensaver), the entry is closed with `endReason = 'idle'`.

### KanbanColumn

A user-definable column on the board.

- **id** — unique identifier
- **name** — display label
- **order** — position from left to right

### AppCategory

A user-defined classification for an application (used in Timeline/Dashboard charts to color-code time by type).

- **id** — unique identifier
- **appName** — executable name, e.g. "Code.exe" (unique)
- **category** — one of: 'work', 'distraction', 'neutral'

---

## Domain Rules

1. **Habit→Task link is one-way:** completing a Habit for a day auto-completes its linked Task (if any). The reverse does not happen — completing a Task does not mark its linked Habit as done.
2. **Habit→Task link is optional:** a Habit can exist without a linked Task, and a Task can exist without a linked Habit.
3. **TimeEntry→Task link is optional:** a time block can be attributed to a specific Task, but most TimeEntries are unattributed.
4. **No cascading deletes:** deleting a Task does not delete its linked Habit. Deleting a Habit clears the link on any Tasks referencing it (the Task survives).
5. **HabitRecord is created lazily:** toggling a habit on creates the record. Toggling it off deletes the record. No record means "not done."
6. **Idle time is excluded from active tracking:** entries closed with `endReason = 'idle'` are excluded from "focus time" and "active hours" metrics on the dashboard. They are stored so the user can see when the laptop was locked.
7. **App categories are user-defined only:** the app never auto-classifies applications. The user must explicitly tag each app in Settings. Untagged apps default to 'neutral' in charts.
8. **Database lives as long as the user keeps it:** the only automatic pruning is time entries older than 6 months (configurable). Tasks, habits, and categories are kept indefinitely.

---

## Navigation (Top Tab Bar)

| Tab | Route | Content |
|-----|-------|---------|
| Dashboard | / | Today's progress, streak, quick-add task, time distribution chart, recent activity |
| Board | /board | Configurable-column kanban with drag & drop |
| Habits | /habits | Monthly calendar grid with individual checkboxes + heatmap color layer |
| Timeline | /timeline | Daily timeline + weekly chart views for time tracking data |
| Settings | /settings | App categorization, tracking preferences, data management |

---

## Design Constraints

- **Top tab bar navigation** — never a left sidebar
- **Minimal editorial design** — clean, spaced, breathing room
- **Fixed window** ~1200×800 — no mobile/rwd
- **Icons:** Lucide React
- **Animation engine:** Motion (Framer Motion) + GSAP
- **Tech stack:** Next.js (static export) + Tauri v2 + Zustand + SQLite + @dnd-kit
- **No cloud, no accounts, no HTTP calls**
