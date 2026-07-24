'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Trash2, Database, AlertTriangle, CheckCircle2, ShieldAlert, X, FileSpreadsheet } from 'lucide-react'
import { useSettingsStore, DataRetentionPeriod } from '@/stores/settingsStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'
import { clearDatabaseInDb } from '@/lib/db'
import { toast } from 'sonner'

export function DataManagement() {
  const { dataRetentionPeriod, setDataRetentionPeriod } = useSettingsStore()
  const { entries, categories } = useTimeEntryStore()
  const { habits, records } = useHabitStore()
  const { tasks } = useTaskStore()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmStage, setConfirmStage] = useState<1 | 2>(1)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Handle Export CSV Generation
  const handleExportCSV = () => {
    // 1. Time Entries CSV Header & Rows
    const timeHeaders = 'ID,App Name,Window Title,Start Time,End Time,End Reason,Duration (Seconds),Category,Linked Task ID\n'
    const timeRows = entries
      .map((e) => {
        const cat = categories[e.appName] || 'neutral'
        const titleEscaped = `"${(e.windowTitle || '').replace(/"/g, '""')}"`
        return `${e.id},${e.appName},${titleEscaped},${e.startTime},${e.endTime || ''},${e.endReason || ''},${e.durationSeconds || 0},${cat},${e.linkedTaskId || ''}`
      })
      .join('\n')

    // 2. Habit Records CSV Header & Rows
    const habitHeaders = 'Habit ID,Date,Done\n'
    const habitRows = Object.entries(records)
      .filter(([_, isDone]) => isDone)
      .map(([key, isDone]) => {
        const parts = key.split('_')
        const habitId = parts[0]
        const date = parts.slice(1).join('_')
        return `${habitId},${date},${isDone ? 1 : 0}`
      })
      .join('\n')

    // Combine into full CSV content
    const csvContent = `data:text/csv;charset=utf-8,--- SHODASHA TIME ENTRIES ---\n${timeHeaders}${timeRows}\n\n--- SHODASHA HABIT RECORDS ---\n${habitHeaders}${habitRows}`

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `shodasha_activity_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  const handleClearDatabase = async () => {
    if (confirmStage === 1) {
      setConfirmStage(2)
      return
    }
    try {
      await clearDatabaseInDb()
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
      useTaskStore.setState({
        tasks: [],
        columns: [
          { id: 'todo', name: 'To Do', order: 0 },
          { id: 'in_progress', name: 'In Progress', order: 1 },
          { id: 'done', name: 'Done', order: 2 },
        ],
      })
      useHabitStore.setState({ habits: [], records: {} })
      useTimeEntryStore.setState({ entries: [] })

      toast.success('Database cleared successfully.')
      setIsConfirmOpen(false)
      setConfirmStage(1)
    } catch (err: any) {
      toast.error('Failed to clear database: ' + (err?.message || String(err)))
    }
  }

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
      <div className="rounded-[calc(2.25rem-0.5rem)] bg-[var(--bg-surface)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20">
              Storage & Export
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Data Management & Retention
          </h2>
          <p className="text-xs text-[var(--text-tertiary)]">
            Control local SQLite database retention policies, export complete activity logs to CSV, or clear recorded state.
          </p>
        </div>

        <div className="flex flex-col gap-5 divide-y divide-[var(--border-subtle)]">
          {/* Data Retention Select */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-violet-500">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Automatic Data Retention Pruning
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Time entries older than the selected threshold will be automatically purged on app startup
                </span>
              </div>
            </div>

            <select
              value={dataRetentionPeriod}
              onChange={(e) => setDataRetentionPeriod(e.target.value as DataRetentionPeriod)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="1_month">1 Month</option>
              <option value="3_months">3 Months</option>
              <option value="6_months">6 Months (Default)</option>
              <option value="indefinite">Keep Indefinitely</option>
            </select>
          </div>

          {/* Export Activity CSV */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-emerald-500">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Export Activity Data (.CSV)
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Download complete dump of recorded time entries, app statistics, and habit check-ins
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="group inline-flex items-center justify-between gap-3 pl-4 pr-1.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md shadow-emerald-600/20 transition-all duration-300 active:scale-[0.98]"
            >
              <span>{exportSuccess ? 'Exported!' : 'Export Activity CSV'}</span>
              <span className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
                {exportSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              </span>
            </button>
          </div>

          {/* Danger Zone: Clear SQLite Database */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  Danger Zone: Reset Database
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Permanently delete all stored activity logs, tasks, habits, and app category tags
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setConfirmStage(1)
                setIsConfirmOpen(true)
              }}
              className="group inline-flex items-center justify-between gap-3 pl-4 pr-1.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-md shadow-rose-600/20 transition-all duration-300 active:scale-[0.98]"
            >
              <span>Clear Database</span>
              <span className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
                <Trash2 className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Double Confirmation Dialog Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="w-full max-w-md p-2 rounded-[2rem] bg-rose-950/30 border border-rose-500/30 shadow-2xl"
            >
              <div className="rounded-[calc(2rem-0.5rem)] bg-[var(--bg-surface)] p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="text-base font-bold">
                      {confirmStage === 1 ? 'Confirm Database Reset' : 'FINAL WARNING'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="p-1 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-stone-500/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {confirmStage === 1 ? (
                  <div className="flex flex-col gap-3 text-xs text-[var(--text-secondary)]">
                    <p>
                      Are you sure you want to clear your local Shodasha SQLite database? This will permanently delete:
                    </p>
                    <ul className="list-disc list-inside font-semibold text-[var(--text-primary)] space-y-1">
                      <li>{entries.length} Time Entry Session Logs</li>
                      <li>{habits.length} Habits & Check-in Records</li>
                      <li>{tasks.length} Kanban Board Tasks</li>
                      <li>All Custom App Category Rules</li>
                    </ul>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-300 font-medium">
                    This action is <strong>IRREVERSIBLE</strong>. All local data will be wiped immediately and the application will reload.
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:bg-stone-500/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearDatabase}
                    className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] shadow-md shadow-rose-600/20"
                  >
                    {confirmStage === 1 ? 'Yes, Proceed' : 'Wipe All Data Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
