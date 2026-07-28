'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Link as LinkIcon,
  Trash2,
  Edit2,
  Calendar as CalendarIcon,
  ExternalLink,
} from 'lucide-react'
import { useHabitStore, Habit } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'
import { openExternalUrl } from '@/lib/utils/url'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

import { useReducedMotion } from 'framer-motion'

interface HabitCalendarProps {
  onOpenAddModal: () => void
  onOpenEditModal: (habit: Habit) => void
}

export function HabitCalendar({ onOpenAddModal, onOpenEditModal }: HabitCalendarProps) {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const toggleHabit = useHabitStore((s) => s.toggleHabit)
  const deleteHabit = useHabitStore((s) => s.deleteHabit)
  const isLoading = useHabitStore((s) => s.isLoading)
  const error = useHabitStore((s) => s.error)
  const tasks = useTaskStore((s) => s.tasks)
  const shouldReduceMotion = useReducedMotion()

  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Calculate days in the current month
  const daysInMonth = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate()
    const days: { dateStr: string; dayNum: number; dayOfWeek: string; isToday: boolean }[] = []
    const todayStr = new Date().toISOString().split('T')[0]

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day)
      // Format as YYYY-MM-DD cleanly using local numbers
      const mStr = String(month + 1).padStart(2, '0')
      const dStr = String(day).padStart(2, '0')
      const dateStr = `${year}-${mStr}-${dStr}`

      days.push({
        dateStr,
        dayNum: day,
        dayOfWeek: dayLabels[d.getDay()],
        isToday: dateStr === todayStr,
      })
    }
    return days
  }, [year, month])

  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-4">
        <LoadingSkeleton height={32} width="35%" />
        <LoadingSkeleton height={180} />
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load habit calendar" message={error} />
  }

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xs overflow-hidden">
      {/* Calendar Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--text-primary)]">
              {monthLabel}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Click any cell to log or unlog a habit check-in
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
          >
            Today
          </button>

          <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Habit
          </button>
        </div>
      </div>

      {/* Habits Matrix Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          {/* Days Header */}
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30 text-xs font-medium text-[var(--text-secondary)]">
              <th className="py-3 px-4 w-64 min-w-[220px] font-semibold text-[var(--text-primary)]">
                Habit
              </th>
              {daysInMonth.map((day) => (
                <th
                  key={day.dateStr}
                  className={`py-2 px-1 text-center min-w-[32px] ${
                    day.isToday ? 'bg-[var(--accent)]/10 font-bold text-[var(--accent)]' : ''
                  }`}
                >
                  <div className="text-[10px] uppercase text-[var(--text-tertiary)]">
                    {day.dayOfWeek}
                  </div>
                  <div className={`text-xs mt-0.5 ${day.isToday ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {day.dayNum}
                  </div>
                </th>
              ))}
              <th className="py-3 px-3 text-right font-medium text-[var(--text-tertiary)] w-24">
                Rate
              </th>
            </tr>
          </thead>

          {/* Habit Rows */}
          <tbody>
            <AnimatePresence mode="popLayout">
              {habits.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth.length + 2} className="py-12 text-center text-[var(--text-secondary)]">
                    <p className="text-sm">No habits created yet.</p>
                    <button
                      onClick={onOpenAddModal}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create your first habit
                    </button>
                  </td>
                </tr>
              ) : (
                habits.map((habit, habitIndex) => {
                  const linkedTask = tasks.find((t) => t.id === habit.linkedTaskId)

                  // Compute monthly completion rate for this habit (only since creation)
                  const startDate = habit.createdAt.split('T')[0]
                  const eligibleDaysInMonth = daysInMonth.filter((d) => d.dateStr >= startDate)
                  const doneCountInMonth = eligibleDaysInMonth.filter(
                    (d) => !!records[`${habit.id}_${d.dateStr}`]
                  ).length
                  const completionPercentage = eligibleDaysInMonth.length > 0
                    ? Math.round((doneCountInMonth / eligibleDaysInMonth.length) * 100)
                    : 0

                  return (
                    <motion.tr
                      key={habit.id}
                      layout
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.23, 1, 0.32, 1],
                        delay: shouldReduceMotion ? 0 : Math.min(habitIndex * 0.05, 0.3),
                      }}
                      className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)]/20 transition-colors group"
                    >
                      {/* Habit Name & Metadata Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: habit.color }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                                  {habit.name}
                                </span>
                                {habit.url && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openExternalUrl(habit.url)
                                    }}
                                    aria-label={`Open link for ${habit.name} in default browser`}
                                    className="p-1 rounded-md text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors shrink-0"
                                    title={`Open ${habit.url} in browser`}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              {linkedTask && (
                                <div className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] truncate mt-0.5">
                                  <LinkIcon className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{linkedTask.title}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions (Edit/Delete) */}
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                            <button
                              onClick={() => onOpenEditModal(habit)}
                              aria-label={`Edit ${habit.name}`}
                              className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                              title="Edit Habit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              aria-label={`Delete ${habit.name}`}
                              className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
                              title="Delete Habit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Days Checkbox Cells */}
                      {daysInMonth.map((day) => {
                          const isDone = !!records[`${habit.id}_${day.dateStr}`]
                          const todayStr = new Date().toISOString().split('T')[0]
                          const isFuture = day.dateStr > todayStr
                          const isPast = day.dateStr < todayStr
                          const startDate = habit.createdAt.split('T')[0]
                          const isBeforeStart = day.dateStr < startDate

                          return (
                            <td
                              key={day.dateStr}
                              className={`py-2 px-1 text-center align-middle ${
                                day.isToday ? 'bg-[var(--accent)]/5' : ''
                              }`}
                            >
                              {isBeforeStart ? (
                                <div
                                  className="w-6 h-6 mx-auto rounded-md flex items-center justify-center border border-dashed border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/20 opacity-40 cursor-default"
                                  title={`${habit.name}: Habit started on ${startDate}`}
                                >
                                  <span className="text-[10px] text-[var(--text-tertiary)]">—</span>
                                </div>
                              ) : (
                              <button
                                disabled={isFuture}
                                onClick={() => {
                                  if (isFuture) return
                                  if (isPast && !isDone) {
                                    toast('Logging past habit', {
                                      description: `${habit.name} for ${day.dateStr}`,
                                      duration: 2000,
                                    })
                                  }
                                  toggleHabit(habit.id, day.dateStr)
                                }}
                                className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-all focus:outline-hidden ${
                                  isFuture
                                    ? 'opacity-30 cursor-not-allowed border border-[var(--border)] bg-[var(--bg-tertiary)]/40'
                                    : isDone
                                    ? 'shadow-xs scale-100'
                                    : isPast
                                    ? 'border border-dashed border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                                    : 'border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                                }`}
                              style={{
                                backgroundColor: isDone && !isFuture ? habit.color : undefined,
                                borderColor: isDone && !isFuture ? habit.color : undefined,
                              }}
                              title={
                                isFuture
                                  ? `${habit.name} - ${day.dateStr}: Future date disabled`
                                  : `${habit.name} - ${day.dateStr}: ${isDone ? 'Done' : 'Not done'}`
                              }
                            >
                              {isDone && !isFuture && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                >
                                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                </motion.div>
                              )}
                            </button>
                              )}
                          </td>
                        )
                      })}

                      {/* Monthly Completion Rate Column */}
                      <td className="py-3 px-3 text-right">
                        <span className="text-xs font-semibold font-display text-[var(--text-secondary)]">
                          {completionPercentage}%
                        </span>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
