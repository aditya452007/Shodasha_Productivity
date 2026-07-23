# Component: Cumulative Screen Time Growth Area Chart

- **Library**: Animata / Custom SVG Area Graph
- **URL**: https://animata.design/docs/graphs/progress
- **Fetched by**: sub-agent

## Overview

A cumulative monotonic screen time growth chart. Unlike interval spikes, screen time continuously accumulates from the start of the day (08:00) to the current time, representing total hours the computer has been actively used. Screen time monotonically increases and never decreases.

## Code Specification

```tsx
'use client'

import React from 'react'

export interface CumulativePoint {
  timestamp: string // e.g. "09:00", "12:00", "15:00", "18:00"
  cumulativeFocusMins: number // Monotonically increasing
  cumulativeTotalMins: number // Monotonically increasing (includes idle)
}

interface CumulativeScreenTimeChartProps {
  data: CumulativePoint[]
}
```

## Domain Rules

- Monotonicity: `data[i].cumulativeFocusMins >= data[i-1].cumulativeFocusMins`
- Max Value: Total computer active hours at the latest timestamp.
- Legend: Active Focus Time (Emerald `#059669`) vs System On-Time (Stone `#a8a29e`).
