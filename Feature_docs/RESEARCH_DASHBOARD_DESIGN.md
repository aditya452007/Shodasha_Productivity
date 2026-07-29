# Premium Dashboard UI/UX Design Research — July 2026

> **Purpose:** Exhaustive reference for building a premium productivity/tracking desktop app (Board → Habits → Timeline → Dashboard → Settings). Covers KPI matrix design, gamified habit tracking, bento grid layouts, colorful data viz, micro-interactions, glassmorphism, and edge-state patterns.

---

## Table of Contents

1. [KPI Matrix Design](#1-kpi-matrix-design)
2. [Gamified Habit Tracking & Radar Charts](#2-gamified-habit-tracking--radar-charts)
3. [Bento Grid Dashboards & Premium Layouts](#3-bento-grid-dashboards--premium-layouts)
4. [Colorful Data Visualization](#4-colorful-data-visualization)
5. [Productivity App UI Patterns](#5-productivity-app-ui-patterns)
6. [Micro-interactions & Animation](#6-micro-interactions--animation)
7. [Glassmorphism & Dark Mode](#7-glassmorphism--dark-mode)
8. [Edge States (Loading, Empty, Error)](#8-edge-states)
9. [Typography & Hierarchy](#9-typography--hierarchy)
10. [Synthesized Palette & Component Blueprint](#10-synthesized-palette--component-blueprint)

---

## 1. KPI Matrix Design

### Core Principles (from research synthesis)

**5–7 KPI rule:** The most-cited heuristic across every source (Setproduct, AppDeck, Harospec, Qlik) is to limit visible KPIs to 3–7 in the above-the-fold area. Beyond this, focus dissolves. Push secondary metrics into drill-down sections.

**Inverted pyramid hierarchy:** Most important KPI at top-left (the "north star metric"), secondary metrics in a row below, tertiary details in charts/tables below that. This maps to F-pattern scanning behaviour.

**Context for every number:** A standalone number is useless. Every KPI needs:
- vs. target (are we on track?)
- vs. last period (are we improving?)
- Trend direction (sparkline or arrow)
- Optional: benchmark comparison

**Standardized color language:**
- Green (`#22c55e`): On target, healthy
- Amber (`#f59e0b`): At risk, approaching threshold
- Red (`#ef4444`): Below target, needs action
- Gray: Informational, no judgment
- **Never rely on color alone** — add icons/text labels for accessibility

### Card Anatomy (from Dell Design System + PatternFly + Setproduct)

```
┌─────────────────────────────────────┐
│  [icon]  Metric Title          [badge] │
│                                      │
│    $128,400        ▲ +12.3%          │
│    (large number)  (trend indicator) │
│                                      │
│    ●●●●●●●●●●●●●●●○○○○  (sparkline) │
│    vs. last month: +$14,200          │
└─────────────────────────────────────┘
```

**Card variants found across research:**
- **Big Number card:** Single prominent value + sparkline + delta
- **Progress card:** Circular/bar progress toward a target (85% of goal)
- **Trend card:** Current value side-by-side with a trend chart
- **Utilization card:** Donut/bar showing percentage of capacity
- **Grouped metric card:** 2–4 related metrics stacked in one card
- **Status card:** RAG (red/amber/green) status with minimal number

**Card dimensions (from Dell DDS):** Min 240px wide, max 520px wide. 16px minimum gap between cards in a row. Container-adaptive.

### KPI Layout Patterns

| Source | Pattern | Notes |
|--------|---------|-------|
| AppDeck | North Star + 4 supporting cards + 2-panel lower section | MRR dominates top, CAC/LTV/LTV:CAC/burn rate in row below |
| PatternFly | Card grid with custom spans | Each card has exactly one job |
| Qlik | F-scanning layout | Horizontal scan, then vertical |
| Muzli 2026 | Bento-grid asymmetry | Hero tile 6-col, metric tiles 2-3 col |

### Key Sources
- https://www.appdeck.com/blog/kpi-dashboard-examples
- https://www.delldesignsystem.com/data-visualization/metrics-card
- https://www.patternfly.org/patterns/dashboard/design-guidelines
- https://www.setproduct.com/blog/dashboard-ui-design

---

## 2. Gamified Habit Tracking & Radar Charts

### Selv.app — The Best Reference (getselv.app)

Selv is a gamified habit tracker where "you are the character." It's the closest real product to what Shodasha is building.

**Core mechanics:**
- 99 levels across 7 bands (Iron → Obsidian)
- 5 life attributes: Vitality, Discipline, Nourish, Order, Self-care
- Radar chart character sheet shows all 5 attributes
- XP accumulates permanently — missing a day hurts rate, not history
- Weighted tasks (1–5) with normalized completion %
- 60-day completion heatmap
- 7-day bar graphs, category breakdowns, task-level lifetime stats

**Character sheet visualization:**
```
        Vitality
          82%
     ╱         ╲
Order 55%     78% Nourish
     ╲         ╱
    Discipline  Self-care
       65%       90%
```

**Key UI decisions from Selv:**
- No streak guilt — XP never resets
- No cartoon pets — honest data, adult aesthetic
- "10 seconds a day" — logging is instant, dashboard is the reward
- Radar chart + heatmap + per-category breakdown = 30+ analytics views

### Habit Intelligence (GitHub: ChaudharyKartik/Habit-Intelligence)

Next.js 14 habit tracker with:
- **Tech stack:** Next.js 14, TypeScript, Tailwind, shadcn/ui, Radix UI, Framer Motion
- **Gamification:** XP rewards, streak tracking with fire indicators, level progression, sparkle effects, glow transitions, achievement badges
- **Categories:** Learning, Health, Mindfulness, Social, Spiritual, Productivity
- **Analytics:** Weekly completion bar charts, streak line charts, XP growth, category donut charts
- **UI:** Glassmorphism, Space Grotesk font, animate.js for sparkle/glow

### Radar Chart Design Patterns

**From SkillRadar (skillsradar.pro):**
- 6–12 axes per radar chart
- Current vs. target overlay (semi-transparent area fills)
- Scale 0–10 per axis
- Snapshot history over time
- AI-generated action plans based on gaps

**From shadcn/ui Radar Charts:**
- Ready-made Recharts radar components
- Multiple series with semi-transparent fills
- Responsive by default

**Design recommendations for habit radar:**
- 5–8 axes maximum (cognitive limit)
- Curved polygon fills with gradient
- Label outside the chart perimeter at each vertex
- Hover tooltip showing exact value per axis
- Animate fill on mount (draw the polygon)
- Color-code each axis to match category colors throughout the app

### Key Sources
- https://getselv.app/
- https://github.com/ChaudharyKartik/Habit-Intelligence
- https://skillsradar.pro/
- https://ui.shadcn.com/charts/radar

---

## 3. Bento Grid Dashboards & Premium Layouts

### The 2026 Bento Grid Standard

The defining UI pattern of 2026 (Superfiles, Orbix Studio, Peterdraw, Midrocket). Originated from Apple product pages, popularized by Linear.app.

**Core characteristics:**
- **Strict compartmentalization:** Every piece of content in its own box
- **Visual hierarchy by size:** Larger tiles = more important data
- **Unified spacing:** Consistent gap (16–24px)
- **Rounded corners:** Heavy border-radius to soften the grid
- **CSS Grid 12-column base:** `grid-template-columns: repeat(12, 1fr)`

**Tile sizing framework (from Orbix Studio):**

| Tier | Grid Span | Content | Limit |
|------|-----------|---------|-------|
| Hero tile | 6 col × 2 row | Primary KPI, north star metric | Max 2 per screen |
| Feature tile | 3–4 col × 1–2 row | Line charts, trend data, radar | — |
| Metric card | 2–3 col × 1 row | Secondary KPIs, status | — |
| Accent tile | 1–2 col × 1 row | Alerts, quick actions | 1 piece per tile |

**CSS Grid reference:**
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  padding: 24px;
}
.tile-hero { grid-column: span 6; grid-row: span 2; }
.tile-metric { grid-column: span 3; grid-row: span 1; }
.tile-chart { grid-column: span 4; grid-row: span 2; }
```

### Products Using Bento Grids Well
- **Linear:** Project status with near-bento layout, active sprints in large tiles, issue counts in small metric cards
- **Datadog:** 12-column CSS Grid with snap-to-grid, 20+ widget types
- **Notion (2024 redesign):** Recent pages, team activity, database views in bento
- **Payhawk:** Financial KPIs — each tile = one data point + trend indicator

### Glassmorphism on Bento Cards

**2026 refined glassmorphism (from Rajesh R Nair, Inspo AI):**
- Less saturation than 2021 peak
- Tighter opacity control
- Solid backgrounds behind glass (not gradient blobs)
- Use selectively on floating surfaces (modals, nav, hero cards)

```css
.glass-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
}
```

**Where glassmorphism works:** Sidebar panels, modal overlays, hero KPI cards
**Where it fails:** Data tables, form inputs, content-heavy areas — blur reduces legibility

### Bento Grid Mistakes to Avoid
1. Equal tile sizes (that's just a card grid, not bento)
2. More than 2 hero tiles per screen
3. No responsive plan — tiles must collapse at breakpoints
4. Ignoring CLS — set explicit min-height on all tiles
5. Gap < 8px or > 32px — sweet spot is 16px
6. Overloading accent tiles — 1 piece of info per small tile

### Key Sources
- https://www.orbix.studio/blogs/bento-grid-dashboard-design-aesthetics
- https://superfiles.in/bento-grid-ui-design-trend.php
- https://peterdraw.studio/blog/bento-grid-layout
- https://www.setproduct.com/blog/dashboard-ui-design

---

## 4. Colorful Data Visualization

### Color Palettes from Top Dashboard Designs

**Muzli 2026 collection analysis:**
- *WanderWheels:* Soft beige + bold orange highlights
- *Intelly:* Soft pastels, rounded shapes, friendly contrasts
- *SaaS Dashboard:* Dark base + lavender accents + subtle gradients
- *Fitness Tracking:* Deep charcoal + frosted glass + neon green/pink accents
- *Realto:* Warm neutral palette + frosted glass widgets
- *InsightStream (analytics):* Deep charcoal + vibrant pink/green neon accents
- *Vaulto (crypto):* Deep charcoal, high-contrast typography, heatmap
- *Rabbet (real estate):* Cinematic dark + neon highlights

**Color for status (universal across sources):**
- Positive: `#22c55e` (green)
- Warning: `#f59e0b` (amber)  
- Negative: `#ef4444` (red)
- Info: `#3b82f6` (blue)

**Color for categories (habit tracking context):**
- Mental/Health: `#8b5cf6` (violet)
- Physical/Fitness: `#10b981` (emerald)
- Work/Productivity: `#f59e0b` (amber)
- Social: `#ec4899` (pink)
- Learning: `#3b82f6` (blue)
- Finance: `#14b8a6` (teal)

**Premium accent combos (from premium dashboard research):**
1. Charcoal `#0f0f13` + Amber `#f59e0b` + Violet `#8b5cf6` — cinematic
2. Deep navy `#0a0a1a` + Cyan `#06b6d4` + Emerald `#10b981` — tech
3. Warm beige `#f5f0eb` + Terracotta `#e07a5f` + Slate `#3d405b` — editorial
4. Dark `#111113` + Lavender `#a78bfa` + Pink `#ec4899` — playful premium

### Data Viz Encoding Rules
- **Position** > **Length** > **Angle** > **Area** > **Color** (accuracy ranking)
- Bar: comparison across categories
- Line: trend over time
- Area: composition over time
- Scatter: correlation
- Heatmap: density
- Donut: proportion (max 5 slices)
- **Never use 3D charts** — they distort perception

### Gradient Cards
- Used for hero KPIs to command attention
- Subtle gradients (close shades) for standard cards
- Bold gradients (contrasting) for promotional/featured cards
- Max 3 colors in a single gradient

### Key Sources
- https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026
- https://dribbble.com/tags/kpi-dashboard
- https://devpalettes.com/card-generator
- https://github.com/siddharthg-7/Interactive-Real-Time-Data-Visualization-Dashboard

---

## 5. Productivity App UI Patterns

### What Makes a Great Productivity Dashboard (Teloralife)

**2026 shift:** From task storage → cognitive clarity system. The best dashboards reduce mental overload, not increase it.

**Five layers:**
1. **Goal Layer:** Long-term direction, missions, focus areas — always visible
2. **Execution Layer:** Actionable steps, daily tasks, recurring systems
3. **Reflection Layer:** Journaling, reviews, progress awareness
4. **Focus Layer:** Deep work support, attention protection
5. **Energy Layer:** Energy-aware planning, recovery cycles

**ADHD-friendly design patterns:**
- Visual priorities (size/color hierarchy)
- Reduced complexity (max 7 KPI cards)
- Visible goals (never hidden in menus)
- Shorter action steps
- Quick capture systems
- Low-shame productivity flows (no streak punishment)

### Focus Tracker Patterns (Dribbble research)

Top trends from productivity dashboard designs (Nixtio, Phenomenon Studio, Odama):
- **Task + Timer combo:** Side-by-side task list and pomodoro timer
- **Focus score card:** Percentage-based focus quality metric with trend
- **Daily rhythm view:** Timeline showing energy levels across the day
- **Session breakdown:** Pie/donut of focused vs. distracted time
- **Weekly comparison:** Bar chart comparing current week to previous

### Time Tracking Dashboard Patterns
- Project breakdown (donut or treemap)
- Daily activity timeline (horizontal stacked bar)
- Billable vs. non-billable split
- Team member allocation heatmap
- Budget vs. actual progress bars

### Key Sources
- https://teloralife.com/blog/productivity-dashboard-guide-for-2026
- https://dribbble.com/tags/productivity-dashboard
- https://dribbble.com/search/productivity-dashboard-ui

---

## 6. Micro-interactions & Animation

### Number Ticker / Count-Up Animation

**When to use:** On KPI cards when they first mount or on value change. Creates a sense of liveness without distracting.

**Implementation options (React):**
- **Motion (Framer Motion sibling):** `AnimateNumber` component — 2.5kb, spring physics, Intl.NumberFormat support
- **Build UI recipe:** Digit-by-digit spring animation using absolute positioning
- **Magic UI:** Number Ticker component with scroll-triggered start
- **Custom hook:** `useCountUp` with configurable duration, easing, formatting

**Best practices from research:**
- Duration: 800–1200ms for most KPI numbers
- Easing: Ease-out (or spring with low bounce for premium feel)
- Only animate the integer portion, not the decimal
- Use `Intl.NumberFormat` for locale-aware currency/compact formatting
- Start animation when card enters viewport (IntersectionObserver)
- Respect `prefers-reduced-motion` — show final value immediately

### Card Hover States

**Premium card hover patterns (Dribbble research):**
- **Subtle lift:** `translateY(-2px)` + shadow increase on hover
- **Glow:** `box-shadow: 0 0 20px rgba(accent, 0.15)` on dark themes
- **Border highlight:** Animated gradient border on hover
- **Scale sparkline:** Sparkline chart subtly scales up to fill card
- **Reveal action:** Hover reveals "drill down" or "more info" CTA
- **Data pulse:** The primary number pulses once on first hover

**Transition spec:**
- Duration: 200–300ms
- Easing: ease-out for lift, ease-in-out for glow
- Properties: transform, box-shadow only (GPU-composited)

### Dashboard Micro-interaction Patterns

| Pattern | Description | Timing |
|---------|-------------|--------|
| Skeleton shimmer | Content-shaped placeholder pulses | Until data loads |
| Number count-up | KPI value animates from 0 to real | 800ms on mount |
| Sparkline draw | Line chart draws left-to-right | 600ms on mount |
| Progress fill | Circular/bar progress animates to value | 500ms on mount |
| Stagger reveal | Cards appear sequentially with fade+slide | 50ms stagger interval |
| Badge pulse | New notification badge pulses | Subtle, infinite |
| List update | New row slides in, old one slides out | 300ms |
| Filter transition | Cards smoothly rearrange on filter change | 300ms layout animation |

### GSAP vs. Motion (Framer Motion)
- **GSAP:** Better for complex timeline sequences, SVG drawing, ScrollTrigger
- **Motion/Framer Motion:** Better for React-native layout animations, spring physics, AnimatePresence exit animations
- For Shodasha (Next.js + shadcn): **Motion is the default** — use GSAP only for complex timeline/scroll work

### Key Sources
- https://motion.dev/docs/react-animate-number
- https://magicui.design/docs/components/number-ticker
- https://buildui.com/recipes/animated-counter
- https://dribbble.com/shots/27059923-Animated-Analytics-Dashboard-Cards
- https://github.com/Aftab7721/premium-saas-dashboard

---

## 7. Glassmorphism & Dark Mode

### 2026 Dark Mode Best Practices

**From Snixrs, Lucky Graphics, Stan.vision:**
- Avoid pure black (`#000000`) — use dark grays for depth
  - Surface 0: `#0a0a0b` (deepest)
  - Surface 1: `#111113` (card background)
  - Surface 2: `#1a1a1d` (elevated card)
  - Surface 3: `#222226` (hover/active)
- Ensure sufficient contrast — never < 4.5:1
- Dark mode toggle saves to localStorage
- Use `prefers-color-scheme` for initial detection
- Avoid color inversion — design dark palette separately

**Glassmorphism in dark mode:**
```css
.dark-glass {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### When to Use Glassmorphism (vs. When Not To)

**✅ Use on:**
- Hero KPI cards (creates depth against background)
- Sidebar panels (floating over content)
- Modal overlays
- Profile cards
- Navigation bars over illustrative backgrounds

**❌ Avoid on:**
- Data tables (reduces legibility)
- Form inputs (contrast issues)
- Content-heavy areas (text readability)
- Dense chart areas (visual noise)

### The "Layered Bento" Pattern (Lucky Graphics 2026)
Bento grids now use Z-axis layering — cards can stack on each other for "drill-down" without leaving the grid. Stacking cards with different glass opacity levels creates a sense of physical depth.

### Key Sources
- https://rajeshrnair.com/blog/design/ui-ux/ui-design-trends-2026-bento-grids-glassmorphism.html
- https://www.inspoai.io/blogs/glassmorphism-ui-design
- https://snixrs.github.io/blog/ui-trends-2026
- https://lucky.graphics/learn/ui-design-trends-2026

---

## 8. Edge States

### Loading States

**Skeleton screens (best practice from Setproduct, PatternFly):**
- Match final layout exactly (same tile dimensions)
- Use shimmer animation: gradient sweep at 45° angle
- Duration: 1.2s animation loop with 1s pause
- Show skeleton immediately, not after a delay
- For charts: show skeleton chart outline (bars/lines as gray blocks)

```css
.skeleton {
  background: linear-gradient(
    90deg, 
    var(--skeleton-base) 25%, 
    var(--skeleton-shine) 50%, 
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

**Progressive loading (Datadog pattern):**
- Load tiles in priority order: hero → metric → chart → accent
- Each tile independently shows skeleton until its data is ready
- First viewport loads first — below-fold tiles lazy-load

### Empty States

**From every major source reviewed:**
- Name what will appear here ("Your habits will appear here")
- Offer the one action that fills the state ("Add your first habit")
- Use illustration (subtle, not cartoonish) or icon
- Never show a blank canvas — it reads as broken
- Empty state for filtered results: "No results match your filter" + clear filter action

### Error States
- Inline error on the tile that failed (not a toast for the whole dashboard)
- "Failed to load" + retry button
- Show cached/stale data with a subtle "Data may be outdated" badge
- Error illustration (minimal, not alarming)

### Key Sources
- https://www.setproduct.com/blog/dashboard-ui-design
- https://www.patternfly.org/patterns/dashboard/design-guidelines

---

## 9. Typography & Hierarchy

### Font Recommendations from Research

| Source | Font Used | Notes |
|--------|-----------|-------|
| Habit Intelligence | Space Grotesk | Modern, geometric, open-source |
| Setproduct kits | Inter, Manrope | Clean, high x-height |
| Material X UI kit | Manrope | Versatile sans-serif |
| Untitled UI | Inter | Industry standard |
| Premium dashboards (Muzli) | Inter, SF Pro, JetBrains Mono (for data) | — |

**Recommended stack for Shodasha:**
- **UI text:** Inter (sans-serif, high legibility at small sizes)
- **Data/numbers:** JetBrains Mono or SF Mono (tabular figures, monospaced for KPI alignment)
- **Headings:** Inter Medium/Semibold at 2.5rem for hero metrics

### Typography Scale for Dashboards
- Hero KPI: 2.5rem / 700 weight
- Secondary metric: 1.5rem / 600 weight
- Card title: 0.875rem / 500 weight (uppercase or sentence case)
- Context label: 0.75rem / 400 weight
- Small stat: 0.75rem / 500 weight

### Visual Hierarchy Rules
1. **Squint test:** Blur the screen — the shapes that remain visible are your hierarchy
2. **F-pattern:** Top-left to right, then down — place most critical KPIs in top-left
3. **Size = importance:** Never give two metrics the same size unless they're equally important
4. **Whitespace is not empty:** It's a layout element. Use it to group/separate.

### Key Sources
- https://www.harospecdata.com/blog/kpi-dashboard-design
- https://www.setproduct.com/blog/dashboard-ui-design

---

## 10. Synthesized Palette & Component Blueprint

### Proposed Color System for Shodasha

**Dark theme (primary — productivity app convention):**

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| --bg-primary | `#f8f9fa` | `#0a0a0f` | Page background |
| --bg-surface | `#ffffff` | `#111115` | Card/surface |
| --bg-elevated | `#f0f1f3` | `#1a1a1f` | Hovered card |
| --text-primary | `#1a1a2e` | `#f1f1f6` | Primary text |
| --text-secondary | `#6b7280` | `#9ca3af` | Secondary/context |
| --text-muted | `#9ca3af` | `#6b7280` | Labels, meta |
| --accent-blue | `#3b82f6` | `#60a5fa` | Primary accent |
| --accent-purple | `#8b5cf6` | `#a78bfa` | Gamification/habits |
| --accent-amber | `#f59e0b` | `#fbbf24` | Energy/focus |
| --accent-emerald | `#10b981` | `#34d399` | Health/habits |
| --accent-pink | `#ec4899` | `#f472b6` | Social/reminders |
| --status-green | `#22c55e` | `#22c55e` | Positive |
| --status-amber | `#f59e0b` | `#f59e0b` | Warning |
| --status-red | `#ef4444` | `#ef4444` | Critical |
| --border | `#e5e7eb` | `#1f1f24` | Card borders |
| --glass-bg | `rgba(255,255,255,0.7)` | `rgba(255,255,255,0.05)` | Glassmorphism |
| --glass-border | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` | Glass border |

### Component Blueprint for a Habit/Productivity Dashboard

**Page layout (desktop):**
```
┌──────────────────────────────────────────────┐
│ [Nav tab bar: Board | Habits | Timeline | ...] │
├──────────┬───────────────────────────────────┤
│          │  ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│ Sidebar  │  │KPI│ │KPI│ │KPI│ │KPI│         │
│ (profile,│  └───┘ └───┘ └───┘ └───┘         │
│  filters) │  ┌─────────────────────┐ ┌────┐ │
│          │  │ Main chart/radar     │ │Mini│ │
│          │  │                      │ │stat│ │
│          │  └─────────────────────┘ └────┘ │
│          │  ┌─────────┐ ┌─────────┐         │
│          │  │ Activity │ │ Streaks/ │         │
│          │  │ list     │ │ heatmap  │         │
│          │  └─────────┘ └─────────┘         │
└──────────┴───────────────────────────────────┘
```

**Key component list:**

1. **KPI Card** — Big number + icon + delta + sparkline (glass variant for hero cards)
2. **Radar Chart** — Habit attribute visualization (Recharts + custom styling)
3. **Habit List** — Checkable items with streak indicator, category color dot
4. **Streak Heatmap** — 60-day or 12-week grid (like GitHub) with intensity colors
5. **Progress Ring** — Circular XP progress to next level
6. **Time Series Chart** — 7/30/90 day trend (Recharts area/line)
7. **Category Donut** — Time spent per category breakdown
8. **Activity Feed** — Chronological log of completions with filtering
9. **Level Badge** — Current level with XP bar and next level target
10. **Empty State** — Illustration + CTA for first habit creation

### Animation Implementation Plan

| Element | Animation | Library | Trigger |
|---------|-----------|---------|---------|
| KPI numbers | Count-up (spring, 0→value) | Motion `AnimateNumber` | On mount + viewport |
| Radar chart | Polygon draw (path length) | Motion `pathLength` | On mount |
| Cards | Stagger fade+slide-up | Motion `staggerChildren` | On mount |
| Sparklines | Left-to-right draw | Motion `pathLength` | On mount |
| Progress rings | Arc draw (stroke-dashoffset) | Motion `pathLength` | On mount |
| Tab transitions | Slide + opacity crossfade | Motion `AnimatePresence` | On tab change |
| Hover state | Lift + glow shadow | CSS transition | On hover |
| Badge notifications | Pulse scale | CSS animation | On new count |
| Skeleton loading | Shimmer gradient sweep | CSS animation | While loading |

### Accessibility Baseline (WCAG 2.2 AA)
- Contrast: 4.5:1 text, 3:1 large text/UI
- Touch targets: 44×44px minimum
- Focus-visible rings on all interactive elements
- `prefers-reduced-motion`: disable all animations, show final state immediately
- `prefers-color-scheme`: respect for initial theme
- ARIA labels on all chart containers
- `aria-live="polite"` on real-time data updates
- Keyboard navigation in DOM order (not visual order)
- Skip links for grids with 10+ interactive tiles

---

*Research compiled July 29, 2026 from 40+ sources including Dribbble, Behance, Muzli, Setproduct, Orbix Studio, Superfiles, PatternFly, Dell DDS, AppDeck, Harospec, and live products (Selv, SkillRadar, Habit Intelligence, Habit Radar).*
