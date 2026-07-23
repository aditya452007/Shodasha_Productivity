# Habits Feature Specification (`/habits`)

## Overview
The Habits feature allows users to track daily habits, view monthly progress matrixes, analyze historical consistency heatmaps, and automatically complete linked Kanban tasks.

---

## Domain Contracts & Rules

1. **Habit Entity:**
   - `id`: string
   - `name`: string
   - `color`: string (HEX color code, default `#059669`)
   - `linkedTaskId`?: string (Optional Kanban task ID)
   - `createdAt`: ISO timestamp

2. **HabitRecord Entity:**
   - `id`: string (`${habitId}_${date}`)
   - `habitId`: string
   - `date`: string (`YYYY-MM-DD`)
   - `done`: boolean

3. **Domain Rules:**
   - **One-Way Auto-Completion:** When a habit is marked done for a date (`YYYY-MM-DD`), if `linkedTaskId` is present, `taskStore.moveTask(linkedTaskId, 'done')` is called.
   - **Lazy Record Storage:** `HabitRecord`s exist in store only when `done === true`. Unset dates are implicitly `done: false`.
   - **Streak Calculation:** Active streak is calculated by counting consecutive preceding days where at least 1 habit (or all habits) were completed up to today.

---

## Component Architecture

```
src/app/habits/page.tsx
├── HabitHeader (Title, Streak summary badge, Add Habit CTA)
├── HabitStatsCard (Current streak, Best streak, Monthly completion rate)
├── HabitCalendar (Monthly matrix grid: Habit rows x Days columns with check-ins)
├── HabitHeatmap (GitHub-style 52-week activity heatmap)
└── AddHabitModal (Dialog for habit creation with color picker & linked task selection)
```
