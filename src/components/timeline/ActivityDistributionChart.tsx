'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, ShieldCheck, Laptop, TrendingUp } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function ActivityDistributionChart() {
  const { getCategoryBreakdownFiltered, getTopAppsFiltered, getFilteredFocusSeconds } =
    useTimeEntryStore()

  const categories = getCategoryBreakdownFiltered()
  const topApps = getTopAppsFiltered()
  const totalFocusSeconds = getFilteredFocusSeconds()

  const workCat = categories.find((c) => c.category === 'work')
  const neutralCat = categories.find((c) => c.category === 'neutral')
  const distractionCat = categories.find((c) => c.category === 'distraction')

  const deepWorkPct = workCat?.percentage || 0
  const topApp = topApps[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Visual Proportion & Metrics Card (2 cols) */}
      <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-6 flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-[var(--accent)]" />
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Time Distribution Analytics
              </h3>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-mono">
              Total: {formatDuration(totalFocusSeconds)}
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-4 w-full bg-[var(--bg-surface-hover)] rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-[var(--border)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${workCat?.percentage || 0}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              className="h-full bg-emerald-500 rounded-l-full"
              title={`Deep Work: ${workCat?.percentage || 0}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${neutralCat?.percentage || 0}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: 0.1 }}
              className="h-full bg-amber-500"
              title={`Tools & General: ${neutralCat?.percentage || 0}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${distractionCat?.percentage || 0}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: 0.2 }}
              className="h-full bg-red-500 rounded-r-full"
              title={`Distraction: ${distractionCat?.percentage || 0}%`}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-[var(--text-secondary)]">Deep Work:</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {workCat?.percentage || 0}% ({formatDuration(workCat?.seconds || 0)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="text-[var(--text-secondary)]">Tools:</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {neutralCat?.percentage || 0}% ({formatDuration(neutralCat?.seconds || 0)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-500" />
              <span className="text-[var(--text-secondary)]">Distraction:</span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {distractionCat?.percentage || 0}% ({formatDuration(distractionCat?.seconds || 0)})
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1">
              <Clock className="size-3.5" />
              <span className="text-xs font-medium">Focus Time</span>
            </div>
            <span className="font-mono font-bold text-lg text-[var(--text-primary)]">
              {formatDuration(totalFocusSeconds)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span className="text-xs font-medium">Deep Work Ratio</span>
            </div>
            <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
              {deepWorkPct}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1">
              <Laptop className="size-3.5" />
              <span className="text-xs font-medium">Top App</span>
            </div>
            <span className="font-mono font-bold text-sm text-[var(--text-primary)] truncate block">
              {topApp ? topApp.appName : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Applications Breakdown (1 col) */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] mb-4">
            Top Applications
          </h3>

          <div className="space-y-3.5">
            {topApps.slice(0, 4).map((app) => (
              <div key={app.appName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`size-2 rounded-full ${
                        app.category === 'work'
                          ? 'bg-emerald-500'
                          : app.category === 'distraction'
                          ? 'bg-red-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="font-medium text-[var(--text-primary)] truncate">
                      {app.appName}
                    </span>
                  </div>
                  <span className="font-mono text-[var(--text-secondary)]">
                    {formatDuration(app.totalSeconds)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-surface-hover)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      app.category === 'work'
                        ? 'bg-emerald-500'
                        : app.category === 'distraction'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${app.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {topApps.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] italic">No matching applications found.</p>
            )}
          </div>
        </div>

        <p className="text-[10px] text-[var(--text-muted)] mt-4">
          Categorized automatically based on app settings.
        </p>
      </div>
    </div>
  )
}
