# Handoff — Phase 2 Complete: BaseCard + Bento Grid + Hover States

Copy everything below into a NEW agent session.

---

```
You are continuing the Shodasha redesign. Phase 2 (Dashboard Premium UI Patterns) is complete.

## What Was Done This Session

All changes are in `src/app/page.tsx` and `src/components/dashboard/`:

### 1. BaseCard Refactoring
Every card component now uses `<BaseCard>` as its wrapper:
- `ScheduleActivityCard` — BaseCard with elevation="raised", card-hover-lift
- `LearningProgressCard` — same pattern
- `GoalsHabitsCard` — same pattern
- `PerformanceOverviewChart` — same pattern
- `TopKPIGrid` — each of the 4 KPI metric cards wrapped in BaseCard
- `StreakHeroCard` — gradient hero wrapped with elevation="flat" + border-0 override
- `InsightCard` — uses BaseCard built-in isLoading/hasError state handling

### 2. Bento Grid Layout
Dashboard grid classes replaced with bento grid system:
- Middle tier: `bento-grid bento-grid-cols-12 items-stretch` with `bento-col-span-7`/`bento-col-span-5`
- Bottom tier: same pattern with `bento-col-span-4/3/5`

### 3. Card Hover States
All cards got `card-hover-lift` class (defined in `globals.css`):
- Translates up -2px with shadow-md on hover
- Scales to 0.98 on press
- Respects `prefers-reduced-motion`

### 4. Import Cleanup
Removed ~15 unused imports across dashboard components (motion, useReducedMotion, unused lucide icons)

## What Should Be Done Next

### Priority 1 — Apply the Same Pattern to Remaining Pages
The other pages (`/board`, `/habits`, `/timeline`, `/settings`) still use raw div containers for their cards. Each page has components that should use `BaseCard` + `card-hover-lift`.

Read these files to find the card-like containers:
- `src/app/board/page.tsx` + `src/components/board/`
- `src/app/habits/page.tsx` + `src/components/habits/`
- `src/app/timeline/page.tsx` + `src/components/timeline/`
- `src/app/settings/page.tsx` + `src/components/settings/`

For each:
1. Replace outer container div/motion.div with `<BaseCard elevation="raised" className="card-hover-lift" innerClassName="...">`
2. Remove redundant entry animation (BaseCard provides it)
3. Remove card styling classes from className (BaseCard handles bg/border/shadow via elevation)
4. Keep all inner logic and layout classes via innerClassName

### Priority 2 — Animation Polish (Phase 4 from AGENTS.md)
Per Emil Kowalski's philosophy:
- All entry animations should start from scale(0.95), not scale(0)
- Use custom cubic-bezier easings, never built-in CSS easings
- Button press: scale(0.97), 120-160ms
- Stagger children: 30-80ms between items
- All animations must respect `prefers-reduced-motion`

Check which dashboard inner animations violate these rules (e.g., StreakHeroCard flame pulse uses `easeInOut`, not custom).

### Priority 3 — KPI Expansion & Gamification (from original HANDOFF-PROMPT.md)
If you want to continue to the next feature phase:
- Read `Feature_docs/redesign/02-kpi-matrix-expansion.md` for the 52 proposed KPIs
- Read `Feature_docs/redesign/04-gamification-system.md` for XP/levels/achievements
- Verify which KPIs can be computed from existing store data
- Design KpiCard, KpiRingGauge, KpiSparkline components

## Skills to Load (In Order)

1. **emil-design-eng** — animation decision framework, Polish philosophy
2. **apple-design** — fluid interactions, spring feel for micro-interactions
3. **high-end-visual-design** — premium card patterns, double-bezel architecture
4. **impeccable** — design audit for remaining pages
5. **find-animation-opportunities** — identify where motion should be added

## Files to READ Before Starting

### State of Phase 2 (already done):
- `src/app/page.tsx` — bento grid layout with BaseCard wrappers
- `src/components/ui/BaseCard.tsx` — BaseCard with 3 elevations + loading/empty/error states
- `src/app/globals.css` — bento-grid-*, card-hover-*, card-* elevation classes

### To be refactored next:
- `src/components/board/` — examine each component's outer wrapper
- `src/components/habits/` — same
- `src/components/timeline/` — same
- `src/components/settings/` — same

### Reference:
- `Feature_docs/redesign/HANDOFF-PROMPT.md` — original master plan
- `Feature_docs/redesign/00-redesign-synthesis.md` — unified implementation plan
- `Feature_docs/redesign/03-premium-ui-patterns.md` — bento grid, card patterns, micro-interactions
- `context/progress-tracker.md` — update after each change
- `context/ui-context.md` — design tokens, color rules
- `AGENTS.md` — SDLC phases, protected files, verification gate

## Verification Gate

After every change:
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run build` passes (0 errors)
- [ ] No inline hex values in TSX files
- [ ] All colors use `var(--*)` tokens
- [ ] Components use palette tokens (`--accent-violet`, etc.) not `--accent` for non-user-accent elements
- [ ] Entry animations respect `prefers-reduced-motion`
- [ ] No `ease-in` easing on transitions
- [ ] No `scale(0)` entry animations

## Summary of Current State

The Dashboard is fully migrated to BaseCard + bento grid. The remaining 4 pages still use raw div containers for their card components. The next agent should apply the same mechanical refactoring pattern to those pages, then move to animation polish.

Important: Do NOT modify `node_modules/`, `.next/`, or build output. Only edit source files in `src/`.
```
