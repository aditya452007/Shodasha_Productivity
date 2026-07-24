'use client';

import { useState } from 'react';
import { useTimeEntryStore, DailyUsageBar } from '@/stores/timeEntryStore';
import { BarChart2, Calendar, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface DailyUsageBarChartProps {
  onSelectDate?: (dateStr: string) => void;
}

export function DailyUsageBarChart({ onSelectDate }: DailyUsageBarChartProps) {
  const [rangeDays, setRangeDays] = useState<number>(7);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const getDailyUsageHours = useTimeEntryStore((state) => state.getDailyUsageHours);
  const selectedDate = useTimeEntryStore((state) => state.selectedDate);
  const setSelectedDate = useTimeEntryStore((state) => state.setSelectedDate);

  const bars: DailyUsageBar[] = getDailyUsageHours(rangeDays);
  const prevPeriodBars: DailyUsageBar[] = getDailyUsageHours(rangeDays * 2).slice(0, rangeDays);

  const currentTotalSec = bars.reduce((acc, b) => acc + b.totalSeconds, 0);
  const prevTotalSec = prevPeriodBars.reduce((acc, b) => acc + b.totalSeconds, 0);

  const currentTotalHours = Math.round((currentTotalSec / 3600) * 10) / 10;
  const prevTotalHours = Math.round((prevTotalSec / 3600) * 10) / 10;
  const deltaHours = Math.round((currentTotalHours - prevTotalHours) * 10) / 10;
  const pctChange = prevTotalHours > 0 ? Math.round(((currentTotalHours - prevTotalHours) / prevTotalHours) * 100) : 0;

  const maxHours = Math.max(...bars.map((b) => b.totalHours), ...prevPeriodBars.map((b) => b.totalHours), 8);

  const handleBarClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (onSelectDate) onSelectDate(dateStr);
  };

  const selectedDayData = bars.find((b) => b.date === selectedDate) || bars[bars.length - 1];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Daily Desktop Usage & Inspection</h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Click any bar to auto-filter Active Periods & App Rankings for that specific day
          </p>
        </div>

        {/* Controls: Range Selector + Comparison Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              showComparison
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
            title="Toggle previous period comparison"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showComparison ? 'Comparison On' : 'Compare Period'}</span>
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1">
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
      </div>

      {/* Date Comparison Stats Bar */}
      {showComparison && (
        <div className="flex items-center justify-between gap-4 mb-4 p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--foreground)]">This {rangeDays}d Period: {currentTotalHours}h</span>
            <span className="text-[var(--muted-foreground)]">vs Prev {rangeDays}d: {prevTotalHours}h</span>
          </div>
          <div className={`flex items-center gap-1 font-bold ${pctChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {pctChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{pctChange >= 0 ? `+${pctChange}%` : `${pctChange}%`} ({deltaHours > 0 ? `+${deltaHours}h` : `${deltaHours}h`})</span>
          </div>
        </div>
      )}

      {/* Selected Day Summary Badge */}
      {selectedDayData && (
        <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="font-medium text-[var(--foreground)]">Inspecting {selectedDayData.dayLabel} ({selectedDayData.date}): </span>
              <span className="font-bold text-emerald-500">{selectedDayData.totalHours} hrs</span>
              <span className="text-[var(--muted-foreground)]"> active desktop time</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
            Selected Day Filter Active
          </span>
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
          {bars.map((bar, idx) => {
            const heightPercent = maxHours > 0 ? Math.max((bar.totalHours / maxHours) * 100, 4) : 4;
            const isSelected = bar.date === selectedDate;
            const prevBar = prevPeriodBars[idx];
            const prevHeightPercent = prevBar && maxHours > 0 ? Math.max((prevBar.totalHours / maxHours) * 100, 2) : 0;

            return (
              <button
                key={bar.date}
                onClick={() => handleBarClick(bar.date)}
                className="group flex-1 flex flex-col items-center h-full justify-end focus:outline-hidden cursor-pointer"
                title={`${bar.dayLabel} (${bar.date}): ${bar.totalHours} hours`}
              >
                {/* Hours Label above bar */}
                <span className={`text-[10px] font-semibold mb-1 transition-opacity ${
                  isSelected ? 'text-emerald-500 opacity-100' : 'text-[var(--muted-foreground)] opacity-70 group-hover:opacity-100'
                }`}>
                  {bar.totalHours > 0 ? `${bar.totalHours}h` : '0h'}
                </span>

                {/* Bar Element with comparison overlay */}
                <div className="w-full max-w-[36px] flex items-end h-full justify-center relative">
                  {showComparison && prevBar && (
                    <div
                      style={{ height: `${prevHeightPercent}%` }}
                      className="absolute bottom-0 w-full rounded-t-md bg-stone-500/20 border-t border-dashed border-stone-400"
                    />
                  )}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 relative z-10 ${
                      isSelected
                        ? 'bg-emerald-500 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400'
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
