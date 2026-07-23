# Feature Spec: Settings & App Categorization (`/settings`)

## Overview
The Settings page serves as the central command hub for Shodasha's passive Windows activity tracker, app classification engine, data management, and visual appearance preferences.

---

## SDLC Phase 0 — Design & Architecture Brief

### 1. App Categorization Manager
- **Functionality**: Manage mappings from executable process names (e.g. `Code.exe`, `chrome.exe`, `youtube.com`) to `AppCategory` (`'work'`, `'neutral'`, `'distraction'`).
- **Real-Time Reactive Updates**: Updating a category calls `timeEntryStore.setCategory(appName, category)`. Because Zustand stores derive all KPI metrics (`getKPIsFiltered`, `getCategoryBreakdownToday`, `getTopAppsFiltered`) dynamically based on `categories`, any category change immediately updates `/timeline` and `/` Dashboard charts without page reloads!
- **Color Badges**:
  - Deep Work (`work`): Emerald `#059669`
  - General / Tools (`neutral`): Amber `#d97706`
  - Distraction (`distraction`): Red `#dc2626`
- **Search & Add/Edit**: Real-time search filter for existing categories + inline modal to register new executables or edit existing tags.

### 2. Windows Activity Tracking Preferences
- **Polling Interval Slider**: Configurable from 5s to 60s (Default: 30s) with live numerical readout.
- **Idle / Lock Screen Detection**: Toggle to enable/disable closing entries on `GetForegroundWindow()` NULL returns.
- **System Startup Registration**: Toggle to register/unregister `tracker.exe` silently in Windows HKCU Run registry via Tauri IPC `set_auto_start`.

### 3. Data Management & Export
- **Data Retention Pruning**: Dropdown select (`1 Month`, `3 Months`, `6 Months` [Default], `Keep Indefinitely`).
- **Export Activity Data**: Generates a downloadable `.csv` export containing all logged `time_entries` and `habit_records`.
- **Danger Zone (Reset SQLite Database)**: Action button with double-confirmation dialog to drop/clear local tables safely.

### 4. Appearance & Visual Preferences
- **Theme Mode Toggle**: Light / Dark / System mode with smooth background color transition.
- **Primary Accent Picker**: Emerald (`#059669`), Violet (`#7c3aed`), Amber (`#d97706`), Rose (`#e11d48`). Dynamically adjusts `--accent` CSS variable across the DOM.

---

## Aesthetic System

- **Doppelrand (Double-Bezel)**: Outer shell `p-2 rounded-[2.25rem] bg-stone-900/5 dark:bg-white/5 ring-1 ring-stone-900/5 dark:ring-white/10`, Inner core `rounded-[calc(2.25rem-0.5rem)] bg-[var(--bg-surface)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]`.
- **Button-in-Button Trailing Icons**: Pill buttons with inner circular icon wrappers (`w-8 h-8 rounded-full bg-stone-900/5 dark:bg-white/10`).
- **Micro Eyebrow Badges**: `rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] bg-[var(--accent-muted)] border border-[var(--accent)]/20`.
- **Apple Motion Physics**: Interruptible spring transitions (`type: 'spring', bounce: 0, duration: 0.4`), continuous pointer feedback, and tactile press scaling (`active:scale-[0.98]`).
