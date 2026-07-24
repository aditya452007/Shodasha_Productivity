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
import { useNotificationStore } from '@/stores/notificationStore'

export default function DashboardPage() {
  const checkAndTriggerNotifications = useNotificationStore((state) => state.checkAndTriggerNotifications)

  useEffect(() => {
    // Initial notification check & 60s background tick
    checkAndTriggerNotifications()
    const interval = setInterval(() => {
      checkAndTriggerNotifications()
    }, 60000)
    return () => clearInterval(interval)
  }, [checkAndTriggerNotifications])

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* 1. Top Greeting Header Bar */}
      <HeaderGreetingCard />

      {/* 2. Top Metric Cards Row (4 Columns Grid) */}
      <TopKPIGrid />

      {/* 3. Middle Tier — 60/40 Split Grid (Today's Schedule + Time Distribution Donut Ring) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <ScheduleActivityCard />
        </div>
        <div className="lg:col-span-5">
          <LearningProgressCard />
        </div>
      </div>

      {/* 4. Quick Task Entry Bar */}
      <div className="w-full">
        <QuickTaskInput />
      </div>

      {/* 5. Bottom Tier — 3-Column Split Grid (Daily Goals + Current Streak Hero + Performance Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <GoalsHabitsCard />
        </div>
        <div className="lg:col-span-3">
          <StreakHeroCard />
        </div>
        <div className="md:col-span-2 lg:col-span-5">
          <PerformanceOverviewChart />
        </div>
      </div>

      {/* 6. Insight Reflection Card */}
      <InsightCard />
    </div>
  )
}
