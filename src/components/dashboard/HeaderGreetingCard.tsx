'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { RotateCw, Sparkles } from 'lucide-react'
import { useTimeEntryStore } from '@/stores/timeEntryStore'

export function HeaderGreetingCard() {
  const refreshAllData = useTimeEntryStore((state) => state.refreshAllData)
  const isRefreshing = useTimeEntryStore((state) => state.isRefreshing)
  const shouldReduceMotion = useReducedMotion()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5"
    >
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] px-2.5 py-0.5 rounded-full border border-[var(--accent)]/20">
            {greeting}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-tertiary)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Daily Briefing
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
          {greeting}, Shodasha User
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Let's make today productive! Track your focus, habits, and tasks seamlessly.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          onClick={() => refreshAllData()}
          disabled={isRefreshing}
          aria-label="Refresh live data"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] shadow-xs disabled:opacity-50"
          title="Refresh active tracking data"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[var(--accent)] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
        </button>
      </div>
    </motion.div>
  )
}
