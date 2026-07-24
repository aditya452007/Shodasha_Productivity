import { invoke } from '@tauri-apps/api/core';

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

// Tasks IPC wrappers
export async function fetchTasksFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_tasks');
  } catch (err) {
    console.error('Failed to fetch tasks from SQLite IPC:', err);
    return null;
  }
}

export async function createTaskInDb(task: any) {
  if (!isTauri()) return;
  try {
    await invoke('create_task', { task });
  } catch (err) {
    console.error('Failed to create task in SQLite IPC:', err);
  }
}

export async function updateTaskInDb(task: any) {
  if (!isTauri()) return;
  try {
    await invoke('update_task', { task });
  } catch (err) {
    console.error('Failed to update task in SQLite IPC:', err);
  }
}

export async function deleteTaskFromDb(id: string) {
  if (!isTauri()) return;
  try {
    await invoke('delete_task', { id });
  } catch (err) {
    console.error('Failed to delete task in SQLite IPC:', err);
  }
}

export async function reorderTaskInDb(id: string, status: string, sortOrder: number) {
  if (!isTauri()) return;
  try {
    await invoke('reorder_task', { id, status, sortOrder });
  } catch (err) {
    console.error('Failed to reorder task in SQLite IPC:', err);
  }
}

// Habits IPC wrappers
export async function fetchHabitsFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_habits');
  } catch (err) {
    console.error('Failed to fetch habits from SQLite IPC:', err);
    return null;
  }
}

export async function fetchHabitRecordsFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_habit_records');
  } catch (err) {
    console.error('Failed to fetch habit records from SQLite IPC:', err);
    return null;
  }
}

export async function createHabitInDb(habit: any) {
  if (!isTauri()) return;
  try {
    await invoke('create_habit', { habit });
  } catch (err) {
    console.error('Failed to create habit in SQLite IPC:', err);
  }
}

export async function deleteHabitFromDb(id: string) {
  if (!isTauri()) return;
  try {
    await invoke('delete_habit', { id });
  } catch (err) {
    console.error('Failed to delete habit in SQLite IPC:', err);
  }
}

export async function toggleHabitRecordInDb(id: string, habitId: string, date: string, done: boolean) {
  if (!isTauri()) return;
  try {
    await invoke('toggle_habit_record', { id, habitId, date, done });
  } catch (err) {
    console.error('Failed to toggle habit record in SQLite IPC:', err);
  }
}

// Time Entries IPC wrappers
export async function fetchTimeEntriesFromDb(date: string) {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_time_entries', { date });
  } catch (err) {
    console.error('Failed to fetch time entries from SQLite IPC:', err);
    return null;
  }
}

export async function fetchTimeEntriesRangeFromDb(startDate: string, endDate: string) {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_time_entries_range', { startDate, endDate });
  } catch (err) {
    console.error('Failed to fetch time entries range from SQLite IPC:', err);
    return null;
  }
}

export async function linkTaskToTimeEntryInDb(timeEntryId: string, taskId: string | null) {
  if (!isTauri()) return;
  try {
    await invoke('link_task_to_time_entry', { timeEntryId, taskId });
  } catch (err) {
    console.error('Failed to link task to time entry in SQLite IPC:', err);
  }
}

// App Categories & Auto-start IPC wrappers
export async function fetchAppCategoriesFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<any[]>('get_app_categories');
  } catch (err) {
    console.error('Failed to fetch app categories from SQLite IPC:', err);
    return null;
  }
}

export async function setAppCategoryInDb(appName: string, category: string) {
  if (!isTauri()) return;
  try {
    await invoke('set_app_category', { appName, category });
  } catch (err) {
    console.error('Failed to set app category in SQLite IPC:', err);
  }
}

export async function setAutoStartInDb(enable: boolean) {
  if (!isTauri()) return;
  try {
    await invoke('set_auto_start', { enable });
  } catch (err) {
    console.error('Failed to set auto-start in registry via IPC:', err);
  }
}

// Exports
export async function exportTimeEntriesCsvFromDb(startDate: string, endDate: string) {
  if (!isTauri()) return null;
  try {
    return await invoke<string>('export_time_entries_csv', { startDate, endDate });
  } catch (err) {
    console.error('Failed to export time entries CSV via IPC:', err);
    return null;
  }
}

export async function exportHabitsCsvFromDb() {
  if (!isTauri()) return null;
  try {
    return await invoke<string>('export_habits_csv');
  } catch (err) {
    console.error('Failed to export habits CSV via IPC:', err);
    return null;
  }
}
