'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
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
  Bell,
} from 'lucide-react'
import { useHabitStore, Habit, HabitPriority, GENERAL_CATEGORY } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'
import { openExternalUrl } from '@/lib/utils/url'
import { getHabitHp, HP_HEAL_BY_PRIORITY, HpBand } from '@/lib/utils/habitHealth'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { BaseCard } from '@/components/ui/BaseCard'
import { useReducedMotion } from 'framer-motion'

const PRIORITY_LABEL: Record<HabitPriority, string> = { high: 'High', medium: 'Med', low: 'Low' }

const PRIORITY_BADGE_STYLE: Record<HabitPriority, string> = {
  high: 'text-[var(--error)] border-[var(--error)]/30 bg-[var(--error)]/10',
  medium: 'text-[var(--accent-amber)] border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/10',
  low: 'text-[var(--success)] border-[var(--success)]/30 bg-[var(--success)]/10',
}

const HP_BAR_COLOR: Record<HpBand, string> = {
  healthy: 'var(--success)',
  low: 'var(--accent-amber)',
  critical: 'var(--error)',
  depleted: 'var(--error)',
}

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
  const categories = useHabitStore((s) => s.habitCategories)
  const tasks = useTaskStore((s) => s.tasks)
  const shouldReduceMotion = useReducedMotion()

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  )

  const [currentDate, setCurrentDate] = useState(() => new Date())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  const daysInMonth = useMemo(() => {
    const totalDays = new Date(year, month + 1, 0).getDate()
    const days: { dateStr: string; dayNum: number; dayOfWeek: string; isToday: boolean }[] = []

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day)
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
  }, [year, month, todayStr])

  useEffect(() => {
    if (!scrollContainerRef.current || daysInMonth.length === 0) return
    const todayIndex = daysInMonth.findIndex((d) => d.isToday)
    if (todayIndex < 0) return
    const cellWidth = 36
    const headerOffset = 240
    const containerWidth = scrollContainerRef.current.clientWidth
    const targetScroll = todayIndex * cellWidth - (containerWidth - headerOffset) / 2 + cellWidth / 2
    scrollContainerRef.current.scrollLeft = Math.max(0, targetScroll)
  }, [daysInMonth])

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

  const canEditDate = (dateStr: string): boolean => {
    const twoDaysAgo = new Date(todayStr + 'T00:00:00')
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0]
    return dateStr >= twoDaysAgoStr && dateStr <= todayStr
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
    <BaseCard elevation="raised" className="card-hover-lift overflow-hidden" innerClassName="p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-rose-muted)', color: 'var(--accent-rose)' }}>
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

      <div className="relative overflow-hidden">
        <div ref={scrollContainerRef} className="overflow-auto max-h-[540px] overscroll-contain pb-2">
          <table className="w-full text-left border-collapse" style={{ minWidth: `${daysInMonth.length * 36 + 240}px` }}>
            <thead className="sticky top-0 z-30">
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-secondary)]">
                <th className="sticky left-0 z-40 py-3 px-4 w-64 min-w-[220px] font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)]">
                  Habit
                </th>
                {daysInMonth.map((day) => (
                  <th
                    key={day.dateStr}
                    className={`py-2 px-1 text-center min-w-[32px] bg-[var(--bg-secondary)] ${
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
                <th className="sticky right-0 z-40 py-3 px-3 text-right font-medium text-[var(--text-tertiary)] w-24 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] shadow-[-2px_0_8px_-4px_rgba(0,0,0,0.08)]">
                  Rate
                </th>
              </tr>
            </thead>

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

                    const startDate = habit.createdAt.split('T')[0]
                    const eligibleDaysInMonth = daysInMonth.filter((d) => d.dateStr >= startDate)
                    const doneCountInMonth = eligibleDaysInMonth.filter(
                      (d) => !!records[`${habit.id}_${d.dateStr}`]
                    ).length
                    const completionPercentage = eligibleDaysInMonth.length > 0
                      ? Math.round((doneCountInMonth / eligibleDaysInMonth.length) * 100)
                      : 0

                    const habitHp = getHabitHp(habit, records)
                    const habitCategory =
                      habit.category && habit.category !== GENERAL_CATEGORY
                        ? categoryById[habit.category]
                        : null
                    const categoryColor = habitCategory?.color ?? 'var(--text-tertiary)'
                    const categoryLabel = habitCategory?.name ?? 'General'

                    return (
                      <motion.tr
                        key={habit.id}
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
                        <td className="sticky left-0 z-10 py-3 px-4 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] shadow-[2px_0_8px_-4px_rgba(0,0,0,0.06)]">
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
                                  <span
                                    className={`inline-flex items-center px-1.5 py-px rounded-md border text-[10px] font-semibold shrink-0 ${PRIORITY_BADGE_STYLE[habit.priority]}`}
                                    title={`Priority: ${PRIORITY_LABEL[habit.priority]}`}
                                  >
                                    {PRIORITY_LABEL[habit.priority]}
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
                                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                  <span
                                    className="inline-flex items-center gap-1 px-1.5 py-px rounded-md border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50 text-[10px] font-medium text-[var(--text-secondary)]"
                                    title={`Category: ${categoryLabel}`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: categoryColor }} />
                                    <span className="truncate max-w-[96px]">{categoryLabel}</span>
                                  </span>
                                  {habit.reminderTime && (
                                    <span
                                      className="inline-flex items-center gap-1 px-1.5 py-px rounded-md border border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/10 text-[10px] font-medium text-[var(--accent-amber)]"
                                      title={`Daily reminder at ${habit.reminderTime} — Shodasha will nudge you (and catch up if missed)`}
                                    >
                                      <Bell className="w-2.5 h-2.5" />
                                      {habit.reminderTime}
                                    </span>
                                  )}
                                </div>
                                {linkedTask && (
                                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] truncate mt-0.5">
                                    <LinkIcon className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{linkedTask.title}</span>
                                  </div>
                                )}
                                <div
                                  className="flex items-center gap-1.5 mt-1"
                                  title={`HP: ${habitHp.hp}/100 — check in to heal ${HP_HEAL_BY_PRIORITY[habit.priority]} HP`}
                                >
                                  <div className="h-1 w-16 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-width"
                                      style={{
                                        width: `${habitHp.hp}%`,
                                        backgroundColor: HP_BAR_COLOR[habitHp.band],
                                      }}
                                    />
                                  </div>
                                  {habitHp.band === 'depleted' ? (
                                    <span className="text-[10px] font-semibold text-[var(--error)] leading-none">
                                      Depleted
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono text-[var(--text-tertiary)] leading-none">
                                      {habitHp.hp}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

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

                        {daysInMonth.map((day) => {
                            const isDone = !!records[`${habit.id}_${day.dateStr}`]
                            const isFuture = day.dateStr > todayStr
                            const isBeforeStart = day.dateStr < startDate
                            const editable = canEditDate(day.dateStr) && !isFuture

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
                                  disabled={!editable}
                                  onClick={() => {
                                    if (!editable) {
                                      toast('Past habits are locked', {
                                        description: `You can only edit habits from the last 2 days.`,
                                        duration: 2000,
                                      })
                                      return
                                    }
                                    toggleHabit(habit.id, day.dateStr)
                                  }}
                                  className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-colors focus:outline-hidden ${
                                    !editable
                                      ? 'opacity-30 cursor-not-allowed border border-[var(--border)] bg-[var(--bg-tertiary)]/40'
                                      : isDone
                                      ? 'shadow-xs scale-100'
                                      : 'border border-dashed border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                                  }`}
                                  style={{
                                    backgroundColor: isDone && editable ? habit.color : undefined,
                                    borderColor: isDone && editable ? habit.color : undefined,
                                  }}
                                  title={
                                    !editable
                                      ? `${habit.name} - ${day.dateStr}: Past days are locked (2-day limit)`
                                      : isFuture
                                      ? `${habit.name} - ${day.dateStr}: Future date disabled`
                                      : `${habit.name} - ${day.dateStr}: ${isDone ? 'Done' : 'Not done'}`
                                  }
                                >
                                  {isDone && editable && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
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

                        <td className="sticky right-0 z-10 py-3 px-3 text-right bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] shadow-[-2px_0_8px_-4px_rgba(0,0,0,0.06)]">
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
    </BaseCard>
  )
}
