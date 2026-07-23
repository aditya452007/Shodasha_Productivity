'use client'

import { useState, useEffect } from 'react'
import { Task, useTaskStore } from '@/stores/taskStore'
import { useHabitStore } from '@/stores/habitStore'
import { X, Trash2, Calendar, Tag, Link2, AlignLeft, CheckSquare } from 'lucide-react'

interface TaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const columns = useTaskStore((state) => state.columns)
  const habits = useHabitStore((state) => state.habits)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [linkedHabitId, setLinkedHabitId] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setStatus(task.status || 'todo')
      setDueDate(task.dueDate || '')
      setTagsInput(task.tags ? task.tags.join(', ') : '')
      setLinkedHabitId(task.linkedHabitId || '')
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      dueDate: dueDate || undefined,
      tags,
      linkedHabitId: linkedHabitId || undefined,
    })
    onClose()
  }

  const handleDelete = () => {
    deleteTask(task.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-[var(--accent)]" />
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
          {/* Title */}
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

          {/* Status / Column */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Column Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
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

          <div className="grid grid-cols-2 gap-3">
            {/* Due Date */}
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

            {/* Tags */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Tag className="h-3.5 w-3.5" />
                <span>Tags (comma separated)</span>
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

          {/* Linked Habit */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              <Link2 className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Linked Habit (Auto-completes task when habit is done)</span>
            </div>
            <select
              value={linkedHabitId}
              onChange={(e) => setLinkedHabitId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            >
              <option value="">None (Unlinked)</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
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
                className="rounded-xl bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
