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
  Sparkles,
  Zap,
  Flame,
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
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

// Sortable Wrapper Component for Analytics Widgets
function SortableWidgetCard({
  id,
  className = '',
  children,
}: {
  id: string
  className?: string
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
      className={`rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs relative transition-all ${
        isDragging ? 'shadow-2xl ring-2 ring-[var(--accent)] opacity-95 scale-[1.01]' : ''
      } ${className}`}
    >
      {/* Drag Handle Grip in Header */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-5 right-5 p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] cursor-grab active:cursor-grabbing transition-colors"
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
  const isLoading = useHabitStore((s) => s.isLoading)
  const error = useHabitStore((s) => s.error)
  const tasks = useTaskStore((s) => s.tasks)

  const [widgetOrder, setWidgetOrder] = useState(['widget-line', 'widget-rings', 'widget-bar'])

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

  // Tooltip states for individual charts
  const [hoveredLinePoint, setHoveredLinePoint] = useState<{
    dateStr: string
    label: string
    count: number
    percentage: number
    x: number
    y: number
  } | null>(null)

  const [hoveredBarDay, setHoveredBarDay] = useState<{
    day: string
    count: number
    percentage: number
    avgPerWeek: string
  } | null>(null)

  const [hoveredRingHabit, setHoveredRingHabit] = useState<{
    name: string
    rate: number
    doneCount: number
    linkedTaskTitle?: string
  } | null>(null)

  // 1. Calculate 14-Day Trajectory Line Trend Data
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
        const startDate = h.createdAt.split('T')[0]
        if (dateStr >= startDate && records[`${h.id}_${dateStr}`]) count++
      })

      const percentage = habits.length > 0 ? Math.round((count / habits.length) * 100) : 0
      days.push({ dateStr, label, count, percentage })
    }

    return days
  }, [habits, records])

  // Wide Chart Viewport Coordinates
  const chartWidth = 800
  const chartHeight = 220
  const paddingLeft = 45
  const paddingRight = 25
  const paddingTop = 25
  const paddingBottom = 35

  const innerWidth = chartWidth - paddingLeft - paddingRight
  const innerHeight = chartHeight - paddingTop - paddingBottom
  const maxVal = Math.max(habits.length, 1)

  const points = useMemo(() => {
    if (trendData.length === 0) return []
    return trendData.map((d, idx) => {
      const x = paddingLeft + (idx / (trendData.length - 1)) * innerWidth
      const y = paddingTop + innerHeight - (d.count / maxVal) * innerHeight
      return { ...d, x, y }
    })
  }, [trendData, maxVal, innerWidth, innerHeight, paddingLeft, paddingTop])

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

  // 2. Day-of-Week Frequency Distribution Data
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
        const startDate = h.createdAt.split('T')[0]
        if (dateStr >= startDate && records[`${h.id}_${dateStr}`]) counts[dayIdx]++
      })
    }

    const totalCheckIns = counts.reduce((a, b) => a + b, 0)
    const maxDayCount = Math.max(...counts, 1)

    return daysName.map((name, idx) => ({
      day: name,
      count: counts[idx],
      heightPercentage: Math.round((counts[idx] / maxDayCount) * 100),
      percentage: totalCheckIns > 0 ? Math.round((counts[idx] / totalCheckIns) * 100) : 0,
      avgPerWeek: (counts[idx] / 12).toFixed(1),
    }))
  }, [habits, records])

  // 3. Performance Insights Calculation
  const highlights = useMemo(() => {
    // Peak day of week
    let peakDay = dayOfWeekDistribution[0]
    dayOfWeekDistribution.forEach((d) => {
      if (d.count > peakDay.count) peakDay = d
    })

    // Top habit
    const today = new Date()
    let topHabitName = 'N/A'
    let maxDone = -1

    habits.forEach((h) => {
      const startDate = h.createdAt.split('T')[0]
      const daysSinceCreation = Math.round(
        (today.getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)
      ) + 1
      const lookbackDays = Math.min(30, Math.max(1, daysSinceCreation))
      let count = 0
      for (let i = 0; i < lookbackDays; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        if (records[`${h.id}_${dateStr}`]) count++
      }
      if (count > maxDone) {
        maxDone = count
        topHabitName = h.name
      }
    })

    const topHabitRate = Math.round((maxDone / Math.max(...habits.map((h) => {
      const sd = h.createdAt.split('T')[0]
      const dsc = Math.round((today.getTime() - new Date(sd).getTime()) / (1000 * 3600 * 24)) + 1
      return Math.min(30, Math.max(1, dsc))
    }), 1)) * 100)

    return {
      peakDayName: peakDay.day,
      peakDayCount: peakDay.count,
      topHabitName,
      topHabitRate: Math.max(topHabitRate, 0),
    }
  }, [dayOfWeekDistribution, habits, records])

  // Render Widget Helper
  const renderWidget = (id: string) => {
    if (id === 'widget-line') {
      return (
        <SortableWidgetCard key={id} id={id} className="col-span-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-[var(--text-primary)]">
                  14-Day Completion Trajectory
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Continuous volume trend with explicit X & Y axes and gradient velocity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto mr-8">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-semibold border border-[var(--accent)]/30">
                <Flame className="w-3.5 h-3.5" /> High Precision Curve
              </span>
            </div>
          </div>

          {/* Full Width Line Chart SVG */}
          <div className="relative mt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-64 overflow-visible"
            >
              <defs>
                <linearGradient id="vibrantEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>

                <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Y-Axis Horizontal Gridlines & Values */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
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
                      strokeDasharray={ratio === 0 ? undefined : '4 4'}
                      opacity={ratio === 0 ? 0.9 : 0.4}
                    />
                    <text
                      x={paddingLeft - 10}
                      y={yPos + 4}
                      textAnchor="end"
                      className="fill-[var(--text-secondary)] text-[11px] font-semibold font-display"
                    >
                      {valLabel}
                    </text>
                  </g>
                )
              })}

              {/* X-Axis Ticks & Dates */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <line
                    x1={pt.x}
                    y1={chartHeight - paddingBottom}
                    x2={pt.x}
                    y2={chartHeight - paddingBottom + 6}
                    stroke="var(--border-subtle)"
                    opacity="0.7"
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - paddingBottom + 20}
                    textAnchor="middle"
                    className="fill-[var(--text-secondary)] text-[11px] font-medium"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}

              {/* Gradient Area Fill */}
              <path d={areaPathD} fill="url(#vibrantEmeraldGradient)" />

              {/* High-Contrast Bold Vibrant Trend Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                d={linePathD}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#emeraldGlow)"
              />

              {/* Vibrant Data Point Nodes */}
              {points.map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    className="fill-[var(--accent)] stroke-[var(--bg-secondary)] stroke-[2.5] hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredLinePoint(pt)}
                    onMouseLeave={() => setHoveredLinePoint(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Dynamic Cursor Tooltip */}
            {hoveredLinePoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute pointer-events-none z-40 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredLinePoint.x / chartWidth) * 100}%`,
                  top: `${(hoveredLinePoint.y / chartHeight) * 100 - 6}%`,
                }}
              >
                <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs py-2 px-3.5 rounded-xl shadow-2xl border border-[var(--border-strong)] whitespace-nowrap">
                  <div className="font-bold text-[var(--accent)] mb-0.5">
                    {hoveredLinePoint.label}
                  </div>
                  <div className="text-[var(--text-secondary)] font-medium">
                    {hoveredLinePoint.count} / {habits.length} habits done ({hoveredLinePoint.percentage}%)
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </SortableWidgetCard>
      )
    }

    if (id === 'widget-rings') {
      return (
        <SortableWidgetCard key={id} id={id}>
          <div className="flex items-center gap-2.5 mb-4 border-b border-[var(--border-subtle)] pb-3">
            <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                Per-Habit Performance Rings
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                30-day completion rate & linked task details
              </p>
            </div>
          </div>

          {/* List of Habit Ring Cards with Hover Tooltips */}
          <div className="space-y-3">
            {habits.map((habit) => {
              const today = new Date()
              const startDate = habit.createdAt.split('T')[0]
              const daysSinceCreation = Math.round(
                (today.getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)
              ) + 1
              const lookbackDays = Math.min(30, Math.max(1, daysSinceCreation))
              let doneCount = 0
              for (let i = 0; i < lookbackDays; i++) {
                const d = new Date(today)
                d.setDate(today.getDate() - i)
                const dateStr = d.toISOString().split('T')[0]
                if (records[`${habit.id}_${dateStr}`]) doneCount++
              }

              const rate = Math.round((doneCount / lookbackDays) * 100)
              const circumference = 2 * Math.PI * 15
              const strokeDashoffset = circumference - (rate / 100) * circumference
              const linkedTask = tasks.find((t) => t.id === habit.linkedTaskId)

              return (
                <div
                  key={habit.id}
                  onMouseEnter={() =>
                    setHoveredRingHabit({
                      name: habit.name,
                      rate,
                      doneCount,
                      linkedTaskTitle: linkedTask?.title,
                    })
                  }
                  onMouseLeave={() => setHoveredRingHabit(null)}
                  className="relative flex items-center justify-between p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-default)] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Ring SVG */}
                    <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="15"
                          stroke="var(--border-subtle)"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="15"
                          stroke={habit.color}
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-extrabold font-display text-[var(--text-primary)]">
                        {rate}%
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {habit.name}
                      </div>
                      {linkedTask ? (
                        <div className="text-[11px] text-[var(--text-tertiary)] truncate flex items-center gap-1 mt-0.5">
                          <LinkIcon className="w-3 h-3 text-[var(--accent)]" /> {linkedTask.title}
                        </div>
                      ) : (
                        <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                          {doneCount} / 30 check-in days
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Hover Tooltip for Ring Card */}
          {hoveredRingHabit && (
            <div className="mt-3 p-3 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs border border-[var(--border-strong)] shadow-xl">
              <div className="font-bold text-[var(--accent)]">{hoveredRingHabit.name}</div>
              <div className="text-[var(--text-secondary)] mt-1">
                Completed {hoveredRingHabit.doneCount} out of 30 days ({hoveredRingHabit.rate}% consistency).
                {hoveredRingHabit.linkedTaskTitle && (
                  <span className="text-[var(--text-muted)] block mt-0.5">
                    Auto-completes task: &quot;{hoveredRingHabit.linkedTaskTitle}&quot;
                  </span>
                )}
              </div>
            </div>
          )}
        </SortableWidgetCard>
      )
    }

    if (id === 'widget-bar') {
      return (
        <SortableWidgetCard key={id} id={id}>
          <div className="flex items-center gap-2.5 mb-4 border-b border-[var(--border-subtle)] pb-3">
            <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                Weekday Frequency Distribution
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Historical check-in volume by day of week (last 90 days)
              </p>
            </div>
          </div>

          {/* High-Contrast Vibrant Bars */}
          <div className="flex items-end justify-between h-44 pt-4 gap-2.5">
            {dayOfWeekDistribution.map((item) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredBarDay(item)}
                onMouseLeave={() => setHoveredBarDay(null)}
              >
                {/* Count Badge on top of bar */}
                <span className="text-[10px] font-bold font-display text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  {item.count}
                </span>

                <div className="w-full bg-[var(--bg-tertiary)] rounded-t-xl relative h-full flex items-end overflow-hidden border border-[var(--border-subtle)]">
                  <div className="w-full" style={{ height: `${item.heightPercentage}%` }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="w-full h-full origin-bottom bg-gradient-to-t from-[var(--accent)] to-[var(--accent-hover)] dark:from-[var(--accent)] dark:to-[var(--accent-hover)] rounded-t-lg group-hover:brightness-110 transition-all border-t border-[var(--accent)]/50"
                    />
                  </div>
                </div>

                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          {/* Hover Tooltip for Bar Chart */}
          {hoveredBarDay && (
            <div className="mt-3 p-3 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs border border-[var(--border-strong)] shadow-xl">
              <div className="font-bold text-[var(--accent)]">{hoveredBarDay.day} Frequency</div>
              <div className="text-[var(--text-secondary)] mt-1">
                {hoveredBarDay.count} total check-ins ({hoveredBarDay.percentage}% of overall activity).
                <span className="block text-[var(--text-muted)] mt-0.5">
                  Average ~{hoveredBarDay.avgPerWeek} check-ins per {hoveredBarDay.day}.
                </span>
              </div>
            </div>
          )}
        </SortableWidgetCard>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton height={60} />
        <LoadingSkeleton height={200} />
        <LoadingSkeleton height={200} />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load analytics dashboard" message={error} />
  }

  return (
    <div className="space-y-4">
      {/* Performance Highlight Insight Banner */}
      <div className="rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-r from-[var(--accent)]/10 via-[var(--bg-secondary)] to-[var(--accent)]/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--accent)] text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Performance Insight
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              Peak consistency day is <span className="font-bold text-[var(--accent)]">{highlights.peakDayName}</span> ({highlights.peakDayCount} check-ins). Top habit: <span className="font-bold text-[var(--accent)]">{highlights.topHabitName}</span> ({highlights.topHabitRate}% 30-day rate).
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] shrink-0">
          <Zap className="w-3.5 h-3.5 text-[var(--color-warning)]" />
          <span>Drag widgets to reorder</span>
        </div>
      </div>

      {/* Instructions Bar */}
      <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] px-1">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          Drag widget cards using the grip handles to customize your analytics layout.
        </span>
      </div>

      {/* Drag & Drop Reorderable Widgets Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
          <div className="space-y-6">
            {/* Render Full-Width Top Line Chart */}
            {widgetOrder.filter((id) => id === 'widget-line').map((id) => renderWidget(id))}

            {/* Render 2-Column Supporting Charts Grid Below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgetOrder.filter((id) => id !== 'widget-line').map((id) => renderWidget(id))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
