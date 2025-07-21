import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type UserRole = 'anonymous' | 'free' | 'paid'

interface UserPermissions {
  canTrackItems: boolean
  canCreateCampaigns: boolean
  canGenerateReports: boolean
  canManageTeams: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: UserRole
  permissions: UserPermissions
  loading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
  checkPermission: (action: string, resourceId?: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getUserRole(user: User | null): UserRole {
  if (!user) return 'anonymous'
  
  // Check user metadata for subscription tier
  const subscriptionTier = user.user_metadata?.subscription_tier
  return subscriptionTier === 'paid' ? 'paid' : 'free'
}

function getPermissions(userRole: UserRole): UserPermissions {
  return {
    canTrackItems: userRole !== 'anonymous',
    canCreateCampaigns: userRole === 'paid',
    canGenerateReports: userRole === 'paid',
    canManageTeams: userRole === 'paid'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const userRole = getUserRole(user)
  const permissions = getPermissions(userRole)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const checkPermission = async (action: string, resourceId?: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-user-permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          action,
          resource_id: resourceId
        })
      })

      const data = await response.json()
      return data.success && data.data.hasPermission
    } catch (error) {
      console.error('Permission check failed:', error)
      return false
    }
  }

  const value = {
    user,
    session,
    userRole,
    permissions,
    loading,
    signOut,
    isAuthenticated: !!user,
    checkPermission
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}