import { create } from 'zustand'
import { setAutoStartInDb } from '@/lib/db'

export type ThemeMode = 'light' | 'dark' | 'system'
export type DataRetentionPeriod = '1_month' | '3_months' | '6_months' | 'indefinite'
export type AccentColor = '#059669' | '#7c3aed' | '#d97706' | '#e11d48'

interface SettingsState {
  pollingInterval: number // in seconds (5 - 60)
  idleDetectionEnabled: boolean
  autoStartEnabled: boolean
  dataRetentionPeriod: DataRetentionPeriod
  themeMode: ThemeMode
  accentColor: AccentColor

  setPollingInterval: (interval: number) => void
  setIdleDetectionEnabled: (enabled: boolean) => void
  setAutoStartEnabled: (enabled: boolean) => void
  setDataRetentionPeriod: (period: DataRetentionPeriod) => void
  setThemeMode: (mode: ThemeMode) => void
  setAccentColor: (color: AccentColor) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  pollingInterval: 30,
  idleDetectionEnabled: true,
  autoStartEnabled: true,
  dataRetentionPeriod: '6_months',
  themeMode: 'dark',
  accentColor: '#059669',

  setPollingInterval: (interval) => set({ pollingInterval: interval }),
  setIdleDetectionEnabled: (enabled) => set({ idleDetectionEnabled: enabled }),
  setAutoStartEnabled: (enabled) => {
    set({ autoStartEnabled: enabled })
    setAutoStartInDb(enabled)
  },
  setDataRetentionPeriod: (period) => set({ dataRetentionPeriod: period }),
  setThemeMode: (mode) => {
    set({ themeMode: mode })
    if (typeof document !== 'undefined') {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },
  setAccentColor: (color) => {
    set({ accentColor: color })
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--accent', color)
    }
  },
}))
