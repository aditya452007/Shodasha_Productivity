'use client'

import { useState, useEffect } from 'react'
import { Task, useTaskStore } from '@/stores/taskStore'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { TaskModal } from './TaskModal'
import { AddColumnModal } from './AddColumnModal'
import { Plus, Kanban as KanbanIcon } from 'lucide-react'

export function KanbanBoard() {
  const [isMounted, setIsMounted] = useState(false)
  const columns = useTaskStore((state) => state.columns)
  const tasks = useTaskStore((state) => state.tasks)
  const moveTask = useTaskStore((state) => state.moveTask)
  const reorderTasks = useTaskStore((state) => state.reorderTasks)
  const reorderColumns = useTaskStore((state) => state.reorderColumns)

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeColumn, setActiveColumn] = useState<any>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAddColModalOpen, setIsAddColModalOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Column') {
      const col = columns.find((c) => c.id === active.id)
      if (col) setActiveColumn(col)
      return
    }
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isTask = active.data.current?.type === 'Task'
    const isColumn = active.data.current?.type === 'Column'

    if (isColumn) return // Handled in DragEnd

    if (isTask) {
      const activeTaskItem = tasks.find((t) => t.id === activeId)
      if (!activeTaskItem) return

      const isOverColumn = columns.some((col) => col.id === overId)
      if (isOverColumn) {
        if (activeTaskItem.status !== overId) {
          moveTask(activeId, overId)
        }
        return
      }

      const overTaskItem = tasks.find((t) => t.id === overId)
      if (overTaskItem && activeTaskItem.status !== overTaskItem.status) {
        moveTask(activeId, overTaskItem.status)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setActiveColumn(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    if (active.data.current?.type === 'Column') {
      reorderColumns(activeId, overId)
      return
    }

    if (active.data.current?.type === 'Task') {
      const overTask = tasks.find((t) => t.id === overId)
      const targetStatus = overTask
        ? overTask.status
        : columns.some((c) => c.id === overId)
        ? overId
        : undefined

      reorderTasks(activeId, overId, targetStatus)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Board Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KanbanIcon className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Kanban Board
          </h2>
        </div>

        <button
          onClick={() => setIsAddColModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Column</span>
        </button>
      </div>

      {/* Kanban Drag & Drop Area */}
      {isMounted && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columns.map((c) => c.id)} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap items-start gap-6 pb-6 pt-2">
              {columns.map((column) => {
                const columnTasks = tasks.filter((t) => t.status === column.id)
                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onEditTask={handleEditTask}
                  />
                )
              })}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeColumn ? (
              <div className="w-full shadow-2xl rotate-1 opacity-90">
                <KanbanColumn
                  column={activeColumn}
                  tasks={tasks.filter((t) => t.status === activeColumn.id)}
                  onEditTask={() => {}}
                  isOverlay={true}
                />
              </div>
            ) : activeTask ? (
              <div className="w-full shadow-2xl rotate-2">
                <KanbanCard task={activeTask} onEdit={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Edit Modal */}
      <TaskModal
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
      />

      {/* Add Column Modal */}
      <AddColumnModal
        isOpen={isAddColModalOpen}
        onClose={() => setIsAddColModalOpen(false)}
      />
    </div>
  )
}
