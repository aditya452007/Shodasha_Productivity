import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { AgentationWrapper } from '@/components/common/AgentationWrapper'
import { AppInitializer } from '@/components/common/AppInitializer'

export const metadata: Metadata = {
  title: 'Shodasha — Personal Productivity & Activity Tracker',
  description: 'Local time-management desktop app with passive activity tracking, habit heatmap, and kanban board.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased transition-colors">
        <AppInitializer />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <AgentationWrapper />
      </body>
    </html>
  )
}
