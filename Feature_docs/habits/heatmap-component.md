# Component: Habit Contribution Heatmap

- **Libraries Evaluated**: Kibo UI (`https://www.kibo-ui.com/components/contribution-graph`), Smooth UI (`https://smoothui.dev/docs/components/contribution-graph`)
- **Category**: HABITS — Contribution Graph / Heatmap
- **Fetched by**: AI Agent (Phase 1 Component Fetch)

---

## Component Evaluation & Comparison

| Criterion | Kibo UI | Smooth UI | Cult UI | Winner / Pick |
|-----------|---------|-----------|---------|---------------|
| **Animation Quality** | CSS Tooltip / basic hover | Smooth Framer Motion spring popovers & scale-on-hover | Static SVG blocks | **Smooth UI + Motion** |
| **Visual Polish** | Clean GitHub green grid | Soft rounded cells, multi-tier Emerald color scale (`#ecfdf5` to `#047857`), custom date tooltips | Heavy border style | **Smooth UI** |
| **API Ergonomics** | `data: Array<{ date, count }>` | `data: Array<{ date, count, level? }>`, custom cell renderer, date range props | Proprietary props | **Smooth UI** |
| **Aesthetic Match** | Good | Excellent (matches Shodasha Emerald `#059669` light-first theme) | Brutalist | **Smooth UI** |

---

## Component Architecture & Code Specification

### Props Interface

```tsx
export interface ContributionDay {
  date: string // YYYY-MM-DD
  count: number // Number of completed habits on this date
  level: 0 | 1 | 2 | 3 | 4 // Heat intensity level
}

export interface ContributionGraphProps {
  data: ContributionDay[]
  startDate?: string
  endDate?: string
  colorScale?: string[] // E.g. ['var(--bg-tertiary)', '#a7f3d0', '#34d399', '#059669', '#047857']
  onCellClick?: (date: string, count: number) => void
  showMonthLabels?: boolean
  showWeekdayLabels?: boolean
}
```

### Dependencies
- `framer-motion` (for spring hover animations and smooth entry fade)
- `date-fns` or native JS `Date` math
- `lucide-react` icons (calendar, flame, info)

---

## Implementation Details

The heatmap displays a 52-week horizontal grid of daily cells grouped into weeks (7 rows per column, 52+ columns).
- **Level 0 (0 check-ins):** Subtly tinted grey/tertiary (`var(--bg-tertiary)`)
- **Level 1 (1 check-in):** Light Emerald (`#a7f3d0`)
- **Level 2 (2 check-ins):** Medium Emerald (`#34d399`)
- **Level 3 (3 check-ins):** Deep Emerald (`#059669`)
- **Level 4 (4+ check-ins):** Dark Emerald (`#047857`)

Each cell has a Framer Motion scale micro-interaction (`whileHover={{ scale: 1.25 }}`) and native tooltip displaying date and completion metric.
