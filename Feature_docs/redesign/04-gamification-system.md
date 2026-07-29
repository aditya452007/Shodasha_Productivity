# Gamification System — Skill Octagon, XP/Levels, Achievements & Streaks

## 1. Skill Octagon (Radar Chart)

### Axes & Scoring (0–100 each)

| Axis | Scoring Logic | Data Source |
|------|--------------|-------------|
| **Consistency** | 14-day completion rate (avg % of habits done/day) | `habitStore.records` |
| **Depth** | Ratio of deep work hours to total screen time (last 7d) | `timeEntryStore.getKPIsFiltered().deepWorkRatio` |
| **Balance** | 1 - |work_ratio - distraction_ratio| / 100 | `timeEntryStore.getKPIsFiltered()` |
| **Focus** | Hours of uninterrupted focus / 8h max (capped, normalized) | `timeEntryStore.getKPIsFiltered().activeFocusSeconds` |
| **Growth** | new habit rate + task completion velocity (7d trend) | `habitStore.habits.length` + `taskStore.tasks` |
| **Recovery** | Idle time mindfulness ratio (logged idle / total) | `timeEntryStore.getKPIsFiltered().idleTimeSeconds` |
| **Mastery** | Achievement unlock rate (% of achievements earned) | `achievements.ts` computed progresses |
| **Discipline** | Streak adherence (current_streak / longest_streak) | computed from `habitStore.records` |

**Empty state:** All axes render at 0 with a dashed polygon outline and a centered "Create habits and track focus time to see your Skill Octagon" message.

**Skeleton state:** 6 placeholder polygon spokes with animated shimmer (CSS `@keyframes shimmer` via `LoadingSkeleton` pattern).

**Error state:** Reuses `ErrorBanner` with "Failed to load skill data".

### Component Spec

```
components/gamification/SkillOctagon.tsx
```

- **SVG radar chart** drawn on a `<svg>` with 6–8 equally-angled spokes.
- **Polygon fill** animated with Motion (`<motion.polygon>` using `animate={{ points }}` with spring transition).
- **Spring params:** `{ type: 'spring', stiffness: 80, damping: 12, mass: 1 }` — fluid but not bouncy.
- **Reduced motion:** `useReducedMotion()` → skip spring, render final shape immediately.
- **Color palette per axis:**
  - Consistency — `var(--accent-emerald)`
  - Depth — `var(--accent-blue)`
  - Balance — `var(--accent-violet)`
  - Focus — `var(--accent-amber)`
  - Growth — `var(--accent-teal)`
  - Recovery — `var(--accent-pink)`
  - Mastery — `var(--accent-indigo)`
  - Discipline — `var(--accent-orange)`
- **Interactive hover:** Each axis vertex shows a tooltip with the axis name and score (0–100).
- **Responsive sizing:** Fits `col-span-1` (1/3 bento) at 260×260px or `col-span-2` (1/2 bento) at 380×380px via `size` prop.
- **Accessibility:** `<svg>` has `role="img"` + `<title>` listing all axis values. Each axis label rendered as `<text>`. Keyboard nav: tab through axis labels to read values.

### Animation Sequence (mount)

1. Background grid lines fade in (opacity 0→0.3, 300ms)
2. Axis labels slide in from center (stagger 40ms each)
3. Polygon fills from 0 outward (spring, 800ms settle)

### Data Requirements

No new DB fields. All derived from existing `habitStore`, `timeEntryStore`, `taskStore`.

### Integration

Add `<SkillOctagon />` to `src/app/page.tsx` (Dashboard) and optionally as a bento widget on `/habits`.

---

## 2. XP & Level System

### XP Sources

| Action | XP Earned | Rate Limit |
|--------|-----------|------------|
| Habit check-in (per habit, per day) | 10 XP | Once per habit per day |
| All habits done in a day | +25 XP bonus | Once per day |
| Streak milestone reached (7, 14, 30, 60, 90, 365) | 100 XP | Once per milestone |
| Focus session completed (timer) | 5 XP per 30min focus | No cap |
| Task moved to done | 15 XP | Once per task |
| Task completed before due date | +10 XP bonus | Once per task |
| Achievement unlocked | 50 XP | Once per achievement |
| First check-in of the day | +5 XP | Once per day |

### Level Threshold Formula

```
XP_required(level) = 100 × level × 1.15^(level - 1)
```

| Level | Cumulative XP | Tier |
|-------|---------------|------|
| 1 | 0 | Bronze |
| 5 | 809 | Bronze |
| 10 | 2,828 | Silver |
| 15 | 6,261 | Silver |
| 20 | 11,728 | Gold |
| 25 | 20,200 | Gold |
| 30 | 33,463 | Platinum |
| 35 | 54,474 | Platinum |
| 40 | 87,939 | Diamond |
| 45 | 141,589 | Diamond |
| 50+ | 227,834 | Master → Legend |

**Tier naming:** Bronze (1–9), Silver (10–19), Gold (20–29), Platinum (30–39), Diamond (40–49), Master (50–74), Legend (75+).

### Visual Components

**`components/gamification/XPProgressBar.tsx`**
- Animated horizontal bar with Motion `layout` transition (spring, stiffness 120)
- Current XP / Next level target display
- Tier badge with tier color (Bronze: `#CD7F32`, Silver: `#C0C0C0`, Gold: `#FFD700`, Platinum: `#E5E4E2`, Diamond: `#B9F2FF`, Master: `#8A2BE2`, Legend: `#FF6B35`)
- NumberTicker for XP count
- Reduced motion: instant bar width, no ticker animation

**`components/gamification/LevelUpCelebration.tsx`**
- Full-screen overlay triggered on level-up event
- Scale-up badge animation (`scale: 0 → 1.1 → 1`, duration 600ms, ease `[0.23,1,0.32,1]`)
- Particle burst (12 small dots radiating outward, 800ms, fade out)
- Level number ticker (animated count-up to new level)
- Tier name text with spring entrance
- Auto-dismiss after 3s or on click
- Reduced motion: skip particles + scale animation, just show the badge with opacity fade

**`components/gamification/DailyXPGoal.tsx`**
- Circular progress ring (`ProgressRing` from ui) showing daily XP vs daily goal (baseline: 100 XP)
- "On track" / "Almost there" / "Goal reached" text
- Smooth ring fill animation (600ms ease-out)

### Store: `src/stores/gamificationStore.ts`

New Zustand slice:

```ts
interface GamificationState {
  // State
  xp: number
  level: number
  unlockedAchievements: string[]
  lastLevelUpNotified: number
  isInitialized: boolean

  // Computed
  getLevelProgress: () => { current: number; next: number; percentage: number }
  getTierName: (level: number) => string
  getTotalXPForLevel: (level: number) => number

  // Actions
  awardXP: (amount: number, source: string) => void
  checkAndAwardStreakMilestone: (streak: number) => void
  checkAndAwardAchievement: (achievementId: string) => void
  initializeGamification: () => Promise<void>
}
```

**Persistence:** `xp` and `level` stored in existing SQLite `settings` table as `gamification_xp` and `gamification_level` keys. `unlockedAchievements` stored as comma-separated string in `gamification_unlocked_achievements`.

### DB Schema (new table)

```sql
CREATE TABLE IF NOT EXISTS xp_events (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,        -- 'habit_checkin' | 'focus_session' | 'task_done' | 'achievement' | 'streak_milestone'
  amount INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
```

This table enables XP history replay and prevents double-awarding.

### Integration Points

- `HabitStatsCard` calls `gamificationStore.awardXP(10, 'habit_checkin')` on toggle
- `timerStore` calls `gamificationStore.awardXP(5 * intervals, 'focus_session')` on timer complete
- `taskStore` calls `gamificationStore.awardXP(15, 'task_done')` on move to done
- `HabitAchievements` calls `gamificationStore.checkAndAwardAchievement(id)` on unlock

---

## 3. Achievement Visualization — Redesign

### Badge Component Spec

**`components/gamification/AchievementBadge.tsx`**

- **Locked state:** Desaturated grayscale icon with "?" badge overlay, semi-transparent card (`opacity: 0.6`), dashed border.
- **Unlocked state:** Full-color icon with shiny gradient overlay, solid border with glow (`box-shadow` of accent color at 20% opacity), subtle shimmer sweep animation (CSS `background-position` shift).
- **Recent unlock:** Scale pulse animation on mount + "NEW" shimmer ribbon in top-right corner (gold gradient, 2px font, uppercase).

### Badge Grid Layout

```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

Categories visually separated by section headers with category color accent line:
- Streaks (amber) — flame icon group
- Focus (blue) — brain icon group
- Tasks (green) — checklist icon group
- Habits (violet) — sprout icon group
- Milestones (teal) — trophy icon group

### Unlock Animation

1. Card scale 0→1.05→1 (spring stiffness 300, damping 20)
2. Icon rotates 360° over 400ms with ease-out
3. Shimmer sweep plays once (800ms)
4. "NEW" badge fades out after 3s
5. **Reduced motion:** fade-in only (300ms)

### Progress-to-Next Bar

Each locked badge has a sub-bar showing progress toward the next achievement in its category. If no more achievements exist, the bar shows "All unlocked!" with a subtle checkmark.

### Empty State

"No achievements yet. Start tracking habits and focus time to earn your first badge." with a `Trophy` icon and a "Create a habit" CTA.

### Categories Regrouping

Refactor `achievements.ts` to add `category: 'streaks' | 'focus' | 'tasks' | 'habits' | 'milestones'` replacing the old `'bronze'|'silver'|...` tier category. The tier is moved to a new `tier` field matching XP level tiers.

### New Achievements to Add

```ts
{ id: 'tasks-50', title: 'Task Terminator', description: 'Complete 50 tasks', iconName: 'zap', targetCount: 50, type: 'tasks_done', category: 'tasks', tier: 'silver' },
{ id: 'tasks-200', title: 'Execution Engine', description: 'Complete 200 tasks', iconName: 'flame', targetCount: 200, type: 'tasks_done', category: 'tasks', tier: 'gold' },
{ id: 'tasks-1000', title: 'Centurion of Action', description: 'Complete 1000 tasks', iconName: 'trophy', targetCount: 1000, type: 'tasks_done', category: 'tasks', tier: 'legendary' },
{ id: 'focus-500', title: 'Deep Work Adept', description: 'Log 500 focus hours', iconName: 'brain', targetCount: 500, type: 'focus_hours', category: 'focus', tier: 'platinum' },
{ id: 'focus-1000', title: 'Focus Grandmaster', description: 'Log 1000 focus hours', iconName: 'gem', targetCount: 1000, type: 'focus_hours', category: 'focus', tier: 'master' },
{ id: 'habits-5', title: 'Habit Collector', description: 'Create 5 active habits', iconName: 'sprout', targetCount: 5, type: 'habits_created', category: 'habits', tier: 'bronze' },
{ id: 'habits-15', title: 'Ritual Architect', description: 'Create 15 active habits', iconName: 'star', targetCount: 15, type: 'habits_created', category: 'habits', tier: 'gold' },
```

---

## 4. Streak System Enhancement

### Component: `components/gamification/StreakDisplay.tsx`

- **Flame icon** with CSS `filter: drop-shadow(...)` that intensifies by streak length
  - 1–6 days: small flame, gray-orange
  - 7–13 days: medium flame, orange
  - 14–29 days: large flame, orange-red, subtle pulse
  - 30–59 days: large flame, red, pulsing glow
  - 60–89 days: large flame, purple-red, double pulse
  - 90+: large flame, gold-white, intense glow + particle sparks
- **Streak prediction:** "Complete today to reach X days!" — shown when user hasn't checked in today yet
- **Longest streak** displayed as trophy text below current
- **Streak freeze:** Displayed as 1–3 ice cube icons showing available freezes (earned at 7, 30, 60 day milestones)
- **Recovery mechanic:** If streak is broken, show "Streak lost at X days. Complete today to start a new streak" with a gentle bounce animation (not punitive, encouraging tone)

### Streak Animation

- Mount: flame scales up from 0 with spring `{ stiffness: 200, damping: 15 }`
- Streak increment: flame briefly intensifies (scale 1→1.15→1, 300ms)
- Reduced motion: skip scale, just update text

### Data Flow

- `gamificationStore` exposes `getStreakData()` computed from `habitStore.records`
- Cached in a `streakCache` memoized selector
- Streak milestones tracked in `achievements.ts` (already exists: 7, 15, 21, 30 days — extend to 60, 90, 365)

### New DB Fields (in settings table or new streak_freeze table)

```sql
CREATE TABLE IF NOT EXISTS streak_freeze (
  id TEXT PRIMARY KEY,
  earned_at TEXT NOT NULL,       -- milestone that granted the freeze
  used_at TEXT,                  -- null if available, set when used
  expires_at TEXT NOT NULL       -- freeze expires after 30 days if unused
);
```

---

## 5. Integration Map

| Page | New Component | Position |
|------|--------------|----------|
| Dashboard `/` | `SkillOctagon` (compact) | Top-right bento cell |
| Dashboard `/` | `XPProgressBar` + `LevelUpCelebration` | Below stats summary |
| Dashboard `/` | `DailyXPGoal` | Sidebar bento cell |
| Habits `/habits` | `SkillOctagon` (full) | Between stats and analytics |
| Habits `/habits` | `StreakDisplay` | Replaces/upgrades current streak card |
| Habits `/habits` | `AchievementBadge` grid | Replaces `HabitAchievements` |
| Settings `/settings` | Gamification stats panel (read-only, reset option) | Bottom of settings |

## 6. Animation Spec Summary

| Effect | Motion (default) | Reduced Motion |
|--------|------------------|----------------|
| Octagon polygon fill | `spring { stiffness: 80, damping: 12 }` | No animation (final state) |
| Octagon axis labels appear | stagger 40ms, opacity 0→1, y: 5→0 | No stagger, all visible |
| XP bar fill | `layout` spring `{ stiffness: 120, damping: 18 }` | Instant width change |
| Level-up celebration badge | scale 0→1.1→1, 600ms cubic-bezier | opacity fade 300ms |
| Level-up particles | 12 dots, radial, 800ms, fade | Skip entirely |
| Achievement unlock | scale 0→1.05→1 spring + icon rotate 360° 400ms | opacity fade 300ms |
| Shimmer sweep on badge | `background-position` 800ms ease | Skip |
| Flame intensity | scale 1→1.15→1, 300ms ease-out | No scale, just color |
| Number ticker (XP, count) | 400ms ease-out cubic | Immediate value |

## 7. Empty / Loading / Error States

| Component | Empty | Loading | Error |
|-----------|-------|---------|-------|
| SkillOctagon | Dashed polygon + CTA text | Shimmer skeleton polygon | ErrorBanner |
| XPProgressBar | Level 1, 0 XP display | Skeleton bar 40% width | ErrorBanner |
| LevelUpCelebration | Never shown (no level 0) | N/A (triggered) | N/A |
| DailyXPGoal | 0/100 with "Start your day" | Ring shimmer | Inline error text |
| AchievementBadge grid | EmptyState with Trophy icon | 4 skeleton cards | ErrorBanner |
| StreakDisplay | "0 days" with dim flame | Shimmer line + circle | ErrorBanner inline |

## 8. Scoring Edge Cases

- **No habits created:** All axes at 0, Octagon shows dashed polygon and CTA
- **No focus data:** Depth, Focus, Recovery axes at 0; Balance defaults to 50 (neutral)
- **Single day of data:** Consistency = that day's rate; all other axes minimal
- **Level 75+ (Legend):** Uses same formula; no cap. Display shows "75 · Legend Tier — ∞"
- **Negative XP:** Impossible by design (XP is only additive)
- **Concurrent level-ups:** Multiple levels awarded in sequence if XP jumps past thresholds. `LevelUpCelebration` queues animations.

## 9. Reduced Motion Compliance

- Every component reads `useReducedMotion()` from `framer-motion`
- Spring/animated transitions become instant or opacity-only
- Particle effects and shimmer sweeps are skipped entirely
- Stagger delays are flattened (all items appear at once)
- NumberTicker respects `prefers-reduced-motion` (already implemented)
- All animations gated behind `motion.div` with `motion` variant checks — never CSS `@keyframes` that can't be paused
