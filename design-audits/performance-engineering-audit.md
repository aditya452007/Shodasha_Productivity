# Performance Engineering Audit — Shodasha Productivity

> **Date:** 2026-07-29  
> **Scope:** All pages, components, stores, and styles  
> **Methodology:** Static code analysis focusing on rendering, animation, bundle, layout, state, animation loops, and memory

---

## 1. Animation Performance

### 1.1 Framer Motion Overuse (Layout Thrashing via JS Animations)

| Location | Issue | Severity |
|---|---|---|
| `BaseCard.tsx:128-135` | Every `BaseCard` wraps content in `<motion.div>` with default `opacity: 0, y: 12` → `opacity: 1, y: 0` animation. This means **every card on every page** creates a JS-driven animation, including cards deep inside scroll-away viewports. | **HIGH** |
| `HabitCalendar.tsx:224-233` | Every habit row wraps `<motion.tr>` with exit animation, causing per-row layout calculation on every add/delete. Calendar with 30 habits × 31 days = 930 animated cells. | **HIGH** |
| `TimelineStream.tsx:111-119` | Every timeline entry wraps `<motion.div>` with stagger delay `Math.min(index * 0.05, 0.4)`. On 40+ entries this creates 40 discrete JS animations. | **MEDIUM** |
| `KanbanBoard.tsx` | Entire board rendered inside `DndContext` + `SortableContext`, where every `KanbanColumn` and `KanbanCard` also uses `<motion.div layout>`. Layout animations during drag trigger **continuous re-layout** of the entire list. | **HIGH** |
| `KanbanColumn.tsx:97` | `layout` prop on `<motion.div>` forces full layout recalculation per frame during drag operations. | **HIGH** |
| `KanbanCard.tsx:74` | `layout` prop on every card. During DnD reorder, every sibling card re-calculates layout via JS. | **HIGH** |

### 1.2 Expensive CSS Animations Triggering Paint

| Location | Issue | Severity |
|---|---|---|
| `AchievementBadge.tsx:78` | `y: [-2, 2, -2]` with `repeat: Infinity` on potentially dozens of badge cards. This runs an infinite JS animation loop per unlocked badge. | **MEDIUM** |
| `XPProgressBar.tsx:163` | `y: [-4, 4, -4]` with `repeat: Infinity` — continuous transform animation on the XP bar medal. | **LOW** |
| `StreakDisplay.tsx:132` | `y: [-1, 1, -1]` with `repeat: Infinity` on the multiplier badge. | **LOW** |
| `globals.css:574-591` | `flame-flicker` keyframe animates `filter: drop-shadow(...)` which triggers **paint** per frame. `filter` is not a composited property. | **MEDIUM** |
| `globals.css:593-603` | `flame-wave` animates SVG `d` attribute. Changing `d` attribute on SVG paths triggers **full SVG re-layout and repaint**. | **HIGH** |
| `globals.css:137-138` | `animate-pulse-glow` — opacity + scale on a blur-3xl element (the glow halo in XPProgressBar). `blur-3xl` is expensive on GPU. | **LOW-MEDIUM** |

### 1.3 Missing `will-change` & GPU Acceleration Hints

| Location | Issue | Severity |
|---|---|---|
| All `motion.div` with `y` transforms | No `will-change: transform` anywhere. Framer Motion does NOT auto-inject `will-change`. Every `motion.div` with animated transform triggers paint without it. | **HIGH** |
| `globals.css` card hover lifts | `transform: translateY(-2px)` on hover — no `will-change: transform` on the base class. | **LOW** |
| `card-hover-lift` | Transitions `transform` but no `will-change` hint, so the first hover always triggers style recalc. | **LOW** |
| `streak-display` flame icon | The LivingFlameIcon likely uses CSS `filter` animations; `filter` should have `will-change: filter`. | **MEDIUM** |

### 1.4 SVG Animation Performance

| Location | Issue | Severity |
|---|---|---|
| `SkillOctagon.tsx:268-271` | Animate `polygon points` attribute via Framer Motion. Animating SVG `points` triggers **full SVG layout** every frame. 8 axes computed via `computeAxesScores()` which reads 3 separate Zustand stores on every render. | **HIGH** |
| `SkillOctagon.tsx:211-222` | Each ring and spoke is an individual `<motion.polygon>` / `<motion.line>` with staggered opacity — ~20+ independent JS animations on mount. | **MEDIUM** |
| `DailyXPGoal.tsx:63-75` | SVG `<circle>` stroke-dashoffset animated via Framer Motion. This triggers SVG paint per frame. | **LOW** |

### 1.5 `useReducedMotion()` Overhead

Every component imports `useReducedMotion()` from Framer Motion. This is a **React context consumer** that re-renders the component tree when the OS-level motion preference changes. On the `habits/page.tsx` page, there are **6 separate `motion.div` wrappers** each checking `shouldReduceMotion`, creating 6+ reactive mount animations per page load.

---

## 2. React Rendering Performance

### 2.1 Unnecessary Re-renders — Zustand Selectors

| Location | Issue | Severity |
|---|---|---|
| `page.tsx:20` | `useGamificationStore((s) => s.initializeGamification)` — fine, but the entire page re-renders when **any** field in gamificationStore changes because children aren't wrapped in `React.memo`. | **MEDIUM** |
| `KanbanBoard.tsx:29-36` | **7 separate Zustand selectors** destructured at the component level. Every time `tasks` changes (on every toggle, add, delete, reorder), the entire `KanbanBoard` re-renders, which cascades to all children. | **HIGH** |
| `KanbanColumn.tsx:27-29` | 3 selectors. Re-renders on every state change, including during drag. | **HIGH** |
| `KanbanCard.tsx:17-19` | 3 selectors, plus `getTaskLoggedSeconds` called **during render** (`taskSeconds = getTaskLoggedSeconds(task.id)`) which is a function call, not a selector. This reads from `timeEntryStore` on every render. | **HIGH** |
| `StreakDisplay.tsx:34-39` | 6 Zustand selectors. The `currentStreak`/`longestStreak` `useMemo` depends on `habits` and `records` — both objects that get **new references on every toggle** (see store issues). | **HIGH** |
| `TimelineStream.tsx:49` | `getFilteredEntries()` is called **during render** — reads the entire store, processes filter logic, and returns a new array reference every time, breaking referential stability. | **HIGH** |
| `TimeEntryStore` getter functions | All getters like `getFilteredEntries()`, `getKPIsFiltered()`, `getTopAppsFiltered()`, `getCategoryBreakdownFiltered()` are **functions, not selectors**. They recreate arrays every call and don't memoize. Every component calling these re-renders on every store change. | **CRITICAL** |

### 2.2 Missing `React.memo`

| Component | Why It Matters |
|---|---|
| `KanbanCard.tsx` | Rendered once per task. During DnD drag/reorder, **every** card re-renders. No `React.memo`. |
| `KanbanColumn.tsx` | No `React.memo`. During column reorder, all columns re-render. |
| `HabitCalendar.tsx` keyboard cells | 30 habits × 31 days = 930 `<td>` cells. No memoization. |
| `TimelineStream.tsx` items | Each timeline entry rendered via `.map()` with no memo. |
| `AchievementBadge.tsx` | Rendered in grids of 8-16. Each badge has infinite animation. No `React.memo`. |
| `BaseCard.tsx` | Used everywhere, no memo. |
| `XPProgressBar.tsx` `NumberTicker` | Inner component created inside parent, so it's re-created on every render (not memo'd). |

### 2.3 `useEffect` with Large Dependencies

| Location | Issue | Severity |
|---|---|---|
| `habits/page.tsx:29-31` | `useEffect` dependency `[initializeGamification]` — this is a **store function reference** that is stable, but the `eslint` pattern is misleading. | LOW |
| `TaskModal.tsx:47-59` | `useEffect` copies all task fields into local state. No debounce. Resets on every `task` reference change. | LOW |
| `notificationStore.ts:125-207` | `checkAndTriggerNotifications` is called from a 15-second interval (likely in NotificationScheduler). It reads the entire store state and calls two other stores (`useHabitStore.getState`, `useTimeEntryStore.getState`). Every 15 seconds this triggers re-read of all habit + timeEntry data. | **HIGH** |

---

## 3. Bundle Size Analysis

### 3.1 Heavy Static Imports

| Location | Issue | Estimated Cost |
|---|---|---|
| `framer-motion` imported in **17+ components** | Full tree-shaken? Framer Motion is ~30KB gzipped. Each page that uses `motion`, `AnimatePresence`, `useReducedMotion` pays this cost. | **30KB gzip per route** |
| `lucide-react` imported in **25+ components** | Individual icon imports ARE tree-shakeable. However, some files import the `LucideIcon` **type** from `lucide-react` which pulls in the module. `EmptyState.tsx:4`, `TimelineStream.tsx:14`, `BaseCard.tsx:9`. | **LOW** if tree-shaken, but `LucideIcon` type import may hinder it |
| `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` | Full DnD library on the board page. ~25KB+ gzipped. Only used on `/board`. **Should be dynamically imported.** | **25KB waste on non-board pages** |
| `sonner` | Imported in every store that calls `toast`. Actually, `toast` is used in 4 stores + 2 components. Each file that imports `toast` from `sonner` contributes to initial bundle. | **Low-Medium** |

### 3.2 Missing Dynamic Imports / Code Splitting

| Opportunity | Location | Expected Saving |
|---|---|---|
| `KanbanBoard` with DnD kit | `board/page.tsx` — the entire `@dnd-kit/*` dependency tree should be dynamically imported: `const KanbanBoard = dynamic(() => import('@/components/board/KanbanBoard'), { ssr: false })` | **~25KB gzip** |
| `SkillOctagon` heavy SVG computation | `SkillOctagon` with its multi-store reads and SVG path computations should be lazy on pages where it's below the fold. | **~5KB** |
| `HabitAnalyticsDashboard`, `HabitAchievements`, `HabitHeatmap` | All on `/habits` — if charts use recharts/chart.js, those should be dynamic. | **~15-30KB** |
| `TaskModal`, `AddColumnModal` | Modal components that are only conditionally rendered could be dynamic. | **~3-5KB** |
| Notification scheduler | `NotificationScheduler` runs in background on every page via `layout.tsx`. Could be lazy. | **~8KB** |

### 3.3 Duplicated Component Definitions

| Location | Issue |
|---|---|
| `XPProgressBar.tsx:12-28` | `NumberTicker` defined inline inside the same file. It's not exported for reuse. `StreakDisplay.tsx` duplicates similar ticker logic. |
| `timerStore.ts:194-197` | `formatTimerTime` function defined inside the store file instead of a shared utility. |
| `DURATION_MS` object | Defined in both `taskStore.ts:69-75` and `TaskModal.tsx:78-84`. Duplicate constant. |
| `DURATION_OPTIONS` | Defined in `KanbanColumn.tsx` and `TaskModal.tsx`. Should be a shared constant in types. |

---

## 4. Layout Performance

### 4.1 Layout Thrashing — Bento Grid on Every Page

| Location | Issue | Severity |
|---|---|---|
| `globals.css:402-458` | The bento grid system uses `grid-template-columns: repeat(12, 1fr)` with `gap: var(--space-lg)`. On mobile (768px), this collapses to `1fr`. The [class*="bento-col-span-"] selector with `grid-column: 1 / -1` at mobile causes **all elements** to reflow. This is fine, but per-page bento grids with `items-stretch` force equal-height columns — which means the browser must calculate all child heights before layout. | **MEDIUM** |
| `page.tsx` | 3 separate bento grid containers with `items-stretch`. Browser must resolve heights of children including `SkillOctagon`, `XPProgressBar`, `StreakHeroCard` with their SVG and animation content before final layout. | **MEDIUM** |

### 4.2 Heavy CSS Selectors & `!important` Usage

| Location | Issue | Severity |
|---|---|---|
| `globals.css:193-213` | `select`, `select option`, `.dark select`, `.dark select option` — all use `!important`. This disables specificity-based overrides and slows style recalc. | **LOW** |
| `globals.css:451-458` | `[class*="bento-col-span-"]` and `[class*="bento-row-span-"]` — attribute-contains selectors are slower than class selectors. But given they're only on mobile breakpoint, impact is minimal. | **LOW** |

### 4.3 Paint Triggers on Scroll

| Location | Issue |
|---|---|
| `HabitCalendar.tsx:172` | The habit name column uses `sticky left-0 z-20` with `shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)]`. Sticky positioning with box-shadow on scroll triggers paint on every scroll frame. |
| `HabitCalendar.tsx:190` | The right-side completion rate column is also `sticky right-0` with shadow. Double sticky causes layout regions that the browser must composite. |
| `globals.css:544-561` | Custom scrollbar styles. `::-webkit-scrollbar` — these are OK but the thumb `background: var(--border-strong)` is a variable reference that can't be painted on the compositor thread. |

### 4.4 `backdrop-blur` Performance

| Location | Description |
|---|---|
| `AddColumnModal.tsx:36` | `backdrop-blur-xs` on the modal overlay. On Windows, `backdrop-filter: blur()` is expensive and may not be hardware-accelerated. Forces paint on every pixel. |
| `TaskModal.tsx:135` | Same `backdrop-blur-xs` pattern. |
| `confirmDelete` in `KanbanColumn.tsx:242` | Modal backdrop with blur. |

---

## 5. Store / State Performance

### 5.1 Zustand Subscription Anti-patterns

| Location | Issue | Severity |
|---|---|---|
| `SkillOctagon.tsx:36-38` | `computeAxesScores()` uses `.getState()` directly inside a **non-reactive** function. This is called from a `useMemo` that depends on `habits`. But `computeAxesScores` also reads `timeEntryStore` and `taskStore` **without subscribing** — so those dependencies are invisible to React. The component won't re-render when those stores change. **This is also a correctness bug — stale data.** | **CRITICAL** |
| `KanbanCard.tsx:20-21` | `getTaskLoggedSeconds(task.id)` called during render. This runs the `getTaskLoggedSeconds` function on `timeEntryStore` but **does not subscribe** to that store via a selector. The card won't re-render when the linked time changes. | **HIGH** |
| `TaskModal.tsx:119` | `useTimeEntryStore.getState().getTaskLoggedSeconds(task.id)` — direct `.getState()` call, not a reactive subscription. The displayed time won't update when new time entries arrive. | **HIGH** |
| `HabitCalendar.tsx:37` | `useTaskStore((s) => s.tasks)` — imports entire `tasks` array just to find `linkedTask`. Every task change triggers a re-render of the entire calendar. | **MEDIUM** |
| `habitStore.ts:toggleHabit` | Optimistic update followed by DB call — good pattern. But after DB success, **no invalidation**. Stale data from DB if background sync occurs. | **LOW** |
| `gamificationStore.ts:128-136` | `setTimeout(() => saveLocal(...), 0)` — zero-delay setTimeout to save to localStorage + DB. This is fire-and-forget, no error handling on save. | **LOW** |

### 5.2 Frequent State Spreads Creating New Object References

| Location | Issue | Severity |
|---|---|---|
| `habitStore.ts:103-108` | `toggleHabit` creates a **new `records` object** via spread `...state.records` every toggle. Since `records` is a nested key-value map (~30 habits × 31 days = 930 entries), spreading creates a 930-key copy on every single cell click. | **HIGH** |
| `gamificationStore.ts:113` | `trackedXPKeys: [...state.trackedXPKeys, key]` — new array reference on every XP award. All subscribers re-render. | **MEDIUM** |
| `taskStore.ts:174` | `addTask` creates `[newTask, ...state.tasks]` — new array header, all subscribers re-run. | **LOW** |
| `taskStore.ts:193-196` | `updateTask` maps over entire tasks array to update one field. | **LOW** |
| `timeEntryStore.ts:174-203` | `initializeTimeEntries` creates new entries array + categories map every time. All selectors re-evaluate. | **MEDIUM** |
| `timeEntryStore.ts:205-208` | `setSelectedDate` calls `initializeTimeEntries` which re-fetches from DB and replaces the entire entry array. | **MEDIUM** |

### 5.3 Store Getter Functions Not Referentially Stable

| Function | In Store | Problem |
|---|---|---|
| `getFilteredEntries()` | `timeEntryStore` | Creates new filtered array every call → never referentially stable |
| `getKPIsFiltered()` | `timeEntryStore` | Creates new KPI object every call |
| `getTopAppsFiltered()` | `timeEntryStore` | Creates new sorted array every call |
| `getActivePeriods()` | `timeEntryStore` | Creates new timeline array every call |
| `getTotalFocusSecondsToday()` | `timeEntryStore` | Computes new value every call |

These are **functions**, not derived selectors. Any component that calls them in render (like `TimelineStream.tsx:53`) will get a **new reference** every render, breaking `useMemo` and `React.memo` chains.

---

## 6. Animation Loop Audit

### 6.1 Frame-Driven vs Interval-Driven Animation Count

| Loop | Location | Type | Interval | Duration |
|---|---|---|---|---|
| Timer tick | `timerStore.ts:119-131` | `setInterval` | 1000ms | While timer is running |
| Timeline auto-refresh | `timeline/page.tsx:18-21` | `setInterval` | 15000ms | While page is mounted |
| Notification check | `NotificationScheduler` | `setInterval` | Unknown (likely 15-60s) | While app is open |
| XP medal floating | `XPProgressBar.tsx:163` | Framer Motion `repeat: Infinity` | 3.4s cycle | While component is mounted |
| Streak badge bounce | `StreakDisplay.tsx:132` | Framer Motion `repeat: Infinity` | 2.5s cycle | While component is mounted |
| Achievement badge hover | `AchievementBadge.tsx:78` | Framer Motion `repeat: Infinity` | 3.5s cycle | While badge is mounted |
| Flame flicker CSS | `globals.css:626` | CSS `@keyframes` | 2.5s cycle | While element exists |

**Total concurrent animation loops (worst case):** If user is on the Dashboard with timer running and all gamification elements visible, there are **5-7 continuous animation loops** running simultaneously.

### 6.2 Framer Motion Run Loop

Framer Motion uses a single `requestAnimationFrame` loop internally for all `motion` components. However:
- Each `<motion.div>` with `initial`/`animate` creates an **independent animation** in Framer's internal registry
- Components with `layout` prop (KanbanColumn, KanbanCard) subscribe to **layout measurement** which runs synchronously
- During DnD operations, Framer Motion's layout animations + @dnd-kit's drag position updates both compete for the rAF loop

---

## 7. Memory Leak Risks

### 7.1 Unmounted Timers

| Location | Issue | Severity |
|---|---|---|
| `timerStore.ts:69, 118-131` | `globalIntervalId` is a **module-level variable** that survives component unmount. If the user navigates away while a timer is running, the interval continues firing indefinitely, calling `set()` on a Zustand store that may have unmounted subscribers. This causes: 1) stale closure warnings, 2) memory leak (interval holds reference to the callback's scope), 3) unnecessary CPU usage. `cleanupTimerStore()` exists at line 200 but is **never called** from any effect in any component. | **CRITICAL** |
| `timeline/page.tsx:18-21` | `setInterval(refreshAllData, 15000)` — interval is cleared on unmount via `clearInterval`. This is correct. | OK |
| `LevelUpCelebration.tsx:27` | `setTimeout(dismiss, 3000)` — cleared on unmount via `clearTimeout` in the return. Correct. | OK |
| `notificationStore.ts:125` | `checkAndTriggerNotifications` — this is likely called from `NotificationScheduler` component. If that component unmounts without clearing the interval, it leaks. Need to verify that component. | **MEDIUM** |

### 7.2 Unmounted Event Listeners

| Location | Issue | Severity |
|---|---|---|
| `settings/page.tsx:31-32` | `window.addEventListener('resize', handleResize)` — properly removed via return in `useEffect`. Correct. | OK |
| `SettingsStore.ts:87-96` | Direct `document.documentElement.classList` manipulation in `initializeSettings`. If the component unmounts before async `fetchSettingsFromDb` resolves, it mutates classList on unmounted element. Not a leak but a DOM mutation race. | LOW |

### 7.3 Zustand Listener Leaks

Zustand's `subscribe()` is not used directly anywhere. Zustand hooks automatically clean up when components unmount. However:

| Issue | Description |
|---|---|
| `globalIntervalId` in timerStore | The module-level `setInterval` continues calling `set()` on the store. Old subscribers are GC'd, but the interval itself keeps running until `stop()` or `reset()` is called. If user navigates away mid-timer and starts a new timer later, the old interval reference is overwritten (line 118) — the old interval is cleared before creating a new one, which is correct. But if user never interacts with timer again, the interval runs forever. |

### 7.4 Framer Motion Unmount Cleanup

Framer Motion auto-cleans animations on unmount. However, `AnimatePresence` with `exit` animations delays unmount until the animation completes. With `LevelUpCelebration.tsx` using `AnimatePresence` + `exit={{ opacity: 0 }}`, overlays that are triggered and dismissed quickly may stack in the animation queue.

---

## 8. Top 10 Performance Fixes (Ranked by Expected Impact)

### #1 — Fix Timer Store Interval Leak (CRITICAL)
**File:** `timerStore.ts:69, 118-131`  
**Fix:** Either call `cleanupTimerStore()` from a `useEffect` in `TimerPage`, or move the interval into a React component that can be properly unmounted. Use `useEffect` cleanup instead of module-level `globalIntervalId`.

```typescript
// In TimerPage or a TimerProvider component
useEffect(() => {
  return () => cleanupTimerStore()
}, [])
```
**Expected impact:** Frees a `setInterval` that otherwise runs forever, reducing CPU usage by ~0.5-2% continuously.

### #2 — Convert State Getter Functions to Selector-Compatible Derived Data (CRITICAL)
**Files:** `timeEntryStore.ts:279-298` (`getFilteredEntries`), `timeEntryStore.ts:300-304` (`getFilteredFocusSeconds`), etc.  
**Fix:** Replace function calls with Zustand selector patterns. Either:
- Compute derived data inside `set` and store it alongside raw data, OR
- Use external selectors with `useShallow` for array comparisons

```typescript
// Instead of: const entries = useTimeEntryStore(s => s.getFilteredEntries())
// Do: const filteredEntries = useTimeEntryStore(useShallow(s => computeFiltered(s)))
```
**Expected impact:** Eliminates unnecessary re-renders in TimelineStream, all chart components, and anywhere filters are applied. **Potentially 50%+ reduction in re-renders on the timeline page.**

### #3 — Stop Spreading the Massive `records` Map on Every Toggle (HIGH)
**File:** `habitStore.ts:103-108`  
**Fix:** Use Immer middleware in Zustand, or mutate in place with `set((state) => { state.records[key] = nextDone })`. No spread needed.

```typescript
// Current: spread creates 900+ key copy
// Fix with Immer or direct mutation via Zustand 4.4+:
toggleHabit: (habitId, date) => {
  const key = `${habitId}_${date}`
  set((state) => {
    state.records[key] = !state.records[key]
  })
}
```
**Expected impact:** Cuts memory allocation per habit toggle by ~90%. 930-key spread → 1-key mutation.

### #4 — Stop Calling `getTaskLoggedSeconds()` During Render (HIGH)
**Files:** `KanbanCard.tsx:20`, `TaskModal.tsx:119`  
**Fix:** Subscribe to the relevant store slice reactively, or compute logged time inside the store and store it alongside tasks.

**Expected impact:** KanbanCards won't re-render when unrelated time entries change. The board currently re-renders all cards on every time entry sync.

### #5 — Add `React.memo` to Heavily Repeated Components (HIGH)
**Files:** `KanbanCard.tsx`, `KanbanColumn.tsx`, `HabitCalendar.tsx` table cells, `AchievementBadge.tsx`, `TimelineStream.tsx` entries

**Fix:** Wrap these with `React.memo` with proper comparison function.

```typescript
export const KanbanCard = React.memo(function KanbanCard({ task, onEdit }: KanbanCardProps) {
  // ...
})
```
**Expected impact:** During DnD drag, only the dragged card re-renders instead of all cards + columns. Calendar operations affect only the toggled cell instead of full re-render.

### #6 — Remove Default Motion Animation from Every `BaseCard` (HIGH)
**File:** `BaseCard.tsx:128-135`  
**Fix:** Make animation opt-in rather than default. Remove `initial`/`animate`/`transition` defaults from `BaseCard`. Use CSS transitions for the simple fade-in.

**Expected impact:** Eliminates dozens of JS animations on page load. Faster time-to-interactive.

### #7 — Add `will-change: transform` to Animated Elements (MEDIUM)
**Files:** All `<motion.div>` elements with `y`/`scale` transforms, the `card-hover-lift` CSS class, SVG polygons in `SkillOctagon.tsx`

**Fix:** 
```css
.card-hover-lift {
  will-change: transform;
}
```
And in Framer Motion components, add `style={{ willChange: 'transform' }}` or use Framer's `whileHover` / `whileTap` with CSS instead of JS animations.

**Expected impact:** Eliminates paint re-triggering on card hover and mount animations. Smoother 60fps during staggered mount sequences.

### #8 — Dynamically Import @dnd-kit on Board Page (MEDIUM)
**File:** `board/page.tsx`  
**Fix:**
```typescript
import dynamic from 'next/dynamic'
const KanbanBoard = dynamic(() => import('@/components/board/KanbanBoard'), { ssr: false })
```

**Expected impact:** Saves ~25KB gzipped from the initial bundle for non-board pages.

### #9 — Refactor `SkillOctagon.computeAxesScores()` to Be Reactive (MEDIUM)
**File:** `SkillOctagon.tsx:35-126`  
**Fix:** Subscribe to all three stores reactively inside the component, not using `.getState()` in a non-reactive function. The `useMemo` dependencies should include `timeEntryStore` and `taskStore` subscriptions.

**Expected impact:** SkillOctagon will stay in sync with all data sources. Currently it shows stale data from task/time stores.

### #10 — Use CSS `@keyframes` Instead of Framer Motion for Infinite Animations (MEDIUM)
**Files:** `XPProgressBar.tsx:163`, `StreakDisplay.tsx:132`, `AchievementBadge.tsx:78`

**Fix:** Replace `repeat: Infinity` Framer Motion animations with CSS `@keyframes` + `animation`. Framer Motion's JS-driven repeated animations run in the main thread; CSS animations run on the compositor thread.

```css
@keyframes float-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-float-subtle {
  animation: float-subtle 3.4s ease-in-out infinite;
}
```

**Expected impact:** Removes 3+ JS animation loops from Framer Motion's rAF queue. Frees main thread for user interactions.

---

## Summary: Performance Budget by Page

| Page | Estimated Animations on Load | Concurrent Loops | Bundle Est. (gzip) | Primary Issue |
|---|---|---|---|---|
| `/` (Dashboard) | 18-25 motion elements | 4-5 | ~120KB | Too many animated cards + gamification animations |
| `/habits` | 20-30 motion elements | 2-3 | ~150KB | HabitCalendar SVG table + repeated motion wrappers |
| `/board` | 15-20 motion elements | 1-2 | ~180KB | DnD kit + layout animations during drag (jank) |
| `/timeline` | 10-15 motion elements | 1 | ~130KB | Getter functions causing re-renders on 15s refresh |
| `/settings` | 5-8 motion elements | 1 | ~110KB | Acceptable — lightest page |
| `/timer` | 3-5 motion elements | 1-2 | ~100KB | Timer interval leak if navigated away |

**Quick Wins (implement in <30 min each):**
1. Add `cleanupTimerStore()` call in TimerPage
2. Add `React.memo` to `KanbanCard`, `KanbanColumn`
3. Remove default motion from `BaseCard`
4. Add `will-change` to hover classes
5. Dynamic import for @dnd-kit

**Architecture Changes (bigger but necessary):**
6. Refactor `timeEntryStore` getters to reactive selectors
7. Use Immer for `records` map in `habitStore`
8. Replace infinite Framer Motion loops with CSS animations
