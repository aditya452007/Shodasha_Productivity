'use client'

import { useEffect } from 'react'
import { TodayProgressCard } from '@/components/dashboard/TodayProgressCard'
import { QuickTaskInput } from '@/components/dashboard/QuickTaskInput'
import { HabitQuickToggle } from '@/components/dashboard/HabitQuickToggle'
import { TimeDistributionChart } from '@/components/dashboard/TimeDistributionChart'
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed'
import { InsightCard } from '@/components/dashboard/InsightCard'
import { useNotificationStore } from '@/stores/notificationStore'

export default function DashboardPage() {
  const checkAndTriggerNotifications = useNotificationStore((state) => state.checkAndTriggerNotifications)

  useEffect(() => {
    // Run initial notification check and set background interval every 60 seconds
    checkAndTriggerNotifications()
    const interval = setInterval(() => {
      checkAndTriggerNotifications()
    }, 60000)
    return () => clearInterval(interval)
  }, [checkAndTriggerNotifications])

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Attention Section — Today's Progress Briefing */}
      <TodayProgressCard />

      {/* Insight Reflection Banner */}
      <InsightCard />

      {/* Quick Task Bar */}
      <div className="w-full">
        <QuickTaskInput />
      </div>

      {/* Interest & Desire — Gapless Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Habits Toggle */}
        <div className="lg:col-span-1">
          <HabitQuickToggle />
        </div>

        {/* Focus Time Analytics Chart */}
        <div className="lg:col-span-1">
          <TimeDistributionChart />
        </div>

        {/* Recent Activity Feed */}
        <div className="md:col-span-2 lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  )
}

