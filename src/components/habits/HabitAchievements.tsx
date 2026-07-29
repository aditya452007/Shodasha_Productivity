'use client'

import { useMemo, useEffect } from 'react'
import { Award, Sparkles, Trophy, Plus } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useTaskStore } from '@/stores/taskStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { computeAchievementsProgress } from '@/lib/achievements'
import { AchievementBadgeGrid } from '@/components/gamification/AchievementBadge'
import { BaseCard } from '@/components/ui/BaseCard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { EmptyState } from '@/components/ui/EmptyState'

export function HabitAchievements() {
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const isLoading = useHabitStore((s) => s.isLoading)
  const error = useHabitStore((s) => s.error)
  const getTotalFocusSeconds = useTimeEntryStore((s) => s.getTotalFocusSecondsToday)
  const tasks = useTaskStore((s) => s.tasks)
  const unlockedAchievements = useGamificationStore((s) => s.unlockedAchievements)

  const totalFocusHours = Math.round((getTotalFocusSeconds() / 3600) * 10) / 10
  const totalTasksDone = tasks.filter((t) => t.status === 'done').length

  const { currentStreak, totalCheckInDays } = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const creationDates = habits.map((h) => h.createdAt.split('T')[0]).sort()
    const globalStartBoundary = creationDates.length > 0 ? creationDates[0] : todayStr

    const uniqueDates = new Set<string>()
    Object.entries(records).forEach(([key, done]) => {
      if (done) {
        const datePart = key.split('_')[1]
        if (datePart) uniqueDates.add(datePart)
      }
    })

    let streak = 0
    let checkDate = new Date(today)
    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
    if (!anyDoneToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (dateStr < globalStartBoundary) break
      const hasCompleted = habits.some((h) => {
        const startDate = h.createdAt.split('T')[0]
        return dateStr >= startDate && !!records[`${h.id}_${dateStr}`]
      })
      if (hasCompleted) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return { currentStreak: streak, totalCheckInDays: uniqueDates.size }
  }, [habits, records])

  const achievementProgresses = useMemo(() => {
    return computeAchievementsProgress(currentStreak, totalCheckInDays, totalFocusHours, totalTasksDone, habits.length)
  }, [currentStreak, totalCheckInDays, totalFocusHours, totalTasksDone, habits.length])

  const unlockedCount = achievementProgresses.filter((a) => a.unlocked).length

  const grouped = useMemo(() => {
    const groups: Record<string, typeof achievementProgresses> = {}
    achievementProgresses.forEach((item) => {
      const cat = item.achievement.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [achievementProgresses])

  // Check achievements for unlock
  const checkUnlocks = useGamificationStore((s) => s.checkAndAwardAchievement)
  useEffect(() => {
    achievementProgresses.forEach(({ achievement, unlocked }) => {
      if (unlocked && !unlockedAchievements.includes(achievement.id)) {
        checkUnlocks(achievement.id)
      }
    })
  }, [achievementProgresses, unlockedAchievements, checkUnlocks])

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs space-y-4">
        <LoadingSkeleton height={32} width="40%" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton height={100} />
          <LoadingSkeleton height={100} />
          <LoadingSkeleton height={100} />
          <LoadingSkeleton height={100} />
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorBanner title="Failed to load achievements" message={error} />
  }

  if (achievementProgresses.length === 0) {
    return (
      <BaseCard elevation="raised" innerClassName="p-6">
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Start tracking habits and focus time to earn your first badge."
          actionLabel="Create a habit"
          onAction={() => document.querySelector<HTMLButtonElement>('[aria-label="Add new habit"]')?.click()}
        />
      </BaseCard>
    )
  }

  return (
    <BaseCard elevation="raised" className="card-hover-lift" innerClassName="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-amber-muted)', color: 'var(--accent-amber)' }}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
              Achievements & Milestones
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Unlock badges by maintaining streaks, completing tasks, and reaching milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--accent-amber-muted)', color: 'var(--accent-amber)', borderColor: 'color-mix(in srgb, var(--accent-amber) 30%, transparent)' }}>
            <Sparkles className="w-3.5 h-3.5" />
            {unlockedCount} / {achievementProgresses.length} Unlocked
          </span>
        </div>
      </div>

      <AchievementBadgeGrid groupedAchievements={grouped as any} />
    </BaseCard>
  )
}
