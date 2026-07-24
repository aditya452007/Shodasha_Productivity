import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Geist } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { AgentationWrapper } from '@/components/common/AgentationWrapper'
import { AppInitializer } from '@/components/common/AppInitializer'
import { PageTransition } from '@/components/ui/PageTransition'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shodasha — Personal Productivity & Activity Tracker',
  description: 'Local time-management desktop app with passive activity tracking, habit heatmap, and kanban board.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${jetbrainsMono.variable} ${geist.variable}`}>
      <body className="flex min-h-full flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased transition-colors">
        <AppInitializer />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Toaster position="bottom-right" richColors />
        <AgentationWrapper />
      </body>
    </html>
  )
}
