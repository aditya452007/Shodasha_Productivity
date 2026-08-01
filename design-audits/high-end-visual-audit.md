# High-End Visual Design Audit — Shodasha Productivity

**Auditor:** Awwwards-tier standards  
**Date:** 2026-07-29  
**Scope:** 40+ files across pages, components, stores, and styles

---

## Overall Impression

The app has strong design **bones**: a warm editorial palette, a real type system (Geist + Inter + JetBrains Mono), a 4pt spacing scale, and deliberate elevation tokens. The StreamCard doppelrand (double-bezel) pattern is a genuinely premium idea. But execution **frays at the edges** — inconsistent padding, misused radiuses, repetitive patterns, and state-management leaks undermine the quality.

---

## 1. Typography Wealth

### What's working
- `globals.css:66-69` — Three distinct font stacks (`--font-ui`, `--font-display`, `--font-body`, `--font-mono`) with Geist as the lead. This is correct and premium.
- `globals.css:187-191` — `h1-h6` correctly use `font-display` with `text-wrap: balance`.
- `layout.tsx:11-27` — Proper `next/font` loading with `display: swap`.
- Page headers generally use `font-display + font-extrabold + tracking-tight` (timeline page, settings page).

### What's broken
- **`HeaderGreetingCard.tsx:37`** — `font-bold` on the greeting heading. The page's primary heading should be `font-extrabold` or `font-black` for contrast against card content. `font-bold` is too soft for a hero-level element.
- **`BaseCard.tsx:33-34`** — Default title "No data" / "Something went wrong" use `text-sm font-bold`. These should be `font-semibold` at most — bold on an error/empty state fights the user emotionally.
- **`KanbanCard.tsx:149`** — Task title uses `font-semibold`. On a dense card with many badges, `font-semibold` blends. Should be `font-bold` to anchor the card.
- **`KanbanColumn.tsx:136`** — Column header uses `font-bold text-sm`. Column names are navigation-level elements; `font-semibold` is sufficient and more refined.
- **`StreakDisplay.tsx`** — If using `font-mono` numeric displays, ensure tabular figures (`font-variant-numeric: tabular-nums`) so numbers don't jitter. Not currently set in globals.css.
- **No `font-variant-numeric: tabular-nums`** anywhere for timer, XP, or stat numbers.

### Verdict
B+ for font choices. C for execution consistency. Headings and body weights wander.

---

## 2. Card & Surface Design

### What's working
- `globals.css:514-542` — Three explicit elevation tiers (`card-flat`, `card-raised`, `card-elevated`) with distinct bg, border, and shadow definitions. Excellent.
- `globals.css:463-510` — Card micro-interaction classes (`card-hover-lift`, `card-hover-glow`, `card-hover-border`) with `dur-micro`/`dur-short` timing. This is agency-level thinking.
- `BaseCard.tsx` — Clean abstraction wrapping loading/empty/error states + motion entry animation.
- `StreamCard.tsx` — The doppelrand (double-bezel) pattern (`rounded-[2.25rem]` outer + `rounded-[calc(2.25rem-0.5rem)]` inner) is a premium detail rarely seen outside boutique portfolios.

### What's broken
- **`globals.css:516-518`** — `card-flat` has no shadow but uses `border: 1px solid var(--border)`. The `--border` value (`#ded8cf`) is quite low-contrast on `--bg-surface` (`#faf8f4`). Flat cards feel washed out.
- **`kanbanColumn.tsx:100-106`** — Column card uses `bg-[var(--bg-base)]/80` with `border-[var(--border)]`. No elevation class. Inconsistent with BaseCard system.
- **TimelineStream.tsx** — The doppelrand pattern is hardcoded inline (`rounded-[2rem]`, `rounded-[calc(2rem-0.375rem)`) instead of using `StreamCard` component. Duplication risks drift.
- **`XPProgressBar.tsx:132`** — Uses `card-color-violet` which applies a purple gradient background. Purple gradients flag as generic/game-y. Should use a subtle warm-tone gradient keyed to the tier color.
- **`page.tsx:43`** — SkillOctagon wrapper uses `rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 shadow-xs`. Inline card styling instead of `<BaseCard>`. Misses hover-lift, consistent elevation.
- **`habits/page.tsx:128`** — Same inline card for SkillOctagon on habits page. Duplication.
- **Card hover resize** (known issue): `card-hover-lift` applies `translateY(-2px)` which grows the card's visual footprint. If the card contains `card-hover-border` children, the parent/child hover interaction creates a jarring resize cascade.

### Verdict
A- for the system design. B- for implementation consistency. Half the cards use BaseCard; half inline their own styling.

---

## 3. Color & Atmosphere

### What's working
- `globals.css:4-36` — The warm linen/cream palette (`--bg-base: #f4f1eb`, `--bg-surface: #faf8f4`) is a sophisticated, deliberate choice. No harsh `#ffffff`, no cold blue-greys. This is **expensive**.
- `globals.css:110-144` — Dark mode uses warm espresso/charcoal (`--bg-base: #171513`) instead of pitch black (`#000000`) or harsh dark grey. Also premium.
- `globals.css:6-16` — OKLCH color tokens for the semantic layer. Professional-grade color math.
- `globals.css:45-63` — Carefully named accent palette (blue, pink, rose, amber, emerald, violet, teal, orange, indigo) with muted variants. Complete and intentional.

### What's broken
- **`globals.css:30`** — `--accent: #059669` (emerald). Emerald is the default accent. Per `settingsStore.ts:7`, the accent can be emerald/violet/amber/rose. Violet and rose accents will fight with the warm linen base. Recommend testing all four against the warm bg.
- **`globals.css:638-681`** — Domain color cards (`card-color-ember`, `card-color-emerald`, etc.) use `linear-gradient(135deg, ...)`. The 135deg gradient is the most generic gradient angle in existence. If you must gradient, use a shallower angle (180deg top-to-bottom) or a very subtle radial.
- **`LevelUpCelebration.tsx:80`** — Tier colors come from `getTierColor()` which returns flat hex values (`#FF6B35`, `#8A2BE2`, etc.). These override the design system. Legend tier (#FF6B35 = orange) conflicts with the warm palette.
- **`AchievementBadge.tsx:97-99`** — Uses `color-mix(in srgb, ${catColor} 40%, transparent)` for border. `color-mix` with srgb gamut can produce muddy results. Pre-define these as CSS variables.
- **`GooeyTabs Navbar`** — Each nav tab has a different color (`bg-emerald-600`, `bg-teal-600`, `bg-violet-600`, `bg-amber-600`, `bg-blue-600`, `bg-stone-700`). Six different colors in one navigation bar is visually chaotic. The active tab should use a single accent color.

### Verdict
A- for palette design. C+ for application. The foundation is beautiful; the accent usage is sometimes undisciplined.

---

## 4. Micro-interactions

### What's working
- `globals.css:217-235` — Global interactive transitions (`transition: transform, background-color, border-color, box-shadow`) with `--dur-micro`/`--dur-short`. Correct.
- `globals.css:225-229` — `.btn-hover-lift:hover` with `translateY(-1px)`. Subtle, refined.
- `globals.css:302-346` — Comprehensive `prefers-reduced-motion` guard. Covers buttons, cards, tooltips, all transition utilities. This is agency-quality accessibility thinking.
- `globals.css:271-300` — `[data-tooltip]` with 800ms delay, smooth opacity/transform transition. Properly restrained.
- `KanbanCard.tsx:74-84` — `motion.div` layout with opacity/shadow transitions during drag. Smooth.

### What's broken
- **`LevelUpCelebration.tsx:23-32`** — Fires on **every navigation** when `hasNewLevel` is true AND `level > 1`. The check `level > 1` means it fires once on first load when `lastLevelUpNotified = 1` and `level = 1`. Actually wait — it only fires when `level > 1`. But `initializeGamification()` runs on every page mount (Dashboard, Habits pages). If `xp` is already loaded from DB, `level` will be > 1, and `lastLevelUpNotified` might still be 1 if not persisted. **The celebration modal fires on every page load until dismissed.** This is the known issue.
- **`LevelUpCelebration.tsx:119-139`** — Particle burst uses `Math.random()` inside `initial/animate` which **recalculates every render**. Particles jump to different positions on re-render. Use deterministic angles.
- **`EmptyState.tsx:43`** — CTA button uses `hover:bg-[var(--accent-hover)]` but no focus-visible ring customization. Falls through to the 2px `:focus-visible` outline. Fine, but a custom focus ring matching the accent color would be better.
- **`LoadingSkeleton.tsx:25`** — Uses `animate-pulse` (Tailwind's built-in). This is a 1.5s opacity pulse. A shimmer-sweep pattern would feel more premium (the infrastructure is already in `globals.css:563-571`).
- **`BaseCard.tsx:49-53`** — Animation defaults all cards to `opacity: 0, y: 12` entrance. 12px is too aggressive for a card grid; 4-8px would feel less "presentation slide" and more "native app".
- **`KanbanCard.tsx:100`** — `whileTap={{ scale: 0.9 }}` on the link button is too aggressive. `0.95` is the standard for press feedback.
- **`Navbar.tsx:120`** — Logo `transition-transform group-hover:scale-105` is nice but the logo area has no `:active` state. A subtle press would complete the interaction.

### Verdict
B+. The reduced-motion handling is world-class. The LevelUpCelebration bug and inconsistent press scales pull it down.

---

## 5. Spatial Rhythm

### What's working
- `globals.css:71-80` — `--space-3xs` through `--space-2xl` (4pt scale: 2, 4, 8, 12, 16, 24, 32, 48). Correct.
- `globals.css:403-405` — `bento-grid` uses `gap: var(--space-lg)` (24px). Good vertical/horizontal rhythm.

### What's broken
- **`globals.css:423-429`** — Mobile collapse sets all bento grids to `1fr`. But `gap` stays `24px` which is spacious on mobile. Should reduce to `16px` on small screens.
- **`layout.tsx:45`** — Main container uses `px-6` (24px horizontal padding). This is correct. But `py-8` top/bottom padding — on pages with `pb-12` (page.tsx) or `pb-16` (timeline page), the sum is 32-40px bottom padding. Inconsistent.
- **`timeline/page.tsx:57`** — Explicit `px-2 sm:px-4` override of the layout's `px-6`. The page now has different horizontal padding from every other page. Breaks spatial consistency.
- **`settings/page.tsx:75`** — Same `px-2 sm:px-4` override. Inconsistent.
- **Missing right padding in card grids** (known issue): The bento-grid columns span 12, but without `gap` on the container edges, the last column's content can bleed. The layout `px-6` should handle this, but individual page overrides break it.
- **`page.tsx:27`** — `gap-6` on the root flex-col. The bento grids inside also have `gap-6`. This creates 48px spacing between sections (24px grid gap + 24px grid gap between rows). Should be consistent: use `gap-6` on the outer and let inner grids inherit or use `gap-6` as well — currently it stacks `gap-6` outside + `gap-6` inside each bento row = 48px between rows. Intentional? If so, document.
- **`TimelineStream.tsx:103`** — Timeline entries use `pl-6 sm:pl-8 space-y-4`. The `space-y-4` (16px) is tight for timeline items with double-bezel cards. Should be `space-y-5` or `space-y-6`.
- **`StreamCard.tsx:21`** — Inner padding is `p-6`. With the outer `p-2` wrapper and the `rounded-[calc(2.25rem-0.5rem)]`, the visual padding is 26px (2px outer + 24px inner). Not round — should be 24px total (p-2 outer + p-5 inner) to align with the 8pt grid.

### Verdict
B. The 4pt scale is defined but frequently ignored. Padding overrides and inconsistent gaps erode the grid.

---

## 6. "Expensive" Checklist

| Detail | Status | Notes |
|--------|--------|-------|
| Focus rings use accent color | ✅ | `globals.css:232` |
| Custom scrollbars | ✅ | `globals.css:545-561` |
| Reduced-motion comprehensive | ✅ | `globals.css:302-346` |
| Font subset optimization | ✅ | `layout.tsx:12` — `subsets: ['latin']` |
| Card elevation tiers | ✅ | `globals.css:514-542` |
| OKLCH color tokens | ✅ | `globals.css:6-16` |
| Double-bezel stream cards | ✅ | `StreamCard.tsx` |
| Button press scale (transform) | ✅ | `globals.css:221-223` |
| **Number ticker animation** | ✅ | `XPProgressBar.tsx:12-28` |
| **Hover-lift on cards** | ✅ | `globals.css:463-478` |
| **`text-wrap: balance` on headings** | ✅ | `globals.css:190` |
| **Tooltip with delay** | ✅ | `globals.css:271-300` |
| **Legacy/expired task cleanup** | ✅ | `taskStore.ts:135-144` |
| **Missing focus-visible on custom buttons** | ❌ | Many `<button>` elements rely on global `:focus-visible` but custom checkbox/select elements don't get the ring |
| **No `tabular-nums` for timer/stats** | ❌ | Timer, XP, duration numbers will jitter |
| **SkillOctagon overuse (known)** | ❌ | Appears on Dashboard + Habits page + Habits page again in its own section |
| **Green/violet accent conflict** | ❌ | `--accent` is emerald but violet appears in cards, badges, nav tab |
| **No focus ring on KanbanCard** | ❌ | Cards are clickable but have no visible focus indicator |
| **Linear gradient at 135deg** | ❌ | `card-color-*` classes use the most generic gradient angle |
| **Purple gradients in card-color-violet** | ❌ | `XPProgressBar.tsx` uses violet gradient background — generic game aesthetic |
| **StreamCard padding not on 8pt grid** | ❌ | 26px inner = not a multiple of 4 |
| **Nav has 6 different colors** | ❌ | GooeyTabs tabs each have unique bg colors |
| **Inline card styling instead of BaseCard** | ❌ | Habits page + Dashboard page wrap SkillOctagon in hand-rolled card divs |
| **No `will-change` on animated elements** | ❌ | No `will-change: transform` on card-hover-lift or animating elements |

---

## 7. Top 10 Quick Wins

### 1. Fix LevelUpCelebration re-fire on navigation
**File:** `LevelUpCelebration.tsx:23-32`  
Add `dismiss()` call after timeout? Actually, the issue is that `initializeGamification()` runs on every page mount and re-sets `lastLevelUpNotified` to the old level. **Fix:** persist `lastLevelUpNotified` in localStorage/DB alongside `xp` and `level`.

### 2. Unify card padding to 8pt grid
**Files:** `StreamCard.tsx:21`, `BaseCard.tsx:121`, `TimelineStream.tsx`  
Change inner padding from `p-6` (24px) to `p-5` (20px) so StreamCard total padding = `2px + 20px = 22px` — or swap outer `p-2` to `p-1.5` (6px) + inner `p-5` (20px) = 26px. Better yet: outer `p-2` (8px) + inner `p-4` (16px) = 24px (exactly `--space-lg`).

### 3. Reduce nav GooeyTabs to single accent color
**File:** `Navbar.tsx:32-39`  
Replace all six `color` values with a single accent color (e.g., `bg-[var(--accent)]`) so the active tab matches the system accent, not a rainbow.

### 4. Add `font-variant-numeric: tabular-nums` to globals
**File:** `globals.css`  
Add `font-variant-numeric: tabular-nums;` to `--font-mono` usage or to number-displaying elements. Prevents the timer, XP counter, and stat numbers from jittering as they change.

### 5. Replace inline SkillOctagon wrappers with BaseCard
**Files:** `page.tsx:43-46`, `habits/page.tsx:128-136`  
Both wrap SkillOctagon in hand-rolled card divs. Replace with `<BaseCard elevation="raised" className="card-hover-lift">` for consistent elevation, animation, and hover states.

### 6. Fix timeline page padding override
**Files:** `timeline/page.tsx:57`, `settings/page.tsx:75`  
Remove `px-2 sm:px-4`. The layout already provides `px-6`. If you need narrower padding on wide screens, use a max-width constraint instead.

### 7. Strengthen card tag/chip styling
**Files:** `KanbanCard.tsx:170-225`, `TimelineStream.tsx:150-165`  
Tags use `rounded-md` with small padding. Change to `rounded-lg` and increase horizontal padding from `px-2` to `px-2.5` for better visual breathing.

### 8. Reduce card entrance animation displacement
**File:** `BaseCard.tsx:49`  
Change `y: 12` to `y: 6` for a more subtle, native-feeling entrance.

### 9. Fix empty state border contrast
**File:** `EmptyState.tsx:25`  
Dashed border uses `var(--border)` which is `#ded8cf` on light mode — too close to `var(--bg-surface)` (`#faf8f4`). Use `var(--border-strong)` for better empty-state visibility.

### 10. Add `will-change: transform` to hover-lift elements
**File:** `globals.css:463-478`  
Add `will-change: transform` to `.card-hover-lift`, `.transition-lift`, and other transform-animated elements. Prevents paint jitter on hover in Chrome/Safari.

---

## Summary

| Category | Grade | Key Issue |
|----------|-------|-----------|
| Typography Wealth | B+ | Good fonts, inconsistent weights |
| Card & Surface Design | B | Great system, inconsistent usage |
| Color & Atmosphere | B+ | Beautiful palette, undisciplined accents |
| Micro-interactions | B+ | Top-tier reduced-motion, buggy celebration |
| Spatial Rhythm | B | 4pt scale defined but not followed everywhere |
| "Expensive" Details | B | Many premium touches, some generic leftovers |
| **Overall** | **B+** | Foundation is strong; execution needs tightening |

**The app is one polish pass away from feeling genuinely premium.** The palette, the double-bezel cards, the reduced-motion handling, and the font system are all agency-quality decisions. The gaps are in consistency: inline vs. component cards, navigation color chaos, the LevelUp bug, and spatial drift between pages.
