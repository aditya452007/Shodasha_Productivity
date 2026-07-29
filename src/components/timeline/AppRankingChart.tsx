'use client';

import { useState } from 'react';
import { useTimeEntryStore, AppStatItem, CategoryType } from '@/stores/timeEntryStore';
import { Award, AppWindow, Layers, PieChart } from 'lucide-react';
import { BaseCard } from '@/components/ui/BaseCard';

export function AppRankingChart() {
  const [viewMode, setViewMode] = useState<'apps' | 'categories'>('apps');
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

  // Compute category totals
  const totalDaySeconds = appRankings.reduce((sum, item) => sum + item.totalSeconds, 0);
  const categoryTotals: Record<CategoryType, { seconds: number; appsCount: number; topApp: string }> = {
    work: { seconds: 0, appsCount: 0, topApp: '' },
    neutral: { seconds: 0, appsCount: 0, topApp: '' },
    distraction: { seconds: 0, appsCount: 0, topApp: '' },
  };

  appRankings.forEach((app) => {
    const cat = app.category;
    if (categoryTotals[cat]) {
      categoryTotals[cat].seconds += app.totalSeconds;
      categoryTotals[cat].appsCount += 1;
      if (!categoryTotals[cat].topApp) categoryTotals[cat].topApp = app.appName;
    }
  });

  const categoryList: { category: CategoryType; label: string; seconds: number; percentage: number; appsCount: number; topApp: string }[] = [
    { category: 'work', label: 'Work & Deep Focus', ...categoryTotals.work, percentage: totalDaySeconds > 0 ? Math.round((categoryTotals.work.seconds / totalDaySeconds) * 100) : 0 },
    { category: 'neutral', label: 'Neutral Tools', ...categoryTotals.neutral, percentage: totalDaySeconds > 0 ? Math.round((categoryTotals.neutral.seconds / totalDaySeconds) * 100) : 0 },
    { category: 'distraction', label: 'Distractions & Media', ...categoryTotals.distraction, percentage: totalDaySeconds > 0 ? Math.round((categoryTotals.distraction.seconds / totalDaySeconds) * 100) : 0 },
  ];

  return (
    <BaseCard elevation="raised" className="card-hover-lift" innerClassName="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Usage Breakdown</h3>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {viewMode === 'apps' ? `Ranked by app duration (${selectedDate})` : `Grouped by category totals (${selectedDate})`}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1">
          <button
            onClick={() => setViewMode('apps')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'apps'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            By App Name
          </button>
          <button
            onClick={() => setViewMode('categories')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'categories'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            By Category
          </button>
        </div>
      </div>

      {appRankings.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-[var(--border)] rounded-lg bg-[var(--background)]/50">
          <AppWindow className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
          <p className="text-xs text-[var(--muted-foreground)]">No application usage data for {selectedDate}</p>
        </div>
      ) : viewMode === 'apps' ? (
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
                      className="text-[10px] py-0.5 px-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-hidden hover:border-[var(--accent)] cursor-pointer"
                    >
                      <option value="work" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Work</option>
                      <option value="neutral" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Neutral</option>
                      <option value="distraction" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Distraction</option>
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
      ) : (
        /* Grouped by Category View */
        <div className="space-y-4">
          {categoryList.map((catItem) => {
            const catColors = getCategoryColor(catItem.category).split(' ');
            const barBg = catColors[0];
            const textColor = catColors[1];

            return (
              <div key={catItem.category} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${barBg}`} />
                    <span className="font-semibold text-[var(--foreground)]">{catItem.label}</span>
                    {catItem.appsCount > 0 && (
                      <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                        ({catItem.appsCount} {catItem.appsCount === 1 ? 'app' : 'apps'})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`font-bold ${textColor}`}>
                      {formatDuration(catItem.seconds)}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold">
                      ({catItem.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[var(--card)] border border-[var(--border)] overflow-hidden">
                  <div
                    style={{ width: `${Math.max(catItem.percentage, 2)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                  />
                </div>

                {catItem.topApp && (
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    Top App: <span className="font-medium text-[var(--foreground)]">{catItem.topApp}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </BaseCard>
  );
}
