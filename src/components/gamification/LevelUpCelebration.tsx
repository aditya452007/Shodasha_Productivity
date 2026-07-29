'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useGamificationStore, getTierName, getTierColor } from '@/stores/gamificationStore'
import { Trophy, X } from 'lucide-react'

export function LevelUpCelebration() {
  const shouldReduceMotion = useReducedMotion()
  const level = useGamificationStore((s) => s.level)
  const lastLevelUpNotified = useGamificationStore((s) => s.lastLevelUpNotified)
  const [isVisible, setIsVisible] = useState(false)
  const [displayLevel, setDisplayLevel] = useState(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasNewLevel = level > lastLevelUpNotified

  const dismiss = useCallback(() => {
    setIsVisible(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    if (hasNewLevel && level > 1) {
      setDisplayLevel(level)
      setIsVisible(true)
      timerRef.current = setTimeout(dismiss, 3000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [hasNewLevel, level, dismiss])

  const tierName = getTierName(displayLevel)
  const tierColor = getTierColor(displayLevel)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="levelup-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={dismiss}
        >
          <motion.div
            className="relative flex flex-col items-center gap-3 p-8 rounded-3xl"
            style={{ backgroundColor: 'var(--bg-surface)' }}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: [1, 1.1, 1] }
            }
            exit={{ opacity: 0, scale: 0.95 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.3 }
                : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <motion.div
              className="p-4 rounded-full"
              style={{ backgroundColor: `${tierColor}20` }}
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Trophy className="w-10 h-10" style={{ color: tierColor }} />
            </motion.div>

            <div className="text-center">
              <motion.p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: tierColor }}
                initial={shouldReduceMotion ? { opacity: 0 } : { y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Level Up!
              </motion.p>
              <motion.h2
                className="text-4xl font-bold font-display mt-1"
                style={{ color: 'var(--text-primary)' }}
                initial={shouldReduceMotion ? { opacity: 0 } : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                Level {displayLevel}
              </motion.h2>
              <motion.p
                className="text-sm font-semibold mt-1"
                style={{ color: tierColor }}
                initial={shouldReduceMotion ? { opacity: 0 } : { y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {tierName} Tier
              </motion.p>
            </div>

            {/* Particles */}
            {!shouldReduceMotion && (
              <>
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (Math.PI * 2 * i) / 12
                  const distance = 60 + Math.random() * 40
                  return (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: tierColor }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )
                })}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
