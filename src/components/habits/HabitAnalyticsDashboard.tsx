'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Award, Link as LinkIcon } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'

export function HabitAnalyticsDashboard() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const tasks = useTaskStore((s) => s.tasks)

  const [hoveredTrendDay, setHoveredTrendDay] = useState<{
    dateStr: string
    label: string
    count: number
    percentage: number
    x: number
    y: number
  } | null>(null)

  // Calculate 14-Day Completion Trend Data
  const trendData = useMemo(() => {
    const today = new Date()
    const days: { dateStr: string; label: string; count: number; percentage: number }[] = []

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      let count = 0
      habits.forEach((h) => {
        if (records[`${h.id}_${dateStr}`]) count++
      })

      const percentage = habits.length > 0 ? Math.round((count / habits.length) * 100) : 0
      days.push({ dateStr, label, count, percentage })
    }

    return days
  }, [habits, records])

  // SVG Line Chart coordinates calculation
  const chartHeight = 130
  const chartWidth = 500

  const points = useMemo(() => {
    if (trendData.length === 0) return []
    const maxVal = Math.max(habits.length, 1)

    return trendData.map((d, idx) => {
      const x = (idx / (trendData.length - 1)) * chartWidth
      const y = chartHeight - (d.count / maxVal) * (chartHeight - 30) - 15
      return { ...d, x, y }
    })
  }, [trendData, habits.length])

  // Generate SVG path d string
  const linePathD = useMemo(() => {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cp1X = prev.x + (curr.x - prev.x) / 2
      const cp1Y = prev.y
      const cp2X = prev.x + (curr.x - prev.x) / 2
      const cp2Y = curr.y
      d += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${curr.x} ${curr.y}`
    }
    return d
  }, [points])

  const areaPathD = useMemo(() => {
    if (!linePathD || points.length === 0) return ''
    return `${linePathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
  }, [linePathD, points])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 14-Day Completion Line Chart Card */}
      <div className="lg:col-span-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                  14-Day Consistency Trend
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Daily habit completion trajectory & momentum curve
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[var(--accent-emerald)] text-xs font-semibold border border-emerald-500/20">
              Live Trend
            </span>
          </div>
        </div>

        {/* SVG Line Chart Container */}
        <div className="relative mt-4 pt-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-36 overflow-visible"
          >
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-emerald)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--accent-emerald)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="var(--border-subtle)" strokeDasharray="3 3" opacity="0.5" />
            <line x1="0" y1="70" x2={chartWidth} y2="70" stroke="var(--border-subtle)" strokeDasharray="3 3" opacity="0.5" />
            <line x1="0" y1="120" x2={chartWidth} y2="120" stroke="var(--border-subtle)" opacity="0.5" />

            {/* Area Fill */}
            <path d={areaPathD} fill="url(#emeraldGradient)" />

            {/* Smooth Line Path */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              d={linePathD}
              fill="none"
              stroke="var(--accent-emerald)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {points.map((pt, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-[var(--bg-secondary)] stroke-[var(--accent-emerald)] stroke-[2.5] hover:r-7 transition-all"
                  onMouseEnter={() => setHoveredTrendDay(pt)}
                  onMouseLeave={() => setHoveredTrendDay(null)}
                />
              </g>
            ))}
          </svg>

          {/* Floating Hover Tooltip */}
          {hoveredTrendDay && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20">
              <div className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-gray-800 flex items-center gap-2">
                <span className="font-semibold text-emerald-400">{hoveredTrendDay.label}:</span>
                <span>{hoveredTrendDay.count} / {habits.length} done ({hoveredTrendDay.percentage}%)</span>
              </div>
            </div>
          )}

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-2">
            {points.filter((_, i) => i % 2 === 0).map((pt, idx) => (
              <span key={idx}>{pt.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Habit Circular Progress Rings Card */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4 border-b border-[var(--border-subtle)] pb-3">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                Per-Habit Completion
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                30-day performance rings
              </p>
            </div>
          </div>

          {/* Habit Ring Items */}
          <div className="space-y-3.5">
            {habits.map((habit) => {
              // Calculate 30-day completion rate
              const today = new Date()
              let doneCount = 0
              for (let i = 0; i < 30; i++) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)
                const dateStr = d.toISOString().split('T')[0]
                if (records[`${habit.id}_${dateStr}`]) doneCount++
              }

              const rate = Math.round((doneCount / 30) * 100)
              const circumference = 2 * Math.PI * 14
              const strokeDashoffset = circumference - (rate / 100) * circumference
              const linkedTask = tasks.find((t) => t.id === habit.linkedTaskId)

              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-default)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Ring SVG */}
                    <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                      <svg className="w-9 h-9 transform -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          stroke="var(--border-subtle)"
                          strokeWidth="3"
                          fill="transparent"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          stroke={habit.color}
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold font-display text-[var(--text-primary)]">
                        {rate}%
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {habit.name}
                      </div>
                      {linkedTask ? (
                        <div className="text-[10px] text-[var(--text-tertiary)] truncate flex items-center gap-1 mt-0.5">
                          <LinkIcon className="w-3 h-3" /> {linkedTask.title}
                        </div>
                      ) : (
                        <div className="text-[10px] text-[var(--text-tertiary)]">
                          {doneCount} / 30 days completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
