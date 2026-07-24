'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface AppDurationBarItem {
  label: string // Executable name e.g. "Code.exe"
  value: number // Duration in seconds
  percentage: number
  color: string
  formattedDuration: string // e.g. "3h 12m"
  sessionsCount?: number
}

interface BarChartProps {
  items: AppDurationBarItem[]
  title?: string
}

export function BarChart({ items, title }: BarChartProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
          {title}
        </h4>
      )}

      {items.map((item, i) => (
        <div key={i} className="space-y-1.5 p-2 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className="size-2.5 rounded-full shrink-0 shadow-[0_0_6px_rgba(0,0,0,0.2)]"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-bold text-[var(--text-primary)] truncate">{item.label}</span>
              {item.sessionsCount && (
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  ({item.sessionsCount} session{item.sessionsCount > 1 ? 's' : ''})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="font-extrabold text-[var(--text-primary)]">{item.formattedDuration}</span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium">({item.percentage}%)</span>
            </div>
          </div>

          {/* Bar Progress Track */}
          <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden p-0.5 border border-[var(--border)]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: item.percentage / 100 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className="h-full w-full rounded-full origin-left"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
