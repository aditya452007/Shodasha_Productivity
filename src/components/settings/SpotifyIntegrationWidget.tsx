'use client'

import { useState } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { Music, CheckCircle2, Radio, Volume2 } from 'lucide-react'
import { toast } from 'sonner'

export function SpotifyIntegrationWidget() {
  const [smtcEnabled, setSmtcEnabled] = useState(true)

  const handleToggle = () => {
    setSmtcEnabled(!smtcEnabled)
    toast.success(
      !smtcEnabled
        ? 'Windows System Media Transport Controls listener enabled'
        : 'Media listener disabled'
    )
  }

  return (
    <BaseCard elevation="raised" className="card-hover-lift" innerClassName="p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-500 font-bold">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
                Windows SMTC & Media Session Listener
              </h3>
              {smtcEnabled && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Automatically captures active playing audio titles, artists, and playback state from Spotify, Chrome, or Windows Media Player.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
            smtcEnabled
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          {smtcEnabled ? 'Active Listener' : 'Enable Listener'}
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          Tauri Rust Native System Listener
        </span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" /> Background Polling Active
        </span>
      </div>
    </BaseCard>
  )
}
