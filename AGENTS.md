# Shodasha — Agent Execution Protocol

## SDLC Lifecycle

Every feature follows this exact sequence. Do not skip steps.

```
Phase 0 — Design Brief   → CONTEXT.md + shape-brief.md + ADRs
Phase 1 — Component Fetch → Feature_docs/<feature>/ (real code from libraries)
Phase 2 — Scaffold        → Routes, stores, database schema, empty pages
Phase 3 — Implement       → Wire components to stores, connect to DB
Phase 4 — Polish          → Animations, transitions, reduced-motion, edge states
Phase 5 — Verify          → Build, lint, typecheck pass
```

## Phase Details

### Phase 0 — Design Brief
Before any code is written:
1. Read `CONTEXT.md`, `context/shape-brief.md`, `context/architecture.md`
2. If decisions are unclear, ask the user — do not invent
3. Resolve ambiguities in the relevant context file
4. Write ADRs for decisions that are hard to reverse, surprising, or involved trade-offs
5. Deliverable: resolved context files + ADR documents

### Phase 1 — Component Fetch
Before any component is used in code:
1. Read `Feature_docs/COMPONENT-LIBRARY-INDEX.md` for the needed component type
2. Visit every URL listed — do not skip any library
3. Read the actual component page: understand the API, props, imports, animation approach
4. Copy real code verbatim — no placeholders, no truncation
5. Save to `Feature_docs/<feature>/<component-name>.md`
6. When multiple options exist: evaluate by animation quality > visual polish > API ergonomics > aesthetic match > license
7. Do NOT default to HeroUI — other libraries may serve better
8. Deliverable: one markdown file per component with full code + API + deps

### Phase 2 — Scaffold
1. Create route files in `src/app/` for each tab (/, /board, /habits, /timeline, /settings)
2. Define Zustand stores in `src/stores/` matching entities in CONTEXT.md
3. Define SQLite schema matching entities
4. Create empty page components with proper layout shell (top tab bar)
5. Deliverable: navigable app shell with empty pages + store stubs + DB schema

### Phase 3 — Implement
1. Work one feature at a time (Board → Habits → Timeline → Dashboard → Settings)
2. Within each feature: component integration → store wiring → DB persistence → interaction
3. Prefer small verifiable increments over large speculative changes
4. Do not combine UI changes across multiple pages in one step
5. Deliverable: working feature with real components, state, and persistence

### Phase 4 — Polish
1. Add entry animations (stagger children, spring transitions)
2. Add micro-interactions (hover, active, focus states)
3. Handle edge states: loading → skeleton, empty → CTA, error → message
4. Ensure all animations respect `prefers-reduced-motion`
5. Dark mode parity check
6. Deliverable: polished feature with all states handled

### Phase 5 — Verify
1. `npm run lint` passes
2. `npm run typecheck` passes
3. `npm run build` passes
4. `progress-tracker.md` updated
5. Deliverable: verified, shippable increment

## Skill Loading Order

When starting a new unit of work, load skills in this order:

1. `ui-checklist` — component completeness reference
2. `impeccable` — design audit and polish
3. `full-output-enforcement` — for exhaustive code generation
4. `grilling` — stress-test decisions before committing

For animation-specific work:
5. `emil-design-eng` — polish philosophy
6. `gsap-react` + `gsap-timeline` — GSAP with React
7. `apple-design` — fluid gesture-driven patterns

## Handling Missing Requirements

- Do not invent product behavior not defined in context files
- If ambiguous, resolve in the relevant context file before implementing
- If missing, add as open question in `progress-tracker.md`

## Protected Files

Do not modify unless explicitly told to:
- `node_modules/`, `.next/`, `build output/`
- Library component files — always import from installed packages, do not vendor

## Keeping Docs in Sync

After every implementation change, update the relevant file:
- Entity or domain change → `CONTEXT.md`
- Architecture or boundaries → `context/architecture.md`
- UI decisions (colors, typography, components) → `context/ui-context.md`
- Code conventions → `context/code-standards.md`
- Workflow rules → `AGENTS.md`
- Progress → `context/progress-tracker.md`
