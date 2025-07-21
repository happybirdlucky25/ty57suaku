import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface PermissionRequest {
  action: 'create_campaign' | 'track_items' | 'view_reports' | 'manage_team'
  resource_id?: string | number
}

type UserRole = 'anonymous' | 'free' | 'paid'
type TeamRole = 'manager' | 'editor' | 'viewer'

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    const { action, resource_id } = await req.json() as PermissionRequest

    let userRole: UserRole = 'anonymous'
    let userId: string | null = null
    let teamRole: TeamRole | null = null

    // Check if user is authenticated
    if (authHeader) {
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (!userError && user) {
        userId = user.id
        
        // Get user subscription status
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('subscription_tier')
          .eq('user_id', user.id)
          .single()

        userRole = profile?.subscription_tier === 'paid' ? 'paid' : 'free'

        // If checking campaign-related permissions, get team role
        if (resource_id && (action === 'manage_team' || action === 'view_reports')) {
          const { data: teamMember } = await supabaseAdmin
            .from('team_members')
            .select('role')
            .eq('user_id', user.id)
            .eq('campaign_id', resource_id)
            .single()

          teamRole = teamMember?.role as TeamRole
        }
      }
    }

    // Permission logic
    let hasPermission = false
    let reason = ''

    switch (action) {
      case 'track_items':
        hasPermission = userRole !== 'anonymous'
        reason = hasPermission ? '' : 'Must be registered to track items'
        break

      case 'create_campaign':
        hasPermission = userRole === 'paid'
        reason = hasPermission ? '' : 'Requires paid subscription'
        break

      case 'view_reports':
        if (userRole === 'anonymous') {
          hasPermission = false
          reason = 'Must be registered'
        } else if (resource_id && teamRole) {
          hasPermission = ['manager', 'editor', 'viewer'].includes(teamRole)
          reason = hasPermission ? '' : 'Not a team member'
        } else {
          hasPermission = true
        }
        break

      case 'manage_team':
        hasPermission = teamRole === 'manager'
        reason = hasPermission ? '' : 'Requires manager role'
        break

      default:
        hasPermission = false
        reason = 'Unknown action'
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          hasPermission,
          userRole,
          teamRole,
          userId,
          reason
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})