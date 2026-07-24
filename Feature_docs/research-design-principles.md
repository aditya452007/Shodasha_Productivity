# Shodasha Design Principles — Synthesis from All Installed Skills

> Derived from 10+ design skills: Impeccable (Operate mode), Apple Design, Emil Kowalski, High-End Visual Design, Design Taste (Anti-Slop), Minimalist UI, Industrial Brutalist, Hallmark (58-gate slop test), and their reference systems.

---

## Table of Contents

1. [Synthesis Overview](#1-synthesis-overview)
2. [Shodasha's Design Mode — Operate](#2-shodashas-design-mode--operate)
3. [Typography](#3-typography)
4. [Color](#4-color)
5. [Spacing & Layout](#5-spacing--layout)
6. [Animation & Motion](#6-animation--motion)
7. [Navigation & Information Architecture](#7-navigation--information-architecture)
8. [KPI & Data Visualization](#8-kpi--data-visualization)
9. [Micro-interactions & Feedback](#9-micro-interactions--feedback)
10. [Accessibility, Dark Mode & Reduced Motion](#10-accessibility-dark-mode--reduced-motion)
11. [Anti-Patterns — Hard Bans](#11-anti-patterns--hard-bans)
12. [Consensus Matrix — Overlaps Across Skills](#12-consensus-matrix)
13. [Resolved Contradictions](#13-resolved-contradictions)

---

## 1. Synthesis Overview

### Core Philosophy

Shodasha is a **productivity desktop app** (time tracking, habits, board/timeline views). According to Impeccable's mode system, this is an **Operate** surface — the user completes tasks. Scanability, consistency, native expectations, and the real usage scene outrank expression. Brand lives in precise details.

Every skill agrees on these foundational points:
- **Familiarity is a feature.** The tool should disappear into the task.
- **Unseen details compound.** A thousand barely-audible voices singing in tune.
- **Beauty is leverage.** Good defaults differentiate; taste is trained, not innate.
- **Restraint > spectacle.** Cut motion, color, and decoration before adding.
- **Consistency is trust.** Same affordance, same behavior, same place.

### Which Skills Win for Shodasha

| Priority | Skill | Why |
|----------|-------|-----|
| **1** | Impeccable — Operate mode + craft-floor | This is Shodasha's exact category. Operate mode speaks directly to dashboards, tools, settings. |
| **2** | Apple Design | Fluidity, interruptibility, translucency, spatial consistency. Sets the quality bar for feel. |
| **3** | Hallmark — motion + anti-patterns | 58-gate slop test, microinteraction recipes, the anti-pattern canon. |
| **4** | Emil Kowalski | Animation decision framework, button press, origin-aware popovers, unseen details. |
| **5** | Design Taste (Anti-Slop) | Color calibration, serif discipline, three-dial system, layout diversification. |
| **6** | Minimalist UI | Warm monochrome palette, editorial whitespace, muted pastels for semantic accents. |
| **7** | High-End Visual Design | Double-bezel technique for cards, nested CTAs, spatial rhythm. Use sparingly (it targets Persuade mode). |
| **8** | Industrial Brutalist | Not for Shodasha's main UI. Inspirational only for data-dense side panels or telemetry-style habit stats. |

---

## 2. Shodasha's Design Mode — Operate

### The Operate Mandate (from Impeccable)

When design serves the product — app UIs, dashboards, settings, tools — the mode is **Operate**:

- **The tool disappears into the task.** Users are in flow. Don't make them wait for choreography.
- **Familiarity is often a feature.** Category-fluent users should trust the interface immediately.
- **Product UI's failure mode is strangeness without purpose:** over-decorated buttons, mismatched controls, gratuitous motion, display fonts where labels should be.

### Product Permissions (what Operate allows that Persuade doesn't)

- System fonts and familiar sans defaults ✓
- Standard navigation: top bar + side nav, breadcrumbs, tabs, command palettes ✓
- Density: tables with many rows, panels with many labels ✓
- Consistency over surprise: same vocabulary screen to screen ✓

### Product Constraints (what Operate forbids)

- Decorative motion that doesn't convey state ✗
- Inconsistent component vocabulary (button looks different in two places) ✗
- Display fonts in UI labels, buttons, data ✗
- Reinventing standard affordances (custom scrollbars, weird form controls) ✗
- Heavy color or full-saturation accents on inactive states ✗
- Modal as first thought (exhaust inline/progressive alternatives first) ✗

### Visual Authority (from Impeccable's craft-floor)

The brief wins. For Shodasha, the brief is: a productivity tool where users track time, manage tasks (board), build habits, and view progress over timelines. Every design decision serves those tasks.

---

## 3. Typography

### Consensus (overlap across ALL skills)

| Principle | Agreement |
|-----------|-----------|
| Body measure 65–75ch | Impeccable + Hallmark + Apple |
| Display max ≤ 6rem (96px) | Impeccable + Hallmark + Design Taste |
| Tracking tightens at large sizes (-0.02 to -0.04em) | Apple + Hallmark + Emil |
| Line-height: tight on display (1.05–1.2), generous on body (1.5–1.65) | Apple + Hallmark + Minimalist |
| Tabular numbers for data (`font-variant-numeric: tabular-nums`) | Hallmark + Apple |
| One family is often right for product UI | Impeccable Operate (explicit) |
| No gradient text | Impeccable craft-floor + Hallmark anti-patterns |
| No Inter as default (use Geist, Satoshi, Cabinet Grotesk, or system-ui) | Design Taste + Hallmark + High-End + Minimalist |
| No serif in product UI (serif = editorial, not dashboards) | Design Taste + Hallmark + Industrial |
| No font-size below 14px for body, below 10px anywhere | Hallmark + Apple |
| No italic headers (headers are roman; italic = body emphasis only) | Hallmark (universal rule across all genres) |

### Shodasha's Typography Rules

#### Font Stack

```
:root {
  --font-ui:     "Geist", system-ui, -apple-system, sans-serif;
  --font-mono:   "Geist Mono", "SF Mono", "JetBrains Mono", monospace;
}
```

- **Single family for UI.** Operate mode doesn't need display/body pairing. Geist covers headings, buttons, labels, body, and data. This is the consensus across Impeccable Operate + Apple + Design Taste.
- **Monospace only for code, time data, measurements.** Never as a costume for "technical."

#### Scale

- Fixed rem scale, not fluid (Impeccable Operate: product users view at consistent DPI; clamp-sized headings don't serve product UI).
- Ratio: 1.125–1.2 between steps (tighter for product UI; Impeccable Operate).
- Max 5 sizes on a single page.

```
--text-xs:   0.75rem  (12px)   — metadata, captions
--text-sm:   0.875rem (14px)   — labels, secondary
--text-base: 1rem     (16px)   — body, buttons
--text-md:   1.25rem  (20px)   — subtitles, section headings
--text-lg:   1.5rem   (24px)   — page titles, KPI hero numbers
--text-xl:   2rem     (32px)   — dashboard headlines (rare)
```

#### Implementation Rules

1. **Body: 16px minimum.** 14px only for secondary/dense data.
2. **Measure: 65–75ch for prose.** Tables can run denser (120ch+ fine).
3. **Weights: Body 400, headings 600–700.** Contrast of at least 200 units.
4. **Tabular numbers on all data displays.** `font-variant-numeric: tabular-nums;`.
5. **Letter-spacing: -0.01em on headings, 0 on body.**
6. **No all-caps body. No justified text.** 
7. **Labels: sentence case.** Never all-caps for UI labels (exception: status badges).
8. **Tracking (letter-spacing) is size-specific.** Not one value for all sizes.

---

## 4. Color

### Consensus (overlap)

| Principle | Agreement |
|-----------|-----------|
| No pure `#000` or `#fff` (tint with chroma) | Hallmark + Design Taste + Minimalist + High-End + Industrial |
| One accent color, max two | Hallmark + Design Taste + Impeccable + High-End |
| Accent occupies ≤ 3-5% of any viewport | Hallmark (3%) + Impeccable |
| Tint the greys toward anchor hue | Hallmark + Design Taste |
| State-rich semantic vocabulary | Impeccable Operate + Hallmark + Apple |
| No purple-to-cyan gradients (the AI default) | Hallmark + Design Taste + High-End |
| No glassmorphism as decoration | Impeccable craft-floor + Hallmark anti-patterns |
| Dark mode: no pure black, no pure white | Hallmark + Design Taste + Apple |

### Shodasha's Color Palette

Shodasha is a productivity app — the use scene is desktop, often dark mode (code-adjacent audience). We pick dark or light from the use scene, not category.

#### Light Mode (Default)

```
--color-paper:         oklch(97% 0.008 80)     /* off-white, warm */
--color-paper-elevated: oklch(100% 0 0)          /* white for cards */
--color-rule:          oklch(88% 0.008 80)     /* hairline borders */
--color-neutral:       oklch(55% 0.008 80)     /* secondary text */
--color-muted:         oklch(45% 0.008 70)     /* tertiary text */
--color-ink:           oklch(18% 0.01 60)      /* primary text */
--color-accent:        oklch(55% 0.19 250)     /* blue — for actions & active states */
--color-success:       oklch(50% 0.15 150)     /* green — habits, completion */
--color-warning:       oklch(55% 0.15 80)      /* amber — thresholds */
--color-error:         oklch(50% 0.18 30)      /* red — errors */
```

#### Dark Mode

```
--color-paper:         oklch(14% 0.008 40)
--color-paper-elevated: oklch(18% 0.01 40)
--color-rule:          oklch(28% 0.008 40)
--color-neutral:       oklch(55% 0.008 40)
--color-muted:         oklch(70% 0.006 40)
--color-ink:           oklch(94% 0.006 80)
--color-accent:        oklch(65% 0.19 250)
```

#### Color Rules

1. **Accent is a highlighter, not a color block.** Active nav item, focus ring, link underline, CTA border/text. Never as background fill covering > 5%.
2. **Semantic colors are reserved.** Green = habits/completed. Red = errors/overdue. Amber = warnings/thresholds. Use consistently across all surfaces.
3. **No colored surfaces for inactive states.** Only active/selected elements carry the accent.
4. **State vocabulary:** hover, focus, active, disabled, selected, loading, error, warning, success, info. Standardize across all components.
5. **Neutral layer for sidebars/panels.** A second neutral (slightly cooler) for secondary surfaces.
6. **An accent color for primary actions, current selection, state indicators only.** Not decoration.

---

## 5. Spacing & Layout

### Consensus (overlap)

| Principle | Agreement |
|-----------|-----------|
| CSS Grid for page layout, Flexbox for component internals | Hallmark + Design Taste + Emil |
| 4pt or 8pt spacing scale | Hallmark + High-End + Apple |
| Tight groups, generous separation | Impeccable craft-floor + Apple |
| More space above a heading than below | Impeccable craft-floor |
| No identical cards/card-in-card | Impeccable craft-floor + Hallmark anti-patterns |
| No 3-column equal feature grids | Hallmark + Design Taste + High-End |
| Asymmetry reads as intentional | Hallmark + Design Taste |

### Shodasha's Spacing Scale (4pt base)

```
--space-3xs: 0.125rem  ( 2px)  — focus rings, tight borders
--space-2xs: 0.25rem   ( 4px)  — tight icon spacing
--space-xs:  0.5rem    ( 8px)  — tight group internal
--space-sm:  0.75rem   (12px)  — component internal
--space-md:  1rem      (16px)  — default gap between elements
--space-lg:  1.5rem    (24px)  — between sections within a panel
--space-xl:  2rem      (32px)  — major section breaks
--space-2xl: 3rem      (48px)  — page-level padding
```

### Layout Rules

1. **Use `gap` for sibling spacing.** Never margin for lists of siblings.
2. **Cards only when elevation communicates real hierarchy.** Otherwise group with `border-t` or negative space.
3. **No cards-in-cards.** Pick one containment layer.
4. **Bento-style grids for dashboard/timeline.** Asymmetric tile sizes break monotony.
5. **Density is expected.** Users of productivity apps want information dense, not airy. This is not a marketing page.
6. **Standard navigation patterns:** top bar + side nav, tabs, command palette. Don't reinvent.
7. **Responsive = structural (collapse sidebar, responsive table, breakpoint columns),** not fluid typography.
8. **Z-index has six named levels.** No freestyle numbers.

```
--z-base:     1
--z-raised:   10
--z-dropdown: 100
--z-sticky:   200
--z-modal:    400
--z-toast:    500
--z-tooltip:  600
```

---

## 6. Animation & Motion

### Consensus (overlap)

| Principle | Agreement |
|-----------|-----------|
| Animate only `transform` and `opacity` | ALL skills (Impeccable, Apple, Emil, Hallmark, Design Taste, High-End, Minimalist) |
| Custom cubic-bezier easings, not browser defaults | Emil + Hallmark + High-End + Apple |
| No `ease-in` for UI animations (starts slow, feels sluggish) | Emil (explicit) + Hallmark |
| Duration: 150–250ms for most UI (product apps) | Impeccable Operate + Emil + Hallmark + Apple |
| Springs for physical gestures; ease for UI state | Apple + Emil + Hallmark |
| No bounce/elastic on UI elements | Hallmark + Emil (keep subtle) |
| No orchestrated page-load sequences (product flow) | Impeccable Operate + Hallmark |
| Reduced motion: opacity crossfade, no spatial | ALL skills |
| Interruptibility is the single most important principle | Apple + Emil |

### Shodasha's Motion Rules

#### Easter Table (adopted from Emil + Hallmark)

```
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1)     /* entering — Emil variant */
--ease-in:     cubic-bezier(0.7, 0, 0.84, 0)      /* leaving */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)     /* state toggles */
```

#### Duration Table

| Element | Duration | Easing |
|---------|----------|--------|
| Button press feedback | 100–160ms | ease-out |
| Tooltips, small popovers | 125–200ms | ease-out |
| Dropdowns, selects | 150–250ms | ease-out |
| Modals, drawers | 200–500ms | ease-out |
| Tab content crossfade | 250ms | ease-in-out |
| Complex multi-property | 400–500ms | ease-out |
| Exit transitions | 60–75% of enter | ease-in |

#### Rules

1. **Never animate keyboard-initiated actions.** They're repeated hundreds of times daily.
2. **Motion conveys state, not decoration.** State change, feedback, loading, reveal.
3. **No orchestrated page-load sequences.** Product loads into a task.
4. **Button: `transform: scale(0.97)` on `:active`.** Instant feedback. Must feel responsive.
5. **Never animate from `scale(0)`.** Start from `scale(0.95)` + `opacity: 0`.
6. **Popovers: origin-aware `transform-origin`.** Scale from trigger, not center. Modals are exempt (stay centered).
7. **Use CSS transitions, not keyframes, for interruptible UI.** Keyframes restart from zero on interruption; transitions retarget smoothly.
8. **Springs for physical interactions only:** drag release, swipe dismiss, momentum-based gestures. Use critically damped (damping 1.0) by default; reserve bounce (damping ~0.8) for momentum-driven moments.
9. **One authored motion moment per page/feature.** Not scattered effects.
10. **Exponential ease-out from an already-visible default.**

---

## 7. Navigation & Information Architecture

### Consensus (overlap)

| Principle | Agreement |
|-----------|-----------|
| Standard patterns: top bar + side nav, tabs, command palette | Impeccable Operate + Apple |
| Page/tab labels are specific, not vague | Apple (direct labels) |
| Wayfinding: every screen answers Where am I? Where can I go? | Apple |
| Proximity implies relationship | Apple |
| Hamburger/condensed nav for mobile | Design Taste + Hallmark |
| Nav height ≤ 80px | Design Taste |

### Shodasha's Navigation Architecture

#### Tab Structure (from CONTEXT.md)

- `/` — Dashboard (KPI overview)
- `/board` — Board (task management)
- `/habits` — Habits (tracking)
- `/timeline` — Timeline (progress)
- `/settings` — Settings

#### Rules

1. **Top tab bar + side panel** pattern. Tabs for primary destinations; side panel for contextual actions.
2. **Labels are specific:** "Dashboard", "Board", "Habits", "Timeline", "Settings". Not "Home", "Tools", "Progress".
3. **Sidebar for navigation within a section.** E.g., board views, habit categories.
4. **Bottom sheet or drawer for mobile collapse.**
5. **Command palette (⌘K)** for power users. Raycast-style: no animation on open/close, instant.
6. **Breadcrumbs for deep navigation.** `< Board / Sprint 24 / Task detail`
7. **Navigation renders on one line.** Never wraps at desktop.
8. **Active state: accent color indicator.** Underline or left border.

---

## 8. KPI & Data Visualization

### What the Skills Say

**Industrial Brutalist** — Most relevant for data-dense views. Pros: tabular data, monospace numbers, tight tracking. Cons: the aesthetic is too extreme for Shodasha; adopt only structural lessons (mono numbers, compartmentalized zones, 1px borders between data groups).

**Apple Design** — No specific chart rules, but the principles apply: translucency for hierarchy, spatial consistency, direct manipulation.

**Impeccable Operate** — Data tables at 120ch+ are fine. Dense information when users need it. Density is a permission, not a bug.

**Hallmark** — Tabular numbers on any data display. No fake-precise numbers. No filled background tracks on progress bars.

**Design Taste** — Progress bars without filled background tracks. Number tick microinteraction.

**Minimalist UI** — Muted pastels for status badges (green/red/yellow at desaturated values).

### Shodasha's KPI Rules

1. **Tabular numbers on all metrics.** `font-variant-numeric: tabular-nums;`
2. **Monospace for time data.** Hours tracked, duration, timestamps.
3. **Progress bars: minimal.** Thin (2–4px height), no background track, accent fill only. Or use numeric display instead.
4. **Charts: prefer compact over decorative.** Sparklines for trends (Impeccable warns about sparklines-as-decoration, but for a productivity app they serve a function — use them, don't over-style them).
5. **Status badges: pill-shaped, muted pastels** (Minimalist palette: pale green for done, pale red for overdue, pale yellow for warning).
6. **Data density is expected.** Productivity users scan. Group with hairline borders, not cards.
7. **KPI "hero numbers"** on dashboard: use `text-xl` or `text-lg`, bold, with `tabular-nums`. Small label underneath.
8. **No decorative charts.** Every chart answers a question the user asked.
9. **Number tick animation** on data update: 400ms ease-out count-up. Reduced motion: skip.
10. **No 3D charts, no gradients in chart fills.** Flat colors, semantic hues.

---

## 9. Micro-interactions & Feedback

### Consensus (overlap)

| Principle | Agreement |
|-----------|-----------|
| Silent success — no toast for visible outcomes | Emil + Hallmark + Apple |
| Optimistic update + Undo > confirmation dialog | Hallmark + Emil |
| Button press: scale(0.97) on `:active` | Emil + Apple + Hallmark + Design Taste |
| Focus rings appear instantly (never animate in) | Hallmark + Emil |
| Tooltip: 800ms delay on hover, 0ms on focus | Hallmark + Emil |
| Keyboard first, hover second | Hallmark + Apple |
| Feedback on pointer-down, not on release | Apple |

### Shodasha's Micro-interaction Rules

#### Buttons

- `:hover` — background shift or `translateY(-1px)`
- `:active` — `transform: scale(0.97)`, 100–160ms ease-out
- `:focus-visible` — 2px accent ring, 3px offset, instant (no animation)
- Loading — skeleton matching button dimensions
- Disabled — opacity 0.4, no hover effects

#### Forms

- Labels above inputs (Design Taste: never placeholder-as-label)
- Focus: border color change + subtle background tint, 200ms ease-out (before user types — Stripe pattern)
- Error: inline below input, red tint on border, icon, message (what broke + why + fix)
- Validate on blur after first touch, then on each keystroke

#### Toasts

- Stack at viewport corner (fixed positioning)
- Never shift page layout
- 400ms slide-in ease-out, 4–6s dwell, 300ms slide-out ease-in
- Pause on hover/focus
- Only for failures, async actions, or invisible effects
- Silent success is the default

#### Lists & Data

- Optimistic update + Undo toast for destructive actions
- Stagger reveal (50–80ms delay between items) for list entry animations
- Hover: background tint on rows, not card lift
- Empty states: teach the interface, not "nothing here"

#### Rules Summary

1. **Feedback lives on the press, not the release.**
2. **Every hover affordance has a focus state.**
3. **Keyboard-initiated actions don't animate.**
4. **Error messages: name the problem + the recovery.**
5. **Controls name their action.** "Delete project" not "Submit".
6. **Overlays escape their container.** Use `<dialog>`, popover API, or portal.
7. **Modals are last resort.** Exhaust inline/progressive alternatives first.
8. **Skeleton states for loading, not spinners.**

---

## 10. Accessibility, Dark Mode & Reduced Motion

### Consensus (overlap) — Universal Agreement on ALL of these

| Principle | Every single skill |
|-----------|-------------------|
| `prefers-reduced-motion: reduce` | Mandatory — collapse spatial motion to opacity crossfade |
| `prefers-color-scheme: dark` | Support both modes from the start |
| WCAG AA contrast (4.5:1 body, 3:1 large text) | Minimum across all skills |
| `:focus-visible` on all interactive elements | Universal |
| No hover-only affordances | Universal |
| Keyboard equivalents for every interaction | Universal |

### Shodasha's Accessibility Implementation

#### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 150ms !important;
    transition-duration: 150ms !important;
    animation-iteration-count: 1 !important;
  }
  /* Keep functional motion (progress bars) running */
  .progress-bar { animation-duration: inherit; }
  /* Replace slides/springs with opacity crossfade */
  .modal, .drawer, .tooltip { transform: none !important; }
}
```

#### Dark Mode

- Respect `prefers-color-scheme`. Add manual toggle in settings.
- No pure `#000` or `#fff` in either mode.
- Body font-weight: reduce by 50 in dark mode (400 → 350) for optical weight compensation.
- Accent: reduce chroma 0.02-0.04 in dark mode, increase lightness 5-10%.
- Higher surfaces = lighter in dark mode (+3% lightness per level).
- Never switch hue between modes. Only lightness and chroma move.

#### General

- Hit targets ≥ 44×44 CSS px on touch surfaces.
- No reliance on color alone for state. Pair with icon or text.
- No flashing above 3 Hz.
- `aria-live="polite"` on async updates (not `assertive` unless safety-critical).
- Test with vision-deficiency emulator before shipping.

---

## 11. Anti-Patterns — Hard Bans

These are patterns every skill flags as AI-generated slop. None of these in Shodasha.

### Typography Bans
- Inter, Roboto, Open Sans, Arial as defaults
- Serif in UI labels, buttons, or data
- Gradient text (`background-clip: text`)
- Italic headers
- All-caps paragraphs
- Font-size below 14px for body
- More than 3 font families on a page

### Color Bans
- Pure `#000000` or `#ffffff`
- Purple-to-cyan gradients
- Accent as background fill > 5% of viewport
- Grey text on colored background
- Red-green as only signal (add icon/pattern)
- Neon/outer glows
- Multiple accent colors

### Motion Bans
- `ease` (browser default)
- `linear` on anything except progress bars
- Bounce/elastic on UI elements
- Animating `width`, `height`, `top`, `left`, `margin`, `padding`
- `transition: all`
- Parallax
- Custom cursors
- Infinite loops other than functional loaders
- Cursor followers
- Auto-rotating carousels without controls
- `will-change` set preemptively across whole classes

### Layout Bans
- Card-in-card nesting
- 3-column equal feature grid
- Center-aligned everything
- Same-size cards of icon+heading+text as page structure
- Section numbers (01/02/03) unless sequence carries information
- Eyebrow over every section
- Glass and blur as decoration
- Sparklines as decoration
- Monospace as costume for "technical"

### Content Bans
- "Jane Doe", "Acme Corp", "Lorem Ipsum"
- Fake-precise numbers (92%, 4.1×, 50k)
- Em-dash (`—`) as design element
- AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- Div-based fake screenshots
- Hover-only affordances
- Animate-on-scroll on everything

---

## 12. Consensus Matrix

### What EVERY single skill agrees on (non-negotiable for Shodasha)

| Rule | # of Skills |
|------|-------------|
| Animate only transform + opacity | 10/10 |
| Support `prefers-reduced-motion` | 10/10 |
| Support dark mode via `prefers-color-scheme` | 10/10 |
| No pure `#000` or `#fff` | 9/10 |
| Button press feedback (`scale` on `:active`) | 8/10 |
| Custom cubic-bezier easings (not browser defaults) | 8/10 |
| WCAG AA contrast minimum | 8/10 |
| No bounce/elastic on UI elements | 7/10 |
| Single accent color, used sparingly | 7/10 |
| 4pt or 8pt spacing scale | 7/10 |
| Body measure 65–75ch | 6/10 |
| Focus-visible on all interactive | 6/10 |
| `transition: all` is banned | 6/10 |
| No gradient text | 6/10 |
| No Inter as default font | 6/10 |

### What MAJORITY agrees on (strongly recommended)

| Rule | # of Skills |
|------|-------------|
| Tabular numbers for data | 5/10 |
| No italic headers | 5/10 (Hallmark + Design Taste + Emil + High-End + Industrial) |
| Optimistic update + Undo > confirmation dialogs | 5/10 |
| Silent success (no toast for visible outcomes) | 5/10 |
| CSS Grid for layout, Flexbox for components | 5/10 |
| No card-in-card | 5/10 |
| Duration 150–250ms for product UI | 5/10 |
| Asymmetry > symmetry | 5/10 |
| Responsive: structural collapse, not fluid type | 4/10 |

---

## 13. Resolved Contradictions

### Contradiction 1: Glassmorphism

- **High-End Visual Design** says: use Ethereal Glass (heavy `backdrop-blur`, deep OLED black, radial mesh gradients).
- **Impeccable craft-floor** says: "Glass and blur as decoration" is a refuse category.
- **Hallmark** says: glassmorphism without purpose is an anti-pattern.
- **Minimalist** says: "NO 3D glassmorphism (beyond subtle navbar blurs)".
- **Resolution:** Shodasha is Operate mode, not Persuade. **No glassmorphism as decoration.** The single exception: a subtle `backdrop-filter: blur(12px)` on a sticky top bar, which serves a functional purpose (content scrolls under chrome). This aligns with Apple's approach — translucent chrome for nav/toolbars, not decorative glass panels.

### Contradiction 2: Animation Volume

- **Impeccable Operate** says: "No orchestrated page-load sequences."
- **Hallmark** says default-on archetypes get motion; default-off archetypes don't.
- **High-End** says: "Elements never appear statically on load" — scroll entry on everything.
- **Resolution:** Shodasha is a productivity app. **One orchestrated entrance per section (the board, the habit grid), then stillness.** Never animate-on-scroll for everything. This aligns with Impeccable Operate + Hallmark.

### Contradiction 3: Font Pairing

- **Impeccable Operate** says: "One family is often right" for product UI.
- **Hallmark** says: "A page is a pairing, not a single font" — display + body minimum.
- **Design Taste** says: serif is discouraged as default.
- **Resolution:** **Single family for Shodasha's UI.** Geist covers headings, body, labels, data. This is the Operate mode consensus. The display/body pairing rule targets Persuade/Read surfaces. For Shodasha, the wordmark can be distinct (e.g., Fraunces for "Shodasha" in the sidebar) but UI content is one family.

### Contradiction 4: Card Architecture

- **High-End Visual Design** says: Double-bezel architecture (outer shell with padding + inner core) for cards.
- **Hallmark** says: Card-in-card is an anti-pattern.
- **Impeccable craft-floor** says: "Cards are the lazy container; nested cards are always wrong."
- **Resolution:** **No nested cards. No double-bezel.** Single containment layer per card. The double-bezel technique is for Persuade (marketing/hero sections). For Operate: flat cards with `border: 1px solid var(--color-rule)` and generous internal padding.

### Contradiction 5: Data Density

- **Industrial Brutalist** says: extreme density, tight packing, 1px visible borders.
- **Minimalist** says: generous whitespace, py-24 to py-32 sections.
- **Impeccable Operate** says: density is a permission. Tables with many rows are fine. Users need information.
- **Resolution:** **Moderate density.** Productivity users scan, not browse. Use 1px hairline borders (`border: 1px solid var(--color-rule)`) between data rows. Side panels can be denser than main content. Section padding: `py-8` to `py-12` internally (not the py-24 of marketing pages). This is a hybrid: the compartmentalization of Industrial Brutalist, the cleanliness of Minimalist, at the density that Operate users expect.

### Contradiction 6: Button Shape

- **Minimalist** says: `border-radius: 4-6px` on buttons.
- **High-End** says: `rounded-full` pills for CTAs.
- **Resolution:** **Product UI: subtle radius (6-8px)** for default buttons. The pill shape (`rounded-full`) is for the CTA in the sidebar (e.g., "New Task" FAB). Not all buttons are pills. One radius scale per Shodasha: `--radius-sm: 4px` for inputs, `--radius-md: 8px` for cards/buttons, `--radius-lg: 12px` for modals.

### Contradiction 7: Dark Mode Accent Hue

- **Hallmark** says: never switch hue between modes to keep the anchor.
- **Apple** says: adapt material weight for dark mode.
- **Resolution:** **Keep the hue.** Only lightness and chroma change. Shodasha's accent stays in the blue range in both modes. Chroma drops slightly in dark mode to avoid eye strain.

---

## 14. Quick Reference — Shodasha Design Tokens

```css
:root {
  /* Typography */
  --font-ui:    "Geist", system-ui, -apple-system, sans-serif;
  --font-mono:  "Geist Mono", "SF Mono", "JetBrains Mono", monospace;

  /* Spacing (4pt scale) */
  --space-3xs: 0.125rem;
  --space-2xs: 0.25rem;
  --space-xs:  0.5rem;
  --space-sm:  0.75rem;
  --space-md:  1rem;
  --space-lg:  1.5rem;
  --space-xl:  2rem;
  --space-2xl: 3rem;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;

  /* Easing */
  --ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Duration */
  --dur-micro: 120ms;
  --dur-short: 220ms;
  --dur-long:  420ms;

  /* Z-index */
  --z-base:     1;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    400;
  --z-toast:    500;
  --z-tooltip:  600;

  /* Colors (light mode — see section 4 for dark) */
  --color-paper:          oklch(97% 0.008 80);
  --color-paper-elevated: oklch(100% 0 0);
  --color-rule:           oklch(88% 0.008 80);
  --color-neutral:        oklch(55% 0.008 80);
  --color-muted:          oklch(45% 0.008 70);
  --color-ink:            oklch(18% 0.01 60);
  --color-accent:         oklch(55% 0.19 250);
  --color-success:        oklch(50% 0.15 150);
  --color-warning:        oklch(55% 0.15 80);
  --color-error:          oklch(50% 0.18 30);
}
```

---

## 15. Design Decision Tree for Shodasha

When making any design decision, ask in order:

1. **Is this an Operate surface?** → Scanability, consistency, density, native expectations.
2. **Would removing this improve the user's flow?** → If yes, remove it.
3. **Does every user see this 100+ times/day?** → No animation. Instant response.
4. **Does this animation have a purpose?** → Must clarify, guide, or confirm. Otherwise cut.
5. **Is this a standard affordance?** → Use the standard. Don't reinvent.
6. **Is the contrast ≥ 4.5:1?** → If not, fix it before shipping.
7. **Does this work without color?** → If color-only signal, add icon or pattern.
8. **Will this work at 414px width?** → If not, collapse or adapt.
9. **Does reduced-motion mode work?** → If spatial animation present, provide opacity crossfade.
10. **Would this feel the same in dark mode?** → If hierarchy changes, recalibrate.

---

*Research completed 2026-07-24. Sources: Impeccable v4.0.1, Apple Design (WWDC 2018/2020/2026), Emil Kowalski Design Engineering, High-End Visual Design (Vanguard), Design Taste Anti-Slop v2, Minimalist UI, Industrial Brutalist, Hallmark v1.1.0 + 58-gate slop test.*