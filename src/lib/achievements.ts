export interface Achievement {
  id: string
  title: string
  description: string
  iconName: 'sprout' | 'zap' | 'brain' | 'star' | 'gem' | 'flame' | 'trophy'
  targetCount: number // days streak, total check-in days, or focus hours needed
  type: 'streak' | 'total_checkins' | 'focus_hours'
  category: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary'
}

export interface UserAchievementProgress {
  achievement: Achievement
  currentProgress: number
  unlocked: boolean
  unlockDate?: string
  progressPercentage: number
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'streak-7',
    title: 'Seedling Routine',
    description: 'Maintain a continuous 7-day habit check-in streak.',
    iconName: 'sprout',
    targetCount: 7,
    type: 'streak',
    category: 'bronze',
  },
  {
    id: 'focus-30',
    title: '30-Hour Focus Week',
    description: 'Log 30 hours of total desktop focus time.',
    iconName: 'zap',
    targetCount: 30,
    type: 'focus_hours',
    category: 'silver',
  },
  {
    id: 'streak-15',
    title: 'Momentum Master',
    description: 'Reach a 15-day continuous streak of habit consistency.',
    iconName: 'zap',
    targetCount: 15,
    type: 'streak',
    category: 'silver',
  },
  {
    id: 'streak-21',
    title: 'Habit Formation Protocol',
    description: 'Complete 21 consecutive days to wire new neural pathways.',
    iconName: 'brain',
    targetCount: 21,
    type: 'streak',
    category: 'gold',
  },
  {
    id: 'focus-100',
    title: '100 Deep Work Hours',
    description: 'Cross 100 hours of active focus tracking.',
    iconName: 'star',
    targetCount: 100,
    type: 'focus_hours',
    category: 'gold',
  },
  {
    id: 'streak-30',
    title: 'Monthly Titan',
    description: 'Unstoppable! Achieve a full 30-day continuous streak.',
    iconName: 'star',
    targetCount: 30,
    type: 'streak',
    category: 'gold',
  },
  {
    id: 'total-90',
    title: 'Quarterly Sentinel',
    description: 'Log 90 total habit check-in days across your journey.',
    iconName: 'gem',
    targetCount: 90,
    type: 'total_checkins',
    category: 'platinum',
  },
  {
    id: 'total-180',
    title: 'Half-Year Vanguard',
    description: 'Log 180 total habit check-in days with unshakeable resolve.',
    iconName: 'flame',
    targetCount: 180,
    type: 'total_checkins',
    category: 'diamond',
  },
  {
    id: 'total-365',
    title: 'Legendary Consistency',
    description: 'Achieve 365 total check-in days. True mastery of time.',
    iconName: 'trophy',
    targetCount: 365,
    type: 'total_checkins',
    category: 'legendary',
  },
]

export function computeAchievementsProgress(
  streakDays: number,
  totalCheckInDays: number,
  totalFocusHours: number = 0
): UserAchievementProgress[] {
  return ACHIEVEMENTS_LIST.map((achievement) => {
    let currentProgress = 0
    if (achievement.type === 'streak') currentProgress = streakDays
    else if (achievement.type === 'total_checkins') currentProgress = totalCheckInDays
    else if (achievement.type === 'focus_hours') currentProgress = totalFocusHours

    const unlocked = currentProgress >= achievement.targetCount
    const progressPercentage = Math.min(
      100,
      Math.round((currentProgress / achievement.targetCount) * 100)
    )

    return {
      achievement,
      currentProgress,
      unlocked,
      progressPercentage,
      unlockDate: unlocked ? 'Unlocked' : undefined,
    }
  })
}
