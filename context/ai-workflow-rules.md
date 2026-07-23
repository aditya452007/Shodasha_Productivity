# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and the current state of progress. Always implement against these specs — do not infer or invent behavior from scratch. Before writing code, load the relevant skill(s) and follow their instructions.

## SDLC Workflow

Every feature follows this sequence in order:

1. **Specify** — Create a feature specification from a natural language description. Defines WHAT to build (user stories, requirements, success criteria). No implementation details.
2. **Clarify** — (Optional) Resolve ambiguities in the spec by asking targeted questions.
3. **Plan** — Create an implementation plan with technical context, architecture decisions, data model, and research. Defines HOW to build it.
4. **Tasks** — Break the plan into executable, dependency-ordered tasks.
5. **Analyze** — (Optional) Cross-artifact consistency and quality analysis.
6. **Implement** — Execute all tasks in phases (Setup → Foundational → User Stories → Polish).

## Scoping Rules

- Work on one feature unit at a time (one spec → one plan → one task list → implement)
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step

## When to Split Work

Split an implementation step if it combines:
- UI changes across multiple pages (do one page at a time)
- Frontend components and backend/CMS integration
- Behavior not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Skill Loading Order

Before implementing any feature, load skills in this order:

1. **`design-taste-frontend`** — Establish design read, set Three Dials
2. **`design-basics`** — Apply fundamentals (color, typography, spacing, accessibility)
3. **`Design Engineering`** — Animation Decision Framework
4. **`high-end-visual-design`** — Agency-level polish
5. **`full-output-enforcement`** — For exhaustive output, ban placeholder patterns
6. **`hallmark`** — Reference design patterns and macrostructures

For stress-testing decisions: use **`Grill_Me`** before committing to a direction.
For design audits of existing code: use **`redesign-existing-projects`**.
For component coverage: use **`ui-checklist`**.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md`

## Protected Files

Do not modify the following unless explicitly instructed:
- `src/components/ui/*` — generated primitives
- `node_modules/`, `.next/`, build output directories

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:
- System architecture or boundaries → `architecture.md`
- UI decisions (colors, typography, components) → `ui-context.md`
- Code conventions or standards → `code-standards.md`
- Feature scope or workflow → `ai-workflow-rules.md`
- Progress → `progress-tracker.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. Build passes
5. Lint passes
6. Typecheck passes
