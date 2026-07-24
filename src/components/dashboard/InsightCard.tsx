'use client'

import { useMemo } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { Lightbulb, Sparkles } from 'lucide-react'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

export function InsightCard() {
  const tasks = useTaskStore((state) => state.tasks)
  const isTaskLoading = useTaskStore((state) => state.isLoading)
  const taskError = useTaskStore((state) => state.error)

  const habits = useHabitStore((state) => state.habits)
  const isHabitLoading = useHabitStore((state) => state.isLoading)
  const habitError = useHabitStore((state) => state.error)

  const getTotalFocusSeconds = useTimeEntryStore((state) => state.getTotalFocusSecondsToday)
  const isTimeLoading = useTimeEntryStore((state) => state.isLoading)
  const timeError = useTimeEntryStore((state) => state.error)

  const isLoading = isTaskLoading || isHabitLoading || isTimeLoading

  const insight = useMemo(() => {
    const focusSeconds = getTotalFocusSeconds()
    const focusHours = Math.round(focusSeconds / 3600)
    const completedTasks = tasks.filter((t) => t.status === 'done').length

    if (focusHours >= 4 && completedTasks >= 3) {
      return `Outstanding productivity today! You've logged ${focusHours}h of deep focus and completed ${completedTasks} key tasks.`
    }
    if (habits.length > 0) {
      return `Maintaining consistent daily habits builds compound momentum. You have ${habits.length} active habits scheduled today.`
    }
    if (tasks.length > 0) {
      return `You have ${tasks.filter((t) => t.status !== 'done').length} pending tasks in your board. Pick one to tackle first.`
    }
    return `Welcome to Shodasha! Create your first task or habit to begin building your personal productivity rhythm.`
  }, [tasks, habits, getTotalFocusSeconds])

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-2">
        <LoadingSkeleton height={20} width="30%" />
        <LoadingSkeleton height={16} width="80%" />
      </div>
    )
  }

  const hasError = taskError || habitError || timeError
  if (hasError) {
    return (
      <ErrorBanner
        title="Insight unavailable"
        message="Could not analyze activity telemetry for insights."
      />
    )
  }

  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-[var(--text-primary)] shadow-xs">
      <div className="p-2 rounded-xl bg-[var(--accent)] text-white shrink-0 mt-0.5 shadow-xs">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
          Daily Reflection
        </span>
        <p className="text-xs font-medium text-[var(--text-primary)] leading-relaxed">
          {insight}
        </p>
      </div>
    </div>
  )
}
