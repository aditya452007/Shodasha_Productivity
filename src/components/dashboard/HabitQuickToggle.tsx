'use client'

import { useHabitStore } from '@/stores/habitStore'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, CalendarCheck, Plus } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import Link from 'next/link'

export function HabitQuickToggle() {
  const habits = useHabitStore((state) => state.habits)
  const records = useHabitStore((state) => state.records)
  const toggleHabit = useHabitStore((state) => state.toggleHabit)
  const isLoading = useHabitStore((state) => state.isLoading)
  const error = useHabitStore((state) => state.error)
  const shouldReduceMotion = useReducedMotion()

  const todayStr = new Date().toISOString().split('T')[0]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
        <LoadingSkeleton height={24} width="40%" />
        <LoadingSkeleton height={48} />
        <LoadingSkeleton height={48} />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load habits" message={error} />
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
            Daily Habits
          </h3>
        </div>
        <span className="font-mono text-xs text-[var(--text-muted)]">{todayStr}</span>
      </div>

      {habits.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No active habits"
          description="Build your daily routine by adding your first habit."
          actionLabel="Create Habit"
          onAction={() => {
            window.location.href = '/habits'
          }}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {habits.map((habit, index) => {
            const isDone = !!records[`${habit.id}_${todayStr}`]

            return (
              <motion.button
                key={habit.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3),
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleHabit(habit.id, todayStr)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  isDone
                    ? 'border-[var(--accent)]/40 bg-[var(--accent-muted)]/30'
                    : 'border-[var(--border)] bg-[var(--bg-base)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isDone
                        ? 'line-through text-[var(--text-muted)] font-normal'
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {habit.name}
                  </span>
                </div>

                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                    isDone
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-[var(--border-strong)] bg-transparent text-transparent'
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: isDone ? [1, 1.25, 1] : 1 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </motion.div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
