/**
 * Utility functions for calculating streaks from habit completion records.
 */

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  isCompletedToday: boolean
}

/**
 * Calculates current streak, longest streak, and today's completion status for a given habit.
 * @param habitId The habit ID
 * @param records Record map keyed by `${habitId}_${YYYY-MM-DD}` -> boolean
 * @param createdAt ISO timestamp string; the earliest date the streak can consider
 */
export function calculateHabitStreak(
  habitId: string,
  records: Record<string, boolean>,
  createdAt?: string
): StreakResult {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const isCompletedToday = !!records[`${habitId}_${todayStr}`]

  const startBoundary = createdAt ? createdAt.split('T')[0] : null

  // Calculate current consecutive streak backwards from today (or yesterday if today isn't completed yet)
  let currentStreak = 0
  let checkDate = new Date(today)

  if (!isCompletedToday) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0]
    if (startBoundary && dateStr < startBoundary) break
    if (records[`${habitId}_${dateStr}`]) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Calculate longest historical streak across all recorded dates for this habit
  let longestStreak = currentStreak
  let tempStreak = 0

  // Gather all dates where this habit was done, filtered to after creation
  const habitDates = Object.keys(records)
    .filter((key) => key.startsWith(`${habitId}_`) && records[key])
    .map((key) => key.replace(`${habitId}_`, ''))
    .filter((dateStr) => !startBoundary || dateStr >= startBoundary)
    .sort()

  if (habitDates.length > 0) {
    tempStreak = 1
    let maxTemp = 1
    for (let i = 1; i < habitDates.length; i++) {
      const prev = new Date(habitDates[i - 1])
      const curr = new Date(habitDates[i])
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24))

      if (diffDays === 1) {
        tempStreak++
      } else if (diffDays > 1) {
        tempStreak = 1
      }
      if (tempStreak > maxTemp) {
        maxTemp = tempStreak
      }
    }
    longestStreak = Math.max(longestStreak, maxTemp)
  }

  return {
    currentStreak,
    longestStreak,
    isCompletedToday,
  }
}
