'use client'

import { useState, useEffect } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { Play, Pause, RotateCcw, Plus, Minus, Check, Sparkles } from 'lucide-react'
import { FocusDoodleSVG } from '@/components/ui/SVGAvatars'
import { useGamificationStore } from '@/stores/gamificationStore'
import { toast } from 'sonner'
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'framer-motion'

const PRESETS = [25, 50]
const MIN_MINUTES = 5
const MAX_MINUTES = 90
const STEP_MINUTES = 5

type TimerPhase = 'ready' | 'running' | 'paused' | 'complete'

export function QuietTimeTimerWidget() {
  const shouldReduceMotion = useReducedMotion()
  const [targetMinutes, setTargetMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [phase, setPhase] = useState<TimerPhase>('ready')

  const totalSeconds = targetMinutes * 60
  const elapsedSeconds = totalSeconds - timeLeft
  const progressRatio = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0
  const progressPct = Math.round(progressRatio * 100)
  const isActive = phase === 'running'

  // Tick down while running
  useEffect(() => {
    if (phase !== 'running') return
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  // Completion: award XP once, celebrate, then return to ready
  useEffect(() => {
    if (phase !== 'running' || timeLeft > 0) return
    setPhase('complete')
    useGamificationStore.getState().awardXP(10, `quiet_time_${Date.now()}`)
    toast.success('Quiet time session completed! (+10 XP)')
    const resetTimer = setTimeout(() => {
      setPhase('ready')
      setTimeLeft(targetMinutes * 60)
    }, 2200)
    return () => clearTimeout(resetTimer)
  }, [phase, timeLeft, targetMinutes])

  const selectDuration = (minutes: number) => {
    setTargetMinutes(minutes)
    setTimeLeft(minutes * 60)
    setPhase('ready')
  }

  const bumpCustom = (delta: number) => {
    const next = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, targetMinutes + delta))
    selectDuration(next)
  }

  const startSession = () => setPhase('running')
  const pauseSession = () => setPhase('paused')
  const resetSession = () => {
    setPhase('ready')
    setTimeLeft(targetMinutes * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Clock hands: minute hand sweeps smoothly, second hand ticks with a spring
  const minuteHandDegrees = (elapsedSeconds / 60) * 6
  const secondHandDegrees = (elapsedSeconds % 60) * 6

  // Circular SVG Arc math
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progressRatio * circumference

  const statusCopy: Record<TimerPhase, string> = {
    ready: 'Ready for quiet time',
    running: `Focusing — ${progressPct}% elapsed`,
    paused: 'Paused — resume anytime',
    complete: 'Session complete! +10 XP',
  }

  const fadeUp = (delay: number): Transition => ({
    duration: 0.3,
    ease: [0.23, 1, 0.32, 1],
    delay,
  })
  const enterStart = shouldReduceMotion ? false : { opacity: 0, y: 8 }
  const enterEnd = { opacity: 1, y: 0 }

  return (
    <BaseCard
      elevation="raised"
      className="card-hover-lift h-full w-full"
      innerClassName="p-5 flex flex-col justify-between bg-[#F0FDF4] text-emerald-950 border border-[#DCFCE7] rounded-[22px] h-full shadow-sm overflow-hidden relative"
    >
      {/* Ambient aura behind the clock */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.15 }}
        animate={{ opacity: isActive ? 0.4 : 0.15 }}
        transition={{ duration: 0.6 }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none"
      />

      <div className="flex flex-col justify-between h-full space-y-3 relative">
        {/* Header Row with FocusDoodleSVG */}
        <motion.div
          initial={enterStart}
          animate={enterEnd}
          transition={fadeUp(0)}
          className="flex items-center gap-2.5"
        >
          <FocusDoodleSVG className="w-9 h-9 flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold font-display text-emerald-950 leading-tight">
              Focus Solitude
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700">
              Quiet Work Mode
            </span>
          </div>

          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2 py-1 rounded-full shrink-0">
            <Sparkles className="w-3 h-3" />
            +10 XP
          </span>
        </motion.div>

        {/* Duration Presets + Custom Stepper */}
        <motion.div
          initial={enterStart}
          animate={enterEnd}
          transition={fadeUp(0.06)}
          className="flex items-center justify-center gap-1 bg-emerald-100/80 border border-emerald-300 rounded-full p-1 text-xs"
        >
          {PRESETS.map((m) => {
            const active = targetMinutes === m
            return (
              <button
                key={m}
                onClick={() => selectDuration(m)}
                disabled={isActive}
                className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-900 hover:text-emerald-700'
                }`}
              >
                {m}m
              </button>
            )
          })}

          {/* Custom duration stepper */}
          <div className="flex items-center gap-0.5 pl-1 border-l border-emerald-300">
            <button
              onClick={() => bumpCustom(-STEP_MINUTES)}
              disabled={isActive || targetMinutes <= MIN_MINUTES}
              aria-label="Decrease custom duration"
              className="p-1 rounded-full text-emerald-800 hover:bg-emerald-200/70 transition-colors active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className={`px-1 text-[11px] font-black font-mono rounded-md ${
                !PRESETS.includes(targetMinutes)
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-900'
              }`}
            >
              {targetMinutes}m
            </span>
            <button
              onClick={() => bumpCustom(STEP_MINUTES)}
              disabled={isActive || targetMinutes >= MAX_MINUTES}
              aria-label="Increase custom duration"
              className="p-1 rounded-full text-emerald-800 hover:bg-emerald-200/70 transition-colors active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Visual Analog Clock Face */}
        <motion.div
          initial={enterStart}
          animate={enterEnd}
          transition={fadeUp(0.08)}
          className="my-2 p-3 flex flex-col items-center justify-center bg-white rounded-2xl border border-emerald-200 shadow-2xs relative overflow-hidden"
        >
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG Dial & Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#0D9488" />
                </linearGradient>
              </defs>
              {/* Dial Background Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-emerald-100"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#timerGradient)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className={`transition-[stroke-dashoffset] duration-500 ease-linear ${
                  phase === 'complete' ? 'drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]' : ''
                }`}
              />
              {/* Instrument Tick Marks: 60 minor + 12 major */}
              {Array.from({ length: 60 }, (_, i) => {
                const major = i % 5 === 0
                const angle = (i / 60) * 360
                const innerR = major ? 43 : 45
                const rad = (angle * Math.PI) / 180
                // Round to 3 decimals so server/client renders produce identical SVG attributes
                const x1 = Math.round((50 + innerR * Math.sin(rad)) * 1000) / 1000
                const y1 = Math.round((50 - innerR * Math.cos(rad)) * 1000) / 1000
                const x2 = Math.round((50 + 48 * Math.sin(rad)) * 1000) / 1000
                const y2 = Math.round((50 - 48 * Math.cos(rad)) * 1000) / 1000
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={major ? '#047857' : '#10B981'}
                    strokeWidth={major ? 1.8 : 0.8}
                    opacity={major ? 0.55 : 0.22}
                  />
                )
              })}
            </svg>

            {/* Analog Clock Hands Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Minute Hand — smooth continuous sweep */}
              <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -100%)' }}>
                <div
                  className={`w-1 bg-emerald-800 rounded-full ${
                    isActive && !shouldReduceMotion ? 'transition-transform duration-500 ease-linear' : ''
                  }`}
                  style={{
                    height: '24px',
                    transformOrigin: '50% 100%',
                    transform: `rotate(${minuteHandDegrees}deg)`,
                  }}
                />
              </div>
              {/* Second Hand — springy per-second tick */}
              <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -100%)' }}>
                <motion.div
                  className="w-0.5 bg-amber-500 rounded-full"
                  style={{ height: '30px', transformOrigin: '50% 100%' }}
                  animate={{ rotate: secondHandDegrees }}
                  transition={
                    isActive && !shouldReduceMotion
                      ? { type: 'spring', stiffness: 320, damping: 22, mass: 0.6 }
                      : { duration: 0 }
                  }
                />
              </div>
              {/* Center Pin */}
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white z-10 shadow-xs" />
            </div>
          </div>

          {/* Digital Time & Status Label */}
          <div className="text-center mt-2">
            <AnimatePresence mode="wait" initial={false}>
              {phase === 'complete' ? (
                <motion.div
                  key="complete"
                  initial={shouldReduceMotion ? false : { scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 18 }}
                  className="flex items-center justify-center gap-1.5 text-emerald-700"
                >
                  <motion.span
                    initial={shouldReduceMotion ? false : { rotate: -40, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 15, delay: 0.06 }}
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </motion.span>
                  <span className="text-lg font-black font-mono tracking-tight">+10 XP</span>
                </motion.div>
              ) : (
                <motion.div
                  key="time"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <motion.span
                    key={seconds}
                    initial={shouldReduceMotion ? false : { scale: 1.04 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="text-2xl font-black font-mono tracking-tight text-emerald-950 tabular-nums inline-block"
                  >
                    {formattedTime}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[10px] font-bold text-emerald-700 mt-0.5 flex items-center justify-center gap-1">
              {phase === 'running' && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
                </span>
              )}
              <span className="tabular-nums">{statusCopy[phase]}</span>
            </p>
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={enterStart}
          animate={enterEnd}
          transition={fadeUp(0.16)}
          className="flex items-center gap-2 pt-2 border-t border-emerald-200"
        >
          <motion.button
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
            onClick={phase === 'running' ? pauseSession : phase === 'complete' ? resetSession : startSession}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.97] ${
              phase === 'running'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : phase === 'complete'
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {phase === 'running' ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Focus
              </>
            ) : phase === 'complete' ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={3} /> Done
              </>
            ) : phase === 'paused' ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Resume
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Start Focus Session
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.94 }}
            onClick={resetSession}
            className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors active:scale-[0.97]"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      </div>
    </BaseCard>
  )
}
