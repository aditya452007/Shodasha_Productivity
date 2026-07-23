'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react'
import { useSettingsStore, ThemeMode, AccentColor } from '@/stores/settingsStore'

const accentOptions: { color: AccentColor; name: string; bg: string }[] = [
  { color: '#059669', name: 'Emerald', bg: 'bg-[#059669]' },
  { color: '#7c3aed', name: 'Violet', bg: 'bg-[#7c3aed]' },
  { color: '#d97706', name: 'Amber', bg: 'bg-[#d97706]' },
  { color: '#e11d48', name: 'Rose', bg: 'bg-[#e11d48]' },
]

const themeModes: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { mode: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
]

export function AppearanceSettings() {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useSettingsStore()

  return (
    <div className="p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10">
      <div className="rounded-[calc(2.25rem-0.5rem)] bg-[var(--bg-surface)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20">
              Visual Design & Theme
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Appearance & Aesthetic Preferences
          </h2>
          <p className="text-xs text-[var(--text-tertiary)]">
            Customize Shodasha's UI theme mode, background translucency, and active brand accent color.
          </p>
        </div>

        <div className="flex flex-col gap-5 divide-y divide-[var(--border-subtle)]">
          {/* Theme Mode Segmented Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-[var(--accent)]">
                <Palette className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Color Mode Theme
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Switch between Light, Dark, or System window theme
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              {themeModes.map(({ mode, label, icon }) => {
                const isSelected = themeMode === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setThemeMode(mode)}
                    className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSelected ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-theme-bg"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                        className="absolute inset-0 rounded-xl bg-[var(--bg-surface)] shadow-sm border border-[var(--border-subtle)]"
                      />
                    )}
                    <span className="relative z-10">{icon}</span>
                    <span className="relative z-10">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Primary Accent Color Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-stone-900/5 dark:bg-white/5 text-[var(--accent)]">
                <div className="w-4 h-4 rounded-full bg-[var(--accent)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Primary Accent Theme Color
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  Dynamically tints progress bars, active tab highlights, and visual badges
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {accentOptions.map(({ color, name, bg }) => {
                const isSelected = accentColor === color
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    title={name}
                    className={`relative w-8 h-8 rounded-full ${bg} flex items-center justify-center transition-all duration-300 active:scale-90 ${
                      isSelected ? 'ring-2 ring-offset-2 ring-[var(--text-primary)] scale-110 shadow-md' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
