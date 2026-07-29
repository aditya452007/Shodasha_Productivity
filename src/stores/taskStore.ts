import { create } from 'zustand'
import { useGamificationStore } from './gamificationStore'
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
import { toast } from 'sonner'

export type TaskDuration = '24h' | '48h' | '72h' | '1week' | 'none'

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
  parentId?: string
  duration: TaskDuration
  createdAt: string
  updatedAt: string
  expiresAt?: string
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
  addTask: (title: string, status?: string, description?: string, tags?: string[], dueDate?: string, linkedHabitId?: string, url?: string, parentId?: string, duration?: TaskDuration) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  toggleTaskStatus: (id: string) => void
  moveTask: (id: string, targetStatus: string) => void
  reorderTasks: (activeId: string, overId: string, newStatus?: string) => void
  deleteTask: (id: string) => void
  addColumn: (name: string) => void
  renameColumn: (id: string, name: string) => void
  reorderColumns: (activeId: string, overId: string) => void
  deleteColumn: (id: string) => void
  getActiveTasks: () => Task[]
  getExpiredTasks: () => Task[]
  getSubTasks: (parentId: string) => Task[]
  getTodayCompletedTasks: () => Task[]
  getTasksByDateRange: (startDate: string, endDate: string) => Task[]
}

const DURATION_MS: Record<TaskDuration, number | null> = {
  '24h': 24 * 60 * 60 * 1000,
  '48h': 48 * 60 * 60 * 1000,
  '72h': 72 * 60 * 60 * 1000,
  '1week': 7 * 24 * 60 * 60 * 1000,
  'none': null,
}

function computeExpiresAt(duration: TaskDuration, createdAt: string): string | undefined {
  const ms = DURATION_MS[duration]
  if (ms === null) return undefined
  return new Date(new Date(createdAt).getTime() + ms).toISOString()
}

function isExpired(task: Task): boolean {
  if (!task.expiresAt || task.status === 'done') return false
  return new Date(task.expiresAt) < new Date()
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
          parentId: t.parent_id || undefined,
          duration: t.duration || 'none',
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          expiresAt: t.expires_at || undefined,
        }))

        const expiredTasks = mappedTasks.filter(isExpired)
        if (expiredTasks.length > 0) {
          expiredTasks.forEach((task) => {
            deleteTaskFromDb(task.id).catch(() => {})
          })
          const remainingTasks = mappedTasks.filter((t) => !isExpired(t))
          set({ tasks: remainingTasks, isLoading: false, isInitialized: true })
          if (expiredTasks.length > 0) {
            toast(`${expiredTasks.length} task(s) expired and auto-removed`, { duration: 3000 })
          }
        } else {
          set({ tasks: mappedTasks, isLoading: false, isInitialized: true })
        }
      } else {
        set({ isLoading: false, isInitialized: true })
      }
    } catch (err: any) {
      set({ error: err?.message || 'Failed to initialize tasks', isLoading: false, isInitialized: true })
    }
  },
  addTask: (title, status = 'todo', description, tags, dueDate, linkedHabitId, url, parentId, duration = '24h') => {
    const now = new Date().toISOString()
    const expiresAt = duration && duration !== 'none' ? computeExpiresAt(duration, now) : undefined
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
      parentId,
      duration: duration || '24h',
      createdAt: now,
      updatedAt: now,
      expiresAt,
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
      parent_id: newTask.parentId || null,
      duration: newTask.duration,
      expires_at: newTask.expiresAt || null,
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
        parent_id: updated.parentId || null,
        duration: updated.duration,
        expires_at: updated.expiresAt || null,
        created_at: updated.createdAt,
        updated_at: updated.updatedAt,
      })
    }
  },
  toggleTaskStatus: (id) => {
    const prevTask = get().tasks.find((t) => t.id === id)
    const prevStatus = prevTask?.status
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
    if (prevStatus !== 'done' && updated?.status === 'done') {
      useGamificationStore.getState().awardXP(15, `task_done_${id}`)
      if (prevTask?.dueDate && new Date(prevTask.dueDate) >= new Date()) {
        useGamificationStore.getState().awardXP(10, `early_task_${id}`)
      }
    }
  },
  moveTask: (id, targetStatus) => {
    const prevTask = get().tasks.find((t) => t.id === id)
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: targetStatus, updatedAt: new Date().toISOString() } : task
      ),
    }))
    const updated = get().tasks.find((t) => t.id === id)
    if (updated) {
      reorderTaskInDb(updated.id, updated.status, updated.order)
    }
    if (prevTask?.status !== 'done' && targetStatus === 'done') {
      useGamificationStore.getState().awardXP(15, `task_done_${id}`)
      if (prevTask?.dueDate && new Date(prevTask.dueDate) >= new Date()) {
        useGamificationStore.getState().awardXP(10, `early_task_${id}`)
      }
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
    const subTasks = get().tasks.filter((t) => t.parentId === id)
    subTasks.forEach((st) => {
      deleteTaskFromDb(st.id)
    })
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id && task.parentId !== id),
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
  getActiveTasks: () => get().tasks.filter((t) => t.status !== 'done'),
  getExpiredTasks: () => get().tasks.filter(isExpired),
  getSubTasks: (parentId) => get().tasks.filter((t) => t.parentId === parentId).sort((a, b) => a.order - b.order),
  getTodayCompletedTasks: () => {
    const todayStr = new Date().toISOString().split('T')[0]
    return get().tasks.filter((t) => t.status === 'done' && t.updatedAt.startsWith(todayStr))
  },
  getTasksByDateRange: (startDate, endDate) => {
    return get().tasks.filter((t) => {
      const d = t.updatedAt.split('T')[0]
      return d >= startDate && d <= endDate
    })
  },
}))
