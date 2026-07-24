'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Sparkles, Trophy } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'

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
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white shadow-xl overflow-hidden h-full min-h-[220px]"
    >
      {/* Decorative Background Rays / Blur */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200 z-10">
        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span>Current Streak</span>
      </div>

      {/* Center Flame & Big Counter */}
      <div className="flex flex-col items-center justify-center text-center my-4 z-10">
        {/* Animated Flame Icon Container */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 mb-2 shadow-inner"
        >
          <Flame className="w-8 h-8 fill-amber-400 stroke-amber-300" />
        </motion.div>

        <div className="font-display text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">
          {streak > 0 ? streak : 0}
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-200 mt-0.5">
          {streak === 1 ? 'Day' : 'Days'}
        </span>
      </div>

      {/* Footer Subtext */}
      <div className="text-center text-xs text-violet-100 font-medium z-10 border-t border-white/15 pt-3">
        Keep it up! You're doing great.
      </div>
    </motion.div>
  )
}
