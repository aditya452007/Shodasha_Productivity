'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTimeEntryStore, DailyUsageBar } from '@/stores/timeEntryStore';
import { BarChart2, Calendar, ArrowUpRight, ArrowDownRight, Layers, TrendingUp } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

interface DailyUsageBarChartProps {
  onSelectDate?: (dateStr: string) => void;
}

export function DailyUsageBarChart({ onSelectDate }: DailyUsageBarChartProps) {
  const [rangeDays, setRangeDays] = useState<number>(7);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [hoveredBar, setHoveredBar] = useState<DailyUsageBar | null>(null);
  const getDailyUsageHours = useTimeEntryStore((state) => state.getDailyUsageHours);
  const selectedDate = useTimeEntryStore((state) => state.selectedDate);
  const setSelectedDate = useTimeEntryStore((state) => state.setSelectedDate);
  const entries = useTimeEntryStore((state) => state.entries);

  const bars: DailyUsageBar[] = getDailyUsageHours(rangeDays);
  const prevPeriodBars: DailyUsageBar[] = getDailyUsageHours(rangeDays * 2).slice(0, rangeDays);

  const currentTotalSec = bars.reduce((acc, b) => acc + b.totalSeconds, 0);
  const prevTotalSec = prevPeriodBars.reduce((acc, b) => acc + b.totalSeconds, 0);

  const currentTotalHours = Math.round((currentTotalSec / 3600) * 10) / 10;
  const prevTotalHours = Math.round((prevTotalSec / 3600) * 10) / 10;
  const deltaHours = Math.round((currentTotalHours - prevTotalHours) * 10) / 10;
  const pctChange = prevTotalHours > 0 ? Math.round(((currentTotalHours - prevTotalHours) / prevTotalHours) * 100) : 0;

  const maxHours = Math.max(...bars.map((b) => b.totalHours), 4);

  const handleBarClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (onSelectDate) onSelectDate(dateStr);
  };

  const selectedDayData = bars.find((b) => b.date === selectedDate) || bars[bars.length - 1];

  const todayStr = new Date().toISOString().split('T')[0];

  const todaySeconds = entries
    .filter((e) => e.startTime.startsWith(todayStr) && e.endReason !== 'idle')
    .reduce((acc, e) => acc + (e.durationSeconds || 0), 0);
  const todayHours = Math.round((todaySeconds / 3600) * 10) / 10;

  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const yesterdaySeconds = entries
    .filter((e) => e.startTime.startsWith(yesterdayStr) && e.endReason !== 'idle')
    .reduce((acc, e) => acc + (e.durationSeconds || 0), 0);
  const yesterdayHours = Math.round((yesterdaySeconds / 3600) * 10) / 10;

  return (
    <BaseCard elevation="raised" className="card-hover-lift" innerClassName="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Daily Desktop Usage</h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Click any bar to see that day&apos;s activity breakdown
          </p>
        </div>

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
            <span>{showComparison ? 'Comparison On' : 'Compare'}</span>
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

      {/* Quick KPI row: Today vs Yesterday */}
      <div className="flex items-center gap-4 mb-4 p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)]">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-[var(--foreground)]">Today:</span>
            <span className="font-mono font-bold text-emerald-500">{todayHours}h</span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            <span className="font-semibold text-[var(--foreground)]">Yesterday:</span>
            <span className="font-mono font-bold text-[var(--foreground)]">{yesterdayHours}h</span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--muted-foreground)]">{rangeDays}d total:</span>
            <span className="font-mono font-semibold text-[var(--foreground)]">{currentTotalHours}h</span>
          </div>
        </div>
        {yesterdayHours > 0 && (
          <div className={`flex items-center gap-1 font-bold text-xs ml-auto ${todayHours >= yesterdayHours ? 'text-emerald-500' : 'text-rose-500'}`}>
            {todayHours >= yesterdayHours ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{todayHours >= yesterdayHours ? '+' : ''}{Math.round((todayHours - yesterdayHours) * 10) / 10}h vs yesterday</span>
          </div>
        )}
      </div>

      {/* Comparison Stats */}
      {showComparison && (
        <div className="flex items-center justify-between gap-4 mb-4 p-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--foreground)]">This {rangeDays}d: {currentTotalHours}h</span>
            <span className="text-[var(--muted-foreground)]">vs Prev {rangeDays}d: {prevTotalHours}h</span>
          </div>
          <div className={`flex items-center gap-1 font-bold ${pctChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {pctChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{pctChange >= 0 ? `+${pctChange}%` : `${pctChange}%`} ({deltaHours > 0 ? `+${deltaHours}h` : `${deltaHours}h`})</span>
          </div>
        </div>
      )}

      {bars.some((b) => b.totalHours > 0) && selectedDayData && (
        <div className="flex items-center justify-between gap-3 mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="font-medium text-[var(--foreground)]">{selectedDayData.dayLabel} ({selectedDayData.date}): </span>
              <span className="font-bold text-emerald-500">{selectedDayData.totalHours}h</span>
              <span className="text-[var(--muted-foreground)]"> active desktop time</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
            Viewing
          </span>
        </div>
      )}

      <div className="relative pt-6 pb-2">
        <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-[var(--border)]" />
          <div className="border-b border-dashed border-[var(--border)]" />
          <div className="border-b border-dashed border-[var(--border)]" />
        </div>

        <div className="flex items-end justify-between gap-2 h-44 px-2 relative z-10">
          {bars.map((bar, idx) => {
            const heightPercent = maxHours > 0 ? Math.max((bar.totalHours / maxHours) * 100, bar.totalHours > 0 ? 8 : 4) : 4;
            const isSelected = bar.date === selectedDate;
            const prevBar = prevPeriodBars[idx];
            const prevHeightPercent = prevBar && maxHours > 0 ? Math.max((prevBar.totalHours / maxHours) * 100, 2) : 0;

            return (
              <button
                key={bar.date}
                onClick={() => handleBarClick(bar.date)}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
                className="group flex-1 flex flex-col items-center h-full justify-end focus:outline-hidden cursor-pointer relative"
              >
                <span className={`text-[10px] font-semibold mb-1 transition-opacity ${
                  isSelected ? 'text-emerald-500 opacity-100' : bar.totalHours > 0 ? 'text-[var(--muted-foreground)] opacity-70 group-hover:opacity-100' : 'text-[var(--muted-foreground)] opacity-30'
                }`}>
                  {bar.totalHours > 0 ? `${bar.totalHours}h` : '-'}
                </span>

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
                        : bar.totalHours > 0
                        ? 'bg-[var(--primary)]/40 group-hover:bg-[var(--primary)]/60'
                        : 'bg-[var(--border)]/20 group-hover:bg-[var(--border)]/40'
                    }`}
                  />
                </div>

                <span className={`text-[11px] mt-2 font-medium truncate max-w-full ${
                  isSelected ? 'text-emerald-500 font-bold' : 'text-[var(--muted-foreground)]'
                }`}>
                  {bar.dayLabel.includes('Today') ? 'Today' : bar.dayLabel.split(',')[0]}
                </span>

                {/* Hover tooltip */}
                {hoveredBar === bar && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-8 z-50 bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs py-2 px-3 rounded-xl shadow-2xl border border-[var(--border)] whitespace-nowrap pointer-events-none"
                  >
                    <div className="font-bold">{bar.dayLabel}</div>
                    <div className="text-[var(--text-secondary)]">{bar.date} &middot; {bar.totalHours}h active</div>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </BaseCard>
  );
}
