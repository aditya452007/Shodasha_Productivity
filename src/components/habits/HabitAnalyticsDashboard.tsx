'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Target,
  BarChart3,
  GripVertical,
  Link as LinkIcon,
  Info,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useHabitStore } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'

// Sortable Wrapper Component for Analytics Widgets
function SortableWidgetCard({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs relative transition-shadow ${
        isDragging ? 'shadow-2xl ring-2 ring-[var(--accent-emerald)] opacity-95' : ''
      }`}
    >
      {/* Drag Handle Grip in Header */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] cursor-grab active:cursor-grabbing transition-colors"
        title="Drag to reorder chart widget"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      {children}
    </div>
  )
}

export function HabitAnalyticsDashboard() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const tasks = useTaskStore((s) => s.tasks)

  const [widgetOrder, setWidgetOrder] = useState(['widget-line', 'widget-[rings]', 'widget-bar'])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Hover state for Line Chart Data Point Tooltip (Cursor Following)
  const [hoveredPoint, setHoveredPoint] = useState<{
    dateStr: string
    label: string
    count: number
    percentage: number
    x: number
    y: number
  } | null>(null)

  // 1. Calculate 14-Day Completion Line Trend Data with explicit coordinates
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

  // Chart Dimensions & Axis Margin Offsets
  const paddingLeft = 45
  const paddingBottom = 30
  const paddingTop = 20
  const paddingRight = 20
  const chartWidth = 560
  const chartHeight = 200

  const innerWidth = chartWidth - paddingLeft - paddingRight
  const innerHeight = chartHeight - paddingTop - paddingBottom

  const maxVal = Math.max(habits.length, 1)

  // Calculate points with X & Y pixel positions relative to SVG viewport
  const points = useMemo(() => {
    if (trendData.length === 0) return []
    return trendData.map((d, idx) => {
      const x = paddingLeft + (idx / (trendData.length - 1)) * innerWidth
      const y = paddingTop + innerHeight - (d.count / maxVal) * innerHeight
      return { ...d, x, y }
    })
  }, [trendData, maxVal, innerWidth, innerHeight, paddingLeft, paddingTop])

  // SVG Line & Area Path strings
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
    return `${linePathD} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
  }, [linePathD, points, chartHeight, paddingBottom])

  // 2. Day-of-Week Frequency Distribution Data (Bar Chart)
  const dayOfWeekDistribution = useMemo(() => {
    const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = [0, 0, 0, 0, 0, 0, 0]
    const today = new Date()

    for (let i = 0; i < 90; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayIdx = d.getDay()

      habits.forEach((h) => {
        if (records[`${h.id}_${dateStr}`]) {
          counts[dayIdx]++
        }
      })
    }

    const maxDayCount = Math.max(...counts, 1)
    return daysName.map((name, idx) => ({
      day: name,
      count: counts[idx],
      heightPercentage: Math.round((counts[idx] / maxDayCount) * 100),
    }))
  }, [habits, records])

  // Widget Render Maps
  const renderWidget = (id: string) => {
    if (id === 'widget-line') {
      return (
        <SortableWidgetCard key={id} id={id}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                  14-Day Trajectory Trend
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Daily check-in volume curve with defined X & Y axes
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[var(--accent-emerald)] text-[11px] font-semibold border border-emerald-500/20 mr-7">
              Live Curve
            </span>
          </div>

          {/* Line Chart SVG with Defined Axes */}
          <div className="relative mt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 overflow-visible"
            >
              <defs>
                <linearGradient id="emeraldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-emerald)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent-emerald)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Gridlines and Ticks (0, 50%, 100%) */}
              {[0, 0.5, 1].map((ratio, idx) => {
                const yPos = paddingTop + innerHeight * (1 - ratio)
                const valLabel = Math.round(maxVal * ratio)
                return (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={chartWidth - paddingRight}
                      y2={yPos}
                      stroke="var(--border-subtle)"
                      strokeDasharray={ratio === 0 ? undefined : '3 3'}
                      opacity={ratio === 0 ? 0.8 : 0.4}
                    />
                    <text
                      x={paddingLeft - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      className="fill-[var(--text-tertiary)] text-[10px] font-semibold font-display"
                    >
                      {valLabel}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Ticks & Labels */}
              {points.map((pt, idx) => {
                if (idx % 2 !== 0 && idx !== points.length - 1) return null
                return (
                  <g key={idx}>
                    <line
                      x1={pt.x}
                      y1={chartHeight - paddingBottom}
                      x2={pt.x}
                      y2={chartHeight - paddingBottom + 4}
                      stroke="var(--border-subtle)"
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - paddingBottom + 16}
                      textAnchor="middle"
                      className="fill-[var(--text-tertiary)] text-[10px] font-medium"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area */}
              <path d={areaPathD} fill="url(#emeraldAreaGradient)" />

              {/* Defined High-Contrast Trend Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                d={linePathD}
                fill="none"
                stroke="var(--accent-emerald)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points with Dynamic Cursor Tooltip Trigger */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-[var(--bg-secondary)] stroke-[var(--accent-emerald)] stroke-[3] hover:r-7 transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Dynamic Floating Tooltip positioned over the hovered point */}
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${(hoveredPoint.y / chartHeight) * 100 - 8}%`,
                }}
              >
                <div className="bg-gray-950 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-gray-800 flex items-center gap-2 whitespace-nowrap">
                  <span className="font-semibold text-emerald-400">{hoveredPoint.label}:</span>
                  <span>{hoveredPoint.count} / {habits.length} done ({hoveredPoint.percentage}%)</span>
                </div>
              </motion.div>
            )}
          </div>
        </SortableWidgetCard>
      )
    }

    if (id === 'widget-[rings]') {
      return (
        <SortableWidgetCard key={id} id={id}>
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

          {/* Habit Ring Cards List */}
          <div className="space-y-3">
            {habits.map((habit) => {
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
        </SortableWidgetCard>
      )
    }

    if (id === 'widget-bar') {
      return (
        <SortableWidgetCard key={id} id={id}>
          <div className="flex items-center gap-2.5 mb-4 border-b border-[var(--border-subtle)] pb-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                Day-of-Week Frequency
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Check-ins by weekday (last 90 days)
              </p>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="flex items-end justify-between h-36 pt-4 gap-2">
            {dayOfWeekDistribution.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full bg-[var(--bg-tertiary)] rounded-t-lg relative h-full flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.heightPercentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full bg-[var(--accent-emerald)] rounded-t-lg group-hover:bg-emerald-500 transition-colors"
                  />
                </div>
                <span className="text-[11px] font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent-emerald)] transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </SortableWidgetCard>
      )
    }

    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] px-1">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
          Drag widget cards using the grip icon in the top right to customize your dashboard layout.
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {widgetOrder.map((id) => renderWidget(id))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
