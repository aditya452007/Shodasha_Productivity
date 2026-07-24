'use client'

import { TodayProgressCard } from '@/components/dashboard/TodayProgressCard'
import { QuickTaskInput } from '@/components/dashboard/QuickTaskInput'
import { HabitQuickToggle } from '@/components/dashboard/HabitQuickToggle'
import { TimeDistributionChart } from '@/components/dashboard/TimeDistributionChart'
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed'
import { InsightCard } from '@/components/dashboard/InsightCard'

export default function DashboardPage() {
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
