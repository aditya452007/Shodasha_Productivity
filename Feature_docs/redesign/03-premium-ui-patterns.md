# Shodasha — Premium UI Pattern System

> **Date:** 2026-07-29
> **Design Persona:** Vanguard_UI_Architect (Awwwards-tier)
> **Skills Applied:** high-end-visual-design · emil-design-eng · apple-design · gsap-core · find-animation-opportunities · design-basics/layout-spacing
> **Vibe Archetype:** Soft Structuralism (Consumer/Productivity) + Subtle Editorial Warmth
> **Layout Archetype:** The Asymmetrical Bento

---

## Table of Contents

1. [Asymmetrical Bento Grid System](#1-asymmetrical-bento-grid-system)
2. [Card Elevation System (3-Tier + Doppelrand)](#2-card-elevation-system-3-tier--doppelrand)
3. [Micro-interaction Suite (Catalog of 12)](#3-micro-interaction-suite-catalog-of-12)
4. [Theme-Aware Gradient Presets](#4-theme-aware-gradient-presets)
5. [Card Component Architecture & API](#5-card-component-architecture--api)
6. [Empty / Loading / Error State Patterns](#6-empty--loading--error-state-patterns)
7. [Responsive Breakpoint Behavior](#7-responsive-breakpoint-behavior)
8. [Implementation Notes](#8-implementation-notes)

---

## 1. Asymmetrical Bento Grid System

### 1.1 Philosophy

Replace the current uniform `grid-cols-4 gap-4` with an **asymmetrical bento grid** — cards of varying sizes (2x, 1.5x, 1x width, 2x and 1x height) that create visual tension and hierarchy. The grid is **not masonry** (no variable row heights) — it's a **strict CSS Grid with explicit span assignments** that collapses cleanly to single-column at narrow widths.

### 1.2 Grid Proposals

#### Desktop (1280px+) — 12-Column Grid

```css
/* Variables */
--grid-gap: var(--space-lg, 1.5rem);
--grid-columns: 12;
--grid-max-width: 1320px;
--grid-padding: var(--space-xl, 2rem);

/* Grid container */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-gap);
  max-width: var(--grid-max-width);
  margin-inline: auto;
  padding-inline: var(--grid-padding);
}

/* Card span utilities — based on 12-col */
.bento-span-2  { grid-column: span 2; }  /* ~16.67% — narrow metric card */
.bento-span-3  { grid-column: span 3; }  /*  25%    — standard KPI card */
.bento-span-4  { grid-column: span 4; }  /* ~33.33% — medium card */
.bento-span-5  { grid-column: span 5; }  /* ~41.67% — accent chart card */
.bento-span-6  { grid-column: span 6; }  /*  50%    — hero / split card */
.bento-span-7  { grid-column: span 7; }  /* ~58.33% — wide card */
.bento-span-8  { grid-column: span 8; }  /* ~66.67% — feature card */
.bento-span-9  { grid-column: span 9; }  /*  75%    — main content */
.bento-span-12 { grid-column: 1 / -1; }  /* 100%    — full-width (streak hero, insight) */

/* Height variants */
.bento-row-1  { grid-row: span 1; min-height: 120px; }
.bento-row-2  { grid-row: span 2; min-height: 280px; }
.bento-row-3  { grid-row: span 3; min-height: 440px; }
```

#### Tablet (768px–1279px) — 8-Column Grid

```css
@media (max-width: 1279px) {
  .bento-grid {
    grid-template-columns: repeat(8, 1fr);
  }

  .bento-span-2  { grid-column: span 2; }
  .bento-span-3  { grid-column: span 4; }  /* 3-col → 4-col on tablet */
  .bento-span-4  { grid-column: span 4; }
  .bento-span-5  { grid-column: span 8; }  /* flatten to full width */
  .bento-span-6  { grid-column: span 8; }
  .bento-span-7  { grid-column: span 8; }
  .bento-span-8  { grid-column: span 8; }
  .bento-span-9  { grid-column: span 8; }
  .bento-span-12 { grid-column: 1 / -1; }
}
```

#### Mobile (<768px) — 4-Column Grid (Collapsed to 1-col)

```css
@media (max-width: 767px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-md, 1rem);
    padding-inline: var(--space-md, 1rem);
  }

  /* ALL cards go full-width on mobile */
  .bento-span-2,
  .bento-span-3,
  .bento-span-4,
  .bento-span-5,
  .bento-span-6,
  .bento-span-7,
  .bento-span-8,
  .bento-span-9,
  .bento-span-12 {
    grid-column: 1 / -1;
  }

  /* Reduced height on mobile */
  .bento-row-2  { min-height: 200px; }
  .bento-row-3  { min-height: 320px; }
}
```

### 1.3 Dashboard Bento Layout Map (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐  │
│  │  Focus Time   │ │  Focus Score  │ │  Tasks Pending│ │ Habit Consist │  │
│  │  span-3 r1    │ │  span-3 r1    │ │  span-3 r1    │ │  span-3 r1    │  │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │  Schedule & Activity Stream      │ │  Time Distribution / Focus Ring │  │
│  │  span-7 row-2                    │ │  span-5 row-2                   │  │
│  └──────────────────────────────────┘ └──────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐  │
│  │  Goals & Habits         │ │  Streak Hero Card    │ │ Performance Chart│  │
│  │  span-4 row-2           │ │  span-4 row-2        │ │  span-4 row-1    │  │
│  └─────────────────────────┘ └──────────────────────┘ └──────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Insight of the Day                                                   │  │
│  │  span-12 row-1                                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.4 Implementation

```tsx
// BentoGrid.tsx
function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-6 ${className}`}>{children}</div>
}
```

Each child card applies its span via a `data-span` attribute or via explicit classes:

```tsx
<BentoGrid>
  {/* Row 1 — KPI metrics, 4 × 3-col cards */}
  <div className="col-span-4 sm:col-span-4 lg:col-span-3">{/* Focus Time Card */}</div>
  <div className="col-span-4 sm:col-span-4 lg:col-span-3">{/* Focus Score Card */}</div>
  <div className="col-span-4 sm:col-span-4 lg:col-span-3">{/* Tasks Card */}</div>
  <div className="col-span-4 sm:col-span-4 lg:col-span-3">{/* Habit Card */}</div>

  {/* Row 2 — Schedule (wider) + Time Ring (narrower) */}
  <div className="col-span-full lg:col-span-7 lg:row-span-2">{/* Schedule */}</div>
  <div className="col-span-full lg:col-span-5 lg:row-span-2">{/* Time Distribution */}</div>

  {/* Row 3 — Goals + Streak + Performance */}
  <div className="col-span-full sm:col-span-4 lg:col-span-4 lg:row-span-2">{/* Goals & Habits */}</div>
  <div className="col-span-full sm:col-span-4 lg:col-span-4 lg:row-span-2">{/* Streak Hero */}</div>
  <div className="col-span-full sm:col-span-full lg:col-span-4">{/* Performance Chart */}</div>

  {/* Row 4 — Full-width insight */}
  <div className="col-span-full">{/* Insight of the Day */}</div>
</BentoGrid>
```

---

## 2. Card Elevation System (3-Tier + Doppelrand)

### 2.1 The Double-Bezel (Doppelrand) Pattern

Every premium card uses the nested architecture from the high-end-visual-design skill. No card sits flat against the background.

```
┌──────────────────────────────────────┐
│  OUTER SHELL                          │
│  ┌────────────────────────────────┐  │
│  │  INNER CORE (content area)     │  │
│  │                                │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### Outer Shell Tokens

```css
/* Light mode */
--card-shell-bg: rgba(0, 0, 0, 0.03);          /* subtle dark tint */
--card-shell-ring: 1px solid rgba(0, 0, 0, 0.06);  /* hairline outer border */
--card-shell-padding: 1.5px;                      /* ultra-thin gap between shell + core */
--card-shell-radius: calc(var(--radius-lg, 12px) + 4px); /* larger outer radius */

/* Dark mode */
--card-shell-bg-dark: rgba(255, 255, 255, 0.04);
--card-shell-ring-dark: 1px solid rgba(255, 255, 255, 0.07);
```

#### Inner Core Tokens

```css
--card-core-bg: var(--bg-surface, #faf8f4);
--card-core-ring: 1px solid var(--border-subtle, #e8e3da);
--card-core-inset-highlight: inset 0 1px 1px rgba(255, 255, 255, 0.12);
--card-core-radius: calc(var(--radius-lg, 12px) + 2px); /* concentric radius */
```

#### Tailwind Implementation (from existing KPICard.tsx)

```tsx
<div className="p-1.5 rounded-[2rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs group hover:ring-stone-900/15 dark:hover:ring-white/20 transition-all">
  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between gap-3 h-full">
    {/* Content */}
  </div>
</div>
```

### 2.2 Three Elevation Tiers

#### Tier 1: Flat (Surface Cards) — `elevation-flat`

Used for: standard KPI cards, grid cards, stat cards.

```css
/* Outer shell */
--elev1-shell-bg: rgba(0, 0, 0, 0.03);
--elev1-shell-ring: 1px solid rgba(0, 0, 0, 0.06);
--elev1-shell-shadow: 0 0 0 0 transparent;

/* Inner core */
--elev1-core-bg: var(--bg-surface);
--elev1-core-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
--elev1-core-ring: 1px solid var(--border-subtle);

/* Dark mode */
--elev1-shell-bg-dark: rgba(255, 255, 255, 0.03);
--elev1-shell-ring-dark: 1px solid rgba(255, 255, 255, 0.06);
--elev1-core-shadow-dark: 0 1px 2px rgba(0, 0, 0, 0.2);
--elev1-core-ring-dark: 1px solid var(--border-subtle);
```

#### Tier 2: Raised (Interactive Cards) — `elevation-raised`

Used for: hoverable cards, schedule items, clickable stat cards, streak hero.

```css
/* Outer shell */
--elev2-shell-bg: rgba(0, 0, 0, 0.04);
--elev2-shell-ring: 1px solid rgba(0, 0, 0, 0.08);
--elev2-shell-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

/* Inner core */
--elev2-core-bg: var(--bg-surface-elevated);
--elev2-core-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255,255,255,0.1);
--elev2-core-ring: 1px solid var(--border-default);

/* Dark mode */
--elev2-shell-bg-dark: rgba(255, 255, 255, 0.04);
--elev2-shell-ring-dark: 1px solid rgba(255, 255, 255, 0.08);
--elev2-core-bg-dark: var(--bg-surface-elevated);
--elev2-core-shadow-dark: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.03);
--elev2-core-ring-dark: 1px solid var(--border-default);
```

#### Tier 3: Floating (Modals, Drawers, Hero Cards) — `elevation-floating`

Used for: modals, full-bleed hero cards (streak), insight cards, floating panels.

```css
/* Outer shell — no shell needed for floating cards, they are the shell */
--elev3-core-bg: var(--bg-surface-elevated);
--elev3-core-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
--elev3-core-ring: 1px solid var(--border-default);
--elev3-core-radius: calc(var(--radius-lg, 12px) + 8px); /* more rounded */

/* Dark mode */
--elev3-core-shadow-dark: 0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3);
--elev3-core-ring-dark: 1px solid var(--border-strong);
```

### 2.3 Shadow Token Math (Light Mode)

| Token | Tier | Light | Dark |
|-------|------|-------|------|
| `--elev-shadow-flat` | 1 | `0 1px 2px rgba(40,30,20,0.03)` | `0 1px 2px rgba(0,0,0,0.2)` |
| `--elev-shadow-raised` | 2 | `0 2px 8px rgba(40,30,20,0.04)` | `0 2px 8px rgba(0,0,0,0.3)` |
| `--elev-shadow-floating` | 3 | `0 8px 32px rgba(40,30,20,0.08), 0 4px 12px rgba(40,30,20,0.04)` | `0 8px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)` |

All shadows use `rgba(40, 30, 20, ...)` in light mode (warm brown undertone matching the cream palette) and `rgba(0, 0, 0, ...)` in dark mode.

### 2.4 Hover Lift States

```css
/* Hover state for Tier 1 and Tier 2 cards */
@media (hover: hover) and (pointer: fine) {
  .card-elevation-1:hover {
    transform: translateY(-2px);
    --elev1-core-shadow: 0 4px 12px rgba(40, 30, 20, 0.06), 0 2px 4px rgba(40, 30, 20, 0.03);
  }

  .card-elevation-2:hover {
    transform: translateY(-3px);
    --elev2-core-shadow: 0 6px 20px rgba(40, 30, 20, 0.08), 0 2px 6px rgba(40, 30, 20, 0.04);
  }

  /* Glow effect — border accent on hover for accent cards */
  .card-glow:hover {
    box-shadow: 0 0 0 1px var(--accent), 0 4px 16px color-mix(in srgb, var(--accent) 15%, transparent);
  }
}
```

### 2.5 Loading Skeleton per Tier

```css
/* Skeleton base — gentle pulse, not aggressive shimmer */
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  border-radius: inherit;
  background: var(--color-rule, oklch(89% 0.007 75));
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

/* Tier-specific skeleton dimensions */
.skeleton-tier-1 { min-height: 100px; }
.skeleton-tier-2 { min-height: 160px; }
.skeleton-tier-3 { min-height: 220px; }
```

---

## 3. Micro-interaction Suite (Catalog of 12)

### 3.1 Easing Curve Reference

```css
/* All micro-interactions use these exact curves — no exceptions */
--ease-out:         cubic-bezier(0.23, 1, 0.32, 1);   /* UI enters, feedback */
--ease-in:          cubic-bezier(0.7, 0, 0.84, 0);     /* UI exits (rare) */
--ease-in-out:      cubic-bezier(0.65, 0, 0.35, 1);    /* on-screen movement */
--ease-spring:      cubic-bezier(0.32, 0.72, 0, 1);    /* drawer, sheet (from Ionic) */
--ease-bounce:      cubic-bezier(0.34, 1.56, 0.64, 1); /* decorative delight (rare) */
```

### 3.2 Interaction Catalog

| # | Interaction | Trigger | Properties | Duration | Easing | `prefers-reduced-motion` | CSS / GSAP |
|---|-------------|---------|------------|----------|--------|-------------------------|------------|
| 1 | **Button Press** | `:active` | `scale(0.97)` | 120ms | `--ease-out` | `transform: none` | CSS transition |
| 2 | **Card Hover Lift** | `@media (hover)` | `translateY(-2px)`, shadow increase | 200ms | `--ease-out` | none | CSS transition |
| 3 | **Card Glow** | `@media (hover)` | `box-shadow` with `color-mix(var(--accent) 15%, transparent)` | 300ms | `--ease-out` | none | CSS transition |
| 4 | **Number Ticker** | data update | Count-up from previous→new value | 800ms spring | `power2.out` (GSAP or `--ease-out` with CSS `@property`) | instant set | GSAP or WAAPI |
| 5 | **Ring Chart Fill** | mount / update | Arc stroke-dashoffset 0→target | 1.2s | `--ease-out` | instant set | SVG transition |
| 6 | **Staggered Entry** | page mount | `translateY(12px)` + `opacity(0)` → `translateY(0)` + `opacity(1)` | 350ms per item | `--ease-out` | no transform, just opacity | Motion variant stagger |
| 7 | **Tooltip Appear** | hover (800ms delay) | `scale(0.97)` + `opacity(0)` → `scale(1)` + `opacity(1)`, origin-aware | 125ms | `--ease-out` | instant, no scale | CSS transition + `@starting-style` |
| 8 | **Tooltip Subsequent** | hover with instant class | same as above but `transition-duration: 0ms` | 0ms | — | instant | CSS toggle |
| 9 | **Button-in-Button Icon** | `@media (hover)` | inner icon wrapper `translateX(2px)` + `scale(1.05)` | 200ms | `--ease-out` | none | CSS transition |
| 10 | **Modal Enter** | mount | `scale(0.95)` + `opacity(0)` → `scale(1)` + `opacity(1)`, center-origin | 250ms | `--ease-out` | opacity only | Motion or CSS |
| 11 | **Modal Exit** | unmount | `scale(1)` → `scale(0.97)` + `opacity(1)` → `opacity(0)` | 150ms | `--ease-in` | opacity only | Motion or CSS |
| 12 | **Drawer Enter** | mount | `translateX(100%)` → `translateX(0)`, with scrim fade 0→0.5 | 350ms | `--ease-spring` | opacity+xfade | Motion spring |
| — | **Hold-to-Delete Fill** | `:active` hold | `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` | 2s (fill) / 200ms (snap-back) | `linear` (fill) / `--ease-out` (snap) | instant toggle | CSS transition |

### 3.3 Staggered Entry Implementation

```tsx
import { motion, useReducedMotion } from 'framer-motion'

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05, // 50ms between each child
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
  },
}

function DashboardGrid({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <BentoGrid>{children}</BentoGrid>
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <BentoGrid>
        {Children.map(children, (child, i) => (
          <motion.div key={i} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </BentoGrid>
    </motion.div>
  )
}
```

### 3.4 Number Ticker (800ms Spring)

```tsx
// GSAP-powered number ticker (when available)
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevValue = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const fromValue = prevValue.current
    prevValue.current = value

    gsap.fromTo(
      ref.current,
      { textContent: fromValue },
      {
        textContent: value,
        duration: 0.8,
        ease: 'power2.out',
        snap: { textContent: 1 },
      }
    )
  }, [value])

  return <span ref={ref}>{value}</span>
}
```

### 3.5 Origin-Aware Tooltip

```css
[data-tooltip] {
  position: relative;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) scale(0.97);
  opacity: 0;
  pointer-events: none;
  transform-origin: var(--tooltip-origin, bottom center);
  transition: transform 125ms var(--ease-out), opacity 125ms var(--ease-out);
  transition-delay: 800ms;

  /* styling */
  background: var(--bg-surface-elevated);
  color: var(--text-primary);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  box-shadow: var(--elev-shadow-raised);
  white-space: nowrap;
}

[data-tooltip]:hover::after {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

/* Skip delay + animation when sibling was just hovered */
[data-tooltip][data-instant]::after {
  transition-delay: 0ms;
  transition-duration: 0ms;
}
```

### 3.6 reduced-motion Guards

```css
@media (prefers-reduced-motion: reduce) {
  .card-lift:hover {
    transform: none !important;
  }

  [data-tooltip]::after {
    transform: translateX(-50%) scale(1) !important;
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }

  .motion-stagger-item {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## 4. Theme-Aware Gradient Presets

### 4.1 Gradient System Design

Gradients use CSS custom properties (`var()` references) so they automatically invert in dark mode. No hardcoded color stops. Each gradient has a `light` and `dark` variant defined via tokens.

### 4.2 Gradient Presets

#### Preset 1: Streak Hero (Violet → Indigo → Purple)

```css
--gradient-streak-light: linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%);
--gradient-streak-dark:  linear-gradient(135deg, #6d28d9 0%, #4f46e5 50%, #7c3aed 100%);
```

Used for: `StreakHeroCard.tsx` (current gradient), achievement badges.

#### Preset 2: Success / Focus (Emerald → Teal)

```css
--gradient-success-light: linear-gradient(135deg, #059669 0%, #0d9488 100%);
--gradient-success-dark:  linear-gradient(135deg, #047857 0%, #0f766e 100%);
```

Used for: progress rings that are complete, positive trend badges, focus score rings at >80%.

#### Preset 3: Warning / Energy (Amber → Orange)

```css
--gradient-warning-light: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
--gradient-warning-dark:  linear-gradient(135deg, #b45309 0%, #c2410c 100%);
```

Used for: medium-range rings (40-70%), streak-at-risk indicators, pending counts.

#### Preset 4: Accent / Brand (Sky → Blue → Indigo)

```css
--gradient-accent-light: linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #6366f1 100%);
--gradient-accent-dark:  linear-gradient(135deg, #0369a1 0%, #2563eb 50%, #4f46e5 100%);
```

Used for: focus time visualization, primary accent cards, active indicators.

#### Preset 5: Neutral / Ambient (Warm Grey for Editorial Feel)

```css
--gradient-neutral-light: linear-gradient(135deg, #faf8f4 0%, #f4f1eb 100%);
--gradient-neutral-dark:  linear-gradient(135deg, #24211e 0%, #1c1917 100%);
```

Used for: insight cards, subtle background differentiation, info cards.

#### Preset 6: Glass / Elevated Surface

```css
--gradient-glass-light: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%);
--gradient-glass-dark:  linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
```

Used for: floating navbars, tooltips, overlays, drawer headers.

### 4.3 Dark Mode Inversion Strategy

Dark mode gradients are **not inversions** — they're **darker chroma versions** of the same hue. Hue values remain within 10° of the light variant. Lightness drops by ~15-20% in dark mode.

```
Light:  #7c3aed (oklch 48% 0.22 285°)
Dark:   #6d28d9 (oklch 38% 0.20 275°)  ← same-ish hue, lower lightness
```

### 4.4 Usage in Components

```tsx
<StreakHeroCard className="bg-[var(--gradient-streak-light)] dark:bg-[var(--gradient-streak-dark)]" />
```

Or as CSS-only on the card:

```css
.hero-streak {
  background: var(--gradient-streak-light);
}

.dark .hero-streak {
  background: var(--gradient-streak-dark);
}
```

---

## 5. Card Component Architecture & API

### 5.1 Base Card Component

```tsx
type CardElevation = 'flat' | 'raised' | 'floating'
type CardAccent = 'blue' | 'pink' | 'rose' | 'amber' | 'emerald' | 'violet' | 'teal' | 'orange' | 'indigo' | 'default'

interface CardBaseProps {
  elevation?: CardElevation
  accent?: CardAccent
  glowOnHover?: boolean
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}
```

### 5.2 Card Shell + Core (Doppelrand)

```tsx
// src/components/ui/BaseCard.tsx
function BaseCard({
  elevation = 'flat',
  accent = 'default',
  glowOnHover = false,
  loading = false,
  error = null,
  empty = false,
  emptyMessage,
  className = '',
  children,
  onClick,
}: CardBaseProps) {
  if (loading) return <CardSkeleton elevation={elevation} />
  if (error) return <CardError message={error} />
  if (empty) return <CardEmpty message={emptyMessage} />

  const elevationStyles = {
    flat: 'bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs',
    raised: 'bg-stone-900/8 dark:bg-white/8 ring-1 ring-stone-900/10 dark:ring-white/10 shadow-sm',
    floating: 'bg-stone-900/10 dark:bg-white/10 ring-1 ring-stone-900/12 dark:ring-white/12 shadow-lg',
  }

  return (
    <div
      className={`
        p-1.5 rounded-[calc(1rem+4px)] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${elevationStyles[elevation]}
        ${glowOnHover ? 'hover:shadow-[0_0_0_1px_var(--accent),0_4px_16px_color-mix(in_srgb,var(--accent)_15%,transparent)]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(1rem+2px)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] h-full">
        {children}
      </div>
    </div>
  )
}
```

### 5.3 KPI Stat Card Variant

```tsx
interface StatCardProps extends CardBaseProps {
  icon: LucideIcon
  value: string | number
  label: string
  subtitle?: string
  trend?: { value: string; type: 'positive' | 'negative' | 'neutral' }
  animated?: boolean  // enable number ticker
  accent?: CardAccent
}

function StatCard({ icon: Icon, value, label, subtitle, trend, animated = true, accent = 'default', ...cardProps }: StatCardProps) {
  const colors = accentStyles[accent]

  return (
    <BaseCard elevation="flat" glowOnHover accent={accent} {...cardProps}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] mb-1">{label}</h4>
          <div className="font-mono font-extrabold text-2xl text-[var(--text-primary)] tracking-tight tabular-nums">
            {animated && typeof value === 'number' ? <NumberTicker value={value} /> : value}
            {typeof value === 'string' && value}
          </div>
          {trend && <TrendBadge type={trend.type}>{trend.value}</TrendBadge>}
          {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-1">{subtitle}</p>}
        </div>
        <div
          className="p-2.5 rounded-2xl border transition-transform group-hover:scale-105"
          style={{ backgroundColor: colors.muted, color: colors.accent, borderColor: `${colors.accent}22` }}
        >
          <Icon className="size-4 stroke-[2]" />
        </div>
      </div>
    </BaseCard>
  )
}
```

### 5.4 Icon Container Patterns

Three icon container variants for the premium visual system:

| Variant | Size | Radius | Usage |
|---------|------|--------|-------|
| **Tiny badge** | `p-1.5` | `rounded-lg` (6px) | Inline with text, status indicators |
| **Standard icon well** | `p-2.5` | `rounded-xl` (10px) | Card header icons, metric icons |
| **Hero icon frame** | `p-3.5` | `rounded-2xl` (16px) | Streak flame, feature hero icons |

All use the same accent mapping to background + border + icon color.

---

## 6. Empty / Loading / Error State Patterns

### 6.1 State Machine per Card

Every card component follows this state machine:

```
1. isLoading === true   → Skeleton (tier-appropriate)
2. error !== null       → ErrorBanner + retry button
3. isEmpty === true     → EmptyState with CTA
4. data present         → Render content
```

### 6.2 Skeleton per Card Type

#### Metric Stat Card Skeleton

```tsx
function StatCardSkeleton() {
  return (
    <div className="p-1.5 rounded-[calc(1rem+4px)] bg-stone-900/5 dark:bg-white/5">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(1rem+2px)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="h-3 w-16 skeleton rounded" />
            <div className="h-8 w-24 skeleton rounded" />
            <div className="h-3 w-20 skeleton rounded" />
          </div>
          <div className="h-10 w-10 skeleton rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
```

#### Chart Card Skeleton

```tsx
function ChartCardSkeleton() {
  return (
    <BaseCard elevation="raised">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 skeleton rounded-xl" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 skeleton rounded" />
              <div className="h-3 w-24 skeleton rounded" />
            </div>
          </div>
          <div className="h-6 w-20 skeleton rounded-lg" />
        </div>
        <div className="h-44 w-full skeleton rounded-xl" />
      </div>
    </BaseCard>
  )
}
```

#### Streak Hero Card Skeleton

```tsx
function StreakSkeleton() {
  return (
    <div className="rounded-3xl bg-stone-900/10 dark:bg-white/10 p-6 min-h-[220px]">
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="h-14 w-14 skeleton rounded-2xl" />
        <div className="h-12 w-16 skeleton rounded" />
        <div className="h-3 w-24 skeleton rounded" />
      </div>
    </div>
  )
}
```

### 6.3 Empty State Pattern

```tsx
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: { label: string; href: string }
}

function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="p-4 rounded-2xl bg-stone-900/5 dark:bg-white/5 mb-4">
        <Icon className="w-8 h-8 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-xs text-[var(--text-tertiary)] max-w-[240px] mb-4">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
```

### 6.4 Error State Pattern

```tsx
interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-[var(--error)]" />
        <p className="text-xs text-[var(--error)]">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/20 text-[var(--error)] hover:bg-red-500/10 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
```

### 6.5 State Map per Card Type

| Card Type | Skeleton Height | Empty State | Error Recovery |
|-----------|----------------|-------------|----------------|
| StatCard (metric) | 100px | "No data yet" | Retry button |
| Chart (AreaChart) | 220px | "No chart data" + CTA | Retry button |
| StreakHero | 220px | "Start tracking habits" → /habits | Dismiss + retry |
| ScheduleList | 300px | "No tasks today" → /board | Retry button |
| RingChart | 200px | "No focus data" | Retry |
| GoalsHabits | 250px | "Add first habit" → /habits | Retry |

---

## 7. Responsive Breakpoint Behavior

### 7.1 Breakpoint Reference

| Breakpoint | Width | Columns | Grid Gap | Padding | Behavior |
|-----------|-------|---------|----------|---------|----------|
| **Desktop** | ≥1280px | 12 | 1.5rem (24px) | 2rem (32px) | Full bento asymmetry |
| **Small Desktop** | 1024–1279px | 8 | 1.25rem (20px) | 1.5rem (24px) | Widen spans, reduce column count |
| **Tablet** | 768–1023px | 8 | 1rem (16px) | 1.25rem (20px) | All wide cards collapse to full-width |
| **Mobile** | <768px | 4 (effectively 1-col) | 0.75rem (12px) | 1rem (16px) | Single-column stack, reduced padding |

### 7.2 Card Behavior per Breakpoint

```
Card Type           Desktop(12-col)    Tablet(8-col)      Mobile(<768px)
─────────────────────────────────────────────────────────────────────────
Stat Metric         3-col (span 3)     4-col (span 4)     full-width
Schedule Stream     span 7, row 2      full-width         full-width
Time Ring           span 5, row 2      full-width, row-1  full-width
Goals & Habits      span 4, row 2      span 4, row-2     full-width
Streak Hero         span 4, row 2      span 4, row-2     full-width
Performance Chart   span 4, row 1      full-width, row-1  full-width
Insight Card        span 12, row-1     full-width         full-width
```

### 7.3 Mobile-Specific Adjustments

```css
@media (max-width: 767px) {
  /* Reduce card padding */
  .card-core { padding: var(--space-md, 1rem); }

  /* Reduce hero sizes */
  .streak-counter { font-size: 2.5rem; }  /* was 3.5rem+ */
  .metric-value { font-size: 1.5rem; }    /* was 2rem */

  /* Reduce icon wells */
  .icon-well { padding: 0.5rem; border-radius: 0.75rem; }

  /* Full-width shell padding */
  .bento-shell { padding-inline: 1rem; }

  /* Stack header elements */
  .card-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }

  /* Touch-friendly targets (44px minimum) */
  .btn-interactive { min-height: 44px; }
}
```

### 7.4 iOS Safari Safe Areas

```css
.bento-shell {
  padding-inline: max(var(--grid-padding, 2rem), env(safe-area-inset-right));
  padding-inline: max(var(--grid-padding, 2rem), env(safe-area-inset-left));
}

/* Never use h-screen — use min-h-[100dvh] for full-height sections */
.page-container {
  min-height: 100dvh;
}
```

---

## 8. Implementation Notes

### 8.1 New CSS Variables to Add to globals.css

```css
:root {
  /* Elevation shadows */
  --elev-shadow-flat:     0 1px 2px rgba(40,30,20,0.03);
  --elev-shadow-raised:   0 2px 8px rgba(40,30,20,0.04);
  --elev-shadow-floating: 0 8px 32px rgba(40,30,20,0.08), 0 4px 12px rgba(40,30,20,0.04);

  /* Gradients */
  --gradient-streak:  linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%);
  --gradient-success: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  --gradient-warning: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
  --gradient-accent:  linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #6366f1 100%);
  --gradient-neutral: linear-gradient(135deg, #faf8f4 0%, #f4f1eb 100%);
  --gradient-glass:   linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%);

  /* Easing — add spring */
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Additional duration tokens */
  --dur-stagger: 50ms;
  --dur-spring:  500ms;
}

.dark {
  --elev-shadow-flat:     0 1px 2px rgba(0,0,0,0.2);
  --elev-shadow-raised:   0 2px 8px rgba(0,0,0,0.3);
  --elev-shadow-floating: 0 8px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3);

  --gradient-streak:  linear-gradient(135deg, #6d28d9 0%, #4f46e5 50%, #7c3aed 100%);
  --gradient-success: linear-gradient(135deg, #047857 0%, #0f766e 100%);
  --gradient-warning: linear-gradient(135deg, #b45309 0%, #c2410c 100%);
  --gradient-accent:  linear-gradient(135deg, #0369a1 0%, #2563eb 50%, #4f46e5 100%);
  --gradient-neutral: linear-gradient(135deg, #24211e 0%, #1c1917 100%);
  --gradient-glass:   linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
}
```

### 8.2 File Change Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/app/globals.css` | Append new tokens | Add elevation shadows, gradients, easings, duration tokens |
| `src/components/ui/BaseCard.tsx` | **New** | Double-bezel card shell + core with elevation variants, loading/error/empty states |
| `src/components/ui/StatCard.tsx` | **New** | Metric KPI card with number ticker, trend, icon well, accent mapping |
| `src/components/ui/CardSkeleton.tsx` | **New** | Tiered skeleton components |
| `src/components/ui/EmptyState.tsx` | **New** | Empty state with icon + title + description + CTA |
| `src/components/ui/ErrorBanner.tsx` | **New** | Error state with retry button |
| `src/components/dashboard/TopKPIGrid.tsx` | Refactor | Wrap in `BentoGrid`, use `StatCard` component, add stagger |
| `src/components/dashboard/StreakHeroCard.tsx` | Refactor | Use `--gradient-streak` variable, reduce flame loop animation |
| `src/components/ui/charts/KPICard.tsx` | Keep + align | Already uses doppelrand — just align gradient/elevation tokens |
| All dashboard cards | Audit | Add loading/empty/error states via `BaseCard` wrapper |

### 8.3 Anti-Patterns to Avoid

- ❌ Uniform 4-col grid — use asymmetric bento spans
- ❌ Cards sitting flat on background — always use doppelrand
- ❌ Hardcoded gradient stops — always use `var(--gradient-*)`
- ❌ `scale(0)` on entry — always start from `scale(0.95)` + `opacity(0)`
- ❌ `ease-in` on entrance animations — always `ease-out`
- ❌ Animating `all` — specify exact properties: `transform`, `opacity`, `box-shadow`
- ❌ No hover guard on touch devices — gate with `@media (hover)`
- ❌ Skeleton shimmer (moving gradient) — use gentle opacity pulse instead
- ❌ Keyframes for frequently-triggered interactions — use CSS transitions for interruptibility

---

*End of Premium UI Pattern System. This document specifies the exact grid, elevation, micro-interaction, gradient, and component architecture for the Shodasha redesign. Ready for implementation in Phase 2+ of the redesign.*
