import React, { useState, useEffect } from 'react';
import { ArrowUp, Download } from 'lucide-react';

export default function BackToTop({ onOpenDownload }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.75rem',
      right: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      zIndex: 900,
      animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Sticky Quick Download Pill */}
      <button
        onClick={onOpenDownload}
        className="btn-primary"
        style={{
          padding: '0.7rem 1.35rem',
          fontSize: '0.88rem',
          boxShadow: '0 10px 30px rgba(157, 78, 124, 0.4)'
        }}
      >
        <Download size={16} />
        <span>Get v0.1.6</span>
      </button>

      {/* Back to Top Circle Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--border-grid-strong)',
          color: 'var(--mauve-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(92, 42, 71, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
