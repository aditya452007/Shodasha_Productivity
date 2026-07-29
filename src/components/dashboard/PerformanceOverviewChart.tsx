'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, Sparkles, BarChart2 } from 'lucide-react'
import { BaseCard } from '@/components/ui/BaseCard'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useTimeEntryStore, TimeEntry } from '@/stores/timeEntryStore'

export function PerformanceOverviewChart() {
  const [range, setRange] = useState<'month' | 'week'>('month')
  const entries = useTimeEntryStore((s) => s.entries)

  // Generate chart data bucketed by day for the current month
  const { data, avgHours, maxHours } = useMemo(() => {
    const dates: { date: string; displayDate: string; hours: number }[] = []
    const now = new Date()
    const daysToGenerate = range === 'week' ? 7 : 14

    let totalHours = 0
    let peak = 0

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const displayDate = d.toLocaleDateString('default', { day: 'numeric', month: 'short' })

      // Aggregate focus hours for this date
      const entriesForDay = entries.filter((e: TimeEntry) => e.startTime.startsWith(dateStr))
      const totalSecs = entriesForDay.reduce((acc: number, e: TimeEntry) => acc + (e.durationSeconds || 0), 0)
      const hours = Number((totalSecs / 3600).toFixed(1))

      totalHours += hours
      if (hours > peak) peak = hours

      dates.push({
        date: dateStr,
        displayDate,
        hours,
      })
    }

    const avg = dates.length > 0 ? Number((totalHours / dates.length).toFixed(1)) : 0
    return { data: dates, avgHours: avg, maxHours: peak }
  }, [entries, range])

  return (
    <BaseCard
      elevation="raised"
      className="h-full justify-between card-hover-lift card-color-violet rounded-3xl"
      innerClassName="flex flex-col gap-4 p-5 sm:p-6 h-full justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30">
            <TrendingUp className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              Performance Trend
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Avg {avgHours}h/day
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Daily focus & activity overview
            </p>
          </div>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as any)}
          className="text-xs font-semibold border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--text-primary)] outline-none focus:border-violet-500 shadow-2xs"
        >
          <option value="month">14 Days</option>
          <option value="week">7 Days</option>
        </select>
      </div>

      {/* Recharts Curved Area Chart */}
      <div className="w-full h-44 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload
                  return (
                    <div className="rounded-2xl border border-violet-500/30 bg-[var(--bg-surface-elevated)] p-3 shadow-lg text-xs flex flex-col gap-1">
                      <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                        {item.displayDate}
                      </div>
                      <div className="font-mono text-violet-600 dark:text-violet-400 font-bold text-sm">
                        {item.hours} hrs active
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#performanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics Callout */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3 font-medium">
        <span className="flex items-center gap-1">
          <BarChart2 className="w-3.5 h-3.5 text-violet-500" />
          Peak: <strong className="text-[var(--text-primary)] font-bold">{maxHours}h</strong>
        </span>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          Updated live from desktop tracker
        </span>
      </div>
    </BaseCard>
  )
}

