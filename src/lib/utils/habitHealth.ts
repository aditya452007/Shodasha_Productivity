/**
 * Utility functions for calculating per-habit HP from completion records.
 *
 * HP is derived from the trailing 30-day window: each check-in heals HP by the
 * habit's priority value, each missed day after the habit's first check-in
 * drains HP by the same value. Clamped between 0 and 100.
 */

import { Habit, HabitPriority } from '@/stores/habitStore'

export const HP_MAX = 100
export const HP_WINDOW_DAYS = 30

export const HP_HEAL_BY_PRIORITY: Record<HabitPriority, number> = { high: 20, medium: 10, low: 5 }
export const HP_DRAIN_BY_PRIORITY: Record<HabitPriority, number> = { high: 20, medium: 10, low: 5 }

export type HpBand = 'healthy' | 'low' | 'critical' | 'depleted'

export interface HabitHp {
  hp: number
  band: HpBand
}

/**
 * Calculates the current HP for a habit based on its check-in history.
 * @param habit The habit (priority + createdAt used)
 * @param records Record map keyed by `${habitId}_${YYYY-MM-DD}` -> boolean
 */
export function getHabitHp(habit: Habit, records: Record<string, boolean>): HabitHp {
  const heal = HP_HEAL_BY_PRIORITY[habit.priority]
  const drain = HP_DRAIN_BY_PRIORITY[habit.priority]

  const today = new Date()
  const windowStart = new Date(today)
  windowStart.setDate(windowStart.getDate() - (HP_WINDOW_DAYS - 1))
  const startStr = windowStart.toISOString().split('T')[0]
  const todayStr = today.toISOString().split('T')[0]

  const creationStr = habit.createdAt ? habit.createdAt.split('T')[0] : startStr

  let hp = 0
  let hasEverCheckedIn = false
  let cursor = new Date(startStr)
  const end = new Date(todayStr + 'T00:00:00')

  while (cursor <= end) {
    const dateStr = cursor.toISOString().split('T')[0]
    if (dateStr >= creationStr) {
      const done = !!records[`${habit.id}_${dateStr}`]
      if (done) {
        hasEverCheckedIn = true
        hp = Math.min(HP_MAX, hp + heal)
      } else if (hasEverCheckedIn) {
        hp = Math.max(0, hp - drain)
      }
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  const band: HpBand = hasEverCheckedIn && hp <= 0 ? 'depleted' : hp > 66 ? 'healthy' : hp > 33 ? 'low' : 'critical'

  return { hp, band }
}
