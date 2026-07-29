'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', shortcut: '1', path: '/' },
  { id: 'board', label: 'Board', shortcut: '2', path: '/board' },
  { id: 'habits', label: 'Habits', shortcut: '3', path: '/habits' },
  { id: 'timeline', label: 'Timeline', shortcut: '4', path: '/timeline' },
  { id: 'settings', label: 'Settings', shortcut: '5', path: '/settings' },
  { id: 'timer', label: 'Timer', shortcut: '6', path: '/timer' },
]

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter()

  const handleSelect = useCallback(
    (path: string) => {
      router.push(path)
      onOpenChange(false)
    },
    [router, onOpenChange]
  )

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
        return
      }
      if (mod && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault()
        const page = PAGES[parseInt(e.key) - 1]
        if (page) {
          router.push(page.path)
        }
        return
      }
      if (e.key === '?' && !open) {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange, router])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <Command className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-elevated)] shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 border-b border-[var(--border)]">
          <img src="/logo.png" alt="Shodasha Logo" className="w-5 h-5 mr-3 object-contain shrink-0" />
          <Command.Input
            placeholder="Type a command or search..."
            autoFocus
            className="w-full py-3.5 text-sm text-[var(--text-primary)] bg-transparent outline-none placeholder-[var(--text-muted)]"
          />
        </div>
        <Command.List className="max-h-72 overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-[var(--text-muted)]">
            No results found.
          </Command.Empty>
          <Command.Group heading="Pages" className="text-xs font-semibold text-[var(--text-muted)] px-2 py-1.5">
            {PAGES.map((page) => (
              <Command.Item
                key={page.id}
                value={page.label}
                onSelect={() => handleSelect(page.path)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[var(--text-primary)] cursor-pointer data-[selected=true]:bg-[var(--bg-surface-hover)]"
              >
                <span>{page.label}</span>
                <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                  ⌘{page.shortcut}
                </kbd>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
