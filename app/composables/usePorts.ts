import { INITIAL_PORTS, mockPortInstallCount } from '~/data/mockPorts'
import { applyRecordedFeatures } from '~/data/recordedPortFeatures'
import { versionedCoverUrl } from '~/data/coverUrl'
import type { Port } from '~/types/port'

const CATALOG_SELECT = '*, ports_install_count(installs, last_install_at)'

function withLocalCover(port: Port, mediaBase: string): Port {
  return {
    ...port,
    cover_image_url: versionedCoverUrl(port.cover_image_url, mediaBase)
  }
}

function readInstallCount(value: unknown): number {
  const row = Array.isArray(value) ? value[0] : value
  if (!row || typeof row !== 'object' || !('installs' in row)) return 0
  const raw = (row as { installs?: unknown }).installs
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : 0
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.floor(n)
}

function attachInstallCount(row: Port & { ports_install_count?: unknown }, mediaBase: string): Port {
  const installs = readInstallCount(row.ports_install_count)
  const { ports_install_count: _embed, ...port } = row
  return withLocalCover({ ...port, installs }, mediaBase)
}

function mockPort(port: Port, mediaBase: string): Port {
  return applyRecordedFeatures(withLocalCover({
    ...port,
    installs: mockPortInstallCount(port.slug)
  }, mediaBase))
}

export const usePorts = () => {
  const { client, isConfigured } = useSupabase()
  const mediaBase = String(useRuntimeConfig().public.mediaBase || '')

  const fetchPorts = async (): Promise<Port[]> => {
    if (isConfigured && client) {
      try {
        const embedded = await client
          .from('ports')
          .select(CATALOG_SELECT)
          .order('featured', { ascending: false })
          .order('title', { ascending: true })

        if (!embedded.error && embedded.data && embedded.data.length > 0) {
          return (embedded.data as Array<Port & { ports_install_count?: unknown }>).map(row => attachInstallCount(row, mediaBase))
        }

        if (embedded.error) {
          console.warn('[QuestPorts] Catalog install counts unavailable, loading ports without them:', embedded.error.message)
        }

        const { data, error } = await client
          .from('ports')
          .select('*')
          .order('featured', { ascending: false })
          .order('title', { ascending: true })

        if (!error && data && data.length > 0) {
          return (data as Port[]).map(port => withLocalCover({ ...port, installs: 0 }, mediaBase))
        }
      } catch (err) {
        console.warn('Failed to connect to Supabase, falling back to local dataset:', err)
      }
    }
    return INITIAL_PORTS.map(port => mockPort(port, mediaBase))
  }

  const fetchPortBySlug = async (slug: string): Promise<Port | null> => {
    if (isConfigured && client) {
      try {
        const embedded = await client
          .from('ports')
          .select(CATALOG_SELECT)
          .eq('slug', slug)
          .single()

        if (!embedded.error && embedded.data) {
          return attachInstallCount(embedded.data as Port & { ports_install_count?: unknown }, mediaBase)
        }

        if (embedded.error && embedded.error.code !== 'PGRST116') {
          console.warn(`[QuestPorts] Install count unavailable for ${slug}:`, embedded.error.message)
          const { data, error } = await client
            .from('ports')
            .select('*')
            .eq('slug', slug)
            .single()
          if (!error && data) return withLocalCover({ ...(data as Port), installs: 0 }, mediaBase)
        }
      } catch (err) {
        console.warn(`Failed to fetch port ${slug} from Supabase:`, err)
      }
    }
    const local = INITIAL_PORTS.find(p => p.slug === slug)
    return local ? mockPort(local, mediaBase) : null
  }

  return {
    fetchPorts,
    fetchPortBySlug
  }
}
