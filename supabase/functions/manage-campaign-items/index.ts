import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ManageCampaignItemsRequest {
  campaign_id: number
  action: 'add' | 'remove'
  item_type: 'bill' | 'legislator' | 'contact'
  item_ids: string[]
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

    const { campaign_id, action, item_type, item_ids } = await req.json() as ManageCampaignItemsRequest

    // Check team membership and permissions
    const { data: teamMember } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('campaign_id', campaign_id)
      .single()

    if (!teamMember || !['manager', 'editor'].includes(teamMember.role)) {
      throw new Error('Insufficient permissions - requires manager or editor role')
    }

    let tableName: string
    let foreignKey: string

    switch (item_type) {
      case 'bill':
        tableName = 'campaign_bills'
        foreignKey = 'bill_id'
        break
      case 'legislator':
        tableName = 'campaign_legislators'
        foreignKey = 'legislator_id'
        break
      case 'contact':
        tableName = 'campaign_contacts'
        foreignKey = 'contact_id'
        break
      default:
        throw new Error('Invalid item type')
    }

    if (action === 'add') {
      // Add items to campaign
      const insertData = item_ids.map(item_id => ({
        campaign_id,
        [foreignKey]: item_id
      }))

      const { data, error } = await supabaseAdmin
        .from(tableName)
        .upsert(insertData)
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({
          success: true,
          data,
          message: `Added ${item_ids.length} ${item_type}(s) to campaign`
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )

    } else if (action === 'remove') {
      // Remove items from campaign
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .delete()
        .eq('campaign_id', campaign_id)
        .in(foreignKey, item_ids)
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({
          success: true,
          data,
          message: `Removed ${data.length} ${item_type}(s) from campaign`
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')

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