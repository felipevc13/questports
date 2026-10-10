export type PortCategory =
  | 'source_port'
  | 'decompilation'
  | 'engine_recreation'
  | 'emulator'
  | 'wrapper'
  | 'vr_injection'
  | 'game_mod'

export type PortStatus = 'released' | 'playable_beta' | 'in_development'

/** Confirmed support. Omit the key when it has not been recorded. */
export type FeatureSupport = 'full' | 'partial' | 'none'

export type ComfortVignette = 'adjustable' | 'on' | 'none'

export type HapticSupport = 'active' | 'none'

export type ComfortRating = 'Comfortable' | 'Moderate' | 'Intense'

export interface PortFeatures {
  /** How motion controls work, e.g. "1:1 tracked pistol". */
  motion_controls?: string | null
  left_handed?: FeatureSupport | null
  /** Named physical interaction, e.g. "Virtual holsters". */
  physical_interaction?: string | null
  haptics?: HapticSupport | null
  comfort_vignette?: ComfortVignette | null
  /** Named play modes. Do not store a count. */
  play_modes?: string[] | null
  /** Stereo rendering as stated for this port, e.g. "Optional stereoscopic 3D". */
  stereo?: string | null
  /** Refresh as stated for this port, e.g. "72/90/120Hz" or "Adjustable". */
  refresh?: string | null
  spatial_audio?: string | null
  comfort_rating?: ComfortRating | null
}

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
  /**
   * Optional VR claims recorded for this port. A missing key or null means
   * unknown and must not be shown as a confirmed check.
   * Tracking still comes from has_6dof_controls, locomotion from
   * locomotion_types, and headsets from supported_hardware.
   */
  features?: PortFeatures | null
  internal_storage_path: string | null
  original_game?: string | null
  base_game_url: string | null
  base_game_store: string | null
  github_url?: string | null
  last_github_update?: string | null
  latest_version?: string | null
  port_download_url?: string | null
  /**
   * Asset size in bytes when the catalog already has it. Absent means unknown.
   * WebUSB uses this to skip one-click before asking the proxy. Do not fetch
   * it just to fill this in.
   */
  download_bytes?: number | null
  port_download_source: string | null
  featured: boolean
  installation_guide: string | null
  troubleshooting_notes: string | null
  created_at?: string
  updated_at?: string
  /**
   * Distinct devices that installed this port through QuestPorts, all versions.
   * Attached by the catalog query from port_install_counts. Missing means unknown
   * or zero, not "installed on this headset".
   */
  installs?: number
}
