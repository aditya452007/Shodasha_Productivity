import { create } from 'zustand'
import { AsyncState } from './taskStore'
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

export interface DailyUsageBar {
  date: string
  dayLabel: string
  totalHours: number
  totalSeconds: number
  isToday: boolean
}

export interface ActivePeriodBlock {
  id: string
  isGap?: false
  startTime: string
  endTime: string
  startHourDecimal: number
  endHourDecimal: number
  durationSeconds: number
  topAppName: string
  topAppCategory: CategoryType
  totalEntries: number
}

export interface InactiveGapBlock {
  id: string
  isGap: true
  startTime: string
  endTime: string
  durationHours: number
}

export type TimelinePeriodItem = ActivePeriodBlock | InactiveGapBlock

interface TimeEntryState extends AsyncState {
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

  getDailyUsageHours: (daysCount?: number) => DailyUsageBar[]
  getActivePeriods: (dateStr?: string) => TimelinePeriodItem[]
  getAppRankingByHours: (dateStr?: string, limit?: number) => AppStatItem[]
}

function getCategoryForEntry(
  entry: TimeEntry,
  categories: Record<string, CategoryType>
): CategoryType {
  const browserApps = ['chrome.exe', 'firefox.exe', 'msedge.exe', 'brave.exe', 'opera.exe']
  const appName = entry.appName.toLowerCase()
  if (browserApps.includes(appName)) {
    const normalized = entry.windowTitle
      .replace(/\s*[-–—|]\s*(Google Chrome|Mozilla Firefox|Microsoft Edge|Brave|Opera)\s*$/i, '')
      .trim()
      .toLowerCase()
      .replace(/^www\./i, '')
    if (normalized && categories[normalized]) return categories[normalized]
  }
  return categories[entry.appName] || 'neutral'
}

const initialCategories: Record<string, CategoryType> = {
  'Code.exe': 'work',
  'cmd.exe': 'work',
  'WindowsTerminal.exe': 'work',
  'Figma.exe': 'work',
  'chrome.exe': 'neutral',
  'spotify.exe': 'neutral',
  'Slack.exe': 'neutral',
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
  isLoading: false,
  error: null,
  isInitialized: false,

  initializeTimeEntries: async (targetDateStr?: string) => {
    set({ isLoading: true, error: null })
    try {
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
      set({ isLoading: false, isInitialized: true })
    } catch (err: any) {
      set({ error: err?.message || 'Failed to initialize time entries', isLoading: false, isInitialized: true })
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
      const cat = getCategoryForEntry(entry, categories)
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
      list = list.filter((e) => getCategoryForEntry(e, categories) === catFilter)
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
      const cat = getCategoryForEntry(entry, categories)
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

    const BUCKET_MINUTES = 60
    function getBucketKey(dateStr: string): string {
      const d = new Date(dateStr)
      const bucket = Math.floor(d.getHours() / (BUCKET_MINUTES / 60)) * BUCKET_MINUTES
      const h = Math.floor(bucket / 60)
      const m = bucket % 60
      const label = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m)
      return label.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    }

    const firstDate = new Date(sorted[0].startTime)
    const firstBucket = getBucketKey(sorted[0].startTime)
    const buckets = new Map<string, { focusSec: number; totalSec: number }>()

    sorted.forEach((entry) => {
      const dur = entry.durationSeconds || 0
      const key = getBucketKey(entry.startTime)
      const prev = buckets.get(key) || { focusSec: 0, totalSec: 0 }
      prev.totalSec += dur
      const cat = getCategoryForEntry(entry, categories)
      if (cat === 'work' && entry.endReason !== 'idle') {
        prev.focusSec += dur
      }
      buckets.set(key, prev)
    })

    const bucketKeys = Array.from(buckets.keys()).sort((a, b) => {
      const ta = new Date(`1970/01/01 ${a}`).getTime()
      const tb = new Date(`1970/01/01 ${b}`).getTime()
      return ta - tb
    })

    let totalFocusSec = 0
    let totalScreenSec = 0
    const points: CumulativePoint[] = []

    points.push({
      timestamp: firstBucket,
      cumulativeFocusMins: 0,
      cumulativeTotalMins: 0,
    })

    bucketKeys.forEach((key) => {
      const bucket = buckets.get(key)!
      totalScreenSec += bucket.totalSec
      totalFocusSec += bucket.focusSec
      points.push({
        timestamp: key,
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
      const cat = getCategoryForEntry(entry, categories)
      if (cat === 'work') workSec += dur
      }
    })

    const totalTracked = focusSec + idleSec || 1
    const focusEfficiency = Math.round((focusSec / totalTracked) * 100)
    const deepWorkRatio = Math.round((workSec / (focusSec || 1)) * 100)

    const topApps = get().getTopAppsFiltered()
    const topApp = topApps[0]

    let contextSwitches = 0
    let lastApp = ''
    filtered.forEach((entry) => {
      if (entry.appName && entry.appName !== lastApp) {
        contextSwitches++
        lastApp = entry.appName
      }
    })

    return {
      computerOnTimeSeconds: totalTracked,
      activeFocusSeconds: focusSec,
      idleTimeSeconds: idleSec,
      focusEfficiency,
      contextSwitches,
      deepWorkRatio,
      topAppName: topApp ? topApp.appName : 'None',
      topAppDurationSeconds: topApp ? topApp.totalSeconds : focusSec,
    }
  },

  getDailyUsageHours: (daysCount = 7) => {
    const result: DailyUsageBar[] = []
    const today = new Date()
    const entries = get().entries

    const dateMap = new Map<string, number>()
    entries.forEach((e) => {
      if (e.endReason === 'idle') return
      const dateKey = e.startTime.split('T')[0]
      if (dateKey) {
        const curr = dateMap.get(dateKey) || 0
        dateMap.set(dateKey, curr + (e.durationSeconds || 0))
      }
    })

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const totalSec = dateMap.get(dateStr) || 0
      const totalHours = Math.round((totalSec / 3600) * 10) / 10
      const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })
      result.push({
        date: dateStr,
        dayLabel,
        totalHours,
        totalSeconds: totalSec,
        isToday: i === 0,
      })
    }

    return result
  },

  getActivePeriods: (targetDateStr) => {
    const dateStr = targetDateStr || get().selectedDate || new Date().toISOString().split('T')[0]
    const categories = get().categories

    const dayEntries = get().entries
      .filter((e) => e.startTime.startsWith(dateStr) && e.endReason !== 'idle' && (e.durationSeconds || 0) > 0)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    if (dayEntries.length === 0) return []

    const periods: ActivePeriodBlock[] = []
    let currentBlockEntries: TimeEntry[] = []

    dayEntries.forEach((entry) => {
      if (currentBlockEntries.length === 0) {
        currentBlockEntries.push(entry)
        return
      }

      const lastEntry = currentBlockEntries[currentBlockEntries.length - 1]
      const lastEndTime = lastEntry.endTime
        ? new Date(lastEntry.endTime).getTime()
        : new Date(lastEntry.startTime).getTime() + (lastEntry.durationSeconds || 0) * 1000
      const currentStartTime = new Date(entry.startTime).getTime()

      if (currentStartTime - lastEndTime <= 900000) {
        currentBlockEntries.push(entry)
      } else {
        periods.push(buildActiveBlock(currentBlockEntries, categories))
        currentBlockEntries = [entry]
      }
    })

    if (currentBlockEntries.length > 0) {
      periods.push(buildActiveBlock(currentBlockEntries, categories))
    }

    const result: TimelinePeriodItem[] = []
    for (let i = 0; i < periods.length; i++) {
      if (i > 0) {
        const prevEndParts = periods[i - 1].endTime.split(':')
        const currStartParts = periods[i].startTime.split(':')
        const prevEndMins = parseInt(prevEndParts[0], 10) * 60 + parseInt(prevEndParts[1], 10)
        const currStartMins = parseInt(currStartParts[0], 10) * 60 + parseInt(currStartParts[1], 10)
        const gapMins = currStartMins - prevEndMins

        if (gapMins >= 30) {
          const gapHours = Math.round((gapMins / 60) * 10) / 10
          result.push({
            id: `gap-${i}`,
            isGap: true,
            startTime: periods[i - 1].endTime,
            endTime: periods[i].startTime,
            durationHours: gapHours,
          })
        }
      }
      result.push(periods[i])
    }

    return result
  },

  getAppRankingByHours: (targetDateStr, limit = 10) => {
    const dateStr = targetDateStr || get().selectedDate
    const categories = get().categories
    let targetEntries = get().entries.filter((e) => e.endReason !== 'idle' && (e.durationSeconds || 0) > 0)

    if (dateStr) {
      targetEntries = targetEntries.filter((e) => e.startTime.startsWith(dateStr))
    }

    const appMap = new Map<string, { totalSeconds: number; sessionsCount: number }>()
    let grandTotalSeconds = 0

    targetEntries.forEach((entry) => {
      const dur = entry.durationSeconds || 0
      grandTotalSeconds += dur
      const existing = appMap.get(entry.appName) || { totalSeconds: 0, sessionsCount: 0 }
      appMap.set(entry.appName, {
        totalSeconds: existing.totalSeconds + dur,
        sessionsCount: existing.sessionsCount + 1,
      })
    })

    const ranking: AppStatItem[] = []
    appMap.forEach((val, appName) => {
      const category = categories[appName] || 'neutral'
      const percentage = grandTotalSeconds > 0 ? Math.round((val.totalSeconds / grandTotalSeconds) * 100) : 0
      ranking.push({
        appName,
        category,
        totalSeconds: val.totalSeconds,
        percentage,
        sessionsCount: val.sessionsCount,
      })
    })

    return ranking.sort((a, b) => b.totalSeconds - a.totalSeconds).slice(0, limit)
  },
}))

function buildActiveBlock(entries: TimeEntry[], categories: Record<string, CategoryType>): ActivePeriodBlock {
  const first = entries[0]
  const last = entries[entries.length - 1]

  const startDate = new Date(first.startTime)
  const endDate = last.endTime ? new Date(last.endTime) : new Date(new Date(last.startTime).getTime() + (last.durationSeconds || 0) * 1000)

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  const startHourDecimal = startDate.getHours() + startDate.getMinutes() / 60
  const endHourDecimal = endDate.getHours() + endDate.getMinutes() / 60

  let totalDuration = 0
  const appCounts = new Map<string, number>()

  entries.forEach((e) => {
    const dur = e.durationSeconds || 0
    totalDuration += dur
    appCounts.set(e.appName, (appCounts.get(e.appName) || 0) + dur)
  })

  let topAppName = first.appName
  let maxDur = 0
  appCounts.forEach((dur, app) => {
    if (dur > maxDur) {
      maxDur = dur
      topAppName = app
    }
  })

  const topAppCategory = categories[topAppName] || 'neutral'

  return {
    id: `block-${first.id}`,
    isGap: false,
    startTime: formatTime(startDate),
    endTime: formatTime(endDate),
    startHourDecimal,
    endHourDecimal,
    durationSeconds: totalDuration,
    topAppName,
    topAppCategory,
    totalEntries: entries.length,
  }
}
