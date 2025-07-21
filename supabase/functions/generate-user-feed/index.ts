import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface GenerateFeedRequest {
  page?: number
  limit?: number
  feed_types?: string[]
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

    const { page = 1, limit = 20, feed_types } = await req.json() as GenerateFeedRequest
    const offset = (page - 1) * limit

    const feedItems: any[] = []

    // Get user's tracked bills for bill status updates
    const { data: trackedBills } = await supabaseAdmin
      .from('tracked_bills')
      .select(`
        bill_id,
        tracked_at,
        bills!inner(bill_id, title, status, status_date)
      `)
      .eq('user_id', user.id)

    // Add bill status change items
    if (trackedBills) {
      for (const tracked of trackedBills) {
        // Check if bill status changed recently (within last 30 days)
        const statusDate = new Date(tracked.bills.status_date)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        if (statusDate > thirtyDaysAgo) {
          feedItems.push({
            type: 'bill_status_change',
            title: `Bill Status Update: ${tracked.bills.title}`,
            description: `Status changed to: ${tracked.bills.status}`,
            data: {
              bill_id: tracked.bills.bill_id,
              new_status: tracked.bills.status
            },
            created_at: tracked.bills.status_date,
            priority: 'high'
          })
        }
      }
    }

    // Get user's completed AI reports
    const { data: completedReports } = await supabaseAdmin
      .from('bill_reports')
      .select(`
        id,
        report_type,
        completed_at,
        bills!inner(bill_id, title)
      `)
      .eq('requested_by', user.id)
      .not('completed_at', 'is', null)
      .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

    if (completedReports) {
      for (const report of completedReports) {
        feedItems.push({
          type: 'ai_report_completed',
          title: `AI Report Ready: ${report.bills.title}`,
          description: `Your ${report.report_type} analysis is complete`,
          data: {
            report_id: report.id,
            bill_id: report.bills.bill_id,
            report_type: report.report_type
          },
          created_at: report.completed_at,
          priority: 'medium'
        })
      }
    }

    // Get user's campaign updates
    const { data: userCampaigns } = await supabaseAdmin
      .from('team_members')
      .select(`
        campaign_id,
        campaigns!inner(
          id,
          name,
          campaign_documents(id, title, updated_at, updated_by)
        )
      `)
      .eq('user_id', user.id)

    if (userCampaigns) {
      for (const membership of userCampaigns) {
        const campaign = membership.campaigns
        
        // Add recent document updates
        const recentDocs = campaign.campaign_documents
          .filter((doc: any) => {
            const updatedDate = new Date(doc.updated_at)
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            return updatedDate > sevenDaysAgo && doc.updated_by !== user.id
          })

        for (const doc of recentDocs) {
          feedItems.push({
            type: 'campaign_document_update',
            title: `Campaign Update: ${campaign.name}`,
            description: `New document: ${doc.title}`,
            data: {
              campaign_id: campaign.id,
              document_id: doc.id
            },
            created_at: doc.updated_at,
            priority: 'medium'
          })
        }
      }
    }

    // Sort feed items by date (newest first) and priority
    feedItems.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = (priorityOrder[b.priority as keyof typeof priorityOrder] || 1) - 
                          (priorityOrder[a.priority as keyof typeof priorityOrder] || 1)
      
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    // Apply filters if specified
    let filteredItems = feedItems
    if (feed_types && feed_types.length > 0) {
      filteredItems = feedItems.filter(item => feed_types.includes(item.type))
    }

    // Apply pagination
    const paginatedItems = filteredItems.slice(offset, offset + limit)

    // Store in newsfeed table for caching (optional)
    const feedInserts = paginatedItems.map(item => ({
      user_id: user.id,
      feed_type: item.type,
      title: item.title,
      content: item.description,
      data: item.data,
      priority: item.priority,
      created_at: item.created_at,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }))

    if (feedInserts.length > 0) {
      await supabaseAdmin
        .from('newsfeed')
        .upsert(feedInserts, { 
          onConflict: 'user_id,feed_type,created_at' 
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          items: paginatedItems,
          pagination: {
            page,
            limit,
            total: filteredItems.length,
            hasMore: (offset + limit) < filteredItems.length
          }
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