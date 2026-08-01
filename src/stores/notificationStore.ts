'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isNotificationSupported,
  requestNotificationPermission,
  sendWebNotification,
  sendHabitReminderNotification,
  sendHabitScheduledReminder,
  sendIdleAlertNotification,
  sendDailySummaryNotification,
  deliverNotification,
} from '@/lib/notifications';
import { getIdleSeconds, isTauri } from '@/lib/db';
import { type DeliveryChannel } from '@/lib/openpets';
import { useHabitStore } from './habitStore';
import { useTimeEntryStore } from './timeEntryStore';
import { toast } from 'sonner';

interface NotificationState {
  notificationsEnabled: boolean;
  permission: NotificationPermission;
  habitRemindersEnabled: boolean;
  habitReminderTime: string;
  idleAlertsEnabled: boolean;
  idleThresholdMinutes: number;
  dailySummaryEnabled: boolean;
  dailySummaryTime: string;
  lastSummaryTriggerDate: string | null;
  lastHabitReminderDate: string | null;
  habitReminderNotified: Record<string, string>; // habitId -> last notified date (YYYY-MM-DD)

  petDeliveryEnabled: boolean;
  petId: string | null;
  channelHabit: DeliveryChannel;
  channelIdle: DeliveryChannel;
  channelSummary: DeliveryChannel;

  requestPermission: () => Promise<boolean>;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHabitRemindersEnabled: (enabled: boolean) => void;
  setHabitReminderTime: (time: string) => void;
  setIdleAlertsEnabled: (enabled: boolean) => void;
  setIdleThresholdMinutes: (mins: number) => void;
  setDailySummaryEnabled: (enabled: boolean) => void;
  setDailySummaryTime: (time: string) => void;
  setPetDeliveryEnabled: (enabled: boolean) => void;
  setPetId: (id: string | null) => void;
  setChannelHabit: (ch: DeliveryChannel) => void;
  setChannelIdle: (ch: DeliveryChannel) => void;
  setChannelSummary: (ch: DeliveryChannel) => void;
  sendTestNotification: () => Promise<boolean>;
  checkAndTriggerNotifications: () => Promise<void>;
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
      habitReminderNotified: {},

      petDeliveryEnabled: true,
      petId: null,
      channelHabit: 'both',
      channelIdle: 'both',
      channelSummary: 'both',

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
      setPetDeliveryEnabled: (enabled) => set({ petDeliveryEnabled: enabled }),
      setPetId: (id) => set({ petId: id }),
      setChannelHabit: (ch) => set({ channelHabit: ch }),
      setChannelIdle: (ch) => set({ channelIdle: ch }),
      setChannelSummary: (ch) => set({ channelSummary: ch }),

      sendTestNotification: async () => {
        const { channelHabit: ch, petDeliveryEnabled, petId } = get();
        const opts = { title: 'Shodasha', body: 'All systems operational. Notifications working!', tag: 'test-notification', requireInteraction: true };

        let webOk = false;
        if (ch !== 'pet') {
          webOk = await sendWebNotification(opts);
        }

        let petOk = false;
        if (petDeliveryEnabled && (ch === 'pet' || ch === 'both')) {
          try {
            petOk = await deliverNotification(opts, ch, 'test', petId ?? undefined);
          } catch {}
        }

        const results: string[] = [];
        if (webOk) results.push('Web ✅');
        else if (!isTauri() && !('Notification' in window)) results.push('Web ⛔ (not supported)');
        else results.push('Web ⛔');

        if (petOk) results.push('Pet ✅');
        else if (ch === 'web') results.push('Pet ⛔ (web-only mode)');
        else if (!petDeliveryEnabled) results.push('Pet ⛔ (disabled)');
        else if (!petId) results.push('Pet ⛔ (no pet)');
        else results.push('Pet ⛔');

        toast.success(`Test notification: ${results.join(' · ')}`);
        return webOk || petOk;
      },

      checkAndTriggerNotifications: async () => {
        const {
          notificationsEnabled,
          habitRemindersEnabled,
          habitReminderTime,
          idleAlertsEnabled,
          idleThresholdMinutes,
          dailySummaryEnabled,
          dailySummaryTime,
          lastSummaryTriggerDate,
          lastHabitReminderDate,
          petDeliveryEnabled,
          channelHabit,
          channelSummary,
          channelIdle,
          petId,
        } = get();

        if (!notificationsEnabled) return;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentHoursMins = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // Normalize stored times: strip any non-numeric suffix, accept both "20:00" and "08:00 PM"
        const normalizeTime = (t: string) => t.replace(/\s*[APap][Mm]$/, '').trim().slice(0, 5);

        // 0. Idle Alerts — query system idle time and notify if exceeded
        if (idleAlertsEnabled) {
          try {
            const idleSecs = await getIdleSeconds();
            if (idleSecs >= idleThresholdMinutes * 60) {
              const idleMins = Math.floor(idleSecs / 60);
              if (petDeliveryEnabled) {
                await deliverNotification(
                  { title: 'Heads up!', body: `You've been idle for ${idleMins} min. Take a breather or jump back in.`, tag: `idle-alert-${todayStr}` },
                  channelIdle, 'idle', petId ?? undefined,
                );
              } else {
                await sendIdleAlertNotification(idleMins);
              }
            }
          } catch (err) {
            console.warn('Idle check failed:', err);
          }
        }

        // 1. Habit Reminders
        if (habitRemindersEnabled && normalizeTime(habitReminderTime) === currentHoursMins && lastHabitReminderDate !== todayStr) {
          const habits = useHabitStore.getState().habits;
          if (habits.length > 0) {
            const habit = habits[0];
            if (petDeliveryEnabled) {
              await deliverNotification(
                { title: 'Habit Reminder', body: `Time for "${habit.name}" — keep your streak going!`, tag: `habit-reminder-${habit.name}` },
                channelHabit, 'habit', petId ?? undefined,
              );
            } else {
              await sendHabitReminderNotification(habit.name);
            }
            set({ lastHabitReminderDate: todayStr });
          }
        }

        // 1b. Per-habit scheduled reminders — including overdue catch-up for
        // windows where the laptop was off or Shodasha wasn't running.
        const { habits: allHabits, records } = useHabitStore.getState();
        const notified = get().habitReminderNotified;
        const nextNotified: Record<string, string> = { ...notified };
        let notifiedChanged = false;

        for (const habit of allHabits) {
          if (!habit.reminderTime) continue;
          const normalized = normalizeTime(habit.reminderTime);
          if (!normalized) continue;
          if (nextNotified[habit.id] === todayStr) continue;
          if (!!records[`${habit.id}_${todayStr}`]) continue;
          if (currentHoursMins < normalized) continue;

          const isOverdue = currentHoursMins !== normalized;
          const body = isOverdue
            ? `"${habit.name}" was scheduled for ${normalized} and it's now ${currentHoursMins}. Time passed — do it now or mark it complete.`
            : `It's ${normalized} — time for "${habit.name}". Keep your streak going!`;
          const tag = `habit-scheduled-${habit.id}-${todayStr}`;

          if (petDeliveryEnabled) {
            await deliverNotification({ title: 'Habit Reminder', body, tag }, channelHabit, 'habit', petId ?? undefined);
          } else {
            await sendHabitScheduledReminder(habit.name, body, tag);
          }
          nextNotified[habit.id] = todayStr;
          notifiedChanged = true;
        }

        // Prune entries for habits that were deleted
        for (const key of Object.keys(nextNotified)) {
          if (!allHabits.some((h) => h.id === key)) {
            delete nextNotified[key];
            notifiedChanged = true;
          }
        }

        if (notifiedChanged) {
          set({ habitReminderNotified: nextNotified });
        }

        // 2. Daily Summary
        if (dailySummaryEnabled && normalizeTime(dailySummaryTime) === currentHoursMins && lastSummaryTriggerDate !== todayStr) {
          const timeStore = useTimeEntryStore.getState();
          const focusSecs = timeStore.getTotalFocusSecondsToday();
          const hours = Math.round((focusSecs / 3600) * 10) / 10;
          const topApps = timeStore.getTopAppsFiltered();
          const topApp = topApps.length > 0 ? topApps[0].appName : 'Desktop Apps';

          if (petDeliveryEnabled) {
            await deliverNotification(
              { title: 'Daily Summary', body: `${hours}h tracked today. Top app: ${topApp}.`, tag: 'daily-summary' },
              channelSummary, 'summary', petId ?? undefined,
            );
          } else {
            await sendDailySummaryNotification(hours, topApp);
          }
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
        habitReminderNotified: state.habitReminderNotified,
        petDeliveryEnabled: state.petDeliveryEnabled,
        petId: state.petId,
        channelHabit: state.channelHabit,
        channelIdle: state.channelIdle,
        channelSummary: state.channelSummary,
      }),
    }
  )
);
