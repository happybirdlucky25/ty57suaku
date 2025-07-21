import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface UntrackItemRequest {
  item_type: 'bill' | 'legislator'
  item_id: string
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

    const { item_type, item_id } = await req.json() as UntrackItemRequest

    const tableName = item_type === 'bill' ? 'tracked_bills' : 'tracked_legislators'
    const foreignKey = item_type === 'bill' ? 'bill_id' : 'legislator_id'

    // Remove from tracking (this will also delete notes due to cascade)
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq('user_id', user.id)
      .eq(foreignKey, item_id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `${item_type} was not being tracked` 
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Stopped tracking ${item_type}` 
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