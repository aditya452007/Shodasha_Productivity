'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useGamificationStore, getTierName, getTierColor, computeXPForLevel } from '@/stores/gamificationStore'
import { BaseCard } from '@/components/ui/BaseCard'

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

export function XPProgressBar({ className = '' }: XPProgressBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const xp = useGamificationStore((s) => s.xp)
  const level = useGamificationStore((s) => s.level)
  const isInitialized = useGamificationStore((s) => s.isInitialized)

  const current = xp - (level > 1 ? computeXPForLevel(level - 1) : 0)
  const next = computeXPForLevel(level) - (level > 1 ? computeXPForLevel(level - 1) : 0)
  const percentage = Math.min(100, Math.round((current / next) * 100))

  const tierName = getTierName(level)
  const tierColor = getTierColor(level)

  if (!isInitialized) {
    return (
      <BaseCard elevation="raised" className={className} isLoading skeletonLines={2} skeletonHeight={16}>
        <div />
      </BaseCard>
    )
  }

  return (
    <BaseCard elevation="raised" innerClassName="p-4" className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-display text-[var(--text-primary)]">
            Level {level}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              color: tierColor,
              borderColor: `${tierColor}40`,
              backgroundColor: `${tierColor}15`,
            }}
          >
            {tierName}
          </span>
        </div>
        <div className="text-[11px] font-mono font-semibold text-[var(--text-secondary)]">
          <NumberTicker value={xp} /> XP
        </div>
      </div>

      <div className="relative h-2 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: tierColor }}
          initial={false}
          animate={{ width: shouldReduceMotion ? `${percentage}%` : `${percentage}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
          <NumberTicker value={current} /> / <NumberTicker value={next} />
        </span>
        <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
          {percentage}%
        </span>
      </div>
    </BaseCard>
  )
}
