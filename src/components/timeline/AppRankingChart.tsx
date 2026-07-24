'use client';

import { useTimeEntryStore, AppStatItem, CategoryType } from '@/stores/timeEntryStore';
import { Award, AppWindow } from 'lucide-react';

export function AppRankingChart() {
  const selectedDate = useTimeEntryStore((state) => state.selectedDate);
  const getAppRankingByHours = useTimeEntryStore((state) => state.getAppRankingByHours);
  const setCategory = useTimeEntryStore((state) => state.setCategory);

  const appRankings: AppStatItem[] = getAppRankingByHours(selectedDate, 10);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getCategoryColor = (cat: CategoryType) => {
    switch (cat) {
      case 'work':
        return 'bg-emerald-500 text-emerald-500';
      case 'distraction':
        return 'bg-rose-500 text-rose-500';
      default:
        return 'bg-blue-500 text-blue-500';
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Top Applications by Time</h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Ranked by total duration on desktop ({selectedDate})
          </p>
        </div>
      </div>

      {appRankings.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--background)]/50">
          <AppWindow className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p className="text-xs text-[var(--muted-foreground)]">No application usage data for {selectedDate}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appRankings.map((app, index) => {
            const catColors = getCategoryColor(app.category).split(' ');
            const barBg = catColors[0];
            const textColor = catColors[1];

            return (
              <div key={app.appName} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 font-medium text-[var(--foreground)] truncate max-w-[65%]">
                    <span className="w-4 text-[10px] font-bold text-[var(--muted-foreground)] text-center">
                      #{index + 1}
                    </span>
                    <span className="truncate">{app.appName}</span>
                    
                    {/* Category Selector dropdown */}
                    <select
                      value={app.category}
                      onChange={(e) => setCategory(app.appName, e.target.value as CategoryType)}
                      className="text-[10px] py-0.5 px-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] focus:outline-hidden hover:border-[var(--primary)]"
                    >
                      <option value="work">Work</option>
                      <option value="neutral">Neutral</option>
                      <option value="distraction">Distraction</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${textColor}`}>
                      {formatDuration(app.totalSeconds)}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)] w-8 text-right">
                      {app.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[var(--background)] border border-[var(--border)] overflow-hidden">
                  <div
                    style={{ width: `${Math.max(app.percentage, 2)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
