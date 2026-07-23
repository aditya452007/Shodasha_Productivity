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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visual Proportion & Metrics Card (2 cols) */}
      <div className="lg:col-span-2 p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
        <div className="h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/20">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                    Time Distribution Analytics
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">Proportional time allocation breakdown</p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-secondary)] font-mono bg-[var(--bg-surface-hover)] border border-[var(--border)] px-3 py-1 rounded-xl">
                Total: {formatDuration(totalFocusSeconds)}
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-5 w-full bg-[var(--bg-surface-hover)] rounded-full overflow-hidden flex p-1 gap-1 border border-[var(--border)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${workCat?.percentage || 0}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                className="h-full bg-emerald-500 rounded-l-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                title={`Deep Work: ${workCat?.percentage || 0}%`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${neutralCat?.percentage || 0}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: 0.1 }}
                className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                title={`Tools & General: ${neutralCat?.percentage || 0}%`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distractionCat?.percentage || 0}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: 0.2 }}
                className="h-full bg-red-500 rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                title={`Distraction: ${distractionCat?.percentage || 0}%`}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                <span className="text-[var(--text-secondary)] font-medium">Deep Work:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {workCat?.percentage || 0}% ({formatDuration(workCat?.seconds || 0)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                <span className="text-[var(--text-secondary)] font-medium">Tools:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {neutralCat?.percentage || 0}% ({formatDuration(neutralCat?.seconds || 0)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500 ring-4 ring-red-500/20" />
                <span className="text-[var(--text-secondary)] font-medium">Distraction:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {distractionCat?.percentage || 0}% ({formatDuration(distractionCat?.seconds || 0)})
                </span>
              </div>
            </div>
          </div>

          {/* 3 Metric Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface-hover)] border border-[var(--border)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1.5">
                <Clock className="size-4" />
                <span className="text-xs font-semibold">Active Focus</span>
              </div>
              <span className="font-mono font-extrabold text-xl text-[var(--text-primary)]">
                {formatDuration(totalFocusSeconds)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface-hover)] border border-[var(--border)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold">Deep Work Ratio</span>
              </div>
              <span className="font-mono font-extrabold text-xl text-emerald-600 dark:text-emerald-400">
                {deepWorkPct}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface-hover)] border border-[var(--border)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1.5">
                <Laptop className="size-4" />
                <span className="text-xs font-semibold">Top Application</span>
              </div>
              <span className="font-mono font-bold text-sm text-[var(--text-primary)] truncate block">
                {topApp ? topApp.appName : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Applications Breakdown (1 col) */}
      <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
        <div className="h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">
              Top Applications
            </h3>

            <div className="space-y-4">
              {topApps.slice(0, 4).map((app) => (
                <div key={app.appName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`size-2.5 rounded-full ${
                          app.category === 'work'
                            ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                            : app.category === 'distraction'
                            ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                            : 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                        }`}
                      />
                      <span className="font-semibold text-[var(--text-primary)] truncate">
                        {app.appName}
                      </span>
                    </div>
                    <span className="font-mono text-[var(--text-secondary)] font-medium">
                      {formatDuration(app.totalSeconds)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-surface-hover)] rounded-full overflow-hidden p-0.5 border border-[var(--border)]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
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

          <p className="text-[11px] text-[var(--text-muted)] mt-4 pt-3 border-t border-[var(--border)]">
            Classified via user settings in <span className="font-semibold text-[var(--text-secondary)]">/settings</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
