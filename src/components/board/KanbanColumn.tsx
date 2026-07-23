'use client'

import { useState } from 'react'
import { KanbanColumn as ColumnType, Task, useTaskStore } from '@/stores/taskStore'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import { Plus, Trash2, Check, GripVertical } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'motion/react'

interface KanbanColumnProps {
  column: ColumnType
  tasks: Task[]
  onEditTask: (task: Task) => void
  isOverlay?: boolean
}

export function KanbanColumn({ column, tasks, onEditTask, isOverlay }: KanbanColumnProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const renameColumn = useTaskStore((state) => state.renameColumn)
  const deleteColumn = useTaskStore((state) => state.deleteColumn)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [colName, setColName] = useState(column.name)
  const [quickTitle, setQuickTitle] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
  })

  const defaultTransition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'

  // During drag we don't apply the transition here to avoid lag; it applies on drop.
  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || defaultTransition,
  }

  const taskIds = tasks.map((t) => t.id)

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (colName.trim()) {
      renameColumn(column.id, colName.trim())
    }
    setIsEditingTitle(false)
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTitle.trim()) return
    addTask(quickTitle.trim(), column.id)
    setQuickTitle('')
    setShowAddForm(false)
  }

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className={`flex flex-col w-80 shrink-0 rounded-2xl border bg-[var(--bg-base)]/80 p-4 transition-all ${
        isDragging || isOverlay
          ? 'opacity-80 z-50 shadow-2xl scale-[1.01] border-[var(--accent)]'
          : isOver
          ? 'border-[var(--accent)] bg-[var(--bg-surface)]/60 ring-2 ring-[var(--accent)]/30'
          : 'border-[var(--border)]'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            title="Drag column"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          {isEditingTitle ? (
            <form onSubmit={handleRename} className="flex items-center gap-1">
              <input
                type="text"
                value={colName}
                onChange={(e) => setColName(e.target.value)}
                className="rounded-lg border border-[var(--accent)] bg-[var(--bg-surface)] px-2 py-1 text-xs font-bold text-[var(--text-primary)] outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)] text-white"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="font-display text-sm font-bold text-[var(--text-primary)] cursor-pointer hover:text-[var(--accent)] flex items-center gap-1.5"
            >
              <span>{column.name}</span>
            </h3>
          )}

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-surface)] font-mono text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--border)]">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            title="Add task to column"
          >
            <Plus className="h-4 w-4" />
          </button>

          {column.id !== 'todo' && column.id !== 'in_progress' && column.id !== 'done' && (
            <button
              onClick={() => deleteColumn(column.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
              title="Delete Column"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Inline Form */}
      {showAddForm && (
        <form onSubmit={handleQuickAdd} className="mb-3 flex gap-2">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Task title..."
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
          >
            Add
          </button>
        </form>
      )}

      {/* Droppable Sortable Tasks List */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[100px]">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onEdit={onEditTask} />
          ))}

          {tasks.length === 0 && !showAddForm && (
            <div
              onClick={() => setShowAddForm(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--border-strong)] p-6 text-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs font-medium">Add a task</span>
            </div>
          )}
        </div>
      </SortableContext>
    </motion.div>
  )
}
