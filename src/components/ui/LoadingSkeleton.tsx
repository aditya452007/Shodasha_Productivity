'use client'

import React from 'react'

interface LoadingSkeletonProps {
  className?: string
  height?: string | number
  width?: string | number
  rounded?: string
}

export function LoadingSkeleton({
  className = '',
  height,
  width,
  rounded = 'rounded-xl',
}: LoadingSkeletonProps) {
  const style: React.CSSProperties = {}
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width

  return (
    <div
      style={style}
      className={`animate-pulse motion-reduce:animate-none bg-[var(--border)]/60 ${rounded} ${className}`}
      aria-hidden="true"
    />
  )
}
