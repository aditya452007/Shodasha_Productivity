'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSettingsStore } from '@/stores/settingsStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { useHabitStore } from '@/stores/habitStore'
import { isTauri } from '@/lib/db'
import { CommandPalette } from '@/components/ui/CommandPalette'
import GooeyTabs from '@/components/ui/gooey-tabs'
import { LivingFlameIcon } from '@/components/gamification/LivingFlameIcon'
import {
  Sun,
  Moon,
  Search,
  LayoutDashboard,
  Kanban,
  CalendarCheck,
  LineChart,
  Settings,
  Minus,
  Square,
  X,
  Award,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Board', href: '/board', icon: Kanban },
  { label: 'Habits', href: '/habits', icon: CalendarCheck },
  { label: 'Timeline', href: '/timeline', icon: LineChart },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const themeMode = useSettingsStore((state) => state.themeMode)
  const setThemeMode = useSettingsStore((state) => state.setThemeMode)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const level = useGamificationStore((s) => s.level)

  // Compute active habit streak for navbar badge
  const habits = useHabitStore((s) => s.habits)
  const records = useHabitStore((s) => s.records)
  const todayStr = new Date().toISOString().split('T')[0]

  const streak = habits.length === 0 ? 0 : (() => {
    let count = 0
    let checkDate = new Date()
    const anyDoneToday = habits.some((h) => !!records[`${h.id}_${todayStr}`])
    if (!anyDoneToday) checkDate.setDate(checkDate.getDate() - 1)
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (habits.some((h) => !!records[`${h.id}_${dateStr}`])) {
        count++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return count
  })()

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
  }

  const activeIndex = navItems.findIndex((item) => item.href === pathname)
  const currentActiveIndex = activeIndex >= 0 ? activeIndex : 0

  const handleTabChange = (index: number) => {
    const target = navItems[index]
    if (target && target.href !== pathname) {
      router.push(target.href)
    }
  }

  const handleMinimize = async () => {
    if (isTauri()) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      const appWindow = getCurrentWindow()
      await appWindow.minimize()
    }
  }

  const handleMaximize = async () => {
    if (isTauri()) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      const appWindow = getCurrentWindow()
      await appWindow.toggleMaximize()
    }
  }

  const handleClose = async () => {
    if (isTauri()) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      const appWindow = getCurrentWindow()
      await appWindow.hide() // Minimizes/Hides to System Tray
    }
  }

  return (
    <>
    <header
      data-tauri-drag-region
      className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md transition-colors select-none"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" data-tauri-drag-region>
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] overflow-hidden shadow-xs transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Shodasha Logo" className="h-full w-full object-contain p-0.5" />
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

        {/* Central Floating Gooey Tabs Navigation */}
        <div className="flex items-center justify-center py-1">
          <GooeyTabs
            activeIndex={currentActiveIndex}
            onActiveIndexChange={handleTabChange}
            intensity={6}
            contrast={18}
            lightness={-7}
          >
            <GooeyTabs.List aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <GooeyTabs.Tab key={item.href} color="bg-[var(--accent)] hover:bg-[var(--accent-hover)]" label={item.label}>
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

        {/* Right Gamification Pills & Actions & Frameless Window Controls */}
        <div className="flex items-center gap-3">
          {/* Level Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs font-bold shadow-2xs">
            <Award className="w-3.5 h-3.5" />
            <span>Lvl {level}</span>
          </div>

          {/* Streak Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-2xs">
            <LivingFlameIcon size={16} intensity="active" />
            <span>{streak}d Streak</span>
          </div>

          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open command palette"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] shadow-xs"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Switch to light/dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] shadow-xs"
          >
            {themeMode === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* Native Window Controls (Minimize, Maximize, Close to Tray) */}
          <div className="flex items-center gap-1 pl-2 border-l border-[var(--border)]">
            <button
              onClick={handleMinimize}
              aria-label="Minimize Window"
              title="Minimize"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleMaximize}
              aria-label="Maximize Window"
              title="Maximize / Restore"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Square className="h-3 w-3" />
            </button>

            <button
              onClick={handleClose}
              aria-label="Close to System Tray"
              title="Close to System Tray"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
    <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  )
}

