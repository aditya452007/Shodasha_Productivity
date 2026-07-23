# Component: Switch / Toggle

- **Library**: Smooth UI / Animata / HeroUI
- **URL**: https://smoothui.dev/docs/components/animated-toggle
- **Fetched by**: Sub-agent / Planning Phase

## Implementation

```tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
}

export function Switch({ checked, onCheckedChange, disabled, label, description }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer select-none group">
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{label}</span>}
          {description && <span className="text-xs text-[var(--text-tertiary)]">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          checked ? 'bg-[var(--accent)]' : 'bg-stone-200 dark:bg-stone-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}
```

## Evaluation & Recommendation
Smooth UI spring-animated toggle recommended. Uses Framer Motion layout springs for physical sliding motion, matching Apple Design principles (`bounce: 0.15, duration: 0.3`).
