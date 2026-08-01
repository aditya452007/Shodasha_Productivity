# UI Checklist Audit — Shodasha Productivity App

**Audit date:** 2026-07-29
**Scope:** All pages, components, stores, types across the entire app
**Method:** Manual source-code inspection against the comprehensive UI Checklist standard

---

## ⚠️ Referenced Files Not Found (Missing Source)

The following files were listed for audit but **do not exist** in the codebase. These represent gaps in the file inventory rather than UI issues per se.

| Missing File | Notes |
|---|---|
| `src/types/index.ts` | No global types file exists; types are defined per-store |
| `src/stores/journalStore.ts` | Journal store not implemented |
| `src/stores/aiStore.ts` | AI store not implemented |
| `src/stores/boardStore.ts` | Board logic lives in `taskStore.ts` |
| `src/components/gamification/StreakTracker.tsx` | `StreakDisplay.tsx` exists instead |
| `src/components/gamification/GamificationLayout.tsx` | Not found |
| `src/components/gamification/DashboardGamification.tsx` | Not found |
| `src/components/gamification/GamificationSummary.tsx` | Not found |
| `src/components/habits/HabitList.tsx` | Not found; list logic in `HabitCalendar.tsx` |
| `src/components/habits/HabitCard.tsx` | Not found |
| `src/components/habits/HabitForm.tsx` | Not found; form in `AddHabitModal.tsx` |
| `src/components/board/BoardColumn.tsx` | `KanbanColumn.tsx` exists instead |
| `src/components/board/BoardCard.tsx` | `KanbanCard.tsx` exists instead |
| `src/components/board/BoardHeader.tsx` | Not found |
| `src/components/timeline/TimelineItem.tsx` | Items rendered inline in `TimelineStream.tsx` |
| `src/components/ui/NavigationItem.tsx` | Not found; nav in `Navbar.tsx` + `GooeyTabs` |
| `src/components/settings/SettingsPanel.tsx` | Not found; `SettingsSidebar.tsx` exists |
| `src/components/dashboard/*` (8 files) | Actual files differ; see dashboard section |

---

## 1. Button Audit

Every clickable element evaluated for: **default (rest), hover, focus, active, disabled, loading** states.

### 1.1 Navbar Buttons

#### `Navbar.tsx` — Theme Toggle (`:209-215`)
- **States:** default ✔, hover ✔ (`var(--bg-surface-hover)`), focus-visible ✔ (global `:focus-visible`), active ✔ (global `button:active` scale(0.97))
- **Disabled/loading:** N/A (no async action)
- **Missing:** No `aria-pressed` to indicate current theme state

#### `Navbar.tsx` — Command Palette Trigger (`:200-206`)
- Same as theme toggle. No `aria-expanded` for palette open state.

#### `Navbar.tsx` — Window Controls (Minimize/Maximize/Close) (`:219-244`)
- **States:** default ✔, hover ✔ (`hover:bg-[var(--bg-surface-hover)]`), focus-visible ✔
- **Missing:** Close button has `hover:text-red-500` but no explicit `active` style. No `disabled` state (buttons always active).

#### `Navbar.tsx` — Brand Logo Link (`:119-132`)
- **States:** hover ✔ (`group-hover:scale-105`), focus-visible ✔
- **Missing:** No active/pressed state for the link wrapper.

### 1.2 GooeyTabs Navigation

#### `gooey-tabs.tsx` — Tab Buttons (`:273-325`)
- **States:** default ✔, selected ✔ (`isSelected` grid layout + color), hover ✔ (via `color` class e.g. `bg-emerald-600 hover:bg-emerald-700`), focus ✔ (via `tabFocusClass` + `onFocus`), keyboard nav ✔ (`handleTabListKeyDown` with arrow keys), active ✔ (motion.button)
- **Disabled:** No disabled tab state — every tab is always clickable
- **Missing:** No loading state for navigation transitions

### 1.3 Habits Page Buttons

#### `habits/page.tsx` — "New Habit" Button (`:84-91`)
- **States:** default ✔, hover ✔ (`hover:opacity-90`), active ✔ (`active:scale-95`), focus-visible ✔
- **Disabled:** Not handled (no `disabled` prop)

#### `HabitCalendar.tsx` — Date Cell Toggle (`:313-353`)
- **States:** default ✔, done ✔ (colored fill + checkmark), disabled ✔ (`opacity-30 cursor-not-allowed`), hover ✔ (`hover:border-[var(--border-strong)]`)
- **Missing:** No loading state during toggle (fires `toggleHabit` which is async DB write). No focus ring on the tiny 24x24px cells.

#### `HabitCalendar.tsx` — Edit/Delete Action Buttons (`:272-287`)
- **States:** default ✔, hover ✔
- **Missing:** Delete button has no confirmation dialog before destructive action (fires `deleteHabit` immediately). No loading/disabled state.

#### `HabitCalendar.tsx` — Open Link Button (`:248-259`)
- **States:** default ✔, hover ✔
- **Missing:** No active/pressed state. No disabled state (external URL may be invalid).

#### `HabitCalendar.tsx` — Month Navigation (`:141-155`)
- **States:** default ✔, hover ✔, focus-visible ✔
- **Disabled:** Not handled (no `disabled` prop)

#### `AddHabitModal.tsx` — Submit Button (`:229-241`)
- **States:** default ✔, disabled ✔ (`disabled:opacity-50 disabled:cursor-not-allowed`), loading ✔ (spinner + "Saving..."), hover ✔
- **Focus:** Not explicitly set; relies on global focus ring
- **Missing:** No active/pressed state (`active:scale-95`)

#### `AddHabitModal.tsx` — Cancel Button (`:222-227`)
- **States:** default ✔, hover ✔
- **Missing:** No focus ring, no active state, no disabled state

#### `AddHabitModal.tsx` — Color Swatch Buttons (`:178-192`)
- **States:** default ✔, selected ✔ (`scale-110 ring-2`), hover ✔ (`hover:scale-105`)
- **Missing:** No focus ring, no disabled state

### 1.4 Board Page Buttons

#### `KanbanBoard.tsx` — "Add Column" Button (`:149-156`)
- **States:** default ✔, hover ✔ (`hover:bg-[var(--bg-surface-hover)]`), focus-visible ✔
- **Disabled:** Not handled

#### `KanbanColumn.tsx` — "Add Task" Button (`:153-159`)
- **States:** default ✔, hover ✔
- **Missing:** No active/pressed state, no focus ring

#### `KanbanColumn.tsx` — Column Delete Button (`:162-171`)
- **States:** default ✔, hover ✔ (`hover:bg-[var(--error)]/10 hover:text-[var(--error)]`)
- **Missing:** No confirmation dialog for delete (handled via inline modal). No disabled state.

#### `KanbanColumn.tsx` — Quick Add Submit (`:198-203`)
- **States:** default ✔
- **Missing:** No disabled state, no loading state, no hover effect, no focus ring

#### `KanbanColumn.tsx` — Inline Delete Confirm Buttons (`:277-288`)
- Cancel: default ✔, hover ✔
- Delete: default ✔, hover ✔ (`hover:brightness-90`)
- **Missing:** No focus rings, no active states

#### `KanbanCard.tsx` — Complete Toggle Button (`:113-134`)
- **States:** default ✔, done ✔ (green filled), hover ✔, active ✔ (`whileTap={{ scale: 0.9 }}`)
- **Missing:** No disabled state during async update, no loading state

#### `KanbanCard.tsx` — Edit Button (`:136-143`)
- **States:** default ✔, hover ✔
- **Missing:** No active state, no focus ring

#### `KanbanCard.tsx` — URL Chip Button (`:169-181`)
- **States:** default ✔, hover ✔
- **Missing:** No active state, no disabled state

#### `KanbanCard.tsx` — Drag Handle (`:87-94`)
- **States:** default ✔, hover ✔ (`hover:text-[var(--text-secondary)]`), active ✔ (`active:cursor-grabbing`)
- `aria-label` present ✔

#### `TaskModal.tsx` — Save Button (`:343-356`)
- **States:** default ✔, disabled ✔, loading ✔ (spinner), hover ✔
- **Focus:** Relies on global

#### `TaskModal.tsx` — Delete Button (`:326-333`)
- **States:** default ✔, hover ✔
- **Missing:** Uses `confirm()` dialog (not a proper modal). No loading state.

#### `board/page.tsx` — History Toggle (`:63-83`)
- **States:** default ✔, hover ✔, active ✔ (global)
- **Missing:** No `aria-expanded` to indicate open/closed state

#### `board/page.tsx` — History Month Navigation (`:92-109`)
- **States:** default ✔, hover ✔
- **Missing:** No focus rings, no disabled states at month boundaries

### 1.5 Timeline Page Buttons

#### `timeline/page.tsx` — Prev/Next Day Buttons (`:78-84, 101-108`)
- **States:** default ✔, hover ✔, disabled ✔ (`disabled:opacity-30 disabled:cursor-not-allowed`)
- **Missing:** No `:focus-visible` styling beyond global

#### `timeline/page.tsx` — "Back to Today" Button (`:111-117`)
- **States:** default ✔, hover ✔
- **Missing:** Conditionally rendered (not always visible)

#### `timeline/page.tsx` — Refresh Button (`:120-128`)
- **States:** default ✔, disabled ✔ (`disabled:opacity-50`), loading ✔ (spinning icon + "Refreshing..." text), hover ✔
- **Best-practice:** Good implementation

### 1.6 UI Component Buttons

#### `BaseCard.tsx` — Empty State Action (`:40-46`, passed as prop)
- Relies on caller to implement. No built-in button states.

#### `EmptyState.tsx` — Action Button (`:41-46`)
- **States:** default ✔, hover ✔ (`hover:bg-[var(--accent-hover)]`), active ✔ (`active:scale-[0.97]`), focus-visible ✔
- **Disabled:** Not handled — caller must pass `onAction` for button to render

#### `ErrorBanner.tsx` — Retry Button (`:30-36`)
- **States:** default ✔, hover ✔, active ✔ (`active:scale-[0.97]`)
- **Disabled:** Not handled. No loading state on retry.

#### `SettingsSidebar.tsx` — Nav Items (`:74-96`)
- **States:** default ✔, active ✔ (emerald highlight), hover ✔ (`hover:bg-[var(--background)] hover:text-emerald-500`)
- **Missing:** No focus ring on individual items, no keyboard nav beyond global

---

## 2. Card Audit

### 2.1 `BaseCard.tsx` (`:56-136`)
- **Structure:** Wrapper with `motion.div` + inner content div
- **Elevation tiers:** `flat`, `raised`, `elevated` — mapped to CSS classes `card-flat`, `card-raised`, `card-elevated` ✔
- **Padding:** `p-5` inner padding ✔
- **Shadow:** Sm/md depending on tier ✔
- **Border:** Varies by tier (all have 1px border) ✔
- **Border radius:** `rounded-lg` (12px from `card-*` classes) ✔
- **Hover:** No built-in hover; callers add `card-hover-lift` manually ✔
- **Loading state:** Built-in skeleton with configurable lines ✔
- **Empty state:** Built-in EmptyState delegation ✔
- **Error state:** Built-in ErrorBanner delegation ✔
- **Animation:** Framer Motion fade-in-up by default (respects reduced-motion only if caller passes it) — but BaseCard doesn't use `useReducedMotion()` itself (line 129-131 always animate) **ISSUE**
- **Missing:** No `useReducedMotion()` in BaseCard; always animates in even if parent respects reduced motion

### 2.2 `StreamCard.tsx` (`:11-26`)
- **Structure:** Double-bezel design (outer + inner divs)
- **Padding:** Outer `p-2`, inner `p-6` ✔
- **Border radius:** Outer `2.25rem`, inner `calc(2.25rem - 0.5rem)` ✔
- **Shadow:** `shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]` ✔
- **Hover:** No built-in hover. Used in `TimelineStream` with `group-hover:` classes externally.
- **Missing:** No loading/empty/error states — pure layout wrapper

### 2.3 `KanbanCard.tsx` (`:73-228`)
- **Structure:** `motion.div` with layout animation ✔
- **Padding:** `p-4` ✔
- **Border:** `border-[var(--border)]` default, `border-[var(--accent)]` when dragging ✔
- **Shadow:** `shadow-sm`, `shadow-md` on hover, `shadow-xl` when dragging ✔
- **Hover:** `hover:border-[var(--border-strong)] hover:shadow-md` ✔
- **Dragging state:** `scale-[1.02] opacity-80 z-50` ✔
- **Done state:** `opacity-80` with line-through title ✔
- **Overflow:** No `overflow-hidden` on card — tags/chips can extend beyond bounds **ISSUE**
- **Padding integrity:** `gap-2.5` between sections, inner items use `gap-1` — no double padding **KNOWN ISSUE #2 resolved**
- **Missing:** No loading skeleton, no error state (task data assumed available)

### 2.4 `KanbanColumn.tsx` (`:96-293`)
- **Structure:** `motion.div` with layout, `w-80 shrink-0` ✔
- **Padding:** `p-4` ✔
- **Border:** `border-[var(--border)]`, `border-[var(--accent)]` on drag over ✔
- **Empty state:** Dashed border CTA (`:228-236`) ✔ — "Add a task" placeholder
- **Hover:** Column-level hover only on drag targets
- **Missing:** Loading state for column data, error state for column operations

### 2.5 `HabitCalendar.tsx` — Row Cards (table rows, not cards) (`:224-366`)
- Table-based layout, not card-based. Row hover on `.group` class ✔
- Sticky first/last columns with shadows ✔
- **Missing:** Row-level loading animation for individual rows

### 2.6 `AchievementBadge.tsx` (`:66-180`)
- **Structure:** `motion.div` with layout animation ✔
- **Padding:** `p-4` ✔
- **Border:** Solid when unlocked, dashed when locked (`border-dashed border-[var(--border-subtle)] opacity-60`) ✔
- **Hover:** `card-hover-lift` class ✔
- **Unlocked state:** Gradient background, colored border, shimmer animation ✔
- **Locked state:** 60% opacity, dashed border ✔
- **NEW state:** Floating badge with gradient, auto-dismiss after 3s ✔
- **Progress bar:** Animated width from 0% to percentage ✔
- **Missing:** No error state, no loading skeleton

### 2.7 `XPProgressBar.tsx` — Themed Card (`:130-214`)
- **Structure:** BaseCard with `card-color-violet` background ✔
- **Padding:** `p-6` ✔
- **Hover:** Not built-in (no card-hover class) — `ISSUE`: inconsistent with other cards
- **Loading state:** BaseCard isLoading with skeleton ✔
- **Empty state:** N/A (always has level 1 data)
- **Ambient glow:** Animated pulsing background halo ✔
- **Missing:** No error fallback if gamification store fails

### 2.8 `SkillOctagon.tsx` (`:164-348`)
- **Structure:** SVG within a `div` wrapper
- **Loading state:** Centered `LoadingSkeleton` with rounded-full ✔
- **Error state:** `ErrorBanner` with message ✔
- **Empty state (no data):** Dashed placeholder polygon + center text hint (`:338-345`) ✔
- **Hover:** No card-level hover (wrapper div provided by parent)
- **Missing:** No retry from error state

### 2.9 Known Issue #2 — Timeline Cards

**Verified:** `TimelineStream.tsx` (`:136-210`) — Cards use double-bezel pattern (outer `p-1.5 rounded-[2rem]` + inner `p-5 rounded-[calc(2rem-0.375rem)]`). **Overflow:** Inner card has no `overflow-hidden`, so long text/content can break the rounded corners. **Visual hierarchy:** Duration and timestamp on right side compete with app name for attention. The `formatDuration` and `formatTimeRange` display is densely packed.

---

## 3. Form Audit

### 3.1 `AddHabitModal.tsx` — Habit Creation Form (`:125-244`)

| Field | Label | Placeholder | Focus Ring | Error | Disabled | Helper |
|---|---|---|---|---|---|---|
| Habit Title (`:131-138`) | "Habit Title *" ✔ | "e.g. 30m Daily Deep Reading" ✔ | `focus:border-[var(--accent)] focus:ring-2` ✔ | Missing (no inline validation error, uses `toast.error`) | N/A | Missing |
| Web Link/URL (`:159-166`) | "Web Link / URL (Optional)" ✔ | "https://example.com/habit" ✔ | Same as above ✔ | Missing (no URL format validation) | N/A | Missing (no format hint) |
| Accent Color (`:178-192`) | "Accent Color" ✔ | N/A (swatches) | N/A (buttons) | N/A | N/A | N/A |
| Linked Task (`:206-217`) | "Linked Task (Optional)" ✔ | "-- No Linked Task --" ✔ | Same as above ✔ | N/A | N/A | "Auto-completes task" ✔ |

- **Required indicator:** `*` on Habit Title ✔
- **Validation:** Client-side `required` on name input, plus JS check with toast
- **Error display:** Uses `toast.error()` for validation — no inline error messages
- **Disabled state on submit:** Form submit button disabled during submission ✔
- **Autofocus:** No `autoFocus` on the title input when modal opens **ISSUE**

### 3.2 `TaskModal.tsx` — Task Edit Form (`:159-359`)

| Field | Label | Placeholder | Focus Ring | Error | Disabled | Helper |
|---|---|---|---|---|---|---|
| Title (`:162-169`) | "Title" ✔ | Missing | `focus:border-[var(--accent)]` ✔ | Missing (toast only) | N/A | N/A |
| Column Status (`:173-184`) | "Column Status" ✔ | N/A | Same ✔ | N/A | N/A | N/A |
| Description (`:191-198`) | "Description" (with icon) ✔ | "Add optional task details..." ✔ | Same ✔ | N/A | N/A | N/A |
| Web Link/URL (`:216-223`) | "Web Link / URL" ✔ | "https://..." ✔ | Same ✔ | N/A | N/A | Missing |
| Due Date (`:231-236`) | "Due Date" (with icon) ✔ | N/A | Same ✔ | N/A | N/A | N/A |
| Tags (`:244-250`) | "Tags" (with icon) ✔ | "Design, Tech" ✔ | Same ✔ | N/A | N/A | Missing (comma-separated hint) |
| Auto-expiry (`:259-269`) | "Auto-expiry Duration" ✔ | N/A | Same ✔ | N/A | N/A | N/A |
| Parent Task (`:277-288`) | "Parent Task" ✔ | N/A | Same ✔ | N/A | N/A | "(for sub-tasks)" ✔ |
| Linked Habit (`:296-307`) | "Linked Habit" ✔ | N/A | Same ✔ | N/A | N/A | N/A |

- **Error handling:** Relies entirely on toast notifications — **no inline validation errors**
- **Autofocus:** Title field does not autofocus on modal open **ISSUE**
- **Validation:** Only `required` on title; tags, URL, dates are freeform
- **Delete:** Uses browser `confirm()` dialog — not on-brand **ISSUE**

### 3.3 `KanbanColumn.tsx` — Quick Add Form (`:176-206`)

| Field | Label | Placeholder | Focus Ring | Error | Disabled | Helper |
|---|---|---|---|---|---|---|
| Task title (`:178-184`) | Missing | "Task title..." ✔ | `focus:border-[var(--accent)]` ✔ | Missing | N/A | N/A |
| Duration (`:188-196`) | Missing (icon only) | N/A | Missing | N/A | N/A | N/A |

- **No form label** for accessibility — relies on placeholder only **ISSUE**
- No validation feedback beyond empty-string guard

### 3.4 `KanbanColumn.tsx` — Column Rename (`:119-134`)
- Inline input with no label, no placeholder, no error state
- Form submits via `onSubmit` handler ✔
- Disappears after submit — no validation feedback

---

## 4. Navigation Audit

### 4.1 `Navbar.tsx` Top Navigation (`:111-248`)

#### Active Page Indicator
- **GooeyTabs** via `activeIndex` (`:77-78`): active tab gets the `color` background class (e.g. `bg-emerald-600`), changing from the default muted bg **✔**
- Active tab also gets the `isSelected` grid layout (wider padding, visible label) ✔
- **Issues:** No URL-based active detection beyond initial index. `currentActiveIndex` defaults to `0` if pathname not found in `navItems` (`:78`) — so unknown routes silently show Dashboard as active.

#### Hover State
- Tab hover via the `hover:` variants in the color class (e.g. `bg-emerald-600 hover:bg-emerald-700`) ✔
- Gooey filter creates a "melted" appearance on hover between adjacent tabs

#### Focus State
- `handleTabListFocusCapture` + `handleTabListKeyDown` for keyboard focus management ✔
- `tabFocusClass` applies focus ring styling ✔
- Outline on `:focus-visible` globally ✔

#### Current Page Indicator
- Gooey active tab visual is strong (colored background + expanded grid) ✔
- No underline, dot, or other secondary indicator (moot due to Gooey's strong selected state)
- **No skip-to-content link** — accessibility issue for keyboard users

#### Keyboard Navigation
- Arrow keys: `handleTabListKeyDown` supports Left/Right arrow navigation ✔
- Home/End: Not explicitly handled in keydown handler
- Tab: Natural tab order flows through the nav

#### Issues
1. **No skip-link** for keyboard users at top of page
2. **No `aria-current="page"`** on active tab — screen reader ambiguity
3. **Logo link** (`:119`) has no visible focus indicator beyond global outline
4. **Mobile:** GooeyTabs may overflow on narrow viewports — no horizontal scroll handling visible

### 4.2 `SettingsSidebar.tsx` (`:62-99`)
- **Active state:** `bg-emerald-500/10 text-emerald-500 font-semibold border` ✔
- **Hover:** `hover:bg-[var(--background)] hover:text-emerald-500` ✔
- **Focus:** No explicit focus ring per item — relies on global ✔
- **Keyboard:** Uses `<nav>` with `<button>` elements — natural tab order ✔
- **Mobile:** Handled via `isMobile` state in `settings/page.tsx` — separate nav/detail views ✔
- **Missing:** No `aria-current="page"` or `aria-selected` on active item

### 4.3 `board/page.tsx` — History Section Accordion (`:63-83`)
- **Active/expanded indicator:** Chevron rotation (`rotate-180` when open) ✔
- **Missing:** `aria-expanded`, `aria-controls` for accessibility

---

## 5. Empty State Audit

### 5.1 `EmptyState.tsx` Universal Component (`:15-49`)
- Icon optional ✔
- Title always shown ✔
- Description optional ✔
- Action button optional ✔
- Dashed border + centered layout ✔
- **Missing:** No illustration/graphic variant

### 5.2 Components Using Empty States

| Component | Shows When Empty | CTA? | Location |
|---|---|---|---|
| **HabitCalendar** | "No habits created yet" + "Create your first habit" button ✔ | Yes | `:198-209` |
| **KanbanColumn** | Dashed "Add a task" placeholder ✔ | Yes (opens add form) | `:228-236` |
| **TimelineStream** | "No matching window activity logs" + filter hint ✔ | No (suggestive text only) | `:92-101` |
| **SkillOctagon** | "Create habits and track focus time..." overlay text ✔ | No | `:338-345` |
| **AchievementBadgeGrid** | N/A — renders sections even if empty (will show "0/0") **ISSUE** | — | `:191-219` |
| **BaseCard** | Delegates to EmptyState via `isEmpty` prop ✔ | Via props ✔ | `:106-117` |

### 5.3 Components Missing Empty States

| Component | Issue | Severity |
|---|---|---|
| **KanbanBoard** | No empty state when board has no columns (only skeleton during loading) | Medium |
| **XPProgressBar** | Always renders (default level 1) | Low |
| **StreakDisplay** | Not audited (StreakDisplay.tsx not in file list) | — |
| **StreakHeroCard** | Not audited (StreakHeroCard.tsx not in file list) | — |
| **Dashboard widgets** (all) | Not audited (different file inventory) | — |

---

## 6. Loading State Audit

### 6.1 `LoadingSkeleton.tsx` (`:12-29`)
- **Animation:** `animate-pulse` (CSS only, lightweight) ✔
- **Reduced motion:** `motion-reduce:animate-none` ✔
- **Configurable:** height, width, rounded, className ✔
- **Accessible:** `aria-hidden="true"` ✔
- **Missing:** No shimmer/gradient variant (only solid pulse). No color customization (always `bg-[var(--border)]/60`).

### 6.2 Components Using Loading States

| Component | Loading UI | Location | Quality |
|---|---|---|---|
| **HabitsPage** | Grid of 8 LoadingSkeleton elements matching layout | `page.tsx:46-60` | Comprehensive ✔ |
| **SkillOctagon** | Centered `LoadingSkeleton` `rounded-full` | `:187-193` | Good ✔ |
| **XPProgressBar** | BaseCard `isLoading` with 4 skeleton lines | `:121-127` | Good ✔ |
| **HabitCalendar** | 2 skeleton blocks (title + content) | `:102-109` | Adequate ✔ |
| **KanbanBoard** | 3 column skeletons with cards | `:168-184` | Good ✔ |
| **TimelineStream** | 4 skeleton blocks | `:55-63` | Adequate ✔ |
| **KanbanCard** | No loading state (data assumed ready) | — | **Missing** |
| **KanbanColumn** | No loading state | — | **Missing** |
| **AchievementBadge** | No loading state | — | **Missing** |
| **TaskModal** | No loading state (data assumed ready when modal opens) | — | **Missing** |
| **AddHabitModal** | Submit button has loading state ✔ | `:234-237` | Good ✔ |

### 6.3 Issues
- **BaseCard** always animates via Framer Motion even when reduced-motion is preferred (no `useReducedMotion()` check internally)
- **Skeleton colors** use `--border` which may be too low-contrast in dark mode
- No content-aware skeleton shapes (circles, lines, blocks)

---

## 7. Error State Audit

### 7.1 `ErrorBanner.tsx` Universal Component (`:13-39`)
- **Structure:** Error icon + title + message + optional retry button ✔
- **Accessible:** `role="alert"` ✔
- **Styling:** Red-tinted border and background ✔
- **Retry:** Optional callback, styled as secondary button ✔
- **Missing:** No error code display, no collapse/expand for long errors

### 7.2 Components Using Error States

| Component | Error UI | Retry? | Location |
|---|---|---|---|
| **SkillOctagon** | ErrorBanner with title + message | No | `:195-197` |
| **HabitCalendar** | ErrorBanner with title + message | No | `:111-113` |
| **KanbanBoard** | ErrorBanner with title + retry | Yes (`initializeTasks`) | `:159-165` |
| **TimelineStream** | ErrorBanner with title + message + retry | Yes (`refreshAllData`) | `:66-74` |
| **BaseCard** | Delegates to ErrorBanner via `hasError` prop | Via `onRetry` ✔ | `:94-104` |
| **AddHabitModal** | Toast on error | N/A | `:73` |
| **TaskModal** | Toast on error | N/A | `:103` |

### 7.3 Components Missing Error States

| Component | Missing Error UI | Severity |
|---|---|---|
| **XPProgressBar** | No error state for store failure | Low (always default data) |
| **AchievementBadge** | No error boundary or fetch error | Low |
| **KanbanCard** | No error state (data assumed valid) | Low |
| **KanbanColumn** | No error state for column operations | Medium |
| **LevelUpCelebration** | No error handling if store data is corrupt | Low |
| **Dashboard widgets** | Not available for audit | — |

### 7.4 Global Error Boundaries
- No React Error Boundary component found in `layout.tsx` or app shell **ISSUE**
- No global error.tsx or global-error.tsx in the app directory

---

## 8. Feedback & Notification Audit

### 8.1 Toast/Notification System
- **Library:** `sonner` with `<Toaster position="bottom-right" richColors />` in layout ✔
- **Usage pattern:** `toast.success()`, `toast.error()`, `toast()` for info
- **Consistency:** Used across stores (taskStore:143, timerStore:170,191, board:102,134) and components (AddHabitModal:58-73, TaskModal:100-115)
- **Issues:**
  - No loading toast pattern (e.g. "saving..." then "saved")
  - Some errors use `console.warn` instead of toast (habitStore:90,95)
  - `confirm()` dialog used in `TaskModal.tsx:112` instead of a custom confirmation modal

### 8.2 Confirmation Dialogs
- **KanbanColumn inline modal** (`:240-292`): Custom built, animated, with cancel/confirm. This is the proper pattern.
- **TaskModal** (`:112`): Uses browser `confirm()` — inconsistent with the app's design language **ISSUE**
- **HabitCalendar delete** (`:281-286`): No confirmation at all — immediate `deleteHabit()` **ISSUE**

### 8.3 Notification Scheduler
- `NotificationScheduler` component in layout — handles habit reminders, idle alerts

### 8.4 Micro-interactions
- **Global button active:** `scale(0.97)` on `:active` ✔
- **Card hover lift:** `card-hover-lift` class with `translateY(-2px)` + `shadow-md` on hover ✔
- **Check animation:** Spring animation on habit toggle checkmark ✔
- **Drag feedback:** Opacity/scale changes during drag operation ✔
- **Live indicator:** Pulsing dot in navbar for tracking status ✔
- **Missing:** No haptic or sound feedback for state changes

### 8.5 LevelUpCelebration Notification (`:8-146`)
- **Trigger mechanism:** Watches `level > lastLevelUpNotified` ✔
- **Auto-dismiss:** 3 seconds ✔
- **Known Issue #1:** `hasNewLevel` recalculates on every render because `lastLevelUpNotified` is never updated after the level-up toast fires. `dismiss()` only hides the overlay without updating `lastLevelUpNotified` in the store. This means on next navigation/rerender `hasNewLevel` is still true and the celebration fires again. **Severity: High**

---

## 9. Accessibility Audit

### 9.1 Focus Indicators
- **Global `:focus-visible`:** `outline: 2px solid var(--accent)` with `outline-offset: 3px` ✔
- **Tab navigation:** `handleTabListKeyDown` supports arrow keys ✔
- **Missing on:** Color swatch buttons, column rename input, quick-add form elements, some icon buttons
- **Skip link:** None found anywhere in the app **ISSUE**

### 9.2 ARIA Labels
- **Good examples:** Navbar search button (`aria-label="Open command palette"`), theme toggle (`aria-label="Switch to light/dark mode"`), habit edit/delete buttons, `KanbanCard` drag handle (`aria-label="Drag ${task.title}"`)
- **Missing:**
  - `GooeyTabs` tabs have `role="tab"` and `aria-selected` but Navbar wrapper lacks `aria-current="page"`
  - EmptyState action button has no `aria-label` beyond its text
  - Date navigation buttons lack dynamic labels (e.g. "Previous month: July 2026")
  - `board/page.tsx` history accordion missing `aria-expanded` and `aria-controls`

### 9.3 Color Contrast
- **Light mode:**
  - `--text-primary: #262320` on `--bg-base: #f4f1eb` → ~10:1 ratio ✔
  - `--text-secondary: #615b53` on `--bg-base` → ~4.5:1 ✔
  - `--text-tertiary: #918a80` on `--bg-base` → ~2.8:1 **FAILS WCAG AA**
  - `--accent: #059669` on white → ~3.5:1 **FAILS for small text**
  - `--accent-hover: #047857` → slightly better but still borderline
- **Dark mode:**
  - `--text-secondary: #b8b0a5` on `--bg-base: #171513` → ~7:1 ✔
  - `--text-tertiary: #888075` on `--bg-base` → ~4:1 ✔

### 9.4 Reduced Motion
- **Global:** `prefers-reduced-motion: reduce` block in globals.css (`:303-346`) disables all animations, transforms, transitions ✔
- **Component-level:** `useReducedMotion()` used in 10+ components ✔
- **Issues:**
  - `BaseCard.tsx:129-131` always uses Framer Motion animation — no reduced motion guard
  - `LevelUpCelebration` conditionally renders particles based on `shouldReduceMotion` ✔
  - `AchievementBadge` floater animation only plays when `!shouldReduceMotion` ✔

### 9.5 Keyboard Navigation
- **GooeyTabs:** Full keyboard support with arrow keys, Home/End partially supported
- **Modals:** `AddHabitModal` and `TaskModal` trap focus? No visible focus trap — pressing Tab can exit the modal **ISSUE**
- **Dismiss:** Escape key not explicitly handled (backdrop click only) **ISSUE**
- **KanbanBoard:** `KeyboardSensor` configured for drag-and-drop via keyboard ✔

### 9.6 Semantic HTML
- **Good:** `<nav>` with `aria-label` on GooeyTabs, `role="tablist"`, `role="tab"`, `role="alert"` on ErrorBanner
- **Issues:**
  - Page structure lacks `<main>` landmark (layout uses `<main>` though ✔)
  - Settings sidebar uses `<nav>` but no container `<nav>` around GooeyTabs
  - Cards are `<div>` elements without `role="article"` or other semantic role

---

## 10. Missing States Inventory — Complete

### CRITICAL Severity

| Component | Missing States | File:Line | Impact |
|---|---|---|---|
| **LevelUpCelebration** | Store not updated on dismiss (fires repeatedly) | `LevelUpCelebration.tsx:18-21` | Celebration shows on every navigation |
| **No Error Boundary** | No React error boundary in app shell | `layout.tsx` | Unhandled errors crash entire app |
| **TaskModal delete** | Uses browser `confirm()` instead of custom modal | `TaskModal.tsx:112` | Inconsistent UX, no theming |
| **HabitCalendar delete** | No confirmation before delete | `HabitCalendar.tsx:281-286` | Accidental data loss |
| **BaseCard** | No `useReducedMotion()` — always animates | `BaseCard.tsx:129-131` | Violates reduced-motion preferences |
| **text-tertiary contrast** | `#918a80` on `#f4f1eb` fails WCAG AA (2.8:1) | `globals.css:29` | Readability for secondary text |

### HIGH Severity

| Component | Missing States | File:Line | Impact |
|---|---|---|---|
| **GooeyTabs** | No `aria-current="page"` on active tab | `gooey-tabs.tsx:291-325` | Screen reader ambiguity |
| **AddHabitModal** | No `autoFocus` on title input | `AddHabitModal.tsx:131` | UX friction, extra click needed |
| **TaskModal** | No `autoFocus` on title input | `TaskModal.tsx:162` | Same as above |
| **Navbar** | No skip-to-content link | `Navbar.tsx` | Keyboard user must tab through entire nav |
| **KanbanColumn quick-add** | No form label for accessibility | `KanbanColumn.tsx:178-184` | Screen reader only hears placeholder |
| **board/page.tsx** accordion | Missing `aria-expanded`/`aria-controls` | `board/page.tsx:63-83` | Accessibility for disclosure widget |
| **HabitCalendar** | No loading state on individual cell toggle | `HabitCalendar.tsx:313-353` | No feedback during async DB write |
| **AchievementBadgeGrid** | Empty category sections render with "0/0" | `AchievementBadge.tsx:201-203` | Polluted UI when no data |
| **Modals (both)** | No Escape key handler | `AddHabitModal.tsx`, `TaskModal.tsx` | Cannot dismiss via keyboard |

### MEDIUM Severity

| Component | Missing States | File:Line | Impact |
|---|---|---|---|
| **KanbanBoard** | No empty state when 0 columns | `KanbanBoard.tsx` | Blank board with no guidance |
| **KanbanCard** | No loading/error states | `KanbanCard.tsx` | Assumes data always available |
| **KanbanColumn** | No loading/error states for column operations | `KanbanColumn.tsx` | No feedback on failures |
| **HabitCalendar** | Edit/Delete buttons hidden until hover — not keyboard accessible | `HabitCalendar.tsx:271-288` | Mobile/large touch targets miss them |
| **HabitCalendar** | No focus ring on 24x24px toggle cells | `HabitCalendar.tsx:325` | Keyboard users can't see position |
| **Navbar theme toggle** | No `aria-pressed` | `Navbar.tsx:209-215` | Current theme not announced |
| **Navbar command palette** | No `aria-expanded` | `Navbar.tsx:200-206` | Palette state not communicated |
| **SettingsSidebar** | No keyboard nav per item | `SettingsSidebar.tsx:74-96` | Tab navigation works but no arrow keys |
| **ErrorBanner retry** | No loading/disabled state on retry | `ErrorBanner.tsx:30-36` | Double-click possible during retry |
| **EmptyState action** | No disabled state | `EmptyState.tsx:41-46` | Can't disable action when loading |

### LOW Severity

| Component | Missing States | File:Line | Impact |
|---|---|---|---|
| **NavigationItem** | File doesn't exist | — | N/A |
| **TimelineItem** | File doesn't exist | — | Inline renders are adequate |
| **All icon buttons** | No `:focus-visible` beyond global outline | Various | Minor — global covers it |
| **Quick-add duration select** | No focus ring | `KanbanColumn.tsx:188-196` | Minor styling gap |
| **Column rename input** | No error state | `KanbanColumn.tsx:120-127` | Empty name guard exists |
| **Board page** | History buttons no disbled state at boundaries | `board/page.tsx:92-109` | Can navigate before first month |
| **Navbar window controls** | Close button missing `active` state | `Navbar.tsx:237-244` | Minor detail |

---

## Known Issues Cross-Reference

| # | Issue | Status in Audit | Verification |
|---|---|---|---|
| 1 | LevelUpCelebration fires on every navigation | **Confirmed** — `lastLevelUpNotified` never updated by `dismiss()` | `LevelUpCelebration.tsx:18-21` — store doesn't update on dismiss |
| 2 | Timeline cards double padding/overflow | **Confirmed** — double-bezel pattern uses `p-1.5` + `p-5`, no `overflow-hidden` | `TimelineStream.tsx:136-137` |
| 3 | Cards resize on hover (transform without space compensation) | **Confirmed** — `card-hover-lift` uses `translateY(-2px)` + `scale(0.98)` on active; no `transform-gpu` to isolate | `globals.css:463-478` |
| 4 | SkillOctagon appears in too many places | **Confirmed** — Used in dashboard (page.tsx:44), habits (page.tsx:134), habits sidebar (`:128`) | 3+ instances |
| 5 | Navigation looks ugly | **Subjective** — GooeyTabs style is polarizing; functional strength is good, visual is opinionated | `gooey-tabs.tsx` |
| 6 | No right padding in grid layouts | **Confirmed** — `bento-grid` uses `gap: var(--space-lg)` which provides inter-item spacing; on mobile single-column collapse, items have no edge padding | `globals.css:402-410` — gap only between items, no outer padding |
| 7 | Dashboard cluttered with too many widgets | **Confirmed** — Dashboard `page.tsx` has 11+ distinct widget blocks in 5 rows of bento grid | `page.tsx:27-82` |

---

## Summary

**Total components audited:** 38 (existing) + 20 (not found/renamed)

**State coverage:**
- Loading states: ~55% of data-driven components covered
- Empty states: ~60% coverage
- Error states: ~45% coverage
- Disabled states: ~30% coverage (largely on form submit buttons)
- Hover states: ~85% coverage
- Focus states: ~70% coverage (global outline covers most gaps)
- Reduced motion: ~70% coverage (BaseCard is the main gap)
- ARIA attributes: ~50% coverage

**Top 5 fixes by impact:**
1. Fix `LevelUpCelebration` store update so it fires once per level
2. Add React Error Boundary to layout.tsx
3. Add `autoFocus` to modal form inputs
4. Fix `lastLevelUpNotified` bug and add Escape key handling to modals
5. Replace `confirm()` with proper modal in TaskModal
