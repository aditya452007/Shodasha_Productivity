'use client'

import React from 'react'

interface StreamCardProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
}

export function StreamCard({
  children,
  className = '',
  innerClassName = '',
}: StreamCardProps) {
  return (
    <div
      className={`p-1 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10 ${className}`}
    >
      <div
        className={`rounded-[calc(2.25rem-0.25rem)] bg-[var(--bg-surface)] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
