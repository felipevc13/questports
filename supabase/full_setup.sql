-- =========================================================
-- QuestPorts: Complete Database Setup (Schema + Seed)
-- Run this script in: https://supabase.com/dashboard/project/ccjteoxolasldhfgnoyx/sql/new
-- =========================================================

-- 1. Create Enums
DO $$ BEGIN
  CREATE TYPE port_category AS ENUM (
    'source_port',
    'vr_injection',
    'emulator',
    'game_mod'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE port_status AS ENUM (
    'released',
    'playable_beta',
    'in_development'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create Table
CREATE TABLE IF NOT EXISTS public.ports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  developer text NOT NULL DEFAULT 'Team Beef',
  developer_url text,
  short_description text,
  category port_category NOT NULL DEFAULT 'source_port',
  status port_status NOT NULL DEFAULT 'released',
  
  -- Media
  cover_image_url text,
  youtube_video_id text,
  
  -- Hardware & Compatibility
  supported_hardware text[] NOT NULL DEFAULT '{"Quest 2", "Quest 3", "Quest 3S"}',
  locomotion_types text[] DEFAULT '{"Smooth Locomotion"}',
  has_6dof_controls boolean NOT NULL DEFAULT true,
  
  -- Installation details & Links
  internal_storage_path text,
  base_game_url text,
  base_game_store text,
  port_download_url text NOT NULL,
  port_download_source text,
  
  -- Detailed Guide (Markdown)
  installation_guide text,
  troubleshooting_notes text,

  github_url text,
  last_github_update timestamptz,
  latest_version text,

  -- Metadata
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Row Level Security (Public Read-Only)
ALTER TABLE public.ports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-only access on ports" ON public.ports;
CREATE POLICY "Allow public read-only access on ports"
  ON public.ports FOR SELECT
  USING (true);

-- 4. Initial Seed Data (8 Consolidated Ports)
INSERT INTO public.ports (
  slug,
  title,
  developer,
  developer_url,
  short_description,
  category,
  status,
  cover_image_url,
  youtube_video_id,
  supported_hardware,
  locomotion_types,
  has_6dof_controls,
  internal_storage_path,
  base_game_url,
  base_game_store,
  port_download_url,
  port_download_source,
  featured,
  installation_guide,
  troubleshooting_notes
) VALUES
(
  'rtcwquest',
  'RTCWQuest (Return to Castle Wolfenstein)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Full 6DoF VR source port of Return to Castle Wolfenstein by Team Beef featuring dual-wield weapons, gesture interactions, and roomscale immersion.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  '2r9t4m3dKqA',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Smooth Turn'],
  true,
  '/sdcard/RTCWQuest/',
  'https://store.steampowered.com/app/9010/Return_to_Castle_Wolfenstein/',
  'Steam',
  'https://sidequestvr.com/app/1446/rtcwquest',
  'SideQuest',
  true,
  '### Prerequisites
* A legally owned copy of *Return to Castle Wolfenstein* (Steam or GOG).
* Meta Quest headset with Developer Mode enabled or the SideQuest app (Desktop or Android).

### Step-by-Step Installation
1. Install the **RTCWQuest** APK using SideQuest or run `adb install rtcwquest.apk`.
2. Launch RTCWQuest once inside your headset to allow it to initialize folder permissions, then exit.
3. On your computer, open your base game''s installation directory in Steam:
   `steamapps/common/Return to Castle Wolfenstein/Main/`
4. Copy the following `.pk3` game files:
   * `pak0.pk3`
   * `sp_pak1.pk3`
   * `sp_pak2.pk3`
   * `sp_pak3.pk3`
   * `sp_pak4.pk3`
5. Connect your Quest to your PC via USB and copy these files into:
   `/sdcard/RTCWQuest/main/`
6. Put on your headset and launch RTCWQuest from the "Unknown Sources" library tab.',
  'If the game crashes on startup, ensure that all .pk3 file extensions are in lowercase on the Quest storage.'
),
(
  'lambda1vr',
  'Lambda1VR (Half-Life 1)',
  'Team Beef',
  'https://www.lambda1vr.com/',
  'Complete native 6DoF VR port of legendary Half-Life 1 with two-handed weapon handling, headlamp flashlight, and full campaign progression.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  'v8c0wZpUeGg',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Teleport', 'Snap Turn'],
  true,
  '/sdcard/xash/',
  'https://store.steampowered.com/app/70/HalfLife/',
  'Steam',
  'https://www.lambda1vr.com/',
  'Official Website / SideQuest',
  true,
  '### Prerequisites
* Original Half-Life 1 on Steam.
* Lambda1VR launcher installed via SideQuest.

### Step-by-Step Installation
1. Install **Lambda1VR** through SideQuest.
2. Launch the app once on the headset so it generates the `/sdcard/xash/` directory structure.
3. On your PC, navigate to your Steam installation of Half-Life: `Half-Life/valve/`.
4. Copy the contents of the `valve` folder.
5. Paste the copied files into `/sdcard/xash/valve/` on your Meta Quest.
6. Launch Lambda1VR from "Unknown Sources" in your app library.',
  'For high-resolution textures and enhanced models, download the optional HD Mod Pack from the official Lambda1VR website.'
),
(
  'doom3quest',
  'Doom 3: Quest Edition',
  'Team Beef',
  'https://www.doom3quest.com/',
  'Full immersive virtual reality port of the original id Tech 4 Doom 3 masterpiece running standalone on Meta Quest.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  '0wFw8F9tVzU',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn', 'Comfort Vignette'],
  true,
  '/sdcard/Doom3Quest/',
  'https://store.steampowered.com/app/9050/DOOM_3/',
  'Steam',
  'https://www.doom3quest.com/',
  'Doom3Quest.com',
  true,
  '### Prerequisites
* **Original 2004 Doom 3** (Note: Doom 3: BFG Edition is **NOT** compatible).
* SideQuest or ADB installed on your computer.

### Step-by-Step Installation
1. Install the Doom3Quest APK launcher via SideQuest.
2. Connect your Quest and open file explorer at `/sdcard/Doom3Quest/base/`.
3. From your original 2004 Doom 3 install on PC (`DOOM 3/base/`), copy all `.pk4` files (`pak000.pk4` through `pak008.pk4`).
4. Paste the `.pk4` files into `/sdcard/Doom3Quest/base/`.
5. Launch Doom3Quest on your headset.',
  'Do not use files from the BFG Edition or modern remasters. Only the classic 2004 release is supported.'
),
(
  'citravr',
  'CitraVR',
  'amwatson',
  'https://github.com/amwatson/CitraVR',
  'Official Nintendo 3DS standalone emulator for Meta Quest featuring stereoscopic 3D rendering and customizable virtual screens.',
  'emulator',
  'released',
  'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&w=1200&q=80',
  '5j39kF2z1xA',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Roomscale', 'Seated'],
  true,
  '/sdcard/CitraVR/',
  NULL,
  NULL,
  'https://github.com/amwatson/CitraVR/releases',
  'GitHub Releases',
  true,
  '### Prerequisites
* Legally dumped, decrypted Nintendo 3DS ROMs (.3ds or installed .cia format).
* Meta Quest 3 or 3S recommended for optimal 60 FPS performance at 3x native resolution.

### Step-by-Step Installation
1. Download the latest APK release from the official CitraVR GitHub repository.
2. Install the APK via SideQuest or `adb install CitraVR.apk`.
3. Create the folder `/sdcard/CitraVR/roms/` on your headset and transfer your game ROMs.
4. Launch CitraVR under Unknown Sources and select your ROMs directory.',
  'On Quest 3 and 3S, increase internal resolution scale to 3x in graphics settings for crisp stereoscopic 3D clarity.'
),
(
  'questzdoom',
  'QuestZDoom',
  'Team Beef & BaggyG',
  'https://www.questzdoom.com/',
  'GZDoom source port engine for Meta Quest. Experience Doom 1, Doom 2, Brutal Doom, Heretic, and thousands of community mods in full 6DoF VR.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1200&q=80',
  't89zQf6B2yM',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Teleport'],
  true,
  '/sdcard/QuestZDoom/',
  'https://store.steampowered.com/app/2280/Ultimate_Doom/',
  'Steam',
  'https://www.questzdoom.com/',
  'QuestZDoom Launcher',
  false,
  '### Installation
1. Install both **QuestZDoom Engine** and the **QuestZDoom Launcher** via SideQuest.
2. Launch the launcher inside the headset to auto-download free shareware WADs, or transfer your commercial `.wad` files (such as DOOM.WAD, DOOM2.WAD) into `/sdcard/QuestZDoom/wads/`.
3. Use the in-headset launcher UI to toggle mods, high-res texture packs, and 3D weapon models with a single click.',
  'Use the in-headset QuestZDoom Launcher to download and manage mods directly without needing a PC.'
),
(
  'jkxr',
  'JKXR (Star Wars Jedi Knight II: Jedi Outcast)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Wield lightsabers with 1:1 motion tracking and cast Force powers naturally using real-world hand gestures in the classic Jedi Outcast.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  '8pLw4z7K1rE',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/JKXR/',
  'https://store.steampowered.com/app/6030/STAR_WARS_Jedi_Knight_II__Jedi_Outcast/',
  'Steam',
  'https://sidequestvr.com/app/11796/jkxr-star-wars-jedi-knight-ii-jedi-outcast-vr',
  'SideQuest',
  false,
  '### Step-by-Step Installation
1. Install the JKXR APK from SideQuest.
2. On your PC, navigate to your Jedi Knight II installation folder: `Steam/steamapps/common/Jedi Outcast/GameData/base/`.
3. Copy `assets0.pk3`, `assets1.pk3`, `assets2.pk3`, and `assets5.pk3`.
4. Connect your Quest and copy these files into `/sdcard/JKXR/base/`.
5. Open the game from Unknown Sources and begin Jedi training!',
  'Natural gestures trigger Force powers: push your hand forward for Force Push, or gesture toward yourself for Force Pull.'
),
(
  'quake2quest',
  'Quake II Quest',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Classic sci-fi shooter by id Software rebuilt for standalone Quest with HD textures, cross-play multiplayer, and dynamic lighting.',
  'source_port',
  'released',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
  '9qVb3Zx8W1A',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S', 'Quest Pro'],
  ARRAY['Smooth Locomotion'],
  true,
  '/sdcard/Quake2Quest/',
  'https://store.steampowered.com/app/2320/Quake_II/',
  'Steam',
  'https://sidequestvr.com/app/353/quake2quest',
  'SideQuest',
  false,
  '### Step-by-Step Installation
1. Install Quake II Quest via SideQuest.
2. Copy the `baseq2` folder from your PC game installation (`pak0.pak` and official mission packs).
3. Paste into `/sdcard/Quake2Quest/baseq2/` on your Meta Quest.',
  'Original soundtrack files can be placed in an optional music subfolder in OGG or MP3 format.'
),
(
  'preyvr',
  'Prey VR (Prey 2006 Quest Port)',
  'Team Beef',
  'https://www.patreon.com/teambeef',
  'Mind-bending FPS with wall-walking gravity and living alien portals running natively under the id Tech 4 engine on Meta Quest.',
  'source_port',
  'playable_beta',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  '1vRt8b5G2kL',
  ARRAY['Quest 2', 'Quest 3', 'Quest 3S'],
  ARRAY['Smooth Locomotion', 'Snap Turn'],
  true,
  '/sdcard/preyvr/',
  NULL,
  'Original DVD / Archive',
  'https://www.patreon.com/teambeef',
  'Team Beef Patreon',
  false,
  '### Installation
1. Install the beta APK build provided through Team Beef.
2. Copy the `.pk4` files from your original retail Prey (2006) PC installation into `/sdcard/PreyVR/base/`.
3. Launch the game from Unknown Sources.',
  'Requires strong VR motion tolerance due to disorienting wall-walking and inverted gravity physics.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  developer = EXCLUDED.developer,
  developer_url = EXCLUDED.developer_url,
  short_description = EXCLUDED.short_description,
  category = EXCLUDED.category,
  status = EXCLUDED.status,
  cover_image_url = EXCLUDED.cover_image_url,
  youtube_video_id = EXCLUDED.youtube_video_id,
  supported_hardware = EXCLUDED.supported_hardware,
  locomotion_types = EXCLUDED.locomotion_types,
  has_6dof_controls = EXCLUDED.has_6dof_controls,
  internal_storage_path = EXCLUDED.internal_storage_path,
  base_game_url = EXCLUDED.base_game_url,
  base_game_store = EXCLUDED.base_game_store,
  port_download_url = EXCLUDED.port_download_url,
  port_download_source = EXCLUDED.port_download_source,
  featured = EXCLUDED.featured,
  installation_guide = EXCLUDED.installation_guide,
  troubleshooting_notes = EXCLUDED.troubleshooting_notes,
  updated_at = now();
