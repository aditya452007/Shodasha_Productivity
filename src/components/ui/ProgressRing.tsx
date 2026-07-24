'use client'

import React from 'react'

interface ProgressRingProps {
  value: number // 0 to 100
  size?: number // ring diameter in px
  strokeWidth?: number
  color?: string
  trackColor?: string
  showLabel?: boolean
  labelClassName?: string
  className?: string
}

export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = 'var(--accent)',
  trackColor = 'var(--border)',
  showLabel = true,
  labelClassName = '',
  className = '',
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transition-all duration-300"
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-600 ease-[var(--ease-out)] motion-reduce:transition-none"
        />
      </svg>
      {showLabel && (
        <span
          className={`absolute text-[11px] font-bold font-mono text-[var(--text-primary)] ${labelClassName}`}
        >
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  )
}
