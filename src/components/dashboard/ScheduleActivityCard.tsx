'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, Clock, CheckCircle2, Play, ChevronRight, ExternalLink } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useTimeEntryStore, TimeEntry } from '@/stores/timeEntryStore'
import { openExternalUrl } from '@/lib/utils/url'
import Link from 'next/link'

export function ScheduleActivityCard() {
  const shouldReduceMotion = useReducedMotion()
  const tasks = useTaskStore((s) => s.tasks)
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus)
  const entries = useTimeEntryStore((s) => s.entries)

  // Active foreground entry if tracking right now
  const activeEntry = entries.find((e: TimeEntry) => !e.endTime)

  // Format real date/time for schedule items
  const formatTimeLabel = (task: any) => {
    if (task.dueDate) return task.dueDate
    try {
      const d = new Date(task.createdAt)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return 'Today'
    }
  }

  // Take top 4 tasks for the schedule list
  const activeScheduleItems = tasks.slice(0, 4).map((task, idx) => {
    const isDone = task.status === 'done'
    const isCurrent = idx === 0 && !isDone
    return {
      id: task.id,
      time: formatTimeLabel(task),
      title: task.title,
      subtitle: task.description || (task.tags && task.tags.length > 0 ? `#${task.tags.join(', #')}` : 'Task Item'),
      status: isDone ? 'Done' : isCurrent ? 'In Progress' : 'Scheduled',
      isDone,
      statusColor: isDone
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
        : isCurrent
        ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:bg-violet-500/20'
        : 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20 hover:bg-stone-500/20',
      url: task.url,
    }
  })

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6 shadow-xs h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
              Today's Schedule & Tasks
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Active task queue and desktop activity stream
            </p>
          </div>
        </div>

        <Link
          href="/board"
          className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 group"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Active Poller Banner (If app is currently tracking) */}
      {activeEntry && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold truncate">Live Active: {activeEntry.appName}</span>
          </div>
          <span className="font-mono text-[11px] truncate max-w-[140px] opacity-80">{activeEntry.windowTitle}</span>
        </div>
      )}

      {/* Schedule Items List */}
      <div className="flex flex-col gap-3 my-1">
        {activeScheduleItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-tertiary)] flex flex-col items-center gap-2">
            <span>No tasks in schedule. Create your first task on the Board tab!</span>
            <Link
              href="/board"
              className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Go to Board
            </Link>
          </div>
        ) : (
          activeScheduleItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-default)] transition-colors group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex flex-col text-right shrink-0 min-w-[64px]">
                  <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {item.time}
                  </span>
                </div>

                <div className="w-1.5 h-8 rounded-full bg-[var(--accent)]/30 shrink-0 group-hover:bg-[var(--accent)] transition-colors" />

                <div className="flex flex-col min-w-0">
                  <span className={`text-sm font-semibold truncate ${item.isDone ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
                    {item.title}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.url && (
                  <button
                    onClick={() => openExternalUrl(item.url)}
                    className="p-1 rounded-md text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                    title={`Open ${item.url} in browser`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => toggleTaskStatus(item.id)}
                  aria-label={`Toggle status for ${item.title}`}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${item.statusColor}`}
                  title={item.isDone ? 'Mark as incomplete' : 'Mark as done'}
                >
                  <CheckCircle2 className={`w-3 h-3 ${item.isDone ? 'text-emerald-500' : 'opacity-60'}`} />
                  <span>{item.status}</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
