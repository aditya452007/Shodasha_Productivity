import React, { useState } from 'react';
import { LayoutDashboard, Kanban, Calendar, Clock, Settings, Plus, Check, Trash2, Sparkles, Play, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Interactive Habits state
  const [habits, setHabits] = useState([
    { id: 1, name: 'Deep Coding (2h)', done: true, streak: 14, color: '#9d4e7c' },
    { id: 2, name: 'Read Documentation', done: false, streak: 8, color: '#e8a0bf' },
    { id: 3, name: 'No Social Media', done: true, streak: 21, color: '#5c2a47' }
  ]);

  // Interactive Tasks state
  const [tasks, setTasks] = useState([
    { id: 101, title: 'Implement Rust Win32 foreground hook', column: 'in-progress', time: '1h 45m' },
    { id: 102, title: 'Build Swiss International landing page', column: 'done', time: '2h 10m' },
    { id: 103, title: 'Add SQLite auto-pruning migration', column: 'to-do', time: '0m' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.done;
          if (nextState) {
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
          }
          return { ...h, done: nextState, streak: nextState ? h.streak + 1 : h.streak - 1 };
        }
        return h;
      })
    );
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: newTaskTitle.trim(), column: 'to-do', time: '0m' }
    ]);
    setNewTaskTitle('');
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <section id="demo" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <span className="swiss-tag" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Try Shodasha Live</span>
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--mauve-deep)' }}>
            Experience the desktop app directly in your browser
          </h2>
          <p style={{ marginTop: '0.85rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Test out Shodasha's clean top tab navigation, habit check-ins, and Kanban board before installing.
          </p>
        </div>

        {/* Desktop App Frame Container */}
        <div style={{
          background: '#ffffff',
          border: '2px solid var(--border-grid-strong)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Top Window Bar */}
          <div style={{
            background: 'var(--mauve-deep)',
            color: '#ffffff',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', marginLeft: '0.75rem', color: 'var(--primary-pink-light)' }}>
                Shodasha Desktop (Fixed ~1200x800 Shell)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              Rust Engine: RUNNING (0.01% CPU)
            </div>
          </div>

          {/* Top Tab Bar Navigation */}
          <div style={{
            background: 'var(--bg-blush)',
            borderBottom: '1px solid var(--border-grid-strong)',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto'
          }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'board', label: 'Kanban Board', icon: Kanban },
              { id: 'habits', label: 'Habits', icon: Calendar },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--mauve-accent)' : 'transparent',
                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? 'var(--mauve-dark)' : 'var(--text-secondary)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <TabIcon size={17} color={isActive ? 'var(--mauve-accent)' : 'var(--text-secondary)'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Viewport */}
          <div style={{ padding: '2rem', minHeight: '380px', background: '#ffffff' }}>
            
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-blush)', border: '1px solid var(--border-grid)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today's Focus Time</div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '700', color: 'var(--mauve-deep)' }}>4h 28m</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', marginTop: '0.2rem' }}>+18% vs yesterday</div>
                  </div>
                  <div style={{ background: 'var(--bg-blush)', border: '1px solid var(--border-grid)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Habit Streak</div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '700', color: 'var(--mauve-accent)' }}>
                      {habits.filter((h) => h.done).length} / {habits.length} Done
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--mauve-dark)', marginTop: '0.2rem' }}>Active streak: 14 days</div>
                  </div>
                  <div style={{ background: 'var(--bg-blush)', border: '1px solid var(--border-grid)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kanban Progress</div>
                    <div style={{ fontSize: '2.1rem', fontWeight: '700', color: 'var(--mauve-dark)' }}>
                      {tasks.filter((t) => t.column === 'done').length} / {tasks.length} Completed
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>1 Task In Progress</div>
                  </div>
                </div>

                <div style={{ background: 'var(--mauve-light)', border: '1px solid var(--border-grid)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Play size={20} color="var(--mauve-accent)" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--mauve-deep)' }}>Active Foreground App</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Code.exe — Visual Studio Code (Shodasha_Productivity)</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--mauve-accent)', background: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '100px', border: '1px solid var(--border-grid)' }}>
                    Auto-Logging 30s
                  </span>
                </div>
              </div>
            )}

            {/* Board View */}
            {activeTab === 'board' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <form onSubmit={addTask} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Quick-add a new task to your Kanban board..."
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-grid-strong)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
                    <Plus size={16} />
                    <span>Add Task</span>
                  </button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  {['to-do', 'in-progress', 'done'].map((colKey) => (
                    <div key={colKey} style={{ background: 'var(--bg-blush)', border: '1px solid var(--border-grid)', borderRadius: '14px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--mauve-deep)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                        {colKey.replace('-', ' ')} ({tasks.filter((t) => t.column === colKey).length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {tasks.filter((t) => t.column === colKey).map((t) => (
                          <div key={t.id} style={{ background: '#ffffff', border: '1px solid var(--border-grid)', borderRadius: '10px', padding: '0.85rem', position: 'relative' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--mauve-deep)', marginBottom: '0.3rem' }}>
                              {t.title}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Logged: {t.time}</span>
                              <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Habits View */}
            {activeTab === 'habits' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--mauve-deep)', marginBottom: '1rem' }}>
                  Interactive Daily Habit Check-in (Click to Toggle)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {habits.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: '14px',
                        background: h.done ? 'var(--mauve-light)' : 'var(--bg-blush)',
                        border: '1.5px solid',
                        borderColor: h.done ? 'var(--mauve-accent)' : 'var(--border-grid)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          border: '2px solid var(--mauve-accent)',
                          background: h.done ? 'var(--mauve-accent)' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          {h.done && <Check size={16} strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--mauve-deep)' }}>{h.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Streak: {h.streak} Consecutive Days</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--mauve-dark)' }}>
                        {h.done ? '✓ Completed Today' : 'Click to Check-in'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline View */}
            {activeTab === 'timeline' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--mauve-deep)', marginBottom: '1rem' }}>
                  Hourly Windows Session Log (24-Hour View)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { time: '09:00 - 11:30', app: 'Code.exe (VS Code)', cat: 'Work', len: '2h 30m', col: 'var(--mauve-accent)' },
                    { time: '11:30 - 12:15', app: 'chrome.exe (Docs)', cat: 'Work', len: '45m', col: 'var(--primary-pink-dark)' },
                    { time: '12:15 - 13:00', app: '[IDLE] Screen Locked', cat: 'Idle', len: '45m', col: 'var(--border-grid)' },
                    { time: '13:00 - 15:45', app: 'Cargo.exe (Rust Build)', cat: 'Work', len: '2h 45m', col: 'var(--mauve-dark)' }
                  ].map((block, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-blush)', borderRadius: '10px', border: '1px solid var(--border-grid)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--mauve-deep)', minWidth: '110px' }}>{block.time}</span>
                      <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{block.app}</div>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px', backgroundColor: block.col, color: '#ffffff', fontWeight: '700' }}>
                        {block.cat} ({block.len})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--mauve-deep)', marginBottom: '1rem' }}>
                  Local Preferences & App Categorization
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-blush)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-grid)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--mauve-deep)' }}>Auto-Prune Time Entries</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatically delete logs older than 6 months</div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--mauve-accent)' }}>Enabled</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-grid)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--mauve-deep)' }}>Local SQLite Database Path</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>%APPDATA%\Shodasha\shodasha.db</div>
                    </div>
                    <ShieldAlert size={20} color="var(--mauve-accent)" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
