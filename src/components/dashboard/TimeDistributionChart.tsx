'use client'

import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { PieChart, Monitor } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { formatDuration } from '@/lib/utils/format'

export function TimeDistributionChart() {
  const getBreakdown = useTimeEntryStore((state) => state.getCategoryBreakdownToday)
  const isLoading = useTimeEntryStore((state) => state.isLoading)
  const error = useTimeEntryStore((state) => state.error)
  const refreshAllData = useTimeEntryStore((state) => state.refreshAllData)

  const breakdown = getBreakdown()
  const totalSeconds = breakdown.reduce((acc, item) => acc + item.seconds, 0)

  const categoryColors: Record<string, string> = {
    work: 'bg-[var(--accent)]',
    neutral: 'bg-stone-400 dark:bg-stone-600',
    distraction: 'bg-amber-500',
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
        <LoadingSkeleton height={24} width="50%" />
        <LoadingSkeleton height={14} />
        <div className="grid grid-cols-3 gap-2">
          <LoadingSkeleton height={60} />
          <LoadingSkeleton height={60} />
          <LoadingSkeleton height={60} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorBanner
        title="Failed to load time distribution"
        message={error}
        onRetry={() => refreshAllData()}
      />
    )
  }

  if (totalSeconds === 0) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
            Focus Time Distribution
          </h3>
        </div>
        <EmptyState
          icon={Monitor}
          title="No focus time tracked today"
          description="Start working on tasks to see your application focus time breakdown."
        />
      </div>
    )
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
