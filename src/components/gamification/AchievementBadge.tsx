'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Lock, CheckCircle2, Sprout, Zap, Brain, Star, Gem, Flame, Trophy, Award,
} from 'lucide-react'
import { type Achievement } from '@/lib/achievements'

const CATEGORY_COLORS: Record<string, string> = {
  streaks: 'var(--accent-amber)',
  focus: 'var(--accent-blue)',
  tasks: 'var(--accent-emerald)',
  habits: 'var(--accent-violet)',
  milestones: 'var(--accent-teal)',
}

const CATEGORY_LABELS: Record<string, string> = {
  streaks: 'Streaks',
  focus: 'Focus',
  tasks: 'Tasks',
  habits: 'Habits',
  milestones: 'Milestones',
}

function renderIcon(iconName: Achievement['iconName'], color: string, isLocked: boolean) {
  const props = { className: 'w-5 h-5', style: { color: isLocked ? 'var(--text-tertiary)' : color } }
  switch (iconName) {
    case 'sprout': return <Sprout {...props} />
    case 'zap': return <Zap {...props} />
    case 'brain': return <Brain {...props} />
    case 'star': return <Star {...props} />
    case 'gem': return <Gem {...props} />
    case 'flame': return <Flame {...props} />
    case 'trophy': return <Trophy {...props} />
    default: return <Award {...props} />
  }
}

interface AchievementBadgeProps {
  achievement: Achievement
  currentProgress: number
  unlocked: boolean
  progressPercentage: number
  isNew?: boolean
}

export function AchievementBadge({
  achievement,
  currentProgress,
  unlocked,
  progressPercentage,
  isNew = false,
}: AchievementBadgeProps) {
  const shouldReduceMotion = useReducedMotion()
  const [showNewBadge, setShowNewBadge] = useState(isNew)
  const catColor = CATEGORY_COLORS[achievement.category] || 'var(--accent)'

  useEffect(() => {
    if (isNew && !shouldReduceMotion) {
      const timer = setTimeout(() => setShowNewBadge(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isNew, shouldReduceMotion])

  return (
    <motion.div
      layout
      initial={
        isNew && !shouldReduceMotion
          ? { opacity: 0, scale: 0.95 }
          : { opacity: 1, scale: 1 }
      }
      animate={
        isNew && !shouldReduceMotion
          ? { opacity: 1, scale: [1, 1.05, 1] }
          : { opacity: 1, scale: 1 }
      }
      transition={
        isNew && !shouldReduceMotion
          ? { type: 'spring', stiffness: 300, damping: 20 }
          : { duration: 0.3 }
      }
      className={`relative rounded-xl border p-4 transition-lift ${
        unlocked
          ? 'shadow-xs'
          : 'border-dashed border-[var(--border-subtle)] opacity-60'
      }`}
      style={{
        borderColor: unlocked
          ? `color-mix(in srgb, ${catColor} 30%, transparent)`
          : undefined,
        background: unlocked
          ? `linear-gradient(135deg, color-mix(in srgb, ${catColor} 5%, transparent), transparent)`
          : undefined,
      }}
    >
      {/* NEW badge */}
      {showNewBadge && !shouldReduceMotion && (
        <motion.div
          className="absolute -top-1 -right-1 z-10 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
          style={{
            background: 'linear-gradient(135deg, var(--accent-amber), var(--accent-orange))',
            color: 'white',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          NEW
        </motion.div>
      )}

      {/* Unlocked shimmer sweep */}
      {unlocked && !shouldReduceMotion && (
        <div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer-sweep 0.8s ease-out forwards',
          }}
        />
      )}

      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div
          className="p-2 rounded-lg border shadow-xs"
          style={{
            backgroundColor: `color-mix(in srgb, ${catColor} 10%, transparent)`,
            borderColor: `color-mix(in srgb, ${catColor} 20%, transparent)`,
          }}
        >
          {renderIcon(achievement.iconName, catColor, !unlocked)}
        </div>
        <span
          className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border"
          style={{
            color: unlocked ? catColor : 'var(--text-tertiary)',
            borderColor: unlocked ? `color-mix(in srgb, ${catColor} 30%, transparent)` : 'var(--border-subtle)',
            backgroundColor: unlocked ? `color-mix(in srgb, ${catColor} 10%, transparent)` : undefined,
          }}
        >
          {achievement.tier}
        </span>
      </div>

      <h4 className="text-sm font-bold font-display text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
        {achievement.title}
        {unlocked ? (
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: catColor }} />
        ) : (
          <Lock className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" />
        )}
      </h4>
      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 min-h-[32px]">
        {achievement.description}
      </p>

      <div>
        <div className="flex justify-between text-[10px] font-semibold text-[var(--text-tertiary)] mb-1">
          <span>{currentProgress} / {achievement.targetCount}</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            style={{ backgroundColor: unlocked ? catColor : 'var(--accent-indigo)' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function AchievementBadgeGrid({
  groupedAchievements,
}: {
  groupedAchievements: Record<string, { achievement: Achievement; currentProgress: number; unlocked: boolean; progressPercentage: number }[]>
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([category, items]) => {
        const catColor = CATEGORY_COLORS[category] || 'var(--accent)'
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border-subtle)]">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: catColor }} />
              <h4 className="text-sm font-bold font-display text-[var(--text-primary)]">
                {CATEGORY_LABELS[category] || category}
              </h4>
              <span className="text-[10px] text-[var(--text-tertiary)] font-medium">
                {items.filter((i) => i.unlocked).length}/{items.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map(({ achievement, currentProgress, unlocked, progressPercentage }) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  currentProgress={currentProgress}
                  unlocked={unlocked}
                  progressPercentage={progressPercentage}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
