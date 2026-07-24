'use client'

import React, { useEffect, useState, useRef } from 'react'

interface NumberTickerProps {
  value: number
  duration?: number // duration in ms, default 400ms
  formatter?: (val: number) => string
  className?: string
}

export function NumberTicker({
  value,
  duration = 400,
  formatter,
  className = '',
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<number>(value)
  const prevValueRef = useRef<number>(value)
  const startTimeRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplayValue(value)
      prevValueRef.current = value
      return
    }

    const startValue = prevValueRef.current
    const targetValue = value
    const change = targetValue - startValue

    if (change === 0) {
      setDisplayValue(value)
      return
    }

    startTimeRef.current = null

    // Easing cubic-bezier(0.23, 1, 0.32, 1) approximation
    const easeOutCubic = (t: number): number => {
      const p = t - 1
      return p * p * p + 1
    }

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      const currentValue = startValue + change * easedProgress
      setDisplayValue(currentValue)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        setDisplayValue(targetValue)
        prevValueRef.current = targetValue
      }
    }

    animFrameRef.current = requestAnimationFrame(step)

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [value, duration])

  const formatted = formatter ? formatter(displayValue) : Math.round(displayValue).toString()

  return <span className={className}>{formatted}</span>
}
