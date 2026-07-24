import { create } from 'zustand'
import {
  fetchTasksFromDb,
  createTaskInDb,
  updateTaskInDb,
  deleteTaskFromDb,
  reorderTaskInDb,
  fetchKanbanColumnsFromDb,
  createKanbanColumnInDb,
  updateKanbanColumnInDb,
  deleteKanbanColumnFromDb,
  reorderKanbanColumnsInDb,
} from '@/lib/db'

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  order: number
  dueDate?: string
  tags?: string[]
  linkedHabitId?: string
  url?: string
  createdAt: string
  updatedAt: string
}

export interface KanbanColumn {
  id: string
  name: string
  order: number
}

export interface AsyncState {
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

interface TaskState extends AsyncState {
  tasks: Task[]
  columns: KanbanColumn[]
  initializeTasks: () => Promise<void>
  addTask: (title: string, status?: string, description?: string, tags?: string[], dueDate?: string, linkedHabitId?: string, url?: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  toggleTaskStatus: (id: string) => void
  moveTask: (id: string, targetStatus: string) => void
  reorderTasks: (activeId: string, overId: string, newStatus?: string) => void
  deleteTask: (id: string) => void
  addColumn: (name: string) => void
  renameColumn: (id: string, name: string) => void
  reorderColumns: (activeId: string, overId: string) => void
  deleteColumn: (id: string) => void
}

const initialTasks: Task[] = []

const initialColumns: KanbanColumn[] = [
  { id: 'todo', name: 'To Do', order: 0 },
  { id: 'in_progress', name: 'In Progress', order: 1 },
  { id: 'done', name: 'Done', order: 2 },
]

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  columns: initialColumns,
  isLoading: false,
  error: null,
  isInitialized: false,
  initializeTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      const dbTasks = await fetchTasksFromDb()
      const dbColumns = await fetchKanbanColumnsFromDb()

      if (dbColumns && Array.isArray(dbColumns) && dbColumns.length > 0) {
        const mappedCols: KanbanColumn[] = dbColumns.map((c: any) => ({
          id: c.id,
          name: c.name,
          order: c.sort_order,
        }))
        set({ columns: mappedCols })
      }

      if (dbTasks && Array.isArray(dbTasks)) {
        const mappedTasks: Task[] = dbTasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || undefined,
          status: t.status,
          order: t.sort_order,
          dueDate: t.due_date || undefined,
          tags: t.tags ? JSON.parse(t.tags) : [],
          linkedHabitId: t.linked_habit_id || undefined,
          url: t.url || undefined,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }))
        set({ tasks: mappedTasks, isLoading: false, isInitialized: true })
      } else {
        set({ isLoading: false, isInitialized: true })
      }
    } catch (err: any) {
      set({ error: err?.message || 'Failed to initialize tasks', isLoading: false, isInitialized: true })
    }
  },
  addTask: (title, status = 'todo', description, tags, dueDate, linkedHabitId, url) => {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title,
      description,
      status,
      order: get().tasks.filter((t) => t.status === status).length,
      tags: tags || [],
      dueDate,
      linkedHabitId,
      url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ tasks: [newTask, ...state.tasks] }))
    createTaskInDb({
      id: newTask.id,
      title: newTask.title,
      description: newTask.description || null,
      status: newTask.status,
      sort_order: newTask.order,
      due_date: newTask.dueDate || null,
      tags: newTask.tags ? JSON.stringify(newTask.tags) : null,
      linked_habit_id: newTask.linkedHabitId || null,
      url: newTask.url || null,
      created_at: newTask.createdAt,
      updated_at: newTask.updatedAt,
    })
  },
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ),
    }))
    const updated = get().tasks.find((t) => t.id === id)
    if (updated) {
      updateTaskInDb({
        id: updated.id,
        title: updated.title,
        description: updated.description || null,
        status: updated.status,
        sort_order: updated.order,
        due_date: updated.dueDate || null,
        tags: updated.tags ? JSON.stringify(updated.tags) : null,
        linked_habit_id: updated.linkedHabitId || null,
        url: updated.url || null,
        created_at: updated.createdAt,
        updated_at: updated.updatedAt,
      })
    }
  },
  toggleTaskStatus: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== id) return task
        const nextStatus = task.status === 'done' ? 'todo' : 'done'
        return { ...task, status: nextStatus, updatedAt: new Date().toISOString() }
      }),
    }))
    const updated = get().tasks.find((t) => t.id === id)
    if (updated) {
      reorderTaskInDb(updated.id, updated.status, updated.order)
    }
  },
  moveTask: (id, targetStatus) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: targetStatus, updatedAt: new Date().toISOString() } : task
      ),
    }))
    const updated = get().tasks.find((t) => t.id === id)
    if (updated) {
      reorderTaskInDb(updated.id, updated.status, updated.order)
    }
  },
  reorderTasks: (activeId, overId, newStatus) => {
    set((state) => {
      const tasks = [...state.tasks]
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      if (activeIndex === -1) return { tasks }

      const activeTask = { ...tasks[activeIndex] }
      if (newStatus && activeTask.status !== newStatus) {
        activeTask.status = newStatus
      }

      tasks.splice(activeIndex, 1)

      const overIndex = tasks.findIndex((t) => t.id === overId)
      if (overIndex !== -1) {
        tasks.splice(overIndex, 0, activeTask)
      } else {
        tasks.push(activeTask)
      }

      tasks.forEach((t, index) => {
        t.order = index
      })

      return { tasks }
    })
    const moved = get().tasks.find((t) => t.id === activeId)
    if (moved) {
      reorderTaskInDb(moved.id, moved.status, moved.order)
    }
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
    deleteTaskFromDb(id)
  },
  addColumn: (name) => {
    const newCol: KanbanColumn = {
      id: `col-${Date.now()}`,
      name,
      order: get().columns.length,
    }
    set((state) => ({ columns: [...state.columns, newCol] }))
    createKanbanColumnInDb({ id: newCol.id, name: newCol.name, sort_order: newCol.order })
  },
  renameColumn: (id, name) => {
    set((state) => ({
      columns: state.columns.map((col) => (col.id === id ? { ...col, name } : col)),
    }))
    const updated = get().columns.find((c) => c.id === id)
    if (updated) {
      updateKanbanColumnInDb({ id: updated.id, name: updated.name, sort_order: updated.order })
    }
  },
  deleteColumn: (id) => {
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id),
      tasks: state.tasks.map((task) => (task.status === id ? { ...task, status: 'todo' } : task)),
    }))
    deleteKanbanColumnFromDb(id)
  },
  reorderColumns: (activeId, overId) => {
    const columns = [...get().columns]
    const activeIndex = columns.findIndex((c) => c.id === activeId)
    const overIndex = columns.findIndex((c) => c.id === overId)

    if (activeIndex !== -1 && overIndex !== -1) {
      const [activeCol] = columns.splice(activeIndex, 1)
      columns.splice(overIndex, 0, activeCol)
      columns.forEach((col, index) => {
        col.order = index
      })
      set({ columns })
      reorderKanbanColumnsInDb(columns.map((c) => ({ id: c.id, name: c.name, sort_order: c.order })))
    }
  },
}))
