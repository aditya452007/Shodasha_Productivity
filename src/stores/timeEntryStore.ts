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

export interface AppCategory {
  appName: string
  category: CategoryType
}

interface TimeEntryState {
  entries: TimeEntry[]
  categories: Record<string, CategoryType>
  setCategory: (appName: string, category: CategoryType) => void
  getTotalFocusSecondsToday: () => number
  getCategoryBreakdownToday: () => { category: CategoryType; label: string; seconds: number; percentage: number }[]
}

const initialCategories: Record<string, CategoryType> = {
  'Code.exe': 'work',
  'cmd.exe': 'work',
  'WindowsTerminal.exe': 'work',
  'chrome.exe': 'neutral',
  'spotify.exe': 'neutral',
  'youtube.com': 'distraction',
}

const initialEntries: TimeEntry[] = [
  {
    id: 'te-1',
    appName: 'Code.exe',
    windowTitle: 'Shodasha_Productivity — Agent.md',
    startTime: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString(),
    endTime: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(),
    durationSeconds: 7200, // 2 hours
    createdAt: new Date().toISOString(),
  },
  {
    id: 'te-2',
    appName: 'WindowsTerminal.exe',
    windowTitle: 'PowerShell — npm run dev',
    startTime: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(),
    endTime: new Date(Date.now() - 3600 * 1000 * 0.1).toISOString(),
    durationSeconds: 1440, // 24 mins
    createdAt: new Date().toISOString(),
  },
  {
    id: 'te-3',
    appName: 'chrome.exe',
    windowTitle: 'Tailwind CSS Documentation',
    startTime: new Date(Date.now() - 3600 * 1000 * 0.1).toISOString(),
    endTime: new Date().toISOString(),
    durationSeconds: 600, // 10 mins
    createdAt: new Date().toISOString(),
  },
]

export const useTimeEntryStore = create<TimeEntryState>((set, get) => ({
  entries: initialEntries,
  categories: initialCategories,
  setCategory: (appName, category) =>
    set((state) => ({
      categories: { ...state.categories, [appName]: category },
    })),
  getTotalFocusSecondsToday: () => {
    return get().entries.reduce((total, entry) => {
      // Exclude idle time
      if (entry.endReason === 'idle') return total
      return total + (entry.durationSeconds || 0)
    }, 0)
  },
  getCategoryBreakdownToday: () => {
    const entries = get().entries
    const categories = get().categories

    let workSec = 0
    let neutralSec = 0
    let distractionSec = 0

    entries.forEach((entry) => {
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
}))
