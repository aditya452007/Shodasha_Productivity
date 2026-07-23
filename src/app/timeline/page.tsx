'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Sparkles } from 'lucide-react'
import { CategoryFilterBar } from '@/components/timeline/CategoryFilterBar'
import { ActivityDistributionChart } from '@/components/timeline/ActivityDistributionChart'
import { TimelineStream } from '@/components/timeline/TimelineStream'

export default function TimelinePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="space-y-8 max-w-7xl mx-auto pb-16 px-2 sm:px-4"
    >
      {/* Header with Eyebrow Tag & Macro-Whitespace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Eyebrow Micro Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20 mb-2">
            <Sparkles className="size-3" />
            <span>Windows Activity Analytics • Realtime Session Logs</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Activity Timeline
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Passive Windows foreground window polling, Deep Work ratios, app categories, and Kanban task attribution.
          </p>
        </div>
      </div>

      {/* Floating Glass Filter & Control Bar */}
      <CategoryFilterBar />

      {/* Time Distribution Analytics Chart */}
      <ActivityDistributionChart />

      {/* Chronological Activity Feed Stream */}
      <TimelineStream />
    </motion.div>
  )
}
