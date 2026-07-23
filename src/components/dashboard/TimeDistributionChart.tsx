'use client'

import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { PieChart, Monitor } from 'lucide-react'

export function TimeDistributionChart() {
  const getBreakdown = useTimeEntryStore((state) => state.getCategoryBreakdownToday)
  const breakdown = getBreakdown()

  const categoryColors: Record<string, string> = {
    work: 'bg-[var(--accent)]',
    neutral: 'bg-stone-400 dark:bg-stone-600',
    distraction: 'bg-amber-500',
  }

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    if (hrs === 0) return `${mins}m`
    return `${hrs}h ${mins}m`
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
            Focus Time Distribution
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Monitor className="h-3.5 w-3.5" />
          <span>Foreground Apps</span>
        </div>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--bg-base)] p-0.5 border border-[var(--border)]">
        {breakdown.map((item) => (
          <div
            key={item.category}
            className={`h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full ${
              categoryColors[item.category]
            }`}
            style={{ width: `${item.percentage}%` }}
          />
        ))}
      </div>

      {/* Breakdown Legend List */}
      <div className="grid grid-cols-3 gap-2">
        {breakdown.map((item) => (
          <div
            key={item.category}
            className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3"
          >
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${categoryColors[item.category]}`} />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                {item.label}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                {formatDuration(item.seconds)}
              </span>
              <span className="font-mono text-xs font-semibold text-[var(--text-muted)]">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
