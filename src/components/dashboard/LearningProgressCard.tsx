'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PieChart, Filter } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'

export function LearningProgressCard() {
  const shouldReduceMotion = useReducedMotion()
  const [filterRange, setFilterRange] = useState<'today' | 'week'>('today')
  const getKPIsFiltered = useTimeEntryStore((s) => s.getKPIsFiltered)

  const kpis = getKPIsFiltered()
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
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6 shadow-xs h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
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
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#0284c7" />
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
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0" />
              <span className="font-medium text-[var(--text-primary)]">Deep Work</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{deepWorkPct}%</span>
          </div>

          {/* Neutral / Admin */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="font-medium text-[var(--text-primary)]">In Progress / Neutral</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{neutralPct}%</span>
          </div>

          {/* Distraction */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="font-medium text-[var(--text-primary)]">Distraction</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">{distractionPct}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
