'use client'

import { useEffect } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useSettingsStore } from '@/stores/settingsStore'

export function AppInitializer() {
  useEffect(() => {
    useSettingsStore.getState().initializeSettings()
    useTaskStore.getState().initializeTasks()
    useHabitStore.getState().initializeHabits()
    useTimeEntryStore.getState().initializeTimeEntries()
  }, [])

  return null
}
