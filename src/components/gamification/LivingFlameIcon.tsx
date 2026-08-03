'use client'

import type { CSSProperties } from 'react'

interface LivingFlameIconProps {
  size?: number
  className?: string
  intensity?: 'calm' | 'active' | 'blazing'
}

export function LivingFlameIcon({
  size = 32,
  className = '',
  intensity = 'active',
}: LivingFlameIconProps) {
  const isBlazing = intensity === 'blazing'

  const auraStyle = {
    width: size,
    height: size,
    animation: `flame-aura ${isBlazing ? 1.4 : 2.2}s ease-in-out infinite`,
    '--aura-peak-scale': isBlazing ? 1.25 : 1.15,
    '--aura-peak-opacity': isBlazing ? 0.9 : 0.7,
  } as CSSProperties

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Radiant Aura Glow */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500/40 via-orange-500/30 to-red-500/20 blur-md pointer-events-none"
        style={auraStyle}
      />

      {/* SVG Living Flame */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flame-sway relative z-10 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
        style={{ animationDuration: isBlazing ? '1.8s' : '2.5s' }}
      >
        <defs>
          {/* Outer Flame Gradient */}
          <linearGradient id="flameOuterGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* Inner Core Flame Gradient */}
          <linearGradient id="flameInnerGrad" x1="12" y1="8" x2="12" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Outer Flame Path */}
        <path
          className="flame-outer"
          d="M12 2C12 2 7 6.5 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 6.5 12 2 12 2Z"
          fill="url(#flameOuterGrad)"
        />

        {/* Inner Core Flame Path */}
        <path
          className="flame-inner"
          d="M12 8C12 8 9.5 10.5 9.5 13.5C9.5 15.2 10.6 16.5 12 16.5C13.4 16.5 14.5 15.2 14.5 13.5C14.5 10.5 12 8 12 8Z"
          fill="url(#flameInnerGrad)"
        />
      </svg>

      {/* Floating Spark Particle */}
      <div className="flame-spark absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-amber-300 pointer-events-none shadow-sm" />
    </div>
  )
}
