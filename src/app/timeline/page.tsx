'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Move, Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { CategoryFilterBar } from '@/components/timeline/CategoryFilterBar'
import {
  AnalyticsKPIGrid,
  CumulativeScreenTimeWidget,
  DistributionChartsWidget,
} from '@/components/timeline/ActivityDistributionChart'
import { TimelineStream } from '@/components/timeline/TimelineStream'
import { DraggableGrid, DraggableItem } from '@/components/ui/DraggableGrid'

export default function TimelinePage() {
  const { widgetOrder, setWidgetOrder, selectedDate, setSelectedDate, refreshAllData, isRefreshing } = useTimeEntryStore()

  // Auto-poll every 15 seconds for real-time live activity updates
  useEffect(() => {
    refreshAllData()
    const interval = setInterval(() => {
      refreshAllData()
    }, 15000)
    return () => clearInterval(interval)
  }, [refreshAllData])

  const todayStr = new Date().toISOString().split('T')[0]

  const handlePrevDay = () => {
    const d = new Date(selectedDate || todayStr)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const d = new Date(selectedDate || todayStr)
    d.setDate(d.getDate() + 1)
    const nextStr = d.toISOString().split('T')[0]
    if (nextStr <= todayStr) {
      setSelectedDate(nextStr)
    }
  }

  const handleToday = () => {
    setSelectedDate(todayStr)
  }

  const availableWidgets: DraggableItem[] = [
    {
      id: 'kpi-grid',
      content: <AnalyticsKPIGrid />,
    },
    {
      id: 'cumulative-screentime-chart',
      content: <CumulativeScreenTimeWidget />,
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

  const formattedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="space-y-8 max-w-7xl mx-auto pb-16 px-2 sm:px-4"
    >
      {/* Header with Eyebrow Tag & Macro-Whitespace */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          {/* Eyebrow Micro Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20 mb-2">
            <Sparkles className="size-3" />
            <span>Windows Activity Analytics • Cumulative Screen Time Dashboard</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Activity Timeline & Analytics
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Cumulative screen time accumulation, Computer On-Time KPIs, top application duration bar chart, and draggable layout grid.
          </p>
        </div>

        {/* Date Selector & Manual Refresh Bar */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Quick Date Picker Controls */}
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-xs">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1">
              <CalendarIcon className="size-3.5 text-[var(--accent)]" />
              <span className="text-xs font-bold font-display text-[var(--text-primary)]">
                {selectedDate === todayStr ? 'Today' : formattedDateLabel}
              </span>
              <input
                type="date"
                max={todayStr}
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="w-4 h-4 opacity-0 cursor-pointer absolute"
                title="Pick custom date"
              />
            </div>

            <button
              onClick={handleNextDay}
              disabled={selectedDate >= todayStr}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Day"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {selectedDate !== todayStr && (
            <button
              onClick={handleToday}
              className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all shadow-xs"
            >
              Back to Today
            </button>
          )}

          {/* Refresh Data Button */}
          <button
            onClick={() => refreshAllData()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all shadow-xs active:scale-95 disabled:opacity-50"
            title="Refresh time entries from database"
          >
            <RotateCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-[var(--accent)]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)] text-xs text-[var(--text-secondary)] font-medium">
            <Move className="size-3.5 text-[var(--accent)]" />
            <span>Drag handles reorder</span>
          </div>
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
