'use client'

import React from 'react'
import {
  Clock,
  ShieldCheck,
  Zap,
  Laptop,
  TrendingUp,
  BarChart3,
  PieChartIcon,
  Moon,
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
        eyebrow="SYSTEM ON-TIME"
        title="Computer On Time Today"
        value={formatDuration(kpis.computerOnTimeSeconds)}
        trend="Power Active"
        trendType="positive"
        icon={Clock}
        subtitle="Total system active session"
      />
      <KPICard
        eyebrow="FOCUS LOGS"
        title="Active Screen Time"
        value={formatDuration(kpis.activeFocusSeconds)}
        trend={`${kpis.focusEfficiency}% Active`}
        trendType="positive"
        icon={Zap}
        subtitle="Active window foreground time"
      />
      <KPICard
        eyebrow="IDLE / LOCKED"
        title="Lock Screen & Sleep"
        value={formatDuration(kpis.idleTimeSeconds)}
        trend="Excluded"
        trendType="neutral"
        icon={Moon}
        subtitle="Excluded from focus duration"
      />
      <KPICard
        eyebrow="MOST USED APP"
        title="Top Application"
        value={kpis.topAppName}
        trend={formatDuration(kpis.topAppDurationSeconds)}
        trendType="positive"
        icon={Laptop}
        subtitle="Primary workflow application"
      />
    </div>
  )
}

export function CumulativeScreenTimeWidget() {
  const { getCumulativeScreenTimeFiltered } = useTimeEntryStore()
  const points = getCumulativeScreenTimeFiltered()

  const chartData = points.map((p) => ({
    label: p.timestamp,
    value: p.cumulativeFocusMins,
    value2: p.cumulativeTotalMins,
  }))

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-6 sm:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/20">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Cumulative Screen Time Growth
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Continuous monotonic accumulation of active computer hours throughout the day
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-surface-hover)] border border-[var(--border)] px-3 py-1 rounded-xl w-max">
            Monotonic Trajectory
          </span>
        </div>

        <LineChart
          data={chartData}
          height={210}
          series1Label="Cumulative Active Focus Time"
          series2Label="Total System On-Time (inc. Idle)"
          series1Color="#059669"
          series2Color="#a8a29e"
        />
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
    formattedDuration: formatDuration(a.totalSeconds),
    sessionsCount: a.sessionsCount,
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
                Category Time Distribution
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Proportion of Deep Work vs. General Tools & Distraction</p>
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
                Most Used Applications
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">Ranking executables by logged active duration</p>
            </div>
          </div>

          <BarChart items={appBars} />
        </div>
      </div>
    </div>
  )
}
