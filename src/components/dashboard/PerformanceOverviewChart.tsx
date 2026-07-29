'use client'

import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
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
  const data = useMemo(() => {
    const dates: { date: string; displayDate: string; hours: number }[] = []
    const now = new Date()
    const daysToGenerate = range === 'week' ? 7 : 14

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const displayDate = d.toLocaleDateString('default', { day: 'numeric', month: 'short' })

      // Aggregate focus hours for this date
      const entriesForDay = entries.filter((e: TimeEntry) => e.startTime.startsWith(dateStr))
      const totalSecs = entriesForDay.reduce((acc: number, e: TimeEntry) => acc + (e.durationSeconds || 0), 0)
      const hours = Number((totalSecs / 3600).toFixed(1))

      dates.push({
        date: dateStr,
        displayDate,
        hours,
      })
    }
    return dates
  }, [entries, range])

  return (
    <BaseCard
      elevation="raised"
      className="h-full justify-between card-hover-lift"
      innerClassName="flex flex-col gap-4 p-5 sm:p-6 h-full justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl icon-bg-sky">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
              Performance Overview
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Daily focus hours trend
            </p>
          </div>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as any)}
          className="text-xs font-semibold border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)] px-2.5 py-1 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
        >
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      {/* Recharts Curved Area Chart */}
      <div className="w-full h-44 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-violet)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--accent-violet)" stopOpacity={0.0} />
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
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-2.5 shadow-md text-xs">
                      <div className="font-semibold text-[var(--text-primary)]">{item.displayDate}</div>
                      <div className="font-mono text-[var(--accent-violet)] font-bold">
                        {item.hours} hrs focus
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
              stroke="var(--accent-violet)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#performanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BaseCard>
  )
}
