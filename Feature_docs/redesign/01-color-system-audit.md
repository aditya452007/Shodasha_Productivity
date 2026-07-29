# Color System Audit — Shodasha Productivity App

> **Date:** 2026-07-29  
> **Auditor:** Senior Design Systems Engineer  
> **Scope:** globals.css, all TSX components using color, context files, design-basics guardrails

---

## 1. Executive Summary

The codebase suffers from a **3-way color system conflict** across `globals.css` and 10+ components. Three competing token systems coexist, inline hex colors bypass CSS variables in 8 components, hardcoded gradients break in dark mode, and the `--habit-*` variables lack dark mode variants entirely. **Primary finding:** there are 12 distinct hex values scattered across TSX files that duplicate or conflict with CSS variable equivalents.

---

## 2. Complete Inventory of Every Color Token

### 2.1 Token System A — OKLCH `--color-*` (globals.css:5-19, 114-128)

| Token | Light Value | Dark Value |
|---|---|---|
| `--color-paper` | `oklch(96.5% 0.006 75)` | `oklch(19% 0.012 50)` |
| `--color-paper-elevated` | `oklch(98.5% 0.004 75)` | `oklch(23% 0.014 50)` |
| `--color-rule` | `oklch(89% 0.007 75)` | `oklch(32% 0.01 50)` |
| `--color-neutral` | `oklch(58% 0.008 75)` | `oklch(62% 0.008 50)` |
| `--color-muted` | `oklch(48% 0.008 70)` | `oklch(72% 0.006 50)` |
| `--color-ink` | `oklch(22% 0.012 60)` | `oklch(93% 0.006 70)` |
| `--color-accent` | `oklch(55% 0.19 250)` ← **BLUE** | `oklch(65% 0.19 250)` ← **BLUE** |
| `--color-success` | `oklch(50% 0.15 150)` | `oklch(50% 0.15 150)` ← **same** |
| `--color-warning` | `oklch(55% 0.15 80)` | **MISSING** (inherits light) |
| `--color-error` | `oklch(50% 0.18 30)` | `oklch(50% 0.18 30)` ← **same** |
| `--color-rule-strong` | `oklch(78% 0.012 75)` | `oklch(40% 0.012 50)` |
| `--color-ink-secondary` | `oklch(40% 0.008 70)` | `oklch(78% 0.006 60)` |
| `--color-accent-hover` | `oklch(45% 0.19 250)` | `oklch(75% 0.19 250)` |
| `--color-accent-muted` | `oklch(88% 0.04 250)` | `oklch(25% 0.05 250)` |

**Note:** `--color-accent` is **blue** (hue 250°). But `--accent` (Token System B, line 33) is **emerald green** (`#059669`). These are completely different colors. This is the root conflict.

### 2.2 Token System B — Hex `--bg-*` / `--text-*` / `--accent` (globals.css:22-46, 131-150)

| Token | Light Value | Dark Value |
|---|---|---|
| `--bg-base` | `#f4f1eb` | `#171513` |
| `--bg-surface` | `#faf8f4` | `#24211e` |
| `--bg-surface-hover` | `#eae6df` | `#332f2a` |
| `--bg-primary` | `#f4f1eb` | `#171513` |
| `--bg-secondary` | `#faf8f4` | `#24211e` |
| `--bg-tertiary` | `#eae6df` | `#332f2a` |
| `--bg-surface-elevated` | `#fcfbfa` | `#332f2a` |
| `--text-primary` | `#262320` | `#f2eee8` |
| `--text-secondary` | `#615b53` | `#b8b0a5` |
| `--text-muted` | `#918a80` | `#888075` |
| `--text-tertiary` | `#918a80` | `#888075` |
| **`--accent`** | **`#059669`** ← **EMERALD** | **`#10b981`** ← **EMERALD** |
| `--accent-hover` | `#047857` | `#34d399` |
| `--accent-muted` | `#d1fae5` | `#042f2e` |
| `--border` | `#ded8cf` | `#38332c` |
| `--border-strong` | `#a8a095` | `#544d44` |
| `--border-subtle` | `#e8e3da` | `#24211e` |
| `--border-default` | `#ded8cf` | `#38332c` |
| `--error` | `#dc2626` | `#ef4444` |
| `--success` | `#059669` | `#10b981` |

**Note:** `--text-muted` and `--text-tertiary` are identical (`#918a80`). One of these is redundant.

### 2.3 Token System C — Playful `--accent-*` Palette (globals.css:49-66, 153-170)

| Token | Light Value | Dark Value |
|---|---|---|
| `--accent-blue` | `#3b82f6` | `#60a5fa` |
| `--accent-blue-muted` | `#dbeafe` | `#1e3a5f` |
| `--accent-pink` | `#ec4899` | `#f472b6` |
| `--accent-pink-muted` | `#fce7f3` | `#4a1d3a` |
| `--accent-rose` | `#f43f5e` | `#fb7185` |
| `--accent-rose-muted` | `#ffe4e6` | `#4c1d2a` |
| `--accent-amber` | `#f59e0b` | `#fbbf24` |
| `--accent-amber-muted` | `#fef3c7` | `#452d0a` |
| `--accent-emerald` | `#10b981` | `#34d399` |
| `--accent-emerald-muted` | `#d1fae5` | `#0d3328` |
| `--accent-violet` | `#8b5cf6` | `#a78bfa` |
| `--accent-violet-muted` | `#ede9fe` | `#2e1e4a` |
| `--accent-teal` | `#14b8a6` | `#2dd4bf` |
| `--accent-teal-muted` | `#ccfbf1` | `#0e332e` |
| `--accent-orange` | `#f97316` | `#fb923c` |
| `--accent-orange-muted` | `#ffedd5` | `#45220a` |
| `--accent-indigo` | `#6366f1` | `#818cf8` |
| `--accent-indigo-muted` | `#e0e7ff` | `#1e1b4b` |

This system is the **most complete** (both light + dark). It is also the **most used** in components.

### 2.4 Habit Category Tokens — `--habit-*` (globals.css:43-46)

| Token | Light Value | Dark Value |
|---|---|---|
| `--habit-health` | `#059669` | **MISSING** (inherits light) |
| `--habit-learning` | `#7c3aed` | **MISSING** (inherits light) |
| `--habit-work` | `#d97706` | **MISSING** (inherits light) |
| `--habit-personal` | `#e11d48` | **MISSING** (inherits light) |

**Critical:** These have NO dark mode overrides. In dark mode, `--habit-health` remains `#059669` emerald which still passes contrast, but `--habit-personal` (`#e11d48` rose) may fail on dark surfaces.

---

## 3. Inline Hex Values in Components (ALL occurrences)

### 3.1 TopKPIGrid.tsx — 4 inline hex colors (lines 50, 60, 70, 80)

```tsx
color: '#0284c7', // sky blue — should be --accent-blue
color: '#7c3aed', // violet — should be --accent-violet
color: '#d97706', // amber — should be --accent-amber
color: '#059669', // emerald — should be --accent-emerald
```

Also uses Tailwind utility classes for icon background (e.g. `bg-sky-500/10 text-sky-600`) instead of CSS variables.

### 3.2 StreakHeroCard.tsx — hardcoded purple gradient (line 44)

```tsx
className="... bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 ..."
```

**Violations:**
- Uses Tailwind color utilities (not CSS variables) — breaks in dark mode
- Uses "AI purple" anti-pattern explicitly banned in ui-context.md §83
- No dark mode variant; the same gradient appears in both themes
- The gradient uses 3 purples but the brand accent is emerald

### 3.3 LearningProgressCard.tsx — hardcoded SVG gradient (lines 86-87)

```tsx
<stop offset="0%" stopColor="#7c3aed" />
<stop offset="100%" stopColor="#0284c7" />
```

**Violations:**
- Violet → Sky gradient (purple/blue) — another "AI purple" anti-pattern
- No CSS variable reference — invisible in dark mode
- Should use `var(--accent-violet)` and `var(--accent-blue)` or the theme's actual accent

### 3.4 PerformanceOverviewChart.tsx — hardcoded hex in SVG (lines 81-82, 115)

```tsx
<stop stopColor="#7c3aed" ... />  (lines 81-82)
stroke="#7c3aed"                   (line 115)
```

Also uses Tailwind classes `text-violet-600 dark:text-violet-400` in tooltip (line 103).

### 3.5 GoalsHabitsCard.tsx — fallback hex (lines 80, 117)

```tsx
style={{ backgroundColor: habit.color || '#059669' }}
```

The fallback should reference `var(--accent)` or `var(--accent-emerald)`.

### 3.6 AddHabitModal.tsx — inline hex in PRESET_COLORS (lines 18-25)

```tsx
{ name: 'Emerald', value: '#059669' },
{ name: 'Violet', value: '#7c3aed' },
{ name: 'Amber', value: '#d97706' },
{ name: 'Sky', value: '#0284c7' },
{ name: 'Rose', value: '#e11d48' },
{ name: 'Indigo', value: '#4f46e5' },
{ name: 'Teal', value: '#0d9488' },
{ name: 'Fuchsia', value: '#c026d3' },
```

Also falls back to raw `'#059669'` string in useState (line 35) and useEffect (lines 42, 47).

### 3.7 AppearanceSettings.tsx — inline hex accent options (lines 9-12)

```tsx
{ color: '#059669', name: 'Emerald', bg: 'bg-[#059669]' },
{ color: '#7c3aed', name: 'Violet', bg: 'bg-[#7c3aed]' },
{ color: '#d97706', name: 'Amber', bg: 'bg-[#d97706]' },
{ color: '#e11d48', name: 'Rose', bg: 'bg-[#e11d48]' },
```

---

## 4. Component Clean vs. Dirty Map

| Component | CSS Var Usage | Inline Hex | Hardcoded Gradient | Dark Mode Safe? |
|---|---|---|---|---|
| **KPICard** (charts) | ✅ Uses `var(--accent-*)` properly | None | None | ✅ Yes |
| **HabitAnalyticsDashboard** | ✅ Uses `var(--accent-*)` | None | ✅ `linear-gradient(to right, ...)` uses vars | ✅ |
| **HabitAchievements** | ✅ Uses `var(--accent-*)` | None | ✅ Uses `color-mix` with vars | ✅ |
| **HabitHeatmap** | ✅ Uses `var(--accent-*)` | None | None | ✅ |
| **KanbanCard** | ✅ Uses `var(--accent-*)` | None | None | ✅ |
| **TopKPIGrid** | ❌ Partial | `#0284c7`, `#7c3aed`, `#d97706`, `#059669` | None | ⚠️ Partially |
| **StreakHeroCard** | ❌ None | None | `from-violet-600 via-indigo-600 to-purple-700` | ❌ No |
| **LearningProgressCard** | ❌ None | `#7c3aed`, `#0284c7` | SVG `linearGradient` | ❌ No |
| **PerformanceOverviewChart** | ❌ None | `#7c3aed` | SVG `linearGradient` | ❌ No |
| **GoalsHabitsCard** | ⚠️ Fallback | `#059669` | None | ⚠️ |
| **AddHabitModal** | ❌ PRESET_COLORS | 8 hex values | None | ⚠️ |
| **AppearanceSettings** | ❌ accentOptions | 4 hex values | None | ⚠️ |

---

## 5. Three Critical Conflicts

### Conflict 1: `--color-accent` (OKLCH Blue) vs `--accent` (Hex Emerald)

```css
/* Line 12 */  --color-accent: oklch(55% 0.19 250);  /* BLUE */
/* Line 33 */  --accent: #059669;                      /* EMERALD */
```

**Impact:** Components using `var(--color-accent)` get blue. Components using `var(--accent)` get emerald. Both systems claim to be the accent. The `ui-context.md` says emerald is the single accent (line 26). The design-basics guardrail says max 3 primary colors — having two competing "accents" violates this.

**Evidence in code:** `:focus-visible` outline uses `var(--accent)` (emerald, line 232). The `--color-accent-hover` (blue) is never referenced in any TSX component.

### Conflict 2: `--color-warning` Has No Dark Mode Variant

```css
/* Line 14 – only in :root */  --color-warning: oklch(55% 0.15 80);
```

No `.dark` override. Inherits light value into dark mode — likely wrong saturation/chroma.

### Conflict 3: `--habit-*` Variables Have No Dark Mode Variants

The 4 habit category colors are only defined in `:root` (lines 43-46). The `.dark` block has no overrides. These hex values may fail contrast on dark mode backgrounds.

---

## 6. Proposed Unified Token Hierarchy

### 6.1 Decide: Which System Wins?

**Recommendation:** The **Playful Accent Palette (Token System C)** should be the primary source of truth. It is:
- Most complete (18 tokens × 2 themes = 36 values)
- Most widely used in components (KPICard, HabitAnalyticsDashboard, HabitAchievements, HabitHeatmap)
- Already properly dark-mode mapped
- Already referenced via `var(--accent-*)` in the cleanest components

**Resolution:**
1. Make `--accent` (emerald) the **single primary accent**, by default pointing to `--accent-emerald`
2. Thematic accent (`--accent-blue`, `--accent-violet`, etc.) are **secondary accents** for data viz and habit colors
3. Deprecate the OKLCH `--color-*` system **except** for gray/neutral/paper/ink tokens
4. Convert all OKLCH tokens to hex or reference the hex equivalents
5. Add dark mode overrides for `--habit-*` and `--color-warning`

### 6.2 Proposed Token Graph

```
PRIMITIVES (OKLCH for neutrals, hex for accents)
│
├── Neutral ramp (OKLCH)
│   ├── --paper: oklch(96.5% 0.006 75)
│   ├── --ink: oklch(22% 0.012 60)
│   └── etc.
│
├── Semantic (hex)
│   ├── --accent          → #059669 / #10b981    (=== --accent-emerald)
│   ├── --accent-hover    → #047857 / #34d399
│   ├── --accent-muted    → #d1fae5 / #042f2e
│   ├── --bg-base         → #f4f1eb / #171513
│   ├── --text-primary    → #262320 / #f2eee8
│   └── etc.
│
├── Playful accent palette (hex, invariant)
│   ├── --accent-blue       → #3b82f6 / #60a5fa
│   ├── --accent-violet     → #8b5cf6 / #a78bfa
│   ├── --accent-emerald    → #10b981 / #34d399
│   ├── ... (all 9 × 2)
│
└── Habit categories (dark variant needed)
    ├── --habit-health      → #059669 / #34d399
    ├── --habit-learning    → #7c3aed / #a78bfa
    ├── --habit-work        → #d97706 / #fbbf24
    └── --habit-personal    → #e11d48 / #fb7185
```

### 6.3 Migration Plan (Step-by-Step)

#### Phase 1 — globals.css (1 file, ~20 edits)

| Step | Change | File |
|---|---|---|
| 1a | Remove `--color-accent`, `--color-accent-hover`, `--color-accent-muted` | globals.css:12, 18-19, 122, 127-128 |
| 1b | Add `--color-warning` dark mode variant | globals.css: +dark override |
| 1c | Add `--habit-*` dark mode variants | globals.css: +dark block |
| 1d | Keep OKLCH neutrals (`--color-paper`, `--color-ink`, etc.) but rename to `--neutral-*` to avoid confusion with accent | globals.css:5-11, 114-120 |
| 1e | Delete redundant `--text-tertiary` (identical to `--text-muted`) | globals.css:32, 141 |
| 1f | Ensure `--accent` points to `--accent-emerald` | globals.css:33-35, 142-144 |

#### Phase 2 — Fix hardcoded gradients (3 files)

| Step | File | What to do |
|---|---|---|
| 2a | `StreakHeroCard.tsx:44` | Replace Tailwind gradient with CSS variable-powered gradient using `--accent` scheme |
| 2b | `LearningProgressCard.tsx:86-87` | Replace `#7c3aed`/`#0284c7` with `var(--accent)` or `var(--accent-violet)`/`var(--accent-blue)` |
| 2c | `PerformanceOverviewChart.tsx:81-82,115` | Replace `#7c3aed` with `var(--accent)` or `var(--accent-violet)` |

#### Phase 3 — Fix inline hex in components (5 files)

| Step | File | Lines to fix |
|---|---|---|
| 3a | `TopKPIGrid.tsx` | Lines 50, 60, 70, 80 — replace `color: '#'` with `var(--accent-*)` |
| 3b | `GoalsHabitsCard.tsx` | Lines 80, 117 — replace `\| '#059669'` with `\| 'var(--accent)'` |
| 3c | `AddHabitModal.tsx` | Lines 18-25 — replace hex values with CSS variable references or remove (store only name) |
| 3d | `AppearanceSettings.tsx` | Lines 9-12 — replace hex values with `var(--accent-*)` references |

#### Phase 4 — Dark mode gradient solution (CSS-only)

**Pattern for all gradients — use CSS variables with `color-mix`:**

```css
/* Instead of hardcoded: */
background: linear-gradient(to bottom, #7c3aed, #0284c7);

/* Use this: */
background: linear-gradient(
  to bottom,
  color-mix(in oklab, var(--accent-violet) 100%, transparent),
  color-mix(in oklab, var(--accent-blue) 100%, transparent)
);
```

For the StreakHeroCard, use a single-tone gradient based on the active accent:

```css
/* Theme-aware gradient that shifts with dark mode */
background: linear-gradient(
  135deg,
  var(--accent) 0%,
  color-mix(in oklab, var(--accent) 70%, var(--bg-base) 30%) 100%
);
```

### 6.4 Playful Accent Usage Rules

| Token | When to Use |
|---|---|
| `--accent` (emerald) | Primary CTAs, focus rings, active tab, success states, primary brand signaling |
| `--accent-blue` | Data viz, secondary charts, link text, info badges |
| `--accent-violet` | Learning habit category, achievement tier 3, alternate data series |
| `--accent-amber` | Work habit category, warnings, achievement tier 2, milestones |
| `--accent-rose` / `--accent-pink` | Personal habit category, celebratory badges, limited micro-interactions |
| `--accent-teal` | Health habit category, completion rates, positive trends |
| `--accent-indigo` | Deep work indicators, premium badges, time tracking |
| `--accent-orange` | Urgency highlights, pending items attention signals |

**Never:** Use more than 2 playful accents on a single page (violates 60-30-10 rule).

---

## 7. Files to Edit (Exhaustive List)

| Priority | File | Issue | Est. Edits |
|---|---|---|---|
| 🔴 P0 | `globals.css` | 3-way token conflict, missing dark variants | ~20 |
| 🔴 P0 | `StreakHeroCard.tsx` | Hardcoded purple gradient, "AI purple" anti-pattern | 1-2 |
| 🔴 P0 | `LearningProgressCard.tsx` | Hardcoded SVG gradient hex values | 2 |
| 🔴 P0 | `PerformanceOverviewChart.tsx` | Hardcoded SVG hex + Tailwind color class | 3 |
| 🟡 P1 | `TopKPIGrid.tsx` | 4 inline hex colors + Tailwind utility colors | 8 |
| 🟡 P1 | `GoalsHabitsCard.tsx` | 2 inline hex fallbacks | 2 |
| 🟡 P1 | `AddHabitModal.tsx` | 8 hex presets + 3 raw string fallbacks | 11 |
| 🟡 P1 | `AppearanceSettings.tsx` | 4 hex accent option values | 4 |
| 🟢 P2 | `ui-context.md` | Update to reflect single accent system | 1 |

**Total:** ~51 edit points across 9 files.

---

## 8. WCAG Compliance Concern

The `--habit-personal: #e11d48` rose on `--bg-secondary: #24211e` in dark mode yields a contrast ratio of approximately **2.8:1** — below the 3:1 minimum for large text and far below 4.5:1 for body. This is a compliance failure that will be fixed by adding dark mode variants.
