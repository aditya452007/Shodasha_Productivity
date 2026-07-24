# Time Visualization UX Research: Competing Apps Analysis

## Objective
Analyze how leading desktop activity and time tracking applications (ActivityWatch, RescueTime, ManicTime, Toggl, Rize) visualize time, handle activity periods, compact idle gaps, and rank application usage to inform the Shodasha Timeline redesign.

---

## 1. App-by-App UX Breakdown

### A. ActivityWatch (Open-Source Desktop Tracker)
- **Daily Usage Visualization**: Provides a top-level daily overview showing cumulative hours active per day across the week/month via vertical bar charts.
- **Timeline / Active Periods**: Uses a horizontal bar showing continuous blocks of active usage. Long periods of inactivity (e.g., overnight 00:00 to 07:00) are omitted or visually compressed so they don't consume 30-40% of the screen width.
- **App Ranking**: Ranks top applications and categories by total duration (e.g., `VS Code: 4h 12m`, `Browser: 2h 45m`). Never displays raw session counts or micro-switches in the primary view.
- **Key Takeaway**: High-level glanceability is prioritized over session granular logs.

### B. RescueTime (Automated Time Tracker)
- **Daily Usage Visualization**: Large metric cards displaying total logged time (e.g., `6h 45m today`) alongside a 7-day bar chart showing total daily hours.
- **Timeline / Active Periods**: "Day Overview" plots active blocks along a horizontal timeline that automatically clamps or collapses non-active hours (e.g., 11 PM to 7 AM).
- **App Ranking**: Stacked horizontal bar chart sorting apps by total accumulated time, with percentage breakdowns and color-coded productivity categories.
- **Key Takeaway**: Users want to immediately know "How much did I work today and what were my main tools?" without scrolling through 500 session logs.

### C. ManicTime (Windows Native Desktop Tracker)
- **Daily Usage Visualization**: Summary tab with daily total active hours, productive vs idle time ratios.
- **Timeline / Active Periods**: Compact day timeline bar where colored blocks represent application activity, while idle gaps are compacted into faint gray narrow intervals or omitted entirely.
- **App Ranking**: Clean table/bar list ranked purely by duration (Hours:Minutes:Seconds).
- **Key Takeaway**: Gap compaction is essential for desktop usage where users turn off or sleep their machines for 8-12 hours at night.

### D. Toggl Track (Time Tracking & Reporting)
- **Daily Usage Visualization**: Minimalist daily total bar charts comparing days of the week.
- **Timeline / Active Periods**: Compact active period blocks indicating continuous work sessions.
- **App Ranking**: Visual distribution bars showing total time per project/app.
- **Key Takeaway**: Glanceability and clean visual hierarchy are paramount.

### E. Rize.io (AI Time Tracker & Productivity Assistant)
- **Daily Usage Visualization**: Prominent total active hours donut/bar metrics for the current day, week-over-week trends.
- **Timeline / Active Periods**: Fluid active period visualization showing start time, end time, and duration of active blocks, auto-hiding 0-activity hours.
- **App Ranking**: Horizontal progress bars displaying exact duration per app with icon indicators.
- **Key Takeaway**: Modern UX hides raw session timestamps under hover/expand details while keeping the primary screen focused on aggregated duration.

---

## 2. Shodasha Timeline UX Architecture Specs

Based on these industry standards and the explicit user requirements:

1. **Daily Total Usage Bar Chart**:
   - Simple 7-day or 14-day vertical bar chart showing total active desktop hours per day.
   - Highlight current day with emerald accent.
   - Quick stats: Total hours today, daily average, peak productivity day.

2. **Active Periods with Compacted Gaps**:
   - A horizontal active period timeline covering active blocks of the day (e.g., 07:00 – 12:00, 18:00 – 22:00).
   - Inactive gaps greater than 30-60 minutes (such as overnight sleep or long breaks) are visually compacted into small dashed/zigzag gap bridges (e.g. `[7:00 - 12:00] -- 6h gap -- [18:00 - 22:00]`).
   - Removes 24-hour linear waste and eliminates clutter.

3. **App Ranking by Total Hours**:
   - Ranked list / bar chart of applications sorted purely by total duration (`hours + minutes`), formatted cleanly.
   - Percentage of total daily active time per app.
   - Category badges (Work, Dev, Communication, Media, Utility).
   - No session counts, no per-minute micro logs.

---

## 3. UX Guidelines & Rules for Implementation

- **Accent**: Emerald (`#10b981` / OKLCH emerald variables).
- **Interactions**: Smooth hover effects on bars using standard CSS transition & `motion` package.
- **Accessibility**: Full support for `prefers-reduced-motion`.
- **State**: Calculate aggregated metrics inside `timeEntryStore.ts` for clean component consumption.
