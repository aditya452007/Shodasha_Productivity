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

    const days: {
      dateStr: string
      dayOfWeek: number // 0 = Sun, 1 = Mon, etc.
      count: number
      level: number // 0, 1, 2, 3, 4
      habitNames: string[]
    }[] = []

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]

      const completedHabits: string[] = []
      habits.forEach((h) => {
        if (records[`${h.id}_${dateStr}`]) {
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

  // Color mappings for intensity levels matching Emerald palette
  const getCellBg = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800'
      case 2:
        return 'bg-emerald-400 dark:bg-emerald-700/80 border-emerald-500 dark:border-emerald-600'
      case 3:
        return 'bg-[var(--accent-emerald)] border-emerald-600'
      case 4:
        return 'bg-emerald-800 dark:bg-emerald-500 border-emerald-900'
      default:
        return 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)]'
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
              Habit Consistency Heatmap
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Daily habit check-in intensity over the past 24 weeks
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
          <span>Less</span>
          <div className="flex gap-1 items-center mx-1">
            <span className="w-3 h-3 rounded-xs bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]" />
            <span className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-950/80" />
            <span className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-700/80" />
            <span className="w-3 h-3 rounded-xs bg-[var(--accent-emerald)]" />
            <span className="w-3 h-3 rounded-xs bg-emerald-800 dark:bg-emerald-500" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-[650px] justify-between">
          {heatmapData.weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <motion.div
                  key={day.dateStr}
                  whileHover={{ scale: 1.35, zIndex: 10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className={`w-3.5 h-3.5 rounded-xs border transition-colors cursor-pointer relative group ${getCellBg(
                    day.level
                  )}`}
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                    <div className="bg-gray-900 text-white text-[11px] font-medium py-1.5 px-2.5 rounded-md whitespace-nowrap shadow-lg border border-gray-800">
                      <div className="font-semibold text-emerald-400">
                        {day.dateStr}
                      </div>
                      <div className="text-gray-300">
                        {day.count} {day.count === 1 ? 'habit' : 'habits'} completed
                      </div>
                      {day.habitNames.length > 0 && (
                        <div className="text-[10px] text-gray-400 mt-1 border-t border-gray-800 pt-1">
                          • {day.habitNames.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] mt-3 border-t border-[var(--border-subtle)] pt-3">
        <Info className="w-3.5 h-3.5 text-[var(--accent-emerald)] shrink-0" />
        <span>
          Darker green cells represent days with higher habit completion counts.
        </span>
      </div>
    </div>
  )
}
