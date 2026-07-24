'use client';

import { useNotificationStore } from '@/stores/notificationStore';
import { Bell, Clock, Zap, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsSettings() {
  const {
    notificationsEnabled,
    permission,
    habitRemindersEnabled,
    habitReminderTime,
    idleAlertsEnabled,
    idleThresholdMinutes,
    dailySummaryEnabled,
    dailySummaryTime,
    requestPermission,
    setNotificationsEnabled,
    setHabitRemindersEnabled,
    setHabitReminderTime,
    setIdleAlertsEnabled,
    setIdleThresholdMinutes,
    setDailySummaryEnabled,
    setDailySummaryTime,
    sendTestNotification,
  } = useNotificationStore();

  const handleEnablePermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Notification permission granted!');
    } else {
      toast.error('Notification permission was denied in your browser/app settings.');
    }
  };

  const handleSendTest = () => {
    if (permission !== 'granted') {
      toast.error('Please grant notification permission first.');
      return;
    }
    const success = sendTestNotification();
    if (success) {
      toast.success('Test notification sent!');
    } else {
      toast.error('Failed to send test notification.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">Notifications</h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Configure Web Notifications for habit reminders, desktop idle alerts, and daily summary reports.
        </p>
      </div>

      {/* Permission Status Banner */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${
            permission === 'granted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
          }`}>
            {permission === 'granted' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">Web Notification Permission</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                permission === 'granted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {permission}
              </span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {permission === 'granted'
                ? 'Desktop notifications are active and ready to deliver alerts.'
                : 'Click button below to enable desktop notifications.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {permission !== 'granted' ? (
            <button
              onClick={handleEnablePermission}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-xs"
            >
              Grant Permission
            </button>
          ) : (
            <button
              onClick={handleSendTest}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              Send Test Notification
            </button>
          )}
        </div>
      </div>

      {/* Main Controls List */}
      <div className="space-y-4">
        {/* Habit Reminders Card */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Habit Reminders</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Receive a daily reminder notification to complete active habits.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={habitRemindersEnabled}
                onChange={(e) => setHabitRemindersEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--border)] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {habitRemindersEnabled && (
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                Reminder Time
              </span>
              <input
                type="time"
                value={habitReminderTime}
                onChange={(e) => setHabitReminderTime(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Idle Inactivity Alerts Card */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Idle Alerts</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Notify when desktop has been idle for an extended period.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={idleAlertsEnabled}
                onChange={(e) => setIdleAlertsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--border)] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {idleAlertsEnabled && (
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Inactivity Threshold</span>
              <select
                value={idleThresholdMinutes}
                onChange={(e) => setIdleThresholdMinutes(Number(e.target.value))}
                className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] font-medium focus:outline-hidden focus:border-[var(--accent)] cursor-pointer"
              >
                <option value={15} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">15 minutes</option>
                <option value={30} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">30 minutes</option>
                <option value={45} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">45 minutes</option>
                <option value={60} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">60 minutes</option>
              </select>
            </div>
          )}
        </div>

        {/* Daily Summary Notification Card */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--foreground)]">Daily Productivity Summary</h4>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Receive an end-of-day summary report of total active hours.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dailySummaryEnabled}
                onChange={(e) => setDailySummaryEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[var(--border)] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {dailySummaryEnabled && (
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Notification Trigger Time
              </span>
              <input
                type="time"
                value={dailySummaryTime}
                onChange={(e) => setDailySummaryTime(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono font-medium focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
