# 🍎 Apple Design Audit — Shodasha Productivity

**Auditor:** Apple HIG lens — fluid physical motion, translucent materials, spatial consistency, typographic clarity, restraint.

---

## 1. Physical Motion Audit — Springs & Fluidity

### High-level observation

The app has a coherent motion language — it uses `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`) as the **default easing** (defined in `globals.css:88`). This is a *deceleration curve* (similar to `ease-out`). Apple uses **springs** (`kSpring` on iOS: stiffness + damping + mass) because springs are physically interruptible and feel alive. The app uses springs sparingly, and where it does, the damping/stiffness choices are often **too stiff**.

### Spring audit by file

| Location | Type | What's used | Apple HIG verdict |
|---|---|---|---|
| `TimelinePage.tsx:56` | Page enter | `type:'spring', bounce:0, duration:0.4` | ❌ `bounce:0` kills spring feel. This is a disguised ease curve |
| `BoardPage.tsx:55` | Page enter | `type:'spring', bounce:0, duration:0.4` | ❌ Same — not a spring, just a smooth ease |
| `SettingsPage.tsx:73` | Page enter | `type:'spring', bounce:0, duration:0.4` | ❌ Same pattern, three pages duplicated |
| `SkillOctagon.tsx:270` | Data polygon expand | `type:'spring', stiffness:80, damping:12, mass:1` | ✅ **Best spring in app**. Low stiffness = physically pliable. Mass:1 makes it fluid |
| `SkillOctagon.tsx:289` | Data dots | `type:'spring', stiffness:200, damping:15` | ⚠️ Stiffness 200 is firm — feels "snappy" not "pillowy". Apple would use ~150/13 |
| `LevelUpCelebration.tsx:83` | Trophy icon | `type:'spring', stiffness:200, damping:15` | ⚠️ Same — 200/15 is a stiff snap, not a celebration bounce |
| `AppearanceSettings.tsx:74` | Theme toggle pill | `type:'spring', bounce:0.15, duration:0.3` | ✅ `bounce:0.15` is good — subtle overshoot. **Best spring in settings** |
| `KanbanColumn.tsx:51` | Column reorder | CSS `cubic-bezier(0.25, 1, 0.5, 1)` | ❌ CSS custom easing. `@dnd-kit` with CSS means no interruptibility |
| `KanbanCard.tsx:42` | Card reorder | CSS `cubic-bezier(0.25, 1, 0.5, 1)` | ❌ Same — hammering CSS transitions. Drag feels mechanical |
| `XPProgressBar.tsx:200` | XP bar fill | `type:'spring', stiffness:120, damping:18` | ⚠️ Stiffness 120 / damping 18 = thick honey. Decent but could be springier |

### Page transitions

`PageTransition.tsx:25` uses `duration: 0.25, ease: [0.65, 0, 0.35, 1]` — a standard ease-in-out. No spring. Apple's UINavigationController push/pop uses a spring with mass ~1. No exit animation is defined for page transitions (AnimatePresence not wired at this level).

### Drag & Drop (`@dnd-kit`)

`KanbanBoard.tsx:49` uses `PointerSensor` with `activationConstraint: { distance: 3 }` — good (prevents accidental drags). But the `transition` on dragged items is **CSS-based** (`KanbanColumn.tsx:51`, `KanbanCard.tsx:42`). `@dnd-kit` uses `transform` + `transition` via CSS, not JS-driven springs. This means:
- Drag animations **cannot be interrupted mid-transition** (Apple: all drags must be interruptible)
- The default `0.4s` cubic-bezier is too slow for a drag feel — Apple's drag reorder uses ~0.2s spring
- No momentum/inertia on drop

**Verdict:** Motion is **80% "timed easing"**, only ~20% "spring". The app feels *smooth* but not *alive*. It passes a basic polish check but fails Apple's bar for physically responsive motion.

---

## 2. Spatial Consistency

### Strengths
- **4pt spacing scale** defined in `globals.css:72-80` (`--space-3xs: 0.125rem` to `--space-2xl: 3rem`)
- **12-column bento grid** system (`globals.css:408-410`) with consistent `gap: var(--space-lg)` = 24px
- `PageTransition` wrapper in `layout.tsx:46` ensures consistent page shell
- Cards consistently use `rounded-2xl` (16px) across the app — good visual rhythm
- Padding rhythm in `BaseCard.tsx:121` uses `p-5` (20px) consistently

### Issues

| Issue | Location | Details |
|---|---|---|
| **Inconsistent border radii** | `KanbanColumn.tsx:100` vs `SettingsPanel.tsx` (col: 16px) | Columns use `rounded-2xl` (16px) but some inner cards use `rounded-xl` (12px). Apple would use a single radius tier |
| **Mixed font spacing** | `Navbar.tsx:128` vs habit headings | Brand subtitle uses `tracking-widest` (0.2em) while badge labels use `tracking-wider` (0.1em) — both appear on the same header bar |
| **Nested card inception** | `TimelineStream.tsx:136-137` | Cards inside cards: outer `rounded-[2rem]` → inner `rounded-[calc(2rem-0.375rem)]`. This is architecturally clever but the triple-nested structure (outer padding → middle ring → inner surface) adds ~20px of unnecessary depth |
| **Grid collapse on mobile** | `globals.css:423-429` | Bento grid collapses to single column at 768px but no gap reduction — still 24px gap on a single column, which is spacious but wastes vertical space on small screens |
| **Aspect-ratio hack for SkillOctagon** | `habits/page.tsx:128` | `aspect-square` + `flex` centers the SVG but creates dead space; the card's padding is `p-6` but the SVG content only fills ~60% of the area |

### Verdict
Spatial foundation is **strong** (7/10). The 4pt scale, bento grid, and consistent border radii create a solid rhythm. Issues are in **edge cases** (nested cards, mobile gap). Apple would simplify the nesting and tighten the gap scale on mobile.

---

## 3. Translucency & Materials

### What exists

| Effect | Location | Quality |
|---|---|---|
| **Header backdrop blur** | `Navbar.tsx:115` — `bg-[var(--bg-surface)]/80 backdrop-blur-md` | ✅ Good. Sweet spot: 80% opacity + `blur-md` (12px). Apple-style frosted glass |
| **Modal backdrop** | `TaskModal.tsx:135` — `bg-black/50 backdrop-blur-xs` | ⚠️ `blur-xs` (4px) is barely perceptible. Apple's modal dimming uses ~8-12px blur |
| **Modal backdrop** | `AddHabitModal.tsx:90` — `bg-black/50 backdrop-blur-xs` | ⚠️ Same — blur is too subtle |
| **XP card glow** | `XPProgressBar.tsx:137` — `blur-3xl w-48 h-48 rounded-full` | ✅ Excellent — large radial blur creates ambient "halo" behind content |
| **Streak card color** | `StreakDisplay.tsx:111` — `card-color-amber` | Uses `linear-gradient` with low-opacity tint — effective Apple-style material tinting |
| **AchievementBadge gradient** | `AchievementBadge.tsx:98` | Uses `color-mix(in srgb, ...)` for dynamic tinting — smart pattern |
| **StreamCard doppelrand** | `StreamCard.tsx:18-21` | Double-bezel: outer translucent ring + inner surface. This is an Apple-inspired layered material approach |

### Issues

| Issue | Location |
|---|---|
| **No backdrop blur on sidebar panels** | Settings pages use solid `bg-[var(--card)]` — no translucency |
| **BaseCard has no glass variant** | `BaseCard.tsx` defines `flat/raised/elevated` but none use `backdrop-blur` |
| **Shadow tokens don't account for translucency** | `globals.css:105-107` shadows use `rgba(40,30,20,...)` — warm brown-black, good. But no "glow" shadow for elevated glass |
| **AchievementBadge shimmer** | `AchievementBadge.tsx:120-127` uses `rgba(255,255,255,0.18)` sweep — this is a metallic shimmer, not a glass effect. Apple rarely uses shimmer on glass |
| **Dark mode backdrop difference** | Dark mode `globals.css:125` `--bg-surface: #24211e` + `--bg-surface-hover: #332f2a`. The 15% brightness step is good. But dark mode has *no* backdrop blur on cards — they're fully opaque |

### Verdict
The app has **good bones** for translucent materials — the header and StreamCard show awareness of glass design. But translucency is not a **systematic material principle**. Apple builds every surface with a material-first approach (e.g., `.background(Material.ultraThin)`). Shodasha's cards are flat semi-opaque with borders — Apple would make them `backdrop-blur` with thinner borders.

---

## 4. Typography Clarity

### Font stack analysis
```
--font-ui: var(--font-geist), var(--font-inter), system-ui, -apple-system, sans-serif;
--font-display: var(--font-geist), var(--font-inter), 'Cabinet Grotesk', ...
--font-body: var(--font-inter), 'Inter', -apple-system, ...
--font-mono: var(--font-jetbrains), 'JetBrains Mono', monospace;
```
(`globals.css:66-69`)

**Good choices.** Geist + Inter + JetBrains Mono covers the Apple-esque spectrum without loading custom display fonts. Both `Geist` and `Inter` have excellent optical sizing at smaller text sizes.

### What Apple would approve

| Pattern | Location | Why it works |
|---|---|---|
| `tracking-tight` on display text | `habits/page.tsx:72` | Apple uses negative tracking on display sizes (below -0.02em) |
| `tracking-wider` on uppercase labels | `habits/page.tsx:75` | Apple uses ~0.08em on captions for readability |
| `font-display` on all headings | `globals.css:187-191` | Dedicated display family for headings — Apple principle |
| `font-mono` for numbers/data | `XPProgressBar.tsx:205` | Monospace for tabular data ensures alignment |
| `text-wrap: balance` | `globals.css:190` | Prevents orphaned words — rare in web apps, Apple would applaud |

### Issues

| Issue | Location | Apple would say |
|---|---|---|
| **14px body text minimum** | All `text-xs` labels are `0.75rem` (12px) | Apple's minimum readable text is 13px. 12px at `font-medium` (500 weight) is too light |
| **Inconsistent measure (line length)** | `globals.css:81` timeline description `max-w-2xl` | Some descriptions cap at `max-w-2xl` (672px), some don't. Apple's HIG recommends 45-75 characters per line |
| **`text-wrap: balance` on all headings** | `globals.css:190` | `balance` only works for 2-3 lines; longer headings get uneven wrapping. Apple uses `pretty` not `balance` |
| **Hardcoded color values in gamificationStore** | `gamificationStore.ts:37-45` | Tier colors are hex strings (#FF6B35, #FFD700, etc.) — these bypass the CSS variable system. If user changes accent color, tier badges won't respect it |
| **Uppercase tracking on too many elements** | Nearly every badge uses `uppercase tracking-wider` | Apple uses uppercase + tracking for **labels only**, not for content. The app over-uses this (badges, headers, sidebar menu) |
| **Line clamping without line-height** | `AchievementBadge.tsx:160` `line-clamp-2` | No explicit `leading-*` set — Apple would set `leading-tight` (1.25) on clamped text |
| **No `font-optical-sizing`** | Fonts are loaded with `display: swap` but optical sizing (`font-optical-sizing: auto`) is not set | Apple's SF has built-in optical sizing; Inter and Geist also support it via `opsz` axis |

### Verdict
Typography is **clean and well-considered** (7/10). The font stack, display/body distinction, and tracking usage are Apple-aware. Main issues: minimum text size is too small, over-use of uppercase tracking, and hardcoded colors in the gamification store bypass the design system.

---

## 5. Interaction Design

### Gestures & Feedback

| Interaction | Implementation | Apple HIG |
|---|---|---|
| **Drag to reorder (board)** | `@dnd-kit` PointerSensor (3px activation) | ⚠️ Good activation distance, but no spring on drop. Apple drags snap with a spring |
| **Drag column** | `KanbanColumn.tsx:114` — `cursor-grab` | ✅ Cursor changes. Drag overlay has `rotate-1` — nice Apple-like tilt hint |
| **Drag overlay** | `KanbanBoard.tsx:211-226` | ⚠️ Overlay has `rotate-2` + `shadow-2xl`. Apple would add `scale(1.02)` + tighter shadow |
| **Card hover** | `globals.css:469-478` — `translateY(-2px)` + shadow lift | ✅ Standard. `--ease-out` timing is correct |
| **Card active press** | `globals.css:475` — `scale(0.98)` | ⚠️ Scale is uniform (no z-axis depth). Apple uses `scale3d(0.97, 0.97, 1)` |
| **Button press** | `globals.css:222` — `scale(0.97)` | ✅ Good. Applied consistently across all interactive elements |
| **Theme toggle pill** | `AppearanceSettings.tsx:63-83` — spring layoutId | ✅ **Best interaction in app** — `layoutId="active-theme-bg"` + `spring(bounce:0.15)` creates a shared layout animation |
| **Quick task add** | `KanbanColumn.tsx:175-206` | ⚠️ Form appears instantly, no animation. Apple would use a spring height transition |
| **Confirm delete (board)** | `KanbanColumn.tsx:243-247` — fade + scale | ⚠️ Uses static ease `cubic-bezier(0.23,1,0.32,1)`, not spring |
| **Swipe to complete?** | Not implemented | ❌ Apple would expect swipe-to-complete on mobile habit cards |
| **Pull to refresh?** | Not implemented | ❌ Timeline has a refresh button (`timeline/page.tsx:120-128`) but no pull-to-refresh |

### Board-specific issues

**`KanbanBoard.tsx`** uses `closestCenter` collision detection — this causes cards to "jump" between columns at the column center threshold rather than at the column edge. Apple's drag-and-drop uses **edge-based** hit testing, not center-based. Change to `closestCorners` or `pointerWithin`.

**Drop animation** (`KanbanCard.tsx:42`, `KanbanColumn.tsx:51`): Both use `transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)`. This is **not interruptible** — if user drags a card while another is still animating to its new position, the animations queue up. Apple's fluid grid uses spring-based `LayoutAnimation` which can be interrupted at any point.

### Modal interactions

**`TaskModal.tsx`** and **`AddHabitModal.tsx`** both use `duration: 0.42, ease: [0.23, 1, 0.32, 1]` — a 420ms ease-out. Apple's modal sheets use an interactive spring gesture (drag down to dismiss with live rubber-banding). Neither modal supports gesture dismissal.

### Timer interaction

`TimerPage.tsx` (via `TimerPage` component) — the timer store (`timerStore.ts`) uses `setInterval` at 1000ms granularity. Apple's Clock app uses `CADisplayLink` (60fps) for smooth countdown animation. The 1-second tick would not create a smooth circular countdown animation.

### Verdict
Interactions are **functional and well-structured** (6/10) but lack Apple-level fluidity. Major gaps: no gesture dismissal on modals, CSS-based drag transitions (not springs), no swipeable list items, no pull-to-refresh. The theme toggle is the most Apple-like interaction in the app.

---

## 6. Reduced Motion

### Apple HIG: `prefers-reduced-motion: reduce`

This is the **strongest area** of the app. The codebase shows deep awareness:

1. **CSS-level guard** — `globals.css:303-346` comprehensively resets animation/transition durations to `0.01ms`, removes transforms on hover/press, and caps skeleton animations
2. **Framer Motion hook** — `useReducedMotion()` is used in **every** component that animates:
   - `habits/page.tsx:26`
   - `BoardPage.tsx:11`
   - `SettingsPage.tsx:21`
   - `LevelUpCelebration.tsx:9`
   - `SkillOctagon.tsx:165`
   - `XPProgressBar.tsx:109`
   - `AchievementBadge.tsx:55`
   - `StreakDisplay.tsx:33`
   - `TimelineStream.tsx:51`
   - `KanbanBoard.tsx` (not used — but drag is fine as it's utility-based)
3. **Conditional particles** — `LevelUpCelebration.tsx:119` — particle burst is gated behind `!shouldReduceMotion`
4. **Responsive animation disabling** — `XPProgressBar.tsx:163` skips infinite `y` animation; `LevelUpCelebration.tsx:52-66` reduces to opacity-only
5. **`motion-reduce:animate-none`** — `LoadingSkeleton.tsx:25` uses Tailwind's `motion-reduce:animate-none`

### One gap

`KanbanBoard.tsx` and the `@dnd-kit` drag system do not check `useReducedMotion()`. The drag overlay rotation (`rotate-2` in `KanbanBoard.tsx:222`) and column tilt (`rotate-1` at line 213) should be suppressed when reduced motion is preferred.

### Verdict
**10/10.** This is the best reduced-motion implementation I've seen in a web app. Every animation-capable component checks the preference, CSS resets are comprehensive, and edge cases (particles, levitation, pulsing) are all handled.

---

## 7. The "Spatial Consistency" Score

**Score: 7.5 / 10**

Breakdown:
- **Motion language** — 5/10 (mostly timed easing, few springs, CSS drag transitions)
- **Spatial rhythm** — 8/10 (4pt scale, strong bento grid, consistent padding)
- **Translucent materials** — 5/10 (good header glass, no systematic glass on cards)
- **Typography** — 8/10 (excellent font stack, over-use of uppercase)
- **Interaction design** — 6/10 (no gesture dismissal, CSS drags, good button feedback)
- **Reduced motion** — 10/10 (class-leading, comprehensive)
- **Visual polish** — 7/10 (good shadows, warm palette, consistent border radii, but hardcoded colors in store)

**Why not higher?** The app has a solid, well-thought-out foundation but doesn't yet *feel* Apple-like in its motion. The springs are too stiff or not springs at all. The drag-and-drop is the weakest link — CSS transitions instead of spring physics. Translucency isn't a first-class material principle.

---

## 8. Top Fixes for Fluid Feel

### P0 — Critical (Apple wouldn't ship without these)

1. **Make all page transitions spring-based** — Replace `type:'spring', bounce:0, duration:0.4` with `type:'spring', stiffness:180, damping:24, mass:0.8`. This applies to:
   - `timeline/page.tsx:56`
   - `board/page.tsx:55`
   - `settings/page.tsx:73`

2. **Replace CSS drag transitions with spring-based layout** — `KanbanColumn.tsx:51` and `KanbanCard.tsx:42` use `0.4s cubic-bezier(0.25,1,0.5,1)`. Change to `transform 0.25s cubic-bezier(0.23,1,0.32,1)` or better, wrap in `motion.div` with `layoutTransition={{ type:'spring', stiffness:400, damping:30 }}`.

3. **Add gesture dismissal to all modals** — `TaskModal.tsx:125-363` and `AddHabitModal.tsx:79-249` — implement drag-down-to-dismiss using `onDragEnd` with velocity-based spring snap-back (Apple sheet pattern).

4. **Fix `closestCenter` collision in KanbanBoard** — `KanbanBoard.tsx:190` — change to `collisionDetection={closestCorners}` for edge-based column drop zones.

### P1 — High impact

5. **Soften SkillOctagon spring** — `SkillOctagon.tsx:289` — change from `stiffness:200, damping:15` to `stiffness:150, damping:13`.

6. **Make LevelUpCelebration bounce** — `LevelUpCelebration.tsx:83` — change from `stiffness:200, damping:15` to `stiffness:250, damping:10, mass:0.7` for a celebratory overshoot.

7. **Add `layoutId` to kanban column transitions** — Use framer-motion's `<LayoutGroup>` and `layoutId` so columns animate position smoothly when reordered, instead of snapping.

8. **Backdrop blur on all elevated cards** — Add `bg-[var(--bg-surface)]/80 backdrop-blur-md` to the `card-elevated` class (`globals.css:528-533`).

### P2 — Polish

9. **Normalize text sizes** — Change all `text-xs` (12px) labels to `text-[13px]` for readability.

10. **Add `font-optical-sizing: auto`** — Set on `body` in `globals.css` for Inter/Geist variable font axis support.

11. **Derive tier colors from CSS variables** — Replace hardcoded hex colors in `gamificationStore.ts:37-45` with CSS custom property values read via `getComputedStyle`.

12. **Add reduced-motion guard to drag overlays** — `KanbanBoard.tsx:213,222` — suppress `rotate-1`/`rotate-2` when `shouldReduceMotion` is true.

13. **Swipe-to-complete on habit cards** — Add `onDragEnd` to `KanbanCard.tsx` that toggles `done` status on right-swipe past 50% threshold.

14. **Timer tick at 60fps** — Change `timerStore.ts:131` from `1000ms` interval to `requestAnimationFrame` loop for smooth second transitions.

15. **Reduce nested StreamCard depth** — `StreamCard.tsx:17-26` — collapse the double-bezel to a single `backdrop-blur` ring instead of two nested divs.

16. **Mobile bento gap reduction** — `globals.css:423-429` — add `gap: var(--space-md)` on mobile collapse (reduce from 24px to 16px).
