# Component: Button & Button-in-Button Trailing Icon

- **Library**: Cult UI / High-End Visual Design
- **URL**: https://www.cult-ui.com/docs/components/texture-button
- **Fetched by**: Sub-agent / Planning Phase

## Implementation

```tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'group inline-flex items-center justify-between gap-3 font-semibold rounded-full transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none'
  
  const variantStyles = {
    primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-md shadow-[var(--accent)]/20',
    secondary: 'bg-stone-900/5 dark:bg-white/10 text-[var(--text-primary)] hover:bg-stone-900/10 dark:hover:bg-white/15 ring-1 ring-stone-900/10 dark:ring-white/10',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-stone-500/10',
  }

  const sizeStyles = {
    sm: 'pl-4 pr-1.5 py-1.5 text-xs',
    md: 'pl-5 pr-2 py-2 text-sm',
    lg: 'pl-6 pr-2.5 py-2.5 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && (
        <span className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  )
}
```

## Evaluation & Recommendation
Implements our mandatory "Button-in-Button Trailing Icon" pattern from `/high-end-visual-design`. Features nested circular icon wrapper, active press scaling (`active:scale-[0.98]`), and tactile kinetic tension.
