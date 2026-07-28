'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, Info } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'

export function HabitHeatmap() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  // Build 24 weeks (~168 days) dataset for optimal desktop display
  const heatmapData = useMemo(() => {
    const weeksCount = 24
    const totalDays = weeksCount * 7
    const today = new Date()

    // Find earliest habit creation date
    const creationDates = habits.map((h) => h.createdAt.split('T')[0]).sort()
    const globalStartBoundary = creationDates.length > 0 ? creationDates[0] : null

    const days: {
      dateStr: string
      dayOfWeek: number // 0 = Sun, 1 = Mon, etc.
      count: number
      level: number // 0, 1, 2, 3, 4
      habitNames: string[]
      isBeforeTracking: boolean
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
      })
    }

    // Group into 7-day columns (weeks)
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

  // Color mappings for high-contrast vibrant intensity levels in light & dark mode
  const getCellBg = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-300 dark:bg-emerald-900 border-emerald-400 dark:border-emerald-700 shadow-xs'
      case 2:
        return 'bg-emerald-400 dark:bg-emerald-700 border-emerald-500 dark:border-emerald-600 shadow-xs'
      case 3:
        return 'bg-emerald-500 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-400 shadow-xs'
      case 4:
        return 'bg-emerald-700 dark:bg-emerald-400 border-emerald-800 dark:border-emerald-300 shadow-xs font-bold'
      default:
        return 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)]'
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-tertiary)]">
          <span>Less</span>
          <div className="flex gap-1 items-center mx-1">
            <span className="w-3.5 h-3.5 rounded-xs bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-300 dark:bg-emerald-900 border border-emerald-400" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-400 dark:bg-emerald-700 border border-emerald-500" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 dark:bg-emerald-500 border border-emerald-600" />
            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-700 dark:bg-emerald-400 border border-emerald-800" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex gap-1.5 min-w-[650px] justify-between">
          {heatmapData.weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <motion.div
                  key={day.dateStr}
                  whileHover={{ scale: 1.4, zIndex: 30 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-3.5 h-3.5 rounded-xs border transition-all cursor-pointer relative group ${getCellBg(
                    day.level
                  )}`}
                >
                  {/* Tooltip on Hover directly over cell */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                    <div className="bg-gray-950 text-white text-xs font-medium py-1.5 px-3 rounded-xl whitespace-nowrap shadow-2xl border border-gray-800">
                      <div className="font-bold text-emerald-400">
                        {day.dateStr}
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
        <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>
          Darker green cells represent days with higher habit completion volume.
        </span>
      </div>
    </div>
  )
}
