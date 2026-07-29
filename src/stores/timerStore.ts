'use client'

import { create } from 'zustand'
import { useNotificationStore } from './notificationStore'
import { sendWebNotification, deliverNotification } from '@/lib/notifications'
import { toast } from 'sonner'
import type { DeliveryChannel } from '@/lib/openpets'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

interface TimerState {
  totalSeconds: number
  remaining: number
  isRunning: boolean
  status: TimerStatus
  customMessage: string
  channel: DeliveryChannel | 'silent'
  startedAt: string | null
  completedAt: string | null
  presetMinutes: number

  setTotalSeconds: (seconds: number) => void
  setCustomMessage: (msg: string) => void
  setChannel: (ch: DeliveryChannel | 'silent') => void
  start: () => void
  stop: () => void
  reset: () => void
  tick: () => void
  setPresetMinutes: (mins: number) => void
}

const TIMER_STORAGE_KEY = 'shodasha-timer-state'

function loadPersistedState(): Partial<TimerState> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.status === 'running' && parsed.startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(parsed.startedAt).getTime()) / 1000)
      const remaining = Math.max(0, parsed.remaining - elapsed)
      return { ...parsed, remaining, isRunning: remaining > 0, status: remaining > 0 ? 'running' : 'completed' }
    }
    return parsed
  } catch {
    return null
  }
}

function persistState(state: Partial<TimerState>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify({
      totalSeconds: state.totalSeconds,
      remaining: state.remaining,
      isRunning: state.isRunning,
      status: state.status,
      customMessage: state.customMessage,
      channel: state.channel,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      presetMinutes: state.presetMinutes,
    }))
  } catch {}
}

let globalIntervalId: ReturnType<typeof setInterval> | null = null

export const useTimerStore = create<TimerState>((set, get) => {
  const persisted = loadPersistedState()

  return {
    totalSeconds: persisted?.totalSeconds ?? 1500,
    remaining: persisted?.remaining ?? 1500,
    isRunning: persisted?.isRunning ?? false,
    status: persisted?.status ?? 'idle',
    customMessage: persisted?.customMessage ?? '',
    channel: (persisted?.channel as DeliveryChannel | 'silent') ?? 'both',
    startedAt: persisted?.startedAt ?? null,
    completedAt: persisted?.completedAt ?? null,
    presetMinutes: persisted?.presetMinutes ?? 25,

    setTotalSeconds: (seconds) => {
      set({ totalSeconds: seconds, remaining: seconds })
      persistState(get())
    },

    setCustomMessage: (msg) => {
      set({ customMessage: msg })
      persistState(get())
    },

    setChannel: (ch) => {
      set({ channel: ch })
      persistState(get())
    },

    setPresetMinutes: (mins) => {
      const seconds = mins * 60
      set({ presetMinutes: mins, totalSeconds: seconds, remaining: seconds })
      persistState(get())
    },

    start: () => {
      const state = get()
      if (state.isRunning) return

      if (state.remaining <= 0) {
        set({ remaining: state.totalSeconds })
      }

      const startedAt = new Date().toISOString()
      set({ isRunning: true, status: 'running', startedAt, completedAt: null })
      persistState(get())

      if (globalIntervalId) clearInterval(globalIntervalId)
      globalIntervalId = setInterval(() => {
        const current = get()
        if (current.remaining <= 1) {
          clearInterval(globalIntervalId!)
          globalIntervalId = null
          set({ isRunning: false, status: 'completed', remaining: 0, completedAt: new Date().toISOString() })
          persistState(get())
          fireTimerNotification()
        } else {
          set({ remaining: current.remaining - 1 })
          persistState(get())
        }
      }, 1000)
    },

    stop: () => {
      if (globalIntervalId) {
        clearInterval(globalIntervalId)
        globalIntervalId = null
      }
      set({ isRunning: false, status: 'idle' })
      persistState(get())
    },

    reset: () => {
      if (globalIntervalId) {
        clearInterval(globalIntervalId)
        globalIntervalId = null
      }
      const { totalSeconds } = get()
      set({ isRunning: false, status: 'idle', remaining: totalSeconds, startedAt: null, completedAt: null })
      persistState(get())
    },

    tick: () => {},
  }
})

async function fireTimerNotification() {
  const state = useTimerStore.getState()
  const msg = state.customMessage.trim() || `Timer finished — ${formatTimerTime(state.totalSeconds)}`
  const opts = { title: 'Shodasha Timer', body: msg, tag: `timer-${Date.now()}` }
  const notifStore = useNotificationStore.getState()

  if (state.channel === 'silent') {
    toast('Timer done (silent mode)', { icon: '🔇' })
    return
  }

  let webOk = false
  if (state.channel !== 'pet' && notifStore.permission === 'granted') {
    webOk = await sendWebNotification(opts)
  }

  let petOk = false
  if (notifStore.petDeliveryEnabled && notifStore.petId && (state.channel === 'pet' || state.channel === 'both')) {
    try {
      petOk = await deliverNotification(opts, state.channel, 'test', notifStore.petId ?? undefined)
    } catch {}
  }

  const results: string[] = []
  if (webOk) results.push('Web ✅')
  else results.push('Web ❌')
  if (petOk) results.push('Pet ✅')
  else if (state.channel !== 'web') results.push('Pet ❌')
  toast.success(`Timer done — ${results.join(' · ')}`)
}

function formatTimerTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function cleanupTimerStore() {
  if (globalIntervalId) {
    clearInterval(globalIntervalId)
    globalIntervalId = null
  }
}
