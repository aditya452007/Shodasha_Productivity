'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Code,
  Globe,
  Terminal,
  Moon,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  LucideIcon,
} from 'lucide-react'
import { useTimeEntryStore, TimeEntry } from '@/stores/timeEntryStore'
import { useTaskStore } from '@/stores/taskStore'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { EmptyState } from '@/components/ui/EmptyState'

const getAppIcon = (appName: string): LucideIcon => {
  const name = appName.toLowerCase()
  if (name.includes('code')) return Code
  if (name.includes('terminal') || name.includes('cmd') || name.includes('powershell')) return Terminal
  if (name.includes('chrome') || name.includes('edge') || name.includes('youtube') || name.includes('twitter')) return Globe
  return Layers
}

const formatTimeRange = (startTime: string, endTime?: string) => {
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : new Date()

  const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return `${startStr} – ${endStr}`
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return 'Active'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function TimelineStream() {
  const { getFilteredEntries, categories, linkTaskToTimeEntry, isLoading, error, refreshAllData } = useTimeEntryStore()
  const { tasks } = useTaskStore()
  const shouldReduceMotion = useReducedMotion()

  const entries = getFilteredEntries()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton height={32} width="40%" />
        <LoadingSkeleton height={64} />
        <LoadingSkeleton height={64} />
        <LoadingSkeleton height={64} />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorBanner
        title="Failed to load activity stream"
        message={error}
        onRetry={() => refreshAllData()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
            Activity Log Stream
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Chronological session history ({entries.length} logged sessions)
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-surface-hover)] border border-[var(--border)] px-3 py-1 rounded-xl">
          Live Sync Active
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-12 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            <Clock className="size-8 mx-auto text-[var(--text-muted)] mb-3" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">No matching window activity logs</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Try adjusting your search query or category filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[var(--border)]">
          {entries.map((entry, index) => {
            const isIdle = entry.endReason === 'idle'
            const cat = categories[entry.appName] || 'neutral'
            const AppIcon = getAppIcon(entry.appName)
            const linkedTask = tasks.find((t) => t.id === entry.linkedTaskId)

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.4),
                }}
                className="relative group"
              >
                {/* Timeline Dot with Glow Ring */}
                <div
                  className={`absolute -left-[1.95rem] sm:-left-[2.15rem] top-6 size-4 rounded-full ring-4 ring-[var(--bg-base)] transition-transform group-hover:scale-125 ${
                    isIdle
                      ? 'bg-stone-400'
                      : cat === 'work'
                      ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : cat === 'distraction'
                      ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  }`}
                />

                {/* Doppelrand Double-Bezel Stream Card */}
                <div className="p-1.5 rounded-[2rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 group-hover:ring-stone-900/15 dark:group-hover:ring-white/20 transition-all">
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:scale-[1.005] active:scale-[0.995] transition-transform">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Nested App Icon Core */}
                      <div className="p-3 rounded-2xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] ring-1 ring-stone-900/5 dark:ring-white/10 shrink-0 group-hover:text-[var(--accent)] transition-colors">
                        {isIdle ? <Moon className="size-5 text-stone-400" /> : <AppIcon className="size-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          <span className="font-display font-bold text-base text-[var(--text-primary)]">
                            {entry.appName}
                          </span>

                          {isIdle ? (
                            <span className="text-xs px-3 py-0.5 rounded-full bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-500/20 font-medium">
                              System Idle / Locked
                            </span>
                          ) : (
                            <span
                              className={`text-xs px-3 py-0.5 rounded-full border font-medium capitalize ${
                                cat === 'work'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : cat === 'distraction'
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {cat === 'work' ? 'Deep Work' : cat}
                            </span>
                          )}

                          {/* Button-in-Button Task Link Badge */}
                          {linkedTask ? (
                            <span className="inline-flex items-center gap-1.5 text-xs pl-3 pr-1.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-semibold border border-[var(--accent)]/30">
                              <span>Task: {linkedTask.title}</span>
                              <div className="size-4 rounded-full bg-[var(--accent)] text-[var(--bg-surface)] flex items-center justify-center">
                                <CheckCircle2 className="size-3" />
                              </div>
                            </span>
                          ) : (
                            <select
                              value=""
                              onChange={(e) => linkTaskToTimeEntry(entry.id, e.target.value || undefined)}
                              className="text-xs bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] rounded-xl px-2.5 py-1 transition-colors cursor-pointer outline-none"
                            >
                              <option value="" disabled>
                                + Link Kanban Task
                              </option>
                              {tasks.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.title}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] font-mono truncate max-w-xl">
                          {entry.windowTitle}
                        </p>
                      </div>
                    </div>

                    {/* Duration & Timestamp */}
                    <div className="flex md:flex-col items-center md:items-end justify-between text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border)]">
                      <span className="font-mono text-base font-extrabold text-[var(--text-primary)]">
                        {formatDuration(entry.durationSeconds)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-mono font-medium">
                        {formatTimeRange(entry.startTime, entry.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
