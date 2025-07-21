import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ManageDocumentRequest {
  action: 'create' | 'update' | 'delete' | 'get'
  campaign_id: number
  document_id?: string
  title?: string
  content?: any
  document_type?: string
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

    const { action, campaign_id, document_id, title, content, document_type } = await req.json() as ManageDocumentRequest

    // Check team membership
    const { data: teamMember } = await supabaseAdmin
      .from('team_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('campaign_id', campaign_id)
      .single()

    if (!teamMember) {
      throw new Error('Not a member of this campaign')
    }

    // Check permissions based on action
    const canEdit = ['manager', 'editor'].includes(teamMember.role)
    const canView = ['manager', 'editor', 'viewer'].includes(teamMember.role)

    switch (action) {
      case 'get':
        if (!canView) {
          throw new Error('Insufficient permissions to view documents')
        }

        let getQuery = supabaseAdmin
          .from('campaign_documents')
          .select('*')
          .eq('campaign_id', campaign_id)

        if (document_id) {
          getQuery = getQuery.eq('id', document_id).single()
        }

        const { data: documents, error: getError } = await getQuery
        if (getError) throw getError

        return new Response(
          JSON.stringify({
            success: true,
            data: documents
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      case 'create':
        if (!canEdit) {
          throw new Error('Insufficient permissions to create documents')
        }

        if (!title) {
          throw new Error('Document title is required')
        }

        const { data: createData, error: createError } = await supabaseAdmin
          .from('campaign_documents')
          .insert({
            campaign_id,
            title,
            content: content || {},
            document_type: document_type || 'general',
            updated_by: user.id,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) throw createError

        return new Response(
          JSON.stringify({
            success: true,
            data: createData,
            message: 'Document created successfully'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      case 'update':
        if (!canEdit) {
          throw new Error('Insufficient permissions to update documents')
        }

        if (!document_id) {
          throw new Error('Document ID is required')
        }

        const updateFields: any = {
          updated_by: user.id,
          updated_at: new Date().toISOString()
        }

        if (title) updateFields.title = title
        if (content) updateFields.content = content
        if (document_type) updateFields.document_type = document_type

        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('campaign_documents')
          .update(updateFields)
          .eq('id', document_id)
          .eq('campaign_id', campaign_id)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({
            success: true,
            data: updateData,
            message: 'Document updated successfully'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )

      case 'delete':
        if (!canEdit) {
          throw new Error('Insufficient permissions to delete documents')
        }

        if (!document_id) {
          throw new Error('Document ID is required')
        }

        const { data: deleteData, error: deleteError } = await supabaseAdmin
          .from('campaign_documents')
          .delete()
          .eq('id', document_id)
          .eq('campaign_id', campaign_id)
          .select()

        if (deleteError) throw deleteError

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Document deleted successfully'
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