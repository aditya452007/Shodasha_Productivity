'use client'

import { useEffect } from 'react'
import { HeaderGreetingCard } from '@/components/dashboard/HeaderGreetingCard'
import { TopKPIGrid } from '@/components/dashboard/TopKPIGrid'
import { WeatherIntegrationWidget } from '@/components/dashboard/WeatherIntegrationWidget'
import { TodaysTodosChecklistWidget } from '@/components/dashboard/TodaysTodosChecklistWidget'
import { QuietTimeTimerWidget } from '@/components/dashboard/QuietTimeTimerWidget'
import { LearningProgressCard } from '@/components/dashboard/LearningProgressCard'
import { GoalsHabitsCard } from '@/components/dashboard/GoalsHabitsCard'
import { StreakHeroCard } from '@/components/dashboard/StreakHeroCard'
import { PerformanceOverviewChart } from '@/components/dashboard/PerformanceOverviewChart'
import { QuickTaskInput } from '@/components/dashboard/QuickTaskInput'
import { XPProgressBar } from '@/components/gamification/XPProgressBar'
import { DailyXPGoal } from '@/components/gamification/DailyXPGoal'
import { useGamificationStore } from '@/stores/gamificationStore'

export default function DashboardPage() {
  const initializeGamification = useGamificationStore((s) => s.initializeGamification)

  useEffect(() => {
    initializeGamification()
  }, [initializeGamification])

  return (
    <div className="flex flex-col gap-6 w-full pb-16 max-w-7xl mx-auto">
      {/* 1. Top Greeting Header Bar */}
      <HeaderGreetingCard />

      {/* 2. Top Metric Cards Row (4 Columns Grid) */}
      <TopKPIGrid />

      {/* Gamification Tier — XP Bar + Daily Goal */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-7">
          <XPProgressBar />
        </div>
        <div className="bento-col-span-5">
          <DailyXPGoal />
        </div>
      </div>

      {/* 3. Quick Task Entry Bar */}
      <div className="w-full">
        <QuickTaskInput />
      </div>

      {/* 4. Hero Integrations & Schedule Tier (4-5-3 Grid Split) */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-4">
          <WeatherIntegrationWidget />
        </div>
        <div className="bento-col-span-5">
          <TodaysTodosChecklistWidget />
        </div>
        <div className="bento-col-span-3">
          <QuietTimeTimerWidget />
        </div>
      </div>

      {/* 5. Focus Score & Daily Habits Tier (7-5 Split Grid) */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-7">
          <LearningProgressCard />
        </div>
        <div className="bento-col-span-5">
          <GoalsHabitsCard />
        </div>
      </div>

      {/* 6. Performance & Streak Tier (4-8 Split Grid) */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-4">
          <StreakHeroCard />
        </div>
        <div className="bento-col-span-8">
          <PerformanceOverviewChart />
        </div>
      </div>
    </div>
  )
}
