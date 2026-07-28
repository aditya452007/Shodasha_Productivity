# Habit Tracking — Edge Cases & Logical Flaws Analysis

## Core Problem

The app has **no concept of a habit's start date boundary**. Every habit's `createdAt` timestamp exists in the database but is **never used as a constraint**. This creates a cascade of logical flaws across the UI, analytics, and streaks.

---

## Edge Case Catalog

### EC-1: Pre-Creation Day Commits (CRITICAL)

**Scenario:** User creates a habit on July 29. Calendar shows July 1–31 as clickable cells.
**Bug:** User can click July 1–28 to mark them as "done."
**Why it's wrong:** The habit didn't exist on July 1. Marking it done falsifies the record. The user never performed the behavior on that day.
**Severity:** Data integrity violation.

### EC-2: Mixed-Age Habit Streaks (CRITICAL)

**Scenario:** User has Habit A (created 60 days ago, perfect streak) and Habit B (created today).
**Bug:** The all-habits "Current Streak" in HabitStatsCard walks back day-by-day checking if ANY habit was done. Since Habit B has no records before today, the streak stops at 1 — even though Habit A has a 60-day streak.
**Why it's wrong:** The metric conflates habits with different start dates, producing a misleading "overall streak" that penalizes new habits.
**Severity:** Misleading user metric.

### EC-3: Streak Walk-Back Beyond Creation Date (HIGH)

**Scenario:** Habit created 5 days ago, user has done it every day since.
**Bug:** `calculateHabitStreak()` walks back indefinitely from today until it finds a gap. It could in theory walk back years — though in practice it stops when no record exists. But if somehow a record exists for a date before creation (data corruption), the streak would be wrong.
**Why it's wrong:** The streak should never extend before the habit's creation date, even if records exist there.
**Severity:** Data integrity.

### EC-4: 30-Day Completion Rate for Young Habits (HIGH)

**Scenario:** Habit created 10 days ago, done 9 of those days.
**Bug:** Per-habit ring shows 30% (9/30). Should show 90% (9/10).
**Why it's wrong:** The denominator is hardcoded to 30, ignoring days-since-creation. New habits look artificially weak.
**Severity:** Misleading analytics.

### EC-5: 14-Day Trajectory Shows Pre-Creation Zeros (MEDIUM)

**Scenario:** Habit created 5 days ago.
**Bug:** The line chart shows 10 data points before creation all at 0, then 5 with real data. The line starts at zero and climbs, making it look like the user was lazy and then started.
**Why it's wrong:** The data is missing, not zero. Should either start the chart from creation date or show a "not yet tracking" label.
**Severity:** Visual misrepresentation.

### EC-6: 90-Day Weekday Distribution Includes Pre-Creation Days (MEDIUM)

**Scenario:** Habit created 30 days ago.
**Bug:** Day-of-week distribution counts 90 days back, but 60 of those days predate the habit. Those 60 days have 0 completions, diluting the per-day-of-week averages.
**Why it's wrong:** Data from before the habit existed should not be included in the distribution.
**Severity:** Inaccurate analytics.

### EC-7: Completion Rate Calculation Uses Wrong Denominator (MEDIUM)

**Scenario:** HabitCalendar monthly rate = `doneCount / totalDaysInMonth`. If habit created on 15th, days 1–14 are implicitly counted as "not done."
**Bug:** Completion rate is artificially lowered.
**Fix:** Rate should be `doneCount / eligibleDaysInMonth` where eligible days = max(1, totalDaysInMonth - preCreationDays).

### EC-8: Heatmap Includes Pre-Creation Period (LOW)

**Scenario:** Habit created 30 days ago. Heatmap shows 168 days.
**Bug:** Days 31–168 show as level 0 with tooltip "0 habits completed."
**Why it's wrong:** The tooltip should clarify "Before habit was created" rather than "0 habits completed."
**Severity:** Minor UX confusion.

### EC-9: No Visual Distinction for "Before Creation" Days (LOW)

**Scenario:** User looks at the monthly calendar for a habit created on the 15th.
**Bug:** Days 1–14 look identical to future days (disabled, greyed out).
**Fix:** Days before creation should have a distinct visual — perhaps a dashed border, muted diagonal pattern, or "—" symbol to indicate the habit wasn't yet being tracked.
**Severity:** UX clarity.

### EC-10: No Custom Start Date on Habit Creation (LOW)

**Scenario:** User started a habit on July 1 but only creating it on July 28.
**Problem:** No way to set a backdated start date. The habit's start defaults to "now."
**Fix:** Optional start date picker in AddHabitModal.
**Severity:** Feature gap (deferred).

---

## Root Cause Map

```
createdAt stored but never used as boundary
├── HabitCalendar: pre-creation cells are clickable       (EC-1)
├── calculateHabitStreak: walks before creation           (EC-3)
├── HabitStatsCard: cross-habit streak ignores ages       (EC-2)
├── Analytics rings: denominator ignores age              (EC-4)
├── Analytics trajectory: shows pre-creation zeros        (EC-5)
├── Analytics weekday dist: includes pre-creation         (EC-6)
├── Calendar rate: wrong denominator                      (EC-7)
├── Heatmap: ambiguous empty-day meaning                  (EC-8)
└── No visual distinction for pre-creation days           (EC-9)
```

---

## Fix Strategy

1. **HabitCalendar**: For each `(habit, day)` cell, compute `isBeforeStart` and disable with distinct visual
2. **Streak**: Pass `createdAt` to `calculateHabitStreak`, cap walk-back
3. **StatsCard**: Filter per-habit records through their creation date
4. **Analytics rings**: Denominator = `min(30, daysSinceCreation)`
5. **Trajectory**: Start data from `max(14daysAgo, creationDate)`
6. **Weekday**: Only count days since each habit's creation
7. **Calendar rate**: Denominator = eligible days only
8. **Heatmap tooltip**: Show "Before tracking" for pre-creation days