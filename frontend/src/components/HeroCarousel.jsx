import React, { useState, useEffect } from 'react';
import { Download, ChevronLeft, ChevronRight, Zap, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HeroCarousel({ onOpenDownload }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "Rust-Powered Passive Tracking",
      title: "Silent activity tracking without CPU overhead",
      description: "Shodasha monitors your active Windows desktop applications every 30 seconds with minimal memory footprint (< 15 MB). Zero battery drain, zero background noise.",
      badge: "0% Cloud Telemetry",
      accent: "var(--mauve-accent)",
      metrics: [
        { label: "Memory Usage", val: "< 15 MB" },
        { label: "Polling Rate", val: "30s Auto" },
        { label: "Storage", val: "100% Local SQLite" }
      ],
      previewTitle: "Live Activity Monitor — Window Session Log",
      previewLogs: [
        { app: "Code.exe", title: "Shodasha_Productivity — Visual Studio Code", category: "Work", duration: "1h 42m", status: "Active" },
        { app: "chrome.exe", title: "Rust Documentation — standard library", category: "Work", duration: "24m", status: "Active" },
        { app: "spotify.exe", title: "Lo-Fi Beats — Spotify", category: "Neutral", duration: "45m", status: "Background" }
      ]
    },
    {
      id: 2,
      tag: "Habit Heatmaps & Calendar",
      title: "Build unbroken streaks with visual heatmaps",
      description: "Track daily habits on a visual monthly calendar grid. Complete a habit to automatically sync and complete its linked Kanban tasks.",
      badge: "1-Way Task Sync",
      accent: "var(--primary-pink-dark)",
      metrics: [
        { label: "Current Streak", val: "18 Days" },
        { label: "Monthly Completion", val: "94%" },
        { label: "Linked Tasks", val: "Auto-Finished" }
      ],
      previewTitle: "Habit Heatmap Matrix — July 2026",
      previewLogs: [
        { app: "Deep Focus (2h)", title: "22 / 24 Days Completed", category: "Streak 14", duration: "🔥 Hot", status: "Done" },
        { app: "Code Review", title: "19 / 24 Days Completed", category: "Streak 8", duration: "⚡ Active", status: "Done" },
        { app: "Read Documentation", title: "15 / 24 Days Completed", category: "Streak 5", duration: "🌱 Growing", status: "Done" }
      ]
    },
    {
      id: 3,
      tag: "Integrated Kanban Board",
      title: "Organize your workflow with offline drag-and-drop",
      description: "Manage tasks across customizable columns. Link tasks directly to your time entries and daily habits for a unified productivity workspace.",
      badge: "100% Offline Focus",
      accent: "var(--mauve-dark)",
      metrics: [
        { label: "Kanban Columns", val: "Customizable" },
        { label: "Task Linking", val: "Bi-Directional" },
        { label: "Data Safety", val: "Zero Cloud" }
      ],
      previewTitle: "Kanban Board — Focus Sprint #4",
      previewLogs: [
        { app: "Refactor Rust Tracker", title: "Optimize win32 API hook", category: "In Progress", duration: "High Priority", status: "InProgress" },
        { app: "Design Swiss Landing Page", title: "Build React components & CSS", category: "Done", duration: "Completed", status: "Done" },
        { app: "Add SQLite Migrations", title: "Store app categories locally", category: "To Do", duration: "Planned", status: "Pending" }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide];

  return (
    <section aria-label="Hero Carousel Showcase" style={{ paddingTop: '125px', paddingBottom: '70px', position: 'relative' }}>
      <div className="container">
        
        {/* Main Hero Header */}
        <header style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3.5rem' }}>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="swiss-tag">
              <Sparkles size={14} />
              <span>Compact Modern Desktop App • v0.1.6</span>
            </span>
          </div>

          <h1 style={{ marginBottom: '1.25rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.025em' }}>
            Track your desktop time and Grow with your habits
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2.2rem', lineHeight: '1.65' }}>
            Shodasha is an ultra-fast, local-first Windows application built with a high-performance <strong>Rust backend</strong>. Break down screen time, build daily habits, and manage your to-do lists with zero cloud clutter.
          </p>

          {/* Primary Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenDownload} className="btn-primary" style={{ padding: '1.05rem 2.4rem', fontSize: '1.05rem' }}>
              <Download size={20} />
              <span>Download for Windows (v0.1.6)</span>
            </button>

            <a href="#demo" className="btn-secondary" style={{ padding: '1.05rem 2.4rem', fontSize: '1.05rem' }}>
              <span>Explore Interactive Demo</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Micro Trust Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--status-success)" />
              <span>Windows 10 / 11 Native (.exe setup)</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} color="var(--mauve-accent)" />
              <span>Rust Native Binary (&lt; 15 MB RAM)</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={16} color="var(--status-info)" />
              <span>100% Offline Privacy</span>
            </span>
          </div>

        </header>

        {/* Carousel Showcase Card with Apple Glass Overlay */}
        <article 
          className="apple-glass"
          aria-label={`Carousel Slide ${currentSlide + 1}: ${activeSlide.title}`}
          style={{
            padding: '0',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '2px solid var(--border-grid-strong)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(92, 42, 71, 0.1)',
            position: 'relative'
          }}
        >
          {/* Top Carousel Navigation Bar */}
          <nav style={{
            padding: '1.25rem 2rem',
            background: 'var(--bg-blush)',
            borderBottom: '1px solid var(--border-grid-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }} aria-label="Carousel Navigation Controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                background: 'var(--mauve-dark)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.65rem',
                borderRadius: '100px'
              }}>
                Feature {currentSlide + 1} of {slides.length}
              </span>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--mauve-deep)' }}>
                {activeSlide.tag}
              </h2>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', marginRight: '1rem' }}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      width: currentSlide === idx ? '28px' : '9px',
                      height: '9px',
                      borderRadius: '100px',
                      backgroundColor: currentSlide === idx ? 'var(--mauve-accent)' : 'var(--border-grid-strong)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      border: 'none',
                      padding: 0
                    }}
                  />
                ))}
              </div>

              <button
                onClick={prevSlide}
                aria-label="Previous Carousel Slide"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-grid-strong)',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mauve-dark)'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next Carousel Slide"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-grid-strong)',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mauve-dark)'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </nav>

          {/* Slide Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            padding: '2.5rem'
          }}>
            {/* Left Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{
                color: activeSlide.accent,
                fontWeight: '700',
                fontSize: '0.88rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                {activeSlide.badge}
              </span>

              <h3 style={{ fontSize: '1.9rem', marginBottom: '1rem', color: 'var(--mauve-deep)', letterSpacing: '-0.025em' }}>
                {activeSlide.title}
              </h3>

              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.65' }}>
                {activeSlide.description}
              </p>

              {/* Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-grid)'
              }}>
                {activeSlide.metrics.map((m, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--mauve-dark)' }}>{m.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Desktop Visual Mockup Figure */}
            <figure style={{
              background: 'var(--mauve-deep)',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '1.25rem',
              color: '#ffffff',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              margin: 0
            }}>
              {/* Window Caption Header */}
              <figcaption style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-pink-light)', fontFamily: 'var(--font-mono)' }}>
                  {activeSlide.previewTitle}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a0a0a0' }}>Windows v0.1.6</div>
              </figcaption>

              {/* Logs List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeSlide.previewLogs.map((log, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff' }}>{log.app}</div>
                      <div style={{ fontSize: '0.76rem', color: '#b0a0ab' }}>{log.title}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <time style={{
                        display: 'inline-block',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: log.status === 'Done' || log.status === 'Active' ? 'rgba(46, 125, 50, 0.25)' : 'rgba(232, 160, 191, 0.2)',
                        color: log.status === 'Done' || log.status === 'Active' ? '#81c784' : 'var(--primary-pink-light)'
                      }}>
                        {log.duration}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </figure>

          </div>
        </article>

      </div>
    </section>
  );
}
