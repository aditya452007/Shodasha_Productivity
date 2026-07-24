import { create } from 'zustand'

interface UIState {
  isTracking: boolean
  activeTab: string
  setIsTracking: (isTracking: boolean) => void
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  isTracking: true,
  activeTab: '/',
  setIsTracking: (isTracking) => set({ isTracking }),
  setActiveTab: (activeTab) => set({ activeTab }),
}))
