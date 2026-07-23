'use client'

import { useHabitStore } from '@/stores/habitStore'
import { Check, CalendarCheck } from 'lucide-react'

export function HabitQuickToggle() {
  const habits = useHabitStore((state) => state.habits)
  const records = useHabitStore((state) => state.records)
  const toggleHabit = useHabitStore((state) => state.toggleHabit)

  const todayStr = new Date().toISOString().split('T')[0]

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

      <div className="flex flex-col gap-2.5">
        {habits.map((habit) => {
          const isDone = !!records[`${habit.id}_${todayStr}`]

          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id, todayStr)}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                isDone
                  ? 'border-[var(--accent)]/40 bg-[var(--accent-muted)]/30'
                  : 'border-[var(--border)] bg-[var(--bg-base)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
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
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
