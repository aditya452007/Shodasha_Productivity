'use client'

import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { CheckCircle2, Clock, Flame, Target } from 'lucide-react'

export function TodayProgressCard() {
  const tasks = useTaskStore((state) => state.tasks)
  const habits = useHabitStore((state) => state.habits)
  const records = useHabitStore((state) => state.records)
  const getTotalFocusSeconds = useTimeEntryStore((state) => state.getTotalFocusSecondsToday)

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const totalTasks = tasks.length
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const todayStr = new Date().toISOString().split('T')[0]
  const completedHabits = habits.filter((h) => !!records[`${h.id}_${todayStr}`]).length
  const totalHabits = habits.length

  const focusSeconds = getTotalFocusSeconds()
  const focusHours = Math.floor(focusSeconds / 3600)
  const focusMins = Math.floor((focusSeconds % 3600) / 60)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xs transition-all hover:border-[var(--border-strong)]">
      {/* Background Subtle Gradient wash */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Editorial Greeting Header */}
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <Target className="h-3.5 w-3.5" />
            <span>Today's Briefing</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
            Stay aligned with your daily rhythm.
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Tracked focus time, kanban goals, and active habit streaks in one unified overview.
          </p>
        </div>

        {/* Focus Hours Counter Highlight */}
        <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-5 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">
            <Clock className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Active Focus Time
            </span>
            <div className="flex items-baseline gap-1 font-mono text-2xl font-bold text-[var(--text-primary)]">
              <span>{focusHours}h</span>
              <span className="text-lg text-[var(--text-secondary)]">{focusMins}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Task Completion Metric */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">Tasks Completed</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
                {completedTasks} / {totalTasks}
              </span>
              <span className="text-xs font-semibold text-[var(--accent)]">
                {taskProgress}%
              </span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-mono text-xs font-bold">
            {taskProgress}%
          </div>
        </div>

        {/* Habits Checked Metric */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">Habits Checked</span>
            <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
              {completedHabits} / {totalHabits}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">Daily Streak</span>
            <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
              5 Days
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Flame className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}
