'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, CalendarCheck, CheckCircle2 } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'

export function HabitStatsCard() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  const stats = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Calculate current streak (consecutive days where at least 1 habit was done)
    let currentStreak = 0
    let checkDate = new Date(today)
    
    // If today hasn't had any completed habit yet, check yesterday to avoid breaking streak early
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

    // Today's progress
    const todayCompletedCount = habits.filter((h) => !!records[`${h.id}_${todayStr}`]).length
    const todayCompletionRate = habits.length > 0 ? Math.round((todayCompletedCount / habits.length) * 100) : 0

    // Monthly total completions (last 30 days)
    let last30DaysCount = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      habits.forEach((h) => {
        if (records[`${h.id}_${dateStr}`]) last30DaysCount++
      })
    }

    return {
      currentStreak,
      todayCompletedCount,
      todayCompletionRate,
      last30DaysCount,
    }
  }, [habits, records])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Streak */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex items-center gap-3 shadow-xs hover:border-[var(--border-default)] transition-colors"
      >
        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Current Streak
          </div>
          <div className="text-2xl font-bold font-display text-[var(--text-primary)]">
            {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </motion.div>

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex items-center gap-3 shadow-xs hover:border-[var(--border-default)] transition-colors"
      >
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[var(--accent-emerald)]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Today&apos;s Progress
          </div>
          <div className="text-2xl font-bold font-display text-[var(--text-primary)]">
            {stats.todayCompletedCount} / {habits.length} ({stats.todayCompletionRate}%)
          </div>
        </div>
      </motion.div>

      {/* Monthly Total */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex items-center gap-3 shadow-xs hover:border-[var(--border-default)] transition-colors"
      >
        <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            30-Day Check-ins
          </div>
          <div className="text-2xl font-bold font-display text-[var(--text-primary)]">
            {stats.last30DaysCount} check-ins
          </div>
        </div>
      </motion.div>

      {/* Active Habits Count */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex items-center gap-3 shadow-xs hover:border-[var(--border-default)] transition-colors"
      >
        <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Active Habits
          </div>
          <div className="text-2xl font-bold font-display text-[var(--text-primary)]">
            {habits.length} Habits
          </div>
        </div>
      </motion.div>
    </div>
  )
}
