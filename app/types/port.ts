export type PortCategory = 'source_port' | 'vr_injection' | 'emulator' | 'game_mod'

export type PortStatus = 'released' | 'playable_beta' | 'in_development'

export interface Port {
  id: string
  slug: string
  title: string
  short_description: string | null
  developer: string
  developer_url?: string | null
  category: PortCategory
  status: PortStatus
  cover_image_url: string | null
  youtube_video_id: string | null
  supported_hardware: string[]
  locomotion_types: string[]
  has_6dof_controls: boolean
  internal_storage_path: string | null
  base_game_url: string | null
  base_game_store: string | null
  github_url?: string | null
  port_download_url: string
  port_download_source: string | null
  featured: boolean
  installation_guide: string | null
  troubleshooting_notes: string | null
  created_at?: string
  updated_at?: string
}
