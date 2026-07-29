'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useGamificationStore, getTierName, getTierColor, computeXPForLevel } from '@/stores/gamificationStore'
import { BaseCard } from '@/components/ui/BaseCard'
import { Sparkles, Trophy, Award, Crown, Medal, Flame, Zap } from 'lucide-react'

interface XPProgressBarProps {
  className?: string
}

function NumberTicker({ value, duration = 400 }: { value: number; duration?: number }) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) {
    return <span>{value.toLocaleString()}</span>
  }

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration / 1000, ease: [0.23, 1, 0.32, 1] }}
    >
      {value.toLocaleString()}
    </motion.span>
  )
}

function getImmersiveCrestConfig(level: number) {
  if (level >= 75) {
    return {
      icon: Crown,
      tierName: 'Legend',
      mainColor: '#ef4444', // Ember Red
      gradFrom: 'from-red-500/25',
      gradTo: 'to-amber-500/25',
      borderColor: 'border-red-500/40',
      textColor: 'text-red-500',
    }
  }
  if (level >= 50) {
    return {
      icon: Trophy,
      tierName: 'Master',
      mainColor: '#8b5cf6', // Deep Violet
      gradFrom: 'from-violet-500/25',
      gradTo: 'to-indigo-500/25',
      borderColor: 'border-violet-500/40',
      textColor: 'text-violet-500',
    }
  }
  if (level >= 40) {
    return {
      icon: Zap,
      tierName: 'Diamond',
      mainColor: '#06b6d4', // Ice Cyan
      gradFrom: 'from-cyan-500/25',
      gradTo: 'to-blue-500/25',
      borderColor: 'border-cyan-500/40',
      textColor: 'text-cyan-500',
    }
  }
  if (level >= 30) {
    return {
      icon: Medal,
      tierName: 'Platinum',
      mainColor: '#38bdf8', // Platinum Sky
      gradFrom: 'from-sky-500/25',
      gradTo: 'to-slate-400/25',
      borderColor: 'border-sky-500/40',
      textColor: 'text-sky-500',
    }
  }
  if (level >= 20) {
    return {
      icon: Award,
      tierName: 'Gold',
      mainColor: '#eab308', // Gold
      gradFrom: 'from-amber-400/25',
      gradTo: 'to-yellow-600/25',
      borderColor: 'border-amber-400/40',
      textColor: 'text-amber-500',
    }
  }
  if (level >= 10) {
    return {
      icon: Medal,
      tierName: 'Silver',
      mainColor: '#94a3b8', // Silver
      gradFrom: 'from-slate-400/25',
      gradTo: 'to-slate-600/25',
      borderColor: 'border-slate-400/40',
      textColor: 'text-slate-400',
    }
  }
  return {
    icon: Award,
    tierName: 'Bronze',
    mainColor: '#d97706', // Bronze Warm Amber
    gradFrom: 'from-amber-600/25',
    gradTo: 'to-orange-700/25',
    borderColor: 'border-amber-600/40',
    textColor: 'text-amber-600 dark:text-amber-400',
  }
}

export function XPProgressBar({ className = '' }: XPProgressBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const xp = useGamificationStore((s) => s.xp)
  const level = useGamificationStore((s) => s.level)
  const isInitialized = useGamificationStore((s) => s.isInitialized)

  const current = xp - (level > 1 ? computeXPForLevel(level - 1) : 0)
  const next = computeXPForLevel(level) - (level > 1 ? computeXPForLevel(level - 1) : 0)
  const percentage = Math.min(100, Math.round((current / next) * 100))

  const crestConfig = getImmersiveCrestConfig(level)
  const IconComponent = crestConfig.icon

  if (!isInitialized) {
    return (
      <BaseCard elevation="raised" className={className} isLoading skeletonLines={4} skeletonHeight={16}>
        <div />
      </BaseCard>
    )
  }

  return (
    <BaseCard
      elevation="raised"
      className={`card-color-violet rounded-2xl h-full flex flex-col justify-between overflow-hidden relative p-6 ${className}`}
      innerClassName="p-0 flex flex-col justify-between h-full"
    >
      {/* Background Ambient Glow Halo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 animate-pulse-glow"
        style={{ backgroundColor: crestConfig.mainColor }}
      />

      {/* Top Bar Header */}
      <div className="flex items-center justify-between w-full z-10 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>Player Level & Status</span>
        </div>
        <span
          className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border shadow-2xs"
          style={{
            color: crestConfig.mainColor,
            borderColor: `${crestConfig.mainColor}50`,
            backgroundColor: `${crestConfig.mainColor}18`,
          }}
        >
          {crestConfig.tierName} Badge
        </span>
      </div>

      {/* Center Immersive Medal Crest & Level Number */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-2 z-10">
        {/* Animated Levitating Medal Badge with Rotating Glow Ring */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-4, 4, -4] }}
          whileHover={shouldReduceMotion ? {} : { rotateY: 360, scale: 1.12 }}
          transition={{
            y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
            rotateY: { duration: 0.85, ease: 'easeInOut' },
            scale: { duration: 0.2 },
          }}
          className={`relative p-5 rounded-3xl border ${crestConfig.borderColor} bg-gradient-to-br ${crestConfig.gradFrom} ${crestConfig.gradTo} backdrop-blur-md shadow-lg cursor-pointer group mb-3`}
          title={`${crestConfig.tierName} Medal Badge — Hover to spin!`}
        >
          {/* Outer Pulsing Star Ring */}
          <div
            className="absolute inset-0 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity blur-md"
            style={{ backgroundColor: crestConfig.mainColor }}
          />

          <IconComponent className="w-10 h-10 stroke-[2.2] relative z-10 drop-shadow-md" style={{ color: crestConfig.mainColor }} />
        </motion.div>

        {/* Centered Level & XP Display */}
        <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
          LEVEL {level}
        </h3>
        <div className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 mt-0.5 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span><NumberTicker value={xp} /> Total XP</span>
        </div>
      </div>

      {/* Bottom XP Progress Bar & Metrics */}
      <div className="w-full z-10 pt-2 border-t border-[var(--border-subtle)]">
        <div className="relative h-3 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden shadow-inner mb-2">
          <motion.div
            className="h-full rounded-full shadow-sm"
            style={{ backgroundColor: crestConfig.mainColor }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)] font-medium">
          <span>
            <NumberTicker value={current} /> / <NumberTicker value={next} /> XP
          </span>
          <span className="font-bold" style={{ color: crestConfig.mainColor }}>
            {percentage}% to Level {level + 1}
          </span>
        </div>
      </div>
    </BaseCard>
  )
}



