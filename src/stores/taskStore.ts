import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
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
  addTask: (title: string, status?: 'todo' | 'in_progress' | 'done', description?: string) => void
  toggleTaskStatus: (id: string) => void
  moveTask: (id: string, targetStatus: 'todo' | 'in_progress' | 'done') => void
  deleteTask: (id: string) => void
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
  addTask: (title, status = 'todo', description) =>
    set((state) => {
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title,
        description,
        status,
        order: state.tasks.filter((t) => t.status === status).length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { tasks: [newTask, ...state.tasks] }
    }),
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
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}))
