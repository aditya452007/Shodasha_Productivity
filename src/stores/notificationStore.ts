'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isNotificationSupported,
  requestNotificationPermission,
  sendWebNotification,
  sendHabitReminderNotification,
  sendIdleAlertNotification,
  sendDailySummaryNotification,
} from '@/lib/notifications';
import { useHabitStore } from './habitStore';
import { useTimeEntryStore } from './timeEntryStore';

interface NotificationState {
  notificationsEnabled: boolean;
  permission: NotificationPermission;
  habitRemindersEnabled: boolean;
  habitReminderTime: string; // e.g. "20:00"
  idleAlertsEnabled: boolean;
  idleThresholdMinutes: number; // e.g. 30
  dailySummaryEnabled: boolean;
  dailySummaryTime: string; // e.g. "21:00"
  lastSummaryTriggerDate: string | null;
  lastHabitReminderDate: string | null;

  requestPermission: () => Promise<boolean>;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHabitRemindersEnabled: (enabled: boolean) => void;
  setHabitReminderTime: (time: string) => void;
  setIdleAlertsEnabled: (enabled: boolean) => void;
  setIdleThresholdMinutes: (mins: number) => void;
  setDailySummaryEnabled: (enabled: boolean) => void;
  setDailySummaryTime: (time: string) => void;
  sendTestNotification: () => boolean;
  checkAndTriggerNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notificationsEnabled: true,
      permission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default',
      habitRemindersEnabled: true,
      habitReminderTime: '20:00',
      idleAlertsEnabled: true,
      idleThresholdMinutes: 30,
      dailySummaryEnabled: true,
      dailySummaryTime: '21:00',
      lastSummaryTriggerDate: null,
      lastHabitReminderDate: null,

      requestPermission: async () => {
        const perm = await requestNotificationPermission();
        set({ permission: perm, notificationsEnabled: perm === 'granted' });
        return perm === 'granted';
      },

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setHabitRemindersEnabled: (enabled) => set({ habitRemindersEnabled: enabled }),
      setHabitReminderTime: (time) => set({ habitReminderTime: time }),
      setIdleAlertsEnabled: (enabled) => set({ idleAlertsEnabled: enabled }),
      setIdleThresholdMinutes: (mins) => set({ idleThresholdMinutes: mins }),
      setDailySummaryEnabled: (enabled) => set({ dailySummaryEnabled: enabled }),
      setDailySummaryTime: (time) => set({ dailySummaryTime: time }),

      sendTestNotification: () => {
        return sendWebNotification({
          title: 'Shodasha Productivity',
          body: 'Notifications are configured and working correctly!',
          tag: 'test-notification',
        });
      },

      checkAndTriggerNotifications: () => {
        const {
          notificationsEnabled,
          permission,
          habitRemindersEnabled,
          habitReminderTime,
          dailySummaryEnabled,
          dailySummaryTime,
          lastSummaryTriggerDate,
          lastHabitReminderDate,
        } = get();

        if (!notificationsEnabled || permission !== 'granted') return;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentHoursMins = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // 1. Check Habit Reminders
        if (habitRemindersEnabled && habitReminderTime === currentHoursMins && lastHabitReminderDate !== todayStr) {
          const habits = useHabitStore.getState().habits;
          if (habits.length > 0) {
            sendHabitReminderNotification(habits[0].name);
            set({ lastHabitReminderDate: todayStr });
          }
        }

        // 2. Check Daily Summary Notification
        if (dailySummaryEnabled && dailySummaryTime === currentHoursMins && lastSummaryTriggerDate !== todayStr) {
          const timeStore = useTimeEntryStore.getState();
          const focusSecs = timeStore.getTotalFocusSecondsToday();
          const hours = Math.round((focusSecs / 3600) * 10) / 10;
          const topApps = timeStore.getTopAppsFiltered();
          const topApp = topApps.length > 0 ? topApps[0].appName : 'Desktop Apps';

          sendDailySummaryNotification(hours, topApp);
          set({ lastSummaryTriggerDate: todayStr });
        }
      },
    }),
    {
      name: 'shodasha-notification-storage',
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
        habitRemindersEnabled: state.habitRemindersEnabled,
        habitReminderTime: state.habitReminderTime,
        idleAlertsEnabled: state.idleAlertsEnabled,
        idleThresholdMinutes: state.idleThresholdMinutes,
        dailySummaryEnabled: state.dailySummaryEnabled,
        dailySummaryTime: state.dailySummaryTime,
        lastSummaryTriggerDate: state.lastSummaryTriggerDate,
        lastHabitReminderDate: state.lastHabitReminderDate,
      }),
    }
  )
);
