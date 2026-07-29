import React from 'react';
import { Globe, Code, Shield, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border-grid-strong)',
      backgroundColor: '#ffffff',
      padding: '2rem 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        {/* Left Copyright & Shodasha Agency Spotlight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.95rem' }}>
            <span style={{ fontWeight: '700', color: 'var(--mauve-deep)', fontFamily: 'var(--font-heading)' }}>
              Shodasha Productivity
            </span>
            <small style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>© {currentYear} • MIT License.</small>
          </div>

          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} color="var(--mauve-accent)" />
            <span>Designed & Engineered by <a href="https://shodasha.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700', color: 'var(--mauve-accent)', textDecoration: 'underline' }}>Shodasha Agency</a></span>
          </div>
        </div>

        {/* Right Footer Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} aria-label="Footer Navigation">
          <a
            href="https://shodasha.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Shodasha Agency Website"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '600', color: 'var(--mauve-accent)' }}
          >
            <ExternalLink size={16} />
            <span>Shodasha Agency</span>
          </a>

          <a
            href="https://github.com/aditya452007/Shodasha_Productivity"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Source Code Repository"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: '600', color: 'var(--mauve-dark)' }}
          >
            <Code size={18} />
            <span>GitHub</span>
          </a>

          <a
            href="https://github.com/aditya452007/Vibe-Artifacts/tree/main/Desktop-Time-Manager"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Previous Prototype Repository"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}
          >
            <span>Old Prototype</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
