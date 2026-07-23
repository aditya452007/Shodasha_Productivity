'use client'

import React from 'react'
import {
  Clock,
  ShieldCheck,
  Zap,
  Repeat,
  Sparkles,
  TrendingUp,
  BarChart3,
  PieChartIcon,
} from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { KPICard } from '@/components/ui/charts/KPICard'
import { LineChart } from '@/components/ui/charts/LineChart'
import { RingChart } from '@/components/ui/charts/RingChart'
import { BarChart } from '@/components/ui/charts/BarChart'

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function AnalyticsKPIGrid() {
  const { getKPIsFiltered } = useTimeEntryStore()
  const kpis = getKPIsFiltered()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        eyebrow="PRODUCTIVITY"
        title="Focus Efficiency"
        value={`${kpis.focusEfficiency}%`}
        trend="+4.2%"
        trendType="positive"
        icon={Zap}
        subtitle="Active vs idle ratio"
      />
      <KPICard
        eyebrow="DURATION"
        title="Active Focus Time"
        value={formatDuration(kpis.totalFocusSeconds)}
        trend="On Track"
        trendType="positive"
        icon={Clock}
        subtitle="Tracked window duration"
      />
      <KPICard
        eyebrow="QUALITY"
        title="Deep Work Ratio"
        value={`${kpis.deepWorkRatio}%`}
        trend="+8%"
        trendType="positive"
        icon={ShieldCheck}
        subtitle="Target: 60%+ Deep Work"
      />
      <KPICard
        eyebrow="WORKFLOW"
        title="Context Switches"
        value={`${kpis.contextSwitches} Logs`}
        trend="Optimal"
        trendType="neutral"
        icon={Repeat}
        subtitle="Window switch count"
      />
    </div>
  )
}

export function HourlyTrendWidget() {
  const { getHourlyTrendFiltered } = useTimeEntryStore()
  const trendData = getHourlyTrendFiltered()

  const chartPoints = trendData.map((d) => ({
    label: d.hour,
    value: d.focusMinutes,
    value2: d.idleMinutes,
  }))

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/20">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Hourly Focus & Idle Velocity
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">24-hour interval activity trend line</p>
            </div>
          </div>
        </div>

        <LineChart data={chartPoints} height={190} />
      </div>
    </div>
  )
}

export function DistributionChartsWidget() {
  const { getCategoryBreakdownFiltered, getTopAppsFiltered } = useTimeEntryStore()

  const categories = getCategoryBreakdownFiltered()
  const topApps = getTopAppsFiltered()

  const categorySlices = categories.map((c) => ({
    label: c.label,
    percentage: c.percentage,
    color:
      c.category === 'work'
        ? '#059669'
        : c.category === 'distraction'
        ? '#dc2626'
        : '#d97706',
    seconds: c.seconds,
  }))

  const workCat = categories.find((c) => c.category === 'work')
  const deepWorkPct = workCat ? `${workCat.percentage}%` : '0%'

  const appBars = topApps.slice(0, 4).map((a) => ({
    label: a.appName,
    value: a.totalSeconds,
    percentage: a.percentage,
    color:
      a.category === 'work'
        ? '#059669'
        : a.category === 'distraction'
        ? '#dc2626'
        : '#d97706',
    sublabel: formatDuration(a.totalSeconds),
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Ring Chart */}
      <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
        <div className="h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
              <PieChartIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Category Breakdown
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Deep Work vs. General & Distraction ratio</p>
            </div>
          </div>

          <RingChart slices={categorySlices} centerValue={deepWorkPct} centerLabel="Deep Work" />
        </div>
      </div>

      {/* Top Applications Bar Chart */}
      <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
        <div className="h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Top Applications Share
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Most used executables & time allocation</p>
            </div>
          </div>

          <BarChart items={appBars} />
        </div>
      </div>
    </div>
  )
}
