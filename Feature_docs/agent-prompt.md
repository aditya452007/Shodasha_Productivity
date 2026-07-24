# Shodasha — Multi-Agent Research & Validation Prompt

Copy and paste the entire block below into a new agent session. This prompt orchestrates a phased multi-agent research, audit, validation, and synthesis workflow. It does NOT implement anything — it researches, validates, and documents.

---

```
You are a senior research orchestrator for Shodasha, a personal productivity desktop app (Windows, Tauri + Next.js + SQLite, offline-only). Your task is to run a phased, multi-agent research, diagnosis, validation, and synthesis workflow. 

ABSOLUTE RULE: Agents operating in the same phase CAN run in parallel IF they read different files or research different topics. Agents that write to the same file must run SEQUENTIALLY. Never have two agents write to the same file simultaneously.

The existing research documents are at:
- Feature_docs/research-competing-apps.md (876 lines — 10 competing apps analyzed)
- Feature_docs/research-shodasha-audit.md (480 lines — full codebase audit with P0 bugs)
- Feature_docs/research-ui-libraries.md (861 lines — 16 UI libraries evaluated)
- Feature_docs/research-design-principles.md (705 lines — synthesized from 10+ design skills)
- Feature_docs/redesign.md (~1200 lines — master redesign specification with 8 implementation phases)

## Phase 1: Read & Understand Existing Research

Launch ONE agent to read ALL five research documents above. This agent does NOT write anything. It returns a structured summary of:
- Key findings from each document
- The 10 P0 bugs identified
- The recommended UI libraries and why
- The design principles and anti-patterns
- The 8 implementation phases and their order

Wait for this agent to complete before proceeding.

## Phase 2: Live Application Research (Parallel — 4 agents)

Launch 4 agents in parallel. Each researches a DIFFERENT aspect of working productivity applications. They visit live websites and app stores. They do NOT write files. They return structured findings.

**Agent 2a — First Interaction & Onboarding Research**
Visit and analyze how these apps handle the first 10 seconds of user experience:
- Todoist (todoist.com)
- Forest (forestapp.cc)
- Finch (finchcare.com)
- KUBBO (kubbo.app)
- Habitica (habitica.com)
- LifeForge (lifeforge.app)

For each app, document:
1. What does the user see on first launch? (screenshots/description)
2. What is the first interactive element?
3. How long until the user can do something useful?
4. What empty states look like (screenshots/description)
5. What loading states look like
6. How onboarding works (quiz? blank slate? pre-populated?)
7. What makes the user feel "I know what to do here" vs "I'm confused"
8. Copy/tone analysis — how does the app speak to the user?

**Agent 2b — UI Layout & Information Architecture Research**
Visit and analyze the layout patterns:
- Todoist (todoist.com)
- Notion (notion.so) — sidebar + content pattern
- Linear (linear.app) — issue tracker layout
- Things 3 (culturedcode.com/things) — task manager
- TickTick (ticktick.com)

For each app, document:
1. Navigation structure (top bar, sidebar, tabs, bottom nav?)
2. Default/landing view — what's the first thing shown
3. Information density — cards vs lists vs tables
4. How many elements are on the screen at once
5. How hierarchy is communicated (color, size, spacing, borders)
6. What the page layout grid looks like (draw ASCII of it)
7. How secondary navigation works (modals, drawers, sheets, pages)
8. How search/filter works
9. The "at a glance" experience — what communicates status without reading

**Agent 2c — Visual Design & Color Research**
Analyze the visual design systems of:
- Linear (linear.app)
- Arc Browser (arc.net)
- Superhuman (superhuman.com)
- Cron/Notion Calendar
- Any 2 more premium productivity apps you find

For each, document:
1. Color palette (extract hex values, describe the system — monochromatic, analogous, etc.)
2. Typography (font families, sizes, weights, line heights)
3. Border radius patterns (what's sharp, what's rounded)
4. Shadow system (depth layers, elevation)
5. Spacing rhythm (tight vs generous, how sections separate)
6. Dark mode vs light mode differences
7. What makes it feel "premium" vs "generic"
8. Use of materials (glass, solid, gradient, flat)

**Agent 2d — Chart & Data Visualization Research**
Analyze how these apps present data:
- Strava (strava.com) — fitness analytics
- Health Dashboard (iOS/macOS) — health metrics
- GitHub Insights / Contributions graph
- Arc Browser's "Spaces" stats
- RescueTime (rescuetime.com) — time tracking analytics

For each, document:
1. What data visualizations they use (rings, bars, lines, grids, heatmaps)
2. How they show comparison (day vs week, week vs month, actual vs goal)
3. How they avoid overwhelming with data
4. How they handle data drill-down (tap for more detail)
5. Chart color philosophy — do they use accent colors or semantic colors?
6. What makes a chart "at a glance" vs "analytical"
7. How they handle empty data periods (gaps, zeros, "no data")
8. How they show progress over time without repetitive charts

## Phase 3: Codebase Deep Diagnosis (Parallel — 4 agents)

Launch 4 agents in parallel after Phase 2 completes. Each reads DIFFERENT files from the codebase. They do NOT write files. They return structured findings.

**Agent 3a — Component & UI Diagnosis**
Read every file in src/components/ recursively. For each component, document:
1. Does it handle loading state? (Y/N — show the code)
2. Does it handle empty state? (Y/N — show the code)
3. Does it handle error state? (Y/N — show the code)
4. Does it use 'use client' correctly? (Y/N)
5. Does it use hardcoded colors? (Y — list them)
6. Does it have prefers-reduced-motion guard? (Y/N)
7. Does it have aria-labels on all interactive elements? (Y/N)
8. Does it have keyboard navigation? (Y/N)
9. What animation approach does it use? (Motion, CSS, none)
10. Is there any inline comment describing WHAT instead of WHY? (list them)
11. What CSS variables does it reference? (list them)
12. Compare every component to what redesign.md says it should be — what's missing?

**Agent 3b — Store & Data Flow Diagnosis**
Read every file in src/stores/ + src/lib/ + src/app/AppInitializer.tsx:
1. Does every store have loading/isLoading state? (Y/N)
2. Does every store have error state? (Y/N)
3. Does every store have initialized state? (Y/N)
4. What computed getters exist? Are they memoized?
5. What cross-store dependencies exist? (list them — e.g. habitStore calls taskStore)
6. What optimistic updates exist? Do they have rollback?
7. What IPC commands are called vs what's registered in capabilities?
8. Are there any hardcoded mock data return values? (like getCumulativeScreenTimeFiltered)
9. What duplicated logic exists across stores? (like streak calculation)
10. Compare to redesign.md Section 14 — what metrics are missing?
11. Are there any domain rule violations? (e.g. deleteColumn bug)

**Agent 3c — Design System & CSS Diagnosis**
Read every CSS and styling file:
1. globals.css — what CSS variables are defined vs what components reference
2. layout.tsx — are fonts loaded via next/font?
3. Is the font-weight reduction for dark mode implemented?
4. What Tailwind classes are used that bypass CSS variables?
5. What inline styles/colors exist in component files?
6. List all undefined CSS variables (components reference them but globals.css doesn't define them)
7. What border-radius values are used? Do they follow a system?
8. What shadow classes are used? Do they follow a system?
9. What z-index values are used? Do they follow a system?
10. Compare every finding to redesign.md Section 4.2 design tokens
11. Compare to research-design-principles.md Section 4 (color rules)

**Agent 3d — Settings & Data Management Diagnosis**
Read all settings components and the Rust backend schema:
1. src/components/settings/ — all files
2. src-tauri/src/commands.rs (list all IPC commands)
3. src-tauri/src/lib.rs
4. src-tauri/capabilities/default.json

Document:
1. Which IPC commands are called in db.ts but NOT registered in capabilities?
2. What does Clear Database actually do vs what it should do?
3. What settings are persisted where? (SQLite vs localStorage vs both?)
4. What data export/import exists vs what's specified in shape-brief.md?
5. Are there any data migration runners?
6. What error handling exists for IPC failures?
7. Compare to the redesign.md Section 9 (Settings Redesign)

## Phase 4: Skill-Based Design Validation (Parallel — 5 agents)

After Phase 3 completes, launch 5 agents in parallel. Each reads the existing research and codebase findings through the lens of ONE design skill. They do NOT write files. They return validation findings.

**Agent 4a — Validate Against Impeccable (Operate Mode)**
Load the impeccable skill. Validate every aspect of the current implementation and the redesign.md against:
- The Operate mode rules (scanability, consistency, density, native expectations)
- The craft-floor bans (no glassmorphism, no nested cards, no ease-in, no scale(0))
- The anti-patterns list
- The KPI and data visualization rules
- The navigation architecture rules

Return: what's compliant, what violates Operate mode, and what redesign.md got wrong.

**Agent 4b — Validate Against Apple Design & Emil Kowalski**
Load the apple-design and emil-design-eng skills. Validate:
- Animation interruptibility — can every animated element be interrupted?
- Button press feedback — does it fire on pointer-down?
- Micro-interaction timing — are durations correct (100-160ms for press, 200ms for hover, etc.)?
- Reduced motion — are all animations guarded with prefers-reduced-motion?
- Origin-aware popovers — do they scale from trigger?
- Silent success principle — are there unnecessary toasts?
- Gesture-fluid interactions — do drag operations feel native?

Return: what's missing, what violates fluid design principles.

**Agent 4c — Validate Against Premium Design & Design Taste**
Load the premium-design and design-taste-frontend skills. Validate:
- Typography — is there a proper hierarchy? Are fonts loaded correctly?
- Color — is the palette premium? No pure black/white? Single accent?
- Spacing — is there a consistent rhythm? 4pt or 8pt scale?
- Layout — no 3-column equal grids? No card-in-card?
- Are there any AI-slop patterns? (gradient text, em-dash decoration, fake-precise numbers)
- Is the anti-slop checklist satisfied?

Return: violations, recommendations.

**Agent 4d — Validate Against Hallmark & Minimalist UI**
Load the hallmark and minimalist-ui skills. Validate:
- The 58-gate slop test — run it against the current design
- Color — muted pastels for status, warm monochrome palette
- Editorial whitespace — is spacing intentional?
- Bento grid patterns — is the dashboard asymmetric?
- Micro-interaction recipes — are hover/focus/active states properly implemented?
- Empty states — do they teach the interface?
- Is the design "quiet" enough for a productivity tool?

Return: violations, recommendations.

**Agent 4e — Validate Against High-End Visual Design & Industrial Brutalist**
Load the high-end-visual-design and industrial-brutalist-ui skills. Validate:
- Card design — is the double-bezel used appropriately (only in Persuade mode, not Operate)?
- Data density — is it appropriate for a productivity dashboard?
- Typography contrast — is there enough weight difference between headings and body?
- Spatial rhythm — are section gaps generous enough?
- Status badges — are pill shapes used correctly?

Return: what from High-End can be borrowed without violating Operate mode.

## Phase 5: Synthesis & Gap Analysis (Sequential — 3 agents, one after another)

After ALL previous phases complete, launch 3 agents SEQUENTIALLY (not in parallel, because they build on each other's work).

**Agent 5a — Gap Analysis: redesign.md vs All Research Findings**
Read ALL findings from Phases 1-4. Compare everything against redesign.md. Answer:
1. What does redesign.md specify correctly? (list with evidence)
2. What does redesign.md miss that the research found? (list gaps with evidence)
3. What in redesign.md contradicts validated research? (list conflicts)
4. What new findings from Phase 2 (live app research) should be added?
5. What P0 bugs were found in Phase 3 that redesign.md doesn't address?
6. What skill violations were found in Phase 4 that need fixing?
7. What implementation priorities changed based on new findings?
8. Are there any new library recommendations that redesign.md missed?
9. Are there any library recommendations in redesign.md that should be removed?

Write the complete gap analysis to: Feature_docs/gap-analysis.md

**Agent 5b — Updated Implementation Roadmap**
Read Agent 5a's output (gap-analysis.md). Create a revised implementation plan:
1. Updated Phase 1-8 from redesign.md, modified based on findings
2. Any NEW phases needed (e.g., "Notification System" wasn't called out as a phase)
3. Updated priority matrix (P0/P1/P2 shifts based on new findings)
4. Updated file change list (files to create/modify/remove)
5. Any dependencies between tasks that weren't previously identified
6. Risk assessment — what's hardest to get right?
7. Quick wins — what gives the most visible improvement for least effort?

Write the updated roadmap to: Feature_docs/implementation-roadmap-updated.md

**Agent 5c — Final Design Verification Checklist**
Read Agent 5a and 5b outputs. Create a single verifiable checklist:
1. All P0 bugs listed with exact fix steps
2. All design system tokens listed (colors, spacing, typography, radius, easing) with their correct values
3. All component states that must be handled (loading/empty/error for each component)
4. All animations listed with their trigger, duration, easing, and reduced-motion fallback
5. All aria labels needed
6. All keyboard shortcuts needed
7. All CSS variables that must be defined
8. All IPC commands that must be registered
9. All files that must be created
10. All files that must be modified
11. All files that must be removed

This checklist must be EXHAUSTIVE — every single change that needs to happen. Format it as a markdown checklist with checkboxes.

Write to: Feature_docs/final-verification-checklist.md

## Final Step

After all agents complete, report to the user:
1. Summary of what was found (bullet points, most important first)
2. How many gaps were identified between redesign.md and real findings
3. How many skill violations were found
4. Whether the implementation roadmap changed
5. The single most important thing to fix first
6. Link to the 3 output files: gap-analysis.md, implementation-roadmap-updated.md, final-verification-checklist.md
```

---

**How to use:** Copy everything between the ``` markers into a fresh agent session. The agent will read all existing research, run live app research, diagnose the codebase, validate against 10+ design skills, and produce 3 synthesis documents. This takes multiple rounds but produces exhaustive, validated output.
