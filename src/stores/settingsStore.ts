import { create } from 'zustand'
import { AsyncState } from './taskStore'
import { setAutoStartInDb, fetchSettingsFromDb, saveSettingsToDb, setPollingIntervalInDb, setIdleThresholdInDb } from '@/lib/db'

export type ThemeMode = 'light' | 'dark' | 'system'
export type DataRetentionPeriod = '1_month' | '3_months' | '6_months' | 'indefinite'
export type AccentColor = '#059669' | '#7c3aed' | '#d97706' | '#e11d48'

interface SettingsState extends AsyncState {
  pollingInterval: number
  idleDetectionEnabled: boolean
  idleThreshold: number // seconds
  autoStartEnabled: boolean
  dailyGoalHours: number // target focus hours per day
  dataRetentionPeriod: DataRetentionPeriod
  themeMode: ThemeMode
  accentColor: AccentColor

  initializeSettings: () => Promise<void>
  setPollingInterval: (interval: number) => void
  setIdleDetectionEnabled: (enabled: boolean) => void
  setIdleThreshold: (threshold: number) => void
  setAutoStartEnabled: (enabled: boolean) => void
  setDailyGoalHours: (hours: number) => void
  setDataRetentionPeriod: (period: DataRetentionPeriod) => void
  setThemeMode: (mode: ThemeMode) => void
  setAccentColor: (color: AccentColor) => void
}

function persistAllSettings(state: Partial<SettingsState>) {
  saveSettingsToDb({
    pollingInterval: String(state.pollingInterval ?? 30),
    idleDetectionEnabled: String(state.idleDetectionEnabled ?? true),
    idleThreshold: String(state.idleThreshold ?? 300),
    autoStartEnabled: String(state.autoStartEnabled ?? true),
    dailyGoalHours: String(state.dailyGoalHours ?? 6.0),
    dataRetentionPeriod: state.dataRetentionPeriod || '6_months',
    themeMode: state.themeMode || 'dark',
    accentColor: state.accentColor || '#059669',
  })
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  pollingInterval: 30,
  idleDetectionEnabled: true,
  idleThreshold: 300,
  autoStartEnabled: true,
  dailyGoalHours: 6.0,
  dataRetentionPeriod: '6_months',
  themeMode: 'dark',
  accentColor: '#059669',
  isLoading: false,
  error: null,
  isInitialized: false,

  initializeSettings: async () => {
    set({ isLoading: true, error: null })
    try {
      const dbSettings = await fetchSettingsFromDb()
      if (dbSettings && Object.keys(dbSettings).length > 0) {
        const pollingInterval = dbSettings.pollingInterval ? Number(dbSettings.pollingInterval) : get().pollingInterval
        const idleDetectionEnabled = dbSettings.idleDetectionEnabled !== undefined ? dbSettings.idleDetectionEnabled === 'true' : get().idleDetectionEnabled
        const idleThreshold = dbSettings.idleThreshold ? Number(dbSettings.idleThreshold) : get().idleThreshold
        const autoStartEnabled = dbSettings.autoStartEnabled !== undefined ? dbSettings.autoStartEnabled === 'true' : get().autoStartEnabled
        const dailyGoalHours = dbSettings.dailyGoalHours ? Number(dbSettings.dailyGoalHours) : get().dailyGoalHours
        const dataRetentionPeriod = (dbSettings.dataRetentionPeriod as DataRetentionPeriod) || get().dataRetentionPeriod
        const themeMode = (dbSettings.themeMode as ThemeMode) || get().themeMode
        const accentColor = (dbSettings.accentColor as AccentColor) || get().accentColor

        set({
          pollingInterval,
          idleDetectionEnabled,
          idleThreshold,
          autoStartEnabled,
          dailyGoalHours,
          dataRetentionPeriod,
          themeMode,
          accentColor,
          isLoading: false,
          isInitialized: true,
        })

        setPollingIntervalInDb(pollingInterval)
        setIdleThresholdInDb(idleThreshold)

        if (typeof document !== 'undefined') {
          const isDark =
            themeMode === 'dark' ||
            (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          if (isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          document.documentElement.style.setProperty('--accent', accentColor)
        }
      } else {
        set({ isLoading: false, isInitialized: true })
      }
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load settings', isLoading: false, isInitialized: true })
    }
  },

  setPollingInterval: (interval) => {
    set({ pollingInterval: interval })
    setPollingIntervalInDb(interval)
    persistAllSettings(get())
  },
  setIdleDetectionEnabled: (enabled) => {
    set({ idleDetectionEnabled: enabled })
    persistAllSettings(get())
  },
  setIdleThreshold: (threshold) => {
    set({ idleThreshold: threshold })
    setIdleThresholdInDb(threshold)
    persistAllSettings(get())
  },
  setAutoStartEnabled: (enabled) => {
    set({ autoStartEnabled: enabled })
    setAutoStartInDb(enabled)
    persistAllSettings(get())
  },
  setDailyGoalHours: (hours) => {
    set({ dailyGoalHours: hours })
    persistAllSettings(get())
  },
  setDataRetentionPeriod: (period) => {
    set({ dataRetentionPeriod: period })
    persistAllSettings(get())
  },
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
    persistAllSettings(get())
  },
  setAccentColor: (color) => {
    set({ accentColor: color })
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--accent', color)
    }
    persistAllSettings(get())
  },
}))
