'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface RingSlice {
  label: string
  percentage: number
  color: string
  seconds?: number
}

interface RingChartProps {
  slices: RingSlice[]
  centerLabel?: string
  centerValue?: string
  size?: number
}

export function RingChart({
  slices,
  centerLabel = 'Deep Work',
  centerValue = '65%',
  size = 180,
}: RingChartProps) {
  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let currentOffset = 0

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Ring */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Slice Arcs */}
          {slices.map((slice, i) => {
            const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -currentOffset
            currentOffset += (slice.percentage / 100) * circumference

            return (
              <motion.circle
                key={i}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            )
          })}
        </svg>

        {/* Center Text Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-mono font-extrabold text-2xl text-[var(--text-primary)] leading-none">
            {centerValue}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-secondary)] mt-1">
            {centerLabel}
          </span>
        </div>
      </div>

      {/* Slice Legend Breakdown */}
      <div className="space-y-2.5 flex-1 min-w-[160px]">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-medium text-[var(--text-primary)]">{s.label}</span>
            </div>
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {s.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
