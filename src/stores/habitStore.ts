import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useTaskStore, AsyncState } from './taskStore'
import { useGamificationStore } from './gamificationStore'
import {
  fetchHabitsFromDb,
  fetchHabitRecordsFromDb,
  createHabitInDb,
  updateHabitInDb,
  deleteHabitFromDb,
  toggleHabitRecordInDb,
  fetchHabitCategoriesFromDb,
  createHabitCategoryInDb,
  updateHabitCategoryInDb,
  deleteHabitCategoryFromDb,
} from '@/lib/db'

export type HabitPriority = 'high' | 'medium' | 'low'

export const GENERAL_CATEGORY = 'general'

export interface Habit {
  id: string
  name: string
  color: string
  linkedTaskId?: string
  url?: string
  priority: HabitPriority
  category: string
  reminderTime: string | null
  createdAt: string
}

export interface HabitCategory {
  id: string
  name: string
  color: string
  createdAt: string
}

export interface HabitRecord {
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  done: boolean
}

export const PRIORITY_ORDER: Record<HabitPriority, number> = { high: 0, medium: 1, low: 2 }

export const HABIT_XP_BY_PRIORITY: Record<HabitPriority, number> = { high: 20, medium: 10, low: 5 }

export function sortHabitsByPriority(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (byPriority !== 0) return byPriority
    return a.createdAt.localeCompare(b.createdAt)
  })
}

interface HabitState extends AsyncState {
  habits: Habit[]
  records: Record<string, boolean> // key: `${habitId}_${date}` -> boolean
  habitCategories: HabitCategory[]
  initializeHabits: () => Promise<void>
  toggleHabit: (habitId: string, date: string) => void
  addHabit: (name: string, color?: string, linkedTaskId?: string, url?: string, priority?: HabitPriority, category?: string, reminderTime?: string | null) => void
  updateHabit: (id: string, name: string, color: string, linkedTaskId?: string, url?: string, priority?: HabitPriority, category?: string, reminderTime?: string | null) => void
  deleteHabit: (id: string) => void
  addCategory: (name: string, color: string) => void
  updateCategory: (id: string, name: string, color: string) => void
  deleteCategory: (id: string) => void
}

function generateInitialRecords(): Record<string, boolean> {
  return {}
}

const initialHabits: Habit[] = []
const initialCategories: HabitCategory[] = []

export const useHabitStore = create<HabitState>()(
  immer((set, get) => ({
  habits: initialHabits,
  records: generateInitialRecords(),
  habitCategories: initialCategories,
  isLoading: false,
  error: null,
  isInitialized: false,
  initializeHabits: async () => {
    set({ isLoading: true, error: null })
    try {
      const dbHabits = await fetchHabitsFromDb()
      const dbRecords = await fetchHabitRecordsFromDb()
      const dbCategories = await fetchHabitCategoriesFromDb()

      if (dbHabits && Array.isArray(dbHabits)) {
        const mappedHabits: Habit[] = dbHabits.map((h: any) => ({
          id: h.id,
          name: h.name,
          color: h.color,
          linkedTaskId: h.linked_task_id || undefined,
          url: h.url || undefined,
          priority: h.priority === 'high' || h.priority === 'low' ? h.priority : 'medium',
          category: h.category || GENERAL_CATEGORY,
          reminderTime: h.reminder_time || null,
          createdAt: h.created_at,
        }))
        set({ habits: sortHabitsByPriority(mappedHabits) })
      }

      if (dbCategories && Array.isArray(dbCategories)) {
        const mappedCategories: HabitCategory[] = dbCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          color: c.color,
          createdAt: c.created_at,
        }))
        set({ habitCategories: mappedCategories })
      }

      if (dbRecords && Array.isArray(dbRecords)) {
        const recMap: Record<string, boolean> = {}
        dbRecords.forEach((r: any) => {
          if (r.done) {
            recMap[`${r.habit_id}_${r.date}`] = true
          }
        })
        set({ records: recMap })
      }
      set({ isLoading: false, isInitialized: true })
    } catch (err: any) {
      set({ error: err?.message || 'Failed to initialize habits', isLoading: false, isInitialized: true })
    }
  },
  toggleHabit: async (habitId, date) => {
    const todayStr = new Date().toISOString().split('T')[0]
    const twoDaysAgo = new Date(todayStr + 'T00:00:00')
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0]

    if (date < twoDaysAgoStr) {
      console.warn(`Cannot edit habit for ${date}: only last 2 days are editable`)
      return
    }

    if (date > todayStr) {
      console.warn(`Cannot edit habit for ${date}: future dates are not editable`)
      return
    }

    const key = `${habitId}_${date}`
    const currentlyDone = !!get().records[key]
    const nextDone = !currentlyDone

    set((state) => {
      state.records[key] = nextDone
    })

    const recordId = `rec_${habitId}_${date}`
    try {
      await toggleHabitRecordInDb(recordId, habitId, date, nextDone)
    } catch {
      set((state) => {
        state.records[key] = currentlyDone
      })
      return
    }

    if (nextDone) {
      const targetHabit = get().habits.find((h) => h.id === habitId)
      if (targetHabit?.linkedTaskId) {
        useTaskStore.getState().moveTask(targetHabit.linkedTaskId, 'done')
      }
      const xp = HABIT_XP_BY_PRIORITY[targetHabit?.priority ?? 'medium']
      useGamificationStore.getState().awardXP(xp, `habit_checkin_${habitId}_${date}`)

      // Check if all habits done today
      const habits = get().habits
      const records = get().records
      const todayStr = new Date().toISOString().split('T')[0]
      if (date === todayStr || date === todayStr) {
        const allDone = habits.every((h) => !!records[`${h.id}_${todayStr}`])
        if (allDone) {
          useGamificationStore.getState().awardXP(25, `all_done_bonus_${todayStr}`)
        }
      }
    }
  },
  addHabit: (name, color = 'var(--accent-emerald)', linkedTaskId, url, priority = 'medium', category = GENERAL_CATEGORY, reminderTime = null) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name,
      color,
      linkedTaskId: linkedTaskId || undefined,
      url: url || undefined,
      priority,
      category,
      reminderTime: reminderTime || null,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ habits: sortHabitsByPriority([...state.habits, newHabit]) }))
    createHabitInDb({
      id: newHabit.id,
      name: newHabit.name,
      color: newHabit.color,
      linked_task_id: newHabit.linkedTaskId || null,
      url: newHabit.url || null,
      priority: newHabit.priority,
      category: newHabit.category,
      reminder_time: newHabit.reminderTime,
      created_at: newHabit.createdAt,
    })
  },
  updateHabit: (id, name, color, linkedTaskId, url, priority, category, reminderTime) => {
    set((state) => ({
      habits: sortHabitsByPriority(
        state.habits.map((h) =>
          h.id === id
            ? {
                ...h,
                name,
                color,
                linkedTaskId: linkedTaskId || undefined,
                url: url || undefined,
                priority: priority ?? h.priority,
                category: category ?? h.category,
                reminderTime: reminderTime !== undefined ? reminderTime || null : h.reminderTime,
              }
            : h
        )
      ),
    }))
    const updated = get().habits.find((h) => h.id === id)
    if (updated) {
      updateHabitInDb({
        id: updated.id,
        name: updated.name,
        color: updated.color,
        linked_task_id: updated.linkedTaskId || null,
        url: updated.url || null,
        priority: updated.priority,
        category: updated.category,
        reminder_time: updated.reminderTime,
        created_at: updated.createdAt,
      })
    }
  },
  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      records: Object.fromEntries(
        Object.entries(state.records).filter(([key]) => !key.startsWith(`${id}_`))
      ),
    }))
    deleteHabitFromDb(id)
  },
  addCategory: (name, color) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const existing = get().habitCategories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    if (existing) return
    const newCategory: HabitCategory = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      color,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ habitCategories: [...state.habitCategories, newCategory] }))
    createHabitCategoryInDb({
      id: newCategory.id,
      name: newCategory.name,
      color: newCategory.color,
      created_at: newCategory.createdAt,
    })
  },
  updateCategory: (id, name, color) => {
    set((state) => ({
      habitCategories: state.habitCategories.map((c) =>
        c.id === id ? { ...c, name: name.trim() || c.name, color } : c
      ),
    }))
    const updated = get().habitCategories.find((c) => c.id === id)
    if (updated) {
      updateHabitCategoryInDb({
        id: updated.id,
        name: updated.name,
        color: updated.color,
        created_at: updated.createdAt,
      })
    }
  },
  deleteCategory: (id) => {
    set((state) => ({
      habitCategories: state.habitCategories.filter((c) => c.id !== id),
      habits: state.habits.map((h) => (h.category === id ? { ...h, category: GENERAL_CATEGORY } : h)),
    }))
    deleteHabitCategoryFromDb(id)
  },
}))
)
