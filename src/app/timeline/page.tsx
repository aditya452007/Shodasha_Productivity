'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Move } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { CategoryFilterBar } from '@/components/timeline/CategoryFilterBar'
import {
  AnalyticsKPIGrid,
  HourlyTrendWidget,
  DistributionChartsWidget,
} from '@/components/timeline/ActivityDistributionChart'
import { TimelineStream } from '@/components/timeline/TimelineStream'
import { DraggableGrid, DraggableItem } from '@/components/ui/DraggableGrid'

export default function TimelinePage() {
  const { widgetOrder, setWidgetOrder } = useTimeEntryStore()

  const availableWidgets: DraggableItem[] = [
    {
      id: 'kpi-grid',
      content: <AnalyticsKPIGrid />,
    },
    {
      id: 'hourly-line-chart',
      content: <HourlyTrendWidget />,
    },
    {
      id: 'category-ring-chart',
      content: <DistributionChartsWidget />,
    },
    {
      id: 'activity-stream',
      content: <TimelineStream />,
    },
  ]

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
            <span>Windows Activity Analytics • Customizable Drag & Drop Dashboard</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Activity Timeline & Analytics
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Modular analytics suite with line trends, donut ratios, app bar graphs, and draggable widget customization.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[var(--bg-surface-hover)] border border-[var(--border)] text-xs text-[var(--text-secondary)] font-medium">
          <Move className="size-3.5 text-[var(--accent)]" />
          <span>Hover section & drag handles to reorder</span>
        </div>
      </div>

      {/* Floating Glass Filter & Control Bar */}
      <CategoryFilterBar />

      {/* Interactive Draggable Layout Grid */}
      <DraggableGrid
        items={availableWidgets}
        itemIds={widgetOrder}
        onReorder={setWidgetOrder}
      />
    </motion.div>
  )
}
