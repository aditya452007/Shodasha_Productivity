'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface LineChartPoint {
  label: string
  value: number // Main series (e.g. Focus Minutes)
  value2?: number // Secondary series (e.g. Idle Minutes)
}

interface LineChartProps {
  data: LineChartPoint[]
  height?: number
  series1Label?: string
  series2Label?: string
  series1Color?: string
  series2Color?: string
}

export function LineChart({
  data,
  height = 200,
  series1Label = 'Active Focus (min)',
  series2Label = 'Idle Time (min)',
  series1Color = '#059669', // Emerald
  series2Color = '#a8a29e', // Stone
}: LineChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const width = 600
  const paddingX = 40
  const paddingY = 30

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.value, d.value2 || 0]),
    60
  )

  const stepX = (width - paddingX * 2) / (data.length - 1 || 1)

  // Compute SVG Points for Series 1
  const points1 = data.map((d, i) => {
    const x = paddingX + i * stepX
    const y = height - paddingY - (d.value / maxVal) * (height - paddingY * 2)
    return { x, y, value: d.value, label: d.label }
  })

  // Compute SVG Points for Series 2 (if present)
  const points2 = data.map((d, i) => {
    const x = paddingX + i * stepX
    const y = height - paddingY - ((d.value2 || 0) / maxVal) * (height - paddingY * 2)
    return { x, y, value: d.value2 || 0, label: d.label }
  })

  const pathD1 = points1.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  )

  const areaD1 = `${pathD1} L ${points1[points1.length - 1].x} ${
    height - paddingY
  } L ${paddingX} ${height - paddingY} Z`

  const pathD2 = points2.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  )

  return (
    <div className="w-full relative">
      {/* Header / Legend */}
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: series1Color }} />
            <span className="font-medium text-[var(--text-secondary)]">{series1Label}</span>
          </div>
          {series2Label && (
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: series2Color }} />
              <span className="font-medium text-[var(--text-secondary)]">{series2Label}</span>
            </div>
          )}
        </div>

        {hoveredIdx !== null && (
          <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
            {data[hoveredIdx].label}: {data[hoveredIdx].value}m Focus / {data[hoveredIdx].value2 || 0}m Idle
          </div>
        )}
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="lineGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series1Color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={series1Color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Horizontal Guidelines */}
          {[0, 0.33, 0.66, 1].map((pct, i) => {
            const y = paddingY + pct * (height - paddingY * 2)
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            )
          })}

          {/* Gradient Fill under Path 1 */}
          <path d={areaD1} fill="url(#lineGrad1)" />

          {/* Path 2 (Secondary) */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            d={pathD2}
            fill="none"
            stroke={series2Color}
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Path 1 (Primary Smooth Line) */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            d={pathD1}
            fill="none"
            stroke={series1Color}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points1.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 4}
                fill={series1Color}
                className="transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
              />

              {/* X Axis Labels */}
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[var(--text-muted)] font-medium"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
