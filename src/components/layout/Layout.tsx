import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { Toaster } from 'sonner'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
    </div>
  )
}