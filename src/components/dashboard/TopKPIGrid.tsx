'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Clock, Zap, CheckCircle2, Target, BookOpen, Calendar, ClipboardList } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { NumberTicker } from '@/components/ui/NumberTicker'

export function TopKPIGrid() {
  const shouldReduceMotion = useReducedMotion()

  const tasks = useTaskStore((s) => s.tasks)
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  const getTotalFocusSeconds = useTimeEntryStore((s) => s.getTotalFocusSecondsToday)
  const getKPIsFiltered = useTimeEntryStore((s) => s.getKPIsFiltered)
  const dailyGoalHours = useSettingsStore((s) => s.dailyGoalHours)

  // 1. Focus Time
  const focusSeconds = getTotalFocusSeconds()
  const focusHours = Math.floor(focusSeconds / 3600)
  const focusMins = Math.floor((focusSeconds % 3600) / 60)
  const goalHours = dailyGoalHours || 6.0

  // 2. Focus Score
  const kpis = getKPIsFiltered()
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
      title: 'Focus Time Today',
      value: `${focusHours}h ${focusMins}m`,
      numericVal: focusHours,
      subtitle: `Target: ${goalHours}h Daily`,
      icon: Clock,
      color: '#0284c7', // Sky Blue
      bgColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      id: 'focus-score',
      title: 'Focus Score',
      value: `${focusScore}%`,
      numericVal: focusScore,
      subtitle: 'Productivity Index',
      icon: Zap,
      color: '#7c3aed', // Violet / Purple
      bgColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    },
    {
      id: 'active-tasks',
      title: 'Tasks Pending',
      value: `${pendingTasks}`,
      numericVal: pendingTasks,
      subtitle: `${completedTasks} Completed Today`,
      icon: ClipboardList,
      color: '#d97706', // Amber
      bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'habit-rate',
      title: 'Habit Consistency',
      value: `${habitRate}%`,
      numericVal: habitRate,
      subtitle: `${completedHabits} of ${totalHabits} Done Today`,
      icon: Target,
      color: '#059669', // Emerald
      bgColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.23, 1, 0.32, 1],
              delay: shouldReduceMotion ? 0 : index * 0.06,
            }}
            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xs hover:border-[var(--border-default)] transition-all group"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-semibold text-[var(--text-secondary)] truncate">
                {card.title}
              </span>
              <div className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {card.id === 'focus-score' || card.id === 'habit-rate' ? (
                  <span>
                    <NumberTicker value={card.numericVal} />%
                  </span>
                ) : (
                  card.value
                )}
              </div>
              <span className="text-[11px] text-[var(--text-tertiary)] truncate">
                {card.subtitle}
              </span>
            </div>

            <div className={`p-3 rounded-2xl ${card.bgColor} shrink-0 transition-transform group-hover:scale-105`}>
              <IconComponent className="w-5 h-5 stroke-[2]" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
