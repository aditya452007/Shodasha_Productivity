'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { BaseCard } from '@/components/ui/BaseCard'

export function StreakHeroCard() {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  const todayStr = new Date().toISOString().split('T')[0]

  // Dynamic habit streak calculation
  const streak = useMemo(() => {
    if (habits.length === 0) return 0
    let currentStreak = 0
    let checkDate = new Date()

    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
    if (!anyDoneToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCompletedHabit = habits.some((h) => !!records[`${h.id}_${dateStr}`])
      if (hasCompletedHabit) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return currentStreak
  }, [habits, records, todayStr])

  return (
    <BaseCard
      elevation="flat"
      className="relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-br from-[var(--accent-violet)] via-[var(--accent-indigo)] to-[var(--accent-blue)] text-white shadow-xl overflow-hidden h-full min-h-[220px] border-0 card-hover-lift"
      innerClassName="p-0"
    >
      {/* Decorative Background Rays / Blur */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[color-mix(in_oklab,var(--accent-amber)_20%,transparent)] blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 z-10">
        <Flame className="w-4 h-4 text-[var(--accent-amber)] fill-[var(--accent-amber)]" />
        <span>Current Streak</span>
      </div>

      {/* Center Flame & Big Counter */}
      <div className="flex flex-col items-center justify-center text-center my-4 z-10">
        {/* Animated Flame Icon Container */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          className="p-3.5 rounded-2xl bg-[color-mix(in_oklab,var(--accent-amber)_20%,transparent)] border border-[var(--accent-amber)]/30 text-[var(--accent-amber)] mb-2 shadow-inner"
        >
          <Flame className="w-8 h-8 fill-[var(--accent-amber)] stroke-[var(--accent-amber)]/80" />
        </motion.div>

        <div className="font-display text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">
          {streak > 0 ? streak : 0}
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-white/70 mt-0.5">
          {streak === 1 ? 'Day' : 'Days'}
        </span>
      </div>

      {/* Footer Subtext */}
      <div className="text-center text-xs text-white/80 font-medium z-10 border-t border-white/15 pt-3">
        Keep it up! You're doing great.
      </div>
    </BaseCard>
  )
}
