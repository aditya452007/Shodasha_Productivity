import React from 'react';
import { X, Download, ShieldCheck, Cpu, HardDrive, FileCode, CheckCircle, ExternalLink } from 'lucide-react';

export default function DownloadModal({ isOpen, onClose, releaseBlobUrl }) {
  if (!isOpen) return null;

  // Exact Windows Release URL provided by the user
  const downloadUrl = releaseBlobUrl || "https://github.com/aditya452007/Shodasha_Productivity/releases/download/v0.1.6/Shodasha_0.1.0_x64-setup.exe";

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(56, 20, 41, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div 
        className="apple-glass"
        style={{
          background: '#ffffff',
          border: '1.5px solid var(--border-grid-strong)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          padding: '2.5rem',
          boxShadow: '0 24px 60px rgba(56, 20, 41, 0.2)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close download modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--mauve-light)',
            border: '1px solid var(--border-grid)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--mauve-dark)',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--mauve-accent), var(--mauve-dark))',
            color: '#ffffff',
            padding: '0.85rem',
            borderRadius: '16px',
            display: 'flex',
            boxShadow: '0 8px 20px rgba(157, 78, 124, 0.3)'
          }}>
            <Download size={28} />
          </div>
          <div>
            <h3 id="download-modal-title" style={{ fontSize: '1.6rem', color: 'var(--mauve-deep)' }}>
              Download Shodasha
            </h3>
            <span style={{ fontSize: '0.88rem', color: 'var(--mauve-accent)', fontWeight: '700' }}>
              Windows x64 Setup • Release v0.1.6 (Stable)
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Get the fast, lightweight, and offline Windows desktop time & habit tracker. Built natively in Rust with zero cloud telemetry.
        </p>

        {/* Binary Spec Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.85rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            background: 'var(--bg-blush)',
            border: '1px solid var(--border-grid)',
            borderRadius: '12px',
            padding: '0.85rem',
            textAlign: 'center'
          }}>
            <Cpu size={18} color="var(--mauve-accent)" style={{ marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend Engine</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--mauve-dark)' }}>Rust Win32</div>
          </div>
          <div style={{
            background: 'var(--bg-blush)',
            border: '1px solid var(--border-grid)',
            borderRadius: '12px',
            padding: '0.85rem',
            textAlign: 'center'
          }}>
            <HardDrive size={18} color="var(--mauve-accent)" style={{ marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RAM Overhead</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--mauve-dark)' }}>&lt; 15 MB</div>
          </div>
          <div style={{
            background: 'var(--bg-blush)',
            border: '1px solid var(--border-grid)',
            borderRadius: '12px',
            padding: '0.85rem',
            textAlign: 'center'
          }}>
            <FileCode size={18} color="var(--mauve-accent)" style={{ marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Release Tag</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--mauve-dark)' }}>v0.1.6 Setup</div>
          </div>
        </div>

        {/* Direct Download Button */}
        <a 
          href={downloadUrl}
          download="Shodasha_0.1.0_x64-setup.exe"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ width: '100%', padding: '1.05rem', fontSize: '1.05rem', marginBottom: '1.25rem' }}
        >
          <Download size={20} />
          <span>Download Shodasha_0.1.0_x64-setup.exe</span>
        </a>

        {/* Feature Check List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <CheckCircle size={16} color="var(--status-success)" />
            <span>Automatic Windows active window session logging</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <CheckCircle size={16} color="var(--status-success)" />
            <span>Habit heatmaps linked 1-way to Kanban tasks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="var(--status-success)" />
            <span>100% Offline local SQLite — Zero cloud telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
