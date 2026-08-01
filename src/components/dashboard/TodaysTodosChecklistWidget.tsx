'use client'

import { BaseCard } from '@/components/ui/BaseCard'
import { CheckSquare, Square, CheckCircle2, Clock, ClipboardList, AlarmClock } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { motion, useReducedMotion } from 'framer-motion'

function getHoursUntilExpiry(expiresAt?: string): number | null {
  if (!expiresAt) return null
  return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (60 * 60 * 1000))
}

export function TodaysTodosChecklistWidget() {
  const shouldReduceMotion = useReducedMotion()
  const tasks = useTaskStore((s) => s.tasks)
  const toggleTask = useTaskStore((s) => s.toggleTaskStatus)

  const completedCount = tasks.filter((t) => t.status === 'done').length
  const activeTasks = tasks.filter((t) => t.status !== 'done')
  const expiringSoon = activeTasks.filter((t) => {
    const hours = getHoursUntilExpiry(t.expiresAt)
    return hours !== null && hours <= 24
  })

  return (
    <BaseCard
      elevation="raised"
      className="card-hover-lift h-full w-full"
      innerClassName="p-5 flex flex-col justify-between bg-[#FFFDF9] text-slate-900 border border-[#E8DFD1] rounded-[22px] h-full shadow-sm"
    >
      <div className="flex flex-col justify-between h-full space-y-3">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                <CheckSquare className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 leading-tight">
                  Today's Checklist
                </h3>
                <p className="text-[11px] font-medium text-slate-600">
                  {completedCount} of {tasks.length} tasks completed
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-100/80 border border-teal-200 px-2.5 py-0.5 rounded-full">
              Active Tasks
            </span>
          </div>

          {/* Task Items List */}
          <div className="max-h-[280px] overflow-y-auto pr-1 space-y-2 my-2 scrollbar-thin">
            {expiringSoon.length > 0 && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <AlarmClock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-px" />
                <p className="text-[11px] font-semibold leading-snug">
                  {expiringSoon.length === 1
                    ? '1 task expires within 24h — finish it before it is auto-removed.'
                    : `${expiringSoon.length} tasks expire within 24h — finish them before they are auto-removed.`}
                </p>
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="py-8 text-center rounded-xl border border-dashed border-slate-300 bg-white/60">
                <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No todo tasks yet</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[220px] mx-auto leading-relaxed">
                  Add a todo task above — tasks with a 24h duration expire and are auto-removed.
                </p>
              </div>
            ) : (
              tasks.map((task) => {
                const isDone = task.status === 'done'
                const hoursLeft = isDone ? null : getHoursUntilExpiry(task.expiresAt)
                return (
                  <motion.div
                    key={task.id}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-teal-50/90 border-teal-200 text-slate-400 line-through'
                        : 'bg-white border-[#EADFCB] text-slate-900 hover:border-teal-500/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-semibold truncate">{task.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-shrink-0">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {task.dueDate}
                        </span>
                      )}
                      {hoursLeft !== null && hoursLeft > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-bold border ${
                            hoursLeft <= 24
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title="Auto-removed after this task's duration expires"
                        >
                          {hoursLeft <= 24 ? `${hoursLeft}h left` : `${Math.round(hoursLeft / 24)}d left`}
                        </span>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
                          {task.tags[0]}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
