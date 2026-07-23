'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  eyebrow: string
  title: string
  value: string | number
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  subtitle?: string
}

export function KPICard({
  eyebrow,
  title,
  value,
  trend,
  trendType = 'positive',
  icon: Icon,
  subtitle,
}: KPICardProps) {
  return (
    <div className="p-1.5 rounded-[2rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs group hover:ring-stone-900/15 dark:hover:ring-white/20 transition-all">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between gap-3 h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent)] bg-[var(--accent-muted)] px-2 py-0.5 rounded-full border border-[var(--accent)]/20 inline-block mb-1">
              {eyebrow}
            </span>
            <h4 className="text-xs font-semibold text-[var(--text-secondary)]">{title}</h4>
          </div>

          <div className="p-2.5 rounded-2xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border)] group-hover:text-[var(--accent)] transition-colors">
            <Icon className="size-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-1">
          <span className="font-mono font-extrabold text-2xl text-[var(--text-primary)] tracking-tight">
            {value}
          </span>

          {trend && (
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                trendType === 'positive'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                  : trendType === 'negative'
                  ? 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
                  : 'bg-stone-500/10 text-stone-600 border-stone-500/20 dark:text-stone-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-[11px] text-[var(--text-muted)] font-mono truncate">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
