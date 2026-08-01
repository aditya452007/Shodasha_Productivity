# Emil Kowalski Design Engineering Audit — Shodasha Productivity

**Audit Date**: 2026-07-29  
**Files Audited**: 60+ (pages, components, stores, lib, types, globals.css)

---

## 1. Animation & Motion Review

### 1.1 `repeat: Infinity` Abuse

The codebase has 9 components using `repeat: Infinity` in framer-motion animations. Most are decorative loops that never stop, violating Emil's principle that *every animation must justify itself*.

| Component | Lines | What animates | Verdict |
|---|---|---|---|
| `LivingFlameIcon.tsx` | 27-41, 50-62, 82-102, 105-121, 125-141 | Aura pulse, SVG flame morph (outer + inner), floating spark particle | **FAIL** — 4 simultaneous infinite loops. The spark particle alone has 4 animated properties. Users will perceive this as jank after ~5s. |
| `XPProgressBar.tsx` | 163-170 | Medal crest levitates (y: [-4,4,-4]) + glow pulse | **FAIL** — Levitation is purely decorative. The `whileHover: rotateY: 360` is a gimmick. |
| `StreakHeroCard.tsx` | 58-59, 69-71 | Flame badge levitates + scale pulse | **FAIL** — `LivingFlameIcon` already animates. This adds a second animation on its container. |
| `StreakDisplay.tsx` | 132-134 | Boost badge y-levitate | **WARN** — Unnecessary. The data (streak count) should speak, not the badge wrapper. |
| `HabitStatsCard.tsx` | 165-210 | Every icon has its own infinite animation (y bounce, scale pulse, rotate jiggle, hover Y-flip) | **FAIL** — 4 unique infinite animations on KPI icons is excessive. None serve a functional purpose. |
| `AchievementBadge.tsx` | 77-87 | Unlocked badges float infinitely (y: [-2,2,-2]) at 3.5s | **FAIL** — A badge should feel earned and settled, not perpetually floating. This is visual noise. |
| `TopKPIGrid.tsx` | 104 | Pulse glow dot on each KPI card | **WARN** — 4 simultaneously pulsing dots is distracting. Only the "Live" badge should pulse. |

**Total infinite animations running simultaneously on the dashboard**: 14+ (LivingFlameIcon ×4 + XPProgressBar ×2 + StreakHeroCard ×2 + TopKPIGrid ×4 + HabitStatsCard ×4 — some compete).

### 1.2 Easing Inconsistency

`globals.css:88-93` defines a deliberate easing system:
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

But framer-motion transitions across the codebase use **at least 5 different approaches**:

1. **Hardcoded arrays** — `[0.23, 1, 0.32, 1]` (most components — correct but verbose)
2. **TypeScript `as`** — `[0.23, 1, 0.32, 1] as [number, number, number, number]` (`BaseCard.tsx:53`)
3. **String named** — `'easeInOut'`, `'easeOut'`, `'easeIn'` (many framer-motion transitions)
4. **Spring config** — `{ type: 'spring', stiffness: ..., damping: ... }` (SkillOctagon, LevelUpCelebration)
5. **CSS transitions** — `cubic-bezier(0.25, 1, 0.5, 1)` in KanbanCard/KanbanColumn for drag transforms

The CSS transitions and framer-motion animations use **different cubic-bezier curves** for similar effects (`--ease-out` is `0.23,1,0.32,1` but Kanban uses `0.25,1,0.5,1`). This creates perceptible inconsistency.

### 1.3 Duration Mismatch

- CSS token `--dur-short: 220ms` but `LevelUpCelebration.tsx:46` uses `duration: 0.2` (200ms) — close but not exact
- `--dur-micro: 120ms` is never used in framer-motion — all micro-transitions use CSS classes like `transition-colors`
- `NumberTicker.tsx` uses a custom `easeOutCubic` approximation rather than the app's `--ease-out` curve — this means number counters animate with a slightly different feel than everything else

### 1.4 Page Transition Overlap

`layout.tsx:46` wraps all pages in `<PageTransition>`. Then every page independently wraps its content in a `<motion.div>` with `initial/animate`. This creates **two sequential opacity fades** on every page navigation — the layout fades in, then the page content fades in (often with a spring). Only one should exist.

### 1.5 Unnecessary Animations

- **`BaseCard.tsx:128-131`** — Every card animates `opacity: 0 → 1, y: 12 → 0` on mount. When cards re-render due to store updates (which is frequent with Zustand), they re-trigger this animation. This causes flickering during live data refreshes.
- **`ScheduleActivityCard.tsx:112-114`** — Staggered `x: -8 → 0` on schedule items. The list represents a queue that updates frequently; re-animating items on every re-render feels janky.
- **`HabitCalendar.tsx:224-233`** — Every habit row animates in on every render. The calendar is a data-dense table that re-renders often.
- **`HabitQuickToggle.tsx:64-71`** — Same stagger pattern re-triggering on renders.

### 1.6 Spring Configuration Audit

- **`SkillOctagon.tsx:270`** — Data polygon uses `spring { stiffness: 80, damping: 12, mass: 1 }`. Stiffness 80 is very low — the polygon will feel sluggish and "wet." For a radar chart that represents data, it should snap into place faster (`stiffness: 200, damping: 20`).
- **`HabitHeatmap.tsx:134`** — `whileHover: { scale: 1.4 }` with `spring { stiffness: 400, damping: 20 }`. Scale 1.4 on a 14px cell is too aggressive — the cell will overlap neighbors. Max should be 1.2.

---

## 2. State Completeness Audit

### 2.1 BaseCard (the template)

`BaseCard.tsx` is well-designed — it handles `isLoading`, `isEmpty`, `hasError` with built-in skeletons, empty states, and error banners.

**Issue**: The `initial`/`animate` defaults (`opacity: 0, y: 12`) apply to **every** card, including error and loading states. This means the error banner fades in from below, which is unnecessary motion on an error.

### 2.2 Components with Full State Coverage (✓)

| Component | Loading | Empty | Error | Edge cases |
|---|---|---|---|---|
| `HabitCalendar.tsx` | ✓ Skeleton | ✓ "No habits" CTA | ✓ ErrorBanner | Future dates disabled, past locked |
| `SkillOctagon.tsx` | ✓ Circular skeleton | ✓ Dashed polygon + center text | ✓ ErrorBanner | `isInitialized` guard |
| `TimelineStream.tsx` | ✓ Skeleton | ✓ Custom EmptyState | ✓ ErrorBanner with retry | Idle entries styled differently |
| `KanbanBoard.tsx` | ✓ Column skeleton | ✓ Dashed "Add a task" | ✓ ErrorBanner | Expired tasks auto-removed |
| `HabitQuickToggle.tsx` | ✓ Skeleton | ✓ EmptyState with action | ✓ ErrorBanner | Habit URL button with stopPropagation |
| `RecentActivityFeed.tsx` | ✓ Skeleton | ✓ EmptyState | ✓ ErrorBanner | Handles combined task+time errors |
| `InsightCard.tsx` | ✓ via BaseCard | ✗ No explicit empty | ✓ via BaseCard | Generates insights from data |
| `TodayProgressCard.tsx` | ✓ Skeleton | ✓ EmptyState for zero time | ✓ ErrorBanner with retry | Multiple stores combined |

### 2.3 Components Missing States (✗)

| Component | Missing | Detail |
|---|---|---|
| `AddHabitModal.tsx` | Error state on save | `handleSubmit` catches errors and shows toast, but no inline error message in the modal |
| `QuickTaskInput.tsx` | Error state | Errors show as toast only, no error message in the input itself |
| `DailyXPGoal.tsx` | Empty state | Shows "Start your day" text, but if `dailyXP` is 0 and no habits exist, it still renders the ring at 0% |
| `GoalsHabitsCard.tsx` | Error state | No error handling — if habitStore fails, the card silently shows nothing |
| `ScheduleActivityCard.tsx` | Error state | No error handling — if task store fails, the card silently shows nothing |
| `LearningProgressCard.tsx` | Error state | No error handling |
| `PerformanceOverviewChart.tsx` | Error state | No error handling |
| `HabitStatsCard.tsx` | Partial — missing empty habit state | Shows 4 cards with 0 values but no CTA to create a habit |
| `StreakHeroCard.tsx` | Error state | No error handling — silently fails |
| `HabitCategoryMetricsCard.tsx` | Loading/Error/Empty | None — silently renders zeros if store fails |

### 2.4 Interactive State Gaps

| Element | default | hover | focus-visible | active | disabled | loading |
|---|---|---|---|---|---|---|
| `AddHabitModal` color swatches | ✓ | ✓scale-105 | ✗ | ✗ | ✗ | ✗ |
| `HabitCalendar` cells | ✓ | ✓ | ✗ | ✗ | ✓ (future/past) | ✗ |
| `KanbanCard` check button | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| `KanbanCard` edit button | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Settings sidebar items | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| `QuickTaskInput` submit | ✓ | ✗ | ✓ focus-within | ✗ | ✓ | ✓ spinner |

**Missing `:focus-visible` rings on most interactive elements.** The global `globals.css:231-235` defines a green focus ring, but many buttons and interactive elements don't trigger it because they use `<button>` or `<div>` with `onClick` but lack a visible focus implementation. The HabitCalendar buttons, KanbanCard buttons, and settings controls all lack focus indicators.

### 2.5 Edge State: Loading Skeletons Quality

`LoadingSkeleton.tsx` is minimal — just a `div` with `animate-pulse`. It lacks:
- A properly matched height/width model (framer-motion layout animations would help)
- Variant shapes (circular, text line, card)
- Reduced-motion support: the `motion-reduce:animate-none` class is present ✓
- Skeleton groups that fade in sequentially (all appear at once)

Compare to the **empty state** which actually has more visual design (`EmptyState.tsx` with icon, title, description, CTA).

---

## 3. Polishing Opportunities

### 3.1 Missing Press States (Scale on Tap)

`globals.css:221-223` defines a global `button:active { transform: scale(0.97) }`, but many custom elements use `<div>` with `onClick` instead of `<button>`, bypassing this rule.

Elements missing `active:scale-95` or `active:scale-97`:

| Element | File | Line |
|---|---|---|
| HabitCalendar day cells | `HabitCalendar.tsx` | 313-353 |
| HabitCalendar "Today" button | `HabitCalendar.tsx` | 134-138 |
| KanbanColumn title rename | `KanbanColumn.tsx` | 137 |
| StreakDisplay boost badge | `StreakDisplay.tsx` | 131-138 |
| HabitQuickToggle items | `HabitQuickToggle.tsx` | 73-79 |
| InsightCard (non-interactive but clickable) | `InsightCard.tsx` | 55-68 |

### 3.2 Focus Ring Design

The global `:focus-visible` style (`globals.css:231-235`) uses:
- `outline: 2px solid var(--accent)` — green outline
- `outline-offset: 3px`

**Issues**:
1. Green outline on green-accent buttons creates low contrast (green-on-green)
2. `outline-offset: 3px` is large for small elements like checkboxes and color swatches
3. `transition: none !important` means focus rings snap abruptly — no smooth appearance
4. Many interactive elements inside scrollable containers will clip the outline

### 3.3 Empty State Quality

`EmptyState.tsx` is functional but lacks:
- An illustration or icon system (uses generic Lucide icons)
- Animated entry (the empty state appears instantly while loading → empty transition is jarring)
- Contextual guidance beyond a single CTA button
- No distinction between "truly empty" and "filter returned nothing" (the `TimelineStream.tsx:93-101` has its own custom empty state that is more visually interesting with a double-bezel card)

Compare `EmptyState.tsx` (generic) to `TimelineStream.tsx:93-101` (custom double-bezel card with clock icon) — the custom one feels more crafted.

### 3.4 Stagger Pattern Consistency

Several components use the same stagger pattern:
```tsx
transition={{ duration: 0.3, delay: index * 0.05 }}
```

This appears in: `GoalsHabitsCard`, `ScheduleActivityCard`, `HabitQuickToggle`, `HabitCalendar` rows, `TimelineStream`.

**Issues**:
- The 0.05s stagger is imperceptible for lists under 4 items. For the schedule (max 4 items), total stagger is 0.15s — the human eye perceives this as "all at once."
- The same pattern is copied with a `Math.min(index * 0.05, 0.3)` cap in `HabitCalendar.tsx:232` and `TimelineStream.tsx:118` — the cap means items after the 6th animate simultaneously, creating a batch effect.
- No exit stagger — items disappear all at once.

### 3.5 Transition Inheritance

The component tree has inconsistent animation approaches:
- **CSS class approach**: `card-hover-lift`, `transition-colors`, `transition-btn` (defined in globals.css)
- **Tailwind approach**: `hover:opacity-90`, `transition-opacity`, `hover:scale-110`
- **Framer-motion approach**: `motion.div` with `whileHover`, `whileTap`, `animate`

Three animation systems coexist. Emil would argue this is one too many. Pick one for micro-interactions (CSS classes are best — they're GPU-composited and don't cause re-renders).

---

## 4. The "Restraint" Score

### Score: 3/10 — The app does too much.

#### 4.1 Gamification Over-saturation

The dashboard page (`app/page.tsx`) includes:
1. `XPProgressBar` — animated level display with levitating medal, glow halo, animated XP counter
2. `DailyXPGoal` — animated ring chart
3. `SkillOctagon` — animated SVG radar chart with spring polygon
4. `StreakHeroCard` — animated flame badge, levitation, pulsing background halos
5. `LevelUpCelebration` — overlay with particles

That's **5 gamification widgets on a single page**, each with its own animation system. Emil's principle: *restraint is the highest form of craft*. One gamification hub card would suffice. The XPProgressBar alone covers level + XP + tier.

#### 4.2 Double/triple Streak Calculation

- `StreakHeroCard.tsx` calculates streak inline
- `StreakDisplay.tsx` calculates streak inline (slightly different algorithm)
- `HabitStatsCard.tsx` calculates streak inline (third version)
- `DailyXPGoal` could show streak but doesn't

This violates DRY and means streak displays can disagree. The streak logic is duplicated across 4 files.

#### 4.3 LivingFlameIcon Over-engineering

The flame icon (`LivingFlameIcon.tsx`) has:
- 3 SVG elements (aura, outer flame, inner flame) + 1 particle
- 4 simultaneous `repeat: Infinity` animations
- 2 SVG gradients
- `drop-shadow` CSS filter
- `blur-md` backdrop
- 3 different transition durations (1.4s, 1.8s, 1.5s, 2.2s)

For **an icon**. A static SVG flame with a single CSS `animation: pulse` would communicate the same information with 95% less code and zero CPU cost.

#### 4.4 KPI Cards Over-animated

`TopKPIGrid.tsx` has cards with:
- `animate-pulse-glow` dot (CSS keyframe)
- `group-hover:scale-110` icon bounce (Tailwind)
- `card-hover-lift` (CSS transition)

Three animation systems on one card. The dot pulse + icon bounce + card lift all compete.

#### 4.5 Page Transition × Double Animation

`PageTransition` fades pages in (250ms). Then each page does its own fade/spring (200-400ms). Users experience a fade → (wait) → spring sequence on every navigation.

---

## 5. Critical Bugs Found

### B1. Duplicate Condition in habitStore

`src/stores/habitStore.ts:133`:
```ts
if (date === todayStr || date === todayStr) {
```
Both conditions are identical. The second was likely meant to be `date === yesterdayStr` or similar. This means the "all habits done" bonus only checks `todayStr` and the line is dead code.

### B2. Streak Calculation Inconsistency

`StreakHeroCard.tsx:19-39` and `StreakDisplay.tsx:41-81` both calculate streak but use different logic:

- **StreakHeroCard**: Checks if any habit was done today, if not goes back 1 day, then counts backwards until a miss
- **StreakDisplay**: Same approach but adds a `globalStart` boundary from the earliest habit creation date

If you have habits created on different dates, they could report different streak lengths because `StreakDisplay` checks against `globalStart` while `StreakHeroCard` checks 14 days back.

### B3. BaseCard Re-animation on Re-render

`BaseCard.tsx:128-131` uses framer-motion's `initial`/`animate` with `opacity: 0, y: 12` → `opacity: 1, y: 0`. This animation re-triggers every time the component re-renders (e.g., when Zustand store updates). Since many cards subscribe to store slices that update frequently (time entries poll every 15s), cards will repeatedly fade in.

**Fix**: Use `initial={false}` or `layout` prop to prevent re-animation on updates.

### B4. HabitCalendar Scroll Position Bug

`HabitCalendar.tsx:70-78` calculates scroll position to center on today:
```ts
const cellWidth = 36
const headerOffset = 240
const targetScroll = todayIndex * cellWidth - (containerWidth - headerOffset) / 2 + cellWidth / 2
```
`headerOffset` hardcodes 240px which is the habit name column width. If the browser width is narrower, this calculation is wrong and today won't be centered.

### B5. LevelUpCelebration Memory Leak

`LevelUpCelebration.tsx:119-138` creates 12 `motion.div` particles on every level-up. These particles animate out (opacity 0) but remain in the DOM until their parent unmounts (3s auto-dismiss). If a user levels up multiple times (unlikely but possible through XP awards), particles accumulate.

**Fix**: Remove particles from DOM after animation completes using `onAnimationComplete`.

### B6. Timer Persistence Race Condition

`timerStore.ts:41-45` attempts to "catch up" elapsed time on page reload:
```ts
const elapsed = Math.floor((Date.now() - new Date(parsed.startedAt).getTime()) / 1000)
const remaining = Math.max(0, parsed.remaining - elapsed)
```
But the timer's `setInterval` only fires every 1000ms, so the first tick after a long absence will skip. The correction logic is good, but if the timer was paused in the background, `remaining` could go negative before the catch-up runs.

### B7. Double "All Done Today" XP Bonus

`habitStore.ts:133` checks `date === todayStr` to award a 25XP all-done bonus. But `awardXP` is called inside the `toggleHabit` function which can fire multiple times per day. If a user toggles a habit off and on, the check could trigger each time.

### B8. Missing `transform-origin` on Press Scales

The global `button:active { scale(0.97) }` in `globals.css:222` applies from the default `transform-origin: center`. But for buttons with absolute positioning, the scale may shift the element visually. KanbanColumn's confirm delete dialog has centered buttons that may shift on press.

---

## 6. Recommended Animation Architecture

### 6.1 What Should Animate

| Element | Animation | Type | Easing | Duration |
|---|---|---|---|---|
| Page transitions | Fade only (no y) | framer-motion | `--ease-out` | 200ms |
| Card mount | Fade only (no y offset) | framer-motion | `--ease-out` | 250ms |
| Data changes (counters) | Count-up | `NumberTicker` | `--ease-out` | 300ms |
| Hover states | Background/border color | CSS class | `--ease-out` | 120ms |
| Press states | Scale(0.97) | CSS class | `--ease-out` | 80ms |
| Focus rings | Border color + box-shadow | CSS class | `--ease-out` | 150ms |
| Drag interactions | Spring with position | framer-motion | spring 400/25 | — |
| Progress bars | Width change | CSS transition | `--ease-out` | 500ms |
| Skeleton loading | Pulse opacity | CSS animation | linear | 1.5s |
| Modal open | Scale + fade | framer-motion | `--ease-out` | 250ms |
| Level up celebration | Scale + fade | framer-motion | `--ease-out` | 300ms |

### 6.2 What Should NOT Animate

- **Infinite loops**: Remove all `repeat: Infinity` from framer-motion. Replace with static or user-triggered animations.
- **Habit calendar rows**: Remove stagger animation. The calendar is a dense table; animation interferes with scanning.
- **Schedule task items**: Remove per-item stagger. Animate the container as a group on mount.
- **KPI card dots**: Keep 1 pulsing dot maximum (for "Live" badge only).
- **Icon hover effects**: `group-hover:scale-110` on every icon is excessive. Use subtle color changes instead.
- **Double-mounted animations**: Remove page-level `<motion.div>` wrappers. Only `PageTransition` should animate page entry.

### 6.3 Standardized Animation System

**Create a single `animations.ts` constants file:**

```ts
export const easings = {
  out: [0.23, 1, 0.32, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
}

export const durations = {
  micro: 0.12,
  short: 0.22,
  long: 0.42,
}

export const spring = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 25 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 20 },
  gentle: { type: 'spring' as const, stiffness: 100, damping: 15 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: durations.short, ease: easings.out },
}

export const fadeSlideUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: durations.short, ease: easings.out },
}
```

Then use these consistently across all components. This eliminates the copy-pasted array literals and ensures every animation feels like it belongs to the same system.

### 6.4 Remove All `repeat: Infinity` — Replacement Plan

| Current | Replacement |
|---|---|
| `LivingFlameIcon` 4× loops | Static SVG + CSS `pulse-glow` on aura only (2s, 1 iteration on mount) |
| `XPProgressBar` medal levitation | Remove. Medal shows on mount with a scale(0.95→1) entry, then is static. |
| `StreakHeroCard` flame levitation | Remove. The `LivingFlameIcon` is enough. |
| `StreakDisplay` badge bounce | Remove. Static badge. |
| `HabitStatsCard` icon animations | Remove all. Icons get `group-hover:scale-110` only. |
| `AchievementBadge` float | Remove. Badge gets a single entry animation, then is static. |
| `TopKPIGrid` pulse dots | Keep 1 (the "Live" badge on focus score). Remove from others. |

### 6.5 Reduced Motion Compliance

The app has `useReducedMotion()` checks in ~15 components (good). But the pattern is verbose:

```tsx
initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
animate={{ opacity: 1, y: shouldReduceMotion ? 0 : 0 }}
```

**Simplify**: Create a custom hook `useSafeAnimation` that returns no-op animation props when reduced motion is preferred:

```ts
function useSafeAnimation(anim: { initial: any; animate: any }) {
  const reduced = useReducedMotion()
  if (reduced) return { initial: {}, animate: {} }
  return anim
}
```

This eliminates the ternary explosion across all components.

---

## Summary

This app demonstrates strong engineering foundations — Zustand stores are well-structured, the BaseCard state system is thoughtful, and the visual design (warm palette, bento grid, typography) shows taste.

The primary craft gap is **over-animation**: the app tries to animate everything, and in doing so, nothing feels special. Emil would say: *"When everything is delightful, nothing is."* 

Remove 80% of the infinite animations. Keep the data-driven ones (progress bars, counters, level-up celebration). Let the UI breathe.

**Priority fixes**:
1. Remove all `repeat: Infinity` animations (sections 1.1, 6.4)
2. Fix the BaseCard re-animation bug (section 5, B3)
3. Unify streak calculation (section 5, B2)
4. Remove duplicate page entry animations (section 1.4)
5. Fix habitStore duplicate `todayStr` check (section 5, B1)
6. Standardize easing across CSS and framer-motion (section 1.2)
7. Add missing `active:` press states and `focus-visible` rings (sections 2.4, 3.1)
8. Create a single animation constants file (section 6.3)
