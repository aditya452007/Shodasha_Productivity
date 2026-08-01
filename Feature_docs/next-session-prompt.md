# Shodasha — Dashboard & Component Redesign Kickoff Prompt

Copy and paste the markdown block below into your next AI agent session to start implementing the redesigned Shodasha Dashboard and multi-tab component architecture:

```markdown
You are taking over the Shodasha codebase — a single-user, local-first Windows desktop productivity application built with Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, SQLite, and Tauri v2 (Rust backend).

## Mandatory Skill Loading Order
Initialize and load these skills in exact order before planning or writing code:
1. `design-taste-frontend` — set anti-slop design direction, Three Dials (VARIANCE/MOTION/DENSITY)
2. `high-end-visual-design` — enforce Doppelrand (Double-Bezel) nested card architecture & button-in-button patterns
3. `emil-design-eng` — micro-animations, spring physics, and reduced-motion compliance
4. `hallmark` — anti-AI-slop design recipes and component standards
5. `ui-checklist` — component & layout completeness check
6. `full-output-enforcement` — ensure exhaustive, unabridged code generation

---

## Authoritative Documentation to Read First
Before taking any action, view and inspect these specifications:
1. `Feature_docs/DASHBOARD_FULL_WIDGET_SPECIFICATION.md` — Complete 34-widget UI, math formula, and backend IPC specification
2. `Feature_docs/DASHBOARD_REFERENCE_ANALYSIS.md` — 5-Tab Multi-Section Feature Distribution Blueprint
3. `CONTEXT.md` — Domain glossary, 8 entities, and 8 core domain rules (especially Domain Rule 1: Habit -> Task auto-completion)
4. `context/architecture.md` — SQLite WAL mode schema, passive Windows activity tracking pipeline, and Tauri IPC commands
5. `context/progress-tracker.md` — Project implementation tracker and current phase status

---

## Core Design Principles & Aesthetic Rules
- **Top Navigation Bar Protection**: ALWAYS keep Shodasha's native top navigation bar (`/` Dashboard, `/board` Board, `/habits` Habits, `/timeline` Timeline, `/settings` Settings). NEVER convert the primary app navigation into a left sidebar.
- **Doppelrand (Double-Bezel) Machined Enclosure Architecture**:
  - Outer Shell: `bg-slate-900/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 rounded-[24px] p-1.5`
  - Inner Core: `bg-white dark:bg-zinc-900 rounded-[18px] shadow-sm p-5`
  - NO generic blur-heavy glassmorphism or low-contrast text. High readability, ultra-clean vector icons (Lucide / Phosphor Light).
- **Prevent Dashboard Overcrowding**: Strictly observe the **5-Tab Multi-Section Feature Distribution**:
  - **Dashboard (`/`)**: Daily command center ONLY. Focus Score Ring, 4 Top KPIs, Local Weather 3D Widget (Open-Meteo), Today's Urgent Todos Floating Checklist, Quiet Time Countdown Timer & Ambient Media Controls.
  - **Board (`/board`)**: 4-Column Kanban (`To do`, `In Progress`, `Need Review`, `Done`), `@dnd-kit` drag-and-drop, PDF/file attachment pills, task progress bars, Board vs List view toggles.
  - **Habits (`/habits`)**: Horizontal day streak matrix (12-31 status rings), habit duration vertical bar chart with popovers (`Meditation 45m ^4%`), positive habit growth badge (`+58.2%`), Habits Wrapped card.
  - **Timeline (`/timeline`)**: Multi-series category analytics chart (Work vs Neutral vs Distraction), horizontal time-slot schedule stream (10:00 - 13:30 visual app blocks), active app category distribution.
  - **Settings (`/settings`)**: Integrations manager (Weather API config, Spotify / Windows SMTC media controller toggle, local SQLite backup/export status).

---

## Technical & Backend Data Wiring Rules
- **Store Integrations**:
  - `useTaskStore.ts` $\rightarrow$ Kanban tasks, column ordering, task completion status, linked habit auto-completion.
  - `useHabitStore.ts` $\rightarrow$ Habits list, daily check-in records, streak math, month filter navigation.
  - `useTimeEntryStore.ts` $\rightarrow$ Passive window activity tracking, category focus scores, duration formatting.
  - `useSettingsStore.ts` $\rightarrow$ Appearance, work mode, local weather settings, integration toggles.
  - `useUIStore.ts` $\rightarrow$ Board view modes (`board` | `list`), modal visibility, active focus session state.
- **IPC & Rust Commands**:
  - Weather Widget: `invoke('get_local_weather')`
  - Media Widget: `invoke('get_active_media_session')` (Windows SMTC listener)
  - Tasks & Habits: `invoke('get_tasks')`, `invoke('get_habits')`, `invoke('update_task_status')`

---

## Execution Instructions
1. Create a step-by-step implementation plan in `implementation_plan.md`.
2. Build components in `src/components/dashboard/`, `src/components/board/`, `src/components/habits/`, `src/components/timeline/`, and `src/components/settings/`.
3. Verify that `npm run typecheck`, `npm run lint`, and `npm run build` pass cleanly without errors after every step.
```
