import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface UserProfileRequest {
  full_name?: string
  title?: string
  company?: string
  phone?: string
}

Deno.serve(async (req) => {
  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    // Verify user from JWT
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid authentication')
    }

    const profileData = await req.json() as UserProfileRequest

    // Upsert user profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        full_name: profileData.full_name,
        title: profileData.title,
        company: profileData.company,
        phone: profileData.phone,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: 'Profile updated successfully' 
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