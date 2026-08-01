'use client'

import { useState, useEffect } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { Send, CheckCircle2 } from 'lucide-react'
import { fetchSettingsFromDb, saveSettingsToDb } from '@/lib/db'
import { UserAvatarSVG } from '@/components/ui/SVGAvatars'
import { toast } from 'sonner'

export function JournalingFeatureCard() {
  const [reflection, setReflection] = useState('')
  const [saved, setSaved] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)

  const todayStr = new Date().toISOString().split('T')[0]
  const settingKey = `daily_note_${todayStr}`

  useEffect(() => {
    async function loadNote() {
      const settings = await fetchSettingsFromDb()
      if (settings && settings[settingKey]) {
        setReflection(settings[settingKey])
        setLastSavedTime('Loaded from SQLite')
      }
    }
    loadNote()
  }, [settingKey])

  const handleSave = () => {
    if (!reflection.trim()) return
    setSaved(true)
    saveSettingsToDb({ [settingKey]: reflection })
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    toast.success('Daily reflection saved to local database!')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <BaseCard
      elevation="raised"
      className="card-hover-lift h-full w-full"
      innerClassName="p-5 flex flex-col justify-between bg-[#FFFDF9] dark:bg-[#1E1C19] text-slate-900 dark:text-amber-50 border border-[#F3EAD8] dark:border-[#332E27] rounded-[22px] h-full"
    >
      <div className="flex flex-col justify-between h-full space-y-3">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <UserAvatarSVG className="w-9 h-9 flex-shrink-0 drop-shadow-xs" />
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 dark:text-amber-100 leading-tight">
                  Daily Reflection & Journal
                </h3>
                <span className="text-[11px] font-semibold text-amber-900/60 dark:text-amber-300/70">
                  {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 bg-amber-200/40 dark:bg-amber-900/40 px-2.5 py-1 rounded-full border border-amber-300/50">
              Personal Log
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-amber-200/70 mb-3 leading-relaxed">
            What was your single biggest focus win today? Take 1 minute to reflect.
          </p>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Capture your thoughts, wins, and learnings..."
            rows={3}
            className="w-full text-xs p-3 rounded-xl bg-white dark:bg-[#27231E] border border-[#EDE3D0] dark:border-[#3E3830] text-slate-900 dark:text-amber-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none shadow-xs"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#F3EAD8] dark:border-[#332E27]">
          <span className="text-[11px] text-slate-500 dark:text-amber-200/60 flex items-center gap-1.5 font-medium">
            {lastSavedTime ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Saved {lastSavedTime}</span>
              </>
            ) : (
              'Stored in local SQLite database'
            )}
          </span>

          <button
            onClick={handleSave}
            disabled={!reflection.trim()}
            className="py-2 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            {saved ? 'Saved!' : 'Save Note'}
          </button>
        </div>
      </div>
    </BaseCard>
  )
}
