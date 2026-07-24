# Gap Analysis: redesign.md vs All Research Findings

Generated: 2026-07-24
Sources: Phase 1 (research documents), Phase 2 (live app UX/UI/viz research), Phase 3 (codebase diagnosis), Phase 4 (skill validation)

---

## 1. What redesign.md Specifies Correctly (with Evidence)

| Statement | Evidence Source | Confidence |
|-----------|----------------|------------|
| **P0 bugs list** — all 6 identified correctly ('use client', CSS vars, deleteColumn, SQLite clear, dual themes, IPC capabilities) | Phase 3 codebase diagnosis confirmed every single one | ✅ High |
| **Two competing theme systems** — uiStore and settingsStore both manipulate DOM classList | Phase 3b: both stores found, different toggle logic | ✅ High |
| **deleteColumn bug** — `task.id === id` instead of `task.status === id` | Phase 3b: confirmed line 200 of taskStore.ts | ✅ High |
| **Empty barrel exports** — 4 of 5 index.ts files | Phase 3a: confirmed all 4 are empty | ✅ High |
| **No loading/error states** — in any component | Phase 3a: 0/25 components have loading, 0/25 have error states | ✅ High |
| **Hardcoded colors** — multiple components bypass CSS vars | Phase 3a/3c: 22/26 components have hardcoded colors | ✅ High |
| **No prefers-reduced-motion** — 24/25 components lack guard | Phase 3a: only gooey-tabs has partial protection | ✅ High |
| **No next/font loading** — fonts are CSS-only fallbacks | Phase 3c: layout.tsx has no next/font import | ✅ High |
| **Per-tab accent colors** — 5 different tab colors in Navbar | Phase 3a: confirmed emerald/teal/violet/amber/stone | ✅ High |
| **Fraction text everywhere** — "3/10", "0/0", "0%" | Phase 3a: 4+ components show fraction text | ✅ High |
| **"Clear Database" only clears localStorage** | Phase 3d: confirmed — `localStorage.clear()` + reload only | ✅ High |
| **All timestamps say "Today"** in RecentActivityFeed | Phase 3a: confirmed — no relative time formatting | ✅ High |

---

## 2. What redesign.md Misses (Gaps Found by Research)

### Critical Gaps (P0)

| # | Gap | Source | Impact |
|---|-----|--------|--------|
| G1 | **Settings are never persisted** — 5/6 user settings (pollingInterval, idleDetection, dataRetention, themeMode, accentColor) are stored in-memory Zustand only. Every app restart resets them. Kanban columns also never persisted to SQLite. | Phase 3d | Data loss on every restart |
| G2 | **No update IPC for habits** — `habitStore.updateHabit()` modifies local Zustand state only. Rust has no `update_habit` command. Name/color changes are lost on reload. | Phase 3d | Silent data loss |
| G3 | **Kanban columns are memory-only** — add, rename, reorder, delete operations never call IPC. Three Rust commands (`get_kanban_columns`, `create_kanban_column`, `delete_kanban_column`) exist but are completely unused. | Phase 3d | Column state lost on reload |
| G4 | **No undo for any destructive action** — delete task, delete habit, clear database have no undo path. Competitor research (Phase 2a) shows Forest's "restorable setback" and Finch's "no HP loss" are winning patterns. | Phase 2a, Phase 3a | User trust erosion |
| G5 | **Notification/toast system completely absent** — no Sonner installed, no user feedback for any async operation. Every IPC failure is silently console-logged. | Phase 3a, 3d | User confusion on errors |

### High-Impact Gaps (P1)

| # | Gap | Source | Impact |
|---|-----|--------|--------|
| G6 | **Persistence story incomplete** — no `settings` table in SQLite schema. Live app research (Todoist, TickTick) shows settings persistence is baseline expectation. | Phase 2b, Phase 3d | Quality gap |
| G7 | **No relative timestamps** — all activity feed entries show "Today". Phase 2 research shows Things 3, Todoist, and TickTick all use relative time ("2h ago", "yesterday"). | Phase 2b, Phase 3a | Usability gap |
| G8 | **No data import** — export exists (client-side CSV) but import/restore is absent. No backup mechanism. | Phase 3d | Data sovereignty gap |
| G9 | **No confirmation for destructive actions** — delete column, delete habit have no confirmation dialog. Phase 2a research shows this is industry standard. | Phase 3a | User error risk |
| G10 | **Hidden date input with `opacity-0`** — confirmed in TaskModal and Timeline. Phase 2b research shows visible DatePicker is standard (Todoist, TickTick, Things 3). | Phase 2b, Phase 3a | Discoverability fail |

### Medium-Impact Gaps (P2)

| # | Gap | Source | Impact |
|---|-----|--------|--------|
| G11 | **8 backdrop-blur instances** violate Impeccable anti-pattern rules. Only the sticky navbar blur is functional; 7 are decorative. | Phase 3c, Phase 4a | Anti-slop violation |
| G12 | **`--accent-emerald` variable** used in 30+ places instead of `--accent`. Two parallel variable naming systems create confusion. | Phase 3c | Inconsistent theming |
| G13 | **Shadow system untokenized** — 9 distinct shadow values, 5 arbitrary inline shadows. Hardcoded `rgba(255,255,255,0.08)` breaks in dark mode. | Phase 3c | Dark mode breakage |
| G14 | **No `border-radius` system** — 10 distinct radius values, no CSS variables. 36px custom radius untokenized. | Phase 3c | Design inconsistency |
| G15 | **No shared components exist** — LoadingSkeleton, EmptyState, ErrorBanner are all 0 occurrences despite being specified as P1 in redesign.md. | Phase 3a | Missing architecture |
| G16 | **Profile/persona system absent** — Phase 2a research shows Finch's pet bond and Dailies' persona evolution create emotional stickiness. Not mentioned in redesign.md or shape-brief.md. | Phase 2a | Missed opportunity |

---

## 3. What in redesign.md Contradicts Validated Research

| # | Conflict | redesign.md Says | Research Says | Resolution |
|---|----------|-----------------|---------------|------------|
| C1 | **Tab navigation approach** | Top tab bar (GooeyTabs) with single accent | Phase 2b shows ALL 5 analyzed apps (Todoist, Notion, Linear, Things 3, TickTick) use LEFT SIDEBAR, not top tabs. Top tabs are rare in productivity tools. | Keep GooeyTabs as visual differentiator but consider left sidebar for deep navigation |
| C2 | **Dashboard-first with progress ring** | Dashboard default view with progress ring + KPI hero numbers | Phase 2b shows all apps default to TODAY/INBOX list, not aggregated dashboard. The "at a glance" experience is filtered task list. | Add Today/Inbox as optional default, keep dashboard as secondary view |
| C3 | **No gamification mechanics** | Shodasha is "not a game" — professional minimalism | Phase 2a research shows Finch ($1.75M/mo) and Forest (60M+ downloads) succeed through emotional mechanics (pet bond, tree death) not RPG complexity. Subtle delight != game. | Add micro-delight (confetti, streak celebrations) without full RPG |
| C4 | **Recharts for ALL charts** | Replace all custom SVG with Recharts | Phase 2c research shows custom SVG chart patterns (Apple Health rings, GitHub heatmap) often outperform library charts in clarity and performance. Keep custom for visual metaphors. | Hybrid: Recharts for standard charts, keep custom SVG for visual metaphors |
| C5 | **Single family Geist font** | One font for UI | Phase 2c research shows premium apps use 1-2 families but often with custom weights. No app uses Geist (it's not on Google Fonts). Cabinet Grotesk + Inter is already more practical. | Keep existing font stack, just load via next/font |

---

## 4. New Findings from Phase 2 (Live App Research) to Add

| # | Finding | Should Influence |
|---|---------|-----------------|
| N1 | **30-second setup is the gold standard** — Forest (30-40s) and KUBBO (30s) have fastest time-to-usefulness. Shodasha's first launch should pre-populate demo habits/tasks. | Phase 2a | Onboarding design |
| N2 | **Account wall kills conversion** — Finch delays account until after emotional bond. Forest requires account after first session. Shodasha (offline-only) doesn't need accounts at all — emphasize this. | Phase 2a | Marketing copy |
| N3 | **Left sidebar + content + optional detail pane** is the universal layout pattern (5/5 apps). Top-only navigation is rare. | Phase 2b | Navigation architecture |
| N4 | **Single accent color** is universal across premium apps (Linear #5e6ad2, Cron #ff4700, Things #2576eb). No premium app uses per-section colors. | Phase 2c | Token system |
| N5 | **Near-black/off-white canvas** — no app uses pure #000 or #fff. Linear uses #010102, Arc uses #fffcec, Cron uses #0f0d0a. | Phase 2c | Color palette |
| N6 | **Chart philosophy: one composite visual trumps multiple charts.** Strava's 3-curve Fitness/Freshness, Apple's 3 rings, GitHub's heatmap. Shodasha should find its ONE visual metaphor. | Phase 2d | Dashboard design |
| N7 | **No app uses per-tab navigation colors.** Every analyzed app has one accent color for the entire interface. | Phase 2b, 2c | Navbar redesign |
| N8 | **Forgiveness beats punishment.** Industry moving away from HP/stakes toward positive reinforcement (Finch, Forest, KUBBO). No HP loss, no streak-breaking guilt. | Phase 2a | Game mechanic design |

---

## 5. P0 Bugs Found in Phase 3 Not Addressed by redesign.md

| # | Bug | Location | redesign.md Status |
|---|-----|----------|-------------------|
| B1 | **Settings lost on restart** — 5/6 settings in-memory only | `settingsStore.ts` | ❌ NOT ADDRESSED |
| B2 | **No IPC for habit updates** — name/color changes lost | `habitStore.ts:110` | ❌ NOT ADDRESSED |
| B3 | **Kanban columns memory-only** — 3 Rust commands unused | `taskStore.ts` + `commands.rs` | ❌ NOT ADDRESSED |
| B4 | **No undo for any action** — delete task/habit/column has no rollback | All stores | ❌ NOT ADDRESSED |
| B5 | **All IPC errors silently fail** — console.error only, no user feedback | `db.ts` all wrappers | ❌ NOT ADDRESSED |

---

## 6. Skill Violations from Phase 4 Needing Fix

| # | Violation | Skill | Fix |
|---|-----------|-------|-----|
| V1 | **No prefers-reduced-motion on 24/25 components** | Impeccable (craft-floor: Motion) | Add `motion-reduce` to all animations |
| V2 | **Glass/backdrop-blur on 8 components** | Impeccable (craft-floor: Refuse) | Remove decorative blur; keep only on sticky navbar |
| V3 | **Same-size cards as page structure** (Habits page) | Impeccable (craft-floor: Refuse) | Asymmetric bento grid |
| V4 | **Fraction text instead of progress rings** | Impeccable (craft-floor: Refuse - "sparklines, progress rings...") | Use rings for completion |
| V5 | **Hardcoded shadows with rgba(255,255,255,...)** | Impeccable (Depth: "shadows carry offset and soft blur") | Systematize shadow tokens |
| V6 | **No loading/empty/error states** | Impeccable (operate mode: "Every interactive component has...") | Add all 4 states to every component |
| V7 | **Color-only signals** (green dot for done) | Impeccable + accessibility rules | Add icon/text pair with color |
| V8 | **WHAT comments in 23/25 components** | Premium Design (anti-slop: no AI-comment style) | Remove WHAT comments, keep WHY comments |

---

## 7. Updated Implementation Priorities

### P0 — Must Fix Before Any Feature Work (NEW items in bold)

1. **Add loading/error/initialized to every store** (was P1, upgraded due to Phase 4 validation)
2. Fix 'use client' in TodayProgressCard
3. Define all 8 undefined CSS variables
4. Fix deleteColumn bug in taskStore
5. Fix "Clear Database" to clear SQLite
6. Consolidate uiStore into settingsStore
7. Register all IPC commands in capabilities
8. **Load fonts via next/font** (was P1, upgraded — no fonts currently load)
9. **Persist settings to SQLite** (NEW — P0 for data integrity)
10. **Add IPC for habit updates + kanban column persistence** (NEW — P0 for data integrity)

### P1 — Important

1. Sonner toast installation + wiring
2. Add shared LoadingSkeleton, EmptyState, ErrorBanner components
3. Replace custom SVG charts with Recharts (hybrid approach)
4. Create shared StreamCard component (extract doppelrand)
5. Replace hardcoded colors with CSS variables across all components
6. Unify Navbar to single accent color
7. Fix relative timestamps in RecentActivityFeed
8. Replace hidden date inputs with visible DatePicker
9. Add per-habit streak calculations
10. Add confirmation dialogs for destructive actions
11. Replace fraction text with progress rings

### P2 — Enhancement

1. cmdK command palette
2. Passive insight engine (InsightCard)
3. Confetti on milestone completions
4. Number Ticker animations
5. Stagger entry animations
6. Standardized tooltip delay (800ms)
7. Aria-labels on all icon-only buttons
8. Data import functionality
9. Undo support for destructive actions

---

## 8. New Library Recommendations Missed by redesign.md

| Library | Purpose | Why It Was Missed |
|---------|---------|-------------------|
| **Tremor Tracker** | GitHub-style contribution tracker for habits | Not evaluated in original library research; GitHub-style heatmap is widely used (Phase 2d) |
| **HeroUI Skeleton** | Loading skeleton for shadcn/ui | redesign.md listed shadcn/ui skeleton but not HeroUI's which is more polished (Phase 1) |
| **No additional libraries needed** | — | Original research was thorough; no new critical libraries found |

## 9. Library Recommendations to Remove from redesign.md

| Library | Reason |
|---------|--------|
| **Nivo** (@nivo/calendar, @nivo/core) | Overengineered for a single heatmap. Custom SVG heatmap that already exists (HabitHeatmap) can be fixed with CSS vars instead of replaced. |
| **Aceternity UI** | Marketing-focused; Phase 2c research confirms Magic UI provides same patterns without marketing slant |

---

## Summary

- **Correct in redesign.md:** 12 items confirmed with evidence
- **Gaps found:** 16 gaps (5 P0, 5 P1, 6 P2)
- **Conflicts with research:** 5 areas needing resolution
- **New insights from live research:** 8 patterns to incorporate
- **Bugs not in redesign.md:** 5 P0 bugs discovered
- **Skill violations:** 8 violations requiring fixes
- **Priority changes:** Settings persistence, font loading, IPC gaps upgraded to P0
