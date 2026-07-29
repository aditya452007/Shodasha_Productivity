'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus, Flame } from 'lucide-react'
import { HabitStatsCard } from '@/components/habits/HabitStatsCard'
import { HabitAnalyticsDashboard } from '@/components/habits/HabitAnalyticsDashboard'
import { HabitAchievements } from '@/components/habits/HabitAchievements'
import { HabitCalendar } from '@/components/habits/HabitCalendar'
import { HabitHeatmap } from '@/components/habits/HabitHeatmap'
import { AddHabitModal } from '@/components/habits/AddHabitModal'
import { HabitCategoryMetricsCard } from '@/components/habits/HabitCategoryMetricsCard'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'
import { SkillOctagon } from '@/components/gamification/SkillOctagon'
import { XPProgressBar } from '@/components/gamification/XPProgressBar'
import { LevelUpCelebration } from '@/components/gamification/LevelUpCelebration'
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
    <div className="space-y-6 pb-12">
      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <LoadingSkeleton height={48} width="60%" className="mb-4" />
            <LoadingSkeleton height={16} width="40%" />
          </div>
          <LoadingSkeleton height={140} rounded="rounded-2xl" />
          <LoadingSkeleton height={140} rounded="rounded-2xl" />
          <LoadingSkeleton height={100} rounded="rounded-2xl" />
          <LoadingSkeleton height={100} rounded="rounded-2xl" />
          <LoadingSkeleton height={320} rounded="rounded-2xl" className="md:col-span-2" />
          <LoadingSkeleton height={260} rounded="rounded-2xl" className="md:col-span-2" />
          <LoadingSkeleton height={200} rounded="rounded-2xl" className="md:col-span-2" />
          <LoadingSkeleton height={180} rounded="rounded-2xl" className="md:col-span-2" />
        </div>
      ) : (
        <>
      {/* Top Header */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Habits Dashboard & Performance
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--accent-amber-muted)', color: 'var(--accent-amber)', borderColor: 'color-mix(in srgb, var(--accent-amber) 30%, transparent)' }}>
              <Flame className="w-3.5 h-3.5" /> Daily Consistency
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track daily streaks, reorder analytics widgets, log habit check-ins, and unlock milestone achievements.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          aria-label="Add new habit"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 shadow-xs self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Habit
        </button>
      </motion.div>

      {/* 1. Top Section — Quick Summary Metrics Cards + Streak + SkillOctagon */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-8">
          <HabitStatsCard />
        </div>
        <div className="bento-col-span-4">
          <StreakDisplay />
        </div>
      </div>

      {/* 2. Reorderable Analytics Dashboard (Line Chart, Completion Rings, Weekday Bar Chart) */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.05 }}
      >
        <HabitAnalyticsDashboard />
      </motion.div>

      {/* 3. Habits Tracker — Monthly Calendar Matrix Grid */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.1 }}
      >
        <HabitCalendar
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
        />
      </motion.div>

      {/* 4. Skill Octagon (Square Card) + Category Balance Metrics + Level XP Progression */}
      <div className="bento-grid bento-grid-cols-12 items-stretch">
        <div className="bento-col-span-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-xs flex flex-col items-center justify-between aspect-square h-full card-hover-lift">
            <div className="flex items-center justify-between w-full mb-2">
              <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">Skill Radar</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">8 Axes</span>
            </div>
            <div className="flex items-center justify-center flex-1 w-full">
              <SkillOctagon size={240} />
            </div>
          </div>
        </div>

        <div className="bento-col-span-4">
          <HabitCategoryMetricsCard />
        </div>

        <div className="bento-col-span-4">
          <XPProgressBar className="h-full" />
        </div>
      </div>

      {/* 5. Milestones & Achievement Badges Grid */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.15 }}
      >
        <HabitAchievements />
      </motion.div>

      {/* 5. 24-Week Consistency Heatmap */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : 0.2 }}
      >
        <HabitHeatmap />
      </motion.div>

      {/* Add / Edit Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingHabit={editingHabit}
      />

      <LevelUpCelebration />
        </>
      )}
    </div>
  )
}
