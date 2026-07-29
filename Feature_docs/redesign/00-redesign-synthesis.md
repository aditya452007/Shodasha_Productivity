# Shodasha — Premium UI/UX Redesign: Unified Synthesis

> **Date:** 2026-07-29
> **5 parallel research agents completed**
> **Skills used:** design-basics · premium-design · high-end-visual-design · emil-design-eng · apple-design · ui-checklist · color-expert · impeccable · gsap-core · find-animation-opportunities

---

## Executive Summary

The Shodasha app has **strong foundations** (solid store architecture, live data, clean layout) but the UI layer needs a **systematic premium upgrade**. 5 parallel agents diagnosed the following key findings:

| Dimension | Finding | Criticality |
|-----------|---------|-------------|
| **Color System** | 3-way token conflict causing overwriting; 8 dirty components; hardcoded gradients break in dark mode | 🔴 P0 — Blocks all other work |
| **KPI Matrix** | 4 visible KPIs vs 120+ available data points; 52 new KPIs possible across 5 pages | 🟡 P1 — High value, no data pipeline changes |
| **Premium UI** | Uniform grid feels flat; missing card elevation tiers; 0 micro-interactions on cards | 🟡 P1 — Core aesthetic upgrade |
| **Gamification** | No skill radar, no XP system, achievements hidden behind scroll | 🟢 P2 — Delight layer |
| **Information Hierarchy** | No cross-linking between pages; empty states lack CTAs; Zone 1 (North Star) not defined | 🟡 P1 — Usability foundation |

---

## The 5 Research Documents

| # | Document | Agent Focus | Findings |
|---|----------|-------------|----------|
| 01 | `01-color-system-audit.md` | Color System | 3-way conflict (OKLCH blue vs hex emerald vs playful accents), 12 inline hex values, 3 hardcoded gradients, 4 missing dark mode variants |
| 02 | `02-kpi-matrix-expansion.md` | KPI Expansion | 52 proposed KPIs (from 4), 14 unused store getters, 4 composite score formulas, collapsible metric groups layout |
| 03 | `03-premium-ui-patterns.md` | Premium UI | 12-col bento grid spec, 3-tier card elevation, 12 micro-interactions catalog, 6 theme-aware gradient presets |
| 04 | `04-gamification-system.md` | Gamification | 8-axis skill octagon, XP/level system (1-75+), 7 achievement tiers, streak freeze mechanic |
| 05 | `05-information-hierarchy.md` | Hierarchy | 4-zone scanning model, progressive disclosure levels 0-4, cross-linking map, empty state CTAs |

---

## Implementation Phases

### Phase 0 — Color System Unification (P0, 9 files, ~51 edits)
**The overwriting problem.** Fix first — everything else builds on this.

```
Files to edit:
  🔴 P0  globals.css                    (20 edits — resolve 3-way conflict, add dark mode variants)
  🔴 P0  StreakHeroCard.tsx             (1 edit — replace hardcoded purple gradient)
  🔴 P0  LearningProgressCard.tsx       (2 edits — replace hardcoded SVG gradient)
  🔴 P0  PerformanceOverviewChart.tsx    (3 edits — replace SVG hex + Tailwind colors)
  🟡 P1  TopKPIGrid.tsx                 (8 edits — 4 inline hex + 4 Tailwind utility colors)
  🟡 P1  GoalsHabitsCard.tsx            (2 edits — fallback hex)
  🟡 P1  AddHabitModal.tsx              (11 edits — 8 hex presets + 3 fallbacks)
  🟡 P1  AppearanceSettings.tsx         (4 edits — 4 hex accent options)
  🟢 P2  ui-context.md                  (1 edit — document new system)
```

**Result:** Single source of truth. No more overwriting. Dark mode gradients work.

### Phase 1 — Bento Grid & Card System (P1)
Replace uniform grid with asymmetrical bento. No new components yet — just the layout shell.

```
- Create bento grid CSS utilities (12/8/4-col variants)
- Create BaseCard component with 3 elevation tiers
- Add hover/lift micro-interactions
- Implement loading skeleton variants per tier
```

### Phase 2 — KPI Expansion (P1)
Upgrade existing 4 KPIs to richer viz + add 8 more P0/P1 metrics.

```
- Extract Streak from TodayProgressCard → top-level KPI
- Add Daily Goal Progress ring
- Add Deep Work Ratio ring gauge
- Add Distraction Ratio sparkline
- Add Context Switches mini bar
- Add Productivity Index composite score
- Create KpiCard, KpiRingGauge, KpiSparkline components
```

### Phase 3 — Per-Page Expansion (P1-P2)
Expand Habits, Timeline, Board, Timer pages with their KPI proposals.

```
- Habits: 10 new KPIs + Skill Octagon
- Timeline: 8 new KPIs + Peak Hour finder
- Board: 6 new KPIs + Velocity gauge
- Timer: Timer session history table
```

### Phase 4 — Gamification (P2)
Skill Octagon, XP/Level system, achievement enhancements.

```
- SkillOctagon component (SVG radar, 8 axes)
- XPProgressBar + LevelUpCelebration
- Achievement unlock animations
- Streak freeze mechanic
```

### Phase 5 — Cross-linking & Empty States (P1)
Information hierarchy polish.

```
- Add click-through links from Dashboard→Habits/Timeline/Board
- Add micro-CTAs to 0-value cards
- Collapse deep content behind "Show more"
- Stagger entry animations per zone
```

---

## Verification Gate

Every phase must pass:
- `npm run lint` — 0 errors
- `npm run typecheck` — 0 errors
- `npm run build` — 0 errors
- `prefers-reduced-motion` respected in all new animations
- Dark mode parity for all new visuals
- WCAG AA contrast (4.5:1 body, 3:1 large text)

---

## File Locations

All research documents: `Feature_docs/redesign/`
- `01-color-system-audit.md` (371 lines)
- `02-kpi-matrix-expansion.md` (450 lines)
- `03-premium-ui-patterns.md` (1017 lines)
- `04-gamification-system.md` (324 lines)
- `05-information-hierarchy.md` (648 lines)
- `00-redesign-synthesis.md` (this file)
