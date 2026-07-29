import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Layers, Calendar, BarChart3, Clock, HelpCircle, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenDownload }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features', icon: Layers },
    { name: 'Live Demo', href: '#demo', icon: BarChart3 },
    { name: 'Habits & Tasks', href: '#habits-tasks', icon: Calendar },
    { name: 'Performance', href: '#stats', icon: Clock },
    { name: 'Agency Story', href: '#agency-story', icon: Sparkles },
    { name: 'FAQ', href: '#faq', icon: HelpCircle }
  ];

  return (
    <>
      <header 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '76px',
          backgroundColor: isScrolled ? 'rgba(253, 242, 248, 0.85)' : 'rgba(253, 242, 248, 0.4)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: isScrolled ? '1px solid var(--border-grid-strong)' : '1px solid transparent',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo with Official logo.png */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }} title="Shodasha Productivity — Windows Desktop Habit & Time Tracker">
            <img 
              src="/logo.png" 
              alt="Shodasha Productivity Official Logo"
              width="42"
              height="42"
              style={{ width: '42px', height: '42px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(157, 78, 124, 0.3)' }}
            />
            <div>
              <span style={{ 
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                fontSize: '1.3rem',
                letterSpacing: '-0.025em',
                color: 'var(--mauve-deep)'
              }}>
                Shodasha
              </span>
              <span style={{
                display: 'block',
                fontSize: '0.68rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--mauve-accent)',
                marginTop: '-3px'
              }}>
                Productivity
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  transition: 'color 0.2s ease',
                  padding: '0.5rem 0'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--mauve-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Download CTA Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={onOpenDownload}
              className="btn-primary desktop-cta"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
              title="Download Shodasha Productivity v0.1.6 setup for Windows 10 & 11"
            >
              <Download size={17} />
              <span>Download v0.1.6</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-hamburger"
              aria-label="Toggle Mobile Navigation Menu"
              aria-expanded={isMobileMenuOpen}
              style={{
                background: 'var(--mauve-light)',
                border: '1px solid var(--border-grid-strong)',
                borderRadius: '10px',
                width: '42px',
                height: '42px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mauve-dark)'
              }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '76px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(253, 242, 248, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--border-grid-strong)',
            padding: '2rem 1.5rem',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'fadeInUp 0.25s ease'
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} aria-label="Mobile Navigation Menu">
            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontSize: '1.15rem',
                    fontWeight: '600',
                    color: 'var(--mauve-deep)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-grid)'
                  }}
                >
                  <IconComp size={20} color="var(--mauve-accent)" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenDownload();
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
          >
            <Download size={20} />
            <span>Download for Windows (v0.1.6)</span>
          </button>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
