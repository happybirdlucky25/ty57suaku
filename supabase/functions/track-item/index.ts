import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface TrackItemRequest {
  item_type: 'bill' | 'legislator'
  item_id: string
  notes?: string
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

    const { item_type, item_id, notes } = await req.json() as TrackItemRequest

    const tableName = item_type === 'bill' ? 'tracked_bills' : 'tracked_legislators'
    const foreignKey = item_type === 'bill' ? 'bill_id' : 'legislator_id'

    // Check if already tracking
    const { data: existing } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .eq(foreignKey, item_id)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Already tracking this ${item_type}`,
          data: existing
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add to tracking
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert({
        user_id: user.id,
        [foreignKey]: item_id,
        tracked_at: new Date().toISOString(),
        notes: notes || null
      })
      .select()
      .single()

    if (error) throw error

    // Create notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'tracking_added',
        title: `Started tracking ${item_type}`,
        content: { item_type, item_id },
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: `Successfully tracking ${item_type}` 
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