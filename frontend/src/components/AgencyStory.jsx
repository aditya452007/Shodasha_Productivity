import React from 'react';
import { ExternalLink, Sparkles, Cpu, ShieldCheck, Zap, Layers, Code2, ArrowRight } from 'lucide-react';

export default function AgencyStory() {
  const comparisonSpecs = [
    {
      metric: "Engine & Performance",
      oldProto: "Basic script prototype (High RAM overhead)",
      newApp: "Native Rust Win32 binary (< 15 MB RAM, 0% CPU idle)",
      highlight: true
    },
    {
      metric: "Feature Suite",
      oldProto: "Standalone activity tracking",
      newApp: "Passive tracking + Habit Heatmaps + Kanban 1-Way Auto-Completion",
      highlight: true
    },
    {
      metric: "UI/UX & Design",
      oldProto: "Basic web layout",
      newApp: "Swiss International layout + Apple Glass Depth + GSAP Motion",
      highlight: true
    },
    {
      metric: "Data Privacy & Safety",
      oldProto: "Unchecked file logs",
      newApp: "100% Offline Local SQLite database — Zero Cloud Telemetry",
      highlight: true
    },
    {
      metric: "Distribution",
      oldProto: "Uncompiled source script",
      newApp: "Production-ready Windows x64 setup binary (.exe installer v0.1.6)",
      highlight: true
    }
  ];

  return (
    <section id="agency-story" aria-label="Created by Shodasha Agency" style={{ padding: '90px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <header style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="swiss-tag">
              <Sparkles size={14} />
              <span>Created by Shodasha Agency</span>
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--mauve-deep)', letterSpacing: '-0.025em' }}>
            From Prototype to Production: The Evolution of Shodasha
          </h2>

          <p style={{ marginTop: '1rem', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
            Engineered by <a href="https://shodasha.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700', textDecoration: 'underline', color: 'var(--mauve-accent)' }}>Shodasha Agency</a> — creators of custom AI software, high-performance web applications, and digital growth systems.
          </p>
        </header>

        {/* Story Banner Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {/* Agency Spotlight Card */}
          <article className="apple-glass" style={{
            padding: '2.25rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(253,242,248,0.9))',
            border: '1.5px solid var(--border-grid-strong)',
            borderRadius: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img src="/logo.png" alt="Shodasha Agency Logo" width="48" height="48" style={{ borderRadius: '12px' }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--mauve-deep)', margin: 0 }}>Shodasha Agency</h3>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--mauve-accent)', textTransform: 'uppercase' }}>Custom Software & AI Marketing</span>
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.65' }}>
              We specialize in transforming ambitious concepts into ultra-fast, production-grade applications. From AI-driven software to high-converting marketing engines, we build digital products that scale seamlessly.
            </p>

            <a 
              href="https://shodasha.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem' }}
            >
              <span>Visit Shodasha Agency</span>
              <ExternalLink size={16} />
            </a>
          </article>

          {/* Evolution Story Narrative Card */}
          <article className="swiss-card" style={{ padding: '2.25rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--mauve-accent)', fontWeight: '700', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <Code2 size={18} />
              <span>The Engineering Journey</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--mauve-deep)', marginBottom: '1rem' }}>
              Re-Engineering the Prototype
            </h3>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.65' }}>
              We took our original open-source proof-of-concept (<a href="https://github.com/aditya452007/Vibe-Artifacts/tree/main/Desktop-Time-Manager" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontWeight: '600', color: 'var(--mauve-dark)' }}>Desktop-Time-Manager</a>) and completely rebuilt it from the ground up.
            </p>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              The result is a native Rust-powered desktop suite that runs with <strong>zero battery lag</strong>, integrates daily habit heatmaps with Kanban tasks, and guarantees 100% offline privacy.
            </p>
          </article>
        </div>

        {/* Side-by-Side Comparison Matrix Table */}
        <article className="apple-glass" style={{
          padding: '2rem',
          borderRadius: '24px',
          background: '#ffffff',
          border: '2px solid var(--border-grid-strong)',
          boxShadow: '0 12px 40px rgba(92, 42, 71, 0.08)'
        }}>
          <header style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--mauve-deep)', marginBottom: '0.5rem' }}>
              Old Prototype vs. Modern Shodasha Productivity v0.1.6
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              A clear look at how our agency upgraded every layer of performance, security, and user experience.
            </p>
          </header>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-grid-strong)' }}>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Feature Axis</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Old Prototype (Desktop-Time-Manager)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--mauve-accent)', textTransform: 'uppercase' }}>Modern Shodasha (v0.1.6)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonSpecs.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-grid)' }}>
                    <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--mauve-deep)', fontSize: '0.95rem' }}>
                      {row.metric}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      {row.oldProto}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--mauve-dark)', fontSize: '0.95rem', backgroundColor: 'var(--bg-blush)' }}>
                      {row.newApp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

      </div>
    </section>
  );
}
