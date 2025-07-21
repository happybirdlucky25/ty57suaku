import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface GenerateAIContentRequest {
  campaign_id?: number
  bill_id?: string
  content_type: 'bill_summary' | 'campaign_memo' | 'talking_points' | 'compliance_review' | 'impact_analysis'
  prompt?: string
  is_public?: boolean
}

// Mock AI generation function - replace with actual AI service
async function generateAIContent(contentType: string, context: any, customPrompt?: string): Promise<string> {
  // This would integrate with OpenAI, Claude, or your preferred AI service
  const prompts = {
    bill_summary: `Summarize this bill in clear, accessible language: ${JSON.stringify(context)}`,
    campaign_memo: `Create a strategic memo for this campaign: ${JSON.stringify(context)}`,
    talking_points: `Generate key talking points for: ${JSON.stringify(context)}`,
    compliance_review: `Analyze compliance implications of: ${JSON.stringify(context)}`,
    impact_analysis: `Assess potential impacts of: ${JSON.stringify(context)}`
  }

  const prompt = customPrompt || prompts[contentType as keyof typeof prompts]
  
  // Mock response - replace with actual AI API call
  return `AI Generated Content for ${contentType}: \n\nBased on the provided information, here is the analysis...\n\n[This would contain actual AI-generated content]`
}

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    
    const { campaign_id, bill_id, content_type, prompt, is_public = false } = await req.json() as GenerateAIContentRequest

    let userId: string | null = null
    let isAuthenticated = false

    // Check authentication for non-public requests
    if (!is_public || campaign_id) {
      if (!authHeader) {
        throw new Error('Authentication required')
      }

      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (userError || !user) {
        throw new Error('Invalid authentication')
      }

      userId = user.id
      isAuthenticated = true
    }

    // For campaign content, check team membership
    if (campaign_id && isAuthenticated) {
      const { data: teamMember } = await supabaseAdmin
        .from('team_members')
        .select('role')
        .eq('user_id', userId)
        .eq('campaign_id', campaign_id)
        .single()

      if (!teamMember || !['manager', 'editor'].includes(teamMember.role)) {
        throw new Error('Insufficient permissions to generate campaign content')
      }
    }

    // Gather context for AI generation
    let context: any = {}

    if (bill_id) {
      const { data: bill, error: billError } = await supabaseAdmin
        .from('bills')
        .select(`
          bill_id,
          title,
          description,
          status,
          bill_number
        `)
        .eq('bill_id', bill_id)
        .single()

      if (billError) throw billError
      context.bill = bill
    }

    if (campaign_id) {
      const { data: campaign, error: campaignError } = await supabaseAdmin
        .from('campaigns')
        .select(`
          id,
          name,
          description,
          campaign_bills!inner(
            bills(bill_id, title, description)
          ),
          campaign_legislators!inner(
            people(people_id, full_name, party, chamber, state)
          )
        `)
        .eq('id', campaign_id)
        .single()

      if (campaignError) throw campaignError
      context.campaign = campaign
    }

    // Generate AI content
    const aiContent = await generateAIContent(content_type, context, prompt)

    // Store the result
    if (content_type === 'bill_summary' && is_public) {
      // Store as public bill report
      const { data: report, error: reportError } = await supabaseAdmin
        .from('bill_reports')
        .insert({
          bill_id: bill_id!,
          report_type: 'summary',
          content: { text: aiContent, generated_at: new Date().toISOString() },
          requested_by: userId,
          requested_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          is_public: true
        })
        .select()
        .single()

      if (reportError) throw reportError

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            content: aiContent,
            report_id: report.id,
            type: 'public_bill_summary'
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )

    } else if (campaign_id) {
      // Store as campaign document
      const { data: document, error: docError } = await supabaseAdmin
        .from('campaign_documents')
        .insert({
          campaign_id,
          title: `AI ${content_type.replace('_', ' ')} - ${new Date().toLocaleDateString()}`,
          content: { 
            text: aiContent, 
            type: content_type,
            generated_at: new Date().toISOString(),
            context 
          },
          document_type: content_type,
          updated_by: userId,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (docError) throw docError

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            content: aiContent,
            document_id: document.id,
            type: 'campaign_document'
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Return content without storing
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          content: aiContent,
          type: 'generated_content'
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