# Component: Search Field

- **Library**: HeroUI / Custom Search Input
- **URL**: https://www.heroui.com/en/docs/react/components/search-field
- **Fetched by**: sub-agent

## Overview

Input field for real-time filtering of timeline logs by app executable name or window title.

## Code

```tsx
'use client'

import React from 'react'
import { Search, X } from 'lucide-react'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchField({ value, onChange, placeholder = 'Search...' }: SearchFieldProps) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
```

## API / Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | Current search string |
| onChange | `(value: string) => void` | - | State update callback |
| placeholder | `string` | `'Search...'` | Input placeholder |
