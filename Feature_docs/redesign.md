# Shodasha — Redesign Brief

> **Date:** 2026-07-24
> **Status:** Research complete, ready for implementation
> **Base research:** `research-competing-apps.md` · `research-shodasha-audit.md` · `research-ui-libraries.md` · `research-design-principles.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Core Problem](#2-the-core-problem)
3. [Design Philosophy — Operate Mode for Shodasha](#3-design-philosophy--operate-mode-for-shodasha)
4. [UI Architecture Redesign](#4-ui-architecture-redesign)
5. [Dashboard Redesign](#5-dashboard-redesign)
6. [Habits Redesign](#6-habits-redesign)
7. [Timeline Redesign](#7-timeline-redesign)
8. [Board Redesign](#8-board-redesign)
9. [Settings Redesign](#9-settings-redesign)
10. [Navigation Redesign](#10-navigation-redesign)
11. [Chart & KPI Specification](#11-chart--kpi-specification)
12. [Micro-interactions & Animation Spec](#12-micro-interactions--animation-spec)
13. [Notification System](#13-notification-system)
14. [Data Model & Metric Improvements](#14-data-model--metric-improvements)
15. [Library Installation Plan](#15-library-installation-plan)
16. [Implementation Phases](#16-implementation-phases)

---

## 1. Executive Summary

### Current State
Shodasha has all the right features: passive time tracking, kanban board, habit tracking with achievements, timeline analytics. But it feels "wired together" rather than designed. The audit found 10 critical issues (missing `'use client'`, undefined CSS variables, bug in deleteColumn, no loading states, no error handling, competing theme systems, etc.) and dozens of UX problems: too many metrics per page, no empty/loading/error states, inconsistent navigation colors, fonts not loaded, hardcoded colors bypassing tokens.

### Target State
A productivity app that users open to **see their progress at a glance** — not to figure out what they're looking at. The app should feel like a personal command center: information-dense but scannable, animated but purposeful, professional but warm. The user should feel the app *knows them* without them configuring anything.

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mode | **Operate** | Productivity dashboard — scanability, density, consistency |
| Typography | **Single family (Geist)** | One face for headings, body, data, labels |
| Accent | **Single emerald** (keep existing) | Consistent with current brand, proven in ui-context |
| Charts | **Recharts + custom SVGs** | Production charts + custom visual metaphors |
| Animations | **Motion (already installed)** — no GSAP | Covers all needs: springs, layout, AnimatePresence |
| Primary library | **shadcn/ui** | Lightweight, complementary to Tailwind v4 + Motion |
| Toasts | **Sonner** | Emil Kowalski polish — instant trust |
| Command palette | **cmdk** | ⌘K navigation for power users |
| Data visualization | **Recharts** (Tier 1) + **Nivo Calendar** (Tier 2) | Charting + habit heatmap |

---

## 2. The Core Problem

### What Users Feel (from research + audit)

1. **"I don't know where to look first."** — Dashboard shows 5+ sections with fractional metrics (`3 / 10 (30%)`), multiple time formats, and no priority hierarchy.
2. **"What does this number mean?"** — No context, no benchmarks, no color coding. Is 30% good or bad?
3. **"Why does it look different every tab?"** — Navbar tabs have 5 different colors. Habit components use different CSS variables than Dashboard. The "doppelrand" double-bezel pattern appears only in Timeline and Settings.
4. **"I cleared my data but it came back."** — The Clear Database button only clears localStorage, not SQLite.
5. **"Nothing works until data arrives."** — No loading skeletons, no empty states. Components render empty defaults (`0 / 0`, `0%`, empty SVG charts) until async data finishes loading.
6. **"The fonts don't look right."** — Cabinet Grotesk, Inter, and JetBrains Mono are declared but never loaded. The app falls back to system fonts.
7. **"Why are my habits invisible?"** — 11 undefined CSS variables cause habit components to render without borders, backgrounds, or colors.

### What Competing Apps Do Better

| Need | Forest | KUBBO | Finch | Todoist | Shodasha |
|------|--------|-------|-------|---------|----------|
| At-a-glance progress | ✅ Forest of trees | ✅ City growing | ✅ Pet mood | ✅ Today list | ❌ Fractional metrics |
| Immediate feedback | ✅ Tree grows | ✅ XP + Gold | ✅ Pet cheers | ✅ Check mark | ❌ Silent |
| Empty state teaching | ✅ "Plant your first tree" | ✅ Pre-built world | ✅ Hatch pet | ✅ Sample tasks | ❌ Blank screen |
| Loading state | ✅ Skeleton | ✅ Skeleton | ✅ Skeleton | ✅ Skeleton | ❌ None |
| Error handling | ✅ Graceful | ✅ Graceful | ✅ Graceful | ✅ Graceful | ❌ Silent console log |
| One clear entry point | ✅ Timer | ✅ Today's habits | ✅ Pet + goals | ✅ Today view | ❌ 5 sections competing |
| Design consistency | ✅ Single palette | ✅ Single theme | ✅ Pastel system | ✅ Red accent | ❌ 5 nav colors |

---

## 3. Design Philosophy — Operate Mode for Shodasha

Synthesized from all 10+ design skills. The Operate mode governs everything.

### The Core Principle

> **The tool disappears into the task.** Users are in flow. Don't make them wait for choreography or decipher what they're looking at.

### Design Values (ranked by importance)

1. **Scanability** — The user should know their status in <1 second. Progress rings, not paragraphs.
2. **Consistency** — Same affordance, same behavior, same place. One accent. One component vocabulary.
3. **Density with hierarchy** — Information-dense but structured. Hairline borders, generous section gaps.
4. **Purposeful motion** — Every animation conveys state: completion, transition, feedback. No decoration.
5. **Forgiving** — Shame-free streaks. Grace periods. Restorable setbacks, not punishment.
6. **Personal without being cutesy** — The data tells the story. No cartoon characters, no RPG classes. The user's own patterns are the "character."

### What Shodasha Is Not

- Not a game (Habitica, MainQuest)
- Not a self-care pet (Finch, Cheerly)  
- Not a city builder (KUBBO)
- Not a minimalist todo-only app (Todoist)
- Not a customizable sandbox (LifeUp)

**Shodasha is a personal command center for people who want to understand their own productivity patterns.** The visual metaphor is a control panel that gets smarter the more you use it.

---

## 4. UI Architecture Redesign

### 4.1 Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR: Brand | Tabs (Dashboard Board Habits Timeline) |  │
│           Tracking dot | Theme toggle | ⌘K                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │               MAIN CONTENT AREA                        │  │
│  │                                                        │  │
│  │   (Each page follows its own bento grid layout)        │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  STATUS BAR (optional): Streak summary | Today's focus time  │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Global Design Tokens (CSS Variables)

These replace the current inconsistent system. Every component uses these.

```css
:root {
  /* Typography */
  --font-ui:    "Geist", system-ui, -apple-system, sans-serif;
  --font-mono:  "Geist Mono", "SF Mono", "JetBrains Mono", monospace;

  /* Spacing (4pt scale) */
  --space-3xs: 0.125rem;   /* 2px — focus rings */
  --space-2xs: 0.25rem;    /* 4px — tight icon spacing */
  --space-xs:  0.5rem;     /* 8px — tight group internal */
  --space-sm:  0.75rem;    /* 12px — component internal */
  --space-md:  1rem;       /* 16px — default gap */
  --space-lg:  1.5rem;     /* 24px — between sections */
  --space-xl:  2rem;       /* 32px — major section breaks */
  --space-2xl: 3rem;       /* 48px — page-level padding */

  /* Radius */
  --radius-sm: 4px;        /* inputs, compact elements */
  --radius-md: 8px;        /* cards, buttons */
  --radius-lg: 12px;       /* modals, drawers */
  --radius-pill: 9999px;   /* badges, FABs */

  /* Easing */
  --ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Duration */
  --dur-micro: 120ms;      /* button press, hover */
  --dur-short: 220ms;      /* toggle, tooltip */
  --dur-long:  420ms;      /* modal, drawer, page transition */

  /* Z-index */
  --z-base:     1;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    400;
  --z-toast:    500;
  --z-tooltip:  600;

  /* Colors — Light mode */
  --color-paper:          oklch(97% 0.008 80);   /* off-white background */
  --color-paper-elevated: oklch(100% 0 0);        /* white for cards */
  --color-rule:           oklch(88% 0.008 80);    /* hairline borders */
  --color-neutral:        oklch(55% 0.008 80);    /* secondary text */
  --color-muted:          oklch(45% 0.008 70);    /* tertiary text */
  --color-ink:            oklch(18% 0.01 60);     /* primary text */
  --color-accent:         oklch(55% 0.19 250);    /* emerald — actions */
  --color-success:        oklch(50% 0.15 150);    /* green — habits */
  --color-warning:        oklch(55% 0.15 80);     /* amber — thresholds */
  --color-error:          oklch(50% 0.18 30);     /* red — errors */
}

/* Dark mode — only lightness/chroma change, hues stay */
[data-theme="dark"] {
  --color-paper:          oklch(14% 0.008 40);
  --color-paper-elevated: oklch(18% 0.01 40);
  --color-rule:           oklch(28% 0.008 40);
  --color-neutral:        oklch(55% 0.008 40);
  --color-muted:          oklch(70% 0.006 40);
  --color-ink:            oklch(94% 0.006 80);
  --color-accent:         oklch(65% 0.19 250);
}
```

### 4.3 Component Library Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Foundations** | Custom CSS variables + Tailwind v4 | Colors, spacing, typography, radius, easing |
| **Animations** | Motion (v12) | Springs, layout animations, AnimatePresence |
| **Primitives** | shadcn/ui (Radix-based) | Dialog, Drawer, Popover, Tooltip, Dropdown |
| **Data display** | shadcn/ui Table + Recharts | Tables, charts, data grids |
| **Feedback** | Sonner | Toasts for async operations |
| **Navigation** | Custom (refined gooey tabs) + cmdk | Top tabs + ⌘K |
| **Custom widgets** | Copy-paste from Magic UI + Animata | Number Ticker, Circular Progress, Timeline |
| **Icons** | Lucide React (already installed) | All icons, outlined only |

### 4.4 Component Composition Rules

1. **Each page has exactly one top-level component** (e.g., `DashboardPage`, `HabitsPage`)
2. **Every component handles 4 states:** loading, empty, error, full data
3. **No nested cards** — single containment layer
4. **All async data flows through a shared loading pattern** (`isLoading` → skeleton → content or error)
5. **No inline styles** — all visual tokens come from CSS variables or Tailwind

---

## 5. Dashboard Redesign

### 5.1 Current Problems

- 5 competing sections with no visual hierarchy
- Fractional metrics everywhere (`3 / 10 (30%)`)
- "Today" timestamps on all activity feed items (bug)
- Habit quick-toggles show blank card on empty
- Missing `'use client'` directive (build will fail)
- No loading/error states

### 5.2 Redesigned Layout

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌────────────────────────────────────┐  │
│  │            │  │  Good morning, [name]               │  │
│  │  Progress  │  │  You're on a 12-day streak 🔥      │  │
│  │  Ring      │  │  4 of 6 habits done today          │  │
│  │  67%       │  │  3 tasks remaining                 │  │
│  │            │  │                                     │  │
│  └────────────┘  │  [Week mini-grid ███░█████░░█]     │  │
│                   └────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Focus Today  │  │ Tasks Done   │  │ Habits Done    │  │
│  │  2h 34m      │  │  7 / 10      │  │  4 / 6         │  │
│  │  ▲ 12% vs wk │  │  2 overdue   │  │  Best: Health  │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌───────────────────────┐  │
│  │  Time Distribution       │  │  Quick Task Input     │  │
│  │  [Stacked bar: work/     │  │  [________________]  │  │
│  │   neutral/distraction]   │  │  [+ Add]             │  │
│  └──────────────────────────┘  └───────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │  Insight of the Day                                │  │
│  │  "You're most focused between 9:30-11:30am.       │  │
│  │   Your morning sessions average 24min longer       │  │
│  │   than afternoon sessions."                        │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 5.3 Component Changes

| Component | Change | Priority |
|-----------|--------|----------|
| `TodayProgressCard` | Replace with progress ring + KPI hero numbers. Fix `'use client'`. | P0 |
| `QuickTaskInput` | Add success feedback (Sonner toast). | P1 |
| `HabitQuickToggle` | Show meaningful empty state: "Add your first habit to get started" with link to Habits. | P1 |
| `TimeDistributionChart` | Replace with Recharts AreaChart or Tremor CategoryBar. Add empty state. | P1 |
| `RecentActivityFeed` | Fix timestamp to show relative time ("2h ago", "yesterday"). Add empty state. | P1 |
| New: `InsightCard` | AI-generated daily insight (from passive data). Rotating pool of 5-6 pattern types. | P2 |

### 5.4 KPI Hero Numbers

Each stat card shows:
- **One large number** (tabular, monospace)
- **Small label** below
- **Mini sparkline** (optional — trend indicator)
- **Delta** ("▲ 12% vs last week") — only when meaningful

No fractional displays (`3 / 10`). Use progress rings instead.

---

## 6. Habits Redesign

### 6.1 Current Problems

- 11 undefined CSS variables — components render invisibly
- Massive page (110 lines in page.tsx driving ~1,500 lines of components)
- No loading/empty/error states on any component
- No per-habit streak tracking (only global streak)
- 3 chart types (line, rings, bars) all on one page — overwhelming
- 24-week heatmap forces horizontal scroll (`min-w-[650px]`)
- Hardcoded `#10b981` for SVG strokes (won't update with accent color change)

### 6.2 Redesigned Layout

```
┌──────────────────────────────────────────────────────────┐
│  Habits  [Add Habit +]                    [Week] [Month] │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │  Weekly Completion │  │  Habit Summary Cards        │  │
│  │  7-bar chart       │  │  ┌────────────────────┐    │  │
│  │  (Recharts)        │  │  │ Exercise  ██████░░ 80%│    │  │
│  │                    │  │  │ 12-day streak ●      │    │  │
│  │ [████░░░░███]     │  │  └────────────────────┘    │  │
│  └──────────────────┘  │  ┌────────────────────┐    │  │
│                        │  │ Reading   █████░░░ 60%│    │  │
│  ┌──────────────────┐  │  │ 5-day streak  ●      │    │  │
│  │  Monthly Calendar  │  │  └────────────────────┘    │  │
│  │  (Nivo or custom)  │  │  ┌────────────────────┐    │  │
│  │                    │  │  │ Meditate  ████████ 90%│    │  │
│  │ [grid of days]     │  │  │ 8-day streak  ●     │    │  │
│  │ checkmarks + shade │  │  └────────────────────┘    │  │
│  └──────────────────┘  └──────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  Achievements (existing, refine) — keep but better       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│  │Seed│ │Mom │ │HFP │ │Tita│ │Sent│ │Half│ │Leg │     │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │
└──────────────────────────────────────────────────────────┘
```

### 6.3 Key Changes

1. **Fix all CSS variables** — Define `--accent-emerald`, `--bg-secondary`, `--border-subtle`, etc. in globals.css
2. **Replace custom SVG charts with Recharts** — Bar for weekly, Calendar heatmap for monthly
3. **Add per-habit streak** to each summary card
4. **Add loading skeleton** for every component
5. **Add empty state** ("Create your first habit to start tracking")
6. **Fix hardcoded emerald** — Use CSS variable `var(--color-accent)` so charts respect accent color setting
7. **Achievements** — Keep the existing 7-tier system but connect it to the visual metaphor (see Section 12)

---

## 7. Timeline Redesign

### 7.1 Current Problems

- Duplicate data shown 3 ways (KPI grid + cumulative chart + category ring = same time data represented thrice)
- Hidden date input (`opacity-0`) — users won't discover it
- 15-second auto-refresh is too frequent for a desktop app
- KPI grid uses ALL CAPS eyebrow labels ("SYSTEM ON-TIME") — hard to read
- No empty/loading states
- `getCumulativeScreenTimeFiltered` returns hardcoded mock data, not real cumulative points

### 7.2 Redesigned Layout

```
┌──────────────────────────────────────────────────────────┐
│  Timeline  [◀]  [Date Display]  [▶]  [Today]           │
│            [Work] [All] [Distraction]                   │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │  Focus Time — Day Overview (Recharts AreaChart)    │  │
│  │  [█▄██▄▄██████████▄▄▄███████▄▄▄▄████████▄▄█]      │  │
│  │  8am    10am    12pm    2pm    4pm    6pm    8pm   │  │
│  └────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Focus 4h 12m │  │ Distract 34m │  │ Switches 47    │  │
│  │ ████████ 78% │  │ ██░ 12%      │  │ (per hour)     │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │  Activity Stream (compact, grouped by app)          │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ 10:32 - 11:15  Code.exe · src/stores/habits  │  │  │
│  │  │              Focus · [Link to task: "Impl..] │  │  │
│  │  ├──────────────────────────────────────────────┤  │  │
│  │  │ 11:15 - 11:20  Slack.exe · #general          │  │  │
│  │  │              Neutral                          │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 7.3 Key Changes

1. **Replace hidden date input** with clickable date display that opens a shadcn/ui DatePicker (visible, discoverable)
2. **Reduce auto-refresh** to 60 seconds (or on-demand with a refresh button)
3. **Remove duplicate charts** — Keep only the AreaChart (focus timeline) + 3 compact KPI stat cards
4. **Fix ALL CAPS labels** → sentence case ("Focus time" not "FOCUS TIME")
5. **Replace mock cumulative data** with real computed data from time entries
6. **Add loading skeleton** for the area chart
7. **Add empty state** for days with no tracking data
8. **Activity stream** — Keep the doppelrand pattern for visual distinction, but extract into a shared `StreamCard` component

---

## 8. Board Redesign

### 8.1 Current Status

The Board is actually in good shape — the simplest page with the fewest issues. Keep the current kanban structure.

### 8.2 Changes Required

| Issue | Fix | Priority |
|-------|-----|----------|
| `deleteColumn` bug (`task.id === id` should be `task.status === id`) | Fix comparison | P0 |
| `isMounted` flash on initial render | Use `suppressHydrationWarning` or SSR-safe pattern | P1 |
| No loading state | Add skeleton columns | P1 |
| No toast on task create/delete | Add Sonner notification | P1 |
| Task modal has no validation feedback | Add inline validation | P1 |

---

## 9. Settings Redesign

### 9.1 Current Status

Settings is the best-designed page (working barrel exports, all interaction patterns solid). Primary issues are functional.

### 9.2 Changes Required

| Issue | Fix | Priority |
|-------|-----|----------|
| "Clear Database" doesn't clear SQLite | Call SQLite clear command + reload | P0 |
| Two competing theme systems (uiStore vs settingsStore) | Consolidate to settingsStore only | P0 |
| IPC commands missing from capabilities | Audit db.ts → register all commands | P0 |
| Font files not loaded via next/font | Add font loading in layout.tsx | P1 |

---

## 10. Navigation Redesign

### 10.1 Current Problems

1. 5 different tab colors (emerald, teal, violet, amber, stone) violate "single accent locked" rule
2. Tagline "Time & Focus" at 10px is nearly illegible
3. Window controls appear in browser (non-Tauri) mode — broken affordance
4. No ⌘K command palette

### 10.2 Redesigned Top Bar

```
┌──────────────────────────────────────────────────────────┐
│  十六 SHODASHA | Dashboard Board Habits Timeline Settings │ ● Live  🌓  ⌘K
│                   ↑ single accent color                   ↑track  ↑theme ↑cmd
└──────────────────────────────────────────────────────────┘
```

### 10.3 Changes

1. **Single accent color on all tabs** — The active tab pill uses `var(--color-accent)`, inactive tabs use `var(--color-neutral)`. Remove the per-tab color assignment.
2. **Remove tagline** "Time & Focus" — brand mark is sufficient
3. **Hide window controls in non-Tauri mode** — conditionally render
4. **Add ⌘K trigger** — opens cmdk command palette
5. **Keep gooey tabs** — they're distinctive and work well. Just fix the colors.

### 10.4 ⌘K Command Palette

The command palette should feel like Raycast — instant, no animation on open/close:

| Command | Action |
|---------|--------|
| `⌘K` → type page name | Navigate to page |
| `⌘K` → type habit name | Open habit detail |
| `⌘K` → "Add Task" | Open quick task modal |
| `⌘K` → "New Habit" | Open add habit modal |
| `⌘K` → "Settings" | Navigate to settings |
| `⌘K` → date | Navigate timeline to date |

---

## 11. Chart & KPI Specification

### 11.1 Chart Library Decision

**Primary: Recharts (npm install recharts)** — for bar, line, area, pie charts
**Secondary: Custom SVG** — for progress rings, heatmap (keep what works)
**Tertiary: Nivo Calendar** — only for habit contribution calendar (if needed)

### 11.2 Chart by Surface

| Surface | Chart Type | Library | Why |
|---------|------------|---------|-----|
| **Dashboard** — Time distribution | Stacked horizontal bar | Recharts (BarChart with stacked) | Shows work/neutral/distraction at a glance |
| **Dashboard** — Weekly completion | 7-bar chart | Recharts (BarChart) | Day-over-day comparison |
| **Dashboard** — Daily progress | Circular progress ring | Custom SVG (keep existing) | Quick glance, shows % complete |
| **Dashboard** — Focus trend | Mini sparkline | Custom SVG (simple polyline) | Trend indicator for KPI cards |
| **Habits** — Weekly completion | 7-bar chart | Recharts (BarChart) | Consistent with dashboard |
| **Habits** — Monthly calendar | Day grid with shading | Nivo Calendar or custom | Shows patterns across month |
| **Habits** — Per-habit rings | Donut rings | Custom SVG (existing, fix colors) | Circular progress per habit |
| **Habits** — Consistency heatmap | 24-week grid | Custom SVG (existing, fix CSS vars) | Long-term pattern view |
| **Timeline** — Day overview | Area chart | Recharts (AreaChart) | Time distribution across hours |
| **Timeline** — App breakdown | Horizontal bar list | Recharts (BarChart horizontal) | Top apps ranked |
| **Board** — N/A | No charts | — | Kanban doesn't need charts |

### 11.3 Chart Styling Rules

1. **All chart colors use CSS variables** — `var(--color-accent)`, `var(--color-success)`, etc. Never hardcoded.
2. **No gridlines** — Clean chart backgrounds. Data speaks.
3. **No 3D, no gradients, no shadows** on chart elements
4. **Tooltips are minimal** — borderless, single font, measure only, no decorative pointers
5. **Responsive via `ResponsiveContainer`** (Recharts) — never hardcoded width
6. **Animation on mount only** — spring-based entry, not looping
7. **All charts respect `prefers-reduced-motion`**
8. **Empty state** — Show "No data yet" with illustration, not a zero-filled chart

### 11.4 KPI Display Rules

```
┌──────────────────────┐
│  2h 34m              │  ← Hero number: tabular-nums, font-mono, bold
│  Focus time today    │  ← Label: sentence case, neutral
│  ▲ 12% vs last week  │  ← Delta: only when meaningful, green/amber/red
└──────────────────────┘
```

- **Hero number**: `font-family: var(--font-mono)`, `font-variant-numeric: tabular-nums`, `font-weight: 600`
- **Label**: `font-family: var(--font-ui)`, `font-size: 0.875rem`, `color: var(--color-neutral)`
- **Delta**: Only shown when there's a prior period to compare. Green for improvement, red for decline, amber for neutral.
- **Progress ring**: Used instead of fraction text. No `3 / 10` — show a ring at 30%.

---

## 12. Micro-interactions & Animation Spec

### 12.1 Design Philosophy

From Emil Kowalski + Apple Design + Impeccable Operate:

> Silent success is the default. Feedback lives on the press, not the release. Motion conveys state, not decoration.

### 12.2 Animation by Element

| Element | Trigger | Animation | Duration | Easing | Reduced Motion |
|---------|---------|-----------|----------|--------|----------------|
| Button press | `:active` | `scale(0.97)` | 120ms | ease-out | opacity flash |
| Toggle switch | Click | Layout spring | 300ms | spring (bounce:0) | crossfade |
| Card hover | `:hover` | `translateY(-1px)` | 200ms | ease-out | none |
| Modal enter | Mount | Scale 0.95→1 + opacity 0→1 | 300ms | ease-out | opacity crossfade |
| Modal exit | Unmount | Scale 1→0.95 + opacity 1→0 | 200ms | ease-in | opacity crossfade |
| Drawer enter | Mount | Slide from right | 400ms | ease-out | opacity crossfade |
| Drawer exit | Unmount | Slide to right | 250ms | ease-in | opacity crossfade |
| Page transition | Tab change | Crossfade | 250ms | ease-in-out | none |
| Habit toggle | Click | Check icon spring, ring fill | 300ms | spring (bounce:0) | no animation |
| Number tick | Data update | Count up | 400ms | ease-out | instant |
| Toast enter | Trigger | Slide-in from top-right | 400ms | ease-out | slide-in (gentle) |
| Tooltip | Hover (800ms delay) | Fade in | 150ms | ease-out | instant show |
| Dropdown | Click | Expand from top | 200ms | ease-out | instant show |

### 12.3 Micro-interactions Checklist

These are the "invisible details" that make the app feel premium:

| Interaction | Implementation | Reference |
|-------------|---------------|-----------|
| Button instant feedback | `transform: scale(0.97)` on `:active` | Emil + Apple |
| Checkbox press state | Scale down on pointer-down, not on release | Apple |
| Focus ring instant | 2px accent ring, 3px offset, no animation | Emil |
| Tooltip delay | 800ms on hover, 0ms on keyboard focus | Hallmark |
| Toast pause on hover | `onMouseEnter` pauses dismiss timer | Emil |
| Optimistic update | Update UI immediately, revert on error | Hallmark |
| Undo notification | Toast with "Undo" action button | Hallmark |
| Skeleton pulse | Gentle opacity pulse (1s, ease-in-out) | shadcn/ui |
| Stagger list entry | 50ms delay between children on page mount | Motion |
| Tab number change | Animated count-up on data update | Magic UI (Number Ticker) |

### 12.4 What NOT to Animate

- Page-load orchestrated sequences (product UI loads into function)
- Keyboard-initiated actions (⌘K, Enter, Tab)
- Hover-only effects on touch devices
- Infinite loops (except functional loaders)
- `width`, `height`, `top`, `left`, `margin`, `padding` — always use transforms

---

## 13. Notification System

### 13.1 Toast Notifications (Sonner)

Install `sonner`. Wrap app with `<Toaster />`. Notify on:

| Action | Toast Type | Message | Duration |
|--------|-----------|---------|----------|
| Task created | Success | "Task created" | 3s |
| Task deleted | Success + Undo | "Task deleted" [Undo] | 5s |
| Habit toggled | Silent | (no toast — visible outcome) | — |
| Habit created | Success | "Habit created" | 3s |
| Export complete | Success | "Export ready: [filename].csv" | 5s |
| Export failed | Error | "Export failed. Please try again." | 6s |
| DB cleared | Success | "All data cleared" | 4s |
| DB clear failed | Error | "Could not clear database" | 6s |
| Sync/refresh | Loading | "Refreshing..." | until complete |
| SQLite error | Error | "Failed to save. Your data is safe." | 6s |

### 13.2 Reminder Strategy

- **No default notifications** — user must opt in
- **Max 2 notifications per day** (research: more = churn)
- Types: "Habits due today", "Streak at risk" (recoverable)
- All reminders are **local** (no server, no push)
- Respect user's notification schedule (Settings → notification window)

### 13.3 Insight Prompts (Passive)

The app surfaces insights *when the user opens it* — not as notifications:

> **"You've completed all 6 habits for 5 days straight. Your best run yet."** (shown on Dashboard, top)
> **"Your focus time peaks between 9:30-11:30am. Consider blocking this time for deep work."** (shown on Timeline)
> **"You checked your 'Read' habit 80% of days this month. Habit forming."** (shown on Habits page)

These appear as subtle inline cards, not toasts or popups.

---

## 14. Data Model & Metric Improvements

### 14.1 Store Loading State

Every store needs:

```typescript
interface AsyncState {
  isLoading: boolean
  error: string | null
  initialized: boolean
}
```

Currently no store exposes this. Every component that reads from a store must check `isLoading` → show skeleton, `error` → show error banner, `!initialized` → show empty state, `initialized && data` → show content.

### 14.2 Computed Metrics to Add

| Metric | Where | Data Source | Formula |
|--------|-------|-------------|---------|
| **Per-habit streak** | Habits page | `habit_records` | Walk backwards from today, count consecutive days with `done=true` |
| **Best streak per habit** | Habits page | `habit_records` | Max consecutive `done=true` in history |
| **Weekly completion rate** | Dashboard/Habits | `habit_records` | `done_count / (7 * habit_count)` for current week |
| **Focus time by category** | Timeline | `time_entries` + `app_categories` | Sum `durationSeconds` grouped by `category` |
| **Focus efficiency trend** | Timeline | `time_entries` | 7-day rolling average of `focusSec / totalSec` |
| **Peak focus hour** | Dashboard (insight) | `time_entries` | Hour bucket with max `focusSec` over last 14 days |
| **Context switch rate** | Timeline | `time_entries` | Count of entries per hour (current: total count, not normalized) |
| **Deep work blocks** | Timeline | `time_entries` | Sessions > 25min in work-categorized apps |
| **Distraction ratio trend** | Dashboard (insight) | `time_entries` | 7-day rolling average of distraction ratio |
| **Most consistent habit** | Dashboard (insight) | `habit_records` | Habit with highest completion rate over last 30 days |
| **Current streak** (shared utility) | Global | `habit_records` | Extract streak calculation into `src/lib/utils/streak.ts` |

### 14.3 Real Data for Cumulative Chart

The current `getCumulativeScreenTimeFiltered` returns hardcoded mock data. Replace with:

```typescript
getCumulativeScreenTimeReal(): CumulativePoint[] {
  const entries = get().getFilteredEntries()
  // Sort by startTime ascending
  const sorted = [...entries].sort((a, b) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
  // Build cumulative points at hourly intervals
  // Each point: { timestamp: "10:00", cumulativeFocusMins: X, cumulativeTotalMins: Y }
}
```

### 14.4 Migration Strategy

The SQLite DB has a `schema_version` table. Any new computed metrics should:

1. Be computed client-side from existing data (habits, time_entries)
2. Not require schema migration for new computed fields
3. Only require schema changes if new raw data types are needed (e.g., mood/energy)

---

## 15. Library Installation Plan

### 15.1 Tier 1 — Install Now (Foundation)

```bash
# Toast notifications
npm install sonner

# Command palette
npm install cmdk

# Chart library
npm install recharts

# shadcn/ui initialization
npx shadcn@latest init
npx shadcn@latest add card skeleton toast button badge
npx shadcn@latest add dialog drawer dropdown-menu popover
npx shadcn@latest add table progress calendar date-picker
npx shadcn@latest add command empty switch input select
npx shadcn@latest add separator scroll-area
```

### 15.2 Tier 2 — Copy-Paste Components

From **Magic UI** (https://magicui.design):
- `number-ticker` — animated stat counters
- `animated-circular-progress-bar` — habit progress rings
- `magic-card` — dashboard stat cards with hover effect
- `confetti` — celebration on milestones
- `animated-theme-toggler` — dark mode switch

From **Animata** (https://animata.design):
- `weekly-progress` — weekly habit bar chart
- `animated-timeline` — activity timeline
- `counter` — alternative number ticker
- `progress` — linear progress with label
- `skeleton` — loading state components

### 15.3 Tier 3 — Optional

```bash
# Nivo Calendar for habit heatmap
npm install @nivo/calendar @nivo/core
```

### 15.4 Libraries NOT to Install

| Library | Reason |
|---------|--------|
| **GSAP** | Motion (already installed) covers all needs |
| **HeroUI** | Heavier than shadcn/ui, more opinionated |
| **Tremor** | Would overlap with Recharts + shadcn/ui |
| **Vaul** | Already consumed via shadcn/ui Drawer |
| **Radix UI** | Already consumed via shadcn/ui |
| **Ark UI** | Only needed for Color Picker / Tags Input (low priority) |
| **Aceternity UI** | Primarily marketing components; use Magic UI instead |

---

## 16. Implementation Phases

### Phase 1 — Critical Fixes (P0 bugs)

| # | Task | Files |
|---|------|-------|
| 1 | Add `'use client'` to `TodayProgressCard` | `src/components/dashboard/TodayProgressCard.tsx` |
| 2 | Fix 11 undefined CSS variables in globals.css | `src/app/globals.css` |
| 3 | Fix `deleteColumn` bug (task.id → task.status) | `src/stores/taskStore.ts:200` |
| 4 | Fix "Clear Database" to clear SQLite | `src/components/settings/DataManagement.tsx` |
| 5 | Consolidate theme systems (uiStore + settingsStore) | `src/stores/uiStore.ts`, `src/stores/settingsStore.ts` |
| 6 | Register all IPC commands in capabilities | `src-tauri/capabilities/default.json` |

### Phase 2 — Design System Foundations

| # | Task | Details |
|---|------|---------|
| 1 | Define all CSS variables as specified in Section 4.2 | `globals.css` |
| 2 | Fix font loading via next/font | `layout.tsx` |
| 3 | Install shadcn/ui + Sonner + cmdk + Recharts | npm |
| 4 | Add loading/error/initialized state to all stores | All stores |
| 5 | Create shared `LoadingSkeleton`, `EmptyState`, `ErrorBanner` components | `src/components/ui/` |
| 6 | Create shared `formatDuration`, `calculateStreak` utilities | `src/lib/utils/` |
| 7 | Extract streak calculation once, remove duplicates | `src/lib/utils/streak.ts` |
| 8 | Replace hardcoded colors with CSS variables everywhere | All components |

### Phase 3 — Navigation & Shell

| # | Task | Details |
|---|------|---------|
| 1 | Fix tab colors: single emerald accent on all tabs | `Navbar.tsx` |
| 2 | Remove tagline, fix window controls | `Navbar.tsx` |
| 3 | Add ⌘K command palette | New `CommandPalette.tsx`, wire cmdk |
| 4 | Add Sonner `<Toaster />` to root layout | `layout.tsx` |
| 5 | Fix active-tab persistence flash | `gooey-tabs.tsx` |

### Phase 4 — Dashboard Redesign

| # | Task | Details |
|---|------|---------|
| 1 | Replace TodayProgressCard with progress ring + hero stats | `TodayProgressCard.tsx` |
| 2 | Add loading/empty/error states to all dashboard components | Multiple files |
| 3 | Replace TimeDistributionChart with Recharts | `TimeDistributionChart.tsx` |
| 4 | Fix activity feed timestamps (relative time) | `RecentActivityFeed.tsx` |
| 5 | Add meaningful empty state to HabitQuickToggle | `HabitQuickToggle.tsx` |
| 6 | Add InsightCard (rotating text, static pool) | New component |
| 7 | Add Sonner notifications for task/habit actions | `QuickTaskInput.tsx` |

### Phase 5 — Habits Redesign

| # | Task | Details |
|---|------|---------|
| 1 | Fix all undefined CSS variables | `globals.css` |
| 2 | Replace custom SVG charts with Recharts | `HabitAnalyticsDashboard.tsx` |
| 3 | Add per-habit streak tracking | `habitStore.ts` + UI |
| 4 | Add loading states to all habit components | Multiple files |
| 5 | Add empty state (link to create first habit) | `page.tsx` |
| 6 | Fix hardcoded `#10b981` → `var(--color-accent)` | `HabitAnalyticsDashboard.tsx` |

### Phase 6 — Timeline Redesign

| # | Task | Details |
|---|------|---------|
| 1 | Replace hidden input with shadcn DatePicker | `TimelinePage.tsx` |
| 2 | Replace cumulative screentime mock with real data | `timeEntryStore.ts` |
| 3 | Replace duplicate charts with single AreaChart + 3 KPI cards | `TimelinePage.tsx` |
| 4 | Fix ALL CAPS labels → sentence case | `ActivityDistributionChart.tsx` |
| 5 | Add loading/empty states | Multiple files |

### Phase 7 — Polish & Micro-interactions

| # | Task | Details |
|---|------|---------|
| 1 | Add `prefers-reduced-motion` guards to all animated components | 8+ components |
| 2 | Add button press feedback (`scale(0.97)`) to all interactive elements | Global CSS |
| 3 | Add Number Ticker animation to stat cards | Magic UI component |
| 4 | Add Confetti on milestone achievements | Magic UI component |
| 5 | Add stagger entry animations to list pages | Motion variants |
| 6 | Standardize tooltip delay (800ms) and styling | Global |
| 7 | Fix hover/focus states on all interactive elements | Multiple files |
| 8 | Add aria-labels to all icon-only buttons | Multiple files |

### Phase 8 — Passive Insights (The Moat)

| # | Task | Details |
|---|------|---------|
| 1 | Compute peak focus hour from time entries | `src/lib/insights.ts` |
| 2 | Compute best habit/streak for daily insight | `src/lib/insights.ts` |
| 3 | Compute distraction ratio trend (7-day rolling) | `src/lib/insights.ts` |
| 4 | Create rotating insight pool (5-6 pattern types) | `src/lib/insights.ts` |
| 5 | Display on Dashboard as InsightCard | Dashboard |

---

## Appendix: File Change Summary

### New Files to Create

```
src/lib/utils/streak.ts          — Shared streak calculation
src/lib/utils/format.ts          — Shared duration/number formatting
src/lib/insights.ts              — Passive insight generation
src/components/ui/LoadingSkeleton.tsx  — Skeleton component
src/components/ui/EmptyState.tsx       — Empty state component
src/components/ui/ErrorBanner.tsx      — Error banner component
src/components/ui/StreamCard.tsx       — Shared stream card (replaces doppelrand)
src/components/ui/CommandPalette.tsx   — ⌘K command palette
src/components/dashboard/InsightCard.tsx   — Daily insight card
src/components/dashboard/ProgressRing.tsx   — Circular progress ring (or copy from Magic UI)
```

### Files to Modify (P0-P1)

```
src/app/globals.css               — Complete CSS variable overhual
src/app/layout.tsx                — Add fonts, Toaster, command palette
src/stores/uiStore.ts             — Deprecate in favor of settingsStore
src/stores/settingsStore.ts       — Add theme as single source of truth
src/stores/timeEntryStore.ts      — Add loading/error state, real cumulative data
src/stores/taskStore.ts           — Fix deleteColumn bug
src/stores/habitStore.ts          — Add per-habit streak, loading state
src/components/dashboard/TodayProgressCard.tsx — Add 'use client', redesign
src/components/dashboard/TimeDistributionChart.tsx → Recharts
src/components/habits/HabitAnalyticsDashboard.tsx → Recharts, fix colors
src/components/habits/HabitCalendar.tsx → Fix CSS vars
src/components/habits/HabitHeatmap.tsx → Fix CSS vars
src/components/layout/Navbar.tsx → Fix colors, remove tagline
src/components/settings/DataManagement.tsx → Fix Clear Database
src/components/timeline/TimelinePage.tsx → DatePicker, remove duplicates
src/components/timeline/LineChart.tsx → Recharts or keep with fixes
src/components/timeline/RingChart.tsx → Recharts or keep with fixes
src/components/timeline/BarChart.tsx → Recharts or keep with fixes
```

### Files to Remove

```
components/dashboard/index.ts (empty barrel)
components/board/index.ts (empty barrel)
components/habits/index.ts (empty barrel)
components/timeline/index.ts (empty barrel)
```

---

*End of redesign brief. This document should be read alongside the 4 research documents for full context. Ready for implementation.*
