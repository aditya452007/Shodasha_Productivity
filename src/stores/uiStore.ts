import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface UIState {
  theme: Theme
  isTracking: boolean
  activeTab: string
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setIsTracking: (isTracking: boolean) => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  isTracking: true,
  activeTab: '/',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light'
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      return { theme: nextTheme }
    }),
  setIsTracking: (isTracking) => set({ isTracking }),
  setActiveTab: (activeTab) => set({ activeTab }),
}))
