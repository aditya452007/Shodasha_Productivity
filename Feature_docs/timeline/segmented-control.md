# Component: Segmented Control & Category Filter Bar

- **Library**: COSS UI / Radix Toggle Group
- **URL**: https://coss.com/ui/docs/components/toggle-group
- **Fetched by**: sub-agent

## Overview

A sliding or segmented toggle control for switching time ranges (Today, 7 Days, All) and filtering by category pills (All, Deep Work, Neutral, Distraction).

## Code

```tsx
'use client'

import React from 'react'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              active
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
```

## API / Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | `SegmentedControlOption<T>[]` | `[]` | List of options |
| value | `T` | - | Currently active value |
| onChange | `(value: T) => void` | - | Callback when option changes |
