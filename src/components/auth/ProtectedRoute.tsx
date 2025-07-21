import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

type UserRole = 'anonymous' | 'free' | 'paid'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  fallbackPath?: string
  fallbackComponent?: ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = ['free', 'paid'],
  fallbackPath,
  fallbackComponent 
}: ProtectedRouteProps) {
  const { userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const hasAccess = requiredRoles.includes(userRole)

  if (!hasAccess) {
    // If fallback component provided, show it
    if (fallbackComponent) {
      return <>{fallbackComponent}</>
    }

    // Otherwise redirect
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />
    }

    // Default fallback based on user role
    if (userRole === 'anonymous') {
      return <Navigate to="/login" replace />
    } else {
      return <Navigate to="/pricing" replace />
    }
  }

  return <>{children}</>
}