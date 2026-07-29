'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useGamificationStore } from '@/stores/gamificationStore'
import { useHabitStore } from '@/stores/habitStore'
import { BaseCard } from '@/components/ui/BaseCard'

interface DailyXPGoalProps {
  className?: string
  dailyGoal?: number
}

export function DailyXPGoal({ className = '', dailyGoal = 100 }: DailyXPGoalProps) {
  const shouldReduceMotion = useReducedMotion()
  const dailyXP = useGamificationStore((s) => s.dailyXP)
  const isInitialized = useGamificationStore((s) => s.isInitialized)
  const isLoading = useHabitStore((s) => s.isLoading)

  const percentage = Math.min(100, Math.round((dailyXP / dailyGoal) * 100))
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const statusText = percentage >= 100
    ? 'Goal reached!'
    : percentage >= 75
      ? 'Almost there'
      : percentage > 0
        ? 'On track'
        : 'Start your day'

  if (!isInitialized || isLoading) {
    return (
      <BaseCard elevation="raised" className={className} isLoading skeletonHeight={120} skeletonLines={1}>
        <div />
      </BaseCard>
    )
  }

  return (
    <BaseCard elevation="raised" innerClassName="p-4 flex flex-col items-center gap-3" className={className}>
      <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        Daily XP Goal
      </div>

      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg]"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--accent)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono text-[var(--text-primary)]">
            {dailyXP}
          </span>
          <span className="text-[10px] text-[var(--text-tertiary)] font-medium">
            / {dailyGoal}
          </span>
        </div>
      </div>

      <span
        className={`text-[11px] font-semibold ${
          percentage >= 100 ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
        }`}
      >
        {statusText}
      </span>
    </BaseCard>
  )
}
