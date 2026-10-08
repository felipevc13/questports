-- Backfill VR feature claims only where the catalog already states them.
-- Apply manually in the Supabase SQL editor after 20261008230000_port_features.sql.
-- Do not run this from CI or against production from the agent.
--
-- Updates run only when features is null, so a later edit in the table is kept.
-- To refill a port, set features back to null and run that port's statement again.
-- Ports that are not listed stay null: the detail page must not show a checkmark for them.
-- Comfort ratings and left-handed support are not filled. No port text states them.
-- The same values are the offline fallback in app/data/recordedPortFeatures.ts.

begin;

-- lambda1vr: short_description: two-handed weapon handling
update public.ports
   set features = $features${"motion_controls":"Two-handed weapon handling"}$features$::jsonb
 where slug = 'lambda1vr'
   and features is null;

-- jkxr: short_description: 1:1 motion tracking and real-world hand gestures
update public.ports
   set features = $features${"motion_controls":"1:1 motion tracking","physical_interaction":"Hand gestures"}$features$::jsonb
 where slug = 'jkxr'
   and features is null;

-- citravr: short_description: stereoscopic 3D rendering
update public.ports
   set features = $features${"stereo":"Stereoscopic 3D"}$features$::jsonb
 where slug = 'citravr'
   and features is null;

-- ppsspp-vr: troubleshooting_notes: toggle stereoscopic 3D rendering
update public.ports
   set features = $features${"stereo":"Optional stereoscopic 3D"}$features$::jsonb
 where slug = 'ppsspp-vr'
   and features is null;

-- time-crisis-vr: short_description, install guide (physical ducking), and troubleshooting note (120 Hz)
update public.ports
   set features = $features${"motion_controls":"1:1 tracked pistol","physical_interaction":"Physical ducking","refresh":"120Hz"}$features$::jsonb
 where slug = 'time-crisis-vr'
   and features is null;

-- primedgun: short_description and install guide: 1:1 tracked Arm Cannon
update public.ports
   set features = $features${"motion_controls":"1:1 tracked Arm Cannon"}$features$::jsonb
 where slug = 'primedgun'
   and features is null;

-- astroquest: short_description and install guide: hand-tracked DualSense and 3D audio
update public.ports
   set features = $features${"motion_controls":"Hand-tracked DualSense","spatial_audio":"3D audio"}$features$::jsonb
 where slug = 'astroquest'
   and features is null;

-- sourcevr: install guide bullet for Half-Life 2 motion controls only
update public.ports
   set features = $features${"motion_controls":"6DoF motion controls (Half-Life 2)"}$features$::jsonb
 where slug = 'sourcevr'
   and features is null;

-- simpsonshitrun: install guide: steering wheel, native stereo multiview, adjustable refresh (no Hz list)
update public.ports
   set features = $features${"motion_controls":"Motion-controlled steering wheel","stereo":"Native stereo 3D","refresh":"Adjustable"}$features$::jsonb
 where slug = 'simpsonshitrun'
   and features is null;

-- halocequest: install guide: two-handed weapons and physical gestures
update public.ports
   set features = $features${"motion_controls":"Two-handed weapons","physical_interaction":"Physical gestures"}$features$::jsonb
 where slug = 'halocequest'
   and features is null;

-- galaxyquest: install guide: diorama, 120Hz virtual screen, optional stereo, tracked laser
update public.ports
   set features = $features${"motion_controls":"Tracked Star Bit laser","play_modes":["3D diorama","Giant virtual screen"],"stereo":"Optional stereo 3D (virtual screen)","refresh":"120Hz (virtual screen)"}$features$::jsonb
 where slug = 'galaxyquest'
   and features is null;

-- qualyx: install guide: Gravity Gloves and 72Hz display
update public.ports
   set features = $features${"physical_interaction":"Gravity gloves","refresh":"72Hz"}$features$::jsonb
 where slug = 'qualyx'
   and features is null;

-- goldeneye-vr: install guide: two-handed grip, Stereo VR or virtual screen
update public.ports
   set features = $features${"motion_controls":"Two-handed grip","play_modes":["Stereo VR","Virtual screen"],"stereo":"Stereo VR"}$features$::jsonb
 where slug = 'goldeneye-vr'
   and features is null;

-- questcarnage: install guide and troubleshooting: Touch mapping, stereo cockpit, 72/90/120Hz
update public.ports
   set features = $features${"motion_controls":"Touch controller mapping","stereo":"Stereo cockpit","refresh":"72/90/120Hz"}$features$::jsonb
 where slug = 'questcarnage'
   and features is null;

-- gta-sa-vr-quest: short_description: motion controller gunplay
update public.ports
   set features = $features${"motion_controls":"Motion controller gunplay"}$features$::jsonb
 where slug = 'gta-sa-vr-quest'
   and features is null;

-- vice-city-vr-quest: short_description: motion aiming, physical steering wheel, Vulkan stereo
update public.ports
   set features = $features${"motion_controls":"Motion-tracked weapon aiming","physical_interaction":"Physical steering wheel","stereo":"Vulkan stereo"}$features$::jsonb
 where slug = 'vice-city-vr-quest'
   and features is null;

-- gran-turismo-2-vr: install guide: stereoscopic cockpit, three steering modes, 72/90/120Hz
update public.ports
   set features = $features${"motion_controls":"Virtual wheel, motion steering, or stick","stereo":"Stereoscopic cockpit","refresh":"72/90/120Hz"}$features$::jsonb
 where slug = 'gran-turismo-2-vr'
   and features is null;

-- gothic2-vr: install guide: physical melee, archery, and virtual holsters
update public.ports
   set features = $features${"motion_controls":"Motion-tracked melee and archery","physical_interaction":"Virtual holsters"}$features$::jsonb
 where slug = 'gothic2-vr'
   and features is null;

-- harry-potter-vr: short_description: motion-tracked wand spellcasting
update public.ports
   set features = $features${"motion_controls":"Motion-tracked wand"}$features$::jsonb
 where slug = 'harry-potter-vr'
   and features is null;

-- road-rash-jailbreak-vr: install guide: stereoscopic 6DoF and 3D spatialized audio
update public.ports
   set features = $features${"stereo":"Stereoscopic 6DoF","spatial_audio":"3D spatialized audio"}$features$::jsonb
 where slug = 'road-rash-jailbreak-vr'
   and features is null;

-- perfect-dark-vr: install guide: dual wielding
update public.ports
   set features = $features${"motion_controls":"Dual wielding"}$features$::jsonb
 where slug = 'perfect-dark-vr'
   and features is null;

-- avp-vr: install guide: native 120Hz mode and field-of-view comfort blinders
update public.ports
   set features = $features${"comfort_vignette":"on","refresh":"120Hz"}$features$::jsonb
 where slug = 'avp-vr'
   and features is null;

-- questsam: install guide: dual wielding and first-person, third-person, or diorama
update public.ports
   set features = $features${"motion_controls":"Dual wielding","play_modes":["First-person","Third-person","Roomscale diorama"]}$features$::jsonb
 where slug = 'questsam'
   and features is null;

-- iron-lung-vr: install guide: seated play and physical switches and valves
update public.ports
   set features = $features${"physical_interaction":"Physical switches and valves","play_modes":["Seated"]}$features$::jsonb
 where slug = 'iron-lung-vr'
   and features is null;

-- ut99-vr-quest: install guide overview: motion controls, two-handed weapons, haptics, true stereo
update public.ports
   set features = $features${"motion_controls":"6DoF motion controls","physical_interaction":"Two-handed weapons","haptics":"active","stereo":"True stereo OpenXR"}$features$::jsonb
 where slug = 'ut99-vr-quest'
   and features is null;

-- nolf-vr: short_description: motion-controlled weapons
update public.ports
   set features = $features${"motion_controls":"Motion-controlled weapons"}$features$::jsonb
 where slug = 'nolf-vr'
   and features is null;

commit;
