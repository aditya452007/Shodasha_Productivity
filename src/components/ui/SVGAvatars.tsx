'use client'

import React from 'react'

export function UserAvatarSVG({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="48" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />
      {/* Hair */}
      <path d="M25 45C25 25 35 15 50 15C65 15 75 25 75 45C75 48 72 50 70 50C65 50 60 45 50 45C40 45 35 50 30 50C28 50 25 48 25 45Z" fill="#0F172A" />
      {/* Face */}
      <circle cx="50" cy="55" r="28" fill="#FDE68A" />
      {/* Eyes */}
      <circle cx="40" cy="52" r="3.5" fill="#0F172A" />
      <circle cx="60" cy="52" r="3.5" fill="#0F172A" />
      {/* Glasses */}
      <rect x="32" y="46" width="16" height="12" rx="3" stroke="#0F172A" strokeWidth="3" fill="none" />
      <rect x="52" y="46" width="16" height="12" rx="3" stroke="#0F172A" strokeWidth="3" fill="none" />
      <line x1="48" y1="52" x2="52" y2="52" stroke="#0F172A" strokeWidth="3" />
      {/* Smile */}
      <path d="M42 66C42 66 46 70 50 70C54 70 58 66 58 66" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function HabitDoodleSVG({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 10L62 35L90 38L68 57L74 85L50 70L26 85L32 57L10 38L38 35L50 10Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="50" cy="48" r="6" fill="#0F172A" />
      <path d="M40 60C40 60 45 64 50 64C55 64 60 60 60 60" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function FocusDoodleSVG({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="40" fill="#DCFCE7" stroke="#16A34A" strokeWidth="4" />
      <path d="M50 22V50L68 62" stroke="#15803D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="4" fill="#15803D" />
    </svg>
  )
}

export function WeatherDoodleSVG({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="22" fill="#FDE047" stroke="#CA8A04" strokeWidth="4" />
      <path d="M30 65C22 65 16 59 16 51C16 44 22 38 29 38C31 32 37 28 44 28C53 28 60 35 60 44C66 44 72 49 72 56C72 63 66 65 60 65H30Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}

export function MusicDoodleSVG({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="15" y="20" width="70" height="60" rx="16" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />
      <circle cx="38" cy="50" r="16" fill="#0F172A" />
      <circle cx="38" cy="50" r="5" fill="#38BDF8" />
      <circle cx="68" cy="50" r="8" fill="#38BDF8" />
      <path d="M68 42V25L82 20V37" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
