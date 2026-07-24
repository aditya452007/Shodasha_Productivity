import { create } from 'zustand'
import { useTaskStore, AsyncState } from './taskStore'
import {
  fetchHabitsFromDb,
  fetchHabitRecordsFromDb,
  createHabitInDb,
  deleteHabitFromDb,
  toggleHabitRecordInDb,
} from '@/lib/db'

export interface Habit {
  id: string
  name: string
  color: string
  linkedTaskId?: string
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
  addHabit: (name: string, color?: string, linkedTaskId?: string) => void
  updateHabit: (id: string, name: string, color: string, linkedTaskId?: string) => void
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
  toggleHabit: (habitId, date) => {
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
    toggleHabitRecordInDb(recordId, habitId, date, nextDone)

    // Domain Rule: Completing a Habit for a day auto-completes its linked Task (one-way link)
    if (nextDone) {
      const targetHabit = get().habits.find((h) => h.id === habitId)
      if (targetHabit?.linkedTaskId) {
        useTaskStore.getState().moveTask(targetHabit.linkedTaskId, 'done')
      }
    }
  },
  addHabit: (name, color = '#059669', linkedTaskId) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name,
      color,
      linkedTaskId: linkedTaskId || undefined,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ habits: [...state.habits, newHabit] }))
    createHabitInDb({
      id: newHabit.id,
      name: newHabit.name,
      color: newHabit.color,
      linked_task_id: newHabit.linkedTaskId || null,
      created_at: newHabit.createdAt,
    })
  },
  updateHabit: (id, name, color, linkedTaskId) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, name, color, linkedTaskId: linkedTaskId || undefined } : h
      ),
    })),
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
