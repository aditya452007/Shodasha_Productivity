'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)]/50 ${className}`}
    >
      {Icon && (
        <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-[var(--text-tertiary)] max-w-xs mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all active:scale-[0.97] shadow-xs cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
