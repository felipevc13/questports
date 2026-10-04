import { INITIAL_PORTS } from '~/data/mockPorts'
import type { Port, PortCategory, PortStatus } from '~/types/port'

export const usePorts = () => {
  const { client, isConfigured } = useSupabase()

  const fetchPorts = async (): Promise<Port[]> => {
    if (isConfigured && client) {
      try {
        const { data, error } = await client
          .from('ports')
          .select('*')
          .order('featured', { ascending: false })
          .order('title', { ascending: true })

        if (!error && data && data.length > 0) {
          return data as Port[]
        }
      } catch (err) {
        console.warn('Failed to connect to Supabase, falling back to local dataset:', err)
      }
    }
    return INITIAL_PORTS
  }

  const fetchPortBySlug = async (slug: string): Promise<Port | null> => {
    if (isConfigured && client) {
      try {
        const { data, error } = await client
          .from('ports')
          .select('*')
          .eq('slug', slug)
          .single()

        if (!error && data) {
          return data as Port
        }
      } catch (err) {
        console.warn(`Failed to fetch port ${slug} from Supabase:`, err)
      }
    }
    return INITIAL_PORTS.find(p => p.slug === slug) || null
  }

  return {
    fetchPorts,
    fetchPortBySlug
  }
}
