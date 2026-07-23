export interface Achievement {
  id: string
  title: string
  description: string
  icon: string // emoji or icon key
  targetCount: number // days streak or total check-in days needed
  type: 'streak' | 'total_checkins'
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
    icon: '🌱',
    targetCount: 7,
    type: 'streak',
    category: 'bronze',
  },
  {
    id: 'streak-15',
    title: 'Momentum Master',
    description: 'Reach a 15-day continuous streak of habit consistency.',
    icon: '⚡',
    targetCount: 15,
    type: 'streak',
    category: 'silver',
  },
  {
    id: 'streak-21',
    title: 'Habit Formation Protocol',
    description: 'Complete 21 consecutive days to wire new neural pathways.',
    icon: '🧠',
    targetCount: 21,
    type: 'streak',
    category: 'gold',
  },
  {
    id: 'streak-30',
    title: 'Monthly Titan',
    description: 'Unstoppable! Achieve a full 30-day continuous streak.',
    icon: '🌟',
    targetCount: 30,
    type: 'streak',
    category: 'gold',
  },
  {
    id: 'total-90',
    title: 'Quarterly Sentinel',
    description: 'Log 90 total habit check-in days across your journey.',
    icon: '💎',
    targetCount: 90,
    type: 'total_checkins',
    category: 'platinum',
  },
  {
    id: 'total-180',
    title: 'Half-Year Vanguard',
    description: 'Log 180 total habit check-in days with unshakeable resolve.',
    icon: '🔥',
    targetCount: 180,
    type: 'total_checkins',
    category: 'diamond',
  },
  {
    id: 'total-365',
    title: 'Legendary Consistency',
    description: 'Achieve 365 total check-in days. True mastery of time.',
    icon: '🏆',
    targetCount: 365,
    type: 'total_checkins',
    category: 'legendary',
  },
]

export function computeAchievementsProgress(
  streakDays: number,
  totalCheckInDays: number
): UserAchievementProgress[] {
  return ACHIEVEMENTS_LIST.map((achievement) => {
    const currentProgress =
      achievement.type === 'streak' ? streakDays : totalCheckInDays
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
