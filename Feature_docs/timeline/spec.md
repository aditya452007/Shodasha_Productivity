# Timeline Feature Specification (`/timeline`)

## Overview

The Timeline feature provides Windows activity logging and time distribution analytics for Shodasha. It presents a detailed activity stream of application and window usage, aggregated stats, category classifications (Deep Work, Neutral, Distraction), and search/filtering capabilities.

---

## Page Layout & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Page Header: Timeline & Activity Analytics                              │
├─────────────────────────────────────────────────────────────────────────┤
│ CategoryFilterBar                                                       │
│ [ Today | 7 Days | All ]  [ All ] [ Deep Work ] [ Neutral ] [ Distraction ] │
│ 🔍 Search app or window title...                  ⚡ 2h 34m Active Focus │
├─────────────────────────────────────────────────────────────────────────┤
│ ActivityDistributionChart                                               │
│ ┌───────────────────────────┬────────────────┬────────────────────────┐ │
│ │ 65% Deep Work             │ 25% Neutral    │ 10% Distraction        │ │
│ └───────────────────────────┴────────────────┴────────────────────────┘ │
│ Metric Cards: [ Total Active Time ] [ Deep Work Ratio ] [ Top App ]     │
├─────────────────────────────────────────────────────────────────────────┤
│ TimelineStream (Activity Log)                                           │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🟢 Code.exe — Shodasha_Productivity — Agent.md                       │ │
│ │ 10:30 AM – 12:30 PM (2h 00m) • Deep Work • Linked Task: Timeline UI  │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ 🟡 WindowsTerminal.exe — PowerShell — npm run dev                   │ │
│ │ 12:30 PM – 12:54 PM (24m) • Neutral                                  │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ 🔴 chrome.exe — Tailwind CSS Documentation                           │ │
│ │ 12:54 PM – 01:04 PM (10m) • Distraction                             │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Contracts & Interfaces

### TimeEntry
```typescript
export interface TimeEntry {
  id: string
  appName: string
  windowTitle: string
  startTime: string // ISO Timestamp
  endTime?: string // ISO Timestamp
  endReason?: 'idle' | 'closed' | null
  durationSeconds?: number
  linkedTaskId?: string
  createdAt: string
}
```

### AppCategory
```typescript
export type CategoryType = 'work' | 'neutral' | 'distraction'

export interface AppCategory {
  appName: string
  category: CategoryType
}
```

### Filters
```typescript
export type TimeframeFilter = 'today' | '7days' | 'all'
export type CategoryFilter = 'all' | 'work' | 'neutral' | 'distraction'
```

---

## Domain & Filtering Rules

1. **Focus Time Calculation**:
   - Focus Time = Sum of `durationSeconds` for entries where `endReason !== 'idle'`.
   - Entries with `endReason === 'idle'` represent lock screen / sleep and are excluded from active focus duration.

2. **Categorization**:
   - `work` (Deep Work): Emerald accent (`#059669`)
   - `neutral` (General / System / Tools): Amber accent (`#d97706`)
   - `distraction` (Social / Entertainment / Distracting Web): Red accent (`#dc2626`)
   - Default for unclassified apps: `neutral`.

3. **Search & Filter Rules**:
   - **Timeframe Filter**: Filters `startTime` against current date.
   - **Category Filter**: Filters entries whose `appName` category matches the selected category filter.
   - **Search Query**: Matches case-insensitive substrings in either `appName` or `windowTitle`.

4. **Task Linkage**:
   - A `TimeEntry` can be attributed to a Kanban task by setting `linkedTaskId`.
   - Displays a clickable badge linking directly to the task context.

---

## Styling & Design Token Guidelines

- Cards: `bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-6`
- Typography: Display titles in `font-display`, metrics in `font-mono`
- Entry animations: Motion spring transitions (`type: 'spring', bounce: 0, duration: 0.3`)
- Accessibility: Fully keyboard navigable, high contrast, `prefers-reduced-motion` support.
