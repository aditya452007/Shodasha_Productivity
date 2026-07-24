'use client';

import { useTimeEntryStore } from '@/stores/timeEntryStore';
import { Clock, Zap, Moon, Laptop } from 'lucide-react';

export function ActivePeriodsTimeline() {
  const selectedDate = useTimeEntryStore((state) => state.selectedDate);
  const getActivePeriods = useTimeEntryStore((state) => state.getActivePeriods);

  const items = getActivePeriods(selectedDate);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getCategoryBadgeClass = (cat?: string) => {
    switch (cat) {
      case 'work':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'distraction':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Active Periods</h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Continuous activity blocks with compacted inactive gaps
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] bg-[var(--background)] px-2.5 py-1 rounded-md border border-[var(--border)]">
          <Clock className="w-3.5 h-3.5" />
          <span>Date: {selectedDate}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--background)]/50">
          <Moon className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-[var(--foreground)]">No Desktop Activity Logged</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            No active windows recorded for {selectedDate}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            if (item.isGap) {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-center py-2 px-4 border border-dashed border-[var(--border)] rounded-lg bg-[var(--background)]/60 text-xs text-[var(--muted-foreground)] gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
                  <span className="font-mono text-[11px]">{item.startTime} → {item.endTime}</span>
                  <span className="font-medium text-amber-500/80">({item.durationHours}h inactive gap)</span>
                  <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:border-emerald-500/30 transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {item.startTime} – {item.endTime}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getCategoryBadgeClass(item.topAppCategory)}`}>
                        {item.topAppCategory}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-1.5">
                      <span>Primary app: <strong className="text-[var(--foreground)] font-medium">{item.topAppName}</strong></span>
                      <span>•</span>
                      <span>{item.totalEntries} focus switches</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[var(--border)]">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {formatDuration(item.durationSeconds)} active
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
