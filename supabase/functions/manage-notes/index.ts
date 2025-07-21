import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ManageNotesRequest {
  item_type: 'bill' | 'legislator'
  item_id: string
  notes: string
  action: 'create' | 'update' | 'delete'
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

    const { item_type, item_id, notes, action } = await req.json() as ManageNotesRequest

    const tableName = item_type === 'bill' ? 'tracked_bills' : 'tracked_legislators'
    const foreignKey = item_type === 'bill' ? 'bill_id' : 'legislator_id'

    // Check if user is tracking this item
    const { data: trackedItem } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .eq(foreignKey, item_id)
      .single()

    if (!trackedItem) {
      throw new Error(`You must be tracking this ${item_type} to manage notes`)
    }

    switch (action) {
      case 'create':
      case 'update':
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from(tableName)
          .update({ notes })
          .eq('user_id', user.id)
          .eq(foreignKey, item_id)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({
            success: true,
            data: updateData,
            message: 'Notes updated successfully'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      case 'delete':
        const { data: deleteData, error: deleteError } = await supabaseAdmin
          .from(tableName)
          .update({ notes: null })
          .eq('user_id', user.id)
          .eq(foreignKey, item_id)
          .select()
          .single()

        if (deleteError) throw deleteError

        return new Response(
          JSON.stringify({
            success: true,
            data: deleteData,
            message: 'Notes deleted successfully'
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