# Shodasha Productivity — Redesign Existing Audit

> **Date:** 2026-07-29
> **Scope:** Full app audit covering Dashboard, Habits, Timeline, Board, Timer, Settings, Navigation, Cards, Gamification, Layout & Grid

---

## 1. Generic AI Pattern Detection

### 1.1 The "Floating Medal Badge" Template
Every gamification card uses the same motion pattern: levitating badge + pulsing halo + gradient border + `card-hover-lift`. This is the most overused trope in AI-generated UI.

**File evidence:**
- `src/components/gamification/XPProgressBar.tsx:163` — `<motion.div animate={{ y: [-4, 4, -4] }}` with whileHover rotateY
- `src/components/gamification/StreakDisplay.tsx:131` — `<motion.div animate={{ y: [-1, 1, -1] }}`
- `src/components/layout/Navbar.tsx:162` — Level badge `animate={{ y: [-1.5, 1.5, -1.5] }}`
- `src/components/layout/Navbar.tsx:172` — Streak badge `animate={{ y: [1.5, -1.5, 1.5] }}`
- `src/components/dashboard/StreakHeroCard.tsx:57` — Flame badge `animate={{ y: [-2, 2, -2] }}`
- `src/components/dashboard/StreakHeroCard.tsx:69` — Flame icon `animate={{ y: [-3, 3, -3], scale: [1, 1.04, 1] }}`

**Problem:** 6+ components all use identical `y: [-N, N, -N]` levitation with infinite repeat. This is the hallmark of an LLM generating from a single mental template.

### 1.2 Samey `pulse-glow` on Everything
Six components use the `animate-pulse-glow` class simultaneously:
- `TopKPIGrid.tsx:104` — each KPI card dot
- `XPProgressBar.tsx:137` — ambient glow
- `StreakHeroCard.tsx:48` — background halo
- `ScheduleActivityCard.tsx:87` — live tracking dot
- `Navbar.tsx:185` — tracking pulse dot

**Problem:** Too many pulsing elements compete for attention. Users see a disco, not a dashboard.

### 1.3 Repetitive Card Structure
Every `BaseCard` follows the same skeleton: header bar (icon + title + subtitle + right link), then list body, then optional footer. This structural monotony appears in:
- `ScheduleActivityCard.tsx:52-161`
- `GoalsHabitsCard.tsx:18-143`
- `LearningProgressCard.tsx:29-139`
- `PerformanceOverviewChart.tsx:55-152`
- `RecentActivityFeed.tsx:46-111`

**Problem:** Cards are interchangeable by structure. No visual hierarchy distinguishes primary data (charts) from secondary (lists).

### 1.4 Icon-Only Variants Reused
The icon-bg classes (`icon-bg-accent`, `icon-bg-violet`, `icon-bg-amber`, etc.) are applied uniformly without semantic distinction. Every card header uses `p-2 rounded-xl` with one of these — a pattern so consistent it feels templated.

### 1.5 The "Doppelrand Double-Bezel" Over-Engineering
`StreamCard.tsx` and `TimelineStream.tsx` both use a nested double-border pattern:
- `StreamCard.tsx:18-21` — `p-2 rounded-[2.25rem]` outer + `rounded-[calc(2.25rem-0.5rem)]` inner
- `TimelineStream.tsx:136` — same pattern inline

**Problem:** This creates unnecessary DOM depth and the visual benefit is subtle. It adds visual noise on dense pages.

### 1.6 Over-Stuffed Page Headers
Every page header follows the identical pattern: sparkle badge + large h1 + description line. Compare:
- `dashboard/page.tsx` (through HeaderGreetingCard)
- `habits/page.tsx:64-91`
- `timeline/page.tsx:60-73`
- `settings/page.tsx:78-91`

All use `inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em]` — identical badge styling.

---

## 2. Per-Page Redesign Recommendations

### 2.1 Dashboard (`src/app/page.tsx`)

**Current problems:**
1. **Cluttered**: 9 card sections stacked vertically — greeting, KPI grid, gamification row (3 items), middle split (2 items), task input, bottom tier (3 items), insight card, level-up overlay = 9 distinct visual rows
2. **SkillOctagon overuse** (`page.tsx:43-46`): Takes 4/12 columns for a decorative visualization with low information density
3. **No spacing differentiation**: Every bento-grid uses `gap-6` — same gap between related and unrelated content groups
4. **LevelUpCelebration fires on every navigation** (see Section 5.2)

**Before:** 9 stacked rows, all same gap, gamification takes prime real estate
**After:** 5 distinct zones with progressive density

**Specific changes:**

| File:Line | Change |
|-----------|--------|
| `src/app/page.tsx:27` | Change `gap-6` to `gap-4` for tighter rhythm |
| `src/app/page.tsx:35-47` | **Remove SkillOctagon** — replace XPProgressBar spanning full width, DailyXPGoal beside it as a 2-col row (7+5 split). Move SkillOctagon to /habits page only |
| `src/app/page.tsx:35` | Add `mb-2` separator between KPI grid and gamification |
| `src/app/page.tsx:49-57` | Remove `bento-grid` wrapper, use `grid grid-cols-1 lg:grid-cols-12 gap-4` with tighter gap |
| `src/app/page.tsx:64-75` | Make GoalsHabitsCard 5 cols, StreakHeroCard 3 cols, PerformanceOverviewChart 4 cols (currently 4+3+5) — rebalance for content importance |
| `src/app/page.tsx:80` | Remove `LevelUpCelebration` — see Section 5.2 for fix |
| `src/components/dashboard/HeaderGreetingCard.tsx:36` | Replace generic `"Shodasha User"` with actual user name or remove entirely |
| `src/components/dashboard/HeaderGreetingCard.tsx:40` | Replace generic "Let's make today productive!" with data-driven message |

### 2.2 Habits (`src/app/habits/page.tsx`)

**Current problems:**
1. **SkillOctagon again** (`habits/page.tsx:126-136`): Takes another 4 columns on this page too
2. **XPProgressBar again** (`habits/page.tsx:143-145`): Duplicating XP from dashboard
3. **Too many stacked sections**: Stats → Analytics → Calendar → Octagon+XP+Category → Achievements → Heatmap = 6 sections, infinite scroll
4. **LevelUpCelebration fires again** (`habits/page.tsx:173`)
5. **Loading skeleton is massive** (`habits/page.tsx:47-60`): 10 skeleton blocks, worst-case empty state

**Before:** 6-section page with duplicated gamification
**After:** 4 concise sections with gamification collapsed into a sidebar

**Specific changes:**

| File:Line | Change |
|-----------|--------|
| `src/app/habits/page.tsx:126-146` | **Remove entire bento-grid row** with SkillOctagon + CategoryMetrics + XPProgressBar. Move XPProgressBar to sidebar on Dashboard only. Keep CategoryMetrics but merge it into the analytics section |
| `src/app/habits/page.tsx:94-102` | Make HabitStatsCard full width (12 cols), remove SkillOctagon entirely from this page |
| `src/app/habits/page.tsx:44` | Change `space-y-6` to `space-y-5` for tighter vertical rhythm |
| `src/app/habits/page.tsx:173` | Remove LevelUpCelebration (see 5.2) |
| `src/app/habits/page.tsx:68` | Shorten subtitle from "Track daily streaks..." to something more scannable |
| `src/app/habits/page.tsx:47-60` | Reduce to 4 skeleton blocks max (header + 2 medium + 1 large) |

### 2.3 Timeline (`src/app/timeline/page.tsx`)

**Current problems:**
1. **No overflow/hierarchy**: `TimelineStream.tsx:103` — timeline items use `space-y-4` with equal visual weight, no grouping by hour or category
2. **Double padding in cards**: `TimelineStream.tsx:136-137` — `p-1.5` outer + `p-5` inner = excessive padding eating horizontal space
3. **Doppelrand double-bezel**: `TimelineStream.tsx:136` — nested border pattern adds visual clutter
4. **Missing right padding**: `timeline/page.tsx:57` — `px-2 sm:px-4` is too narrow on small screens; content overflows

**Before:** Timeline items with double borders, equal spacing, overflow issues  
**After:** Grouped timeline with hour markers, flat cards, proper padding

**Specific changes:**

| File:Line | Change |
|-----------|--------|
| `src/components/timeline/TimelineStream.tsx:103` | Add hour-group headers (e.g., "Morning 9-12", "Afternoon 2-5") using `<h4>` separators |
| `src/components/timeline/TimelineStream.tsx:136-137` | **Remove double-bezel**: Replace nested `p-1.5 rounded-[2rem]` + `p-5` with a single flat card `p-4 rounded-xl border` — saves ~24px padding per card |
| `src/components/timeline/TimelineStream.tsx:122-133` | Reduce timeline dot from `size-4` to `size-3`, remove `ring-4` ring to reduce visual weight |
| `src/app/timeline/page.tsx:57` | Change `px-2 sm:px-4` to `px-4 sm:px-6 lg:px-8` |
| `src/app/timeline/page.tsx:142` | Change `gap-6` to `gap-4` |
| `src/components/timeline/TimelineStream.tsx:200` | Move duration/time to be inline with app name instead of separate right column on mobile |

### 2.4 Board (`src/app/board/page.tsx`)

**Current problems:**
1. **BaseCard hover distortion**: `page.tsx:62` — `card-hover-lift` on the history section causes card resize on hover
2. **History section expands awkwardly**: `page.tsx:85` — the completed tasks history accordion pushes content below
3. **No task count summary** visible before expanding history

**Before:** Accordion history with hover-lift distortion  
**After:** Compact history preview with inline month grid

**Specific changes:**

| File:Line | Change |
|-----------|--------|
| `src/app/board/page.tsx:62` | **Remove `card-hover-lift`** from the history BaseCard — accordion sections should not lift on hover |
| `src/app/board/page.tsx:63` | Remove `overflow-hidden` — it clips the content unnecessarily |
| `src/app/board/page.tsx:86-151` | Add a collapsed preview showing "Today: X completed" or this month's mini grid before expansion |
| `src/app/board/page.tsx:120-143` | Reduce day cell `py-2 px-1` to `py-1.5 px-0.5` for denser grid |
| `src/app/board/page.tsx:114` | Change `grid-cols-7 gap-1.5` to `gap-1` |

### 2.5 Settings (`src/app/settings/page.tsx`)

**Current problems:**
1. **Sidebar and content both have borders** (`settings/page.tsx:112,122`) — double borders create visual separation that feels heavy
2. **`shadow-xs` on both panels** — unnecessary shadows on a settings panel
3. **Mobile back button** (`settings/page.tsx:94-106`) uses `border` + `bg-[var(--card)]` which doesn't match the theme variable naming

**Before:** Double-bordered sidebar + content with shadows  
**After:** Unified panel with subtle separator only

**Specific changes:**

| File:Line | Change |
|-----------|--------|
| `src/app/settings/page.tsx:112` | Remove `border border-[var(--border)]` from sidebar — keep only `rounded-2xl p-3 bg-[var(--card)]` |
| `src/app/settings/page.tsx:112` | Remove `shadow-xs` |
| `src/app/settings/page.tsx:122` | Remove `border border-[var(--border)]` — add `border-l border-[var(--border-subtle)]` on the content panel instead |
| `src/app/settings/page.tsx:122` | Remove `shadow-xs` |
| `src/app/settings/page.tsx:77` | Match header pattern to other pages — currently uses `var(--foreground)` instead of `var(--text-primary)` |

### 2.6 Timer (`src/app/timer/page.tsx`)

Only 7 lines, delegates to `TimerPage` component. Need to inspect the TimerPage component for a complete audit, but key concerns:
- The page is minimal — no overflow issues visible at this level

---

## 3. Navigation Overhaul

### 3.1 Current Problems

**File: `src/components/layout/Navbar.tsx`**

1. **Per-tab background colors** (`Navbar.tsx:33-38`): Each nav item has a unique color (`bg-emerald-600`, `bg-teal-600`, `bg-violet-600`, `bg-amber-600`, `bg-blue-600`, `bg-stone-700`). When the GooeyTabs tab is active, the entire button morphs into these colors. Result: the nav bar looks like a rainbow, not a professional app.

2. **GooeyTabs filter is CPU-intensive** (`gooey-tabs.tsx:95-108`): SVG filters with `feGaussianBlur` + `feColorMatrix` applied to navigation elements force GPU composition on every tab interaction.

3. **Brand area is crowded** (`Navbar.tsx:119-132`): Logo + "SHODASHA" + "Time & Focus" subtitle takes significant space but the subtitle ("Time & Focus") adds no distinct value.

4. **Right-side pills are noisy** (`Navbar.tsx:162-179`): Level badge + streak badge + tracking status + search button + theme toggle + window controls = 6 elements fighting for attention.

### 3.2 Redesign Plan

**Phase 1 — Simplify Tab Colors**
Replace per-tab colors with a single accent color for all tabs:

| File:Line | Change |
|-----------|--------|
| `Navbar.tsx:33-38` | Change to: `{ label: 'Dashboard', href: '/', icon: LayoutDashboard },` — remove `color` field entirely |
| `Navbar.tsx:147` | Change `color={item.color}` to `color="bg-[var(--accent)]"` — use the app's accent color for all tabs |
| `gooey-tabs.tsx:310` | The `color` prop is passed as className; ensure it accepts theme variables |

**Phase 2 — Reduce Right-Side Noise**
| File:Line | Change |
|-----------|--------|
| `Navbar.tsx:162-169` | **Remove the levitating Level badge** — level is already visible on dashboard XP card |
| `Navbar.tsx:171-179` | **Remove the streak pill** — streak is visible in StreakHeroCard and StreakDisplay |
| `Navbar.tsx:181-197` | **Simplify tracking badge** — remove `Activity` icon, keep just the dot + "Tracker Active/Offline" text |
| `Navbar.tsx:199-206` | Keep command palette — it's genuinely useful |
| `Navbar.tsx:208-215` | Keep theme toggle — essential |
| `Navbar.tsx:217-245` | Keep window controls — required for Tauri |

**Phase 3 — Brand Simplification**
| File:Line | Change |
|-----------|--------|
| `Navbar.tsx:128-131` | Remove the "Time & Focus" subtitle. Keep just the logo + "SHODASHA" |

**After nav bar layout:**
```
[Logo SHODASHA]  [Dashboard] [Board] [Habits] [Timeline] [Timer] [Settings]  [🔍] [🌙] [_][□][×]
```

---

## 4. Card System Upgrade

### 4.1 BaseCard Padding Issues

**File: `src/components/ui/BaseCard.tsx`**

**Problem 1 — Double padding:** `BaseCard.tsx:82` renders `p-5` in the inner div, but many consumers pass `innerClassName="p-0"` to override it. This creates inconsistency — some cards pad via the inner div, others via the outer. The `p-5` default is wrong.

| File:Line | Change |
|-----------|--------|
| `BaseCard.tsx:82` | Change `div className={cn('flex flex-col gap-3 p-5', innerClassName)}` → remove `p-5` from all inner divs |
| `BaseCard.tsx:121` | Change `div className={cn('p-5', innerClassName)}` → remove default `p-5` |

**Fix consumers that relied on the default padding:**
| File:Line | Change |
|-----------|--------|
| `TopKPIGrid.tsx:100` | Add `p-5` to `innerClassName` |
| `ScheduleActivityCard.tsx:55` | Already has `p-5 sm:p-6` — fine |
| `GoalsHabitsCard.tsx:22` | Already has `p-5 sm:p-6` — fine |
| `LearningProgressCard.tsx:32` | Already has `p-5 sm:p-6` — fine |
| `PerformanceOverviewChart.tsx:58` | Already has `p-5 sm:p-6` — fine |

### 4.2 Card Hover Distortion

**File: `src/app/globals.css:463-478`**

**Problem:** `.card-hover-lift:hover` applies `translateY(-2px)` AND `box-shadow: var(--shadow-md)`. When cards contain interactive elements (buttons, links), the hover state distorts the layout, especially in grids where neighboring cards don't lift simultaneously.

| File:Line | Change |
|-----------|--------|
| `globals.css:470` | Change `transform: translateY(-2px)` to `transform: translateY(-1px)` — halve the lift distance |
| `globals.css:470` | Remove `box-shadow: var(--shadow-md)` — shadow change on hover creates perceived resize |

**Remove card-hover-lift from inappropriate contexts:**
| File:Line | Change |
|-----------|--------|
| `src/app/board/page.tsx:62` | Remove `card-hover-lift` from BaseCard (accordion history) |
| `src/components/dashboard/InsightCard.tsx:52` | Remove `card-hover-lift` — insight card should not lift |

### 4.3 StreamCard Refactor

**File: `src/components/ui/StreamCard.tsx`**

**Problem:** Double-bezel pattern uses excessive padding and DOM depth.

| File:Line | Change |
|-----------|--------|
| `StreamCard.tsx:18-21` | Replace entire component with single `border rounded-xl bg-surface p-4 shadow-sm` structure |
| `StreamCard.tsx:18` | Remove `rounded-[2.25rem]` — use standard `rounded-xl` |
| `StreamCard.tsx:21` | Remove nested div — flatten to single `div` |

**Before visual:**
```
┌─ rounded-[2.25rem] outer (p-2) ─────────────────┐
│ ┌─ rounded-[calc(2.25rem-0.5rem)] inner (p-6) ─┐ │
│ │ Content here                                 │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**After visual:**
```
┌─ rounded-xl border bg-surface p-4 shadow-sm ──────┐
│ Content here                                       │
└────────────────────────────────────────────────────┘
```

### 4.4 TimelineStream Card Refactor

**File: `src/components/timeline/TimelineStream.tsx:136-137`**

Same flattening pattern — inline double-bezel must be removed:

| File:Line | Change |
|-----------|--------|
| `TimelineStream.tsx:136` | Remove outer `p-1.5 rounded-[2rem] bg-stone-900/5...` div |
| `TimelineStream.tsx:137` | Change inner div to `rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-sm` |

---

## 5. Gamification Consolidation

### 5.1 SkillOctagon Overuse

**Current usage:** Rendered on both Dashboard (`page.tsx:43-46`) and Habits (`habits/page.tsx:126-136`).

**Problem:** The octagon is a "cool" visualization that gets repetitive fast. It consumes 4 columns (33% of page width) but shows abstract scores that users rarely check after the first time.

**Plan:**

| File:Line | Change |
|-----------|--------|
| `src/app/page.tsx:35-47` | **Remove SkillOctagon from Dashboard entirely.** Replace the gamification row with XPProgressBar (8 cols) + DailyXPGoal (4 cols) |
| `src/app/habits/page.tsx:126-136` | **Remove SkillOctagon from Habits page.** Remove the entire 4-column wrapper. |
| `src/components/gamification/SkillOctagon.tsx` | Keep the component file — it may be useful in a dedicated "Insights" section later, but remove from all current page layouts |

**Result:** SkillOctagon goes from 2 renderings to 0. It can be reintroduced later in a stats/insights view if needed.

### 5.2 LevelUpCelebration Fires on Every Navigation

**File: `src/components/gamification/LevelUpCelebration.tsx:23-32`**

**Root cause:** The `useEffect` checks `hasNewLevel = level > lastLevelUpNotified`. On every page mount, the component re-reads `level` and `lastLevelUpNotified` from the store. If `lastLevelUpNotified` was set to the previous level (not the current level), the condition `level > lastLevelUpNotified` is still true on the next page because `lastLevelUpNotified` was never updated to match `level`.

**Fix:**

| File:Line | Change |
|-----------|--------|
| `LevelUpCelebration.tsx:23-32` | Replace with: |
| | ```
  useEffect(() => {
    if (hasNewLevel && level > 1) {
      setDisplayLevel(level)
      setIsVisible(true)
      // Mark as notified immediately to prevent re-fire
      useGamificationStore.getState().markLevelNotified(level)
      timerRef.current = setTimeout(dismiss, 3000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [hasNewLevel, level, dismiss])
``` |

Also add to `gamificationStore.ts`:
| `gamificationStore.ts` | Add method: `markLevelNotified: (level: number) => set({ lastLevelUpNotified: level })` |

**Remove duplicate instances:**
| File:Line | Change |
|-----------|--------|
| `src/app/habits/page.tsx:173` | Remove `<LevelUpCelebration />` — it only needs to exist once in the root layout or dashboard |
| `src/app/page.tsx:81` | Keep only one instance — move it to the root `layout.tsx` so it fires regardless of page |

### 5.3 XPProgressBar Duplication

**Current:** Rendered on Dashboard (`page.tsx:37`) and Habits (`habits/page.tsx:143-145`).

**Plan:** Display XPProgressBar only on Dashboard (the primary landing page). Remove from Habits.

| File:Line | Change |
|-----------|--------|
| `src/app/habits/page.tsx:143-145` | Remove `<XPProgressBar />` — users don't need to see level progression twice |

---

## 6. Layout & Grid Fixes

### 6.1 Missing Right Padding on Small Screens

**File: `src/app/layout.tsx:45`**

**Current:** `px-6 py-8` — this is fine on the main layout.

**But page-level overrides cause issues:**
- `timeline/page.tsx:57` — `px-2 sm:px-4` cuts padding on mobile
- `settings/page.tsx:75` — `px-2 sm:px-4` same problem

**Fix:**

| File:Line | Change |
|-----------|--------|
| `src/app/timeline/page.tsx:57` | Change `px-2 sm:px-4` to `px-0` — let the layout's `px-6` handle it |
| `src/app/settings/page.tsx:75` | Change `px-2 sm:px-4` to `px-0` — same |

### 6.2 Dashboard Content Density

**Current:** 9 stacked sections with `gap-6` between each — too much whitespace.

**Fix:**

| File:Line | Change |
|-----------|--------|
| `src/app/page.tsx:27` | Change `gap-6` to `gap-5` |
| `src/components/dashboard/TopKPIGrid.tsx:92` | Change `gap-4` to `gap-3` |
| `src/app/page.tsx:49` | Change `gap: var(--space-lg)` (in bento-grid) to `gap: var(--space-md)` |

### 6.3 Bento Grid Responsive Collapse

**File: `src/app/globals.css:423-429`**

Current: On mobile (`max-width: 768px`), all bento grids collapse to single column.

**Problem:** This is correct but some content like TopKPIGrid (4 cards) becomes a very tall single-column stack.

**Fix:** No structural change needed — but ensure KPI cards are compact on mobile by reducing padding:

| File:Line | Change |
|-----------|--------|
| `TopKPIGrid.tsx:100` | Change `p-5` to `p-4` via responsive class |
| `TopKPIGrid.tsx:109` | Change `text-2xl` to `text-xl` on mobile |
| `TopKPIGrid.tsx:123` | Reduce icon padding on mobile |

### 6.4 Timeline Overflow

**File: `src/components/timeline/TimelineStream.tsx:103`**

Timeline items with long app names or window titles overflow on small screens.

**Fix:**

| File:Line | Change |
|-----------|--------|
| `TimelineStream.tsx:104-213` | Within each entry, ensure `min-w-0` and `truncate` classes are applied to text containers (already partially done at line 194) |
| `TimelineStream.tsx:200` | On mobile, move `border-t` divider to only show below 640px, not always |

---

## 7. Implementation Order

Execute in this sequence to avoid breaking functionality:

### Phase A — Safe Refactors (No visual change)
| Step | File | Change |
|------|------|--------|
| 1 | `LevelUpCelebration.tsx:23-32` | Fix re-fire bug — add `markLevelNotified` to store |
| 2 | `gamificationStore.ts` | Add `markLevelNotified` method |
| 3 | `timeline/page.tsx:57` | Fix padding — `px-2` → `px-0` |
| 4 | `settings/page.tsx:75` | Fix padding — `px-2` → `px-0` |

### Phase B — Remove Duplicate Gamification (Functional change, no breakage)
| Step | File | Change |
|------|------|--------|
| 5 | `habits/page.tsx:126-146` | Remove SkillOctagon row (3 components) |
| 6 | `habits/page.tsx:143-145` | Remove XPProgressBar |
| 7 | `habits/page.tsx:173` | Remove LevelUpCelebration |
| 8 | `dashboard/page.tsx:35-47` | Remove SkillOctagon, rebalance XPProgressBar + DailyXPGoal |
| 9 | `habits/page.tsx:94-102` | Make HabitStatsCard 12 cols full width |

### Phase C — Navigation Simplification
| Step | File | Change |
|------|------|--------|
| 10 | `Navbar.tsx:33-38` | Remove per-tab colors |
| 11 | `Navbar.tsx:147` | Use single accent color |
| 12 | `Navbar.tsx:162-169` | Remove levitating level badge |
| 13 | `Navbar.tsx:171-179` | Remove floating streak badge |
| 14 | `Navbar.tsx:128-131` | Remove "Time & Focus" subtitle |
| 15 | `Navbar.tsx:181-197` | Simplify tracking badge |

### Phase D — Card System Fixes
| Step | File | Change |
|------|------|--------|
| 16 | `BaseCard.tsx:82,121` | Remove default `p-5` from inner divs |
| 17 | `TopKPIGrid.tsx:100` | Add `p-5` to compensate |
| 18 | `globals.css:470` | Reduce card-lift to -1px, remove shadow change |
| 19 | `board/page.tsx:62` | Remove card-hover-lift from accordion |
| 20 | `InsightCard.tsx:52` | Remove card-hover-lift |
| 21 | `StreamCard.tsx` | Flatten double-bezel to single card |
| 22 | `TimelineStream.tsx:136-137` | Flatten double-bezel |

### Phase E — Layout Polish
| Step | File | Change |
|------|------|--------|
| 23 | `dashboard/page.tsx:27` | Reduce gap-6 to gap-5 |
| 24 | `TopKPIGrid.tsx:92` | Reduce gap-4 to gap-3 |
| 25 | `dashboard/page.tsx:49` | Reduce bento gap to var(--space-md) |
| 26 | `TimelineStream.tsx:103` | Add hour-group headers |
| 27 | `settings/page.tsx:112,122` | Remove double borders and shadows |
| 28 | `dashboard/page.tsx:49-57` | Restructure middle tier layout |

### Phase F — Verify
| Step | Command | Purpose |
|------|---------|---------|
| 29 | `npm run lint` | Check for lint errors |
| 30 | `npm run typecheck` | Verify TypeScript |
| 31 | `npm run build` | Ensure production build succeeds |
| 32 | Manual: navigate all pages | Visual regression check |

---

## Summary of Key Metrics

| Metric | Before | After |
|--------|--------|-------|
| Unique animation patterns | 3 (levitate, pulse-glow, card-lift) | 2 (card-lift only, reduced intensity) |
| SkillOctagon renderings | 2 (Dashboard + Habits) | 0 (moved to planned Insights page) |
| LevelUpCelebration instances | 2 (Dashboard + Habits) | 1 (root layout) |
| Nav tabs with distinct colors | 6 | 0 (single accent) |
| Right-side nav pills | 6 (level, streak, tracking, search, theme, window) | 4 (tracking, search, theme, window) |
| Card hover lift distance | -2px + shadow change | -1px, no shadow change |
| Double-bezel patterns | 2 (StreamCard, TimelineStream) | 0 (flattened) |
| Page sections (Dashboard) | 9 | 7 |
| Page sections (Habits) | 6 | 4 |
