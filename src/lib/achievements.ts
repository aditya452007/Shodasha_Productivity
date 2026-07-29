export interface Achievement {
  id: string
  title: string
  description: string
  iconName: 'sprout' | 'zap' | 'brain' | 'star' | 'gem' | 'flame' | 'trophy'
  targetCount: number
  type: 'streak' | 'total_checkins' | 'focus_hours' | 'tasks_done' | 'habits_created'
  category: 'streaks' | 'focus' | 'tasks' | 'habits' | 'milestones'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'legendary'
}

export interface UserAchievementProgress {
  achievement: Achievement
  currentProgress: number
  unlocked: boolean
  unlockDate?: string
  progressPercentage: number
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  // Streaks category (amber)
  {
    id: 'streak-7',
    title: 'Seedling Routine',
    description: 'Maintain a continuous 7-day habit check-in streak.',
    iconName: 'sprout',
    targetCount: 7,
    type: 'streak',
    category: 'streaks',
    tier: 'bronze',
  },
  {
    id: 'streak-15',
    title: 'Momentum Master',
    description: 'Reach a 15-day continuous streak of habit consistency.',
    iconName: 'zap',
    targetCount: 15,
    type: 'streak',
    category: 'streaks',
    tier: 'silver',
  },
  {
    id: 'streak-21',
    title: 'Habit Formation Protocol',
    description: 'Complete 21 consecutive days to wire new neural pathways.',
    iconName: 'brain',
    targetCount: 21,
    type: 'streak',
    category: 'streaks',
    tier: 'gold',
  },
  {
    id: 'streak-30',
    title: 'Monthly Titan',
    description: 'Unstoppable! Achieve a full 30-day continuous streak.',
    iconName: 'star',
    targetCount: 30,
    type: 'streak',
    category: 'streaks',
    tier: 'gold',
  },

  // Focus category (blue)
  {
    id: 'focus-30',
    title: '30-Hour Focus Week',
    description: 'Log 30 hours of total desktop focus time.',
    iconName: 'zap',
    targetCount: 30,
    type: 'focus_hours',
    category: 'focus',
    tier: 'silver',
  },
  {
    id: 'focus-100',
    title: '100 Deep Work Hours',
    description: 'Cross 100 hours of active focus tracking.',
    iconName: 'star',
    targetCount: 100,
    type: 'focus_hours',
    category: 'focus',
    tier: 'gold',
  },
  {
    id: 'focus-500',
    title: 'Deep Work Adept',
    description: 'Log 500 focus hours.',
    iconName: 'brain',
    targetCount: 500,
    type: 'focus_hours',
    category: 'focus',
    tier: 'platinum',
  },
  {
    id: 'focus-1000',
    title: 'Focus Grandmaster',
    description: 'Log 1000 focus hours.',
    iconName: 'gem',
    targetCount: 1000,
    type: 'focus_hours',
    category: 'focus',
    tier: 'master',
  },

  // Tasks category (green)
  {
    id: 'tasks-50',
    title: 'Task Terminator',
    description: 'Complete 50 tasks.',
    iconName: 'zap',
    targetCount: 50,
    type: 'tasks_done',
    category: 'tasks',
    tier: 'silver',
  },
  {
    id: 'tasks-200',
    title: 'Execution Engine',
    description: 'Complete 200 tasks.',
    iconName: 'flame',
    targetCount: 200,
    type: 'tasks_done',
    category: 'tasks',
    tier: 'gold',
  },
  {
    id: 'tasks-1000',
    title: 'Centurion of Action',
    description: 'Complete 1000 tasks.',
    iconName: 'trophy',
    targetCount: 1000,
    type: 'tasks_done',
    category: 'tasks',
    tier: 'legendary',
  },

  // Habits category (violet)
  {
    id: 'habits-5',
    title: 'Habit Collector',
    description: 'Create 5 active habits.',
    iconName: 'sprout',
    targetCount: 5,
    type: 'habits_created',
    category: 'habits',
    tier: 'bronze',
  },
  {
    id: 'habits-15',
    title: 'Ritual Architect',
    description: 'Create 15 active habits.',
    iconName: 'star',
    targetCount: 15,
    type: 'habits_created',
    category: 'habits',
    tier: 'gold',
  },

  // Milestones category (teal)
  {
    id: 'total-90',
    title: 'Quarterly Sentinel',
    description: 'Log 90 total habit check-in days across your journey.',
    iconName: 'gem',
    targetCount: 90,
    type: 'total_checkins',
    category: 'milestones',
    tier: 'platinum',
  },
  {
    id: 'total-180',
    title: 'Half-Year Vanguard',
    description: 'Log 180 total habit check-in days with unshakeable resolve.',
    iconName: 'flame',
    targetCount: 180,
    type: 'total_checkins',
    category: 'milestones',
    tier: 'diamond',
  },
  {
    id: 'total-365',
    title: 'Legendary Consistency',
    description: 'Achieve 365 total check-in days. True mastery of time.',
    iconName: 'trophy',
    targetCount: 365,
    type: 'total_checkins',
    category: 'milestones',
    tier: 'legendary',
  },
]

export function computeAchievementsProgress(
  streakDays: number,
  totalCheckInDays: number,
  totalFocusHours: number = 0,
  totalTasksDone: number = 0,
  totalHabitsCreated: number = 0
): UserAchievementProgress[] {
  return ACHIEVEMENTS_LIST.map((achievement) => {
    let currentProgress = 0
    if (achievement.type === 'streak') currentProgress = streakDays
    else if (achievement.type === 'total_checkins') currentProgress = totalCheckInDays
    else if (achievement.type === 'focus_hours') currentProgress = totalFocusHours
    else if (achievement.type === 'tasks_done') currentProgress = totalTasksDone
    else if (achievement.type === 'habits_created') currentProgress = totalHabitsCreated

    const unlocked = currentProgress >= achievement.targetCount
    const progressPercentage = Math.min(100, Math.round((currentProgress / achievement.targetCount) * 100))

    return {
      achievement,
      currentProgress,
      unlocked,
      progressPercentage,
      unlockDate: unlocked ? 'Unlocked' : undefined,
    }
  })
}
