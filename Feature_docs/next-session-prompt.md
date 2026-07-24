# Shodasha — Product Expansion & Premium UX Polish Prompt

Copy and paste the following prompt to instruct the AI agent in the next session:

```markdown
You are taking over Shodasha — a Tauri v2 desktop productivity tracker built with Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, Rust (rusqlite + windows-sys), and Web Notifications API.

## Mandatory Skill Initialization
At the start of your turn, load and initialize these skills in order:
1. `impeccable` — for UX critique, design audit, and editorial polish
2. `gpt-taste` / `design-taste-frontend` — for anti-slop typography, balanced whitespace, and editorial visual hierarchy
3. `emil-design-eng` — for fluid interaction details, micro-animations, and reduced-motion compliance
4. `ui-checklist` — for component completeness checking
5. `full-output-enforcement` — for unabridged code generation

---

## Phase 0: Business & Product Ideation (Think Like a Product Owner)
Before writing any code, evaluate Shodasha strictly from a **business logic, user utility, and product value perspective** (not just code refactoring):

### 1. Identify Missing Business Capabilities & High-Value Features:
- **Productivity Goal Target Engine**: Allow users to set daily target focus hours (e.g., "Goal: 6h deep work/day") and display progress towards target on Dashboard & Timeline.
- **Deep Work vs. Distraction Ratio & Focus Score**: Compute a dynamic 0-100 "Productivity Index" score based on app category weighting (Work vs. Neutral vs. Distraction) with daily trend comparison.
- **Interactive Chart System Upgrade**:
  - Add interactive date-range comparison tool (e.g. "Compare This Week vs. Last Week").
  - Add interactive app hover inspection (click a day bar in the Daily Usage chart to auto-filter the Active Periods timeline and App Rankings for that specific day).
  - Add category distribution toggle (view screen time grouped by App Name OR grouped by Category).
- **Habit Streak & Milestone Rewards**: Add visual streak badges (e.g., "7-Day Focus Streak", "30-Hour Work Week") and habit completion heatmaps.
- **Kanban Board Time-Tracking Link**: Show cumulative desktop time spent per linked task directly on Kanban cards.

---

## Phase 1: Planning & Architecture Spec
1. Create a detailed implementation plan in `implementation_plan.md` covering the proposed features.
2. Outline specific business logic rules, Zustand store extensions, DB persistence needs, and component additions.
3. Keep the UI/UX **medium-density, minimalistic, and editorial**:
   - Palette: Clean editorial backgrounds, emerald accent (`#10b981`), high-contrast typography (`Inter` + `Cabinet Grotesk`).
   - Surfaces: Solid card boundaries (`border border-[var(--border)]`), subtle shadows (`shadow-xs`), NO heavy gradients or glassmorphism slop.
   - Motion: Micro-interactions via `motion` package with `prefers-reduced-motion` guards.

---

## Phase 2: Step-by-Step Implementation
Execute the plan in small, verifiable increments:
1. **Increment 1 — Goal Target & Productivity Score Engine**: Update stores and add KPI widgets to Dashboard & Timeline.
2. **Increment 2 — Interactive Chart Inspection & Comparison**: Upgrade `DailyUsageBarChart.tsx`, `AppRankingChart.tsx`, and `ActivePeriodsTimeline.tsx` with date-click cross-filtering and category view toggles.
3. **Increment 3 — Habit Streaks & Kanban Time Linking**: Enhance Habit dashboard and Kanban card badges with linked time entries.

---

## Phase 3: Verification
After EACH step, verify that all builds pass cleanly:
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `cd src-tauri && cargo check`
- Update `context/progress-tracker.md` and `Feature_docs/final-verification-checklist.md`.
```
