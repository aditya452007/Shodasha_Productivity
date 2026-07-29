'use client'

import { useMemo, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Snowflake, Shield, Zap, Sparkles, Award } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { BaseCard } from '@/components/ui/BaseCard'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { LivingFlameIcon } from '@/components/gamification/LivingFlameIcon'

interface StreakDisplayProps {
  className?: string
}

function getNextMilestone(streak: number): { target: number; label: string; rewardXP: number } {
  if (streak < 7) return { target: 7, label: '7-Day Spark', rewardXP: 50 }
  if (streak < 14) return { target: 14, label: '14-Day Ignition', rewardXP: 100 }
  if (streak < 30) return { target: 30, label: '30-Day Blaze', rewardXP: 250 }
  if (streak < 60) return { target: 60, label: '60-Day Inferno', rewardXP: 500 }
  if (streak < 90) return { target: 90, label: '90-Day Unstoppable', rewardXP: 1000 }
  return { target: 365, label: '365-Day Legend', rewardXP: 5000 }
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

  const { currentStreak, longestStreak } = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const creationDates = habits.map((h) => h.createdAt.split('T')[0]).sort()
    const globalStart = creationDates.length > 0 ? creationDates[0] : todayStr

    let currentStreak = 0
    let checkDate = new Date(today)
    
    // Check if streak is alive
    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
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

    return { currentStreak, longestStreak }
  }, [habits, records])

  useEffect(() => {
    if (currentStreak > 0 && isInitialized) {
      checkAndAwardStreakMilestone(currentStreak)
    }
  }, [currentStreak, isInitialized, checkAndAwardStreakMilestone])

  const milestone = getNextMilestone(currentStreak)
  const milestoneProgress = Math.min(100, Math.round((currentStreak / milestone.target) * 100))
  const freezeCount = getFreezeCount(currentStreak)

  // Multiplier boost logic
  const multiplier = currentStreak >= 30 ? 2.5 : currentStreak >= 14 ? 1.8 : currentStreak >= 7 ? 1.4 : 1.0

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
    <BaseCard
      elevation="raised"
      className={`card-color-amber rounded-2xl h-full flex flex-col justify-between p-6 ${className}`}
      innerClassName="p-0 flex flex-col justify-between h-full"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <LivingFlameIcon size={18} intensity="blazing" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">
                Streak Multipliers
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Milestones & XP Multipliers
              </p>
            </div>
          </div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [-1, 1, -1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-2xs"
          >
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{multiplier}x Boost</span>
          </motion.div>
        </div>

        {/* Milestone Progress Details */}
        <div className="space-y-2.5 my-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--text-primary)] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Next Reward: {milestone.label}
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
              +{milestone.rewardXP} XP
            </span>
          </div>

          <div className="relative h-2.5 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${milestoneProgress}%` }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-[var(--text-tertiary)] font-medium">
            <span>Progress: {currentStreak} / {milestone.target} days</span>
            <span>{milestoneProgress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Protection & Best Record */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px]">
            {freezeCount > 0 ? (
              <span className="flex items-center gap-1">
                {freezeCount} Freeze Shields <Snowflake className="w-3 h-3 text-sky-400" />
              </span>
            ) : (
              `Best Record: ${longestStreak}d`
            )}
          </span>
        </div>

        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Streak Active
        </span>
      </div>
    </BaseCard>
  )
}
