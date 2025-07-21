import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface CreateCampaignRequest {
  name: string
  description?: string
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

    // Check if user has paid subscription
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .single()

    if (profile?.subscription_tier !== 'paid') {
      throw new Error('Paid subscription required to create campaigns')
    }

    const { name, description } = await req.json() as CreateCampaignRequest

    // Create campaign
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .insert({
        user_id: user.id,
        name,
        description,
        created_at: new Date().toISOString(),
        lead_id: user.id
      })
      .select()
      .single()

    if (campaignError) throw campaignError

    // Create team record
    const { error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({
        campaign_id: campaign.id,
        created_at: new Date().toISOString()
      })

    if (teamError) throw teamError

    // Add user as team manager
    const { error: memberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        team_id: campaign.id, // Assuming team_id matches campaign_id
        user_id: user.id,
        role: 'manager',
        joined_at: new Date().toISOString()
      })

    if (memberError) throw memberError

    return new Response(
      JSON.stringify({
        success: true,
        data: campaign,
        message: 'Campaign created successfully'
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