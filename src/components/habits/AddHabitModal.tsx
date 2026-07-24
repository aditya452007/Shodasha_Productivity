'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Sparkles, Link as LinkIcon, Check } from 'lucide-react'
import { useHabitStore, Habit } from '@/stores/habitStore'
import { useTaskStore } from '@/stores/taskStore'
import { toast } from 'sonner'

interface AddHabitModalProps {
  isOpen: boolean
  onClose: () => void
  editingHabit?: Habit | null
}

const PRESET_COLORS = [
  { name: 'Emerald', value: '#059669' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Sky', value: '#0284c7' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Fuchsia', value: '#c026d3' },
]

export function AddHabitModal({ isOpen, onClose, editingHabit }: AddHabitModalProps) {
  const addHabit = useHabitStore((s) => s.addHabit)
  const updateHabit = useHabitStore((s) => s.updateHabit)
  const tasks = useTaskStore((s) => s.tasks)
  const shouldReduceMotion = useReducedMotion()

  const [name, setName] = useState('')
  const [color, setColor] = useState('#059669')
  const [linkedTaskId, setLinkedTaskId] = useState('')

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name)
      setColor(editingHabit.color || '#059669')
      setLinkedTaskId(editingHabit.linkedTaskId || '')
    } else {
      setName('')
      setColor('#059669')
      setLinkedTaskId('')
    }
  }, [editingHabit, isOpen])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Habit title is required')
      return
    }

    try {
      setIsSubmitting(true)
      if (editingHabit) {
        await updateHabit(editingHabit.id, name.trim(), color, linkedTaskId || undefined)
        toast.success('Habit updated')
      } else {
        await addHabit(name.trim(), color, linkedTaskId || undefined)
        toast.success(`Habit "${name.trim()}" created`)
      }
      onClose()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save habit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-[var(--text-primary)]">
                    {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Set a daily goal and optionally link it to a task
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Habit Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Habit Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30m Daily Deep Reading"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                />
              </div>

              {/* Color Picker Swatches */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = color.toLowerCase() === c.value.toLowerCase()
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                          isSelected ? 'scale-110 ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] ring-[var(--text-primary)]' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Linked Task Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    Linked Task (Optional)
                  </label>
                  <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Auto-completes task
                  </span>
                </div>
                <select
                  value={linkedTaskId}
                  onChange={(e) => setLinkedTaskId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                >
                  <option value="">-- No Linked Task --</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      [{task.status.toUpperCase()}] {task.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] pt-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                >
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
