# AI Workflow Rules

## Approach

Build this project incrementally using the 5-phase SDLC defined in `AGENTS.md`. Context files define what to build and how to build it. Always implement against these specs — do not infer or invent behavior from scratch.

## Execution Order

Every feature follows: Design Brief → Component Fetch → Scaffold → Implement → Polish → Verify

Never combine phases. Never skip a phase.

## Scoping Rules

- Work on one feature at a time (Board → Habits → Timeline → Dashboard → Settings)
- Prefer small, verifiable increments over large speculative changes
- Do not combine UI changes across multiple pages in one step
- A change that cannot be verified end to end quickly is too broad — split it

## Design Execution (Anti-Slop Protocol)

Every UI implementation must pass these checks before code is written:

### Pre-Implementation Design Audit
Before writing any UI code, audit the intended output against `context/ui-context.md`:
1. **Colors** — every color value references a `var(--*)` token. No inline hex/rgb. No pure black or pure white.
2. **Typography** — headings are Cabinet Grotesk (roman only, never italic). Body is Inter. Both loaded via next/font.
3. **Accent lock** — emerald is the single accent. No secondary accent introduced on any page.
4. **Tokens** — no CSS variable is hardcoded. Every value flows from the token block.

### Anti-Slop Gates (Hard Fail)
If the output triggers any of these, it must be rewritten:
- Italic heading or display text (anti-slop rule 1)
- Purple/blue gradient accent ("AI purple")
- Glassmorphism / `backdrop-blur` on surfaces
- `scale(0)` entry animation
- `ease-in` on any UI animation
- Pure `#000000` or `#ffffff` anywhere
- Emoji in place of lucide-react icons
- Inline hex/rgb values bypassing CSS variables
- Mixed border-radius systems (must be consistent per ui-context.md)

### Component Import Protocol
- Never vendor library component code — always `npm install` and import
- When integrating a premium library component, restyle it to use our design tokens
- If a library component can't be restyled to match tokens, find an alternative

## Skill Loading Order

Before implementing any feature, load skills in this order:

1. `ui-checklist` — component completeness reference
2. `impeccable` — design audit and polish
3. `full-output-enforcement` — exhaustive code generation, ban placeholders
4. `grilling` — stress-test decisions before committing
5. For animation work: `emil-design-eng`, `gsap-react`, `gsap-timeline`, `apple-design`

## Documentation Fetching Protocol

### Tool selection for fetching docs

| Target | Tool | Why |
|--------|------|-----|
| Premium UI lib (Kibo UI, Animata, HeroUI, Smooth UI, Dice UI, COSS UI, Cult UI, Fancy, Motion Primitives) | `webfetch` with `format: "markdown"` | These libraries are NOT indexed in docfork |
| Mainstream framework/lib (React, Next.js, Motion/GSAP, Tailwind, Tauri, Zustand, @dnd-kit) | `docfork_search_docs` → `docfork_fetch_doc` | Docfork indexes official docs |
| Unknown / unlisted library | `webfetch` first; if that fails, try `websearch` | Fallback strategy |

### How to fetch a component from a premium library

1. Use `webfetch` on the exact component URL from `Feature_docs/COMPONENT-LIBRARY-INDEX.md`
2. Read the full page: understand imports, props API, animation approach, dependencies
3. Extract the component code (look for code blocks, "Copy code" buttons, or example sections)
4. Save as `Feature_docs/<feature>/<component-name>.md` with full code, API table, and deps
5. Never truncate, never use placeholders, never write "// ..." in place of real code

### How to fetch docs for a mainstream framework

1. `docfork_search_docs` with specific query + library name
2. `docfork_fetch_doc` on the result URL to get the full page content
3. Read API signatures, examples, and configuration options
4. Save key findings in the relevant implementation file as comments

## File Navigation Guide (When to Use Which File)

### Before starting any work
| File | Why read it |
|------|-------------|
| `AGENTS.md` | Understand the 5-phase SDLC (must follow this) |
| `CONTEXT.md` | Understand domain entities, rules, and glossary |
| `context/shape-brief.md` | Feature scope, sitemap, priorities |
| `context/architecture.md` | Stack, folder structure, data flow |
| `context/progress-tracker.md` | Current phase, completed work, next steps |

### During design
| File | Why read it |
|------|-------------|
| `context/ui-context.md` | Design tokens (colors, typography, anti-slop rules) |
| `context/ai-workflow-rules.md` | Anti-slop gates, pre-implementation audit |
| `Feature_docs/COMPONENT-LIBRARY-INDEX.md` | Which library has the component we need |
| `docs/adr/*.md` | Past architectural decisions that affect current work |

### During implementation
| File | Why read it |
|------|-------------|
| `context/code-standards.md` | Coding conventions, pre-commit checks |
| `context/architecture.md` | Exact folder paths, Tauri invoke patterns |
| `Feature_docs/<feature>/` | Component code copied from libraries |
| `CONTEXT.md` | Verify entity names, relationships, domain rules |
| `context/progress-tracker.md` | Mark completed work; check what's next |

### During review / polish
| File | Why read it |
|------|-------------|
| `context/ui-context.md` § Anti-Slop Rules | Verify output against the 11 blocked patterns |
| `context/code-standards.md` § Pre-Commit Checks | Run the checklist before moving on |
| `context/progress-tracker.md` | Update with completed work |

### When to update each file
| Change | File to update |
|--------|---------------|
| Entity or domain rule changes | `CONTEXT.md` |
| Architecture, stack, folders | `context/architecture.md` |
| Colors, typography, design rules | `context/ui-context.md` |
| Coding conventions, build commands | `context/code-standards.md` |
| Workflow rules, skill order | `context/ai-workflow-rules.md` or `AGENTS.md` |
| Phase progress, completed features | `context/progress-tracker.md` |
| Hard-to-reverse decisions | `docs/adr/` (new file) |
| Component docs from libraries | `Feature_docs/<feature>/` (new file)

## Handling Missing Requirements

- Do not invent product behavior not defined in context files
- If ambiguous, resolve in the relevant context file before implementing
- If missing, add as open question in `progress-tracker.md`

## Protected Files

Do not modify unless explicitly instructed:
- `node_modules/`, `.next/`, build output directories
- Library component files — always import from installed packages, do not vendor

## Keeping Docs in Sync

After every implementation change, update the relevant file:
- Entity or domain change → `CONTEXT.md`
- Architecture or boundaries → `context/architecture.md`
- UI decisions (colors, typography, components) → `context/ui-context.md`
- Code conventions or standards → `context/code-standards.md`
- Workflow rules → `AGENTS.md`
- Progress → `context/progress-tracker.md`

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope
2. No invariant defined in `context/architecture.md` was violated
3. No anti-slop gate from `context/ui-context.md` is triggered
4. `context/progress-tracker.md` reflects the completed work
5. Build passes
6. Lint passes
7. Typecheck passes
