export type PortCategory =
  | 'source_port'
  | 'decompilation'
  | 'engine_recreation'
  | 'emulator'
  | 'wrapper'
  | 'vr_injection'
  | 'game_mod'

export type PortStatus = 'released' | 'playable_beta' | 'in_development'

export type PortWorkflowType =
  | 'direct'           // ⚡ Direct Sideload (APK only)
  | 'pc_assets'        // 📁 Steam / PC Original Files
  | 'obb_extractor'    // 📦 Android OBB / Mobile Extractor (GTA SA, VC)
  | 'smart_converter'  // ⚙️ Console Decomp / Endian Converter (Mario Galaxy, Zelda OOT)
  | 'emulator_roms'    // 🕹️ Emulator & ROMs Manager (Citra VR, PPSSPP VR)

export interface Port {
  id: string
  slug: string
  title: string
  short_description: string | null
  developer: string
  developer_url?: string | null
  category: PortCategory
  status: PortStatus
  install_workflow?: PortWorkflowType
  cover_image_url: string | null
  youtube_video_id: string | null
  video_url?: string | null
  video_preview_url?: string | null
  video_preview_start?: number | null
  video_preview_end?: number | null
  supported_hardware: string[]
  locomotion_types: string[]
  has_6dof_controls: boolean
  has_motion_controls?: boolean
  internal_storage_path: string | null
  original_game?: string | null
  base_game_url: string | null
  base_game_store: string | null
  github_url?: string | null
  last_github_update?: string | null
  latest_version?: string | null
  port_download_url?: string | null
  port_download_source: string | null
  featured: boolean
  installation_guide: string | null
  troubleshooting_notes: string | null
  created_at?: string
  updated_at?: string
}
