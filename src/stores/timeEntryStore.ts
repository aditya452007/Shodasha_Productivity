import { create } from 'zustand'
import {
  fetchTimeEntriesFromDb,
  fetchTimeEntriesRangeFromDb,
  fetchAppCategoriesFromDb,
  setAppCategoryInDb,
  linkTaskToTimeEntryInDb,
} from '@/lib/db'

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
  timestamp: string
  cumulativeFocusMins: number
  cumulativeTotalMins: number
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
  selectedDate: string
  searchQuery: string
  widgetOrder: string[]
  isRefreshing: boolean

  initializeTimeEntries: (dateStr?: string) => Promise<void>
  setSelectedDate: (dateStr: string) => Promise<void>
  refreshAllData: () => Promise<void>
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

const initialEntries: TimeEntry[] = []

const initialWidgetOrder = ['kpi-grid', 'cumulative-screentime-chart', 'category-ring-chart', 'top-apps-bar-chart', 'activity-stream']

export const useTimeEntryStore = create<TimeEntryState>((set, get) => ({
  entries: initialEntries,
  categories: initialCategories,
  selectedTimeframe: 'today',
  selectedCategory: 'all',
  selectedDate: new Date().toISOString().split('T')[0],
  searchQuery: '',
  widgetOrder: initialWidgetOrder,
  isRefreshing: false,

  initializeTimeEntries: async (targetDateStr?: string) => {
    const dateStr = targetDateStr || get().selectedDate || new Date().toISOString().split('T')[0]
    const dbEntries = await fetchTimeEntriesFromDb(dateStr)
    const dbCategories = await fetchAppCategoriesFromDb()

    if (dbEntries && Array.isArray(dbEntries)) {
      const mappedEntries: TimeEntry[] = dbEntries.map((e: any) => ({
        id: e.id,
        appName: e.app_name,
        windowTitle: e.window_title,
        startTime: e.start_time,
        endTime: e.end_time || undefined,
        endReason: (e.end_reason as any) || null,
        durationSeconds: e.duration_seconds || undefined,
        linkedTaskId: e.linked_task_id || undefined,
        createdAt: e.created_at,
      }))
      set({ entries: mappedEntries, selectedDate: dateStr })
    }

    if (dbCategories && Array.isArray(dbCategories) && dbCategories.length > 0) {
      const catMap: Record<string, CategoryType> = { ...get().categories }
      dbCategories.forEach((c: any) => {
        catMap[c.app_name] = c.category as CategoryType
      })
      set({ categories: catMap })
    }
  },

  setSelectedDate: async (dateStr: string) => {
    set({ selectedDate: dateStr })
    await get().initializeTimeEntries(dateStr)
  },

  refreshAllData: async () => {
    set({ isRefreshing: true })
    try {
      await get().initializeTimeEntries(get().selectedDate)
    } finally {
      set({ isRefreshing: false })
    }
  },

  setCategory: (appName, category) => {
    set((state) => ({
      categories: { ...state.categories, [appName]: category },
    }))
    setAppCategoryInDb(appName, category)
  },

  setTimeframe: (tf) => set({ selectedTimeframe: tf }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setWidgetOrder: (order) => set({ widgetOrder: order }),

  linkTaskToTimeEntry: (entryId, taskId) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === entryId ? { ...entry, linkedTaskId: taskId } : entry
      ),
    }))
    linkTaskToTimeEntryInDb(entryId, taskId || null)
  },

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
      { category: 'work', label: 'Work / Code', seconds: workSec, percentage: Math.round((workSec / total) * 100) },
      { category: 'neutral', label: 'Utilities / Browser', seconds: neutralSec, percentage: Math.round((neutralSec / total) * 100) },
      { category: 'distraction', label: 'Media / Social', seconds: distractionSec, percentage: Math.round((distractionSec / total) * 100) },
    ]
  },

  getFilteredEntries: () => {
    let list = get().entries
    const catFilter = get().selectedCategory
    const search = get().searchQuery.toLowerCase().trim()
    const categories = get().categories

    if (catFilter !== 'all') {
      list = list.filter((e) => (categories[e.appName] || 'neutral') === catFilter)
    }

    if (search) {
      list = list.filter(
        (e) =>
          e.appName.toLowerCase().includes(search) ||
          e.windowTitle.toLowerCase().includes(search)
      )
    }

    return list
  },

  getFilteredFocusSeconds: () => {
    return get()
      .getFilteredEntries()
      .reduce((acc, curr) => (curr.endReason === 'idle' ? acc : acc + (curr.durationSeconds || 0)), 0)
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
      { category: 'work', label: 'Work', seconds: workSec, percentage: Math.round((workSec / total) * 100) },
      { category: 'neutral', label: 'Neutral', seconds: neutralSec, percentage: Math.round((neutralSec / total) * 100) },
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
    const filtered = get().getFilteredEntries()
    const categories = get().categories

    if (filtered.length === 0) {
      return [
        { timestamp: '12:00 AM', cumulativeFocusMins: 0, cumulativeTotalMins: 0 },
        { timestamp: '12:00 PM', cumulativeFocusMins: 0, cumulativeTotalMins: 0 },
      ]
    }

    const sorted = [...filtered].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )

    let totalFocusSec = 0
    let totalScreenSec = 0
    const points: CumulativePoint[] = []

    const firstDate = new Date(sorted[0].startTime)
    const firstLabel = firstDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    points.push({
      timestamp: firstLabel,
      cumulativeFocusMins: 0,
      cumulativeTotalMins: 0,
    })

    sorted.forEach((entry) => {
      const dur = entry.durationSeconds || 0
      totalScreenSec += dur
      const cat = categories[entry.appName] || 'neutral'
      if (cat === 'work' && entry.endReason !== 'idle') {
        totalFocusSec += dur
      }

      const endDate = entry.endTime ? new Date(entry.endTime) : new Date(entry.startTime)
      const timeLabel = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })

      points.push({
        timestamp: timeLabel,
        cumulativeFocusMins: Math.round(totalFocusSec / 60),
        cumulativeTotalMins: Math.round(totalScreenSec / 60),
      })
    })

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
      topAppName: topApp ? topApp.appName : 'None',
      topAppDurationSeconds: topApp ? topApp.totalSeconds : focusSec,
    }
  },
}))
