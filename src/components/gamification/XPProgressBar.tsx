'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useGamificationStore, computeXPForLevel } from '@/stores/gamificationStore'
import { BaseCard } from '@/components/ui/BaseCard'
import { Sparkles, Trophy, Award, Crown, Medal, Flame, Zap } from 'lucide-react'

interface XPProgressBarProps {
  className?: string
}

function getCrestConfig(level: number) {
  if (level >= 75) {
    return { icon: Crown, tierName: 'Legend', mainColor: '#ef4444' }
  }
  if (level >= 50) {
    return { icon: Trophy, tierName: 'Master', mainColor: '#8b5cf6' }
  }
  if (level >= 40) {
    return { icon: Zap, tierName: 'Diamond', mainColor: '#06b6d4' }
  }
  if (level >= 30) {
    return { icon: Medal, tierName: 'Platinum', mainColor: '#38bdf8' }
  }
  if (level >= 20) {
    return { icon: Award, tierName: 'Gold', mainColor: '#eab308' }
  }
  if (level >= 10) {
    return { icon: Medal, tierName: 'Silver', mainColor: '#94a3b8' }
  }
  return { icon: Award, tierName: 'Bronze', mainColor: '#d97706' }
}

export function XPProgressBar({ className = '' }: XPProgressBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const xp = useGamificationStore((s) => s.xp)
  const level = useGamificationStore((s) => s.level)
  const isInitialized = useGamificationStore((s) => s.isInitialized)

  const current = xp - (level > 1 ? computeXPForLevel(level - 1) : 0)
  const next = computeXPForLevel(level) - (level > 1 ? computeXPForLevel(level - 1) : 0)
  const percentage = Math.min(100, Math.round((current / next) * 100))

  const crestConfig = getCrestConfig(level)
  const IconComponent = crestConfig.icon

  if (!isInitialized) {
    return (
      <BaseCard elevation="raised" className={className} isLoading skeletonLines={3} skeletonHeight={16}>
        <div />
      </BaseCard>
    )
  }

  return (
    <BaseCard
      elevation="raised"
      className={`rounded-[20px] h-full flex flex-col justify-between overflow-hidden relative ${className}`}
      innerClassName="p-4 flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[18px]"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full border-b border-[var(--border-subtle)] pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>Player Progress</span>
        </div>
        <span
          className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
          style={{
            color: crestConfig.mainColor,
            borderColor: `${crestConfig.mainColor}40`,
            backgroundColor: `${crestConfig.mainColor}12`,
          }}
        >
          {crestConfig.tierName}
        </span>
      </div>

      {/* Center Compact Level Badge & Text */}
      <div className="flex items-center gap-3 my-2 py-1">
        <div
          className="p-2.5 rounded-xl border flex items-center justify-center flex-shrink-0"
          style={{
            borderColor: `${crestConfig.mainColor}40`,
            backgroundColor: `${crestConfig.mainColor}10`,
          }}
        >
          <IconComponent className="w-6 h-6" style={{ color: crestConfig.mainColor }} />
        </div>

        <div>
          <h3 className="font-display text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
            Level {level}
          </h3>
          <div className="text-xs font-mono font-semibold text-[var(--text-secondary)] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{xp.toLocaleString()} Total XP</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full pt-2 border-t border-[var(--border-subtle)]">
        <div className="relative h-2 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden mb-1.5">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: crestConfig.mainColor }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)] font-medium">
          <span>
            {current.toLocaleString()} / {next.toLocaleString()} XP
          </span>
          <span className="font-bold" style={{ color: crestConfig.mainColor }}>
            {percentage}%
          </span>
        </div>
      </div>
    </BaseCard>
  )
}
