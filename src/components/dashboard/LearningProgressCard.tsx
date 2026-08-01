'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PieChart, Timer, GitCommitHorizontal, MonitorUp } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { BaseCard } from '@/components/ui/BaseCard'

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function LearningProgressCard() {
  const shouldReduceMotion = useReducedMotion()
  const [filterRange, setFilterRange] = useState<'today' | 'week'>('today')
  const kpis = useTimeEntryStore((s) => s.filteredKPIs)
  const focusScore = kpis.focusScore || 72

  // Category percentages
  const deepWorkPct = Math.round(kpis.deepWorkRatio * 100) || 72
  const neutralPct = Math.round((1 - kpis.deepWorkRatio - kpis.distractionRatio) * 100) || 20
  const distractionPct = Math.max(0, 100 - deepWorkPct - neutralPct) || 8

  // Donut SVG constants
  const strokeWidth = 14
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (focusScore / 100) * circumference

  return (
    <BaseCard
      elevation="raised"
      className="h-full justify-between card-hover-lift"
      innerClassName="flex flex-col gap-4 p-5 sm:p-6 h-full justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl icon-bg-violet">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
              Focus & Time Distribution
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Ratio of productive work vs distraction
            </p>
          </div>
        </div>

        <select
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value as any)}
          className="text-xs font-semibold border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)] px-2.5 py-1 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {/* Donut Gauge & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Donut Chart */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-[var(--bg-tertiary)]"
              fill="transparent"
            />
            {/* Progress Arc */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#donutGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-violet)" />
                <stop offset="100%" stopColor="var(--accent-blue)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Inner Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {focusScore}%
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-tertiary)]">
              Overall Focus
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          {/* Deep Work */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full dot-violet shrink-0" />
              <span className="font-medium text-[var(--text-primary)]">Deep Work</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{deepWorkPct}%</span>
          </div>

          {/* Neutral / Admin */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full dot-amber shrink-0" />
              <span className="font-medium text-[var(--text-primary)]">In Progress / Neutral</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{neutralPct}%</span>
          </div>

          {/* Distraction */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full dot-rose shrink-0" />
              <span className="font-medium text-[var(--text-primary)]">Distraction</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{distractionPct}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[var(--accent-violet)]/10 text-[var(--accent-violet)] shrink-0">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] truncate">
              Active Focus
            </p>
            <p className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
              {formatDuration(kpis.activeFocusSeconds)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] shrink-0">
            <GitCommitHorizontal className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] truncate">
              Switches
            </p>
            <p className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
              {kpis.contextSwitches ?? 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] shrink-0">
            <MonitorUp className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] truncate">
              Top App
            </p>
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">
              {kpis.topAppName || '—'}
            </p>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
