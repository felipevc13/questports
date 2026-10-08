import { describe, it, expect } from 'vitest'
import {
  normalizeQuestPath,
  isPortInstalledOnQuest,
  resolveWorkflowType,
  getWorkflowBadgeInfo,
  resolveInstallType,
  PORT_PACKAGE_CONFIGS
} from '../app/data/portPackageMap'

describe('ADB Shell Parser & Path Sanitization Test Suite', () => {
  describe('normalizeQuestPath', () => {
    it('normalizes relative path into clean /sdcard/ root path', () => {
      expect(normalizeQuestPath('RTCWQuest')).toBe('/sdcard/RTCWQuest/')
      expect(normalizeQuestPath('RTCWQuest/main')).toBe('/sdcard/RTCWQuest/main/')
    })

    it('handles paths with leading slash but missing /sdcard/', () => {
      expect(normalizeQuestPath('/xash/valve')).toBe('/sdcard/xash/valve/')
    })

    it('turns a bare Android/data path into an absolute push target', () => {
      expect(normalizeQuestPath('Android/data/com.example.game/files')).toBe('/sdcard/Android/data/com.example.game/files/')
      expect(normalizeQuestPath('N/A (ROM set bundled in the release APK)')).toBe('')
    })

    it('keeps paths already formatted as /sdcard/...', () => {
      expect(normalizeQuestPath('/sdcard/Doom3Quest/')).toBe('/sdcard/Doom3Quest/')
      expect(normalizeQuestPath('/sdcard/Doom3Quest')).toBe('/sdcard/Doom3Quest/')
    })

    it('strips leading and trailing whitespace', () => {
      expect(normalizeQuestPath('   /sdcard/JKXR/   ')).toBe('/sdcard/JKXR/')
    })

    it('returns empty string for null, undefined, empty, or N/A paths', () => {
      expect(normalizeQuestPath(null)).toBe('')
      expect(normalizeQuestPath(undefined)).toBe('')
      expect(normalizeQuestPath('')).toBe('')
      expect(normalizeQuestPath('N/A (Self-Contained APK)')).toBe('')
    })
  })

  describe('Android Shell Output Parsers', () => {
    it('accurately parses "pm list packages -3" shell output', () => {
      const rawShellOutput = `package:com.drbeef.rtcwquest\r
package:mod.drbeef.lambda1vr\r
package:com.simpsonsHitAndRun.vr\r
package:com.oculus.vrshell\n`

      const parsedPackages = rawShellOutput
        .split('\n')
        .map(l => l.replace(/^package:/i, '').trim())
        .filter(Boolean)

      expect(parsedPackages).toContain('com.drbeef.rtcwquest')
      expect(parsedPackages).toContain('mod.drbeef.lambda1vr')
      expect(parsedPackages).toContain('com.simpsonsHitAndRun.vr')
      expect(parsedPackages).toContain('com.oculus.vrshell')
      expect(parsedPackages.length).toBe(4)
    })

    it('correctly merges and deduplicates pm list packages -3 with full package list', () => {
      const output3 = `package:com.halo.decomp.vr\r\npackage:com.drbeef.rtcwquest\r\n`
      const outputAll = `package:com.drbeef.rtcwquest\r\npackage:com.android.systemui\r\npackage:com.ghwstvr.ut99quest\r\n`

      const list3 = output3.split('\n').map(l => l.replace(/^package:/i, '').trim()).filter(Boolean)
      const listAll = outputAll.split('\n').map(l => l.replace(/^package:/i, '').trim()).filter(Boolean)
      const merged = Array.from(new Set([...list3, ...listAll]))

      expect(merged).toContain('com.halo.decomp.vr')
      expect(merged).toContain('com.drbeef.rtcwquest')
      expect(merged).toContain('com.android.systemui')
      expect(merged).toContain('com.ghwstvr.ut99quest')
      expect(merged.filter(p => p === 'com.drbeef.rtcwquest').length).toBe(1)
      expect(merged.length).toBe(4)
    })

    it('accurately parses "dumpsys battery" shell output', () => {
      const rawBatteryOutput = `Current Battery Service state:
  AC powered: false
  USB powered: true
  Wireless powered: false
  Max charging current: 1500000
  Max charging voltage: 5000000
  Charge counter: 3400000
  status: 2
  health: 2
  present: true
  level: 84
  scale: 100
  voltage: 4120
  temperature: 280
  technology: Li-ion`

      const levelMatch = rawBatteryOutput.match(/level:\s*(\d+)/i)
      const level = levelMatch && levelMatch[1] ? parseInt(levelMatch[1], 10) : null
      expect(level).toBe(84)

      const pluggedMatch = rawBatteryOutput.match(/(AC powered|USB powered|Wireless powered):\s*(true|1)/i)
      const statusMatch = rawBatteryOutput.match(/status:\s*(\d+)/i)
      const isCharging = Boolean(pluggedMatch || (statusMatch && statusMatch[1] === '2'))
      expect(isCharging).toBe(true)
    })

    it('accurately parses "df -h /sdcard" storage output', () => {
      const rawDfOutput = `Filesystem            Size  Used Avail Use% Mounted on
/dev/fuse             113G   42G   71G  37% /storage/emulated/0`

      const lines = rawDfOutput.trim().split('\n')
      const parts = lines[1]?.trim().split(/\s+/) || []

      const total = parts[1] ?? null
      const free = parts[3] ?? null
      const pctMatch = parts[4] ? parts[4].match(/(\d+)%/) : null
      const percent = pctMatch && pctMatch[1] ? parseInt(pctMatch[1], 10) : null

      expect(total).toBe('113G')
      expect(free).toBe('71G')
      expect(percent).toBe(37)
    })
  })

  describe('isPortInstalledOnQuest Package Matching', () => {
    const installed = [
      'com.drbeef.rtcwquest',
      'mod.drbeef.lambda1vr',
      'com.lvonasek.preyvr',
      'com.kote.sharvr'
    ]

    it('detects port via primary package name', () => {
      expect(isPortInstalledOnQuest('rtcwquest', installed)).toBe(true)
      expect(isPortInstalledOnQuest('lambda1vr', installed)).toBe(true)
    })

    it('detects port via alternate package name (e.g. Luboš Vonásek Prey VR build)', () => {
      expect(isPortInstalledOnQuest('preyvr', installed)).toBe(true)
    })

    it('detects Simpsons Hit & Run via alternate legacy package name', () => {
      expect(isPortInstalledOnQuest('simpsonshitrun', installed)).toBe(true)
    })

    it('returns false when package is not installed', () => {
      expect(isPortInstalledOnQuest('doom3quest', installed)).toBe(false)
      expect(isPortInstalledOnQuest('galaxyquest', installed)).toBe(false)
    })

    it('handles uppercase package names in installed list gracefully', () => {
      const upperInstalled = ['COM.DRBEEF.RTCWQUEST']
      expect(isPortInstalledOnQuest('rtcwquest', upperInstalled)).toBe(true)
    })
  })

  describe('Workflow and Badge Resolution', () => {
    it('resolves correct workflow types for all categories', () => {
      expect(resolveWorkflowType({ slug: 'citravr', category: 'emulator' })).toBe('emulator_roms')
      expect(resolveWorkflowType({ slug: 'gta-sa-vr-quest' })).toBe('obb_extractor')
      expect(resolveWorkflowType({ slug: 'galaxyquest' })).toBe('smart_converter')
      expect(resolveWorkflowType({ slug: 'questcraft', installType: 'direct_apk' })).toBe('direct')
      expect(resolveWorkflowType({ slug: 'rtcwquest' })).toBe('pc_assets')
    })

    it('returns complete UI badge info for every workflow type', () => {
      const workflows = ['direct', 'obb_extractor', 'smart_converter', 'emulator_roms', 'pc_assets'] as const

      for (const w of workflows) {
        const badge = getWorkflowBadgeInfo(w)
        expect(badge.label).toBeTruthy()
        expect(badge.icon).toBeTruthy()
        expect(badge.color).toBeTruthy()
        expect(badge.badgeClass).toBeTruthy()
        expect(badge.description).toBeTruthy()
      }
    })

    it('resolves correct install types based on download & base game URLs', () => {
      expect(resolveInstallType({ slug: 'questcraft', port_download_url: 'https://example.com/app.apk' })).toBe('direct_apk')
      expect(resolveInstallType({
        slug: 'custom',
        port_download_url: 'https://example.com/app.apk',
        base_game_url: 'https://store.steampowered.com/app/10'
      })).toBe('apk_and_assets')
    })
  })
})
