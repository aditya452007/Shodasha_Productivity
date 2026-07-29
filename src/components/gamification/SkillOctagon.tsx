'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useTaskStore } from '@/stores/taskStore'
import { ACHIEVEMENTS_LIST } from '@/lib/achievements'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

interface SkillOctagonProps {
  size?: number
  className?: string
}

interface AxisData {
  label: string
  score: number
  color: string
  description: string
}

const AXES: AxisData[] = [
  { label: 'Consistency', score: 0, color: 'var(--accent-emerald)', description: '14-day habit completion rate' },
  { label: 'Depth', score: 0, color: 'var(--accent-blue)', description: 'Deep work ratio (last 7d)' },
  { label: 'Balance', score: 0, color: 'var(--accent-violet)', description: 'Work vs distraction balance' },
  { label: 'Focus', score: 0, color: 'var(--accent-amber)', description: 'Uninterrupted focus hours' },
  { label: 'Growth', score: 0, color: 'var(--accent-teal)', description: 'Habit + task velocity' },
  { label: 'Recovery', score: 0, color: 'var(--accent-pink)', description: 'Idle mindfulness ratio' },
  { label: 'Mastery', score: 0, color: 'var(--accent-indigo)', description: 'Achievement unlock rate' },
  { label: 'Discipline', score: 0, color: 'var(--accent-orange)', description: 'Streak adherence' },
]

function computeAxesScores(): AxisData[] {
  const habits = useHabitStore.getState().habits
  const records = useHabitStore.getState().records
  const timeStore = useTimeEntryStore.getState()
  const tasks = useTaskStore.getState().tasks

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const fourteenDaysAgo = new Date(today)
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().split('T')[0]

  let consistencyScore = 0
  let streakAdherence = 0

  if (habits.length > 0) {
    let daysWithAny = 0
    let totalDays = 0
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const checkDate = new Date(fourteenDaysAgo)
    while (checkDate <= today) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCompleted = habits.some((h) => {
        const startDate = h.createdAt.split('T')[0]
        return dateStr >= startDate && !!records[`${h.id}_${dateStr}`]
      })
      if (hasCompleted) {
        daysWithAny++
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
      }
      totalDays++
      checkDate.setDate(checkDate.getDate() + 1)
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
    let streakCheck = new Date(today)
    if (!anyDoneToday) streakCheck.setDate(streakCheck.getDate() - 1)
    while (true) {
      const dateStr = streakCheck.toISOString().split('T')[0]
      if (dateStr < fourteenDaysAgoStr) break
      const hasCompleted = habits.some((h) => !!records[`${h.id}_${dateStr}`])
      if (hasCompleted) { currentStreak++; streakCheck.setDate(streakCheck.getDate() - 1) }
      else break
    }

    consistencyScore = Math.round((daysWithAny / totalDays) * 100)
    streakAdherence = longestStreak > 0 ? Math.round((currentStreak / longestStreak) * 100) : 0
  }

  const kpis = timeStore.getKPIsFiltered ? timeStore.getKPIsFiltered() : null
  const deepWorkRatio = kpis?.deepWorkRatio ?? 0
  const distractionRatio = kpis?.distractionRatio ?? 0
  const activeFocusSeconds = kpis?.activeFocusSeconds ?? 0
  const idleTimeSeconds = kpis?.idleTimeSeconds ?? 0

  const depthScore = Math.round(deepWorkRatio)
  const balanceScore = Math.round(100 - Math.abs(deepWorkRatio - distractionRatio))
  const focusScore = Math.min(100, Math.round((activeFocusSeconds / (8 * 3600)) * 100))

  const totalTimeSeconds = activeFocusSeconds + idleTimeSeconds
  const recoveryScore = totalTimeSeconds > 0 ? Math.round((idleTimeSeconds / totalTimeSeconds) * 100) : 0

  const growthScore = Math.min(100, Math.round(((habits.length * 5) + (tasks.filter((t) => t.status === 'done').length * 2)) / 10))

  const unlockedAchievements = useGamificationStore?.getState()?.unlockedAchievements ?? []
  const masteryScore = ACHIEVEMENTS_LIST.length > 0
    ? Math.round((unlockedAchievements.filter((id) => ACHIEVEMENTS_LIST.some((a) => a.id === id)).length / ACHIEVEMENTS_LIST.length) * 100)
    : 0

  return AXES.map((axis) => {
    let score = 0
    switch (axis.label) {
      case 'Consistency': score = consistencyScore; break
      case 'Depth': score = depthScore; break
      case 'Balance': score = balanceScore; break
      case 'Focus': score = focusScore; break
      case 'Growth': score = growthScore; break
      case 'Recovery': score = recoveryScore; break
      case 'Mastery': score = masteryScore; break
      case 'Discipline': score = streakAdherence; break
    }
    return { ...axis, score }
  })
}

import { useGamificationStore } from '@/stores/gamificationStore'

function pointsToSvg(points: number[], cx: number, cy: number, r: number): string {
  return points.map((score, i) => {
    const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2
    const value = (score / 100) * r
    const x = cx + value * Math.cos(angle)
    const y = cy + value * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')
}

function gridPoints(cx: number, cy: number, r: number, levels: number, count: number): { outerPoints: string; rings: string[]; labels: { x: number; y: number }[] } {
  const ringStrs: string[] = []
  for (let l = 1; l <= levels; l++) {
    const pts = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2
      const radius = (r / levels) * l
      const x = cx + radius * Math.cos(angle)
      const y = cy + radius * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')
    ringStrs.push(pts)
  }

  const outerPoints = ringStrs[ringStrs.length - 1]
  const labelPositions = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const x = cx + (r + 32) * Math.cos(angle)
    const y = cy + (r + 32) * Math.sin(angle)
    return { x, y }
  })

  return { outerPoints, rings: ringStrs, labels: labelPositions }
}

export function SkillOctagon({ size = 260, className = '' }: SkillOctagonProps) {
  const shouldReduceMotion = useReducedMotion()
  const isLoading = useHabitStore((s) => s.isLoading)
  const error = useHabitStore((s) => s.error)
  const habits = useHabitStore((s) => s.habits)
  const isInitialized = useGamificationStore((s) => s.isInitialized)

  const axes = useMemo(() => {
    if (!isInitialized) return AXES.map((a) => ({ ...a, score: 0 }))
    return computeAxesScores()
  }, [habits, isInitialized])

  const cx = size / 2
  const cy = size / 2
  const r = (size - 100) / 2
  const levels = 4
  const { outerPoints, rings, labels } = gridPoints(cx, cy, r, levels, axes.length)

  const hasData = axes.some((a) => a.score > 0)

  const polygonPoints = pointsToSvg(axes.map((a) => a.score), cx, cy, r)
  const emptyPoints = pointsToSvg(axes.map(() => 20), cx, cy, r)

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <LoadingSkeleton height={size} width={size} rounded="rounded-full" />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load skill data" message={error} />
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Skill Octagon: ${axes.map((a) => `${a.label} ${a.score}%`).join(', ')}`}
      >
        <title>Skill Octagon</title>

        {/* Grid rings with high clarity */}
        {rings.map((pts, i) => (
          <motion.polygon
            key={`ring-${i}`}
            points={pts}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={i === levels - 1 ? 2.5 : 1.5}
            strokeOpacity={i === levels - 1 ? 0.8 : 0.45}
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: i === levels - 1 ? 0.8 : 0.45 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}

        {/* Crisp Spoke lines */}
        {Array.from({ length: axes.length }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          return (
            <motion.line
              key={`spoke-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--border-strong)"
              strokeWidth={1.5}
              strokeOpacity={0.5}
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            />
          )
        })}

        {/* Empty state dashed polygon */}
        {!hasData && (
          <polygon
            points={emptyPoints}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1.5}
            strokeDasharray="4,4"
            strokeOpacity={0.4}
          />
        )}

        {/* Data polygon */}
        {hasData && (
          <motion.polygon
            points={polygonPoints}
            fill="var(--accent)"
            fillOpacity={0.12}
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinejoin="round"
            initial={shouldReduceMotion ? undefined : { points: pointsToSvg(axes.map(() => 0), cx, cy, r) }}
            animate={{ points: polygonPoints }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 12, mass: 1 }}
          />
        )}

        {/* Data points */}
        {hasData && axes.map((axis, i) => {
          const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2
          const value = (axis.score / 100) * r
          const x = cx + value * Math.cos(angle)
          const y = cy + value * Math.sin(angle)
          return (
            <motion.circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r={3}
              fill={axis.color}
              initial={shouldReduceMotion ? undefined : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <title>{axis.label}: {axis.score}% — {axis.description}</title>
            </motion.circle>
          )
        })}

        {/* Axis labels */}
        {labels.map((pos, i) => {
          const isLeft = pos.x < cx
          const isTop = pos.y < cy
          const label = axes[i].label
          const score = axes[i].score
          return (
            <motion.g
              key={`label-${i}`}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.04 }}
            >
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline={isTop ? 'auto' : 'hanging'}
                fill="var(--text-secondary)"
                fontSize={9}
                fontFamily="var(--font-body)"
                fontWeight={600}
              >
                {label}
              </text>
              <text
                x={pos.x}
                y={isTop ? pos.y - 10 : pos.y + 12}
                textAnchor="middle"
                dominantBaseline={isTop ? 'auto' : 'hanging'}
                fill={axes[i].color}
                fontSize={10}
                fontFamily="var(--font-mono)"
                fontWeight={700}
              >
                {score}
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* Center label */}
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-[10px] text-[var(--text-tertiary)] text-center px-4 leading-relaxed">
            Create habits and track focus time to see your Skill Octagon
          </p>
        </div>
      )}
    </div>
  )
}
