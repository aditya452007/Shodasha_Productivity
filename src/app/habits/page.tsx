'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Flame } from 'lucide-react'
import { HabitStatsCard } from '@/components/habits/HabitStatsCard'
import { HabitAnalyticsDashboard } from '@/components/habits/HabitAnalyticsDashboard'
import { HabitAchievements } from '@/components/habits/HabitAchievements'
import { HabitCalendar } from '@/components/habits/HabitCalendar'
import { HabitHeatmap } from '@/components/habits/HabitHeatmap'
import { AddHabitModal } from '@/components/habits/AddHabitModal'
import { Habit } from '@/stores/habitStore'

export default function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

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
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5"
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Habits Dashboard & Performance
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-[var(--accent)] border border-emerald-500/20">
              <Flame className="w-3.5 h-3.5" /> Daily Consistency
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track daily streaks, reorder analytics widgets, log habit check-ins, and unlock milestone achievements.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-all shadow-xs self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Habit
        </button>
      </motion.div>

      {/* 1. Top Section — Quick Summary Metrics Cards */}
      <HabitStatsCard />

      {/* 2. Reorderable Analytics Dashboard (Line Chart, Completion Rings, Weekday Bar Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <HabitAnalyticsDashboard />
      </motion.div>

      {/* 3. Habits Tracker — Monthly Calendar Matrix Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <HabitCalendar
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
        />
      </motion.div>

      {/* 4. Milestone Achievements System & Unlocks Log */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
      >
        <HabitAchievements />
      </motion.div>

      {/* 5. 24-Week Consistency Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
      >
        <HabitHeatmap />
      </motion.div>

      {/* Add / Edit Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingHabit={editingHabit}
      />
    </div>
  )
}
