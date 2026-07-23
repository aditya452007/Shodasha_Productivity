# Component: Animated Timeline

- **Library**: Animata / Custom Framer Motion
- **URL**: https://animata.design/docs/progress/animatedtimeline
- **Fetched by**: sub-agent

## Overview

The Animated Timeline component presents chronological events with vertical lines, status dots, smooth motion entry animations, and hover state highlights. Perfect for activity logs and daily window tracking streams.

## Code

```tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

export interface TimelineItemProps {
  id: string
  title: string
  subtitle: string
  timestamp: string
  duration: string
  category: 'work' | 'neutral' | 'distraction'
  icon?: LucideIcon
  badge?: string
}

interface AnimatedTimelineProps {
  items: TimelineItemProps[]
}

const categoryColors = {
  work: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  neutral: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  distraction: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
}

const dotColors = {
  work: 'bg-emerald-500 ring-emerald-500/20',
  neutral: 'bg-amber-500 ring-amber-500/20',
  distraction: 'bg-red-500 ring-red-500/20',
}

export function AnimatedTimeline({ items }: AnimatedTimelineProps) {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.3, delay: index * 0.05 }}
          className="relative group"
        >
          {/* Dot */}
          <div
            className={`absolute -left-[1.875rem] top-4 size-3 rounded-full ring-4 transition-transform group-hover:scale-125 ${
              dotColors[item.category]
            }`}
          />

          {/* Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-5 hover:border-[var(--border-strong)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              {item.icon && (
                <div className="p-2.5 rounded-xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]">
                  <item.icon className="size-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-base text-[var(--text-primary)]">
                    {item.title}
                  </h4>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${
                      categoryColors[item.category]
                    }`}
                  >
                    {item.category === 'work' ? 'Deep Work' : item.category}
                  </span>
                  {item.badge && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono truncate max-w-md">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="font-mono text-sm font-semibold text-[var(--text-primary)] block">
                  {item.duration}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {item.timestamp}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
```

## API / Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `TimelineItemProps[]` | `[]` | Array of timeline entries to display |

## Dependencies

- `framer-motion`
- `lucide-react`
