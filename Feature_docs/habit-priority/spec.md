# Feature Spec — Habit Priority (Sort, XP Scaling, HP System)

## User Stories

1. As a user, I can assign a **priority (High / Medium / Low)** to each habit when creating or editing it.
2. As a user, my habits are **listed in priority order**: High → Medium → Low (tie-break: creation date).
3. As a user, checking off a **higher-priority habit awards more XP** (High 20 / Medium 10 / Low 5 — currently flat 10).
4. As a user, each habit has a **per-habit HP bar (0–100)**. Completing it heals HP by its priority value; missing a scheduled day drains HP by its priority value. At 0 HP the habit shows as **depleted** until checked in again.
5. As a user, I can see each habit's priority and HP at a glance in the habit calendar.

## Requirements

### R1 — Schema
- `habits` table gains `priority TEXT NOT NULL DEFAULT 'medium'` (values: `high`, `medium`, `low`).
- Applied via the existing safe-ALTER migration pattern in `src-tauri/src/db.rs` (like the `url` column) — no version bump needed, old rows default to `medium`.

### R2 — Backend (Rust)
- `HabitDb` struct gains `priority: String`.
- `get_habits` SELECT includes `priority`, ordered `CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, created_at ASC`.
- `create_habit` / `update_habit` INSERT/UPDATE include `priority`.

### R3 — Frontend data layer
- `src/lib/db.ts`: habit payloads carry `priority`; `fetchHabitsFromDb` maps it.
- `habitStore.ts`: `Habit` interface gains `priority: 'high' | 'medium' | 'low'` (default `medium`). Store array is always kept **priority-sorted** (helper `sortByPriority`), applied on fetch, add, update. All widgets (`HabitCalendar`, `FavouriteHabitChartWidget`, `HabitStreakMatrixWidget`, `HabitAnalyticsDashboard`, ...) read `s.habits` and automatically inherit the order.

### R4 — Priority UI
- `AddHabitModal`: segmented High / Medium / Low selector (default Medium), used for both create and edit.
- `HabitCalendar` row: small passive priority badge (e.g. colored dot + label) next to the habit name.

### R5 — XP scaling
- `habitStore.toggleHabit`: award XP per priority — High 20 / Medium 10 / Low 5 (replaces flat 10). Key stays `habit_checkin_<habitId>_<date>` — dedup unaffected.
- `gamificationStore.awardXP`: first-check-in bonus condition `amount >= 10` → `amount >= 5` so Low-priority habits still trigger it.

### R6 — Per-habit HP system
- New helper `src/lib/utils/habitHealth.ts`:
  - `HEAL = { high: 20, medium: 10, low: 5 }`, `DRAIN = { high: 20, medium: 10, low: 5 }`, `HP_MAX = 100`.
  - Computed over a **trailing 30-day window** (from `today - 29`), so HP reflects recent health, not lifetime history.
  - For each day in window: done → `min(100, hp + HEAL)`. Not done → `max(0, hp - DRAIN)` — **only after the habit's first check-in** (dormant habits stay at 0 without being "depleted").
  - Clamped 0–100.
- `HabitCalendar` row: HP micro-bar under the habit name (accent → amber → red by HP band: `>66` green/`var(--success)`, `>33` amber/`var(--warning)`, `≤33` red/`var(--error)`). At 0 HP show "Depleted" label.

## Non-Goals
- No drag-to-reorder habit rows (priority is the ordering mechanism).
- No global/player HP bar.
- No HP persistence table — HP is derived from `habit_records` history.
- Streak/achievement logic unchanged.

## Success Criteria
- `npm run lint`, `npm run typecheck`, `npm run build` pass.
- `cargo check` passes.
- Old habits default to Medium priority and sort after High habits.
- Checking a High habit grants 20 XP; a Low habit 5 XP (verified via DailyXPGoal/XPProgressBar).
- HabitCalendar rows ordered High → Medium → Low with visible priority badge + HP bar.

## Files Touched
| File | Change |
|------|--------|
| `src-tauri/src/db.rs` | ALTER migration |
| `src-tauri/src/repositories/habit_repo.rs` | struct + SQL |
| `src/lib/db.ts` | payloads + mapping |
| `src/stores/habitStore.ts` | type, sort helper, XP scaling |
| `src/stores/gamificationStore.ts` | first-check-in condition |
| `src/components/habits/AddHabitModal.tsx` | priority selector |
| `src/components/habits/HabitCalendar.tsx` | badge + HP bar |
| `src/lib/utils/habitHealth.ts` | NEW — HP calculator |
