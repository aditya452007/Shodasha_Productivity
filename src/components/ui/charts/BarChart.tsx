'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface BarItem {
  label: string
  value: number
  percentage: number
  color: string
  sublabel?: string
}

interface BarChartProps {
  items: BarItem[]
  title?: string
}

export function BarChart({ items, title }: BarChartProps) {
  return (
    <div className="space-y-3.5">
      {title && (
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
          {title}
        </h4>
      )}

      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-[var(--text-primary)] truncate">{item.label}</span>
              {item.sublabel && (
                <span className="text-[10px] text-[var(--text-muted)] font-mono">({item.sublabel})</span>
              )}
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{item.percentage}%</span>
          </div>

          {/* Bar track */}
          <div className="h-2.5 w-full bg-[var(--bg-surface-hover)] rounded-full overflow-hidden p-0.5 border border-[var(--border)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
