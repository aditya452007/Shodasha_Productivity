import { create } from 'zustand'
import { fetchSettingsFromDb, saveSettingsToDb } from '@/lib/db'

export interface GamificationState {
  xp: number
  level: number
  unlockedAchievements: string[]
  lastLevelUpNotified: number
  dailyXP: number
  trackedXPKeys: string[]
  isInitialized: boolean

  getLevelProgress: () => { current: number; next: number; percentage: number }
  getTierName: (level: number) => string
  getTierColor: (level: number) => string
  getTotalXPForLevel: (level: number) => number
  awardXP: (amount: number, key: string) => void
  checkAndAwardAchievement: (achievementId: string) => void
  resetGamification: () => void
  initializeGamification: () => Promise<void>
}

export function computeXPForLevel(level: number): number {
  return Math.round(100 * level * Math.pow(1.15, level - 1))
}

export function getTierName(level: number): string {
  if (level >= 75) return 'Legend'
  if (level >= 50) return 'Master'
  if (level >= 40) return 'Diamond'
  if (level >= 30) return 'Platinum'
  if (level >= 20) return 'Gold'
  if (level >= 10) return 'Silver'
  return 'Bronze'
}

export function getTierColor(level: number): string {
  if (level >= 75) return '#FF6B35'
  if (level >= 50) return '#8A2BE2'
  if (level >= 40) return '#B9F2FF'
  if (level >= 30) return '#E5E4E2'
  if (level >= 20) return '#FFD700'
  if (level >= 10) return '#C0C0C0'
  return '#CD7F32'
}

const STORAGE_KEYS = {
  xp: 'gamification_xp',
  level: 'gamification_level',
  unlockedAchievements: 'gamification_unlocked_achievements',
}

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveLocal(key: string, value: any) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  xp: 0,
  level: 1,
  unlockedAchievements: [],
  lastLevelUpNotified: 1,
  dailyXP: 0,
  trackedXPKeys: [],
  isInitialized: false,

  getTotalXPForLevel: (level: number) => computeXPForLevel(level),

  getLevelProgress: () => {
    const { xp, level } = get()
    const current = xp - (level > 1 ? computeXPForLevel(level - 1) : 0)
    const next = computeXPForLevel(level) - (level > 1 ? computeXPForLevel(level - 1) : 0)
    return { current, next, percentage: Math.min(100, Math.round((current / next) * 100)) }
  },

  getTierName: (level: number) => getTierName(level),
  getTierColor: (level: number) => getTierColor(level),

  awardXP: (amount: number, key: string) => {
    const state = get()
    if (state.trackedXPKeys.includes(key)) return

    const newXP = state.xp + amount
    let newLevel = state.level
    let newLastLevelUpNotified = state.lastLevelUpNotified

    while (newXP >= computeXPForLevel(newLevel)) {
      newLevel++
    }

    const leveledUp = newLevel > state.level

    const todayStr = new Date().toISOString().split('T')[0]

    // Cap trackedXPKeys to prevent unbounded memory growth
    const updatedKeys = [...state.trackedXPKeys, key]
    const MAX_TRACKED_KEYS = 500
    const cappedKeys = updatedKeys.length > MAX_TRACKED_KEYS
      ? updatedKeys.slice(updatedKeys.length - MAX_TRACKED_KEYS)
      : updatedKeys

    set({
      xp: newXP,
      level: newLevel,
      lastLevelUpNotified: leveledUp ? state.level : state.lastLevelUpNotified,
      dailyXP: state.dailyXP + amount,
      trackedXPKeys: cappedKeys,
    })

    if (key.startsWith('habit_checkin_') && key.endsWith(`_${todayStr}`)) {
      const isFirstToday = !state.trackedXPKeys.some(
        (k) => k.startsWith('habit_checkin_') && k.endsWith(`_${todayStr}`) && k !== key
      )
      if (isFirstToday && amount >= 5) {
        setTimeout(() => get().awardXP(5, `first_checkin_${todayStr}`), 100)
      }
    }

    const savedXP = newXP
    const savedLevel = newLevel
    const savedAchievements = state.unlockedAchievements
    setTimeout(() => {
      saveLocal(STORAGE_KEYS.xp, savedXP)
      saveLocal(STORAGE_KEYS.level, savedLevel)
      saveSettingsToDb({
        [STORAGE_KEYS.xp]: String(savedXP),
        [STORAGE_KEYS.level]: String(savedLevel),
        [STORAGE_KEYS.unlockedAchievements]: savedAchievements.join(','),
      })
    }, 0)
  },

  checkAndAwardAchievement: (achievementId: string) => {
    const state = get()
    if (state.unlockedAchievements.includes(achievementId)) return
    set((s) => ({ unlockedAchievements: [...s.unlockedAchievements, achievementId] }))
    get().awardXP(50, `achievement_${achievementId}`)
  },

  resetGamification: () => {
    set({ xp: 0, level: 1, unlockedAchievements: [], lastLevelUpNotified: 1, dailyXP: 0, trackedXPKeys: [] })
    saveLocal(STORAGE_KEYS.xp, 0)
    saveLocal(STORAGE_KEYS.level, 1)
    saveLocal(STORAGE_KEYS.unlockedAchievements, [])
    saveSettingsToDb({
      [STORAGE_KEYS.xp]: '0',
      [STORAGE_KEYS.level]: '1',
      [STORAGE_KEYS.unlockedAchievements]: '',
    })
  },

  initializeGamification: async () => {
    try {
      const xp = loadLocal<number>(STORAGE_KEYS.xp, 0)
      const level = loadLocal<number>(STORAGE_KEYS.level, 1)
      const unlocked = loadLocal<string[]>(STORAGE_KEYS.unlockedAchievements, [])

      if (xp > 0 || level > 1 || unlocked.length > 0) {
        set({ xp, level, lastLevelUpNotified: level, unlockedAchievements: unlocked, isInitialized: true })
        return
      }

      const dbSettings = await fetchSettingsFromDb()
      if (dbSettings) {
        const dbXP = dbSettings[STORAGE_KEYS.xp] ? Number(dbSettings[STORAGE_KEYS.xp]) : 0
        const dbLevel = dbSettings[STORAGE_KEYS.level] ? Number(dbSettings[STORAGE_KEYS.level]) : 1
        const dbAchievements = dbSettings[STORAGE_KEYS.unlockedAchievements]
          ? dbSettings[STORAGE_KEYS.unlockedAchievements].split(',').filter(Boolean)
          : []

        set({
          xp: dbXP,
          level: dbLevel,
          lastLevelUpNotified: dbLevel,
          unlockedAchievements: dbAchievements,
          isInitialized: true,
        })
        saveLocal(STORAGE_KEYS.xp, dbXP)
        saveLocal(STORAGE_KEYS.level, dbLevel)
        saveLocal(STORAGE_KEYS.unlockedAchievements, dbAchievements)
      } else {
        set({ isInitialized: true })
      }
    } catch {
      set({ isInitialized: true })
    }
  },
}))
