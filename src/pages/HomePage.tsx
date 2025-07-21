import { useAuth } from '../contexts/AuthContext'
import { DashboardPage } from './DashboardPage'
import { LandingPage } from './LandingPage'

export function HomePage() {
  const { isAuthenticated } = useAuth()

  // If user is authenticated, show Dashboard as home page
  // If not authenticated, show Landing page
  return isAuthenticated ? <DashboardPage /> : <LandingPage />
}