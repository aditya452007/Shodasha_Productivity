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
  updateHabit: (id: string, name: string, color: string, linkedTaskId?: string) => void
  deleteHabit: (id: string) => void
}

// Generate realistic mock records for the past 90 days for initial rich heatmap visualization
function generateInitialRecords(): Record<string, boolean> {
  const records: Record<string, boolean> = {}
  const today = new Date()
  
  for (let i = 0; i < 90; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    // Simulate high consistency for h-1, moderate for h-2 and h-3
    if ((i * 3 + 1) % 4 !== 0) records[`h-1_${dateStr}`] = true
    if (i % 2 === 0) records[`h-2_${dateStr}`] = true
    if (i % 3 !== 0) records[`h-3_${dateStr}`] = true
  }
  
  return records
}

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

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: initialHabits,
  records: generateInitialRecords(),
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
        linkedTaskId: linkedTaskId || undefined,
        createdAt: new Date().toISOString(),
      }
      return { habits: [...state.habits, newHabit] }
    }),
  updateHabit: (id, name, color, linkedTaskId) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, name, color, linkedTaskId: linkedTaskId || undefined } : h
      ),
    })),
  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
      // Clean up records for deleted habit
      records: Object.fromEntries(
        Object.entries(state.records).filter(([key]) => !key.startsWith(`${id}_`))
      ),
    })),
}))

