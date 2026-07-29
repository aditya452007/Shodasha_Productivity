'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Timer, Play, Square, RotateCcw, Coffee, Bell, Smartphone, Settings2 } from 'lucide-react'
import { useTimerStore } from '@/stores/timerStore'

const PRESETS = [
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '25 min', minutes: 25 },
  { label: '30 min', minutes: 30 },
  { label: '60 min', minutes: 60 },
]

export function TimerPage() {
  const {
    totalSeconds, remaining, isRunning, status,
    customMessage, channel, presetMinutes,
    setTotalSeconds, setCustomMessage, setChannel,
    start, stop, reset, setPresetMinutes,
  } = useTimerStore()

  const shouldReduceMotion = useReducedMotion()

  const [customMinutes, setCustomMinutes] = useState(27)
  const [showCustom, setShowCustom] = useState(false)

  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleCustomApply = () => {
    if (customMinutes >= 1 && customMinutes <= 1440) {
      setTotalSeconds(customMinutes * 60)
      setShowCustom(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-8 pb-16"
    >
      <div className="border-b border-[var(--border-subtle)] pb-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <Timer className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Focus Timer
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Timer runs even when you switch pages. It stops when finished or you stop it.
        </p>
        {isRunning && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse motion-reduce:animate-none" />
            Running in background
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128" cy="128" r="110"
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="12"
            />
            <motion.circle
              cx="128" cy="128" r="110"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
              initial={false}
              className="duration-1000"
              style={{ transition: 'stroke-dashoffset 1000ms cubic-bezier(0.23, 1, 0.32, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-mono text-6xl font-bold tabular-nums tracking-tight ${isRunning ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
              {formatTime(remaining)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isRunning ? (
            <button
              onClick={start}
              disabled={remaining <= 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <Play className="w-5 h-5" /> Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--error)] text-white text-sm font-semibold hover:brightness-90 shadow-xs active:scale-95"
            >
              <Square className="w-5 h-5" /> Stop
            </button>
          )}
          <button
            onClick={reset}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {status === 'completed' && (
          <div className="px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold">
            Timer completed! Check your notifications.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="w-4 h-4 text-[var(--text-tertiary)]" />
          <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">Duration</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.minutes}
              onClick={() => { if (!isRunning) setPresetMinutes(preset.minutes) }}
              disabled={isRunning}
               className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
                !showCustom && presetMinutes === preset.minutes && totalSeconds === preset.minutes * 60
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
               } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => { if (!isRunning) setShowCustom(!showCustom) }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border ${
              showCustom
                ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
            } disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>

        {showCustom && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
            <input
              type="number"
              min={1}
              max={1440}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(1, Math.min(1440, Number(e.target.value) || 1)))}
              className="w-16 text-center text-sm font-mono font-semibold px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--accent)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="min"
            />
            <span className="text-xs text-[var(--text-secondary)] font-medium">minutes</span>
            <button
              onClick={handleCustomApply}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-[var(--text-tertiary)]" />
          <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">Notification Settings</h3>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Custom Message</label>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g. Time to take a break!"
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-hidden focus:border-[var(--accent)] transition-ring"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Deliver via</span>
          </div>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-medium focus:outline-hidden focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="both">Both</option>
            <option value="web">Web Only</option>
            <option value="pet">Pet Only</option>
            <option value="silent">Silent</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}
