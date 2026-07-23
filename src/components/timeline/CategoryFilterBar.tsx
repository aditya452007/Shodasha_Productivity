'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, X, Zap } from 'lucide-react'
import {
  useTimeEntryStore,
  TimeframeFilter,
  CategoryFilter,
} from '@/stores/timeEntryStore'

const timeframeOptions: { value: TimeframeFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Past 7 Days' },
  { value: 'all', label: 'All Time' },
]

const categoryOptions: { value: CategoryFilter; label: string; dotColor: string }[] = [
  { value: 'all', label: 'All', dotColor: 'bg-stone-400 dark:bg-stone-500' },
  { value: 'work', label: 'Deep Work', dotColor: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
  { value: 'neutral', label: 'Tools', dotColor: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' },
  { value: 'distraction', label: 'Distraction', dotColor: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' },
]

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function CategoryFilterBar() {
  const {
    selectedTimeframe,
    selectedCategory,
    searchQuery,
    setTimeframe,
    setSelectedCategory,
    setSearchQuery,
    getFilteredFocusSeconds,
  } = useTimeEntryStore()

  const totalSeconds = getFilteredFocusSeconds()

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 shadow-xs">
      <div className="backdrop-blur-xl bg-[var(--bg-surface)]/85 border border-[var(--border)] rounded-[calc(2.25rem-0.5rem)] p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
        {/* Left: Timeframe & Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Segmented Control with Motion Pill */}
          <div className="relative inline-flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
            {timeframeOptions.map((opt) => {
              const active = selectedTimeframe === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setTimeframe(opt.value)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-[0.97] ${
                    active
                      ? 'text-[var(--text-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTimeframePill"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      className="absolute inset-0 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              )
            })}
          </div>

          <div className="h-6 w-px bg-[var(--border)] hidden sm:block" />

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryOptions.map((cat) => {
              const active = selectedCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-medium transition-all active:scale-[0.97] border ${
                    active
                      ? 'bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)] font-semibold shadow-xs'
                      : 'bg-[var(--bg-surface-hover)] border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className={`size-2 rounded-full ${cat.dotColor}`} />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Search & Total Stats */}
        <div className="flex items-center gap-3">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by app or window..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl bg-[var(--bg-surface-hover)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded-full hover:bg-[var(--bg-surface)] transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Active Focus Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--accent-muted)] border border-[var(--accent)]/30 text-[var(--accent)] font-mono text-xs font-bold whitespace-nowrap shadow-xs">
            <Zap className="size-3.5 fill-[var(--accent)] text-[var(--accent)]" />
            <span>{formatDuration(totalSeconds)} Focus</span>
          </div>
        </div>
      </div>
    </div>
  )
}
