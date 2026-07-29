'use client'

import { motion, useReducedMotion } from 'framer-motion'

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
  const shouldReduceMotion = useReducedMotion()

  const isBlazing = intensity === 'blazing'

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Radiant Aura Glow */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: isBlazing ? [1, 1.25, 1] : [1, 1.15, 1],
                opacity: isBlazing ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
              }
        }
        transition={{
          duration: isBlazing ? 1.4 : 2.2,
          repeat: Infinity,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500/40 via-orange-500/30 to-red-500/20 blur-md pointer-events-none"
      />

      {/* SVG Living Flame */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.05, 0.97, 1.03, 1],
                rotate: [-1, 2, -2, 1, 0],
              }
        }
        transition={{
          duration: isBlazing ? 1.8 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
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
        <motion.path
          d="M12 2C12 2 7 6.5 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 6.5 12 2 12 2Z"
          fill="url(#flameOuterGrad)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  d: [
                    "M12 2C12 2 7 6.5 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 6.5 12 2 12 2Z",
                    "M12 2C12 2 6.5 6 6.5 11.5C6.5 14.8 9 17.2 12 17.2C15 17.2 17.5 14.8 17.5 11.5C17.5 6 12 2 12 2Z",
                    "M12 2C12 2 7.5 7 7.5 11.8C7.5 14.3 9.3 16.8 12 16.8C14.7 16.8 16.5 14.3 16.5 11.8C16.5 7 12 2 12 2Z",
                    "M12 2C12 2 7 6.5 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 6.5 12 2 12 2Z",
                  ],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner Core Flame Path */}
        <motion.path
          d="M12 8C12 8 9.5 10.5 9.5 13.5C9.5 15.2 10.6 16.5 12 16.5C13.4 16.5 14.5 15.2 14.5 13.5C14.5 10.5 12 8 12 8Z"
          fill="url(#flameInnerGrad)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.12, 0.92, 1],
                  translateY: [0, -0.5, 0.5, 0],
                }
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>

      {/* Floating Spark Particles */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{
            y: [-2, -10, -16],
            x: [0, 3, -3],
            opacity: [0, 0.8, 0],
            scale: [0.6, 1, 0.3],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.3,
          }}
          className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-amber-300 pointer-events-none shadow-sm"
        />
      )}
    </div>
  )
}
