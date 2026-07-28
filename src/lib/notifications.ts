import { toast } from 'sonner';
import { say, reactionForNotification, type DeliveryChannel, type NotificationType } from './openpets';
import { invoke } from '@tauri-apps/api/core';

let tauriNotification: typeof import('@tauri-apps/plugin-notification') | null = null;

async function getTauriNotification() {
  if (!tauriNotification) {
    try {
      tauriNotification = await import('@tauri-apps/plugin-notification');
    } catch {
      tauriNotification = null;
    }
  }
  return tauriNotification;
}

const NOTIFICATION_COOLDOWN_MS = 30_000;
const sentTags = new Map<string, number>();

function isOnCooldown(tag: string): boolean {
  const last = sentTags.get(tag);
  if (last && Date.now() - last < NOTIFICATION_COOLDOWN_MS) return true;
  sentTags.set(tag, Date.now());
  return false;
}

export interface ShodashaNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

export function isNotificationSupported(): boolean {
  return (typeof window !== 'undefined' && 'Notification' in window) || isTauriAvailable();
}

function isTauriAvailable(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  // Try Tauri notification plugin first
  if (isTauriAvailable()) {
    try {
      const notif = await getTauriNotification();
      if (notif) {
        const granted = await notif.isPermissionGranted();
        if (granted) return 'granted';
        const perm = await notif.requestPermission();
        return perm === 'granted' ? 'granted' : 'denied';
      }
    } catch (err) {
      console.warn('Tauri notification permission failed, falling back to Web API:', err);
    }
  }

  // Fallback: Web Notification API
  if (!('Notification' in window)) {
    console.warn('Web Notification API is not supported in this browser environment.');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

const autoCloseTimers = new Map<string, ReturnType<typeof setTimeout>>();

export async function sendWebNotification({ title, body, icon, tag, data, requireInteraction }: ShodashaNotificationOptions): Promise<boolean> {
  const notificationTag = tag || 'shodasha-alert';

  if (isOnCooldown(notificationTag)) return false;

  let nativeSent = false;

  // Try Tauri native notification first
  if (isTauriAvailable()) {
    try {
      const notif = await getTauriNotification();
      if (notif) {
        const granted = await notif.isPermissionGranted();
        if (granted) {
          await notif.sendNotification({ title, body, icon: icon || '/icon.png' });
          nativeSent = true;
        }
      }
    } catch (err) {
      console.warn('Tauri native notification failed, falling back to Web API:', err);
    }
  }

  // Fallback: Web Notification API
  if (!nativeSent && isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '/icon.png',
        tag: notificationTag,
        data,
        requireInteraction: requireInteraction ?? false,
      });

      notification.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
        notification.close();
      };

      const timer = setTimeout(() => {
        notification.close();
        autoCloseTimers.delete(notificationTag);
      }, 8000);
      autoCloseTimers.set(notificationTag, timer);

      nativeSent = true;
    } catch (err) {
      console.warn('Native notification failed, falling back to toast alert:', err);
    }
  } else if (!nativeSent && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }

  toast.info(title, {
    description: body,
    duration: 5000,
  });

  return nativeSent || true;
}

export async function sendHabitReminderNotification(habitName: string): Promise<boolean> {
  return sendWebNotification({
    title: 'Habit Reminder',
    body: `Time for "${habitName}" — keep your streak going!`,
    tag: `habit-reminder-${habitName}`,
  });
}

export async function sendIdleAlertNotification(idleMinutes: number): Promise<boolean> {
  return sendWebNotification({
    title: 'Heads up!',
    body: `You've been idle for ${idleMinutes} min. Take a breather or jump back in.`,
    tag: 'idle-alert',
    requireInteraction: true,
  });
}

export async function sendDailySummaryNotification(totalHours: number, topAppName: string): Promise<boolean> {
  const h = Math.round(totalHours * 10) / 10;
  return sendWebNotification({
    title: 'Daily Summary',
    body: `${h}h tracked today. Top app: ${topAppName}.`,
    tag: 'daily-summary',
  });
}

export async function sendTaskDeadlineNotification(taskTitle: string, minutesUntilDue: number): Promise<boolean> {
  const when = minutesUntilDue <= 0
    ? 'is due now!'
    : `due in ${minutesUntilDue} min`;
  return sendWebNotification({
    title: 'Task Deadline',
    body: `"${taskTitle}" ${when}`,
    tag: `task-deadline-${taskTitle}`,
    requireInteraction: true,
  });
}

export async function sendStreakNotification(habitName: string, streakDays: number): Promise<boolean> {
  return sendWebNotification({
    title: 'Streak Alert!',
    body: `${streakDays}-day streak for "${habitName}" — keep it up!`,
    tag: `streak-${habitName}`,
  });
}

export async function sendFocusGoalNotification(minutesFocused: number): Promise<boolean> {
  return sendWebNotification({
    title: 'Focus Goal Reached',
    body: `You hit ${minutesFocused} min of focused work. Great session!`,
    tag: 'focus-goal',
  });
}

export async function sendDurationElapsedNotification(taskTitle: string, durationMinutes: number): Promise<boolean> {
  return sendWebNotification({
    title: 'Time Check',
    body: `${durationMinutes} min on "${taskTitle}". Taking a break?`,
    tag: `duration-${taskTitle}`,
    requireInteraction: true,
  });
}

export async function sendPetNotification(
  body: string,
  type: NotificationType,
  petId?: string,
): Promise<boolean> {
  const petMessages: Record<NotificationType, string> = {
    habit: `⏰ ${body}`,
    idle: `💤 ${body}`,
    summary: `📊 ${body}`,
    test: `🎉 ${body}`,
    task_deadline: `⚡ ${body}`,
    streak: `🔥 ${body}`,
    focus_goal: `🎯 ${body}`,
    error: `⚠️ ${body}`,
  };
  const message = petMessages[type] || body;
  const result = await say(message, reactionForNotification(type), petId);
  return result.sent;
}

export async function deliverNotification(
  options: ShodashaNotificationOptions,
  channel: DeliveryChannel,
  type: NotificationType,
  petId?: string,
): Promise<boolean> {
  if (channel === 'silent') return false;

  let webSent = false;
  let petSent = false;

  if (channel === 'web' || channel === 'both') {
    webSent = await sendWebNotification(options);
  }
  if (channel === 'pet' || channel === 'both') {
    petSent = await sendPetNotification(options.body, type, petId);
  }

  return webSent || petSent;
}
