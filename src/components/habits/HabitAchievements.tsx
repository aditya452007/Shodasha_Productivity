'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Sprout,
  Zap,
  Brain,
  Star,
  Gem,
  Flame,
  Trophy,
} from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { computeAchievementsProgress, Achievement } from '@/lib/achievements'

function renderAchievementIcon(iconName: Achievement['iconName']) {
  switch (iconName) {
    case 'sprout':
      return <Sprout className="w-5 h-5 text-emerald-500" />
    case 'zap':
      return <Zap className="w-5 h-5 text-amber-500" />
    case 'brain':
      return <Brain className="w-5 h-5 text-violet-500" />
    case 'star':
      return <Star className="w-5 h-5 text-yellow-500" />
    case 'gem':
      return <Gem className="w-5 h-5 text-sky-500" />
    case 'flame':
      return <Flame className="w-5 h-5 text-rose-500" />
    case 'trophy':
      return <Trophy className="w-5 h-5 text-amber-400" />
    default:
      return <Award className="w-5 h-5 text-[var(--accent)]" />
  }
}

export function HabitAchievements() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  // Compute total unique check-in days and active streak
  const { currentStreak, totalCheckInDays } = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Unique dates where at least 1 habit was completed
    const uniqueDates = new Set<string>()
    Object.entries(records).forEach(([key, done]) => {
      if (done) {
        const datePart = key.split('_')[1]
        if (datePart) uniqueDates.add(datePart)
      }
    })

    // Active streak
    let streak = 0
    let checkDate = new Date(today)
    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
    if (!anyDoneToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCompleted = habits.some((h) => !!records[`${h.id}_${dateStr}`])
      if (hasCompleted) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return {
      currentStreak: streak,
      totalCheckInDays: uniqueDates.size,
    }
  }, [habits, records])

  const achievementProgresses = useMemo(() => {
    return computeAchievementsProgress(currentStreak, totalCheckInDays)
  }, [currentStreak, totalCheckInDays])

  const unlockedCount = achievementProgresses.filter((a) => a.unlocked).length

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
              Consistency Achievements & Milestones
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Unlock badges by maintaining continuous streaks and total check-in milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            {unlockedCount} / {achievementProgresses.length} Unlocked
          </span>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievementProgresses.map(({ achievement, currentProgress, unlocked, progressPercentage }) => {
          return (
            <motion.div
              key={achievement.id}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative rounded-xl border p-4 transition-all overflow-hidden group ${
                unlocked
                  ? 'border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 shadow-xs'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] opacity-85'
              }`}
            >
              {/* Category Ribbon / Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-xs">
                  {renderAchievementIcon(achievement.iconName)}
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                    unlocked
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-[var(--border-subtle)]'
                  }`}
                >
                  {achievement.category}
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-bold font-display text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                {achievement.title}
                {unlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-[var(--text-tertiary)] inline shrink-0" />
                )}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 min-h-[32px]">
                {achievement.description}
              </p>

              {/* Progress Bar & Counter */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[var(--text-tertiary)] mb-1">
                  <span>
                    {currentProgress} / {achievement.targetCount} {achievement.type === 'streak' ? 'days streak' : 'days'}
                  </span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      unlocked ? 'bg-amber-500' : 'bg-[var(--accent)]'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Hover Tooltip Card */}
              <div className="absolute inset-0 bg-gray-950/95 p-4 text-white flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none rounded-xl">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-display mb-1">
                    <ShieldCheck className="w-4 h-4" /> {achievement.title}
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-[10px] font-semibold text-emerald-400 border-t border-gray-800 pt-2">
                  {unlocked
                    ? 'Achievement Unlocked'
                    : `Requires ${achievement.targetCount - currentProgress} more ${
                        achievement.type === 'streak' ? 'consecutive streak days' : 'total check-in days'
                      }.`}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
