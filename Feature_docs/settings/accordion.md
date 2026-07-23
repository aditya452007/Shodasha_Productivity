# Component: Accordion / Disclosure

- **Library**: Motion Primitives / HeroUI / COSS UI
- **URL**: https://motion-primitives.com/docs/accordion
- **Fetched by**: Sub-agent / Planning Phase

## Implementation

```tsx
'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, subtitle, icon, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-surface)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-stone-500/5 focus-visible:outline-none"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">{icon}</div>}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h4>
            {subtitle && <p className="text-xs text-[var(--text-tertiary)]">{subtitle}</p>}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          className="text-[var(--text-secondary)]"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## Evaluation & Recommendation
Motion Primitives spring accordion with smooth layout animation and chevron rotation. Clean, non-distracting spring physics.
