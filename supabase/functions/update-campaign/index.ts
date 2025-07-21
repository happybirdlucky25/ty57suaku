import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

// Initialize Supabase client with service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface CampaignUpdateRequest {
  campaignId: number;
  updates: {
    name?: string;
    description?: string;
    billIds?: string[];
    legislatorIds?: string[];
  };
}

Deno.serve(async (req) => {
  try {
    const { campaignId, updates } = await req.json() as CampaignUpdateRequest

    // Update campaign details
    if (updates.name || updates.description) {
      const { error: campaignError } = await supabaseAdmin
        .from('campaigns')
        .update({
          name: updates.name,
          description: updates.description
        })
        .eq('id', campaignId)

      if (campaignError) throw campaignError
    }

    // Update associated bills
    if (updates.billIds) {
      // First remove existing associations
      await supabaseAdmin
        .from('campaign_bills')
        .delete()
        .eq('campaign_id', campaignId)

      // Then add new ones
      const billRows = updates.billIds.map(billId => ({
        campaign_id: campaignId,
        bill_id: billId
      }))

      const { error: billsError } = await supabaseAdmin
        .from('campaign_bills')
        .insert(billRows)

      if (billsError) throw billsError
    }

    // Update associated legislators
    if (updates.legislatorIds) {
      // First remove existing associations
      await supabaseAdmin
        .from('campaign_legislators')
        .delete()
        .eq('campaign_id', campaignId)

      // Then add new ones
      const legislatorRows = updates.legislatorIds.map(legislatorId => ({
        campaign_id: campaignId,
        legislator_id: legislatorId
      }))

      const { error: legislatorsError } = await supabaseAdmin
        .from('campaign_legislators')
        .insert(legislatorRows)

      if (legislatorsError) throw legislatorsError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
