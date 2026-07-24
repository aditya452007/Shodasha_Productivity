import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

function handleIpcError(operationName: string, err: any) {
  const message = typeof err === 'string' ? err : err?.message || 'Database operation failed';
  console.error(`Failed ${operationName}:`, err);
  toast.error(`Database Error (${operationName}): ${message}`);
}

// Tasks IPC wrappers
export async function fetchTasksFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_tasks');
  } catch (err) {
    handleIpcError('get_tasks', err);
    return null;
  }
}

export async function createTaskInDb(task: any) {
  if (!isTauri()) return;
  try {
    await invoke('create_task', { task });
  } catch (err) {
    handleIpcError('create_task', err);
  }
}

export async function updateTaskInDb(task: any) {
  if (!isTauri()) return;
  try {
    await invoke('update_task', { task });
  } catch (err) {
    handleIpcError('update_task', err);
  }
}

export async function deleteTaskFromDb(id: string) {
  if (!isTauri()) return;
  try {
    await invoke('delete_task', { id });
  } catch (err) {
    handleIpcError('delete_task', err);
  }
}

export async function reorderTaskInDb(id: string, status: string, sortOrder: number) {
  if (!isTauri()) return;
  try {
    await invoke('reorder_task', { id, status, sortOrder });
  } catch (err) {
    handleIpcError('reorder_task', err);
  }
}

// Habits IPC wrappers
export async function fetchHabitsFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_habits');
  } catch (err) {
    handleIpcError('get_habits', err);
    return null;
  }
}

export async function fetchHabitRecordsFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_habit_records');
  } catch (err) {
    handleIpcError('get_habit_records', err);
    return null;
  }
}

export async function createHabitInDb(habit: any) {
  if (!isTauri()) return;
  try {
    await invoke('create_habit', { habit });
  } catch (err) {
    handleIpcError('create_habit', err);
  }
}

export async function deleteHabitFromDb(id: string) {
  if (!isTauri()) return;
  try {
    await invoke('delete_habit', { id });
  } catch (err) {
    handleIpcError('delete_habit', err);
  }
}

export async function toggleHabitRecordInDb(id: string, habitId: string, date: string, done: boolean) {
  if (!isTauri()) return;
  try {
    await invoke('toggle_habit_record', { id, habitId, date, done });
  } catch (err) {
    handleIpcError('toggle_habit_record', err);
  }
}

// Time Entries IPC wrappers
export async function fetchTimeEntriesFromDb(date: string) {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_time_entries', { date });
  } catch (err) {
    handleIpcError('get_time_entries', err);
    return null;
  }
}

export async function fetchTimeEntriesRangeFromDb(startDate: string, endDate: string) {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_time_entries_range', { startDate, endDate });
  } catch (err) {
    handleIpcError('get_time_entries_range', err);
    return null;
  }
}

export async function linkTaskToTimeEntryInDb(timeEntryId: string, taskId: string | null) {
  if (!isTauri()) return;
  try {
    await invoke('link_task_to_time_entry', { timeEntryId, taskId });
  } catch (err) {
    handleIpcError('link_task_to_time_entry', err);
  }
}

// App Categories & Auto-start IPC wrappers
export async function fetchAppCategoriesFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_app_categories');
  } catch (err) {
    handleIpcError('get_app_categories', err);
    return null;
  }
}

export async function updateHabitInDb(habit: any) {
  if (!isTauri()) return;
  try {
    await invoke('update_habit', { habit });
  } catch (err) {
    handleIpcError('update_habit', err);
  }
}

// Kanban Columns IPC wrappers
export async function fetchKanbanColumnsFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_kanban_columns');
  } catch (err) {
    handleIpcError('get_kanban_columns', err);
    return null;
  }
}

export async function createKanbanColumnInDb(col: any) {
  if (!isTauri()) return;
  try {
    await invoke('create_kanban_column', { col });
  } catch (err) {
    handleIpcError('create_kanban_column', err);
  }
}

export async function updateKanbanColumnInDb(col: any) {
  if (!isTauri()) return;
  try {
    await invoke('update_kanban_column', { col });
  } catch (err) {
    handleIpcError('update_kanban_column', err);
  }
}

export async function deleteKanbanColumnFromDb(id: string) {
  if (!isTauri()) return;
  try {
    await invoke('delete_kanban_column', { id });
  } catch (err) {
    handleIpcError('delete_kanban_column', err);
  }
}

export async function reorderKanbanColumnsInDb(cols: any[]) {
  if (!isTauri()) return;
  try {
    await invoke('reorder_kanban_columns', { cols });
  } catch (err) {
    handleIpcError('reorder_kanban_columns', err);
  }
}

// Settings IPC wrappers
export async function fetchSettingsFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<Record<string, string>>('get_settings');
  } catch (err) {
    handleIpcError('get_settings', err);
    return null;
  }
}

export async function saveSettingsToDb(settings: Record<string, string>) {
  if (!isTauri()) return;
  try {
    await invoke('save_settings', { settings });
  } catch (err) {
    handleIpcError('save_settings', err);
  }
}

// Clear Database IPC wrapper
export async function clearDatabaseInDb() {
  if (!isTauri()) return;
  try {
    await invoke('clear_database');
  } catch (err) {
    handleIpcError('clear_database', err);
    throw err;
  }
}

export async function setAppCategoryInDb(appName: string, category: string) {
  if (!isTauri()) return;
  try {
    await invoke('set_app_category', { appName, category });
  } catch (err) {
    handleIpcError('set_app_category', err);
  }
}

export async function setAutoStartInDb(enable: boolean) {
  if (!isTauri()) return;
  try {
    await invoke('set_auto_start', { enable });
  } catch (err) {
    handleIpcError('set_auto_start', err);
  }
}

// Exports
export async function exportTimeEntriesCsvFromDb(startDate: string, endDate: string) {
  if (!isTauri()) return null;
  try {
    return await invoke<string>('export_time_entries_csv', { startDate, endDate });
  } catch (err) {
    handleIpcError('export_time_entries_csv', err);
    return null;
  }
}

export async function exportHabitsCsvFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<string>('export_habits_csv');
  } catch (err) {
    handleIpcError('export_habits_csv', err);
    return null;
  }
}
