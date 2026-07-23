'use client'

import { useTaskStore } from '@/stores/taskStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { Activity, CheckCircle2, Clock } from 'lucide-react'

export function RecentActivityFeed() {
  const tasks = useTaskStore((state) => state.tasks)
  const entries = useTimeEntryStore((state) => state.entries)

  const recentTasks = tasks.slice(0, 3)
  const recentEntries = entries.slice(0, 3)

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

      <div className="flex flex-col divide-y divide-[var(--border)]">
        {/* Task Events */}
        {recentTasks.map((task) => (
          <div key={task.id} className="flex items-start justify-between py-3 first:pt-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {task.title}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Status: <span className="capitalize text-[var(--text-secondary)]">{task.status.replace('_', ' ')}</span>
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">Today</span>
          </div>
        ))}

        {/* Time Entry Events */}
        {recentEntries.map((entry) => (
          <div key={entry.id} className="flex items-start justify-between py-3 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--bg-base)] text-[var(--text-secondary)]">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {entry.appName}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">
                  {entry.windowTitle}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {Math.round((entry.durationSeconds || 0) / 60)}m
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
