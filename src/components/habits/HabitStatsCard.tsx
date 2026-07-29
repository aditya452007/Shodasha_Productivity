'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Trophy, CalendarCheck, CheckCircle2 } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { BaseCard } from '@/components/ui/BaseCard'

export function HabitStatsCard() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const isLoading = useHabitStore((s) => s.isLoading)
  const error = useHabitStore((s) => s.error)
  const shouldReduceMotion = useReducedMotion()

  const stats = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Find earliest habit creation date to establish global start boundary
    const creationDates = habits.map((h) => h.createdAt.split('T')[0]).sort()
    const globalStartBoundary = creationDates.length > 0 ? creationDates[0] : todayStr

    // Calculate current streak (consecutive days where at least 1 habit was done)
    let currentStreak = 0
    let checkDate = new Date(today)
    
    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
    if (!anyDoneToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (dateStr < globalStartBoundary) break
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

  if (isLoading) {
    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <LoadingSkeleton height={80} />
        <LoadingSkeleton height={80} />
        <LoadingSkeleton height={80} />
        <LoadingSkeleton height={80} />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load habit statistics" message={error} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Streak */}
      <BaseCard
        elevation="raised"
        className="card-hover-lift"
        innerClassName="flex items-center gap-4 p-6"
      >
        <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: 'var(--accent-amber-muted)', color: 'var(--accent-amber)' }}>
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            Current Streak
          </div>
          <div className="text-2xl font-extrabold font-display text-[var(--text-primary)] mt-0.5">
            <NumberTicker value={stats.currentStreak} /> {stats.currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </BaseCard>

      {/* Today's Progress */}
      <BaseCard
        elevation="raised"
        className="card-hover-lift"
        innerClassName="flex items-center gap-4 p-6"
      >
        <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: 'var(--accent-emerald-muted)', color: 'var(--accent-emerald)' }}>
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            Today&apos;s Progress
          </div>
          <div className="text-2xl font-extrabold font-display text-[var(--text-primary)] mt-0.5">
            <NumberTicker value={stats.todayCompletedCount} /> / {habits.length} (<NumberTicker value={stats.todayCompletionRate} />%)
          </div>
        </div>
      </BaseCard>

      {/* Monthly Total */}
      <BaseCard
        elevation="raised"
        className="card-hover-lift"
        innerClassName="flex items-center gap-4 p-6"
      >
        <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: 'var(--accent-violet-muted)', color: 'var(--accent-violet)' }}>
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            30-Day Check-ins
          </div>
          <div className="text-2xl font-extrabold font-display text-[var(--text-primary)] mt-0.5">
            <NumberTicker value={stats.last30DaysCount} /> check-ins
          </div>
        </div>
      </BaseCard>

      {/* Active Habits Count */}
      <BaseCard
        elevation="raised"
        className="card-hover-lift"
        innerClassName="flex items-center gap-4 p-6"
      >
        <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: 'var(--accent-teal-muted)', color: 'var(--accent-teal)' }}>
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
            Active Habits
          </div>
          <div className="text-2xl font-extrabold font-display text-[var(--text-primary)] mt-0.5">
            <NumberTicker value={habits.length} /> Habits
          </div>
        </div>
      </BaseCard>
    </div>
  )
}
