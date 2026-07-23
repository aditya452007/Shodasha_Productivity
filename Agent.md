# Agent Execution Protocol

This document defines **how to execute tasks in this project** — the workflow, skill usage, and execution discipline. Any AI agent executing work in this project MUST read this first and follow the protocol.

---

## How to Use This File

1. Read the **Context Hierarchy** below before writing any code
2. Follow the **Design-First Feature Workflow** — spec first, visualize, clarify, approve, then build
3. Identify which **domain** your task belongs to using the **Skill Mapping Table**
4. Load the right skill(s) via the `skill` tool before implementing
5. Run **Pre-Exit Checks** before marking any task complete

---

## Context Hierarchy (Read in Order)

1. `context/project-overview.md` — Product definition, goals, features, scope
2. `context/architecture.md` — System structure, boundaries, storage model, invariants
3. `context/ui-context.md` — Theme, colors, typography, component conventions
4. `context/code-standards.md` — Implementation rules and conventions
5. `context/ai-workflow-rules.md` — Development workflow, scoping rules, delivery approach
6. `context/progress-tracker.md` — Current phase, completed work, open questions, next steps

---

## Design-First Feature Workflow

**Before writing ANY code for a new feature, follow this exact sequence:**

### Step 1: Create Feature Spec
Create a feature specification in a `Feature_docs/<feature-name>/spec.md` file. This spec defines WHAT to build — user stories, requirements, success criteria.

### Step 2: Load Design Skills & Visualize
Load the relevant design skills to shape a design vision. Create a **visual wireframe / component tree diagram** (ASCII or detailed layout description) that shows the page structure, section hierarchy, spacing, and visual rhythm.

### Step 3: Ask Clarifying Questions
Ask the user clarifying questions about the design before proceeding.

### Step 4: Get User Approval
Present the spec + wireframe/visualization to the user for approval. **Do not write any code until the user explicitly approves.**

### Step 5: Implement
Only after approval, proceed with implementation: Plan → Tasks → Build.

---

## Skill Mapping Table

All skills are in `.agent/`:

| # | Domain | Skill | Location | When to Use | How to Use |
|---|--------|-------|----------|-------------|------------|
| 1 | **Design Fundamentals** | `design-basics` | `.agent/design-basics/` | Any visual decision: colors, typography, spacing, layout, accessibility | Read `guardrails.md` first, load relevant module, use `reference.md` for cheat sheets |
| 2 | **Premium UI Polish** | `premium-design` | `.agent/premium-design/` | Making UI look premium/professional — typography, color, layout, tokens | Read SKILL.md, apply principles |
| 3 | **Performance Engineering** | `performance_engineering` | `.agent/performance_engineering/` | Optimizing performance, Core Web Vitals, Lighthouse scores | Read reference docs, apply optimizations |
| 4 | **UI/UX Checklist** | `ui-checklist` | `.agent/ui-checklist/` | Auditing components/pages for completeness | Read SKILL.md, walk through checklists |
| 5 | **Design Taste** | `design-taste-frontend` | `.agents/skills/design-taste-frontend/` | Landing pages, redesigns, non-templated design | Declare Design Read, set Three Dials |
| 6 | **High-End Visual Design** | `high-end-visual-design` | `.agents/skills/high-end-visual-design/` | Building premium sections | Apply premium patterns, enforce motion guardrails |
| 7 | **Hallmark** | `hallmark` | `.agents/skills/hallmark/` | Design patterns, component recipes, macrostructures | Read SKILL.md, reference component-cookbook |
| 8 | **Design Engineering** | `emil-design-eng` | `.agents/skills/emil-design-eng/` | Animation decisions, UI polish, micro-interactions | Apply Animation Decision Framework |
| 4 | **UI/UX Checklist** | `ui-checklist` | `.agent/ui-checklist/` | Auditing components/pages for completeness; planning new features | Identify what you're building, open relevant section, audit each item |
| 5 | **Design Taste** | `design-taste-frontend` | Installed via Skills.py | Landing pages, redesigns, when you need non-templated design | Declare Design Read, set Three Dials, apply anti-center bias |
| 6 | **High-End Visual Design** | `high-end-visual-design` | Installed via Skills.py | Building premium sections: hero, bento grids, CTA, nav, testimonials | Apply premium patterns, enforce motion guardrails |
| 7 | **Design Engineering** | Emil's skill | Installed via Skills.py | Animation decisions, UI polish, micro-interactions | Apply Animation Decision Framework (4 questions) |
| 8 | **Design Quality Gate** | `redesign-existing-projects` | Installed via Skills.py | Auditing existing UI, upgrading without breaking | Audit for issues, apply premium replacements, verify nothing broke |
| 9 | **Exhaustive Output** | `full-output-enforcement` | Installed via Skills.py | Planning/spec/task generation where truncation would lose info | Load at start of planning or execution to prevent placeholders |
| 10 | **Hallmark Design System** | `hallmark` | `.agent/hallmark/` | Design pattern references, component recipes, macrostructures | Reference the component cookbook, study macrostructures |
| 11 | **Animation / Motion** | GSAP skills | Installed via Skills.py | GSAP-specific animations, scroll triggers, timelines | Load GSAP skill before implementing scroll-driven animations |
| 12 | **Decision Stress-Testing** | `Grill_Me` | Installed via Skills.py | When you need to stress-test a plan or design | Ask questions one at a time |
| 13 | **UI Checklist** | `ui-checklist` | `.agent/ui-checklist/` | Ensuring nothing is missed in UI components/pages | Walk through checklists for each component/page type |

## Skill Initialization Instructions

For skills that need to be **loaded/initialized** before use, follow these patterns:

### Pattern A: Template-Embedded Skills (Always Available)
These skills are part of the template and ready to use immediately:

- **`design-basics`** — Load with: `I'll use the design-basics skill for this task.` — then read `.agent/skills/design-basics/guardrails.md` first
- **`premium-design`** — Load with: `I'll use the premium-design skill.` — then read `.agent/skills/premium-design/SKILL.md`
- **`performance_engineering`** — Load with: `I'll use performance_engineering for optimization.` — reference files in `.agent/skills/performance_engineering/`
- **`ui-checklist`** — Load with: `I'll use the ui-checklist skill.` — then read `.agent/ui-checklist/SKILL.md`
- **`hallmark`** — Load with: `I'll use the hallmark design system skill.` — then read `.agent/hallmark/SKILL.md`

### Pattern B: Skills Installed via Skills.py (Install Then Load)
These skills need to be installed first by running `python Skills.py`, then loaded:

1. **`design-taste-frontend`** — After install, load with: `I'll use design-taste-frontend for this design.` Read SKILL.md and apply Three Dials
2. **`high-end-visual-design`** — After install, load with: `Using high-end-visual-design for premium polish.`
3. **`Design Engineering` (Emil's)** — After install, load with: `I'll apply Emil's Design Engineering philosophy.`
4. **`redesign-existing-projects`** — After install, load with: `I'll use redesign-existing-projects to audit this.`
5. **`full-output-enforcement`** — After install, load with: `I'll enforce full output for this task.`
6. **GSAP skills** — After install, load with: `I'll use GSAP skills for animation.`
7. **`Grill_Me`** — After install, load with: `I'll use Grill_Me to stress-test this plan.`
8. **`brandkit`** — After install, load with: `I'll use brandkit for branding decisions.`

### Skill Loading Order (Cross-Domain Tasks)

When a task crosses multiple domains, load skills in this order:

1. **`design-taste-frontend`** — Read the brief, set dials, establish design read
2. **`design-basics`** — Apply fundamentals (color, typography, spacing, accessibility)
3. **`Design Engineering`** — Choreograph motion decisions
4. **`high-end-visual-design`** — Apply premium agency-level polish
5. **`hallmark`** — Reference design patterns and macrostructures
6. **`full-output-enforcement`** — Before generating exhaustive docs/plans

---

## Command Reference

### Speckit Workflow Commands

These commands live in `.agent/commands/` and are invoked via the `/<command>` pattern:

| Command | File | Purpose |
|---------|------|---------|
| `/speckit.specify` | `speckit.specify.md` | Create feature specification |
| `/speckit.clarify` | `speckit.clarify.md` | Resolve spec ambiguities |
| `/speckit.plan` | `speckit.plan.md` | Create implementation plan |
| `/speckit.tasks` | `speckit.tasks.md` | Generate executable task list |
| `/speckit.analyze` | `speckit.analyze.md` | Cross-artifact consistency check |
| `/speckit.implement` | `speckit.implement.md` | Execute implementation tasks |
| `/speckit.checklist` | `speckit.checklist.md` | Generate quality checklists |
| `/speckit.constitution` | `speckit.constitution.md` | Update project constitution |
| `/speckit.taskstoissues` | `speckit.taskstoissues.md` | Convert tasks to GitHub issues |
| `/speckit.agent-context.update` | `speckit.agent-context.update.md` | Refresh agent context |

### Git Commands

| Command | File | Purpose |
|---------|------|---------|
| `/speckit.git.initialize` | `speckit.git.initialize.md` | Initialize git repo |
| `/speckit.git.feature` | `speckit.git.feature.md` | Create feature branch |
| `/speckit.git.commit` | `speckit.git.commit.md` | Auto-commit after commands |
| `/speckit.git.remote` | `speckit.git.remote.md` | Detect Git remote URL |
| `/speckit.git.validate` | `speckit.git.validate.md` | Validate branch naming |

---

## Folder Structure

```
├── .agent/                      # Your custom/template-embedded agent skills
│   ├── commands/                # Speckit SDLC workflow commands
│   ├── design-basics/           # Design fundamentals skill (your custom)
│   ├── premium-design/          # Premium UI design skill (your custom)
│   ├── performance_engineering/ # Performance optimization skill
│   └── ui-checklist/            # UI Checklist skill
├── .agents/skills/              # Community skills installed via `npx skills add` (run Skills.py)
│   ├── gsap-*/                  # GSAP animation skills
│   ├── design-taste-frontend/   # Design taste skill
│   ├── high-end-visual-design/  # Premium agency-level polish
│   ├── hallmark/                # Hallmark design system
│   ├── emil-design-eng/         # Emil Kowalski's design engineering
│   └── ... (28+ skills)
├── Agent.md                     # This file — execution protocol
├── Skills.py                    # Skill installer script (run to install external skills)
├── skills-lock.json             # Skills registry
├── context/                     # Project context files
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-context.md
│   ├── code-standards.md
│   ├── ai-workflow-rules.md
│   └── progress-tracker.md
├── README.md                    # Project documentation
└── src/                         # Application source code (TO BE CREATED)
```

---

## Pre-Exit Checks (Before Marking ANY Task Complete)

1. Lint passes (e.g., `npm run lint`)
2. Typecheck passes (e.g., `npm run typecheck`)
3. Build passes (e.g., `npm run build`)
4. All animations respect `@media (prefers-reduced-motion: reduce)`
5. Only `transform` + `opacity` are animated — no layout properties
6. No hardcoded colors — all use CSS custom properties from `ui-context.md`
7. `progress-tracker.md` is updated with the completed work

---

## Git Discipline

1. **Branch naming**: `NNN-feature-name` (sequential) or `YYYYMMDD-HHMMSS-feature-name` (timestamp)
2. **Commits**: Use conventional commits — `type(scope): description`
3. **Never commit** to `main`/`master` directly — always use feature branches
4. **Commit messages**: `feat(scope): description`, `fix(scope): description`, etc.

---

## Important Rules

- **Never jump to coding.** Always follow the Design-First Feature Workflow
- Load skills before writing code. Do not guess design decisions.
- Update `progress-tracker.md` after every meaningful change.
- If unsure about a design decision, load `Grill_Me` or ask the user.
