# Component: Activity Table & Aggregation Grid

- **Library**: HeroUI / Custom Data Grid
- **URL**: https://www.heroui.com/en/docs/react/components/table
- **Fetched by**: sub-agent

## Overview

Structured tabular display for application usage stats, active vs idle ratios, and time totals.

## Code

```tsx
'use client'

import React from 'react'

export interface AppStatItem {
  appName: string
  category: 'work' | 'neutral' | 'distraction'
  totalSeconds: number
  percentage: number
  sessionsCount: number
}

interface ActivityTableProps {
  stats: AppStatItem[]
}

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function ActivityTable({ stats }: ActivityTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-secondary)] uppercase">
          <tr>
            <th className="px-6 py-3.5">Application</th>
            <th className="px-6 py-3.5">Category</th>
            <th className="px-6 py-3.5 text-right">Duration</th>
            <th className="px-6 py-3.5 text-right">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {stats.map((stat) => (
            <tr key={stat.appName} className="hover:bg-[var(--bg-surface-hover)] transition-colors">
              <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{stat.appName}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                    stat.category === 'work'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : stat.category === 'distraction'
                      ? 'bg-red-500/10 text-red-600 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}
                >
                  {stat.category === 'work' ? 'Deep Work' : stat.category}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-mono font-semibold text-[var(--text-primary)]">
                {formatDuration(stat.totalSeconds)}
              </td>
              <td className="px-6 py-4 text-right font-mono text-[var(--text-secondary)]">
                {stat.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## API / Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| stats | `AppStatItem[]` | `[]` | List of aggregated application statistics |
