import { INITIAL_PORTS } from '~/data/mockPorts'
import { resolveCoverUrl } from '~/data/coverUrl'
import type { Port, PortCategory, PortStatus } from '~/types/port'

function withLocalCover(port: Port): Port {
  return {
    ...port,
    cover_image_url: resolveCoverUrl(port.cover_image_url)
  }
}

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
          return (data as Port[]).map(withLocalCover)
        }
      } catch (err) {
        console.warn('Failed to connect to Supabase, falling back to local dataset:', err)
      }
    }
    return INITIAL_PORTS.map(withLocalCover)
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
          return withLocalCover(data as Port)
        }
      } catch (err) {
        console.warn(`Failed to fetch port ${slug} from Supabase:`, err)
      }
    }
    const local = INITIAL_PORTS.find(p => p.slug === slug)
    return local ? withLocalCover(local) : null
  }

  return {
    fetchPorts,
    fetchPortBySlug
  }
}
