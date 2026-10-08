import { describe, it, expect } from 'vitest'
import {
  isAllowedApkProxyHost,
  pickPreferredApkPath,
  pickPreferredReleaseDownload,
  rewriteKnownHomepageToGithubRelease
} from '../server/utils/apkAssetPicker'

describe('APK Proxy Endpoint Security & URL Validation', () => {
  const validateProxyUrl = (targetUrl?: string | null): { valid: boolean; error?: string } => {
    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('https://')) {
      return { valid: false, error: 'Invalid or missing target URL' }
    }

    try {
      const parsed = new URL(targetUrl)
      if (!isAllowedApkProxyHost(parsed.hostname)) {
        return { valid: false, error: `Host ${parsed.hostname} is not allowed for APK proxying` }
      }
      return { valid: true }
    } catch {
      return { valid: false, error: 'Malformed URL' }
    }
  }

  describe('SSRF and Malicious URL Protection', () => {
    it('blocks unencrypted HTTP URLs', () => {
      const res = validateProxyUrl('http://github.com/Team-Beef/RTCWQuest/releases/download/v1.3.1/RTCWQuest.apk')
      expect(res.valid).toBe(false)
      expect(res.error).toContain('Invalid or missing target URL')
    })

    it('blocks localhost and loopback interfaces (SSRF prevention)', () => {
      expect(validateProxyUrl('https://localhost/secret.apk').valid).toBe(false)
      expect(validateProxyUrl('https://127.0.0.1/apk.apk').valid).toBe(false)
      expect(validateProxyUrl('https://0.0.0.0/test.apk').valid).toBe(false)
    })

    it('blocks AWS/Cloud metadata service addresses', () => {
      expect(validateProxyUrl('https://169.254.169.254/latest/meta-data').valid).toBe(false)
    })

    it('blocks private local subnets', () => {
      expect(validateProxyUrl('https://192.168.1.100/hack.apk').valid).toBe(false)
      expect(validateProxyUrl('https://10.0.0.1/malware.apk').valid).toBe(false)
      expect(validateProxyUrl('https://172.16.0.1/evil.apk').valid).toBe(false)
    })

    it('blocks untrusted external domains', () => {
      expect(validateProxyUrl('https://evil-server.com/trojan.apk').valid).toBe(false)
      expect(validateProxyUrl('https://not-github.com/fake.apk').valid).toBe(false)
      expect(validateProxyUrl('https://github.com.evil.org/phish.apk').valid).toBe(false)
    })

    it('blocks empty, null, or undefined URLs', () => {
      expect(validateProxyUrl(null).valid).toBe(false)
      expect(validateProxyUrl(undefined).valid).toBe(false)
      expect(validateProxyUrl('').valid).toBe(false)
    })
  })

  describe('Allowed Host Whitelist Acceptance', () => {
    it('allows GitHub release download links', () => {
      const res = validateProxyUrl('https://github.com/Team-Beef/RTCWQuest/releases/download/v1.3.1/RTCWQuest_v1.3.1.apk')
      expect(res.valid).toBe(true)
    })

    it('allows objects.githubusercontent.com CDN direct assets', () => {
      const res = validateProxyUrl('https://objects.githubusercontent.com/github-production-release-asset-2e65be/12345/Doom3Quest.apk')
      expect(res.valid).toBe(true)
    })

    it('allows SideQuest CDN downloads', () => {
      const res = validateProxyUrl('https://sidequestvr.com/apps/123/download.apk')
      expect(res.valid).toBe(true)
      const subRes = validateProxyUrl('https://cdn.sidequestvr.com/files/app.apk')
      expect(subRes.valid).toBe(true)
    })

    it('allows official developer portal domains (GoldenEyeVR, Lambda1VR, Doom3Quest, QuestZDoom, UT99)', () => {
      expect(validateProxyUrl('https://goldeneyevr.com/builds/GoldenEyeVR.apk').valid).toBe(true)
      expect(validateProxyUrl('https://lambda1vr.com/downloads/lambda1vr.apk').valid).toBe(true)
      expect(validateProxyUrl('https://doom3quest.com/releases/Doom3Quest.apk').valid).toBe(true)
      expect(validateProxyUrl('https://www.questzdoom.com/QuestZDoom.apk').valid).toBe(true)
      expect(validateProxyUrl('https://ut99vr.pages.dev/downloads/UT99Quest.apk').valid).toBe(true)
    })
  })

  describe('ZIP installer packages that contain a Quest APK', () => {
    it('picks the Quest APK nested inside a stakelogic installer zip', () => {
      const picked = pickPreferredApkPath([
        'RoadRashJailbreak-0.1.0-installer-r2/README.md',
        'RoadRashJailbreak-0.1.0-installer-r2/INSTALL.bat',
        'RoadRashJailbreak-0.1.0-installer-r2/RoadRashJailbreak-VR-0.1.0.apk',
        'RoadRashJailbreak-0.1.0-installer-r2/tools/rrgame.exe'
      ])
      expect(picked).toBe('RoadRashJailbreak-0.1.0-installer-r2/RoadRashJailbreak-VR-0.1.0.apk')
    })

    it('falls back to a Quest zip when the latest GitHub release has no raw .apk', () => {
      const picked = pickPreferredReleaseDownload([
        { name: 'RoadRashJailbreak-0.1.0.zip', browser_download_url: 'https://github.com/test/RoadRashJailbreak-0.1.0.zip' }
      ])
      expect(picked?.name).toBe('RoadRashJailbreak-0.1.0.zip')
    })

    it('still prefers a real APK over a zip when both exist', () => {
      const picked = pickPreferredReleaseDownload([
        { name: 'AstroQuest-0.20-PC-VR-Windows.zip', browser_download_url: 'https://github.com/test/pc.zip' },
        { name: 'AstroQuest-0.20-Quest3.apk', browser_download_url: 'https://github.com/test/quest.apk' }
      ])
      expect(picked?.name).toBe('AstroQuest-0.20-Quest3.apk')
    })

    it('rewrites Team Beef homepages to GitHub releases', () => {
      expect(rewriteKnownHomepageToGithubRelease('https://www.doom3quest.com/')).toBe(
        'https://github.com/Team-Beef-Studios/Doom3Quest/releases/latest'
      )
      expect(rewriteKnownHomepageToGithubRelease('https://www.lambda1vr.com/')).toBe(
        'https://github.com/Team-Beef-Studios/Lambda1VR/releases/latest'
      )
      expect(rewriteKnownHomepageToGithubRelease('https://www.questzdoom.com/')).toBe(
        'https://github.com/Team-Beef-Studios/QuestZDoom/releases/latest'
      )
    })

    it('prefers the game APK over a companion launcher APK', () => {
      const picked = pickPreferredReleaseDownload([
        { name: 'questzdoom_launcher_106.apk', browser_download_url: 'https://github.com/test/launcher.apk' },
        { name: 'questzdoom-1.6.2.apk', browser_download_url: 'https://github.com/test/game.apk' }
      ])
      expect(picked?.name).toBe('questzdoom-1.6.2.apk')
    })
  })

  describe('GitHub Release Asset Resolution & VR Build Prioritization', () => {
    const resolveReleaseApkAsset = (assets: { name: string; browser_download_url: string }[]) => {
      return pickPreferredReleaseDownload(assets.filter(a => a.name.toLowerCase().endsWith('.apk')))
    }

    it('prioritizes Quest VR APK over 2D Android APK (Halo CE releases)', () => {
      const assets = [
        { name: 'compatibility.json', browser_download_url: 'https://github.com/test/compatibility.json' },
        { name: 'HaloCE-Android-1.0.16.apk', browser_download_url: 'https://github.com/test/HaloCE-Android-1.0.16.apk' },
        { name: 'HaloCE-Quest-1.0.16.apk', browser_download_url: 'https://github.com/test/HaloCE-Quest-1.0.16.apk' }
      ]
      const selected = resolveReleaseApkAsset(assets)
      expect(selected?.name).toBe('HaloCE-Quest-1.0.16.apk')
      expect(selected?.browser_download_url).toBe('https://github.com/test/HaloCE-Quest-1.0.16.apk')
    })

    it('selects openxr or vr asset when present', () => {
      const assets = [
        { name: 'app-flat-release.apk', browser_download_url: 'https://github.com/test/app-flat.apk' },
        { name: 'app-openxr-release.apk', browser_download_url: 'https://github.com/test/app-openxr.apk' }
      ]
      const selected = resolveReleaseApkAsset(assets)
      expect(selected?.name).toBe('app-openxr-release.apk')
    })

    it('falls back to single APK if no special VR tags are in filename', () => {
      const assets = [
        { name: 'RTCWQuest_v1.3.1.apk', browser_download_url: 'https://github.com/test/RTCWQuest.apk' }
      ]
      const selected = resolveReleaseApkAsset(assets)
      expect(selected?.name).toBe('RTCWQuest_v1.3.1.apk')
    })
  })
})
