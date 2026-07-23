'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import {
  AppCategoryManager,
  TrackingPreferences,
  DataManagement,
  AppearanceSettings,
} from '@/components/settings'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0,
      duration: 0.4,
    },
  },
}

export default function SettingsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20">
            System Preferences
          </span>
          <span className="text-xs text-[var(--text-tertiary)] font-mono">
            v1.0.0 (Local Desktop)
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Settings & Configuration
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
          Manage executable categorization, activity polling frequency, local SQLite retention & CSV data exports, and app styling theme.
        </p>
      </motion.div>

      {/* Section 1: App Categorization Manager */}
      <motion.div variants={itemVariants}>
        <AppCategoryManager />
      </motion.div>

      {/* Section 2: Windows Activity Tracking Preferences */}
      <motion.div variants={itemVariants}>
        <TrackingPreferences />
      </motion.div>

      {/* Section 3: Data Management & Export */}
      <motion.div variants={itemVariants}>
        <DataManagement />
      </motion.div>

      {/* Section 4: Appearance & Theme Preferences */}
      <motion.div variants={itemVariants}>
        <AppearanceSettings />
      </motion.div>
    </motion.div>
  )
}
