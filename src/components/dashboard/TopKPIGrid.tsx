'use client'

import { Clock, Zap, Target, ClipboardList } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { NumberTicker } from '@/components/ui/NumberTicker'
import { BaseCard } from '@/components/ui/BaseCard'

export function TopKPIGrid() {
  const tasks = useTaskStore((s) => s.tasks)
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  const focusSeconds = useTimeEntryStore((s) => s.totalFocusSecondsToday)
  const kpis = useTimeEntryStore((s) => s.filteredKPIs)
  const dailyGoalHours = useSettingsStore((s) => s.dailyGoalHours)

  // 1. Focus Time
  const focusHours = Math.floor(focusSeconds / 3600)
  const focusMins = Math.floor((focusSeconds % 3600) / 60)
  const goalHours = dailyGoalHours || 6.0

  // 2. Focus Score
  const focusScore = kpis.focusScore

  // 3. Tasks Pending
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length
  const completedTasks = tasks.filter((t) => t.status === 'done').length

  // 4. Habit Consistency
  const todayStr = new Date().toISOString().split('T')[0]
  const completedHabits = habits.filter((h) => !!records[`${h.id}_${todayStr}`]).length
  const totalHabits = habits.length
  const habitRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  const cards = [
    {
      id: 'focus-time',
      title: 'Active Focus Time',
      value: `${focusHours}h ${focusMins}m`,
      numericVal: focusHours,
      subtitle: `Goal: ${goalHours}h Daily`,
      icon: Clock,
      cardClass: 'card-color-emerald',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      badge: 'Tracking',
      dotColor: 'bg-emerald-500',
    },
    {
      id: 'focus-score',
      title: 'Productivity Index',
      value: `${focusScore}%`,
      numericVal: focusScore,
      subtitle: 'Focus Quality Score',
      icon: Zap,
      cardClass: 'card-color-violet',
      iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30',
      badge: 'Live',
      dotColor: 'bg-violet-500',
    },
    {
      id: 'active-tasks',
      title: 'Kanban Tasks',
      value: `${pendingTasks} Pending`,
      numericVal: pendingTasks,
      subtitle: `${completedTasks} Finished Today`,
      icon: ClipboardList,
      cardClass: 'card-color-indigo',
      iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30',
      badge: `${completedTasks} Done`,
      dotColor: 'bg-indigo-500',
    },
    {
      id: 'habit-rate',
      title: 'Habit Consistency',
      value: `${habitRate}%`,
      numericVal: habitRate,
      subtitle: `${completedHabits} of ${totalHabits} Completed`,
      icon: Target,
      cardClass: 'card-color-amber',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      badge: 'Daily',
      dotColor: 'bg-amber-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        const IconComponent = card.icon
        return (
          <BaseCard
            key={card.id}
            elevation="raised"
            className={`card-hover-lift group ${card.cardClass} relative overflow-hidden rounded-2xl`}
            innerClassName="flex items-center justify-between p-5"
          >
            <div className="flex flex-col gap-1 min-w-0 z-10">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${card.dotColor} animate-pulse-glow`} />
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider truncate">
                  {card.title}
                </span>
              </div>
              <div className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                {card.id === 'focus-score' || card.id === 'habit-rate' ? (
                  <span>
                    <NumberTicker value={card.numericVal} />%
                  </span>
                ) : (
                  card.value
                )}
              </div>
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] truncate mt-0.5">
                {card.subtitle}
              </span>
            </div>

            <div className={`p-3.5 rounded-2xl ${card.iconBg} shrink-0 transition-all duration-300 group-hover:scale-110 shadow-xs z-10`}>
              <IconComponent className="w-5 h-5 stroke-[2]" />
            </div>
          </BaseCard>
        )
      })}
    </div>
  )
}

