'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Globe,
  Terminal,
  Moon,
  CheckCircle2,
  Tag,
  Clock,
  Layers,
  LucideIcon,
} from 'lucide-react'
import { useTimeEntryStore, TimeEntry } from '@/stores/timeEntryStore'
import { useTaskStore } from '@/stores/taskStore'

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
  const { getFilteredEntries, categories, linkTaskToTimeEntry } = useTimeEntryStore()
  const { tasks } = useTaskStore()

  const entries = getFilteredEntries()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
          Activity Log ({entries.length} Sessions)
        </h3>
        <span className="text-xs text-[var(--text-secondary)]">Chronological Feed</span>
      </div>

      {entries.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-12 text-center">
          <Clock className="size-8 mx-auto text-[var(--text-muted)] mb-3" />
          <p className="text-sm font-medium text-[var(--text-primary)]">No activity logs found</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Try adjusting your search query or category filters.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[var(--border)]">
          {entries.map((entry, index) => {
            const isIdle = entry.endReason === 'idle'
            const cat = categories[entry.appName] || 'neutral'
            const AppIcon = getAppIcon(entry.appName)
            const linkedTask = tasks.find((t) => t.id === entry.linkedTaskId)

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3, delay: index * 0.04 }}
                className="relative group"
              >
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[1.875rem] top-5 size-3.5 rounded-full ring-4 ring-[var(--bg-base)] transition-transform group-hover:scale-125 ${
                    isIdle
                      ? 'bg-stone-400'
                      : cat === 'work'
                      ? 'bg-emerald-500'
                      : cat === 'distraction'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                />

                {/* Stream Item Card */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-5 hover:border-[var(--border-strong)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] shrink-0">
                      {isIdle ? <Moon className="size-5 text-stone-400" /> : <AppIcon className="size-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-display font-semibold text-base text-[var(--text-primary)]">
                          {entry.appName}
                        </span>

                        {isIdle ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-500/10 text-stone-600 dark:text-stone-400 border border-stone-500/20 font-medium">
                            System Idle / Locked
                          </span>
                        ) : (
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${
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

                        {/* Linked Task Badge / Selector */}
                        {linkedTask ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-medium border border-[var(--accent)]/20">
                            <CheckCircle2 className="size-3" />
                            Task: {linkedTask.title}
                          </span>
                        ) : (
                          <select
                            value=""
                            onChange={(e) => linkTaskToTimeEntry(entry.id, e.target.value || undefined)}
                            className="text-[11px] bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-transparent hover:border-[var(--border)] rounded-lg px-2 py-0.5 transition-colors cursor-pointer"
                          >
                            <option value="" disabled>
                              + Link Task
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
                  <div className="flex md:flex-col items-center md:items-end justify-between text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-[var(--border)]">
                    <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                      {formatDuration(entry.durationSeconds)}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      {formatTimeRange(entry.startTime, entry.endTime)}
                    </span>
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
