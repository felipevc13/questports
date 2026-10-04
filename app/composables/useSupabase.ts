import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const useSupabase = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  const isConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id'))

  if (!client && isConfigured) {
    client = createClient(supabaseUrl, supabaseKey)
  }

  return {
    client,
    isConfigured
  }
}
