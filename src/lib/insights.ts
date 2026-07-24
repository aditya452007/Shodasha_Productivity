export interface Insight {
  label: string
  value: string
  type: 'positive' | 'neutral' | 'negative'
}

export function generateTimeInsights(totalSeconds: number, weekSeconds: number): Insight[] {
  const insights: Insight[] = []
  if (totalSeconds === 0) {
    insights.push({ label: 'Welcome', value: 'Start tracking to see insights', type: 'neutral' })
    return insights
  }

  const dailyAvg = totalSeconds / Math.max(weekSeconds > 0 ? 7 : 1, 1)
  if (dailyAvg > 28800) {
    insights.push({ label: 'Screen Time', value: 'High daily average — consider breaks', type: 'negative' })
  } else if (dailyAvg > 14400) {
    insights.push({ label: 'Screen Time', value: 'Moderate usage', type: 'neutral' })
  } else {
    insights.push({ label: 'Screen Time', value: 'Healthy balance', type: 'positive' })
  }

  return insights
}

export function generateHabitInsights(completedToday: number, totalHabits: number): Insight[] {
  if (totalHabits === 0) {
    return [{ label: 'Habits', value: 'Create habits to get started', type: 'neutral' }]
  }

  const rate = totalHabits > 0 ? completedToday / totalHabits : 0
  if (rate >= 0.8) {
    return [{ label: 'Check-ins', value: 'Great consistency today', type: 'positive' }]
  }
  if (rate >= 0.5) {
    return [{ label: 'Check-ins', value: 'Halfway there — keep going', type: 'neutral' }]
  }
  return [{ label: 'Check-ins', value: 'Few completions — try small wins', type: 'negative' }]
}
