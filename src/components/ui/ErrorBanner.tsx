'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBannerProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorBanner({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}: ErrorBannerProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border border-[var(--error)]/20 bg-[var(--error)]/5 text-[var(--text-primary)] ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-[var(--error)] shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-[var(--error)]">{title}</h4>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all active:scale-[0.97] shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  )
}
