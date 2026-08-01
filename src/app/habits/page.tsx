'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { QuickHabitActionsWidget } from '@/components/habits/QuickHabitActionsWidget'
import { HabitStatsCard } from '@/components/habits/HabitStatsCard'
import { HabitAnalyticsDashboard } from '@/components/habits/HabitAnalyticsDashboard'
import { HabitAchievements } from '@/components/habits/HabitAchievements'
import { HabitCalendar } from '@/components/habits/HabitCalendar'
import { HabitHeatmap } from '@/components/habits/HabitHeatmap'
import { AddHabitModal } from '@/components/habits/AddHabitModal'
import { HabitCategoryMetricsCard } from '@/components/habits/HabitCategoryMetricsCard'
import { useHabitStore, Habit } from '@/stores/habitStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export default function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const initializeGamification = useGamificationStore((s) => s.initializeGamification)

  const shouldReduceMotion = useReducedMotion()
  const isLoading = useHabitStore((s) => s.isLoading)

  useEffect(() => {
    initializeGamification()
  }, [initializeGamification])

  const handleOpenAddModal = () => {
    setEditingHabit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <LoadingSkeleton height={48} width="60%" className="mb-4" />
            <LoadingSkeleton height={16} width="40%" />
          </div>
          <LoadingSkeleton height={140} rounded="rounded-2xl" />
          <LoadingSkeleton height={140} rounded="rounded-2xl" />
          <LoadingSkeleton height={320} rounded="rounded-2xl" className="md:col-span-2" />
        </div>
      ) : (
        <>
          {/* Quick Habit Header Banner Actions */}
          <QuickHabitActionsWidget />

          {/* Top Section — Quick Summary Metrics */}
          <div className="bento-grid bento-grid-cols-12 items-stretch">
            <div className="bento-col-span-12">
              <HabitStatsCard />
            </div>
          </div>

          {/* Reorderable Analytics Dashboard */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HabitAnalyticsDashboard />
          </motion.div>

          {/* Habits Calendar Grid */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <HabitCalendar
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
            />
          </motion.div>

          {/* Habit Category Balance Metrics */}
          <div className="bento-grid bento-grid-cols-12 items-stretch">
            <div className="bento-col-span-12">
              <HabitCategoryMetricsCard />
            </div>
          </div>

          {/* Milestones & Achievements Grid */}
          <HabitAchievements />

          {/* 24-Week Consistency Heatmap */}
          <HabitHeatmap />

          {/* Add / Edit Habit Modal */}
          <AddHabitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            editingHabit={editingHabit}
          />
        </>
      )}
    </div>
  )
}
