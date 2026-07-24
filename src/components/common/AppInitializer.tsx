'use client'

import { useEffect } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'

export function AppInitializer() {
  useEffect(() => {
    useTaskStore.getState().initializeTasks()
    useHabitStore.getState().initializeHabits()
    useTimeEntryStore.getState().initializeTimeEntries()
  }, [])

  return null
}
