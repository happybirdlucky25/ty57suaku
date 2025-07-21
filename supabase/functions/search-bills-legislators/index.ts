import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface SearchRequest {
  query?: string
  type: 'bills' | 'legislators' | 'both'
  filters?: {
    status?: string[]
    state?: string[]
    party?: string[]
    chamber?: string[]
  }
  page?: number
  limit?: number
}

Deno.serve(async (req) => {
  try {
    const { query, type, filters, page = 1, limit = 20 } = await req.json() as SearchRequest
    const offset = (page - 1) * limit

    let results: any = {}

    if (type === 'bills' || type === 'both') {
      let billQuery = supabaseAdmin
        .from('bills')
        .select(`
          bill_id,
          bill_number,
          title,
          description,
          status,
          status_date
        `)

      // Apply text search
      if (query) {
        billQuery = billQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,bill_number.ilike.%${query}%`)
      }

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        billQuery = billQuery.in('status', filters.status)
      }

      // Add pagination
      billQuery = billQuery.range(offset, offset + limit - 1)

      const { data: bills, error: billsError } = await billQuery
      if (billsError) throw billsError

      results.bills = bills || []
    }

    if (type === 'legislators' || type === 'both') {
      let legislatorQuery = supabaseAdmin
        .from('people')
        .select(`
          people_id,
          full_name,
          party,
          chamber,
          state
        `)

      // Apply text search
      if (query) {
        legislatorQuery = legislatorQuery.ilike('full_name', `%${query}%`)
      }

      // Apply filters
      if (filters?.party && filters.party.length > 0) {
        legislatorQuery = legislatorQuery.in('party', filters.party)
      }

      if (filters?.chamber && filters.chamber.length > 0) {
        legislatorQuery = legislatorQuery.in('chamber', filters.chamber)
      }

      if (filters?.state && filters.state.length > 0) {
        legislatorQuery = legislatorQuery.in('state', filters.state)
      }

      // Add pagination
      legislatorQuery = legislatorQuery.range(offset, offset + limit - 1)

      const { data: legislators, error: legislatorsError } = await legislatorQuery
      if (legislatorsError) throw legislatorsError

      results.legislators = legislators || []
    }

    // Get totals for pagination
    let totalCounts: any = {}

    if (type === 'bills' || type === 'both') {
      let countQuery = supabaseAdmin
        .from('bills')
        .select('*', { count: 'exact', head: true })

      if (query) {
        countQuery = countQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,bill_number.ilike.%${query}%`)
      }

      if (filters?.status && filters.status.length > 0) {
        countQuery = countQuery.in('status', filters.status)
      }

      const { count: billsCount } = await countQuery
      totalCounts.bills = billsCount || 0
    }

    if (type === 'legislators' || type === 'both') {
      let countQuery = supabaseAdmin
        .from('people')
        .select('*', { count: 'exact', head: true })

      if (query) {
        countQuery = countQuery.ilike('full_name', `%${query}%`)
      }

      if (filters?.party && filters.party.length > 0) {
        countQuery = countQuery.in('party', filters.party)
      }

      if (filters?.chamber && filters.chamber.length > 0) {
        countQuery = countQuery.in('chamber', filters.chamber)
      }

      if (filters?.state && filters.state.length > 0) {
        countQuery = countQuery.in('state', filters.state)
      }

      const { count: legislatorsCount } = await countQuery
      totalCounts.legislators = legislatorsCount || 0
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: results,
        pagination: {
          page,
          limit,
          total: totalCounts
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