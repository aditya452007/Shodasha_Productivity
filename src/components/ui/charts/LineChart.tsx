'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface CumulativeChartPoint {
  label: string // e.g. "08:00", "10:00"
  value: number // Cumulative Focus Mins (Monotonic)
  value2?: number // Cumulative Total On Mins (Monotonic)
}

interface CumulativeLineChartProps {
  data: CumulativeChartPoint[]
  height?: number
  series1Label?: string
  series2Label?: string
  series1Color?: string
  series2Color?: string
}

const formatMinutesToHours = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function LineChart({
  data,
  height = 220,
  series1Label = 'Cumulative Focus Time',
  series2Label = 'Total System On-Time',
  series1Color = 'var(--accent)',
  series2Color = 'var(--text-muted)'
}: CumulativeLineChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const width = 650
  const paddingX = 45
  const paddingY = 30

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.value, d.value2 || 0]),
    120
  )

  const stepX = (width - paddingX * 2) / (data.length - 1 || 1)

  // Series 1 (Cumulative Active Focus Mins)
  const points1 = data.map((d, i) => {
    const x = paddingX + i * stepX
    const y = height - paddingY - (d.value / maxVal) * (height - paddingY * 2)
    return { x, y, value: d.value, label: d.label }
  })

  // Series 2 (Cumulative Total System On Mins)
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
      {/* Legend & Hover Readout */}
      <div className="flex flex-wrap items-center justify-between text-xs mb-3 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full shadow-[0_0_8px_var(--accent)]" style={{ backgroundColor: series1Color }} />
            <span className="font-semibold text-[var(--text-primary)]">{series1Label}</span>
          </div>
          {series2Label && (
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: series2Color }} />
              <span className="font-medium text-[var(--text-secondary)]">{series2Label}</span>
            </div>
          )}
        </div>

        {hoveredIdx !== null ? (
          <div className="font-mono text-xs font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20 px-2.5 py-0.5 rounded-lg">
            {data[hoveredIdx].label} → {formatMinutesToHours(data[hoveredIdx].value)} Active / {formatMinutesToHours(data[hoveredIdx].value2 || 0)} Total On
          </div>
        ) : (
          <span className="text-[11px] font-mono text-[var(--text-muted)] italic">
            Monotonic accumulation throughout the day
          </span>
        )}
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="cumulativeAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series1Color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={series1Color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Horizontal Guidelines */}
          {[0, 0.33, 0.66, 1].map((pct, i) => {
            const y = paddingY + pct * (height - paddingY * 2)
            const labelVal = Math.round((1 - pct) * maxVal)
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-[var(--text-muted)]"
                >
                  {formatMinutesToHours(labelVal)}
                </text>
              </g>
            )
          })}

          {/* Gradient Fill under Active Path */}
          <path d={areaD1} fill="url(#cumulativeAreaGrad)" />

          {/* Path 2 (Total System On Time Line) */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            d={pathD2}
            fill="none"
            stroke={series2Color}
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Path 1 (Cumulative Active Screen Time Monotonic Line) */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            d={pathD1}
            fill="none"
            stroke={series1Color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive Data Nodes */}
          {points1.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 4}
                fill={series1Color}
                className="transition-all duration-200 cursor-pointer shadow-md"
              />
              <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" className="cursor-pointer" />

              {/* X Axis Timestamp Labels */}
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[var(--text-secondary)] font-semibold"
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
