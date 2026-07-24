'use client';

import { useState } from 'react';
import { useTimeEntryStore, DailyUsageBar } from '@/stores/timeEntryStore';
import { BarChart2, Calendar } from 'lucide-react';

interface DailyUsageBarChartProps {
  onSelectDate?: (dateStr: string) => void;
}

export function DailyUsageBarChart({ onSelectDate }: DailyUsageBarChartProps) {
  const [rangeDays, setRangeDays] = useState<number>(7);
  const getDailyUsageHours = useTimeEntryStore((state) => state.getDailyUsageHours);
  const selectedDate = useTimeEntryStore((state) => state.selectedDate);
  const setSelectedDate = useTimeEntryStore((state) => state.setSelectedDate);

  const bars: DailyUsageBar[] = getDailyUsageHours(rangeDays);

  const maxHours = Math.max(...bars.map((b) => b.totalHours), 8); // scale relative to max or at least 8 hours

  const handleBarClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (onSelectDate) onSelectDate(dateStr);
  };

  const selectedDayData = bars.find((b) => b.date === selectedDate) || bars[bars.length - 1];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Daily Desktop Usage</h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Total active hours per day (clamped to desktop activity)
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1 self-start sm:self-auto">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                rangeDays === days
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Summary Badge */}
      {selectedDayData && (
        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
          <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <span className="font-medium text-[var(--foreground)]">{selectedDayData.dayLabel} ({selectedDayData.date}): </span>
            <span className="font-bold text-emerald-500">{selectedDayData.totalHours} hrs</span>
            <span className="text-[var(--muted-foreground)]"> active desktop time</span>
          </div>
        </div>
      )}

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-[var(--border)]" />
          <div className="border-b border-dashed border-[var(--border)]" />
          <div className="border-b border-dashed border-[var(--border)]" />
        </div>

        {/* Bars */}
        <div className="flex items-end justify-between gap-2 h-44 px-2 relative z-10">
          {bars.map((bar) => {
            const heightPercent = maxHours > 0 ? Math.max((bar.totalHours / maxHours) * 100, 4) : 4;
            const isSelected = bar.date === selectedDate;

            return (
              <button
                key={bar.date}
                onClick={() => handleBarClick(bar.date)}
                className="group flex-1 flex flex-col items-center h-full justify-end focus:outline-hidden"
                title={`${bar.dayLabel} (${bar.date}): ${bar.totalHours} hours`}
              >
                {/* Hours Label above bar */}
                <span className={`text-[10px] font-semibold mb-1 transition-opacity ${
                  isSelected ? 'text-emerald-500 opacity-100' : 'text-[var(--muted-foreground)] opacity-70 group-hover:opacity-100'
                }`}>
                  {bar.totalHours > 0 ? `${bar.totalHours}h` : '0h'}
                </span>

                {/* Bar Element */}
                <div className="w-full max-w-[36px] flex items-end h-full justify-center">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isSelected
                        ? 'bg-emerald-500 shadow-md shadow-emerald-500/20'
                        : bar.isToday
                        ? 'bg-emerald-400/80 group-hover:bg-emerald-500'
                        : 'bg-[var(--primary)]/30 group-hover:bg-[var(--primary)]/50'
                    }`}
                  />
                </div>

                {/* Date Label under bar */}
                <span className={`text-[11px] mt-2 font-medium truncate max-w-full ${
                  isSelected ? 'text-emerald-500 font-bold' : 'text-[var(--muted-foreground)]'
                }`}>
                  {bar.dayLabel.split(',')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
