import { create } from 'zustand'

export interface TimeEntry {
  id: string
  appName: string
  windowTitle: string
  startTime: string
  endTime?: string
  endReason?: 'idle' | 'closed' | null
  durationSeconds?: number
  linkedTaskId?: string
  createdAt: string
}

export type CategoryType = 'work' | 'neutral' | 'distraction'
export type TimeframeFilter = 'today' | '7days' | 'all'
export type CategoryFilter = 'all' | 'work' | 'neutral' | 'distraction'

export interface AppCategory {
  appName: string
  category: CategoryType
}

export interface AppStatItem {
  appName: string
  category: CategoryType
  totalSeconds: number
  percentage: number
  sessionsCount: number
}

export interface CumulativePoint {
  timestamp: string // e.g. "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"
  cumulativeFocusMins: number // Monotonically increasing
  cumulativeTotalMins: number // Monotonically increasing (includes idle)
}

export interface TimeKPIs {
  computerOnTimeSeconds: number
  activeFocusSeconds: number
  idleTimeSeconds: number
  focusEfficiency: number
  contextSwitches: number
  deepWorkRatio: number
  topAppName: string
  topAppDurationSeconds: number
}

interface TimeEntryState {
  entries: TimeEntry[]
  categories: Record<string, CategoryType>
  selectedTimeframe: TimeframeFilter
  selectedCategory: CategoryFilter
  searchQuery: string
  widgetOrder: string[]

  setCategory: (appName: string, category: CategoryType) => void
  setTimeframe: (tf: TimeframeFilter) => void
  setSelectedCategory: (cat: CategoryFilter) => void
  setSearchQuery: (query: string) => void
  setWidgetOrder: (order: string[]) => void
  linkTaskToTimeEntry: (entryId: string, taskId?: string) => void

  getTotalFocusSecondsToday: () => number
  getCategoryBreakdownToday: () => { category: CategoryType; label: string; seconds: number; percentage: number }[]
  getFilteredEntries: () => TimeEntry[]
  getFilteredFocusSeconds: () => number
  getCategoryBreakdownFiltered: () => { category: CategoryType; label: string; seconds: number; percentage: number }[]
  getTopAppsFiltered: () => AppStatItem[]
  getCumulativeScreenTimeFiltered: () => CumulativePoint[]
  getKPIsFiltered: () => TimeKPIs
}

const initialCategories: Record<string, CategoryType> = {
  'Code.exe': 'work',
  'cmd.exe': 'work',
  'WindowsTerminal.exe': 'work',
  'Figma.exe': 'work',
  'chrome.exe': 'neutral',
  'spotify.exe': 'neutral',
  'Slack.exe': 'neutral',
  'youtube.com': 'distraction',
  'twitter.com': 'distraction',
  'reddit.com': 'distraction',
}

const now = Date.now()
const initialEntries: TimeEntry[] = [
  {
    id: 'te-1',
    appName: 'Code.exe',
    windowTitle: 'Shodasha_Productivity — timeEntryStore.ts',
    startTime: new Date(now - 3600 * 1000 * 5).toISOString(),
    endTime: new Date(now - 3600 * 1000 * 3).toISOString(),
    durationSeconds: 7200, // 2h (09:00 - 11:00)
    createdAt: new Date(now - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'te-2',
    appName: 'WindowsTerminal.exe',
    windowTitle: 'PowerShell — npm run dev',
    startTime: new Date(now - 3600 * 1000 * 3).toISOString(),
    endTime: new Date(now - 3600 * 1000 * 2.5).toISOString(),
    durationSeconds: 1800, // 30 mins (11:00 - 11:30)
    createdAt: new Date(now - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'te-3',
    appName: 'chrome.exe',
    windowTitle: 'Tailwind CSS v4 Documentation',
    startTime: new Date(now - 3600 * 1000 * 2.5).toISOString(),
    endTime: new Date(now - 3600 * 1000 * 1.8).toISOString(),
    durationSeconds: 2520, // 42 mins (11:30 - 12:12)
    createdAt: new Date(now - 3600 * 1000 * 2.5).toISOString(),
  },
  {
    id: 'te-4',
    appName: 'Figma.exe',
    windowTitle: 'Shodasha Design System Specs',
    startTime: new Date(now - 3600 * 1000 * 1.8).toISOString(),
    endTime: new Date(now - 3600 * 1000 * 0.8).toISOString(),
    durationSeconds: 3600, // 1h (12:12 - 13:12)
    createdAt: new Date(now - 3600 * 1000 * 1.8).toISOString(),
  },
  {
    id: 'te-5',
    appName: 'youtube.com',
    windowTitle: 'Lo-Fi Chill Beats for Coding',
    startTime: new Date(now - 3600 * 1000 * 0.8).toISOString(),
    endTime: new Date(now - 3600 * 1000 * 0.3).toISOString(),
    durationSeconds: 1800, // 30 mins (13:12 - 13:42)
    createdAt: new Date(now - 3600 * 1000 * 0.8).toISOString(),
  },
  {
    id: 'te-6',
    appName: 'Code.exe',
    windowTitle: 'Lock Screen / Idle Period',
    startTime: new Date(now - 3600 * 1000 * 0.3).toISOString(),
    endTime: new Date().toISOString(),
    endReason: 'idle',
    durationSeconds: 1080, // 18 mins idle
    createdAt: new Date(now - 3600 * 1000 * 0.3).toISOString(),
  },
]

const initialWidgetOrder = ['kpi-grid', 'cumulative-screentime-chart', 'category-ring-chart', 'top-apps-bar-chart', 'activity-stream']

export const useTimeEntryStore = create<TimeEntryState>((set, get) => ({
  entries: initialEntries,
  categories: initialCategories,
  selectedTimeframe: 'today',
  selectedCategory: 'all',
  searchQuery: '',
  widgetOrder: initialWidgetOrder,

  setCategory: (appName, category) =>
    set((state) => ({
      categories: { ...state.categories, [appName]: category },
    })),

  setTimeframe: (tf) => set({ selectedTimeframe: tf }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setWidgetOrder: (order) => set({ widgetOrder: order }),

  linkTaskToTimeEntry: (entryId, taskId) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === entryId ? { ...entry, linkedTaskId: taskId } : entry
      ),
    })),

  getTotalFocusSecondsToday: () => {
    const todayStr = new Date().toISOString().split('T')[0]
    return get().entries.reduce((total, entry) => {
      if (entry.endReason === 'idle') return total
      if (entry.startTime.startsWith(todayStr)) {
        return total + (entry.durationSeconds || 0)
      }
      return total
    }, 0)
  },

  getCategoryBreakdownToday: () => {
    const todayStr = new Date().toISOString().split('T')[0]
    const entries = get().entries.filter(
      (e) => e.startTime.startsWith(todayStr) && e.endReason !== 'idle'
    )
    const categories = get().categories

    let workSec = 0
    let neutralSec = 0
    let distractionSec = 0

    entries.forEach((entry) => {
      const dur = entry.durationSeconds || 0
      const cat = categories[entry.appName] || 'neutral'
      if (cat === 'work') workSec += dur
      else if (cat === 'distraction') distractionSec += dur
      else neutralSec += dur
    })

    const total = workSec + neutralSec + distractionSec || 1

    return [
      { category: 'work', label: 'Deep Work', seconds: workSec, percentage: Math.round((workSec / total) * 100) },
      { category: 'neutral', label: 'General / Tools', seconds: neutralSec, percentage: Math.round((neutralSec / total) * 100) },
      { category: 'distraction', label: 'Distraction', seconds: distractionSec, percentage: Math.round((distractionSec / total) * 100) },
    ]
  },

  getFilteredEntries: () => {
    const { entries, categories, selectedTimeframe, selectedCategory, searchQuery } = get()

    const nowTime = Date.now()
    const todayStr = new Date().toISOString().split('T')[0]
    const sevenDaysAgo = nowTime - 7 * 86400 * 1000

    return entries.filter((entry) => {
      // 1. Timeframe filter
      if (selectedTimeframe === 'today' && !entry.startTime.startsWith(todayStr)) {
        return false
      }
      if (selectedTimeframe === '7days' && new Date(entry.startTime).getTime() < sevenDaysAgo) {
        return false
      }

      // 2. Category filter
      const cat = categories[entry.appName] || 'neutral'
      if (selectedCategory !== 'all' && cat !== selectedCategory) {
        return false
      }

      // 3. Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchApp = entry.appName.toLowerCase().includes(q)
        const matchTitle = entry.windowTitle.toLowerCase().includes(q)
        if (!matchApp && !matchTitle) return false
      }

      return true
    })
  },

  getFilteredFocusSeconds: () => {
    const filtered = get().getFilteredEntries()
    return filtered.reduce((sum, entry) => {
      if (entry.endReason === 'idle') return sum
      return sum + (entry.durationSeconds || 0)
    }, 0)
  },

  getCategoryBreakdownFiltered: () => {
    const filtered = get().getFilteredEntries()
    const categories = get().categories

    let workSec = 0
    let neutralSec = 0
    let distractionSec = 0

    filtered.forEach((entry) => {
      if (entry.endReason === 'idle') return
      const dur = entry.durationSeconds || 0
      const cat = categories[entry.appName] || 'neutral'
      if (cat === 'work') workSec += dur
      else if (cat === 'distraction') distractionSec += dur
      else neutralSec += dur
    })

    const total = workSec + neutralSec + distractionSec || 1

    return [
      { category: 'work', label: 'Deep Work', seconds: workSec, percentage: Math.round((workSec / total) * 100) },
      { category: 'neutral', label: 'General / Tools', seconds: neutralSec, percentage: Math.round((neutralSec / total) * 100) },
      { category: 'distraction', label: 'Distraction', seconds: distractionSec, percentage: Math.round((distractionSec / total) * 100) },
    ]
  },

  getTopAppsFiltered: () => {
    const filtered = get().getFilteredEntries()
    const categories = get().categories

    const map = new Map<string, { totalSeconds: number; sessionsCount: number }>()

    let grandTotal = 0
    filtered.forEach((entry) => {
      if (entry.endReason === 'idle') return
      const dur = entry.durationSeconds || 0
      grandTotal += dur
      const curr = map.get(entry.appName) || { totalSeconds: 0, sessionsCount: 0 }
      map.set(entry.appName, {
        totalSeconds: curr.totalSeconds + dur,
        sessionsCount: curr.sessionsCount + 1,
      })
    })

    const result: AppStatItem[] = []
    map.forEach((val, appName) => {
      const cat = categories[appName] || 'neutral'
      result.push({
        appName,
        category: cat,
        totalSeconds: val.totalSeconds,
        percentage: grandTotal > 0 ? Math.round((val.totalSeconds / grandTotal) * 100) : 0,
        sessionsCount: val.sessionsCount,
      })
    })

    return result.sort((a, b) => b.totalSeconds - a.totalSeconds)
  },

  getCumulativeScreenTimeFiltered: () => {
    // Cumulative screen time accumulates monotonically throughout the day
    // 08:00 → 10:00 → 12:00 → 14:00 → 16:00 → 18:00
    const points: CumulativePoint[] = [
      { timestamp: '08:00', cumulativeFocusMins: 0, cumulativeTotalMins: 0 },
      { timestamp: '10:00', cumulativeFocusMins: 90, cumulativeTotalMins: 95 },
      { timestamp: '12:00', cumulativeFocusMins: 184, cumulativeTotalMins: 195 },
      { timestamp: '14:00', cumulativeFocusMins: 244, cumulativeTotalMins: 260 },
      { timestamp: '16:00', cumulativeFocusMins: 310, cumulativeTotalMins: 330 },
      { timestamp: '18:00', cumulativeFocusMins: 380, cumulativeTotalMins: 410 },
    ]
    return points
  },

  getKPIsFiltered: () => {
    const filtered = get().getFilteredEntries()
    const categories = get().categories

    let focusSec = 0
    let idleSec = 0
    let workSec = 0

    filtered.forEach((entry) => {
      const dur = entry.durationSeconds || 0
      if (entry.endReason === 'idle') {
        idleSec += dur
      } else {
        focusSec += dur
        const cat = categories[entry.appName] || 'neutral'
        if (cat === 'work') workSec += dur
      }
    })

    const totalTracked = focusSec + idleSec || 1
    const focusEfficiency = Math.round((focusSec / totalTracked) * 100)
    const deepWorkRatio = Math.round((workSec / (focusSec || 1)) * 100)

    const topApps = get().getTopAppsFiltered()
    const topApp = topApps[0]

    return {
      computerOnTimeSeconds: totalTracked,
      activeFocusSeconds: focusSec,
      idleTimeSeconds: idleSec,
      focusEfficiency,
      contextSwitches: filtered.length,
      deepWorkRatio,
      topAppName: topApp ? topApp.appName : 'Code.exe',
      topAppDurationSeconds: topApp ? topApp.totalSeconds : focusSec,
    }
  },
}))
