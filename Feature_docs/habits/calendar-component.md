# Component: Habit Monthly Calendar Matrix

- **Libraries Evaluated**: HeroUI Calendar (`https://www.heroui.com/en/docs/react/components/calendar`), Kibo UI Mini Calendar (`https://www.kibo-ui.com/components/mini-calendar`)
- **Category**: HABITS — Monthly Calendar Matrix Grid
- **Fetched by**: AI Agent (Phase 1 Component Fetch)

---

## Component Evaluation & Comparison

| Criterion | HeroUI Calendar | Kibo UI Mini Calendar | Custom Shodasha Habit Grid | Winner / Pick |
|-----------|-----------------|----------------------|---------------------------|---------------|
| **Animation Quality** | Standard transition | Basic month navigation | Framer motion spring pop-in & checkbox tick path animation | **Custom Shodasha Habit Grid** |
| **Visual Polish** | Single-date picker layout | Compact popup calendar | Full multi-habit row x days of month column matrix | **Custom Matrix Layout** |
| **Multi-Habit Support**| Single date selection | Single date selection | Native matrix supporting 1..N habits checkable per day | **Custom Matrix Layout** |

---

## Architecture & Code Specification

### Props Interface

```tsx
export interface Habit {
  id: string
  name: string
  color: string
  linkedTaskId?: string
  createdAt: string
}

export interface HabitCalendarProps {
  habits: Habit[]
  records: Record<string, boolean> // key: `${habitId}_${date}` -> boolean
  currentMonth: Date // Active month being viewed
  onToggleHabit: (habitId: string, date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onOpenAddModal: () => void
}
```

### Key UI Capabilities
1. **Month Navigation:** Display month & year header with Previous / Today / Next controls.
2. **Habit Row Matrix:**
   - Left column: Habit name, accent color badge, linked task badge if present.
   - Right columns: Day numbers (1 to 28..31) for the selected month, with day of week indicator (M, T, W, T, F, S, S).
   - Today's date highlighted with a subtle ring/emerald border.
3. **Interactive Micro-Checkboxes:**
   - Framer Motion spring click feedback.
   - Toggling active triggers habit completion and domain rule logic.
