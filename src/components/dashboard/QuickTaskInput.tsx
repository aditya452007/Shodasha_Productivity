'use client'

import { useState } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { Plus, CornerDownLeft } from 'lucide-react'

export function QuickTaskInput() {
  const [title, setTitle] = useState('')
  const addTask = useTaskStore((state) => state.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(title.trim(), 'todo')
    setTitle('')
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quick add a task to 'To Do'..."
        className="flex-1 bg-transparent text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
      >
        <span>Add</span>
        <CornerDownLeft className="h-3 w-3" />
      </button>
    </form>
  )
}
