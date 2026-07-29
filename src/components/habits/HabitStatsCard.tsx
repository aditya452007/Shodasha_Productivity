'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Trophy, CalendarCheck, CheckCircle2 } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { BaseCard } from '@/components/ui/BaseCard'
import { LivingFlameIcon } from '@/components/gamification/LivingFlameIcon'

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
        <LoadingSkeleton height={120} />
        <LoadingSkeleton height={120} />
        <LoadingSkeleton height={120} />
        <LoadingSkeleton height={120} />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load habit statistics" message={error} />
  }

  const cards = [
    {
      id: 'streak',
      title: 'Current Streak',
      value: `${stats.currentStreak} ${stats.currentStreak === 1 ? 'Day' : 'Days'}`,
      numericVal: stats.currentStreak,
      subtitle: 'Consecutive Days Active',
      cardClass: 'card-color-amber',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      isFlame: true,
    },
    {
      id: 'today',
      title: 'Today\'s Completion',
      value: `${stats.todayCompletedCount} of ${habits.length}`,
      numericVal: stats.todayCompletionRate,
      subtitle: `${stats.todayCompletionRate}% Rate Today`,
      cardClass: 'card-color-emerald',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      icon: CheckCircle2,
    },
    {
      id: 'monthly',
      title: '30-Day Check-ins',
      value: `${stats.last30DaysCount}`,
      numericVal: stats.last30DaysCount,
      subtitle: 'Total Logs This Month',
      cardClass: 'card-color-violet',
      iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30',
      icon: CalendarCheck,
    },
    {
      id: 'active',
      title: 'Tracked Habits',
      value: `${habits.length}`,
      numericVal: habits.length,
      subtitle: 'Active Habit Routines',
      cardClass: 'card-color-indigo',
      iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30',
      icon: Trophy,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {cards.map((card) => {
        const IconComponent = card.icon
        return (
          <BaseCard
            key={card.id}
            elevation="raised"
            className={`card-hover-lift group ${card.cardClass} relative overflow-hidden rounded-2xl min-h-[135px]`}
            innerClassName="flex items-center justify-between p-6 h-full"
          >
            <div className="flex flex-col gap-1 min-w-0 z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] truncate">
                {card.title}
              </span>
              <div className="font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mt-1">
                {card.id === 'today' ? (
                  <span>
                    <NumberTicker value={stats.todayCompletedCount} /> / {habits.length}
                  </span>
                ) : card.id === 'monthly' || card.id === 'active' || card.id === 'streak' ? (
                  <span>
                    <NumberTicker value={card.numericVal} /> {card.id === 'streak' ? (stats.currentStreak === 1 ? 'day' : 'days') : ''}
                  </span>
                ) : (
                  card.value
                )}
              </div>
              <span className="text-xs font-medium text-[var(--text-tertiary)] truncate mt-1">
                {card.subtitle}
              </span>
            </div>

            {/* Animated Logo Icons with Distinct Custom Motions per Card */}
            {card.id === 'streak' ? (
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [-2, 2, -2], scale: [1, 1.06, 0.98, 1] }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 12 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className={`p-3.5 rounded-2xl ${card.iconBg} shrink-0 cursor-pointer shadow-xs z-10 flex items-center justify-center`}
              >
                <LivingFlameIcon size={26} intensity="active" />
              </motion.div>
            ) : card.id === 'today' ? (
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 360 }}
                transition={{
                  scale: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 0.6, ease: 'easeInOut' },
                }}
                className={`p-3.5 rounded-2xl ${card.iconBg} shrink-0 cursor-pointer shadow-xs z-10 flex items-center justify-center`}
              >
                {IconComponent && <IconComponent className="w-6 h-6 stroke-[2.2]" />}
              </motion.div>
            ) : card.id === 'monthly' ? (
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [-3, 3, -3] }}
                whileHover={shouldReduceMotion ? {} : { rotateY: 180, scale: 1.2 }}
                transition={{
                  y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                  rotateY: { duration: 0.7, ease: 'easeInOut' },
                }}
                className={`p-3.5 rounded-2xl ${card.iconBg} shrink-0 cursor-pointer shadow-xs z-10 flex items-center justify-center`}
              >
                {IconComponent && <IconComponent className="w-6 h-6 stroke-[2.2]" />}
              </motion.div>
            ) : (
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1], y: [-2, 2, -2] }}
                whileHover={shouldReduceMotion ? {} : { rotateZ: -15, scale: 1.25 }}
                transition={{
                  scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                  y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                  rotateZ: { duration: 0.3 },
                }}
                className={`p-3.5 rounded-2xl ${card.iconBg} shrink-0 cursor-pointer shadow-xs z-10 flex items-center justify-center`}
              >
                {IconComponent && <IconComponent className="w-6 h-6 stroke-[2.2]" />}
              </motion.div>
            )}
          </BaseCard>
        )
      })}
    </div>
  )
}
