'use client'

import { BaseCard } from '@/components/ui/BaseCard'
import { Calendar, Clock, Coffee, Laptop } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'

export function TimeSlotScheduleStripWidget() {
  const selectedDate = useTimeEntryStore((s) => s.selectedDate)
  const getActivePeriods = useTimeEntryStore((s) => s.getActivePeriods)

  const activePeriods = getActivePeriods(selectedDate).slice(0, 4)

  const formatDurationText = (seconds: number) => {
    const mins = Math.round(seconds / 60)
    if (mins >= 60) {
      const hrs = (mins / 60).toFixed(1)
      return `${hrs}h`
    }
    return `${mins}m`
  }

  return (
    <BaseCard elevation="raised" className="card-hover-lift h-full" innerClassName="p-5 flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-[var(--text-primary)]">
                Active Schedule Stream
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Logged Win32 foreground app blocks</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
            {selectedDate}
          </span>
        </div>

        {/* Time-Slot Event Stream */}
        <div className="space-y-3 mt-3">
          {activePeriods.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-tertiary)]">
              No window activity recorded for this date yet. Foreground app logs will stream here!
            </div>
          ) : (
            activePeriods.map((item) => {
              if (item.isGap) {
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-secondary)]/30 text-[var(--text-secondary)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Coffee className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold">Idle / Sleep Break Gap</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                      {item.startTime} - {item.endTime} ({item.durationHours.toFixed(1)}h)
                    </span>
                  </div>
                )
              }

              const isWork = item.topAppCategory === 'work'
              const isDistraction = item.topAppCategory === 'distraction'

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between ${
                    isWork
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                      : isDistraction
                      ? 'bg-gradient-to-r from-rose-600 to-red-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20 text-white">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{item.topAppName}</h4>
                      <p className="text-[10px] opacity-90 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.startTime} - {item.endTime}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                    {formatDurationText(item.durationSeconds)}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)] mt-3">
        <span>Passive Windows Activity Stream</span>
        <span className="font-semibold text-emerald-500">SQLite Logged</span>
      </div>
    </BaseCard>
  )
}
