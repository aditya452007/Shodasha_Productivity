'use client'

import { useState, useEffect } from 'react'
import { Task, useTaskStore, TaskDuration } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Trash2, Calendar, Tag, Link2, AlignLeft, Loader2, Clock, ExternalLink, Globe, Layers } from 'lucide-react'
import { openExternalUrl } from '@/lib/utils/url'
import { toast } from 'sonner'

interface TaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

const DURATION_OPTIONS: { label: string; value: TaskDuration }[] = [
  { label: '24 hours', value: '24h' },
  { label: '48 hours', value: '48h' },
  { label: '72 hours', value: '72h' },
  { label: '1 week', value: '1week' },
  { label: 'No expiry', value: 'none' },
]

export function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const columns = useTaskStore((state) => state.columns)
  const tasks = useTaskStore((state) => state.tasks)
  const habits = useHabitStore((state) => state.habits)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [linkedHabitId, setLinkedHabitId] = useState('')
  const [url, setUrl] = useState('')
  const [parentId, setParentId] = useState('')
  const [duration, setDuration] = useState<TaskDuration>('24h')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const eligibleParents = tasks.filter((t) => t.id !== task?.id && !t.parentId)

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setStatus(task.status || 'todo')
      setDueDate(task.dueDate || '')
      setTagsInput(task.tags ? task.tags.join(', ') : '')
      setLinkedHabitId(task.linkedHabitId || '')
      setUrl(task.url || '')
      setParentId(task.parentId || '')
      setDuration(task.duration || '24h')
    }
  }, [task])

  if (!task) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      setIsSubmitting(true)
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const now = new Date().toISOString()
      const DURATION_MS: Record<TaskDuration, number | null> = {
        '24h': 24 * 60 * 60 * 1000,
        '48h': 48 * 60 * 60 * 1000,
        '72h': 72 * 60 * 60 * 1000,
        '1week': 7 * 24 * 60 * 60 * 1000,
        'none': null,
      }
      const durationMs = DURATION_MS[duration]
      const expiresAt = durationMs ? new Date(new Date().getTime() + durationMs).toISOString() : undefined

      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: dueDate || undefined,
        tags,
        linkedHabitId: linkedHabitId || undefined,
        url: url.trim() || undefined,
        parentId: parentId || undefined,
        duration,
        expiresAt,
      })
      toast.success('Task details updated')
      onClose()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    const subTasks = tasks.filter((t) => t.parentId === task.id)
    if (subTasks.length > 0) {
      if (!confirm(`${subTasks.length} sub-task(s) will also be deleted. Continue?`)) return
    }
    deleteTask(task.id)
    toast.success('Task deleted')
    onClose()
  }

  const getTaskLoggedSeconds = useTimeEntryStore.getState().getTaskLoggedSeconds
  const totalSecs = getTaskLoggedSeconds(task.id)
  const hrs = Math.floor(totalSecs / 3600)
  const mins = Math.floor((totalSecs % 3600) / 60)
  const timeDisplay = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xl z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
                  Task Details
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Column Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              <AlignLeft className="h-3.5 w-3.5" />
              <span>Description</span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional task details..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Globe className="h-3.5 w-3.5" />
                <span>Web Link / URL</span>
              </div>
              {url.trim() && (
                <button
                  type="button"
                  onClick={() => openExternalUrl(url)}
                  className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-medium"
                >
                  Open in browser <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/task"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Calendar className="h-3.5 w-3.5" />
                <span>Due Date</span>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Tag className="h-3.5 w-3.5" />
                <span>Tags</span>
              </div>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Design, Tech"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              <Clock className="h-3.5 w-3.5" />
              <span>Auto-expiry Duration</span>
            </div>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as TaskDuration)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              <Layers className="h-3.5 w-3.5" />
              <span>Parent Task (for sub-tasks)</span>
            </div>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              <option value="">None (Top-level task)</option>
              {eligibleParents.map((t) => (
                <option key={t.id} value={t.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              <Link2 className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Linked Habit</span>
            </div>
            <select
              value={linkedHabitId}
              onChange={(e) => setLinkedHabitId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              <option value="" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">None (Unlinked)</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  {habit.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-base)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--text-primary)]">Desktop Focus Time Logged</span>
                <span className="text-[10px] text-[var(--text-secondary)]">Time entries linked to this task</span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-[var(--accent)]">
              {timeDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-2">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Task</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline-block mr-1.5" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  )
}
