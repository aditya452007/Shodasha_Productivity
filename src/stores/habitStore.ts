import { create } from 'zustand'
import { useTaskStore, AsyncState } from './taskStore'
import {
  fetchHabitsFromDb,
  fetchHabitRecordsFromDb,
  createHabitInDb,
  updateHabitInDb,
  deleteHabitFromDb,
  toggleHabitRecordInDb,
} from '@/lib/db'

export interface Habit {
  id: string
  name: string
  color: string
  linkedTaskId?: string
  url?: string
  createdAt: string
}

export interface HabitRecord {
  id: string
  habitId: string
  date: string // YYYY-MM-DD
  done: boolean
}

interface HabitState extends AsyncState {
  habits: Habit[]
  records: Record<string, boolean> // key: `${habitId}_${date}` -> boolean
  initializeHabits: () => Promise<void>
  toggleHabit: (habitId: string, date: string) => void
  addHabit: (name: string, color?: string, linkedTaskId?: string, url?: string) => void
  updateHabit: (id: string, name: string, color: string, linkedTaskId?: string, url?: string) => void
  deleteHabit: (id: string) => void
}

function generateInitialRecords(): Record<string, boolean> {
  return {}
}

const initialHabits: Habit[] = []

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: initialHabits,
  records: generateInitialRecords(),
  isLoading: false,
  error: null,
  isInitialized: false,
  initializeHabits: async () => {
    set({ isLoading: true, error: null })
    try {
      const dbHabits = await fetchHabitsFromDb()
      const dbRecords = await fetchHabitRecordsFromDb()

      if (dbHabits && Array.isArray(dbHabits)) {
        const mappedHabits: Habit[] = dbHabits.map((h: any) => ({
          id: h.id,
          name: h.name,
          color: h.color,
          linkedTaskId: h.linked_task_id || undefined,
          url: h.url || undefined,
          createdAt: h.created_at,
        }))
        set({ habits: mappedHabits })
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

    set((state) => ({
      records: {
        ...state.records,
        [key]: nextDone,
      },
    }))

    const recordId = `rec_${habitId}_${date}`
    try {
      await toggleHabitRecordInDb(recordId, habitId, date, nextDone)
    } catch {
      set((state) => ({
        records: {
          ...state.records,
          [key]: currentlyDone,
        },
      }))
      return
    }

    if (nextDone) {
      const targetHabit = get().habits.find((h) => h.id === habitId)
      if (targetHabit?.linkedTaskId) {
        useTaskStore.getState().moveTask(targetHabit.linkedTaskId, 'done')
      }
    }
  },
  addHabit: (name, color = '#059669', linkedTaskId, url) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name,
      color,
      linkedTaskId: linkedTaskId || undefined,
      url: url || undefined,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ habits: [...state.habits, newHabit] }))
    createHabitInDb({
      id: newHabit.id,
      name: newHabit.name,
      color: newHabit.color,
      linked_task_id: newHabit.linkedTaskId || null,
      url: newHabit.url || null,
      created_at: newHabit.createdAt,
    })
  },
  updateHabit: (id, name, color, linkedTaskId, url) => {
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, name, color, linkedTaskId: linkedTaskId || undefined, url: url || undefined } : h
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
}))
