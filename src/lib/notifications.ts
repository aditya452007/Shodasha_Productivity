import { toast } from 'sonner';

export interface ShodashaNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
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

export function sendWebNotification({ title, body, icon, tag, data }: ShodashaNotificationOptions): boolean {
  let nativeSent = false;

  // Try native Web Notification if supported and granted
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '/icon.png',
        tag: tag || 'shodasha-alert',
        data,
      });

      notification.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
        notification.close();
      };

      nativeSent = true;
    } catch (err) {
      console.warn('Native notification failed, falling back to toast alert:', err);
    }
  } else if (isNotificationSupported() && Notification.permission === 'default') {
    // Attempt permission request asynchronously for next time
    Notification.requestPermission().catch(() => {});
  }

  // Always render in-app toast alert as guaranteed delivery channel
  toast.info(title, {
    description: body,
    duration: 6000,
  });

  return nativeSent || true;
}

export function sendHabitReminderNotification(habitName: string): boolean {
  return sendWebNotification({
    title: `Habit Reminder: ${habitName}`,
    body: `Time to complete your habit "${habitName}". Keep your streak alive!`,
    tag: `habit-reminder-${habitName}`,
  });
}

export function sendIdleAlertNotification(idleMinutes: number): boolean {
  return sendWebNotification({
    title: 'Idle Detection Alert',
    body: `You've been idle for ${idleMinutes} minutes. Taking a break or ready to resume?`,
    tag: 'idle-alert',
  });
}

export function sendDailySummaryNotification(totalHours: number, topAppName: string): boolean {
  return sendWebNotification({
    title: 'Daily Productivity Summary',
    body: `Today you spent ${totalHours} hours active on desktop. Most used app: ${topAppName}.`,
    tag: 'daily-summary',
  });
}
