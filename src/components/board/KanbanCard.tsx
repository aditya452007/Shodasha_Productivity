'use client'

import { Task, useTaskStore } from '@/stores/taskStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, GripVertical, Calendar, Link2, MoreHorizontal } from 'lucide-react'
import { motion } from 'motion/react'

interface KanbanCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function KanbanCard({ task, onEdit }: KanbanCardProps) {
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  })

  // Apple design: spring-like transition
  const defaultTransition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || defaultTransition,
  }

  const isDone = task.status === 'done'

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col gap-2.5 rounded-xl border p-4 shadow-xs transition-all ${
        isDragging
          ? 'z-50 opacity-80 border-[var(--accent)] scale-[1.02] shadow-xl'
          : isDone
          ? 'border-[var(--border)] bg-[var(--bg-surface)]/60 opacity-80'
          : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-sm'
      }`}
    >
      {/* Top Header: Drag Handle & Quick Actions */}
      <div className="flex items-center justify-between">
        <div
          {...attributes}
          {...listeners}
          aria-label={`Drag ${task.title}`}
          className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          title="Drag task"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-1">
          {/* Quick Status Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleTaskStatus(task.id)
            }}
            aria-label={`Toggle ${task.title} status`}
            className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
              isDone
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--border-strong)] text-transparent hover:border-[var(--accent)]'
            }`}
            title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <motion.div
              initial={false}
              animate={{ scale: isDone ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </motion.div>
          </motion.button>

          {/* Edit Task Modal Trigger */}
          <button
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
            title="Edit Task Details"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task Title & Description */}
      <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onEdit(task)}>
        <h4
          className={`text-sm font-semibold tracking-tight transition-colors ${
            isDone ? 'line-through text-[var(--text-muted)] font-normal' : 'text-[var(--text-primary)]'
          }`}
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags & Badges Footer */}
      {((task.tags && task.tags.length > 0) || task.dueDate || task.linkedHabitId) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border)]/60">
          {/* Linked Habit Badge */}
          {task.linkedHabitId && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
              <Link2 className="h-3 w-3" />
              <span>Habit Linked</span>
            </span>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--bg-base)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)]">
              <Calendar className="h-3 w-3" />
              <span>{task.dueDate}</span>
            </span>
          )}

          {/* Tag Badges */}
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--bg-base)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)] border border-[var(--border)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
