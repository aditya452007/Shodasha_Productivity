'use client'

import { memo } from 'react'
import { Task, useTaskStore } from '@/stores/taskStore'
import { useTimeEntryStore } from '@/stores/timeEntryStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, GripVertical, Calendar, Link2, MoreHorizontal, Clock, ExternalLink, Layers } from 'lucide-react'
import { openExternalUrl, getCleanDomain } from '@/lib/utils/url'
import { motion } from 'motion/react'

interface KanbanCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export const KanbanCard = memo(function KanbanCard({ task, onEdit }: KanbanCardProps) {
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus)
  const taskSeconds = useTimeEntryStore((state) => state.taskLoggedSecondsMap[task.id] ?? 0)
  const getSubTasks = useTaskStore((state) => state.getSubTasks)
  const subTasks = getSubTasks(task.id)

  const formatTaskDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    if (hrs > 0) return `${hrs}h ${mins}m`
    return `${mins}m`
  }

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

  const defaultTransition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || defaultTransition,
  }

  const isDone = task.status === 'done'

  const durationLabel: Record<string, string> = {
    '24h': '24h',
    '48h': '48h',
    '72h': '72h',
    '1week': '1wk',
    'none': '',
  }

  const getExpiryStatus = () => {
    if (!task.expiresAt || isDone) return null
    const now = new Date()
    const expires = new Date(task.expiresAt)
    const diffMs = expires.getTime() - now.getTime()
    if (diffMs <= 0) return { label: 'Expired', color: 'text-red-500 bg-red-500/10' }
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60))
    if (diffHrs <= 1) return { label: `${diffHrs}h left`, color: 'text-amber-500 bg-amber-500/10' }
    if (diffHrs <= 6) return { label: `${diffHrs}h left`, color: 'text-amber-500 bg-amber-500/10' }
    return { label: durationLabel[task.duration] || '', color: 'text-[var(--text-tertiary)] bg-[var(--bg-base)]' }
  }

  const expiryStatus = getExpiryStatus()

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col gap-2.5 rounded-xl border p-4 shadow-sm transition-lift ${
        isDragging
          ? 'z-50 opacity-80 border-[var(--accent)] scale-[1.02] shadow-xl'
          : isDone
          ? 'border-[var(--border)] bg-[var(--bg-surface)]/60 opacity-80'
          : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-md'
      }`}
    >
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
          {task.url && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                openExternalUrl(task.url)
              }}
              aria-label={`Open link for ${task.title} in default browser`}
              className="flex h-6 w-6 items-center justify-center rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-muted)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
              title={`Open ${task.url} in browser`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              toggleTaskStatus(task.id)
            }}
            aria-label={`Toggle ${task.title} status`}
            className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors ${
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

      <div className="flex flex-col gap-1 cursor-pointer" onClick={() => onEdit(task)}>
        <h4
          className={`text-sm font-semibold tracking-tight transition-colors ${
            isDone ? 'line-through text-[var(--text-muted)] font-normal' : 'text-[var(--text-primary)]'
          }`}
        >
          {task.title}
          {subTasks.length > 0 && (
            <span className="ml-1.5 text-[10px] text-[var(--text-tertiary)] font-normal">
              ({subTasks.length})
            </span>
          )}
        </h4>
        {task.description && (
          <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">
            {task.description}
          </p>
        )}
      </div>

      {((task.tags && task.tags.length > 0) || task.dueDate || task.linkedHabitId || taskSeconds > 0 || task.url || expiryStatus || subTasks.length > 0 || task.duration) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border)]/60">
          {task.url && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                openExternalUrl(task.url)
              }}
              className="flex items-center gap-1 rounded-md bg-[var(--accent-muted)]/40 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white border border-[var(--accent)]/30 cursor-pointer"
              title={`Open ${task.url} in default browser`}
            >
              <ExternalLink className="h-3 w-3" />
              <span>{getCleanDomain(task.url)}</span>
            </button>
          )}

          {taskSeconds > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-mono font-semibold text-[var(--accent)] border border-[var(--accent)]/20">
              <Clock className="h-3 w-3" />
              <span>{formatTaskDuration(taskSeconds)} logged</span>
            </span>
          )}

          {task.linkedHabitId && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
              <Link2 className="h-3 w-3" />
              <span>Habit Linked</span>
            </span>
          )}

          {subTasks.length > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-500 border border-violet-500/20">
              <Layers className="h-3 w-3" />
              <span>{subTasks.length} sub-task{subTasks.length > 1 ? 's' : ''}</span>
            </span>
          )}

          {expiryStatus && (
            <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${expiryStatus.color}`}>
              <Clock className="h-3 w-3" />
              <span>{expiryStatus.label}</span>
            </span>
          )}

          {task.dueDate && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--bg-base)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border)]">
              <Calendar className="h-3 w-3" />
              <span>{task.dueDate}</span>
            </span>
          )}

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
})

KanbanCard.displayName = 'KanbanCard'
