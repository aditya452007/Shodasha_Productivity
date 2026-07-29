'use client'

import { useMemo, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Snowflake, Trophy } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { BaseCard } from '@/components/ui/BaseCard'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

interface StreakDisplayProps {
  className?: string
}

function getFlameTier(streak: number): { size: number; color: string; glow: string } {
  if (streak >= 90) return { size: 32, color: '#FFD700', glow: '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.3)' }
  if (streak >= 60) return { size: 28, color: '#C084FC', glow: '0 0 15px rgba(192,132,252,0.5), 0 0 30px rgba(192,132,252,0.2)' }
  if (streak >= 30) return { size: 24, color: '#EF4444', glow: '0 0 12px rgba(239,68,68,0.4)' }
  if (streak >= 14) return { size: 22, color: '#F97316', glow: '0 0 8px rgba(249,115,22,0.3)' }
  if (streak >= 7) return { size: 20, color: '#F97316', glow: '0 0 4px rgba(249,115,22,0.2)' }
  return { size: 18, color: '#9CA3AF', glow: 'none' }
}

function getFreezeCount(streak: number): number {
  if (streak >= 60) return 3
  if (streak >= 30) return 2
  if (streak >= 7) return 1
  return 0
}

export function StreakDisplay({ className = '' }: StreakDisplayProps) {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const isLoading = useHabitStore((s) => s.isLoading)
  const error = useHabitStore((s) => s.error)
  const isInitialized = useGamificationStore((s) => s.isInitialized)
  const checkAndAwardStreakMilestone = useGamificationStore((s) => s.checkAndAwardStreakMilestone)

  const { currentStreak, longestStreak, anyDoneToday } = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const creationDates = habits.map((h) => h.createdAt.split('T')[0]).sort()
    const globalStart = creationDates.length > 0 ? creationDates[0] : todayStr

    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])

    let currentStreak = 0
    let checkDate = new Date(today)
    if (!anyDoneToday) checkDate.setDate(checkDate.getDate() - 1)

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (dateStr < globalStart) break
      const hasCompleted = habits.some((h) => {
        const startDate = h.createdAt.split('T')[0]
        return dateStr >= startDate && !!records[`${h.id}_${dateStr}`]
      })
      if (hasCompleted) { currentStreak++; checkDate.setDate(checkDate.getDate() - 1) }
      else break
    }

    let tempStreak = 0
    let longestStreak = 0
    const checkDate2 = new Date(globalStart)
    const today2 = new Date()
    while (checkDate2 <= today2) {
      const dateStr = checkDate2.toISOString().split('T')[0]
      const hasCompleted = habits.some((h) => {
        const startDate = h.createdAt.split('T')[0]
        return dateStr >= startDate && !!records[`${h.id}_${dateStr}`]
      })
      if (hasCompleted) { tempStreak++; longestStreak = Math.max(longestStreak, tempStreak) }
      else { tempStreak = 0 }
      checkDate2.setDate(checkDate2.getDate() + 1)
    }

    return { currentStreak, longestStreak, anyDoneToday }
  }, [habits, records])

  useEffect(() => {
    if (currentStreak > 0 && isInitialized) {
      checkAndAwardStreakMilestone(currentStreak)
    }
  }, [currentStreak, isInitialized, checkAndAwardStreakMilestone])

  const { size: flameSize, color: flameColor, glow: flameGlow } = getFlameTier(currentStreak)
  const isBroken = !anyDoneToday && currentStreak === 0 && longestStreak > 0
  const freezeCount = getFreezeCount(currentStreak)

  if (isLoading) {
    return (
      <BaseCard elevation="raised" className={className} isLoading skeletonHeight={80} skeletonLines={2}>
        <div />
      </BaseCard>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load streak data" message={error} />
  }

  return (
    <BaseCard elevation="raised" innerClassName="p-4" className={className}>
      <div className="flex items-center gap-4">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0.3 } : { type: 'spring', stiffness: 200, damping: 15 }}
          className="relative shrink-0"
        >
          <Flame
            size={flameSize}
            style={{
              color: flameColor,
              filter: flameGlow !== 'none' ? `drop-shadow(${flameGlow})` : undefined,
            }}
          />
          {currentStreak >= 14 && !shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${flameColor}`, opacity: 0.2 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <motion.span
              className="text-2xl font-bold font-display text-[var(--text-primary)]"
              key={currentStreak}
              initial={shouldReduceMotion ? undefined : { scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentStreak}
            </motion.span>
            <span className="text-sm text-[var(--text-secondary)] font-medium">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          {!anyDoneToday && currentStreak > 0 && (
            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
              Complete today to reach {currentStreak + 1} days!
            </p>
          )}

          {isBroken && (
            <motion.p
              className="text-[11px] text-[var(--text-secondary)] mt-0.5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              Streak lost at {longestStreak} days. Complete today to start a new streak.
            </motion.p>
          )}

          {currentStreak === 0 && longestStreak === 0 && (
            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
              Check in on a habit to start your streak
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span className="text-[11px] text-[var(--text-tertiary)] font-medium">
            Best: {longestStreak} days
          </span>
        </div>

        {freezeCount > 0 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: freezeCount }).map((_, i) => (
              <Snowflake
                key={i}
                className="w-3.5 h-3.5"
                style={{ color: 'var(--accent-blue)' }}
              />
            ))}
            <span className="text-[10px] text-[var(--text-tertiary)] ml-0.5">
              streak freeze{freezeCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </BaseCard>
  )
}
