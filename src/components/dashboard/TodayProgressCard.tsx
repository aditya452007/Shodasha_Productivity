'use client'

import { useMemo } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { CheckCircle2, Clock, Flame, Target, RotateCw } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { NumberTicker } from '@/components/ui/NumberTicker'

export function TodayProgressCard() {
  const tasks = useTaskStore((state) => state.tasks)
  const isTaskLoading = useTaskStore((state) => state.isLoading)
  const taskError = useTaskStore((state) => state.error)

  const habits = useHabitStore((state) => state.habits)
  const records = useHabitStore((state) => state.records)
  const isHabitLoading = useHabitStore((state) => state.isLoading)
  const habitError = useHabitStore((state) => state.error)

  const getTotalFocusSeconds = useTimeEntryStore((state) => state.getTotalFocusSecondsToday)
  const refreshAllData = useTimeEntryStore((state) => state.refreshAllData)
  const isRefreshing = useTimeEntryStore((state) => state.isRefreshing)
  const isTimeLoading = useTimeEntryStore((state) => state.isLoading)
  const timeError = useTimeEntryStore((state) => state.error)

  const isLoading = isTaskLoading || isHabitLoading || isTimeLoading

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const totalTasks = tasks.length
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const todayStr = new Date().toISOString().split('T')[0]
  const completedHabits = habits.filter((h) => !!records[`${h.id}_${todayStr}`]).length
  const totalHabits = habits.length
  const habitProgress = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  const focusSeconds = getTotalFocusSeconds()
  const focusHours = Math.floor(focusSeconds / 3600)
  const focusMins = Math.floor((focusSeconds % 3600) / 60)

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

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xs space-y-4">
        <LoadingSkeleton height={32} width="40%" />
        <LoadingSkeleton height={18} width="65%" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <LoadingSkeleton height={80} />
          <LoadingSkeleton height={80} />
          <LoadingSkeleton height={80} />
        </div>
      </div>
    )
  }

  const hasError = taskError || habitError || timeError
  if (hasError) {
    return (
      <ErrorBanner
        title="Failed to load dashboard data"
        message={taskError || habitError || timeError || 'An error occurred'}
        onRetry={() => refreshAllData()}
      />
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xs transition-all hover:border-[var(--border-strong)]">
      {/* Background Subtle Gradient wash */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/5 blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Editorial Greeting Header */}
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <Target className="h-3.5 w-3.5" />
            <span>Today&apos;s Briefing</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
            Stay aligned with your daily rhythm.
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Tracked focus time, kanban goals, and active habit streaks in one unified overview.
          </p>
        </div>

        {/* Focus Hours Counter Highlight + Refresh Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => refreshAllData()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh database metrics"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[var(--accent)]' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>

          <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-5 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Active Focus Time
              </span>
              <div className="flex items-baseline gap-1 font-mono text-2xl font-bold text-[var(--text-primary)]">
                <span><NumberTicker value={focusHours} />h</span>
                <span className="text-lg text-[var(--text-secondary)]"><NumberTicker value={focusMins} />m</span>
              </div>
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
              <span className="font-mono text-xl font-bold text-[var(--text-primary)]">
                <NumberTicker value={completedTasks} /> / {totalTasks}
              </span>
            </div>
          </div>
          <ProgressRing value={taskProgress} size={44} strokeWidth={4} />
        </div>

        {/* Habits Checked Metric */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">Habits Checked</span>
            <span className="font-mono text-xl font-bold text-[var(--text-primary)]">
              <NumberTicker value={completedHabits} /> / {totalHabits}
            </span>
          </div>
          <ProgressRing value={habitProgress} size={44} strokeWidth={4} />
        </div>

        {/* Streak Counter */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">Daily Streak</span>
            <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
              <NumberTicker value={streak} /> {streak === 1 ? 'Day' : 'Days'}
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
