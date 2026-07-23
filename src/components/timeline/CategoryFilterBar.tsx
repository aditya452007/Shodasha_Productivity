'use client'

import React from 'react'
import { Search, X, Clock, Zap } from 'lucide-react'
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
  { value: 'all', label: 'All', dotColor: 'bg-stone-400' },
  { value: 'work', label: 'Deep Work', dotColor: 'bg-emerald-500' },
  { value: 'neutral', label: 'Tools', dotColor: 'bg-amber-500' },
  { value: 'distraction', label: 'Distraction', dotColor: 'bg-red-500' },
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
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs rounded-2xl p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
      {/* Left: Timeframe & Category Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Timeframe Segmented Control */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
          {timeframeOptions.map((opt) => {
            const active = selectedTimeframe === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setTimeframe(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.label}
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  active
                    ? 'bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)] font-semibold'
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
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search app or window..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Total Stats Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--accent-muted)] border border-[var(--accent)]/20 text-[var(--accent)] font-mono text-xs font-semibold whitespace-nowrap">
          <Zap className="size-3.5" />
          <span>{formatDuration(totalSeconds)} Active</span>
        </div>
      </div>
    </div>
  )
}
