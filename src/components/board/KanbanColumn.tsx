'use client'

import { useState } from 'react'
import { KanbanColumn as ColumnType, Task, useTaskStore, TaskDuration } from '@/stores/taskStore'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import { Plus, Trash2, Check, GripVertical, AlertTriangle, X, ChevronDown, ChevronRight, Clock } from 'lucide-react'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'motion/react'

interface KanbanColumnProps {
  column: ColumnType
  tasks: Task[]
  onEditTask: (task: Task) => void
  isOverlay?: boolean
}

const DURATION_OPTIONS: { label: string; value: TaskDuration }[] = [
  { label: '24h', value: '24h' },
  { label: '48h', value: '48h' },
  { label: '72h', value: '72h' },
  { label: '1 Week', value: '1week' },
  { label: 'None', value: 'none' },
]

export function KanbanColumn({ column, tasks, onEditTask, isOverlay }: KanbanColumnProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const renameColumn = useTaskStore((state) => state.renameColumn)
  const deleteColumn = useTaskStore((state) => state.deleteColumn)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [colName, setColName] = useState(column.name)
  const [quickTitle, setQuickTitle] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [taskDuration, setTaskDuration] = useState<TaskDuration>('24h')

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
    addTask(quickTitle.trim(), column.id, undefined, undefined, undefined, undefined, undefined, undefined, taskDuration)
    setQuickTitle('')
    setShowAddForm(false)
  }

  const handleDeleteConfirm = () => {
    deleteColumn(column.id)
    setConfirmDelete(false)
  }

  const parentTasks = tasks.filter((t) => !t.parentId)
  const subTaskMap = new Map<string, Task[]>()
  tasks.forEach((t) => {
    if (t.parentId) {
      const existing = subTaskMap.get(t.parentId) || []
      existing.push(t)
      subTaskMap.set(t.parentId, existing)
    }
  })

  const getTotalSubTasks = (taskId: string) => {
    return subTaskMap.get(taskId)?.length || 0
  }

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className={`flex flex-col w-80 shrink-0 rounded-2xl border bg-[var(--bg-base)]/80 p-4 transition-lift ${
        isDragging || isOverlay
          ? 'opacity-80 z-50 shadow-2xl scale-[1.01] border-[var(--accent)]'
          : isOver
          ? 'border-[var(--accent)] bg-[var(--bg-surface)]/60 ring-2 ring-[var(--accent)]/30'
          : 'border-[var(--border)]'
      }`}
    >
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            aria-label={`Drag ${column.name} column`}
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
            {parentTasks.length}
            {tasks.filter((t) => t.parentId).length > 0 && (
              <span className="text-[8px] text-[var(--text-tertiary)] ml-0.5">+{tasks.filter((t) => t.parentId).length}</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            aria-label={`Add task to ${column.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            title="Add task to column"
          >
            <Plus className="h-4 w-4" />
          </button>

          {column.id !== 'todo' && column.id !== 'in_progress' && column.id !== 'done' && (
            <button
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${column.name} column`}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
              title="Delete Column"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleQuickAdd} className="mb-3 space-y-2">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
              <Clock className="w-3 h-3" />
              <select
                value={taskDuration}
                onChange={(e) => setTaskDuration(e.target.value as TaskDuration)}
                className="text-[10px] bg-transparent border-none text-[var(--text-secondary)] font-medium focus:outline-hidden cursor-pointer"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="ml-auto rounded-xl bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[100px]">
          {parentTasks.map((task) => (
            <div key={task.id}>
              <KanbanCard task={task} onEdit={onEditTask} />
              {getTotalSubTasks(task.id) > 0 && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-[var(--border-subtle)] pl-3">
                  {subTaskMap.get(task.id)?.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-1.5">
                      <div className="w-2 h-px bg-[var(--border-subtle)]" />
                      <div className="flex-1">
                        <KanbanCard task={sub} onEdit={onEditTask} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setConfirmDelete(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-xl z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--error)]">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-display text-base font-bold text-[var(--text-primary)]">
                  Delete Column
                </h2>
              </div>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 text-sm text-[var(--text-secondary)] space-y-2">
              <p>
                Are you sure you want to delete <strong className="text-[var(--text-primary)]">"{column.name}"</strong>?
              </p>
              <p>
                {tasks.length > 0
                  ? `${tasks.length} task${tasks.length > 1 ? 's' : ''} will move back to "To Do".`
                  : 'This column is empty.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-[var(--error)] px-4 py-2 text-xs font-semibold text-white hover:brightness-90"
              >
                Delete Column
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
