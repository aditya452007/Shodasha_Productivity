'use client'

import { useState, useEffect } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { Database, ShieldCheck, Download, RefreshCcw } from 'lucide-react'
import { fetchTasksFromDb, fetchHabitsFromDb } from '@/lib/db'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { toast } from 'sonner'

export function MoreIntegrationsWidget() {
  const [stats, setStats] = useState({ tasks: 0, habits: 0, entries: 0 })

  const loadStats = async () => {
    try {
      const [tasks, habits] = await Promise.all([
        fetchTasksFromDb(),
        fetchHabitsFromDb(),
      ])
      const entries = useTimeEntryStore.getState().entries
      setStats({
        tasks: Array.isArray(tasks) ? tasks.length : 0,
        habits: Array.isArray(habits) ? habits.length : 0,
        entries: entries ? entries.length : 0,
      })
    } catch {
      // Fallback
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `shodasha_backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast.success('Database metrics exported to JSON!')
  }

  return (
    <BaseCard
      elevation="raised"
      className="card-hover-lift"
      innerClassName="p-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 text-white rounded-[18px] border border-slate-800 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Local SQLite Status
            </span>
            <h3 className="text-base font-bold font-display text-white mt-1">
              SQLite Database Storage Metrics
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {stats.tasks} Tasks • {stats.habits} Habits • {stats.entries} Time Logs saved in local WAL-mode SQLite database.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJSON}
          className="p-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition-transform active:scale-95 shadow-md flex items-center gap-1.5 text-xs font-bold"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Offline, Local & Encrypted
        </span>
        <button onClick={loadStats} className="font-semibold text-amber-400 hover:underline flex items-center gap-1">
          <RefreshCcw className="w-3 h-3" /> Refresh Stats
        </button>
      </div>
    </BaseCard>
  )
}
