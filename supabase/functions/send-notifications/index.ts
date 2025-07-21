import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface SendNotificationRequest {
  user_ids?: string[]
  campaign_id?: number
  notification_type: 'bill_update' | 'ai_report_ready' | 'campaign_share' | 'team_invite' | 'system_message'
  title: string
  message: string
  data?: any
  send_email?: boolean
  send_in_app?: boolean
}

// Mock email sending function - replace with actual email service
async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  // This would integrate with SendGrid, SES, or your preferred email service
  console.log(`Mock email sent to ${to}: ${subject}`)
  return true
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

    const {
      user_ids,
      campaign_id,
      notification_type,
      title,
      message,
      data,
      send_email = false,
      send_in_app = true
    } = await req.json() as SendNotificationRequest

    let targetUserIds: string[] = []

    // Determine target users
    if (user_ids) {
      targetUserIds = user_ids
    } else if (campaign_id) {
      // Get all team members of the campaign
      const { data: teamMembers } = await supabaseAdmin
        .from('team_members')
        .select('user_id')
        .eq('campaign_id', campaign_id)

      targetUserIds = teamMembers?.map(member => member.user_id) || []
    } else {
      throw new Error('Either user_ids or campaign_id must be provided')
    }

    if (targetUserIds.length === 0) {
      throw new Error('No target users found')
    }

    const results = {
      in_app_sent: 0,
      emails_sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Send notifications to each user
    for (const targetUserId of targetUserIds) {
      try {
        // Send in-app notification
        if (send_in_app) {
          const { error: notifError } = await supabaseAdmin
            .from('notifications')
            .insert({
              user_id: targetUserId,
              type: notification_type,
              title,
              content: message,
              data: data || {},
              sent_by: user.id,
              created_at: new Date().toISOString(),
              read: false
            })

          if (notifError) {
            results.errors.push(`In-app notification failed for user ${targetUserId}: ${notifError.message}`)
            results.failed++
          } else {
            results.in_app_sent++
          }
        }

        // Send email notification
        if (send_email) {
          // Get user's email and preferences
          const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('email, email_notifications')
            .eq('user_id', targetUserId)
            .single()

          if (profile?.email && profile?.email_notifications !== false) {
            const emailSent = await sendEmail(
              profile.email,
              `ShadowCongress: ${title}`,
              message
            )

            if (emailSent) {
              results.emails_sent++
            } else {
              results.errors.push(`Email failed for user ${targetUserId}`)
              results.failed++
            }
          }
        }

      } catch (error) {
        results.errors.push(`Notification failed for user ${targetUserId}: ${error.message}`)
        results.failed++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          target_users: targetUserIds.length,
          results
        },
        message: `Notifications sent to ${results.in_app_sent + results.emails_sent} recipients`
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