'use client'

import { useEffect } from 'react'
import { HeaderGreetingCard } from '@/components/dashboard/HeaderGreetingCard'
import { TopKPIGrid } from '@/components/dashboard/TopKPIGrid'
import { ScheduleActivityCard } from '@/components/dashboard/ScheduleActivityCard'
import { LearningProgressCard } from '@/components/dashboard/LearningProgressCard'
import { GoalsHabitsCard } from '@/components/dashboard/GoalsHabitsCard'
import { StreakHeroCard } from '@/components/dashboard/StreakHeroCard'
import { PerformanceOverviewChart } from '@/components/dashboard/PerformanceOverviewChart'
import { QuickTaskInput } from '@/components/dashboard/QuickTaskInput'
import { InsightCard } from '@/components/dashboard/InsightCard'
import { XPProgressBar } from '@/components/gamification/XPProgressBar'
import { LevelUpCelebration } from '@/components/gamification/LevelUpCelebration'
import { DailyXPGoal } from '@/components/gamification/DailyXPGoal'
import { SkillOctagon } from '@/components/gamification/SkillOctagon'
import { useGamificationStore } from '@/stores/gamificationStore'

export default function DashboardPage() {
  const initializeGamification = useGamificationStore((s) => s.initializeGamification)

  useEffect(() => {
    initializeGamification()
  }, [initializeGamification])

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* 1. Top Greeting Header Bar */}
      <HeaderGreetingCard />

      {/* 2. Top Metric Cards Row (4 Columns Grid) */}
      <TopKPIGrid />

      {/* Gamification Row — XP Bar + Daily Goal + Compact SkillOctagon */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-5">
          <XPProgressBar />
        </div>
        <div className="bento-col-span-3">
          <DailyXPGoal />
        </div>
        <div className="bento-col-span-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 shadow-xs flex items-center justify-center h-full">
            <SkillOctagon size={180} className="mx-auto" />
          </div>
        </div>
      </div>

      {/* 3. Middle Tier — 60/40 Split Grid (Today's Schedule + Time Distribution Donut Ring) */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-7">
          <ScheduleActivityCard />
        </div>
        <div className="bento-col-span-5">
          <LearningProgressCard />
        </div>
      </div>

      {/* 4. Quick Task Entry Bar */}
      <div className="w-full">
        <QuickTaskInput />
      </div>

      {/* 5. Bottom Tier — 3-Column Split Grid (Daily Goals + Current Streak Hero + Performance Overview) */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-4">
          <GoalsHabitsCard />
        </div>
        <div className="bento-col-span-3">
          <StreakHeroCard />
        </div>
        <div className="bento-col-span-5">
          <PerformanceOverviewChart />
        </div>
      </div>

      {/* 6. Insight Reflection Card */}
      <InsightCard />

      {/* Level-up celebration overlay */}
      <LevelUpCelebration />
    </div>
  )
}
