import { create } from 'zustand'
import { useTaskStore } from './taskStore'

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

interface HabitState {
  habits: Habit[]
  records: Record<string, boolean> // key: `${habitId}_${date}` -> boolean
  toggleHabit: (habitId: string, date: string) => void
  addHabit: (name: string, color?: string, linkedTaskId?: string) => void
}

const todayStr = new Date().toISOString().split('T')[0]

const initialHabits: Habit[] = [
  {
    id: 'h-1',
    name: 'Morning Deep Work',
    color: '#059669', // Emerald
    linkedTaskId: 't-3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-2',
    name: '2L Water Intake',
    color: '#7c3aed', // Violet
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-3',
    name: 'Read Tech Article / Book (20m)',
    color: '#d97706', // Amber
    createdAt: new Date().toISOString(),
  },
]

const initialRecords: Record<string, boolean> = {
  [`h-1_${todayStr}`]: true,
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: initialHabits,
  records: initialRecords,
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

    // Domain Rule: Completing a Habit for a day auto-completes its linked Task (one-way link)
    if (nextDone) {
      const targetHabit = get().habits.find((h) => h.id === habitId)
      if (targetHabit?.linkedTaskId) {
        useTaskStore.getState().moveTask(targetHabit.linkedTaskId, 'done')
      }
    }
  },
  addHabit: (name, color = '#059669', linkedTaskId) =>
    set((state) => {
      const newHabit: Habit = {
        id: `h-${Date.now()}`,
        name,
        color,
        linkedTaskId,
        createdAt: new Date().toISOString(),
      }
      return { habits: [...state.habits, newHabit] }
    }),
}))
