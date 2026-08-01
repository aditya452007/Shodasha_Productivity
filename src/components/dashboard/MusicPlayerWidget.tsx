'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Sparkles } from 'lucide-react'
import { isTauri } from '@/lib/db'
import { invoke } from '@tauri-apps/api/core'
import { motion, useReducedMotion } from 'framer-motion'

interface MediaSession {
  title: string
  artist: string
  isPlaying: boolean
}

type AmbientType = 'brownian' | 'rain' | 'lofi'

export function MusicPlayerWidget() {
  const [media, setMedia] = useState<MediaSession | null>(null)
  const [ambientPlaying, setAmbientPlaying] = useState(false)
  const [ambientType, setAmbientType] = useState<AmbientType>('brownian')
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(35)
  const shouldReduceMotion = useReducedMotion()

  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodeRef = useRef<AudioNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const checkMediaSession = useCallback(async () => {
    if (!isTauri()) return
    try {
      const activeSession = await invoke<MediaSession>('get_active_media_session')
      if (activeSession && activeSession.title) {
        setMedia(activeSession)
        return
      }
    } catch {
      // Fallback
    }
    setMedia(null)
  }, [])

  useEffect(() => {
    checkMediaSession()
    const interval = setInterval(checkMediaSession, 10000)
    return () => clearInterval(interval)
  }, [checkMediaSession])

  // Simulated track progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (ambientPlaying || media?.isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [ambientPlaying, media?.isPlaying])

  const stopAmbientAudio = useCallback(() => {
    if (nodeRef.current) {
      try {
        if ('stop' in nodeRef.current && typeof (nodeRef.current as any).stop === 'function') {
          ;(nodeRef.current as any).stop()
        }
        nodeRef.current.disconnect()
      } catch {
        // ignore
      }
      nodeRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    setAmbientPlaying(false)
  }, [])

  const startAmbientAudio = useCallback(() => {
    stopAmbientAudio()
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        if (ambientType === 'brownian') {
          data[i] = (lastOut + 0.02 * white) / 1.02
          lastOut = data[i]
          data[i] *= 3.5
        } else if (ambientType === 'rain') {
          data[i] = white * 0.18
        } else {
          // Lofi ambient chime texture
          data[i] = (Math.sin(i * 0.005) * 0.1) + white * 0.04
        }
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime)
      gainNodeRef.current = gain

      noise.connect(gain)
      gain.connect(ctx.destination)
      noise.start()
      nodeRef.current = noise
      setAmbientPlaying(true)
    } catch {
      setAmbientPlaying(false)
    }
  }, [ambientType, isMuted, stopAmbientAudio])

  const toggleAmbient = () => {
    if (ambientPlaying) {
      stopAmbientAudio()
    } else {
      startAmbientAudio()
    }
  }

  const toggleMute = () => {
    const nextMute = !isMuted
    setIsMuted(nextMute)
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(nextMute ? 0 : 0.08, audioCtxRef.current.currentTime)
    }
  }

  const cycleAmbientType = (type: AmbientType) => {
    setAmbientType(type)
    if (ambientPlaying) {
      setTimeout(() => startAmbientAudio(), 50)
    }
  }

  useEffect(() => {
    return () => {
      stopAmbientAudio()
    }
  }, [stopAmbientAudio])

  const isAudioActive = ambientPlaying || Boolean(media?.isPlaying)

  return (
    <BaseCard
      elevation="raised"
      className="card-hover-lift h-full w-full"
      innerClassName="p-5 flex flex-col justify-between bg-gradient-to-r from-slate-900/95 via-indigo-950/80 to-slate-900/95 text-slate-100 border border-indigo-500/20 rounded-[22px] h-full shadow-xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Glow aura backdrop */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col justify-between h-full space-y-3 relative z-10">
        {/* Top Track Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Animated Vinyl Album Cover */}
            <div className="relative w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden group">
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-30 ${
                  isAudioActive ? 'animate-pulse' : ''
                }`}
              />
              <Disc
                className={`w-6 h-6 text-indigo-300 relative z-10 transition-transform ${
                  isAudioActive && !shouldReduceMotion ? 'animate-spin-slow' : ''
                }`}
              />
            </div>

            {/* Track Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAudioActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  {isAudioActive ? 'NOW PLAYING' : 'FOCUS PLAYER'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-1">
                {media ? media.title : ambientType === 'brownian' ? 'Deep Focus Brown Noise' : ambientType === 'rain' ? 'Gentle Rain Soundscape' : 'Lo-Fi Focus Vibes'}
              </h4>
              <p className="text-[11px] font-medium text-indigo-200/80 truncate">
                {media ? media.artist : 'Shodasha Ambient Audio Engine'}
              </p>
            </div>
          </div>

          {/* Animated Equalizer Frequency Bars */}
          <div className="flex items-end gap-1 h-6 px-2 py-1 bg-slate-950/40 rounded-lg border border-indigo-500/15">
            {[40, 80, 50, 90, 60].map((heightPct, idx) => (
              <motion.div
                key={idx}
                animate={
                  isAudioActive && !shouldReduceMotion
                    ? { height: ['20%', `${heightPct}%`, '30%'] }
                    : { height: '20%' }
                }
                transition={{
                  duration: 0.6 + idx * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-1 bg-indigo-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="space-y-1 my-1">
          <div className="w-full h-1.5 bg-slate-950/60 rounded-full border border-indigo-500/15 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300/80">
            <span>01:24</span>
            <span>04:00</span>
          </div>
        </div>

        {/* Preset Selector & Control Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-indigo-500/15">
          {/* Presets */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-indigo-500/20 text-xs">
            <button
              onClick={() => cycleAmbientType('brownian')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                ambientType === 'brownian' ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-400 hover:text-indigo-200'
              }`}
            >
              Brown
            </button>
            <button
              onClick={() => cycleAmbientType('rain')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                ambientType === 'rain' ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-400 hover:text-indigo-200'
              }`}
            >
              Rain
            </button>
            <button
              onClick={() => cycleAmbientType('lofi')}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                ambientType === 'lofi' ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-400 hover:text-indigo-200'
              }`}
            >
              Lo-Fi
            </button>
          </div>

          {/* Media Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-500/10 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <motion.button
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.94 }}
              onClick={media ? () => {} : toggleAmbient}
              className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 transition-all shadow-md flex items-center justify-center border border-indigo-300/30"
              title={isAudioActive ? 'Pause Focus Audio' : 'Play Focus Audio'}
            >
              {isAudioActive ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
