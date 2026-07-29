'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, AlertTriangle, X } from 'lucide-react'
import { useGamificationStore, getTierName, getTierColor } from '@/stores/gamificationStore'
import { XPProgressBar } from './XPProgressBar'
import { SkillOctagon } from './SkillOctagon'

export function GamificationSettings() {
  const xp = useGamificationStore((s) => s.xp)
  const level = useGamificationStore((s) => s.level)
  const unlockedAchievements = useGamificationStore((s) => s.unlockedAchievements)
  const resetGamification = useGamificationStore((s) => s.resetGamification)
  const [showConfirm, setShowConfirm] = useState(false)

  const tierName = getTierName(level)
  const tierColor = getTierColor(level)

  const handleReset = () => {
    resetGamification()
    setShowConfirm(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${tierColor}20`, color: tierColor }}>
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold font-display text-[var(--text-primary)]">
            Gamification & XP
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Your XP, level, and progress overview
          </p>
        </div>
      </div>

      {/* Level card */}
      <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-full" style={{ backgroundColor: `${tierColor}15` }}>
            <Trophy className="w-6 h-6" style={{ color: tierColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-display text-[var(--text-primary)]">
                Level {level}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ color: tierColor, borderColor: `${tierColor}40`, backgroundColor: `${tierColor}15` }}
              >
                {tierName}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{xp.toLocaleString()} total XP</p>
          </div>
        </div>
        <XPProgressBar />
      </div>

      {/* Skill Octagon preview */}
      <div className="rounded-xl border border-[var(--border-subtle)] p-4 flex justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <SkillOctagon size={200} />
      </div>

      {/* Achievements summary */}
      <div className="rounded-xl border border-[var(--border-subtle)] p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <h4 className="text-sm font-bold font-display text-[var(--text-primary)] mb-2">
          Achievements Unlocked
        </h4>
        <p className="text-xs text-[var(--text-secondary)]">
          {unlockedAchievements.length} achievement{unlockedAchievements.length !== 1 ? 's' : ''} unlocked
        </p>
        {unlockedAchievements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {unlockedAchievements.map((id) => (
              <span
                key={id}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--accent-muted)',
                  color: 'var(--accent)',
                  borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
                }}
              >
                {id}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="rounded-xl border border-[var(--error)]/20 p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 5%, transparent)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--error)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Reset Gamification</span>
          </div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--error)]/30 text-[var(--error)] hover:bg-[var(--error)]/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--error)] text-white hover:opacity-90"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] mt-2">
          This will reset your XP to 0, level to 1, and clear all unlocked achievements. This action cannot be undone.
        </p>
      </div>
    </div>
  )
}
