'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Tag, Check, Trash2, Edit3, Monitor, X } from 'lucide-react'
import { useTimeEntryStore, CategoryType } from '@/stores/timeEntryStore'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

const categoryColors: Record<CategoryType, { bg: string; text: string; dot: string; border: string; label: string }> = {
  work: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-[#059669]',
    border: 'border-emerald-500/20',
    label: 'Deep Work',
  },
  neutral: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-[#d97706]',
    border: 'border-amber-500/20',
    label: 'General / Tools',
  },
  distraction: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-[#dc2626]',
    border: 'border-rose-500/20',
    label: 'Distraction',
  },
}

export function AppCategoryManager() {
  const { categories, setCategory, entries, isLoading, error } = useTimeEntryStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAppName, setNewAppName] = useState('')
  const [newCategory, setNewCategory] = useState<CategoryType>('work')

  // Collect all unique app names from categories store AND entries
  const allAppNames = Array.from(
    new Set([...Object.keys(categories), ...entries.map((e) => e.appName)])
  )

  const filteredApps = allAppNames.filter((app) =>
    app.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveAppCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAppName.trim()) return
    const formattedName = newAppName.trim()
    setCategory(formattedName, newCategory)
    setNewAppName('')
    setIsAddModalOpen(false)
  }

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
      <div className="rounded-[calc(2.25rem-0.5rem)] bg-[var(--bg-surface)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20">
                Classification Engine
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              App Categorization Manager
            </h2>
            <p className="text-xs text-[var(--text-tertiary)]">
              Map executables to productivity categories. Updating a category immediately updates timeline & dashboard analytics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="group self-start sm:self-center inline-flex items-center justify-between gap-3 pl-4 pr-1.5 py-1.5 text-xs font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full shadow-md shadow-[var(--accent)]/20 transition-all duration-300 active:scale-[0.98]"
          >
            <span>Add Executable</span>
            <span className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
              <Plus className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search application process name (e.g. Code.exe, chrome.exe)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all"
          />
        </div>

        {/* Executable Classification Grid / List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <LoadingSkeleton height={56} />
            <LoadingSkeleton height={56} />
            <LoadingSkeleton height={56} />
            <LoadingSkeleton height={56} />
          </div>
        ) : error ? (
          <ErrorBanner title="Failed to load categories" message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredApps.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={Monitor}
                  title="No application processes found"
                  description={searchQuery ? `No applications match "${searchQuery}"` : "Click 'Add Executable' to map an application process."}
                />
              </div>
            ) : (
              filteredApps.map((appName) => {
              const category = categories[appName] || 'neutral'
              const config = categoryColors[category]

              return (
                <div
                  key={appName}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-[var(--text-secondary)]">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)] truncate">
                        {appName}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                        <span className={`text-[10px] font-medium ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category Selector Buttons */}
                  <div className="flex items-center gap-1 bg-stone-900/5 dark:bg-white/5 p-1 rounded-xl">
                    {(['work', 'neutral', 'distraction'] as CategoryType[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(appName, cat)}
                        title={`Set to ${categoryColors[cat].label}`}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          category === cat
                            ? `${categoryColors[cat].dot} text-white shadow-sm`
                            : 'hover:bg-stone-500/10 text-[var(--text-tertiary)]'
                        }`}
                      >
                        <span className="sr-only">{cat}</span>
                        <div className={`w-2 h-2 rounded-full ${category === cat ? 'bg-white' : categoryColors[cat].dot}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
        )}
      </div>

      {/* Add Executable Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="w-full max-w-md p-2 rounded-[2rem] bg-stone-900/10 dark:bg-white/10 ring-1 ring-white/20 shadow-2xl"
            >
              <div className="rounded-[calc(2rem-0.5rem)] bg-[var(--bg-surface)] p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">Add Application Executable</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-stone-500/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveAppCategory} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Executable Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Code.exe, chrome.exe, spotify.exe"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Classification Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['work', 'neutral', 'distraction'] as CategoryType[]).map((cat) => {
                        const cfg = categoryColors[cat]
                        const isSelected = newCategory === cat
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewCategory(cat)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs font-medium ${
                              isSelected
                                ? `${cfg.bg} ${cfg.border} ${cfg.text} ring-2 ring-[var(--accent)]`
                                : 'border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)]'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                            <span>{cfg.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:bg-stone-500/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-md active:scale-[0.98]"
                    >
                      <span>Save Mapping</span>
                      <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
