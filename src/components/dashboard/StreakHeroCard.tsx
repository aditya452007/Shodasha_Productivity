'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { BaseCard } from '@/components/ui/BaseCard'
import { LivingFlameIcon } from '@/components/gamification/LivingFlameIcon'
import { calculateGlobalStreak } from '@/lib/utils/streak'

export function StreakHeroCard() {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)

  const streak = useMemo(() => calculateGlobalStreak(habits, records), [habits, records])

  return (
    <BaseCard
      elevation="flat"
      className="relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white shadow-xl overflow-hidden h-full min-h-[240px] border border-amber-400/30 card-hover-lift"
      innerClassName="p-0"
    >
      {/* Radiant Background Blur Halos */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-400/25 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-red-600/30 blur-3xl pointer-events-none" />

      {/* Top Header Row with Levitating Badge */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100">
          <LivingFlameIcon size={20} intensity="blazing" />
          <span>Active Streak</span>
        </div>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-100 shadow-xs"
        >
          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>{streak > 3 ? 'On Fire!' : 'Multiplier Active'}</span>
        </motion.div>
      </div>

      {/* Center Living Flame & Big Counter */}
      <div className="flex flex-col items-center justify-center text-center my-3 z-10">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-3, 3, -3], scale: [1, 1.04, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="p-3 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-300/40 mb-2 shadow-inner"
        >
          <LivingFlameIcon size={44} intensity="blazing" />
        </motion.div>

        <div className="font-display text-5xl sm:text-6xl font-black tracking-tight drop-shadow-lg text-white">
          {streak > 0 ? streak : 0}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-200 mt-1">
          {streak === 1 ? 'Day Streak' : 'Days Streak'}
        </span>
      </div>

      {/* Footer Subtext */}
      <div className="text-center text-xs text-amber-100/90 font-medium z-10 border-t border-white/15 pt-3">
        {streak > 0 ? 'Consistent progress builds habits!' : 'Complete a habit today to start your fire!'}
      </div>
    </BaseCard>
  )
}

