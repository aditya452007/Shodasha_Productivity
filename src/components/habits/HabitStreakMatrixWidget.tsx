'use client'

import { useState } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { CheckCircle2, AlertCircle, Calendar, ChevronDown } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { motion, useReducedMotion } from 'framer-motion'

export function HabitStreakMatrixWidget() {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const toggleHabit = useHabitStore((s) => s.toggleHabit)
  const [filter, setFilter] = useState<'month' | 'year'>('month')

  const days = Array.from({ length: 17 }, (_, i) => i + 12) // Days 12 to 28
  const todayDay = new Date().getDate()

  const isHabitDone = (habitId: string, day: number) => {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateStr = `${year}-${month}-${dayStr}`
    return Boolean(records[`${habitId}_${dateStr}`])
  }

  return (
    <BaseCard elevation="raised" className="card-hover-lift w-full" innerClassName="p-5 flex flex-col gap-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
              Habit streak
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Monthly day status matrix & consistency log
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <span>This month</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('month')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'month' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setFilter('year')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'year' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Streak Day Columns Matrix */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px] space-y-3">
          {/* Day Numbers Row Header */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-xs font-bold text-[var(--text-tertiary)] border-b border-[var(--border-subtle)] pb-2">
            <span>Habit Name</span>
            <div className="grid grid-cols-17 gap-1.5 text-center">
              {days.map((day) => (
                <div
                  key={day}
                  className={`py-1 rounded-lg ${
                    day === todayDay ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold ring-1 ring-amber-500/40' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Habit Item Rows */}
          {habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-[140px_1fr] items-center gap-4 py-1 text-xs">
              <span className="font-semibold text-[var(--text-primary)] truncate">{habit.name}</span>
              <div className="grid grid-cols-17 gap-1.5">
                {days.map((day) => {
                  const done = isHabitDone(habit.id, day)
                  const year = new Date().getFullYear()
                  const month = String(new Date().getMonth() + 1).padStart(2, '0')
                  const dayStr = String(day).padStart(2, '0')
                  const dateStr = `${year}-${month}-${dayStr}`
                  const isFuture = day > todayDay

                  return (
                    <motion.button
                      key={day}
                      whileTap={{ scale: shouldReduceMotion || isFuture ? 1 : 0.85 }}
                      disabled={isFuture}
                      onClick={() => toggleHabit(habit.id, dateStr)}
                      className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                        isFuture
                          ? 'opacity-30 cursor-not-allowed bg-[var(--bg-tertiary)]'
                          : done
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-red-100 dark:bg-red-950/50 text-red-500 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 fill-current text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  )
}
