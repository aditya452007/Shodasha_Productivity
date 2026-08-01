# Premium Design Audit — Shodasha Productivity App

**Audited**: 2026-07-29  
**Stack**: Tauri v2, Next.js App Router, Zustand, Framer Motion, Recharts, Lucide React, Tailwind CSS  
**Scope**: All pages, components, stores, design tokens, globals.css  

---

## 1. Color System Audit

### Strengths
- Warm editorial base (`#f4f1eb`) avoids harsh `#ffffff` — strong decision.
- Dark mode uses warm espresso/charcoal (`#171513`, `#24211e`) instead of pure black (`#000000`).
- Semantic tokens (`--accent`, `--error`, `--success`, `--border-subtle`) are consistent.
- CSS variables use OKLCH for algorithmic manipulation (`color-mix(in oklab, ...)`).
- Habit category colors (`--habit-health`, `--habit-learning`) have proper dark mode variants.

### Issues

**1.1. Broken token references in `settings/page.tsx`**
- `settings/page.tsx:84` uses `var(--foreground)` — not defined in globals.css. Should be `var(--text-primary)`.
- `settings/page.tsx:87` uses `var(--muted-foreground)` — not defined. Should be `var(--text-secondary)`.
- `settings/page.tsx:98,112,122` use `var(--card)` — not defined. Should be `var(--bg-surface)`.

**1.2. Accent variable override is fragile**
- `settingsStore.ts:96,150` sets `--accent` via JS on `document.documentElement`. This works but bypasses CSS variable architecture and isn't theme-aware — if set once, it won't update on theme switch without a re-render.

**1.3. `--color-*` vs `--token-*` duplication**
- globals.css defines both `--color-paper`, `--color-ink`, etc. AND `--bg-base`, `--text-primary`, etc. These are two parallel systems with overlapping semantics. Only `--bg-*`, `--text-*`, `--border-*`, `--accent-*` tokens are actually used in components. The OKLCH `--color-*` tokens are unused dead code.

**1.4. `--color-ink-secondary` used only in `color: var(--color-ink-secondary)`**
- Not referenced anywhere in components. Dead token.

**1.5. `--bg-primary`, `--bg-secondary`, `--bg-tertiary` semantics are unclear**
- `--bg-primary` (light: `#f4f1eb`, dark: `#171513`) is identical to `--bg-base`.  
- `--bg-secondary` (light: `#faf8f4`, dark: `#24211e`) is identical to `--bg-surface`.  
- `--bg-tertiary` (light: `#eae6df`, dark: `#332f2a`) is identical to `--bg-surface-hover`.  
- This is unnecessary duplication. Recommmend: alias `--bg-primary` → `--bg-base`, `--bg-secondary` → `--bg-surface`, `--bg-tertiary` → `--bg-surface-hover`.

**1.6. Contrast ratios — dark mode text**
- `--text-secondary` in dark mode: `#b8b0a5` on `--bg-base` `#171513` = ~6.8:1 (passes AA).
- `--text-muted` in dark mode: `#888075` on `--bg-base` `#171513` = ~4.9:1. Passes AA for large text only (18px+). Risks failing at small sizes (11px). Several components use `text-[11px]` with `text-[var(--text-muted)]`.

**1.7. `--accent-muted` in dark mode is too dark**
- Light: `#d1fae5` → dark: `#042f2e`. The dark `--accent-muted` has ~2.5:1 contrast against `--bg-surface` (`#24211e`), making accent background fills nearly invisible in dark mode.

**1.8. Playful accent palette is well done**
- 8 accent colors with paired muted variants, light AND dark mode. Exemplary.

### Recommendations
1. Fix settings page token references (`settings/page.tsx:84,87,98,112,122`).
2. Consolidate `--color-*` tokens or remove unused ones.
3. Review `--accent-muted` dark mode value for legibility.
4. Increase `--text-muted` contrast for small text accessibility (target 7:1).

---

## 2. Typography Audit

### Strengths
- Three fonts loaded with `display: swap`, CSS variables (`--font-inter`, `--font-jetbrains`, `--font-geist`).
- `--font-display`, `--font-body`, `--font-ui`, `--font-mono` tokens in globals.css.
- Headings use `font-display` with `tracking-tight` — good editorial feel.
- `text-wrap: balance` on headings — modern, well-supported.
- Typography scale is appropriate: `text-[10px]` through `text-4xl`.

### Issues

**2.1. Font loading overhead**
- **3 font families** loaded: Inter (Latin, 1 weight default), JetBrains Mono (Latin), Geist (Latin). Geist and Inter overlap in use (`--font-body` uses Inter, `--font-display` prefers Geist). At ~100-200 KB per font, this is heavy for a desktop app. Recommend: pick one UI/body font (Inter or Geist, not both).

**2.2. Inconsistent font usage on headings**
- `ScheduleActivityCard.tsx:64` uses `font-display` + `text-base font-bold`.
- `GoalsHabitsCard.tsx:31` same.
- `LearningProgressCard.tsx:41` same.
- But `KanbanColumn.tsx:138` omits `font-display` — just `text-sm font-bold`.
- `TrackingPreferences.tsx` (not audited in full but likely similar).

**2.3. Mono font overuse**
- `font-mono` is used for: progress percentages, timer numbers, status labels. Good.
- But also for: Ticker values that are durations (good), XP numbers, dates. Acceptable.
- Concern: `KanbanColumn.tsx:144` uses `font-mono text-[10px]` for column task counts — too small, hard to read, and mono is unnecessary here.

**2.4. Line length / measure**
- `InsightCard.tsx:63` uses `max-w-xs` (~320px) for the reflection paragraph — too narrow for comfortable reading. Aim for `max-w-md` or `max-w-lg`.
- `EmptyState.tsx:36` uses `max-w-xs` for description — tight but acceptable for empty states.

**2.5. No fluid type scale**
- All font sizes are fixed (`text-xs`, `text-sm`, `text-base`, etc. with no `clamp()`). On larger screens the type remains small. Consider `clamp()` for `text-2xl` through `text-4xl`.

### Recommendations
1. Drop one body font (prefer Geist over Inter for consistency with brand).
2. Add `font-display` to all heading instances consistently.
3. Limit `font-mono` to numeric data only.
4. Convert headline sizes to `clamp()` for responsive scaling.

---

## 3. Layout & Spacing Audit

### Strengths
- Custom bento grid system (`bento-grid`, `bento-grid-cols-12`, span utilities) — solid foundation.
- 4pt spacing scale (`--space-3xs` through `--space-2xl`).
- `max-w-7xl` container, `px-6`, `py-8` in layout.
- Mobile collapse for multi-column grids (`@media (max-width: 768px)`).
- Cards use consistent `gap-2.5`, `gap-3`, `gap-4` within.

### Issues

**3.1. No right padding between cards in grids**
- **Known issue confirmed**. The bento-grid `gap: var(--space-lg)` applies gap between items, but when the grid wraps or when items overflow, outer padding is only on the main container (`px-6` in layout).  
- **Affected**: `dashboard/page.tsx:65` 3-column grid. On edge-to-edge windows, cards touch the right edge.
- **Fix**: Add `p-1` or `mx-auto` with `overflow-hidden` to grid containers, or add `px-1` to column divs.

**3.2. Dashboard is cluttered — information density too high**
- **Known issue confirmed**. Dashboard shows: Header greeting + 4 KPI cards + XP bar + Daily XP Goal + SkillOctagon + Schedule + Learning ring + Quick Task Input + Goals + Streak Hero + Performance Chart + Insight card. That's **13 distinct content blocks** on one scroll.
- **Fix**: Implement progressive disclosure — collapse "Daily XP Goal" and "SkillOctagon" into the XP bar section. Reduce KPI cards from 4 to 2 (Focus Time + Habit Consistency). Move Insight card to a toast/ribbon.

**3.3. Timeline cards double padding**
- **Known issue confirmed**. `TimelineStream.tsx:136-137`: outer `p-1.5`, then inner section `p-5`, then content padding inside. Total padding stack: ~24px + 1.5px + 20px + border = excessive. Cards feel bloated.
- **Fix**: Reduce outer wrapper to `p-1`, inner section to `p-4`.

**3.4. Spacing inconsistency across pages**
- Dashboard: `gap-6`, `pb-12`.
- Habits: `space-y-6`, `pb-12`.
- Timeline: `space-y-6`, `pb-16`, `px-2 sm:px-4` — **different padding** from dashboard (which doesn't set `px-*` directly).
- Board: `space-y-6`, `pb-16` with no extra `px`.
- Settings: `space-y-6`, `pb-16`, `px-2 sm:px-4` — **different padding** again.
- **Fix**: Standardize padding to `px-4 md:px-6` across all page layouts.

**3.5. Bento grid on mobile collapses to single column**
- globals.css `@media (max-width: 768px)` sets `[class*="bento-col-span-"] { grid-column: 1 / -1; }`. This flattens all bento layouts — the 12-column sophistication is lost on mobile. Acceptable for MVP but consider tablet-friendly breakpoints.

**3.6. z-index management is incomplete**
- `--z-base` (1), `--z-raised` (10), `--z-dropdown` (100), etc. defined in globals.css but **not used in CSS files**. Components use Tailwind `z-10`, `z-50`, `z-[100]` instead. Internal inconsistency.

### Recommendations
1. Add right padding to grid children via `[class*="bento-col-span-"]` or grid container padding.
2. Reduce dashboard content density to max 8 blocks.
3. Fix TimelineStream card padding stack.
4. Standardize page padding: `px-4 md:px-6 pb-12 space-y-6`.
5. Use z-index tokens instead of raw values.

---

## 4. Component Quality Audit

Scored on: visual finish, edge states (loading/empty/error), hover/focus/active states, animation taste.

### 4.1. BaseCard (`components/ui/BaseCard.tsx`) — ⭐⭐⭐⭐⭐
- Excellent: elevates loading/empty/error to first-class props.
- Animation defaults with `--ease-out` cubic bezier.
- Elevation tiers (`flat`, `raised`, `elevated`) map to CSS classes.
- **Minor**: `p-5` inner padding is always applied — components that pass `innerClassName="p-0"` to override work around this.

### 4.2. ErrorBanner (`components/ui/ErrorBanner.tsx`) — ⭐⭐⭐⭐⭐
- Proper `role="alert"`, clear error/retry pattern, responsive sizing. No notes.

### 4.3. EmptyState (`components/ui/EmptyState.tsx`) — ⭐⭐⭐⭐
- Clean icon + title + description + CTA.  
- **Minor**: `border-dashed` style looks intentional but `bg-[var(--bg-surface)]/50` is subtle to the point of invisibility on the base background.

### 4.4. LoadingSkeleton (`components/ui/LoadingSkeleton.tsx`) — ⭐⭐⭐⭐
- `motion-reduce:animate-none` respected, configurable dimensions.
- **Minor**: Uses `bg-[var(--border)]/60` — `--border` is `#ded8cf` in light mode, which gives a very subtle skeleton. The `/60` opacity makes it barely visible. Consider a dedicated skeleton token or use `--bg-tertiary`.

### 4.5. KanbanCard (`components/board/KanbanCard.tsx`) — ⭐⭐⭐⭐⭐
- Polished: drag states, hover border lift, `CheckCircle2` animation on done, linked URL button, tags, expiry status, subtask indicator, logged time.  
- Hover states, active scales, `whileTap`.  
- **Exceptional**: duration-select inline in column, confirm-delete modal with animation.

### 4.6. KanbanColumn (`components/board/KanbanColumn.tsx`) — ⭐⭐⭐⭐
- Inline renaming, quick-add form, drag handle, delete confirmation modal (proper `fixed` overlay with backdrop).
- **Issue**: The delete confirmation modal at line 241 uses `z-50` but doesn't consistently trap focus or handle `Escape` key. The `confirmDelete` state does not have an `onKeyDown` escape handler.

### 4.7. LevelUpCelebration (`components/gamification/LevelUpCelebration.tsx`) — ⭐⭐⭐
- **Known Issue: fires on every navigation** — The `useEffect` at line 23 depends on `hasNewLevel` which becomes true every time `initializeGamification()` is called (because `lastLevelUpNotified` lags behind `level`). The store's `awardXP` sets `lastLevelUpNotified` to the OLD level value, so on re-initialization the gap reappears.
- Good particle burst animation, `prefers-reduced-motion` respected.
- `tierColor` derived from function — nice touch.
- **Fix**: The `initializeGamification` should sync `lastLevelUpNotified` with `level` when initializing persisted state.

### 4.8. SkillOctagon (`components/gamification/SkillOctagon.tsx`) — ⭐⭐⭐⭐
- Real-time SVG radar chart, spring-animated polygon, axis labels, dot markers.  
- **Known Issue: overused** — Appears on Dashboard AND Habits page. This is a secondary visualization; showing it twice dilutes its impact.  
- Loading/error/empty states all handled.  
- The "empty" dashed polygon is a nice touch.  
- **Issue**: `computeAxesScores()` calls `useGamificationStore?.getState()` with optional chaining — if the import fails, this silently returns `[]` and `undefined`, potentially breaking the radar.

### 4.9. XPProgressBar (`components/gamification/XPProgressBar.tsx`) — ⭐⭐⭐⭐⭐
- Extremely polished: ambient glow, floating medal icon, NumberTicker, spring bar animation, tier-dependent theming.  
- 7-level tier system (Bronze through Legend) with distinct color schemes.  
- Loading state with skeleton.  
- **Minor**: The `animate-pulse-glow` on the ambient halo runs forever without `motion-reduce` guard. Add `motion-reduce:animate-none`.

### 4.10. AchievementBadge (`components/gamification/AchievementBadge.tsx`) — ⭐⭐⭐⭐⭐
- Shimmer sweep on unlock, "NEW" badge, tier labels, lock/unlock icons, category color system, progress bars.  
- All edge states covered.  
- **Exemplary**: `grid-template-columns: 1fr sm:2 lg:4` responsive layout for badge grid.

### 4.11. LivingFlameIcon (`components/gamification/LivingFlameIcon.tsx`) — ⭐⭐⭐⭐⭐
- SVG path morphing animation, dual-gradient fill, floating spark particle, intensity levels.  
- `prefers-reduced-motion` fully gated.  
- This is the kind of micro-interaction that makes a premium feel.

### 4.12. StreakDisplay (`components/gamification/StreakDisplay.tsx`) — ⭐⭐⭐⭐
- Milestone system with progress bars, freeze shields, multiplier boost logic.
- Loading/error handled, memoized streak calculation.
- **Issue**: Streak computation runs on every render — the `useMemo` depends on `habits` and `records` (objects), which are new references every store update. Memoization is effectively wasted. The computation itself is also O(n*m) per render (n=habits, m=days).

### 4.13. DailyXPGoal (`components/gamification/DailyXPGoal.tsx`) — ⭐⭐⭐
- Clean donut ring, animated arc, status labels.
- **Issue**: `dailyGoal` prop defaults to 100 but this is never passed from the parent — the default is always used. Without customization, this component always shows "start your day" / progress toward an arbitrary 100 XP.

### 4.14. TopKPIGrid (`components/dashboard/TopKPIGrid.tsx`) — ⭐⭐⭐⭐⭐
- Excellent KPI cards with colored backgrounds, animated number tickers, semantic icons.
- 4-column responsive grid.
- **Issue**: `NumberTicker value={card.numericVal}` for percentage values — the ticker animates from previous value to new value. But `focusScore` and `habitRate` are computed every render, causing the ticker to flash on every parent re-render.

### 4.15. PerformanceOverviewChart (`components/dashboard/PerformanceOverviewChart.tsx`) — ⭐⭐⭐⭐
- Recharts AreaChart with gradient, custom tooltip, range selector.
- **Issue**: `13-day` default range (the code says 14 but uses `daysToGenerate - 1` as `new Date().getDate() - i` starting from 13). The select labels say "14 Days" and "7 Days" but the behavior generates fewer data points than the label suggests.

### 4.16. StreakHeroCard (`components/dashboard/StreakHeroCard.tsx`) — ⭐⭐⭐⭐
- Gradient background, levitating flame icon, `useMemo` streak calculation.
- **Issue**: The same streak calculation appears in `StreakDisplay.tsx` and `Navbar.tsx` — duplicated logic. Extract to a shared utility.

### 4.17. InsightCard (`components/dashboard/InsightCard.tsx`) — ⭐⭐⭐
- Conditional insight text, loading/error states.
- **Issue**: The insight logic is trivial (if-else with 4 branches). For a "premium" app, insights should be data-driven, personalized, and possibly ML-generated. The current version is essentially a motivational message with placeholders.

### 4.18. QuickTaskInput (`components/dashboard/QuickTaskInput.tsx`) — ⭐⭐⭐⭐
- `focus-within:ring-1` for focus state, submit loading spinner.  
- Clean form pattern.

### 4.19. ScheduleActivityCard (`components/dashboard/ScheduleActivityCard.tsx`) — ⭐⭐⭐⭐
- Live active tracking banner, animated schedule items, status toggle buttons.
- Empty state with CTA.
- **Issue**: "View All" links to `/board` — good. But the schedule items don't show the actual due time from the task model; they fall back to `createdAt`.

### 4.20. StreamCard (`components/ui/StreamCard.tsx`) — ⭐⭐⭐
- Double-bezel container with `ring-1` and `[inset_0_1px_1px_...]` inset shadow.
- **Issue**: Hardcoded `bg-stone-900/5` and `dark:bg-white/5` instead of using CSS variables. This is a theming anti-pattern — if the user changes the accent or theme, these won't adapt.

### 4.21. Navbar (`components/layout/Navbar.tsx`) — ⭐⭐⭐
- **Known Issue: "Navigation looks ugly"** confirmed. The `GooeyTabs` navigation component is a third-party compound component with `color` props like `'bg-emerald-600 hover:bg-emerald-700'`. The gooey filter SVG (`feGaussianBlur`, `feColorMatrix`) is heavy and the tab items use `mx-4` for selected state spacing that causes layout shifts.  
- The navbar is 250+ lines long, mixing brand, navigation, window controls, streak display, tracking status, theme toggle, and command palette trigger.  
- The right-side pills (Level, Streak, Tracker) float independently with their own `animate` loops — they don't coordinate animation timing, creating visual noise.  
- **Fix**: Simplify — reduce to logo + nav tabs + theme toggle + command palette. Move gamification badges to dashboard. Use CSS-only indicator for active tab instead of SVG filter.

### 4.22. PageTransition (`components/ui/PageTransition.tsx`) — ⭐⭐⭐
- Simple fade transition on route change.
- **Issue**: Only implements `opacity` fade, no `y` transform. The individual pages re-implement their own entry animations (e.g., `motion.div initial={{ opacity: 0, y: 12 }}`), causing double animation on page load.

### 4.23. TimelineStream (`components/timeline/TimelineStream.tsx`) — ⭐⭐⭐⭐
- Chronological timeline with dots, inline task linking, category badges, duration formatting.
- Loading/error/empty states all handled.
- **Issue**: The doppelrand double-bezel card pattern (line 136-137) consumes visual weight without adding information. Combined with the known double-padding issue, these cards dominate the stream without hierarchy.

### 4.24. NumberTicker (`components/ui/NumberTicker.tsx`) — ⭐⭐⭐⭐
- Custom `requestAnimationFrame`-based ticker with cubic bezier easing. No external dependency.
- Reduced-motion gated.
- **Issue**: Re-renders on every value change with `requestAnimationFrame` — can cause layout thrashing if many tickers are on screen (the TopKPIGrid has 4).

---

## 5. Dark Mode Audit

### Coverage
- globals.css has complete `.dark` overrides for all color tokens, accent palette, border shadows.
- Habit category colors have proper dark mode variants (brighter for contrast).
- All components using CSS variables (`var(--bg-surface)`, etc.) inherit dark mode automatically.
- `prefers-reduced-motion` is gated.

### Issues

**5.1. `--accent-muted` dark mode is too subtle**
- `dark --accent-muted: #042f2e` on `dark --bg-surface: #24211e`. Difference is ~2.5 it, essentially invisible.  
- Affects: accent background fills, the "accent-muted" badge background in Navbar, ScheduleActivityCard's active tracking banner.

**5.2. `--shadow-*` dark mode is very heavy**
- `--shadow-md` in dark: `0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.25)`. The base shadow at 0.4 opacity on a dark surface creates a deep black aura that feels oppressive. Recommend reducing to 0.25/0.15.

**5.3. Card background blending**
- `card-flat` uses `bg-surface` + `border` — in dark mode, `--bg-surface` is `#24211e` and `--border` is `#38332c`. Cards and background (`--bg-base: #171513`) blend into each other. The contrast ratio between surface and border is only ~1.3:1.

**5.4. img/logo in dark mode**
- `Navbar.tsx:122` uses `<img src="/logo.png">` without dark mode fallback. If the logo is a light-mode asset, it's invisible in dark mode.

**5.5. Gradient color card borders not dark-adapted**
- `.card-color-ember` border: `rgba(249, 115, 22, 0.25)` in light mode, `rgba(249, 115, 22, 0.35)` in dark. The dark version only increases opacity 10%, but the dark `--bg-base` makes the border appear much brighter. This is inconsistent — some cards (emerald, indigo) have this issue.

**5.6. Missing dark mode select styles for custom components**
- The globals.css `select` and `select option` rules at lines 194-214 have `!important` — fragile pattern. Custom select elements (like the inline duration picker in `KanbanColumn.tsx:189`) use `bg-transparent` and manually set colors, which may not respect the dark mode overrides.

### Recommendations
1. Lighten `--accent-muted` dark to `#064e3b` (from #042f2e).
2. Reduce dark shadow opacities by ~30%.
3. Add 1px `--border-subtle` interior border to cards in dark mode for definition.
4. Support dark mode logo via `<picture>` element.

---

## 6. Top Priority Fixes (Ranked)

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| P0 | **Fix LevelUpCelebration spamming navigation** — sync `lastLevelUpNotified` with `level` in `initializeGamification` | High (annoyance) | Small (2 lines) |
| P0 | **Fix settings page broken token references** — replace `--foreground`, `--muted-foreground`, `--card` in `settings/page.tsx` | Critical (invisible text in dark mode) | Small (5 lines) |
| P1 | **Reduce dashboard clutter** — collapse XP Goal + SkillOctagon into XP bar, reduce KPI cards to 2, move Insight to toast | High (information overload) | Medium |
| P1 | **Fix Timeline card double padding / overflow** — condense padding stack from 3 layers to 2, fix horizontal overflow | High (visual noise) | Small |
| P1 | **Fix card hover resize** — all `card-hover-lift` classes use `transform` without `translateZ(0)` or adjusting for the 2px lift. Cards with `h-full` in bento grids resize siblings. Add `margin-bottom: -2px` compensation. | High (layout shift) | Small |
| P1 | **Fix right padding between grid cards** — add `p-1` or `overflow-hidden` to bento-grid containers | High (edge clipping) | Small |
| P2 | **Simplify Navbar** — remove live streaks/level/tracking pills; move to dashboard | Medium (visual noise) | Medium |
| P2 | **Deduplicate streak calculation** — extract `computeStreak()` utility, use in StreakDisplay, StreakHeroCard, Navbar, SkillOctagon | Medium (code quality) | Small |
| P2 | **Drop one body font** — remove Inter or Geist to reduce bundle | Medium (performance) | Small |
| P2 | **Add dark mode logo** — `<picture>` element with light/dark assets | Medium (brand consistency) | Small |
| P2 | **Fix SkillOctagon overuse** — remove from Dashboard page, keep only on Habits | Medium (redundancy) | Small |
| P3 | **Standardize page padding** — unify `px-*`, `pb-*` across all 6 pages | Low (consistency) | Small |
| P3 | **Convert OKLCH `--color-*` tokens** — either use them or remove dead code | Low (cleanup) | Small |
| P3 | **Replace `!important` select styles** with CSS variable approach | Low (maintainability) | Small |
| P3 | **Consolidate `--bg-primary/secondary/tertiary`** into aliases | Low (readability) | Small |
| P3 | **Implement real data-driven insights** for InsightCard | Medium (product depth) | Large |
| P4 | **Add Escape key handler to KanbanColumn confirm delete modal** | Low (accessibility) | Small |
| P4 | **Add `motion-reduce:animate-none` to XPProgressBar pulse glow** | Low (accessibility) | Small |
| P4 | **Remove `font-mono` from KanbanColumn task counter** | Low (readability) | Small |

## Summary

The app has a **strong design foundation** — warm color system, custom bento grid, thoughtful animation tokens, proper reduced-motion support, and several genuinely premium components (AchievementBadge, LivingFlameIcon, XPProgressBar, KanbanCard, TopKPIGrid).

The main issues are **consistency** (different page padding, duplicate bg tokens, broken var references in settings), **over-engineering** (too many dashboard blocks, SkillOctagon on two pages, 3 fonts loaded), and **runtime glitches** (LevelUpCelebration spamming, card hover layout shifts, Timeline overflow).

Fix the P0s immediately. The remaining items are polish that would elevate this from "functional productivity app" to a genuinely premium desktop experience.
