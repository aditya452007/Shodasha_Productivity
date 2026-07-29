import React from 'react';
import { Activity, CalendarCheck, Kanban, CheckCircle } from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      id: 'features',
      tag: "Passive Time Tracker",
      title: "Smart Windows activity tracking without manual timers",
      description: "Stop cluttering your workflow with manual stopwatch clicks. Shodasha automatically logs active foreground window sessions every 30 seconds. When your lock screen or screensaver engages, idle time is isolated automatically.",
      points: [
        "Automatic window title & process name capture",
        "30-second deduplication engine merges identical sessions",
        "Idle & lock screen auto-pause logic",
        "Categorize apps into Work, Neutral, or Distraction"
      ],
      icon: Activity,
      visualType: "time-chart"
    },
    {
      id: 'habits-tasks',
      tag: "Habits & Heatmaps",
      title: "Daily habit heatmaps with 1-way Kanban task linking",
      description: "Build lasting routines with daily check-ins rendered as GitHub-style heatmaps. Link any habit directly to a Kanban card — when you mark the habit done for the day, its corresponding task auto-completes.",
      points: [
        "Monthly calendar heatmaps with streak metrics",
        "One-click daily binary check-in (Done / Not Done)",
        "Automated 1-way Task completion trigger",
        "No forced account signups or cloud sync"
      ],
      icon: CalendarCheck,
      visualType: "habit-grid"
    },
    {
      id: 'kanban',
      tag: "Offline Kanban Board",
      title: "Full control over your daily to-do board",
      description: "Organize tasks with smooth drag-and-drop Kanban columns. Customize columns (To Do, In Progress, Done), add tags, set due dates, and track time spent per task.",
      points: [
        "Configurable columns & fluid drag-and-drop sorting",
        "Link time entries directly to active tasks",
        "Custom tags and due date tracking",
        "Indefinite offline retention in local SQLite"
      ],
      icon: Kanban,
      visualType: "kanban-preview"
    }
  ];

  return (
    <section id="features" aria-label="Product Architecture & Features" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <header style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
          <span className="swiss-tag" style={{ marginBottom: '1rem' }}>
            Product Architecture
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--mauve-deep)', letterSpacing: '-0.025em' }}>
            Designed for deep work, built for privacy
          </h2>
          <p style={{ marginTop: '0.85rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Every feature in Shodasha is focused on removing friction between tracking your screen hours and building productive habits.
          </p>
        </header>

        {/* Alternating Feature Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {featureList.map((feat, idx) => {
            const isEven = idx % 2 === 0;
            const Icon = feat.icon;

            return (
              <article 
                key={feat.id}
                id={feat.id}
                aria-label={feat.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '3.5rem',
                  alignItems: 'center',
                  padding: '2.5rem',
                  background: '#ffffff',
                  border: '2px solid var(--border-grid-strong)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(92, 42, 71, 0.06)'
                }}
              >
                {/* Left Text / Info Column */}
                <div style={{ order: isEven ? 1 : 2 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--mauve-accent)', fontWeight: '700', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    <Icon size={18} />
                    <span>{feat.tag}</span>
                  </div>

                  <h3 style={{ fontSize: '1.85rem', marginBottom: '1rem', color: 'var(--mauve-deep)', letterSpacing: '-0.025em' }}>
                    {feat.title}
                  </h3>

                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.65' }}>
                    {feat.description}
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
                    {feat.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.95rem', color: 'var(--mauve-dark)', fontWeight: '500' }}>
                        <CheckCircle size={18} color="var(--mauve-accent)" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Visual Container */}
                <div style={{ order: isEven ? 2 : 1 }}>
                  {feat.visualType === 'time-chart' && (
                    <div style={{
                      background: 'var(--bg-blush)',
                      border: '1px solid var(--border-grid-strong)',
                      borderRadius: '16px',
                      padding: '1.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--mauve-deep)' }}>Today's App Distribution</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--mauve-accent)', fontWeight: '600' }}>5h 42m Total</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                            <span>VS Code (Development)</span>
                            <span>3h 15m (57%)</span>
                          </div>
                          <div style={{ height: '8px', background: 'var(--border-grid)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '57%', height: '100%', background: 'var(--mauve-accent)' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                            <span>Browser Documentation</span>
                            <span>1h 45m (30%)</span>
                          </div>
                          <div style={{ height: '8px', background: 'var(--border-grid)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '30%', height: '100%', background: 'var(--primary-pink-dark)' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                            <span>Terminal & Cargo</span>
                            <span>42m (13%)</span>
                          </div>
                          <div style={{ height: '8px', background: 'var(--border-grid)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '13%', height: '100%', background: 'var(--mauve-dark)' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {feat.visualType === 'habit-grid' && (
                    <div style={{
                      background: 'var(--bg-blush)',
                      border: '1px solid var(--border-grid-strong)',
                      borderRadius: '16px',
                      padding: '1.5rem'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--mauve-deep)', marginBottom: '1rem' }}>
                        Habit Tracker Heatmap Grid
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                        {Array.from({ length: 28 }).map((_, i) => {
                          const isDone = i % 4 !== 1;
                          return (
                            <div 
                              key={i}
                              style={{
                                height: '34px',
                                borderRadius: '6px',
                                background: isDone ? 'var(--mauve-accent)' : 'rgba(157, 78, 124, 0.15)',
                                color: isDone ? '#ffffff' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                              }}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        22 of 28 days completed (78% Consistency)
                      </div>
                    </div>
                  )}

                  {feat.visualType === 'kanban-preview' && (
                    <div style={{
                      background: 'var(--bg-blush)',
                      border: '1px solid var(--border-grid-strong)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '1rem'
                    }}>
                      <div style={{ background: '#ffffff', border: '1px solid var(--border-grid)', borderRadius: '12px', padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--mauve-accent)', textTransform: 'uppercase' }}>In Progress</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--mauve-deep)', marginTop: '0.5rem' }}>
                          Implement SQLite Schema Migration
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                          Linked: 2h 14m tracked
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', border: '1px solid var(--border-grid)', borderRadius: '12px', padding: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--status-success)', textTransform: 'uppercase' }}>Done</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--mauve-deep)', marginTop: '0.5rem', textDecoration: 'line-through' }}>
                          Configure Windows Rust Service
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', marginTop: '0.4rem' }}>
                          Auto-completed by Habit #2
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
