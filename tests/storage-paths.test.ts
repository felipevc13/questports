import { describe, it, expect } from 'vitest'
import {
  PORT_PACKAGE_CONFIGS,
  RemoteDirDeniedError,
  assessCampaignOnQuest,
  isSelfContainedSideload,
  verifyFolderOnQuest
} from '../app/data/portPackageMap'
import { destinationDirForDroppedFile } from '../app/lib/dropPaths'
import type { CampaignLocation } from '../app/data/portPackageMap'

function listFrom(files: Record<string, string[]>) {
  return async (path: string) => files[path] ?? []
}

async function ready(slug: string, campaign: CampaignLocation, files: Record<string, string[]>) {
  return assessCampaignOnQuest(slug, campaign, listFrom(files))
}

describe('storage paths that follow upstream install docs', () => {
  const avp = '/sdcard/Android/data/com.bassquake.quest.avpvr/files'
  const avpCampaign: CampaignLocation = { id: 'base', fullPath: `${avp}/`, folder: 'files' }

  it('avp-vr ignores a stray file and gamedata.ff, and accepts the Gold edition sentinels', async () => {
    const missing = await ready('avp-vr', avpCampaign, {})
    expect(missing.exists).toBe(false)

    const stray = await ready('avp-vr', avpCampaign, {
      [`${avp}/avp_huds/`]: ['unrelated-note.txt'],
      [`${avp}/avp_rifs/`]: ['unrelated-note.txt'],
      [`${avp}/fastfile/`]: ['gamedata.ff', 'unrelated-note.txt']
    })
    expect(stray.exists).toBe(false)

    const valid = await ready('avp-vr', avpCampaign, {
      [`${avp}/avp_huds/`]: ['alien.rif'],
      [`${avp}/avp_rifs/`]: ['temple.rif'],
      [`${avp}/fastfile/`]: ['ffinfo.txt']
    })
    expect(valid.exists).toBe(true)
  })

  it('asks the player to confirm when Android/data cannot be listed', async () => {
    const result = await assessCampaignOnQuest('avp-vr', avpCampaign, async () => {
      throw new RemoteDirDeniedError(avp)
    })
    expect(result.exists).toBe(false)
    expect(result.confirmReason).toBe('unreadable')
  })

  const gothic = '/sdcard/Android/data/com.gothic2vr.quest/files/Gothic2'
  const gothicCampaign: CampaignLocation = { id: 'base', fullPath: `${gothic}/`, folder: 'Gothic2' }

  it('gothic2-vr requires a Data vdf and GOTHIC.DAT, not Gothic.dat', async () => {
    expect((await ready('gothic2-vr', gothicCampaign, {})).exists).toBe(false)
    const stray = await ready('gothic2-vr', gothicCampaign, {
      [`${gothic}/Data/`]: ['unrelated-note.txt', 'Gothic.dat'],
      [`${gothic}/_work/Data/Scripts/_compiled/`]: ['unrelated-note.txt']
    })
    expect(stray.exists).toBe(false)
    const valid = await ready('gothic2-vr', gothicCampaign, {
      [`${gothic}/Data/`]: ['Anims.vdf'],
      [`${gothic}/_work/Data/Scripts/_compiled/`]: ['GOTHIC.DAT']
    })
    expect(valid.exists).toBe(true)
  })

  const hp = '/sdcard/Android/data/io.github.hpvr.quest/files/HP'
  const hpCampaign: CampaignLocation = { id: 'base', fullPath: `${hp}/`, folder: 'HP' }

  it('harry-potter-vr requires HPBase.u, HarryPotter.u, and Lev_Tut1.unr', async () => {
    expect((await ready('harry-potter-vr', hpCampaign, {})).exists).toBe(false)
    const stray = await ready('harry-potter-vr', hpCampaign, {
      [`${hp}/system/`]: ['HP.u', 'unrelated-note.txt'],
      [`${hp}/Maps/`]: ['unrelated-note.txt']
    })
    expect(stray.exists).toBe(false)
    const valid = await ready('harry-potter-vr', hpCampaign, {
      [`${hp}/system/`]: ['HPBase.u', 'HarryPotter.u'],
      [`${hp}/Maps/`]: ['Lev_Tut1.unr']
    })
    expect(valid.exists).toBe(true)
  })

  const vc = '/sdcard/Android/data/com.miamivr.quest/files/gamedata'
  const vcCampaign: CampaignLocation = { id: 'base', fullPath: `${vc}/`, folder: 'gamedata' }

  it('vice-city-vr-quest looks in gamedata for gta3.img and american.gxt', async () => {
    expect(PORT_PACKAGE_CONFIGS['vice-city-vr-quest'].packageName).toBe('com.miamivr.quest')
    expect((await ready('vice-city-vr-quest', vcCampaign, {})).exists).toBe(false)
    const stray = await ready('vice-city-vr-quest', vcCampaign, {
      [`${vc}/models/`]: ['unrelated-note.txt'],
      [`${vc}/TEXT/`]: ['unrelated-note.txt'],
      '/sdcard/Android/data/com.revc.miamivr/files/data/': ['gta3.img']
    })
    expect(stray.exists).toBe(false)
    const valid = await ready('vice-city-vr-quest', vcCampaign, {
      [`${vc}/models/`]: ['gta3.img'],
      [`${vc}/TEXT/`]: ['american.gxt']
    })
    expect(valid.exists).toBe(true)
  })

  const gtaCampaign: CampaignLocation = {
    id: 'base',
    fullPath: '/sdcard/Android/data/com.rockstargames.gtasa/files/',
    folder: 'files'
  }

  it('gta-sa-vr-quest splits texdb under savr from audio under Android/data', async () => {
    expect((await ready('gta-sa-vr-quest', gtaCampaign, {})).exists).toBe(false)
    const oldPlace = await ready('gta-sa-vr-quest', gtaCampaign, {
      '/sdcard/Android/data/com.rockstargames.gtasa/files/texdb/': ['gta3.img'],
      '/sdcard/Android/data/com.rockstargames.gtasa/files/audio/': ['unrelated-note.txt']
    })
    expect(oldPlace.exists).toBe(false)
    const valid = await ready('gta-sa-vr-quest', gtaCampaign, {
      '/sdcard/savr/data_main/assets/texdb/': ['gta3.img'],
      '/sdcard/Android/data/com.rockstargames.gtasa/files/audio/': ['STREAMS', 'CONFIG']
    })
    expect(valid.exists).toBe(true)
  })

  const rr = '/sdcard/Android/data/com.rrjb.vr/files/'
  const rrCampaign: CampaignLocation = { id: 'base', fullPath: rr, folder: 'files' }

  it('road-rash accepts disc.bin or another bin/img and rejects iso', async () => {
    expect((await ready('road-rash-jailbreak-vr', rrCampaign, {})).exists).toBe(false)
    expect((await ready('road-rash-jailbreak-vr', rrCampaign, { [rr]: ['unrelated-note.txt'] })).exists).toBe(false)
    expect((await ready('road-rash-jailbreak-vr', rrCampaign, { [rr]: ['disc.iso'] })).exists).toBe(false)
    expect((await ready('road-rash-jailbreak-vr', rrCampaign, { [rr]: ['disc.bin'] })).exists).toBe(true)
    expect((await ready('road-rash-jailbreak-vr', rrCampaign, { [rr]: ['jailbreak.img'] })).exists).toBe(true)
  })

  const gq = '/sdcard/Android/data/com.galaxy.quest/files/game/sys/'
  const gqCampaign: CampaignLocation = {
    id: 'base',
    fullPath: '/sdcard/Android/data/com.galaxy.quest/files/game/',
    folder: 'game'
  }

  it('galaxyquest requires sys/fst.bin and still accepts the old GalaxyQuest folder', async () => {
    expect((await ready('galaxyquest', gqCampaign, {})).exists).toBe(false)
    expect((await ready('galaxyquest', gqCampaign, { [gq]: ['main.dol', 'unrelated-note.txt'] })).exists).toBe(false)
    expect((await ready('galaxyquest', gqCampaign, { [gq]: ['fst.bin'] })).exists).toBe(true)
    const legacy = await ready('galaxyquest', gqCampaign, {
      '/sdcard/GalaxyQuest/sys/': ['fst.bin']
    })
    expect(legacy.exists).toBe(true)
    expect(legacy.matchedPath).toBe('/sdcard/GalaxyQuest/sys/')
  })

  it('time-crisis-vr is a plain install with no required files', () => {
    const cfg = PORT_PACKAGE_CONFIGS['time-crisis-vr']
    expect(cfg.workflowType).toBe('direct')
    expect(cfg.folders || []).toEqual([])
    expect(cfg.criticalFiles || []).toEqual([])
    expect(isSelfContainedSideload(cfg)).toBe(true)
  })

  it('a denied Android/data listing on Vice City still offers confirm', async () => {
    const folder = PORT_PACKAGE_CONFIGS['vice-city-vr-quest'].folders![0]
    const check = await verifyFolderOnQuest(folder, async () => {
      throw new RemoteDirDeniedError(folder.targetPath)
    })
    expect(check.status).toBe('unreadable')
    expect(check.needsUserConfirm).toBe(true)
  })
})

describe('dropped folders keep the subdirectories detection scans', () => {
  it('keeps data, art, sound, hlvr, and core, and does not double-nest DATA', () => {
    expect(destinationDirForDroppedFile('/sdcard/BeefRaiderXR/', 'data', 'LEVEL1.PHD')).toBe('/sdcard/BeefRaiderXR/data/')
    expect(destinationDirForDroppedFile('/sdcard/SimpsonsHitRun/', 'art/frontend', 'frontend.p3d')).toBe('/sdcard/SimpsonsHitRun/art/frontend/')
    expect(destinationDirForDroppedFile('/sdcard/SimpsonsHitRun/', 'sound', 'dialogue.rcf')).toBe('/sdcard/SimpsonsHitRun/sound/')
    expect(destinationDirForDroppedFile('/sdcard/Qualyx/game/', 'hlvr', 'pak01_dir.vpk')).toBe('/sdcard/Qualyx/game/hlvr/')
    expect(destinationDirForDroppedFile('/sdcard/Qualyx/game/', 'game/hlvr/pak01_dir.vpk', 'pak01_dir.vpk')).toBe('/sdcard/Qualyx/game/hlvr/')
    expect(destinationDirForDroppedFile('/sdcard/Qualyx/game/', 'core', 'pak01_dir.vpk')).toBe('/sdcard/Qualyx/game/core/')
    expect(destinationDirForDroppedFile(
      '/sdcard/Android/data/com.github.maranone.questcarnage/files/DATA/',
      'DATA/GENERAL.TXT',
      'GENERAL.TXT'
    )).toBe('/sdcard/Android/data/com.github.maranone.questcarnage/files/DATA/')
    expect(destinationDirForDroppedFile(
      '/sdcard/Android/data/com.github.maranone.questcarnage/files/',
      'DATA',
      'GENERAL.TXT'
    )).toBe('/sdcard/Android/data/com.github.maranone.questcarnage/files/DATA/')
  })
})
