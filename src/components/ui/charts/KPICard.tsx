'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { NumberTicker } from '@/components/ui/NumberTicker'

type CardAccent = 'blue' | 'pink' | 'rose' | 'amber' | 'emerald' | 'violet' | 'teal' | 'orange' | 'indigo' | 'default'

interface KPICardProps {
  eyebrow: string
  title: string
  value: string | number
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  subtitle?: string
  accent?: CardAccent
}

const accentStyles: Record<CardAccent, { accent: string; muted: string; border: string }> = {
  blue: { accent: 'var(--accent-blue)', muted: 'var(--accent-blue-muted)', border: 'var(--accent-blue)' },
  pink: { accent: 'var(--accent-pink)', muted: 'var(--accent-pink-muted)', border: 'var(--accent-pink)' },
  rose: { accent: 'var(--accent-rose)', muted: 'var(--accent-rose-muted)', border: 'var(--accent-rose)' },
  amber: { accent: 'var(--accent-amber)', muted: 'var(--accent-amber-muted)', border: 'var(--accent-amber)' },
  emerald: { accent: 'var(--accent-emerald)', muted: 'var(--accent-emerald-muted)', border: 'var(--accent-emerald)' },
  violet: { accent: 'var(--accent-violet)', muted: 'var(--accent-violet-muted)', border: 'var(--accent-violet)' },
  teal: { accent: 'var(--accent-teal)', muted: 'var(--accent-teal-muted)', border: 'var(--accent-teal)' },
  orange: { accent: 'var(--accent-orange)', muted: 'var(--accent-orange-muted)', border: 'var(--accent-orange)' },
  indigo: { accent: 'var(--accent-indigo)', muted: 'var(--accent-indigo-muted)', border: 'var(--accent-indigo)' },
  default: { accent: 'var(--accent)', muted: 'var(--accent-muted)', border: 'var(--accent)' },
}

export function KPICard({
  eyebrow,
  title,
  value,
  trend,
  trendType = 'positive',
  icon: Icon,
  subtitle,
  accent = 'default',
}: KPICardProps) {
  const colors = accentStyles[accent]

  return (
    <div className="p-1.5 rounded-[2rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs group hover:ring-stone-900/15 dark:hover:ring-white/20 transition-shadow">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between gap-3 h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border inline-block mb-1"
              style={{
                color: colors.accent,
                backgroundColor: colors.muted,
                borderColor: `${colors.accent}33`,
              }}
            >
              {eyebrow}
            </span>
            <h4 className="text-xs font-semibold text-[var(--text-secondary)]">{title}</h4>
          </div>

          <div
            className="p-2.5 rounded-2xl border transition-colors group-hover:text-white"
            style={{
              backgroundColor: colors.muted,
              color: colors.accent,
              borderColor: `${colors.accent}22`,
            }}
          >
            <Icon className="size-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-1">
          <span className="font-mono font-extrabold text-2xl text-[var(--text-primary)] tracking-tight">
            {typeof value === 'number' ? <NumberTicker value={value} /> : value}
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
