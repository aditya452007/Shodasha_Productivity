# Design Basics Audit — Shodasha Productivity

Audited against foundational design fundamentals: proximity, alignment, contrast, hierarchy, consistency, white space, color, typography, balance.

---

## 1. Proximity & Grouping

**What works:**
- `globals.css:402-410` — Bento grid system uses `gap: var(--space-lg)` (1.5rem), providing consistent breathing room between grouped cards.
- `src/app/page.tsx:27` — Dashboard sections separated by `gap-6` and clear delimiters (gamification row, middle tier, bottom tier).
- `src/app/settings/page.tsx:109` — Settings uses a 2-column sidebar/content layout with `gap-6`.
- TimelineStream (`TimelineStream.tsx:103`) uses a vertical timeline with `before:absolute` pseudo-element line — good spatial grouping of related time entries.
- `AchievementBadge.tsx:205` — Badge grid uses `gap-4`, category sections separated by `space-y-6`.

**Issues:**

1. **Dashboard clutter — too many co-equal groups** (`src/app/page.tsx:26-82`)
   The dashboard packs 7 distinct visual groups (greeting, 4 KPI cards, gamification row, schedule + learning, quick task, goals + streak + chart, insight) into a single scroll. Each group gets equal visual weight, creating cognitive overload. The bento grid treats 5/3/4 and 7/5 and 4/3/5 groupings as equally important when they are not.

2. **LevelUpCelebration overlay detached from trigger** (`LevelUpCelebration.tsx:42`)
   The celebration overlay fires `fixed inset-0 z-50`, disconnected from the gamification elements it relates to. The user sees a floating modal with no visible connection to the XP bar or level indicator.

3. **HabitCalendar sticky columns create broken groups** (`HabitCalendar.tsx:172,190`)
   The habit name column (`sticky left-0`) and rate column (`sticky right-0`) visually separate from the scrolling center. While intentional, the shadow borders (`shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)]`) create visual breaks that can misalign with the data rows on scroll.

4. **Task history section buried inside board page** (`src/app/board/page.tsx:62`)
   The completed tasks history is a collapsible section inside a BaseCard below the KanbanBoard. It shares a card container with its toggle button, but the accordion behavior hides the grouped content from its trigger label.

---

## 2. Alignment Audit

**What works:**
- Consistent left-alignment of body text and labels across all pages.
- KPI grid cards (`TopKPIGrid.tsx:102`) use consistent `flex flex-col gap-1` for text stacking.
- Schedule items (`ScheduleActivityCard.tsx:117`) use a consistent `flex items-center` row pattern.

**Issues:**

1. **Mixed time alignment in ScheduleActivityCard** (`ScheduleActivityCard.tsx:118`)
   Time labels use `text-right` with `min-w-[64px]`. Duration on the right side of timeline entries uses the same pattern. This creates a ragged right edge when time strings vary in length.

2. **Misaligned card inner padding** (`ScheduleActivityCard.tsx:55`, `LearningProgressCard.tsx:32`)
   Schedule uses `p-5 sm:p-6`, LearningProgress uses same. But GoalsHabitsCard (`GoalsHabitsCard.tsx:22`) also uses `p-5 sm:p-6`. Consistent alignment here is good, **but** TimelineStream (`TimelineStream.tsx:137`) uses `p-5` inside a custom double-bezel wrapper (`p-1.5 rounded-[2rem]`) — the inner content does not align with BaseCard cards elsewhere.

3. **Date selector alignment quirk** (`src/app/timeline/page.tsx:77-109`)
   The date selector uses `flex flex-wrap items-center gap-2.5 self-start lg:self-auto`. On mobile the date bar wraps oddly — the "Back to Today" and "Refresh" buttons can sit below the date picker at different baselines depending on viewport width.

4. **Icon-text baseline gaps** (`TopKPIGrid.tsx:104-108`)
   The KPI items use `flex items-center gap-2` for the dot + label row. The dot (`w-2 h-2 rounded-full`) sits at the center of the text line, not aligned to the text baseline, creating a slight visual disconnect.

5. **Main content padding inconsistency** 
   - Layout (`src/app/layout.tsx:45`): `px-6 py-8`
   - Timeline page (`src/app/timeline/page.tsx:57`): `px-2 sm:px-4` — **narrower padding**
   - Known Issue #6 confirmed: cards in bento grids can clip their right padding on narrow viewports because the grid `gap` pushes content without matching margin compensation.

---

## 3. Contrast & Readability

**What works:**
- Well-defined CSS custom properties for text colors (`globals.css:27-29`): `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-muted`.
- Dark mode uses warm espresso `#24211e` backgrounds, avoiding pure black — reduces eye strain.
- Focus-visible outlines use accent color (`globals.css:231-235`) — good accessibility practice.

**Issues:**

1. **Dark mode secondary text contrast borderline** (`globals.css:133`)
   `--text-secondary: #b8b0a5` on `--bg-surface: #24211e` yields approximately **5.1:1 contrast** — barely passing WCAG AA for normal text (4.5:1). At `text-xs` (12px) used widely (e.g., `HeaderGreetingCard.tsx:39`, `GoalsHabitsCard.tsx:34`), this becomes hard to read.

2. **Action badge text on colored backgrounds** (`TopKPIGrid.tsx:49`)
   Badges use `text-emerald-600 dark:text-emerald-400` on `bg-emerald-500/15` — the 15% opacity background on the light emerald badge may not provide sufficient contrast for the darker emerald text.

3. **Category badge contrast in TimelineStream** (`TimelineStream.tsx:157-165`)
   Distraction badges use `bg-red-500/10 text-red-600 dark:text-red-400`. On `bg-surface` (`#faf8f4` light / `#24211e` dark), the 10% red background is extremely subtle. The text alone carries the meaning — insufficient for color vision deficiency users.

4. **"New" badge on AchievementBadge** (`AchievementBadge.tsx:105-108`)
   Uses `linear-gradient(135deg, var(--accent-amber), var(--accent-orange))` with white text. The gradient mixes amber and orange at varying brightness — white text may lose contrast over the lighter mid-section of the gradient.

5. **Dashed border on locked habit cells** (`HabitCalendar.tsx:306-311`)
   `border-dashed border-[var(--border-subtle)]` with `opacity-40` on `bg-[var(--bg-tertiary)]/20`. Multiple transparency layers stacked reduce contrast to near-invisible for some users.

6. **Placeholder text contrast** (`QuickTaskInput.tsx:44`)
   `placeholder-[var(--text-muted)]` maps to `#918a80` (light) or `#888075` (dark). On `--bg-surface` backgrounds this can drop to ~3:1 contrast for placeholder text — below WCAG AA for large text even.

---

## 4. Visual Hierarchy

**What works:**
- H1 headings use `text-2xl sm:text-3xl font-bold tracking-tight` with `font-display` — clear top-level hierarchy (`HeaderGreetingCard.tsx:36`).
- Section headers use `text-lg font-bold font-display` — good second level (`HabitCalendar.tsx:123`).
- KPI card values use `text-2xl font-bold tracking-tight` — numerical prominence is clear (`TopKPIGrid.tsx:109`).

**Issues:**

1. **Dashboard has no clear primary action or focus** (`src/app/page.tsx:26-82`)
   Seven rows of content compete for attention. The greeting header + KPI grid alone takes 5 items at the top. The user must scroll past KPI cards, gamification, schedule, focus chart, goals, streak, performance chart, and insight to reach any actionable item. No visual "this is what you should do now" element.

2. **Level vs XP hierarchy inverted in XPProgressBar** (`XPProgressBar.tsx:183-189`)
   Level number (`text-2xl sm:text-3xl font-black`) is significantly larger than the XP total (`text-xs font-mono`). The level is a derivative metric — XP is the primary growth metric. The visual weight should reflect actual importance.

3. **Card title vs badge competition** (`LearningProgressCard.tsx:41-57`)
   Card title "Focus & Time Distribution" (`text-base font-bold`) competes with the filter dropdown and the donut chart percentage (`text-2xl font-bold`). The user's eye may jump to the percentage before the card label.

4. **Button hierarchy flattened** (`src/app/habits/page.tsx:84-91`)
   The "New Habit" CTA uses the same accent color and similar weight as "View All" links and various "Today" buttons. Primary actions lack distinctive visual prominence.

5. **Timeline page header crowded** (`src/app/timeline/page.tsx:60-130`)
   The span badge, H1, subtitle, date picker, back-to-today button, and refresh button all sit in one header area. The H1 at `text-3xl sm:text-4xl` anchors it, but the functional buttons compete for attention with the heading itself.

---

## 5. Consistency & Repetition

**What works:**
- `BaseCard.tsx` provides three elevation tiers (`flat`, `raised`, `elevated`) with corresponding CSS classes in `globals.css:514-533` — consistent card language.
- Bento grid system (`globals.css:402-458`) provides a uniform layout primitive.
- 4px spacing scale defined in `globals.css:72-79`.
- Icon background utilities (`icon-bg-accent`, `icon-bg-violet`, etc.) in `globals.css:239-262` — consistent icon treatment.

**Issues:**

1. **TimelineStream ignores BaseCard entirely** (`TimelineStream.tsx:136-137`)
   Uses a custom double-bezel pattern: `rounded-[2rem]` outer, `rounded-[calc(2rem-0.375rem)]` inner, with `ring-1 ring-stone-900/5`. This diverges from the `BaseCard` pattern used everywhere else. No other component uses this `ring`-based card styling.

2. **StreakHeroCard bypasses BaseCard** (`StreakHeroCard.tsx:42-45`)
   Uses `rounded-3xl` with a hardcoded gradient `bg-gradient-to-br from-amber-600 via-orange-600 to-red-600` and `shadow-xl`. The `rounded-3xl` is unique to this card — other cards use `rounded-2xl`. The shadow depth (`shadow-xl`) is also non-standard.

3. **Hover effect fragmentation**:
   - `card-hover-lift` (`globals.css:463-478`): `translateY(-2px)` + `shadow-md`
   - `card-hover-glow` (`globals.css:480-494`): `shadow-md + accent border`
   - `card-hover-border` (`globals.css:496-510`): `border-color` change
   - TopKPIGrid icon: `group-hover:scale-110` (`TopKPIGrid.tsx:123`)
   - **4 different hover patterns** for what is essentially the same type of card interaction.

4. **Border radius inconsistency**:
   - BaseCard: `rounded-2xl` (16px) via `card-flat`/`card-raised`/`card-elevated`
   - StreakHeroCard: `rounded-3xl` (24px)
   - TimelineStream cards: `rounded-[2rem]` (32px)
   - Buttons: `rounded-xl` (12px), `rounded-lg` (8px)
   - Modal: `rounded-3xl` (`LevelUpCelebration.tsx:50`)
   - 5 distinct radius levels used across components, when the design tokens define only 4 (`globals.css:82-85`).

5. **Button styling inconsistency**:
   - Habits page "New Habit": `rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-xs` (`src/app/habits/page.tsx:87`)
   - Same pattern in HabitCalendar "Add Habit": `rounded-lg bg-[var(--accent)] text-white text-xs font-medium shadow-xs` (`HabitCalendar.tsx:159`)
   - Different border-radius (`rounded-xl` vs `rounded-lg`) and weight (`font-semibold` vs `font-medium`) for the same action type.

6. **Card inner padding inconsistency**:
   - BaseCard default: `p-5` (`BaseCard.tsx:121`)
   - XPProgressBar: `p-6` with `innerClassName="p-0"` (`XPProgressBar.tsx:132-133`)
   - TopKPIGrid: `innerClassName="p-5"` (`TopKPIGrid.tsx:100`)
   - StreakHeroCard: `innerClassName="p-0"` with hardcoded `p-6` on the outer div (`StreakHeroCard.tsx:44`)
   - Three different approaches to inner padding.

---

## 6. White Space Utilization

**What works:**
- Page-level padding: `px-6 py-8` in layout (`src/app/layout.tsx:45`) — comfortable edge breathing room.
- Section gaps: `space-y-6` between major rows (used in all pages).
- Card inner padding: generally `p-5` via BaseCard — adequate.

**Issues:**

1. **Dashboard density** (`src/app/page.tsx`)
   The dashboard crams 4 KPI cards, a gamification row, 2 middle cards, a task input, 3 bottom cards, and an insight card into one page. The `gap-6` spacing is consistent, but the sheer number of elements makes each individual card feel cramped. No section has room to breathe.

2. **Known Issue #6 — Missing right padding in card grids**
   The bento grid on mobile collapses to 1 column (`globals.css:423-429`), but cards inside the grid container can overflow on the right edge if the viewport is narrower than the minimum content width. The `px-6` on the `<main>` wrapper provides outer padding, but grid items may still extend past the right boundary when card content is wide.

3. **Empty state spacing** (`HabitCalendar.tsx:200-208`)
   Empty state shows "No habits created yet" centered in a full-width table cell. The vertical padding (`py-12`) is generous, but the CTA button sits directly below the text with only `mt-3` — the empty state could benefit from more breathing room.

4. **Timeline stream entry density** (`TimelineStream.tsx:103-214`)
   Each timeline entry has significant padding (`p-5` inside `p-1.5`), but with 15-second auto-refresh and potentially hundreds of entries, the vertical space expands without control. The `space-y-4` between entries is generous but unconstrained.

5. **Settings sidebar padding** (`src/app/settings/page.tsx:112`)
   The sidebar container uses `p-3`, but inner list items likely need more horizontal breathing room for readability. The content panel uses `p-6` — a 2x difference in padding between sidebar and content area.

---

## 7. Color Fundamentals

**What works:**
- Warm editorial palette (`globals.css:18-43`) — replaces harsh #ffffff with cream/linen tones.
- Dark mode avoids pure black (`globals.css:125-144`) — uses warm espresso `#171513` and charcoal `#24211e`.
- Accent colors maintain consistent lightness across light/dark modes (e.g., `--accent-amber: #f59e0b` → `#fbbf24`).
- Habit category colors distinct: health (green), learning (violet), work (amber), personal (rose) — good semantic color mapping.
- Color tokens defined in OKLCH (`globals.css:5-15`) — perceptually uniform color space.

**Issues:**

1. **Too many accent colors competing** (`globals.css:46-63`)
   Nine accent colors defined (blue, pink, rose, amber, emerald, violet, teal, orange, indigo) each with a muted variant. In use, a single dashboard page can display emerald (accent), violet (performance chart), amber (streak), indigo (tasks), rose (habits), and teal (achievements). This creates chromatic noise — no single color system governs usage.

2. **Accent color overrides accent property** (`globals.css:46-63`)
   The `--accent` token (emerald green at `globals.css:30`) is the primary interactive color. But `--accent-blue`, `--accent-amber`, etc. are semantically named yet used for backgrounds and highlights. A user setting `accentColor` in settings would expect all accents to shift, but hardcoded `var(--accent-violet)` in icons (`icon-bg-violet`) would not respond.

3. **Temperature clash: warm base + cool accents** 
   The base palette is warm (linen `#f4f1eb` → espresso `#171513`). Accent colors like blue (`#3b82f6`), violet (`#8b5cf6`), and indigo (`#6366f1`) are cool. The clash is most visible in `LearningProgressCard.tsx:91-93` where a violet-to-blue gradient sits inside a warm-toned card — the card feels disconnected from its content.

4. **Color used for decoration vs information**
   StreakHeroCard (`StreakHeroCard.tsx:44`) uses a full amber→orange→red gradient for visual impact. The color is purely decorative — it does not encode information (the streak number does). This is acceptable but risks overuse (see Known Issue #4: SkillOctagon overused).

5. **HabitCalendar cell color overload** (`HabitCalendar.tsx:329-334`)
   Each habit's color is applied as the check button background when complete. With multiple habits, the calendar becomes a visually noisy mosaic of different colors that may not relate to each other harmoniously.

6. **`color-mix` used without fallback** (`AchievementBadge.tsx:95-99`)
   `color-mix(in srgb, ...)` is used for dynamic border/background colors. While supported in modern browsers, older rendering engines may not support it, causing completely transparent borders.

---

## 8. Typography Basics

**What works:**
- Three font families loaded (`src/app/layout.tsx:11-27`): Inter (body), Geist (display), JetBrains Mono (code) — well-considered functional pairing.
- Font variables defined in `globals.css:66-69` with comprehensive fallbacks.
- `tracking-tight` on headings — improves display type.
- `text-wrap: balance` on headings (`globals.css:191`) — prevents orphaned words.
- `max-w-2xl` on description paragraphs — appropriate line length (~66 chars).

**Issues:**

1. **Over-reliance on `text-xs` for body text**
   `text-xs` (12px) is used extensively:
   - Description text: `HeaderGreetingCard.tsx:39`, `ScheduleActivityCard.tsx:68`
   - Card subtitles: `TopKPIGrid.tsx:118`, `LearningProgressCard.tsx:45`
   - Timestamps: `TimelineStream.tsx:206`
   - Status badges: `TopKPIGrid.tsx:105`
   At 12px, these become difficult to read, especially on high-DPI screens or at distance. `text-sm` (14px) or `text-[13px]` would improve readability.

2. **Limited type scale range**
   The effective type scale spans only:
   - H1: `text-2xl sm:text-3xl` (24→30px)
   - Card titles: `text-base` (16px)
   - Body/text: `text-xs` (12px) or `text-sm` (14px)
   - Micro: `text-[10px]` or `text-[11px]` 
   This 2.5x range (12px to 30px) is narrow. Professional typographic scales typically span 3-4x (e.g., 12px→48px).

3. **Inconsistent heading sizes across pages**
   - Dashboard H1: `text-2xl sm:text-3xl` (`HeaderGreetingCard.tsx:36`)
   - Timeline H1: `text-3xl sm:text-4xl` (`src/app/timeline/page.tsx:67`)
   - Settings H1: `text-3xl sm:text-4xl` (`src/app/settings/page.tsx:84`)
   - Habits H1: `text-2xl font-bold` (`src/app/habits/page.tsx:72`)
   Not all pages use the same heading scale. Habits is one step smaller than Timeline/Settings.

4. **Monospace overuse** (`ScheduleActivityCard.tsx:119`, `TimelineStream.tsx:202`)
   Font-mono is used for time labels, durations, and percentages. While aligned numerals are useful, the overuse of JetBrains Mono for short data labels creates a visual disconnect from the Inter/Geist body text.

5. **Line-height not explicitly defined** 
   `globals.css:177-185` sets body styles but does not set `line-height`. The browser default (~1.2) may be too tight for 12px body text. Cards with multi-line descriptions (e.g., `AchievementBadge.tsx:160` with `line-clamp-2`) lack consistent leading.

6. **ALL-CAPS labels using `text-[10px]`** (`XPProgressBar.tsx:148-156`, `src/app/habits/page.tsx:75`)
   Badge labels at `text-[10px]` with `uppercase tracking-wider` can be nearly illegible. The "8 Axes" badge on the Skill Octagon card uses `text-[10px] font-bold uppercase tracking-wider` — at this size, the letter spacing (`tracking-wider`) may reduce legibility rather than improve it.

---

## 9. Balance & Weight

**What works:**
- Dashboard bento grid (12-column) distributes cards asymmetrically but intentionally — 5/3/4, 7/5, 4/3/5 splits have rationale based on content importance.
- Settings 3/9 sidebar-to-content ratio provides comfortable reading width for main content.
- Timeline 1-column layout is straightforward and balanced.

**Issues:**

1. **Dashboard top-heavy** (`src/app/page.tsx:27-57`)
   The greeting header + 4 KPI cards + gamification row occupies the entire above-fold area. Below-fold content (schedule, habits, streak, chart) carries the actual task-focused value. The visual weight tips toward metrics over action.

2. **Habits page vertical weight imbalance** (`src/app/habits/page.tsx:94-146`)
   The top section (stats + streak) uses an 8/4 split that puts heavy visual content (HabitStatsCard with multiple metrics + charts) in the 8-column span. Below, the Skill Radar + Category Metrics + XP bar uses a balanced 4/4/4. The page feels denser at the top than bottom.

3. **SkillOctagon visual weight** (`SkillOctagon.tsx`)
   At `size={180}` on dashboard and `size={240}` on habits page, the octagon creates a dense, visually heavy element. The SVG has 8 axis labels, 8 score values, grid rings, spokes, data polygon, and data points — all vying for attention inside a 180-240px space. Known Issue #4 confirms overuse.

4. **Icon vs text weight in cards** (`TopKPIGrid.tsx:123-125`)
   The 3.5x icon container (`p-3.5` = 14px padding around a 20px icon = ~48px total) creates a visual anchor that competes with the text block on the left. In `focus-time` and `habit-rate` cards, the icon area draws disproportionate attention compared to the metric value it supports.

5. **StreakHeroCard dominates its grid cell** (`StreakHeroCard.tsx:68-83`)
   The gradient background, animated flame icon, large streak number, and pulsing glow effects create a visually heavy element that draws the eye away from the equally important GoalsHabitsCard and PerformanceOverviewChart beside it.

---

## 10. Foundations Scorecard

### Dashboard (`src/app/page.tsx`)

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| Proximity | 6 | Rows well-spaced but too many groups compete |
| Alignment | 7 | Consistent inner alignment but known right-padding issue |
| Contrast | 7 | Good token system but `text-xs` on secondary colors is borderline |
| Hierarchy | 5 | No clear call-to-action; metrics overloaded above the fold |
| Consistency | 6 | Bento grid consistent but card hover effects vary |
| White Space | 5 | Dense; 7 distinct rows in one page is too many |
| Color | 7 | Warm palette is thoughtful but 9 accent colors create noise |
| Typography | 6 | Good font pairing but 12px body text is too small |
| Balance | 5 | Severely top-heavy; metrics dominate over actions |
| **Overall** | **6.0** | Functional but cluttered; needs hierarchy pruning |

### Habits (`src/app/habits/page.tsx`)

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| Proximity | 7 | Well-separated sections with staggered animations |
| Alignment | 7 | Calendar column stickiness can create misalignment |
| Contrast | 6 | Habit check cells use layered transparency reducing contrast |
| Hierarchy | 7 | Clear H1, section labels, but "New Habit" CTA blends in |
| Consistency | 6 | Uses bento grid but mixes BaseCard with custom containers |
| White Space | 7 | Good spacing between analytics, calendar, achievements |
| Color | 6 | Per-habit colors create mosaic noise in calendar |
| Typography | 7 | Clear headings but `text-xs` descriptions |
| Balance | 7 | Slightly top-heavy; analytics section is dense |
| **Overall** | **6.7** | Well-structured but excessive data density |

### Timeline (`src/app/timeline/page.tsx`)

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| Proximity | 8 | Clear timeline grouping with visual connector line |
| Alignment | 7 | Header buttons wrap awkwardly on mid-sized screens |
| Contrast | 7 | Category badges low contrast (10% opacity backgrounds) |
| Hierarchy | 7 | Header is crowded (5 elements competing for attention) |
| Consistency | 5 | Double-bezel card style is unique — diverges from BaseCard |
| White Space | 6 | Entry padding is generous but can grow unbounded |
| Color | 8 | Category colors (work/distraction/neutral) are clear |
| Typography | 7 | `text-xs` for timestamps, monospace overused |
| Balance | 8 | 1-column + 2-column grid is well-distributed |
| **Overall** | **7.0** | Clean flow but card styling is inconsistent with rest of app |

### Board (`src/app/board/page.tsx`)

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| Proximity | 8 | KanbanBoard + history section clearly separated |
| Alignment | 8 | Kanban columns use consistent card layout |
| Contrast | 8 | Standard card contrast; history calendar uses clear colors |
| Hierarchy | 8 | KanbanBoard is the clear primary element |
| Consistency | 7 | Uses KanbanBoard component + BaseCard for history |
| White Space | 9 | Good breathing room; board columns spaced appropriately |
| Color | 8 | Clean; history uses blue for today, green for completed days |
| Typography | 8 | Clear column headers, day labels, task titles |
| Balance | 9 | Kanban is visually centered; history below is subordinate |
| **Overall** | **8.1** | Cleanest page — focused purpose, good layout |

### Settings (`src/app/settings/page.tsx`)

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| Proximity | 9 | Sidebar + content panel with clear separation |
| Alignment | 8 | 3/9 grid is well-proportioned |
| Contrast | 8 | Standard card patterns; consistent text colors |
| Hierarchy | 9 | Sidebar navigation anchors the page; content follows |
| Consistency | 8 | Uses BaseCard-compatible styling consistently |
| White Space | 8 | Comfortable padding; sidebar could use more inner space |
| Color | 8 | Clean; no decorative color overload |
| Typography | 8 | Clear page-level H1, section headings |
| Balance | 9 | Sidebar weight balances content area well |
| **Overall** | **8.3** | Most cohesive page — clear purpose, restrained design |

### Timer (`src/app/timer/page.tsx` → `TimerPage.tsx`)

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| Proximity | 8 | Single-purpose page; focused layout |
| Alignment | 8 | Read-only assessment from page stub |
| Contrast | 7 | (See TimerPage component for details) |
| Hierarchy | 8 | Timer is the obvious primary focus |
| Consistency | 8 | Presumably uses app's standard patterns |
| White Space | 8 | Single-purpose page should have good spacing |
| Color | 8 | No overload visible from stub |
| Typography | 7 | H1 consistent with app pattern |
| Balance | 8 | Timer-centered layout balanced by design |
| **Overall** | **7.8** | Single-purpose page avoids most clutter issues |

### Cross-Cutting Scores

| Principle | Score | Key Issue |
|-----------|-------|-----------|
| Proximity & Grouping | 6.5 | Dashboard has too many competing groups |
| Alignment | 7.0 | Padding inconsistencies between pages; known right-padding issue |
| Contrast & Readability | 6.5 | `text-xs` overuse; low-opacity backgrounds for badges |
| Visual Hierarchy | 6.0 | None of the pages have a clear primary CTA above the fold |
| Consistency & Repetition | 5.5 | Three card styling systems (BaseCard, Timeline bezel, StreakHero gradient); 4 hover patterns |
| White Space Utilization | 6.5 | Dashboard density is the main offender |
| Color Fundamentals | 7.0 | Warm palette is excellent but 9 accent colors + color-mix dependency are risky |
| Typography Basics | 6.5 | Good font choice but 12px body, narrow scale range, inconsistent heading sizes |
| Balance & Weight | 6.5 | Dashboard top-heavy; SkillOctagon visually dense; StreakHeroCard overwhelms neighbors |
| **Cross-App Average** | **6.4** | See priority fixes below |

---

## Priority Fix Recommendations

1. **Consolidate card system** — Eliminate the three competing card patterns. BaseCard should be the single card primitive. Either absorb the double-bezel ring style into BaseCard or remove it.

2. **Prune dashboard hierarchy** — Reduce to 4-5 logical groups maximum. Move gamification elements to a dedicated tab or collapse them. Make the "Quick Task Input" the primary above-fold CTA.

3. **Standardize hover effects** — Pick one: `card-hover-lift` or `card-hover-border`. Apply consistently across all interactive cards.

4. **Replace `color-mix` calls** — Compute static colors at the token level instead of relying on runtime `color-mix()` for critical visibility elements (borders, backgrounds).

5. **Reduce body text to `text-sm` minimum** — Replace most `text-xs` usages with `text-sm` for descriptions, labels, and secondary text. Reserve `text-xs` for truly secondary metadata (timestamps, helper text).

6. **Unify border radii** — Lock to the 4-token system (`--radius-sm/md/lg/pill`). Replace ad-hoc `rounded-[2rem]`, `rounded-3xl`, `rounded-[calc(...)]` with token values.

7. **Address LevelUpCelebration navigation issue** — Move celebration logic from page-level `useEffect` to the store layer so it fires on actual level-up events, not on every page mount.

8. **Reduce accent color palette in practice** — Use no more than 3-4 accent colors on any single page. Define per-page color budgets.
