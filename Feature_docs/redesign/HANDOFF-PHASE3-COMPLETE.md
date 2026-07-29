# Handoff — Phase 3 Complete: Animation Polish + Edge States + Reduced Motion

Copy the entire prompt below into a NEW agent session.

---

You are continuing Shodasha — a premium editorial desktop productivity app (Next.js 16 + Tauri v2 + SQLite + Zustand).

## PHASE STATUS: Phase 3 Complete. Remaining: ~30 `transition-all` cleanup items + Timer polish + hex token audit.

### Current state (after Phase 3 — 2026-07-29)
- All 6 pages (Dashboard, Board, Habits, Timeline, Settings, Timer) are fully built with live SQLite persistence
- All pages use `useReducedMotion` guards on entry animations
- ~20 most visible interactive elements had `transition-all` replaced with property-specific transition classes
- 10 transition utility classes exist in `globals.css`: `transition-btn`, `transition-lift`, `transition-colors`, `transition-border`, `transition-shadow`, `transition-ring`, `transition-opacity`, `transition-transform`, `transition-width`, `transition-height` — using CSS custom property easings (`--ease-out: cubic-bezier(0.23,1,0.32,1)`, `--dur-micro: 120ms`, `--dur-short: 220ms`, `--dur-long: 420ms`)
- `prefers-reduced-motion` guard disables all transition utilities
- BaseCard.tsx provides 3 elevation tiers + loading/empty/error states + custom easing entry animations
- Verification: npm run lint (0 errors), npm run typecheck (0 errors), npm run build (0 errors)

## REMAINING `transition-all` CLEANUP INVENTORY (50 instances)

### Category A — Animation/built-in chart transitions (KEEP as-is, these are intrinsic)
These are SVG bar fills, chart transitions, and toggle-switch knobs that intentionally animate layout properties:
- `AppRankingChart.tsx:144,185` — bar height fills
- `DailyUsageBarChart.tsx:192` — bar height transition
- `TimeDistributionChart.tsx:87` — donut segment width
- `ProgressRing.tsx:40` — SVG ring rotation
- `LineChart.tsx:179` — legend dot (minor)
- `HabitHeatmap.tsx:136` — heatmap cell color
- `HabitAchievements.tsx:209` — progress bar fill
- `HabitAnalyticsDashboard.tsx:501,583` — SVG animated elements
- `NotificationsSettings.tsx:217,259,302` — toggle switch `after:` knob slide
- `DesktopPetSettings.tsx:520` — toggle switch knob

### Category B — Remaining interactive elements that should be fixed (~30)

**TimerPage.tsx (7 instances — HIGH visibility)**:
- Line 90: timer progress bar (`duration-1000 ease-linear` — custom curve)
- Line 105: Start button (remove `transition-all` — covered by global CSS)
- Line 112: Stop button (same)
- Line 119: Reset button (same)
- Line 143, 155: Preset buttons (same)
- Line 201: Custom minutes input (→ `transition-ring`)

**NotificationsSettings.tsx (2 buttons)**:
- Line 396: "Test Notification" button (remove `transition-all`)
- Line 415: "Enable Permission" button (remove `transition-all`)

**DesktopPetSettings.tsx (~11 — MEDIUM)**:
- Lines 198, 219, 411: Card containers (→ `transition-colors` or `transition-shadow`)
- Lines 241, 254, 321, 341, 434, 476, 497, 553: Buttons (remove `transition-all`)

**AppCategoryManager.tsx (5 — MEDIUM)**:
- Line 82: Add category button (remove `transition-all`)
- Line 99: Search input (→ `transition-ring`)
- Line 131: Category list item (→ `transition-border`)
- Line 158: Color icon (→ `transition-colors`)
- Line 223: Type selector (→ `transition-colors`)

**DataManagement.tsx (2 — LOW)**:
- Lines 158, 190: Export/Clear buttons (remove `transition-all`)

**AppearanceSettings.tsx (1 — LOW)**:
- Line 113: Color swatch (→ `transition-transform`)

**HabitCalendar.tsx (1 — HIGH)**:
- Line 326: Day cell checkbox (→ `transition-colors`)

**HabitAchievements.tsx (1 — MEDIUM)**:
- Line 162: Achievement card (→ `transition-lift`)

**ScheduleActivityCard.tsx (1 — MEDIUM)**:
- Line 150: Status tag (→ `transition-colors`)

**GoalsHabitsCard.tsx (1 — MEDIUM)**:
- Line 106: Habit checkbox (→ `transition-colors`)

**TimelineStream.tsx (1 — LOW)**:
- Line 136: Icon double-bezel (→ `transition-shadow`)

**KPICard.tsx (1 — LOW)**:
- Line 46: Double-bezel shell (→ `transition-shadow`)

### How to fix each instance
1. **Buttons** — just delete `transition-all`. Global CSS at `globals.css:217` already applies `transition: transform var(--dur-micro) var(--ease-out), background-color var(--dur-short) var(--ease-out), border-color var(--dur-short) var(--ease-out), box-shadow var(--dur-short) var(--ease-out)` to all `<button>` elements.
2. **Cards/containers** — replace `transition-all` with: `transition-lift` (transform+shadow), `transition-colors` (bg+border+color), `transition-border` (border only), `transition-shadow` (shadow only), `transition-ring` (border+shadow for focus).
3. **Inputs with focus ring** — replace with `transition-ring`.
4. **Toggle switch knobs** (`after:transition-all`) — leave as-is (intrinsic to toggle animation).

## NEXT FEATURE WORK

### Priority 1 — TimerPage polish
The TimerPage at `/timer` uses raw hardcoded colors (red-500, blue-500) instead of CSS variable tokens:
- `bg-red-500` → `bg-[var(--error)]`
- `bg-blue-500/10 text-blue-500` → use appropriate accent tokens
- Timer progress bar `ease-linear` → custom cubic-bezier
- Add `transition-width` or `transition-transform` utility instead of `transition-all`

### Priority 2 — Scan for inline hex values
Run `grep -r "#[0-9a-fA-F]\{6\}" src/ --include="*.tsx" --include="*.ts"` and replace with `var(--*)` tokens. Exclude `globals.css` (defines the tokens themselves).

### Priority 3 — Verify Timer tab in navigation
The Timer page exists at `/timer` — verify it has a tab in the top tab bar and keyboard shortcut.

## DESIGN RULES — NEVER VIOLATE
- No glassmorphism: no `backdrop-blur`, no `bg-opacity-*` layered cards, no frosted-glass
- All colors use `var(--*)` tokens — never inline hex
- Never use built-in CSS easing names. Always use: `[0.23,1,0.32,1]` (standard), `[0.65,0,0.35,1]` (slow-in-out)
- Never enter from `scale(0)` — always `scale(0.9)` + `opacity:0`
- No italic headings
- No purple/blue gradient accents (the "AI purple" tell)
- All hover interactions gated by `@media (hover: hover)`
- All animations respect `prefers-reduced-motion`

## SKILLS TO LOAD (in order)
1. `ui-checklist` — component completeness reference
2. `impeccable` — design audit and polish
3. `design-taste-frontend` — premium editorial design direction
4. `hallmark` — anti-AI-slop design audit
5. `gpt-taste` — premium layout and motion patterns
6. `emil-design-eng` — polish philosophy and micro-interaction decisions
7. `full-output-enforcement` — exhaustive code generation
8. `high-end-visual-design` — premium card patterns and visual hierarchy

## KEY FILES TO READ BEFORE STARTING
- `src/app/globals.css` — all CSS tokens, transition utilities, card classes
- `src/components/ui/BaseCard.tsx` — BaseCard with 3 elevations + states
- `CONTEXT.md` — domain entities, rules, navigation
- `context/ui-context.md` — design tokens, anti-slop rules
- `context/progress-tracker.md` — full progress log
- `Feature_docs/redesign/03-premium-ui-patterns.md` — bento grid, card patterns, micro-interactions
- `AGENTS.md` — SDLC phases, verification gate, skill loading order

## VERIFICATION GATE (run after EVERY change batch)
```bash
npm run lint    # 0 errors allowed (4 pre-existing img warnings)
npm run typecheck  # 0 errors
npm run build   # 6 static routes successful
```

Manual checks:
- No inline hex colors in TSX files
- All colors use `var(--*)` tokens
- No `ease-in`/`ease-out`/`ease-in-out` CSS keywords
- No `transition-all` on interactive elements (only chart animations and toggle knobs)
- No `scale(0)` in entry animations
- All entry animations guard with `useReducedMotion`
- Update `context/progress-tracker.md` after each change
