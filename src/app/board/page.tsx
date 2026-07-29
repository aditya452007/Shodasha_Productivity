'use client'

import { useState, useMemo } from 'react'
import { KanbanBoard } from '@/components/board/KanbanBoard'
import { useTaskStore } from '@/stores/taskStore'
import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BaseCard } from '@/components/ui/BaseCard'

export default function BoardPage() {
  const shouldReduceMotion = useReducedMotion()
  const tasks = useTaskStore((state) => state.tasks)
  const [viewHistory, setViewHistory] = useState(false)
  const [historyDate, setHistoryDate] = useState(() => new Date())

  const todayStr = new Date().toISOString().split('T')[0]

  const completedByDate = useMemo(() => {
    const map = new Map<string, number>()
    tasks
      .filter((t) => t.status === 'done')
      .forEach((t) => {
        const dateKey = t.updatedAt.split('T')[0]
        map.set(dateKey, (map.get(dateKey) || 0) + 1)
      })
    return map
  }, [tasks])

  const historyDays = useMemo(() => {
    const days: { dateStr: string; count: number; isToday: boolean; dayLabel: string }[] = []
    const year = historyDate.getFullYear()
    const month = historyDate.getMonth()
    const totalDays = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day)
      const mStr = String(month + 1).padStart(2, '0')
      const dStr = String(day).padStart(2, '0')
      const dateStr = `${year}-${mStr}-${dStr}`
      days.push({
        dateStr,
        count: completedByDate.get(dateStr) || 0,
        isToday: dateStr === todayStr,
        dayLabel: d.toLocaleDateString(undefined, { weekday: 'short' }),
      })
    }
    return days
  }, [historyDate, completedByDate, todayStr])

  const monthLabel = historyDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto pb-16"
    >
      <KanbanBoard />

      {/* Task History Section */}
      <BaseCard elevation="raised" className="card-hover-lift overflow-hidden" innerClassName="p-0">
        <button
          onClick={() => setViewHistory(!viewHistory)}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-tertiary)]/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                Completed Tasks History
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                View daily completed task count across months
              </p>
            </div>
          </div>
          <div className={`transform transition-transform ${viewHistory ? 'rotate-180' : ''}`}>
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
          </div>
        </button>

        {viewHistory && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">{monthLabel}</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5">
                <button
                  onClick={() => setHistoryDate(new Date(historyDate.getFullYear(), historyDate.getMonth() - 1, 1))}
                  className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHistoryDate(new Date())}
                  className="px-2 py-1 text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Today
                </button>
                <button
                  onClick={() => setHistoryDate(new Date(historyDate.getFullYear(), historyDate.getMonth() + 1, 1))}
                  className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1.5 min-w-[280px]">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-center text-[10px] font-semibold text-[var(--text-tertiary)] uppercase py-1">
                    {d}
                  </div>
                ))}
                {historyDays.map((day) => (
                  <div
                    key={day.dateStr}
                    className={`flex flex-col items-center justify-center rounded-lg py-2 px-1 transition-colors ${
                      day.isToday
                        ? 'bg-blue-500/10 ring-1 ring-blue-500/30'
                        : day.count > 0
                        ? 'bg-emerald-500/10'
                        : 'bg-[var(--bg-tertiary)]/30'
                    }`}
                  >
                    <span className={`text-xs font-medium ${
                      day.isToday ? 'text-blue-500 font-bold' : 'text-[var(--text-primary)]'
                    }`}>
                      {day.dateStr.split('-')[2]}
                    </span>
                    {day.count > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                        <span className="text-[9px] font-semibold text-emerald-500">{day.count}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-tertiary)]">
              Total completed this month: {historyDays.reduce((s, d) => s + d.count, 0)} tasks
            </div>
          </div>
        )}
      </BaseCard>
    </motion.div>
  )
}
