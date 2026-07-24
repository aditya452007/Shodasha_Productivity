'use client'

import { useState } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { Plus, CornerDownLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function QuickTaskInput() {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addTask = useTaskStore((state) => state.addTask)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await addTask(title.trim(), 'todo')
      toast.success(`Task "${title.trim()}" added to To Do`)
      setTitle('')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-2 shadow-xs transition-all focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-base)] text-[var(--text-muted)]">
        <Plus className="h-4 w-4" />
      </div>
      <input
        type="text"
        disabled={isSubmitting}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quick add a task to 'To Do'..."
        aria-label="New task title"
        className="flex-1 bg-transparent text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        aria-label="Add task"
        className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-40 cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            <span>Add</span>
            <CornerDownLeft className="h-3 w-3" />
          </>
        )}
      </button>
    </form>
  )
}
