'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Timer, Play, Square, RotateCcw, Coffee, Bell, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { useNotificationStore } from '@/stores/notificationStore'
import { sendWebNotification, deliverNotification } from '@/lib/notifications'
import type { DeliveryChannel } from '@/lib/openpets'

const PRESETS = [
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
  { label: '30 min', seconds: 1800 },
  { label: '60 min', seconds: 3600 },
]

export function TimerPage() {
  const [totalSeconds, setTotalSeconds] = useState(1500)
  const [remaining, setRemaining] = useState(1500)
  const [running, setRunning] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [channel, setChannel] = useState<DeliveryChannel | 'silent'>('both')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  const playBeep = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 880
      oscillator.type = 'sine'
      gain.gain.value = 0.3
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.5)
    } catch {}
  }, [])

  const fireNotification = useCallback(async () => {
    playBeep()
    const msg = customMessage.trim() || `Timer finished — ${formatTime(totalSeconds)}`
    const opts = { title: 'Shodasha Timer', body: msg, tag: `timer-${Date.now()}` }
    const store = useNotificationStore.getState()

    if (channel === 'silent') {
      toast('Timer done (silent mode)', { icon: '🔇' })
      return
    }

    let webOk = false
    if (channel !== 'pet' && store.permission === 'granted') {
      webOk = await sendWebNotification(opts)
    }

    let petOk = false
    if (store.petDeliveryEnabled && store.petId && (channel === 'pet' || channel === 'both')) {
      try {
        petOk = await deliverNotification(opts, channel, 'test', store.petId ?? undefined)
      } catch {}
    }

    const results: string[] = []
    if (webOk) results.push('Web ✅')
    else results.push('Web ❌')
    if (petOk) results.push('Pet ✅')
    else if (channel !== 'web') results.push('Pet ❌')
    toast.success(`Timer done — ${results.join(' · ')}`)
  }, [customMessage, totalSeconds, channel, playBeep])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer()
          setRunning(false)
          fireNotification()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return clearTimer
  }, [running, clearTimer, fireNotification])

  const startTimer = () => {
    if (remaining <= 0) {
      setRemaining(totalSeconds)
    }
    clearTimer()
    setRunning(true)
  }

  const stopTimer = () => {
    clearTimer()
    setRunning(false)
  }

  const resetTimer = () => {
    clearTimer()
    setRunning(false)
    setRemaining(totalSeconds)
  }

  const selectPreset = (seconds: number) => {
    if (running) return
    setTotalSeconds(seconds)
    setRemaining(seconds)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-8 pb-16"
    >
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-5">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Timer className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Focus Timer
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Set a countdown timer. A notification fires when time runs out.
        </p>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center gap-8">
        {/* Circular Progress Ring */}
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
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-mono text-6xl font-bold tabular-nums tracking-tight ${running ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
              {formatTime(remaining)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!running ? (
            <button
              onClick={startTimer}
              disabled={remaining <= 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <Play className="w-5 h-5" /> Start
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-xs active:scale-95"
            >
              <Square className="w-5 h-5" /> Stop
            </button>
          )}
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Preset Durations */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="w-4 h-4 text-[var(--text-tertiary)]" />
          <h3 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">Preset Durations</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.seconds}
              onClick={() => selectPreset(preset.seconds)}
              disabled={running}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
                totalSeconds === preset.seconds
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                  : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
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
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-hidden focus:border-[var(--accent)] transition-all"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Deliver via</span>
          </div>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as DeliveryChannel | 'silent')}
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