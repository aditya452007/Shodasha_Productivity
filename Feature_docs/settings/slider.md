# Component: Slider (Range Input)

- **Library**: Smooth UI / Dice UI / HeroUI
- **URL**: https://smoothui.dev/docs/components/slider
- **Fetched by**: Sub-agent / Planning Phase

## Implementation

```tsx
'use client'

import * as React from 'react'

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (val: number) => void
  label?: string
  formatValue?: (val: number) => string
}

export function Slider({ value, min, max, step = 1, onChange, label, formatValue }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs font-medium">
        {label && <span className="text-[var(--text-secondary)]">{label}</span>}
        <span className="font-mono text-[var(--accent)] font-bold">
          {formatValue ? formatValue(value) : `${value}s`}
        </span>
      </div>
      <div className="relative flex items-center h-5 w-full touch-none select-none">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-stone-200 dark:bg-stone-800 accent-[var(--accent)] focus:outline-none"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, var(--bg-surface-elevated, #27272a) ${percentage}%, var(--bg-surface-elevated, #27272a) 100%)`
          }}
        />
      </div>
    </div>
  )
}
```

## Evaluation & Recommendation
Smooth gradient slider with live numerical badge readout. Low overhead, full keyboard accessibility, continuous feedback during dragging.
