'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export function NotificationScheduler() {
  const checkAndTrigger = useNotificationStore((s) => s.checkAndTriggerNotifications);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') checkAndTrigger();
    };
    tick();
    const id = setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkAndTrigger();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [checkAndTrigger]);

  return null;
}