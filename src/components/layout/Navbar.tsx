'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/stores/uiStore'
import GooeyTabs from '@/components/ui/gooey-tabs'
import {
  Sun,
  Moon,
  Activity,
  LayoutDashboard,
  Kanban,
  CalendarCheck,
  LineChart,
  Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'bg-emerald-600 hover:bg-emerald-700' },
  { label: 'Board', href: '/board', icon: Kanban, color: 'bg-teal-600 hover:bg-teal-700' },
  { label: 'Habits', href: '/habits', icon: CalendarCheck, color: 'bg-indigo-600 hover:bg-indigo-700' },
  { label: 'Timeline', href: '/timeline', icon: LineChart, color: 'bg-amber-600 hover:bg-amber-700' },
  { label: 'Settings', href: '/settings', icon: Settings, color: 'bg-stone-700 hover:bg-stone-800' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme, isTracking } = useUIStore()

  const activeIndex = navItems.findIndex((item) => item.href === pathname)
  const currentActiveIndex = activeIndex >= 0 ? activeIndex : 0

  const handleTabChange = (index: number) => {
    const target = navItems[index]
    if (target && target.href !== pathname) {
      router.push(target.href)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-surface)]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="font-mono text-lg font-bold tracking-tighter">十六</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
              SHODASHA
            </span>
            <span className="text-[10px] font-medium tracking-widest text-[var(--text-muted)] uppercase">
              Time & Focus
            </span>
          </div>
        </Link>

        {/* Central Gooey Tabs Navigation */}
        <div className="flex items-center justify-center">
          <GooeyTabs
            activeIndex={currentActiveIndex}
            onActiveIndexChange={handleTabChange}
            intensity={5}
            contrast={16}
            lightness={-5}
          >
            <GooeyTabs.List aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <GooeyTabs.Tab key={item.href} color={item.color} label={item.label}>
                    <GooeyTabs.Icon>
                      <Icon className="h-4 w-4" />
                    </GooeyTabs.Icon>
                    <GooeyTabs.Label>{item.label}</GooeyTabs.Label>
                  </GooeyTabs.Tab>
                )
              })}
            </GooeyTabs.List>
          </GooeyTabs>
        </div>

        {/* Right Status Indicator & Actions */}
        <div className="flex items-center gap-4">
          {/* Tracking Pulse Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-base)] px-3 py-1.5 text-xs text-[var(--text-secondary)] shadow-xs">
            <span className="relative flex h-2 w-2">
              {isTracking && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75"></span>
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isTracking ? 'bg-[var(--accent)]' : 'bg-stone-400'
                }`}
              ></span>
            </span>
            <Activity className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="font-mono text-[11px] font-medium">
              {isTracking ? 'Tracker Active' : 'Tracker Offline'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] shadow-xs"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
