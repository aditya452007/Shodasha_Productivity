'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Plus, Compass, Sparkles } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { toast } from 'sonner'

const AddHabitModal = dynamic(
  () => import('@/components/habits/AddHabitModal').then((m) => m.AddHabitModal),
  { ssr: false }
)

export function QuickHabitActionsWidget() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const addHabit = useHabitStore((s) => s.addHabit)

  const dayName = new Date().toLocaleDateString(undefined, { weekday: 'long' })

  const handleAddPopular = (name: string) => {
    addHabit(name, '#059669')
    toast.success(`Added habit: "${name}"`)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-[24px] bg-slate-900/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--text-primary)]">
              Happy {dayName} 👋
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Build daily consistency, track habit streaks, and celebrate growth.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAddPopular('5 AM Club / Early Rising')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-tertiary)] text-xs font-semibold text-[var(--text-primary)] transition-colors shadow-xs"
          >
            <Compass className="w-4 h-4 text-orange-500" />
            <span>Add 5 AM Routine</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Habits</span>
          </button>
        </div>
      </div>

      <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  )
}
