import React, { useEffect, useRef } from 'react';
import { Cpu, ShieldCheck, Clock, HardDrive } from 'lucide-react';
import { gsap } from 'gsap';

export default function StatsCounter() {
  const containerRef = useRef(null);

  const stats = [
    {
      icon: Cpu,
      value: "< 15 MB",
      label: "RAM Footprint",
      detail: "Ultra-lean memory consumption via native Windows C/Rust Win32 hooks"
    },
    {
      icon: ShieldCheck,
      value: "0%",
      label: "Cloud Telemetry",
      detail: "100% local SQLite database. Your data never leaves your desktop"
    },
    {
      icon: Clock,
      value: "30 sec",
      label: "Poll Resolution",
      detail: "Smart active window detection that automatically handles idle lock screens"
    },
    {
      icon: HardDrive,
      value: "0.0% CPU",
      label: "Background Idle",
      detail: "Zero CPU thrashes or background polling noise during active work sessions"
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.stats-card');
    
    // GSAP Reveal Animation
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out'
      }
    );
  }, []);

  return (
    <section id="stats" aria-label="System Performance Statistics" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Title */}
        <header style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <span className="swiss-tag" style={{ marginBottom: '1rem' }}>
            System Performance
          </span>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--mauve-deep)', letterSpacing: '-0.025em' }}>
            Engineered for minimal resource footprint
          </h2>
          <p style={{ marginTop: '0.75rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Unlike heavy browser wrappers, Shodasha is compiled down to native machine code with Rust.
          </p>
        </header>

        {/* Stats Grid */}
        <div 
          ref={containerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <article 
                key={idx}
                className="swiss-card stats-card"
                aria-label={`${stat.label}: ${stat.value}`}
                style={{
                  textAlign: 'left',
                  border: '1.5px solid var(--border-grid-strong)',
                  backgroundColor: '#ffffff',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--mauve-light)',
                  color: 'var(--mauve-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Icon size={24} />
                </div>

                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.6rem',
                  fontWeight: '700',
                  color: 'var(--mauve-dark)',
                  lineHeight: 1,
                  letterSpacing: '-0.025em',
                  marginBottom: '0.5rem'
                }}>
                  {stat.value}
                </div>

                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--mauve-deep)',
                  marginBottom: '0.4rem'
                }}>
                  {stat.label}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {stat.detail}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
