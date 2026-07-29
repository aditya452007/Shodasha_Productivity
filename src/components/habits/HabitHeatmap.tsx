'use client'

import { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Info } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'

export function HabitHeatmap() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const scrollRef = useRef<HTMLDivElement>(null)

  const heatmapData = useMemo(() => {
    const weeksCount = 24
    const totalDays = weeksCount * 7
    const today = new Date()

    const creationDates = habits.map((h) => h.createdAt.split('T')[0]).sort()
    const globalStartBoundary = creationDates.length > 0 ? creationDates[0] : null

    const days: {
      dateStr: string
      dayOfWeek: number
      count: number
      level: number
      habitNames: string[]
      isBeforeTracking: boolean
      isToday: boolean
    }[] = []

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]

      const isBeforeTracking = globalStartBoundary ? dateStr < globalStartBoundary : false

      const completedHabits: string[] = []
      habits.forEach((h) => {
        const startDate = h.createdAt.split('T')[0]
        if (dateStr >= startDate && records[`${h.id}_${dateStr}`]) {
          completedHabits.push(h.name)
        }
      })

      const count = completedHabits.length
      let level = 0
      if (count === 1) level = 1
      else if (count === 2) level = 2
      else if (count === 3) level = 3
      else if (count >= 4) level = 4

      days.push({
        dateStr,
        dayOfWeek: d.getDay(),
        count,
        level,
        habitNames: completedHabits,
        isBeforeTracking,
        isToday: dateStr === today.toISOString().split('T')[0],
      })
    }

    const weeks: typeof days[] = []
    let currentWeek: typeof days = []

    days.forEach((day, index) => {
      currentWeek.push(day)
      if (currentWeek.length === 7 || index === days.length - 1) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    return { weeks, totalDays }
  }, [habits, records])

  useEffect(() => {
    if (!scrollRef.current || heatmapData.weeks.length === 0) return
    const cellWidth = 20
    const totalWeeks = heatmapData.weeks.length
    scrollRef.current.scrollLeft = Math.max(0, totalWeeks * cellWidth - scrollRef.current.clientWidth / 2)
  }, [heatmapData.weeks.length])

  const cellAccents = ['var(--accent-teal)', 'var(--accent-emerald)', 'var(--accent-blue)', 'var(--accent-indigo)']
  const cellAccentsDark = ['var(--accent-teal)', 'var(--accent-emerald)', 'var(--accent-violet)', 'var(--accent-indigo)']

  const getCellStyle = (level: number) => {
    if (level === 0) return { backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-subtle)' }
    return {
      backgroundColor: cellAccents[level - 1],
      borderColor: 'color-mix(in srgb, var(--bg-base) 40%, transparent)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-teal-muted)', color: 'var(--accent-teal)' }}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
              24-Week Consistency Heatmap
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Historical habit check-in intensity across 168 days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-tertiary)]">
          <span>Less</span>
          <div className="flex gap-1 items-center mx-1">
            <span className="w-3.5 h-3.5 rounded-xs" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }} />
            {cellAccents.map((c, i) => (
              <span key={i} className="w-3.5 h-3.5 rounded-xs" style={{ backgroundColor: c, border: `1px solid color-mix(in srgb, ${c} 60%, transparent)` }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto pb-2 pt-1">
        <div className="flex gap-1.5 min-w-[650px] justify-start">
          {heatmapData.weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <motion.div
                  key={day.dateStr}
                  whileHover={{ scale: 1.4, zIndex: 30 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-3.5 h-3.5 rounded-xs transition-all cursor-pointer relative group ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-[var(--bg-secondary)]' : ''}`}
                  style={{ ...getCellStyle(day.level), border: day.level === 0 ? '1px solid var(--border-subtle)' : 'none' }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                    <div className="bg-gray-950 text-white text-xs font-medium py-1.5 px-3 rounded-xl whitespace-nowrap shadow-2xl border border-gray-800">
                      <div className="font-bold" style={{ color: day.isToday ? 'var(--accent-blue)' : 'var(--accent-teal)' }}>
                        {day.dateStr}{day.isToday ? ' (Today)' : ''}
                      </div>
                      {day.isBeforeTracking ? (
                        <div className="text-gray-400">Before habit tracking started</div>
                      ) : (
                        <>
                      <div className="text-gray-300">
                        {day.count} {day.count === 1 ? 'habit' : 'habits'} completed
                      </div>
                      {day.habitNames.length > 0 && (
                        <div className="text-[10px] text-gray-400 mt-1 border-t border-gray-800 pt-1">
                          {day.habitNames.join(', ')}
                        </div>
                      )}
                      </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-tertiary)] mt-3 border-t border-[var(--border-subtle)] pt-3">
        <Info className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-teal)' }} />
        <span>
          Color intensity reflects habit completion volume — teal to indigo. Today is highlighted with a blue ring.
        </span>
      </div>
    </div>
  )
}
