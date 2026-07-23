import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  status: string // Column ID (e.g. 'todo', 'in_progress', 'done', or custom column id)
  order: number
  dueDate?: string
  tags?: string[]
  linkedHabitId?: string
  createdAt: string
  updatedAt: string
}

export interface KanbanColumn {
  id: string
  name: string
  order: number
}

interface TaskState {
  tasks: Task[]
  columns: KanbanColumn[]
  addTask: (title: string, status?: string, description?: string, tags?: string[], dueDate?: string, linkedHabitId?: string) => void
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

const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Review weekly focus analytics',
    description: 'Check foreground window time allocation across work vs distraction apps',
    status: 'in_progress',
    order: 0,
    tags: ['Analytics', 'Weekly'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Refactor SQLite database migrations',
    description: 'Ensure WAL mode and busy timeout handles concurrent tracker process writes',
    status: 'todo',
    order: 1,
    tags: ['Engineering'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Complete morning deep work session',
    description: 'Focus block for core architecture',
    status: 'done',
    order: 2,
    tags: ['Habit Linked'],
    linkedHabitId: 'h-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialColumns: KanbanColumn[] = [
  { id: 'todo', name: 'To Do', order: 0 },
  { id: 'in_progress', name: 'In Progress', order: 1 },
  { id: 'done', name: 'Done', order: 2 },
]

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  columns: initialColumns,
  addTask: (title, status = 'todo', description, tags, dueDate, linkedHabitId) =>
    set((state) => {
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title,
        description,
        status,
        order: state.tasks.filter((t) => t.status === status).length,
        tags: tags || [],
        dueDate,
        linkedHabitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { tasks: [newTask, ...state.tasks] }
    }),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    })),
  toggleTaskStatus: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== id) return task
        const nextStatus = task.status === 'done' ? 'todo' : 'done'
        return { ...task, status: nextStatus, updatedAt: new Date().toISOString() }
      }),
    })),
  moveTask: (id, targetStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: targetStatus, updatedAt: new Date().toISOString() } : task
      ),
    })),
  reorderTasks: (activeId, overId, newStatus) =>
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

      return { tasks }
    }),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  addColumn: (name) =>
    set((state) => {
      const newCol: KanbanColumn = {
        id: `col-${Date.now()}`,
        name,
        order: state.columns.length,
      }
      return { columns: [...state.columns, newCol] }
    }),
  renameColumn: (id, name) =>
    set((state) => ({
      columns: state.columns.map((col) => (col.id === id ? { ...col, name } : col)),
    })),
  deleteColumn: (id) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id),
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, status: 'todo' } : task)),
    })),
  reorderColumns: (activeId, overId) =>
    set((state) => {
      const columns = [...state.columns]
      const activeIndex = columns.findIndex((c) => c.id === activeId)
      const overIndex = columns.findIndex((c) => c.id === overId)
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const [activeCol] = columns.splice(activeIndex, 1)
        columns.splice(overIndex, 0, activeCol)
        // Update order property
        columns.forEach((col, index) => { col.order = index })
      }
      return { columns }
    }),
}))
