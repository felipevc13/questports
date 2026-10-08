import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

/** Service-role client. Null when the server key is not configured. Never import this from Vue. */
export function supabaseAdmin(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || process.env.SUPABASE_URL || '')
  const key = String(config.supabaseServiceRoleKey || '')
  if (!url || !key || url.includes('your-project-id')) return null
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  }
  return cached
}
