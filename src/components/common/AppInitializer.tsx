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

  // Self-heal: if the habit store failed to load (or never finished), retry
  // when the window regains focus — e.g. after the backend was restarted.
  useEffect(() => {
    const reinitializeIfNeeded = () => {
      if (document.visibilityState !== 'visible') return
      const habit = useHabitStore.getState()
      if (!habit.isInitialized || habit.error) {
        habit.initializeHabits()
      }
    }
    document.addEventListener('visibilitychange', reinitializeIfNeeded)
    return () => document.removeEventListener('visibilitychange', reinitializeIfNeeded)
  }, [])

  return null
}
