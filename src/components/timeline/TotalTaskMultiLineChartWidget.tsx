'use client'

import { BaseCard } from '@/components/ui/BaseCard'
import { TrendingUp, Layers, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTimeEntryStore } from '@/stores/timeEntryStore'

export function TotalTaskMultiLineChartWidget() {
  const getDailyUsageHours = useTimeEntryStore((s) => s.getDailyUsageHours)
  const filteredKPIs = useTimeEntryStore((s) => s.filteredKPIs)
  const categoryBreakdown = useTimeEntryStore((s) => s.filteredCategoryBreakdown)

  const dailyUsage = getDailyUsageHours(7) // last 7 days

  const chartData = dailyUsage.map((d) => ({
    day: d.dayLabel || d.date.split('-').slice(1).join('/'),
    FocusHours: Math.round((d.totalHours || 0) * 10) / 10,
  }))

  const focusScore = filteredKPIs?.focusScore || 85
  const focusTimeHours = Math.round(((filteredKPIs?.activeFocusSeconds || 0) / 3600) * 10) / 10

  return (
    <BaseCard elevation="raised" className="card-hover-lift h-full" innerClassName="p-5 flex flex-col justify-between">
      <div>
        {/* Header & KPI Summary */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              <span>Daily Focus Analytics</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold font-display text-[var(--text-primary)]">
                {focusTimeHours} Focus Hrs
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Focus Score: {focusScore}/100
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Live daily desktop usage allocation captured by local SQLite window logger.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Daily Focus (Hrs)
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-52 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} unit="h" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-default)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="FocusHours" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFocus)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sub-KPI Metric Bar */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
        {categoryBreakdown.slice(0, 3).map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              item.category === 'work' ? 'bg-emerald-500/10 text-emerald-600' :
              item.category === 'distraction' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'
            }`}>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">{item.label}</span>
              <p className="font-bold text-[var(--text-primary)]">{item.percentage}% ({Math.round(item.seconds / 60)}m)</p>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  )
}
