-- Migration: Update Port Categories (Exact Technical Taxonomy)
-- Adds: decompilation, engine_recreation, wrapper

ALTER TYPE port_category ADD VALUE IF NOT EXISTS 'decompilation';
ALTER TYPE port_category ADD VALUE IF NOT EXISTS 'engine_recreation';
ALTER TYPE port_category ADD VALUE IF NOT EXISTS 'wrapper';

-- 1. Source Ports (11)
UPDATE ports SET category = 'source_port' WHERE slug IN (
  'doom3quest',
  'rtcwquest',
  'quakequest',
  'quake2quest',
  'jkxr',
  'hexen2vr',
  'razexr',
  'preyvr',
  'avp-vr',
  'questsam',
  'sourcevr'
);

-- 2. Decompilations (11)
UPDATE ports SET category = 'decompilation' WHERE slug IN (
  'perfect-dark-vr',
  'goldeneye-vr',
  'simpsonshitrun',
  'time-crisis-vr',
  'halocequest',
  'vice-city-vr-quest',
  'gta-sa-vr-quest',
  'galaxyquest',
  'gran-turismo-2-vr',
  'harry-potter-vr',
  'road-rash-jailbreak-vr'
);

-- 3. Engine Recreations (6)
UPDATE ports SET category = 'engine_recreation' WHERE slug IN (
  'beefraiderxr',
  'lambda1vr',
  'csvr',
  'questzdoom',
  'gothic2-vr',
  'questcarnage'
);

-- 4. Emulators (4)
UPDATE ports SET category = 'emulator' WHERE slug IN (
  'citravr',
  'ppsspp-vr',
  'astroquest',
  'primedgun'
);

-- 5. Wrappers & Compatibility Layers (3)
UPDATE ports SET category = 'wrapper' WHERE slug IN (
  'qualyx',
  'questcraft',
  'winlatorxr'
);

-- 6. VR Injections / Mods (1)
UPDATE ports SET category = 'vr_injection' WHERE slug IN (
  'iron-lung-vr'
);
