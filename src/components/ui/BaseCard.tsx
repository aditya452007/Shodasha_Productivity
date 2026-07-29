'use client'

import React from 'react'
import { motion, type TargetAndTransition, type Transition } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { LucideIcon } from 'lucide-react'

type ElevationTier = 'flat' | 'raised' | 'elevated'

interface BaseCardProps {
  children?: React.ReactNode
  elevation?: ElevationTier
  className?: string
  innerClassName?: string

  /* Loading state */
  isLoading?: boolean
  skeletonHeight?: string | number
  skeletonLines?: number

  /* Empty state */
  isEmpty?: boolean
  emptyIcon?: LucideIcon
  emptyTitle?: string
  emptyDescription?: string
  emptyActionLabel?: string
  onEmptyAction?: () => void

  /* Error state */
  hasError?: boolean | string
  errorTitle?: string
  onRetry?: () => void

  /* Animation overrides */
  initial?: TargetAndTransition
  animate?: TargetAndTransition
  transition?: Transition
}

const elevationClass: Record<ElevationTier, string> = {
  flat: 'card-flat',
  raised: 'card-raised',
  elevated: 'card-elevated',
}

const defaultInitial = { opacity: 0, y: 12 }
const defaultAnimate = { opacity: 1, y: 0 }
const defaultTransition = {
  duration: 0.35,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
}

export function BaseCard({
  children,
  elevation = 'raised',
  className,
  innerClassName,
  isLoading,
  skeletonHeight,
  skeletonLines = 3,
  isEmpty,
  emptyIcon,
  emptyTitle = 'No data',
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  hasError,
  errorTitle = 'Something went wrong',
  onRetry,
  initial,
  animate,
  transition,
}: BaseCardProps) {
  const errorMessage = typeof hasError === 'string' ? hasError : undefined

  const content = (() => {
    if (isLoading) {
      return (
        <div className={cn('flex flex-col gap-3 p-5', innerClassName)}>
          {Array.from({ length: skeletonLines }).map((_, i) => (
            <LoadingSkeleton
              key={i}
              height={skeletonHeight ?? (i === 0 ? 20 : 14)}
              width={i === 0 ? '40%' : i === skeletonLines - 1 ? '60%' : '100%'}
            />
          ))}
        </div>
      )
    }

    if (hasError) {
      return (
        <div className={cn('p-5', innerClassName)}>
          <ErrorBanner
            title={errorTitle}
            message={errorMessage || 'An unexpected error occurred while loading this content.'}
            onRetry={onRetry}
          />
        </div>
      )
    }

    if (isEmpty) {
      return (
        <div className={cn('p-5', innerClassName)}>
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        </div>
      )
    }

    return (
      <div className={cn('p-5', innerClassName)}>
        {children}
      </div>
    )
  })()

  return (
    <motion.div
      initial={initial ?? defaultInitial}
      animate={animate ?? defaultAnimate}
      transition={transition ?? defaultTransition}
      className={cn(elevationClass[elevation], className)}
    >
      {content}
    </motion.div>
  )
}
