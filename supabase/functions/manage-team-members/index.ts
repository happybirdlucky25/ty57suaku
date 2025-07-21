import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ManageTeamMembersRequest {
  campaign_id: number
  action: 'add' | 'remove' | 'update_role'
  user_email?: string
  user_id?: string
  role?: 'manager' | 'editor' | 'viewer'
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authentication required')
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid authentication')
    }

    const { campaign_id, action, user_email, user_id, role } = await req.json() as ManageTeamMembersRequest

    // Check if current user is campaign manager
    const { data: currentMember } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('campaign_id', campaign_id)
      .single()

    if (!currentMember || currentMember.role !== 'manager') {
      throw new Error('Only campaign managers can manage team members')
    }

    let targetUserId = user_id

    // If email provided, look up user
    if (user_email && !user_id) {
      const { data: targetUser } = await supabaseAdmin.auth.admin.listUsers()
      const foundUser = targetUser.users.find(u => u.email === user_email)
      
      if (!foundUser) {
        throw new Error('User not found with that email')
      }
      targetUserId = foundUser.id
    }

    if (!targetUserId) {
      throw new Error('User ID or email required')
    }

    switch (action) {
      case 'add':
        if (!role) throw new Error('Role required for adding team members')
        
        const { data: addData, error: addError } = await supabaseAdmin
          .from('team_members')
          .insert({
            campaign_id,
            user_id: targetUserId,
            role,
            joined_at: new Date().toISOString()
          })
          .select()
          .single()

        if (addError) throw addError

        return new Response(
          JSON.stringify({
            success: true,
            data: addData,
            message: 'Team member added successfully'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      case 'remove':
        const { data: removeData, error: removeError } = await supabaseAdmin
          .from('team_members')
          .delete()
          .eq('campaign_id', campaign_id)
          .eq('user_id', targetUserId)
          .select()

        if (removeError) throw removeError

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Team member removed successfully'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      case 'update_role':
        if (!role) throw new Error('Role required for updating team members')

        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('team_members')
          .update({ role })
          .eq('campaign_id', campaign_id)
          .eq('user_id', targetUserId)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({
            success: true,
            data: updateData,
            message: 'Team member role updated successfully'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      default:
        throw new Error('Invalid action')
    }

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