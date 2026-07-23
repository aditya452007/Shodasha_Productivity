'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { CategoryFilterBar } from '@/components/timeline/CategoryFilterBar'
import { ActivityDistributionChart } from '@/components/timeline/ActivityDistributionChart'
import { TimelineStream } from '@/components/timeline/TimelineStream'

export default function TimelinePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="size-6 text-[var(--accent)]" />
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Activity Timeline & Analytics
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Review passive Windows activity tracking logs, Deep Work ratios, and task attribution.
          </p>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <CategoryFilterBar />

      {/* Analytics Chart */}
      <ActivityDistributionChart />

      {/* Chronological Activity Feed */}
      <TimelineStream />
    </motion.div>
  )
}
