'use client'

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, BookOpen, Briefcase, User, Layers, Plus, Trash2, Check, X } from 'lucide-react'
import { useHabitStore, GENERAL_CATEGORY } from '@/stores/habitStore'
import { BaseCard } from '@/components/ui/BaseCard'
import { toast } from 'sonner'

const CATEGORY_ICONS: Record<string, any> = {
  cat_health: Heart,
  cat_learning: BookOpen,
  cat_work: Briefcase,
  cat_personal: User,
}

const NEW_CATEGORY_COLORS = ['#059669', '#7c3aed', '#d97706', '#0284c7', '#e11d48', '#0d9488', '#c026d3']

interface CategoryGroup {
  id: string
  label: string
  color: string
  icon: any
  totalCount: number
  doneToday: number
  rate: number
}

export function HabitCategoryMetricsCard({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const categories = useHabitStore((s) => s.habitCategories)
  const addCategory = useHabitStore((s) => s.addCategory)
  const deleteCategory = useHabitStore((s) => s.deleteCategory)

  const todayStr = new Date().toISOString().split('T')[0]

  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(NEW_CATEGORY_COLORS[0])

  const categoryGroups: CategoryGroup[] = useMemo(() => {
    const groups: CategoryGroup[] = categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      color: cat.color,
      icon: CATEGORY_ICONS[cat.id] ?? Layers,
      totalCount: 0,
      doneToday: 0,
      rate: 0,
    }))
    groups.push({
      id: GENERAL_CATEGORY,
      label: 'General',
      color: 'var(--text-tertiary)',
      icon: Layers,
      totalCount: 0,
      doneToday: 0,
      rate: 0,
    })

    habits.forEach((h) => {
      const group = groups.find((g) => g.id === h.category) ?? groups[groups.length - 1]
      group.totalCount += 1
      if (!!records[`${h.id}_${todayStr}`]) group.doneToday += 1
    })

    return groups
      .filter((g) => g.id !== GENERAL_CATEGORY || g.totalCount > 0)
      .map((g) => ({
        ...g,
        rate: g.totalCount > 0 ? Math.round((g.doneToday / g.totalCount) * 100) : 0,
      }))
  }, [habits, records, categories, todayStr])

  const totalActiveHabits = habits.length

  const handleAddCategory = () => {
    const trimmed = newName.trim()
    if (!trimmed) {
      toast.error('Category name is required')
      return
    }
    addCategory(trimmed, newColor)
    setNewName('')
    setNewColor(NEW_CATEGORY_COLORS[0])
    setIsAdding(false)
    toast.success(`Category "${trimmed}" created`)
  }

  const handleDeleteCategory = (group: CategoryGroup) => {
    deleteCategory(group.id)
    toast.info(`Category "${group.label}" deleted — habits moved to General`)
  }

  return (
    <BaseCard
      elevation="raised"
      className={`card-hover-lift rounded-2xl h-full flex flex-col justify-between p-5 ${className}`}
      innerClassName="p-0 flex flex-col justify-between h-full"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">
                Category Balance
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Domain distribution & completion rate
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            {totalActiveHabits} Active
          </span>
        </div>

        {/* Category Meters — scrollable for unlimited categories */}
        <div className="space-y-3.5 max-h-[320px] overflow-y-auto overscroll-contain pr-1">
          {categoryGroups.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)] py-4 text-center">
              No habits yet — create one to see category balance.
            </p>
          ) : (
            categoryGroups.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                    delay: shouldReduceMotion ? 0 : Math.min(idx * 0.04, 0.24),
                  }}
                  className="space-y-1.5 group/meter"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-[var(--text-primary)] min-w-0">
                      <span
                        className="p-1 rounded-md text-white shrink-0"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon className="w-3 h-3" />
                      </span>
                      <span className="truncate">{cat.label}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        aria-label={`Delete category ${cat.label}`}
                        title="Delete category — habits move to General"
                        className="p-0.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 opacity-0 group-hover/meter:opacity-100 transition-opacity shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)] shrink-0">
                      {cat.doneToday}/{cat.totalCount} ({cat.rate}%)
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.rate}%` }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
        {isAdding ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Category name (e.g. Finance)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory()
                }}
                className="flex-1 min-w-0 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-ring"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                aria-label="Add category"
                className="p-1.5 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setNewName('')
                }}
                aria-label="Cancel"
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {NEW_CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  aria-label={`Use color ${c}`}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    newColor.toLowerCase() === c.toLowerCase()
                      ? 'scale-110 ring-2 ring-offset-1 ring-offset-[var(--bg-secondary)] ring-[var(--text-primary)]'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--accent)] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> New Category
          </button>
        )}
        <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
          <span>Delete a category to move its habits to General</span>
          <span className="font-mono font-medium">Daily</span>
        </div>
      </div>
    </BaseCard>
  )
}
