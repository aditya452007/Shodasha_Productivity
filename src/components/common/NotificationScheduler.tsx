'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export function NotificationScheduler() {
  const checkAndTrigger = useNotificationStore((s) => s.checkAndTriggerNotifications);

  useEffect(() => {
    checkAndTrigger();
    const id = setInterval(() => { checkAndTrigger(); }, 60_000);
    return () => clearInterval(id);
  }, [checkAndTrigger]);

  return null;
}