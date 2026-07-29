'use client';

import { useNotificationStore } from '@/stores/notificationStore';
import { Bell, Clock, Zap, FileText, CheckCircle2, AlertCircle, Timer, Play, Square, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { deliverNotification, sendWebNotification } from '@/lib/notifications';
import { isTauri } from '@/lib/db';
import type { DeliveryChannel } from '@/lib/openpets';

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

  const handleSendTest = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        toast.error('Please grant notification permission first.');
        return;
      }
    }
    await sendTestNotification();
  };

  const [timerMinutes, setTimerMinutes] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMessage, setTimerMessage] = useState('');
  const [timerDisplay, setTimerDisplay] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerChannel, setTimerChannel] = useState<DeliveryChannel | 'silent'>('both');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(0);

  const clearTimerInterval = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const handleStartTimer = () => {
    const totalSecs = timerMinutes * 60 + timerSeconds;
    if (totalSecs < 1) { toast.error('Set a duration of at least 1 second.'); return; }
    clearTimerInterval();
    remainingRef.current = totalSecs;
    setTimerDisplay(formatTimer(totalSecs));
    setTimerRunning(true);
  };

  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(async () => {
      remainingRef.current -= 1;
      if (remainingRef.current <= 0) {
        clearTimerInterval();
        setTimerRunning(false);
        setTimerDisplay('00:00');
        const msg = timerMessage.trim() || `Timer finished — ${timerMinutes}m ${timerSeconds}s elapsed.`;
        const store = useNotificationStore.getState();
        const opts = { title: 'Shodasha Timer Test', body: msg, tag: `custom-timer-${Date.now()}`, requireInteraction: true };

        if (timerChannel === 'silent') {
          toast('Timer done (silent mode)', { icon: '🔇' });
          return;
        }

        let webOk = false;
        if (timerChannel !== 'pet' && store.permission === 'granted') {
          webOk = await sendWebNotification(opts);
        }

        let petOk = false;
        const petDeliveryAvailable = store.petDeliveryEnabled && store.petId && (timerChannel === 'pet' || timerChannel === 'both');
        if (petDeliveryAvailable) {
          try {
            petOk = await deliverNotification(opts, timerChannel, 'test', store.petId ?? undefined);
          } catch {}
        }

        const results: string[] = [];
        if (webOk) results.push('Web ✅');
        else if (store.permission !== 'granted' && isTauri()) results.push('Web ⛔ (Tauri: install app for native notif)');
        else if (store.permission !== 'granted') results.push('Web ⛔ (no permission)');
        else results.push('Web ❌');

        if (petOk) results.push('Pet ✅');
        else if (timerChannel === 'web') results.push('Pet ⛔ (web-only mode)');
        else if (!store.petId) results.push('Pet ⛔ (no pet selected)');
        else if (!store.petDeliveryEnabled) results.push('Pet ⛔ (pet delivery disabled)');
        else results.push('Pet ❌');

        toast.success(`Timer done — ${results.join(' · ')}`);
        if (!webOk && !petOk) {
          toast.error('Both channels failed. Install the app or check permissions.');
        }
      } else {
        setTimerDisplay(formatTimer(remainingRef.current));
      }
    }, 1000);
    return clearTimerInterval;
  }, [timerRunning, timerMinutes, timerSeconds, timerMessage]);

  const handleStopTimer = () => {
    clearTimerInterval();
    setTimerRunning(false);
    setTimerDisplay('');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

        {/* Custom Test Timer Card */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${timerRunning ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 'bg-blue-500/10 text-blue-500'}`}>
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                {timerRunning ? `Timer — ${timerDisplay}` : 'Test Timer'}
              </h4>
              <p className="text-xs text-[var(--muted-foreground)]">
                {timerRunning
                  ? 'A notification will fire when the timer reaches zero.'
                  : 'Set a custom countdown to verify notifications work end-to-end.'}
              </p>
            </div>
          </div>

          {!timerRunning && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1">Duration</label>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <input
                        type="number" min={0} max={59}
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                        className="w-10 text-center text-xs font-mono font-semibold text-[var(--foreground)] bg-transparent border-none focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-[var(--text-muted)] font-semibold">min</span>
                    </div>
                    <span className="text-[var(--text-muted)] font-mono text-xs">:</span>
                    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                      <input
                        type="number" min={0} max={59}
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                        className="w-10 text-center text-xs font-mono font-semibold text-[var(--foreground)] bg-transparent border-none focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] text-[var(--text-muted)] font-semibold">sec</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider block mb-1">Custom Message</label>
                <input
                  type="text"
                  value={timerMessage}
                  onChange={(e) => setTimerMessage(e.target.value)}
                  placeholder="e.g. Time to take a break! stretch a bit"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-shadow placeholder:text-[var(--text-muted)]/50"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Deliver via</span>
                </div>
                <select
                  value={timerChannel}
                  onChange={(e) => setTimerChannel(e.target.value as DeliveryChannel | 'silent')}
                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-xs font-medium focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="both" className="bg-[var(--card)] text-[var(--foreground)]">Both</option>
                  <option value="web" className="bg-[var(--card)] text-[var(--foreground)]">Web Only</option>
                  <option value="pet" className="bg-[var(--card)] text-[var(--foreground)]">Pet Only</option>
                  <option value="silent" className="bg-[var(--card)] text-[var(--foreground)]">Silent (no notification)</option>
                </select>
              </div>
              <button
                onClick={handleStartTimer}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" /> Start Timer
              </button>
            </div>
          )}

          {timerRunning && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-center py-4">
                <div className="text-4xl font-mono font-bold text-[var(--foreground)] tabular-nums tracking-wider">
                  {timerDisplay}
                </div>
              </div>
              {timerMessage && (
                <p className="text-xs text-center text-[var(--muted-foreground)] italic">"{timerMessage}"</p>
              )}
              <button
                onClick={handleStopTimer}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                <Square className="w-3.5 h-3.5" /> Cancel Timer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
