'use client'

import { useTaskStore } from '@/stores/taskStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { Activity, CheckCircle2, Clock } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { formatRelativeTime } from '@/lib/utils/format'

export function RecentActivityFeed() {
  const tasks = useTaskStore((state) => state.tasks)
  const isTaskLoading = useTaskStore((state) => state.isLoading)
  const taskError = useTaskStore((state) => state.error)

  const entries = useTimeEntryStore((state) => state.entries)
  const isTimeLoading = useTimeEntryStore((state) => state.isLoading)
  const timeError = useTimeEntryStore((state) => state.error)

  const isLoading = isTaskLoading || isTimeLoading

  const recentTasks = tasks.slice(0, 3)
  const recentEntries = entries.slice(0, 3)
  const hasItems = recentTasks.length > 0 || recentEntries.length > 0

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
        <LoadingSkeleton height={24} width="45%" />
        <LoadingSkeleton height={40} />
        <LoadingSkeleton height={40} />
      </div>
    )
  }

  const hasError = taskError || timeError
  if (hasError) {
    return (
      <ErrorBanner
        title="Failed to load activity stream"
        message={taskError || timeError || 'An error occurred'}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
            Recent Activity Stream
          </h3>
        </div>
        <span className="text-xs text-[var(--text-muted)]">Realtime Log</span>
      </div>

      {!hasItems ? (
        <EmptyState
          icon={Activity}
          title="No recent activity"
          description="Tasks completed and focus sessions will appear here in real time."
        />
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {/* Task Events */}
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-start justify-between py-3 first:pt-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {task.title}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Status: <span className="capitalize text-[var(--text-secondary)]">{task.status.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0 ml-2">
                {task.updatedAt ? formatRelativeTime(task.updatedAt) : 'Recent'}
              </span>
            </div>
          ))}

          {/* Time Entry Events */}
          {recentEntries.map((entry) => (
            <div key={entry.id} className="flex items-start justify-between py-3 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--bg-base)] text-[var(--text-secondary)] shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {entry.appName}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">
                    {entry.windowTitle}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0 ml-2">
                {entry.endTime ? formatRelativeTime(entry.endTime) : `${Math.round((entry.durationSeconds || 0) / 60)}m`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
