'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Target, Check, ChevronRight, ExternalLink } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { openExternalUrl } from '@/lib/utils/url'
import Link from 'next/link'

export function GoalsHabitsCard() {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const toggleHabit = useHabitStore((s) => s.toggleHabit)

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6 shadow-xs h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[var(--text-primary)]">
              Daily Habits & Goals
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Consistency progress & target dates
            </p>
          </div>
        </div>

        <Link
          href="/habits"
          className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 group"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Goals / Habits List */}
      <div className="flex flex-col gap-4 my-1">
        {habits.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-tertiary)]">
            No habits configured. Create your first habit on the Habits page!
          </div>
        ) : (
          habits.slice(0, 3).map((habit, idx) => {
            const isDone = !!records[`${habit.id}_${todayStr}`]
            
            // Calculate actual 30-day completion rate from SQLite records
            const daysCount = 30
            let doneDays = 0
            const now = new Date()
            for (let i = 0; i < daysCount; i++) {
              const d = new Date()
              d.setDate(now.getDate() - i)
              const dStr = d.toISOString().split('T')[0]
              if (records[`${habit.id}_${dStr}`]) {
                doneDays++
              }
            }
            const pct = Math.round((doneDays / daysCount) * 100)

            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                className="flex flex-col gap-2 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-default)] transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: habit.color || '#059669' }}
                    />
                    <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {habit.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {habit.url && (
                      <button
                        onClick={() => openExternalUrl(habit.url)}
                        className="p-1 rounded-md text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                        title={`Open ${habit.url} in browser`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => toggleHabit(habit.id, todayStr)}
                      aria-label={`Toggle ${habit.name}`}
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-[var(--border-default)] text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Subtext */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: habit.color || '#059669' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] shrink-0">
                    {pct}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
                  <span>Target: Daily Routine</span>
                  <span>{isDone ? 'Completed Today' : 'Pending'}</span>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
