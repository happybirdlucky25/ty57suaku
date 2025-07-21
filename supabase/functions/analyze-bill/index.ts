// Base configuration for edge function
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

interface BillAnalysisRequest {
  billId: string;
  analysisType: 'summary' | 'impact' | 'compliance';
}

Deno.serve(async (req) => {
  try {
    const { billId, analysisType } = await req.json() as BillAnalysisRequest

    // Get bill data from database
    const { data: bill, error: billError } = await supabaseAdmin
      .from('bills')
      .select(`
        bill_id,
        title,
        description,
        documents (
          document_id,
          document_type,
          url
        )
      `)
      .eq('bill_id', billId)
      .single()

    if (billError) throw billError

    // TODO: Implement analysis logic based on analysisType
    const analysis = await analyzeBill(bill, analysisType)

    // Store analysis result
    const { error: reportError } = await supabaseAdmin
      .from('bill_reports')
      .insert({
        bill_id: billId,
        report_type: analysisType,
        content: analysis,
        completed_at: new Date().toISOString()
      })

    if (reportError) throw reportError

    return new Response(
      JSON.stringify({ success: true, data: analysis }),
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
