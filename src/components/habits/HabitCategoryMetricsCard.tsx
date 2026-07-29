'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, BookOpen, Briefcase, User, Sparkles, Layers } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { BaseCard } from '@/components/ui/BaseCard'

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  health: {
    label: 'Health & Vitality',
    color: 'var(--habit-health)',
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    icon: Heart,
  },
  learning: {
    label: 'Learning & Skill',
    color: 'var(--habit-learning)',
    bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    icon: BookOpen,
  },
  work: {
    label: 'Work & Projects',
    color: 'var(--habit-work)',
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    icon: Briefcase,
  },
  personal: {
    label: 'Personal & Mind',
    color: 'var(--habit-personal)',
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    icon: User,
  },
}

export function HabitCategoryMetricsCard({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  const todayStr = new Date().toISOString().split('T')[0]

  // Calculate metrics per category based on habit colors
  const categoryStats = useMemo(() => {
    const cats = [
      { key: 'health', colorHex: 'var(--habit-health)' },
      { key: 'learning', colorHex: 'var(--habit-learning)' },
      { key: 'work', colorHex: 'var(--habit-work)' },
      { key: 'personal', colorHex: 'var(--habit-personal)' },
    ]

    return cats.map(({ key, colorHex }) => {
      const config = CATEGORY_CONFIG[key]
      const catHabits = habits.filter((h) => {
        if (!h.color) return key === 'personal'
        return h.color.includes(key) || h.color === colorHex
      })
      const doneToday = catHabits.filter((h) => !!records[`${h.id}_${todayStr}`]).length
      const totalCount = catHabits.length
      const rate = totalCount > 0 ? Math.round((doneToday / totalCount) * 100) : 0

      return {
        key,
        ...config,
        totalCount,
        doneToday,
        rate,
      }
    })
  }, [habits, records, todayStr])

  const totalActiveHabits = habits.length

  return (
    <BaseCard
      elevation="raised"
      className={`card-hover-lift rounded-2xl h-full flex flex-col justify-between p-5 ${className}`}
      innerClassName="p-0 flex flex-col justify-between h-full"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">
                Category Balance
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Domain distribution & completion rate
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            {totalActiveHabits} Active
          </span>
        </div>

        {/* Category Meters */}
        <div className="space-y-3.5">
          {categoryStats.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-[var(--text-primary)]">
                    <div className={`p-1 rounded-md ${cat.bg} ${cat.border} border`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span>{cat.label}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)]">
                    {cat.doneToday}/{cat.totalCount} ({cat.rate}%)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.rate}%` }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Subtext */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Balanced habits yield higher XP
        </span>
        <span className="font-mono font-medium">Daily</span>
      </div>
    </BaseCard>
  )
}
