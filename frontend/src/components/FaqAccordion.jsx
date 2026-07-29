import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How does Shodasha track active desktop time without high CPU usage?",
      a: "Shodasha's backend is natively compiled in Rust and interacts directly with the Windows Win32 API (`GetForegroundWindow()`). It polls the active foreground window title every 30 seconds and deduplicates identical sessions in memory. This eliminates background CPU polling thrashing, keeping RAM under 15 MB."
    },
    {
      q: "Is any of my activity or personal data uploaded to the cloud?",
      a: "No. Shodasha operates with 100% offline privacy. All time entries, daily habit records, and Kanban tasks are stored in a local SQLite database (`%APPDATA%\\Shodasha\\shodasha.db`). There are zero background network calls, zero telemetry scripts, and zero account logins required."
    },
    {
      q: "How does the habit-to-task auto-completion feature work?",
      a: "You can link any Kanban task to a specific habit. When you check off your daily habit in the Habit Calendar for the day, Shodasha automatically updates the status of the linked Kanban task to 'Done'. Note that this link is one-way (completing a task does not auto-check a habit)."
    },
    {
      q: "What happens when I lock my computer or step away?",
      a: "When Windows enters a lock screen, sleep state, or screensaver mode (`GetForegroundWindow()` returns NULL), Shodasha automatically closes the current time entry with `endReason = 'idle'`. Idle sessions are stored so you can see when your PC was locked, but they are excluded from your focus metrics."
    },
    {
      q: "How do I install Shodasha on Windows 10 / 11?",
      a: "Click any 'Download for Windows' button on this page to download the standalone `.exe` setup binary from our official GitHub release. Run the installer, and Shodasha will launch immediately without needing extra runtime frameworks."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // FAQPage Microdata Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <section id="faq" aria-label="Frequently Asked Questions" style={{ padding: '80px 0', position: 'relative' }}>
      {/* FAQPage Microdata Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container">
        
        {/* Section Header */}
        <header style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
          <span className="swiss-tag" style={{ marginBottom: '1rem' }}>
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--mauve-deep)', letterSpacing: '-0.025em' }}>
            Everything you need to know
          </h2>
          <p style={{ marginTop: '0.75rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Have questions about Windows support, privacy, or performance? We've got answers.
          </p>
        </header>

        {/* Accordion Container */}
        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const faqId = `faq-ans-${idx}`;
            return (
              <article 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid',
                  borderColor: isOpen ? 'var(--mauve-accent)' : 'var(--border-grid-strong)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isOpen ? '0 8px 24px rgba(92, 42, 71, 0.08)' : '0 2px 8px rgba(92, 42, 71, 0.04)'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={faqId}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    background: isOpen ? 'var(--bg-blush)' : '#ffffff',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: 'var(--mauve-deep)',
                    margin: 0
                  }}>
                    {faq.q}
                  </h3>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: 'var(--mauve-accent)',
                    display: 'flex'
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div 
                    id={faqId}
                    style={{
                      padding: '1.25rem 1.5rem 1.5rem',
                      fontSize: '1rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.65',
                      borderTop: '1px solid var(--border-grid)',
                      animation: 'fadeInUp 0.25s ease'
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Support Note */}
        <footer style={{
          textAlign: 'center',
          marginTop: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          fontSize: '0.95rem',
          color: 'var(--text-muted)'
        }}>
          <MessageSquare size={18} color="var(--mauve-accent)" />
          <span>Have a question not answered here? Visit our <a href="https://github.com/aditya452007/Shodasha_Productivity/issues" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: '600' }}>GitHub Issues</a>.</span>
        </footer>

      </div>
    </section>
  );
}
