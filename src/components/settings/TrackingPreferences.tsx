'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, Moon, Power, ShieldCheck } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

export function TrackingPreferences() {
  const {
    pollingInterval,
    setPollingInterval,
    idleDetectionEnabled,
    setIdleDetectionEnabled,
    autoStartEnabled,
    setAutoStartEnabled,
  } = useSettingsStore()

  const sliderPercentage = ((pollingInterval - 5) / (60 - 5)) * 100

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
      <div className="rounded-[calc(2.25rem-0.5rem)] bg-[var(--bg-surface)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20">
              Windows Activity Tracker
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Tracking & Engine Preferences
          </h2>
          <p className="text-xs text-[var(--text-tertiary)]">
            Configure how the Rust background service captures active foreground window titles and handles idle system states.
          </p>
        </div>

        <div className="flex flex-col gap-5 divide-y divide-[var(--border-subtle)]">
          {/* Polling Interval Slider */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-[var(--accent)]">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Polling Frequency Interval
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    How frequently the tracker queries the Win32 GetForegroundWindow API
                  </span>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-[var(--accent)] bg-[var(--accent-muted)] px-3 py-1 rounded-full border border-[var(--accent)]/20">
                {pollingInterval}s
              </span>
            </div>

            <div className="relative flex items-center h-6 w-full touch-none select-none">
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={pollingInterval}
                onChange={(e) => setPollingInterval(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-stone-200 dark:bg-stone-800 accent-[var(--accent)] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${sliderPercentage}%, var(--bg-surface-elevated, #27272a) ${sliderPercentage}%, var(--bg-surface-elevated, #27272a) 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-tertiary)] px-1">
              <span>5s (High Precision)</span>
              <span>30s (Default)</span>
              <span>60s (Battery Saver)</span>
            </div>
          </div>

          {/* Idle / Lock Screen Detection Toggle */}
          <div className="flex items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-amber-500">
                <Moon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Idle & Lock Screen Detection
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Automatically mark entries as 'idle' when GetForegroundWindow returns NULL (lock/screensaver/sleep)
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={idleDetectionEnabled}
              onClick={() => setIdleDetectionEnabled(!idleDetectionEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${
                idleDetectionEnabled ? 'bg-[var(--accent)]' : 'bg-stone-300 dark:bg-stone-800'
              }`}
            >
              <motion.span
                layout
                transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${
                  idleDetectionEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Windows System Startup Toggle */}
          <div className="flex items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-emerald-500">
                <Power className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Launch on Windows Startup
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Runs tracker.exe silently on system boot via Windows HKCU\...\Run registry
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={autoStartEnabled}
              onClick={() => setAutoStartEnabled(!autoStartEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${
                autoStartEnabled ? 'bg-[var(--accent)]' : 'bg-stone-300 dark:bg-stone-800'
              }`}
            >
              <motion.span
                layout
                transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${
                  autoStartEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
