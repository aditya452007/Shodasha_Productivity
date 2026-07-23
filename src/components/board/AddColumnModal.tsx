'use client'

import { useState } from 'react'
import { useTaskStore } from '@/stores/taskStore'
import { X, LayoutGrid } from 'lucide-react'

interface AddColumnModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddColumnModal({ isOpen, onClose }: AddColumnModalProps) {
  const [name, setName] = useState('')
  const addColumn = useTaskStore((state) => state.addColumn)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addColumn(name.trim())
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-display text-base font-bold text-[var(--text-primary)]">
              Add New Column
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Column Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. In Review, Testing, Backlog"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-xs"
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
