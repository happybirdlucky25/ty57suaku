import { useState } from 'react'
import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { NotificationSidebar } from '../NotificationSidebar'
import { Toaster } from 'sonner'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false)

  const openNotificationSidebar = () => setIsNotificationSidebarOpen(true)
  const closeNotificationSidebar = () => setIsNotificationSidebarOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNotificationClick={openNotificationSidebar} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <NotificationSidebar 
        isOpen={isNotificationSidebarOpen}
        onClose={closeNotificationSidebar}
      />
      <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
    </div>
  )
}