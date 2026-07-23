# Component: Application Usage Duration Bar Chart

- **Library**: Animata / Custom Bar Component
- **URL**: https://animata.design/docs/graphs/bar-chart
- **Fetched by**: sub-agent

## Overview

Application usage ranking bar chart displaying exact active usage time per executable (e.g. `Code.exe`, `chrome.exe`, `Figma.exe`) with formatted duration (`3h 12m`, `1h 45m`), category badge (Deep Work, Tools, Distraction), and percentage share bar.

## Code Specification

```tsx
'use client'

import React from 'react'

export interface AppDurationItem {
  appName: string
  category: 'work' | 'neutral' | 'distraction'
  totalSeconds: number
  percentage: number
  sessionsCount: number
}
```

## Domain Rules

- Formatted Duration: `formatDuration(seconds)` returns `Xh Ym` or `Ym`.
- Ranking: Sorted descending by `totalSeconds`.
