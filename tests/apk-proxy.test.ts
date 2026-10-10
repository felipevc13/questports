import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import {
  isAllowedApkProxyHost,
  pickPreferredApkPath,
  pickPreferredReleaseDownload,
  rewriteKnownHomepageToGithubRelease
} from '../server/utils/apkAssetPicker'
import { plainApkRedirectTarget } from '../server/utils/apkProxyGate'
import {
  APK_PROXY_MAX_BYTES_DEFAULT,
  apkProxyMaxBytes,
  apkProxyRedirectRequested,
  apkTooLargeBody,
  contentLengthBytes,
  exceedsApkProxyCap,
  knownApkByteSize,
  tooLargeInstallMessage
} from '../app/lib/apkProxyPolicy'

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

    it('picks the Relith Quest APK over the Windows PCVR zip', () => {
      const picked = pickPreferredReleaseDownload([
        { name: 'relith-nolf-windows-vr-0.4.0.zip', browser_download_url: 'https://github.com/alex-nax/relith/releases/download/v0.4.0/relith-nolf-windows-vr-0.4.0.zip' },
        { name: 'relith-nolf-quest-0.4.0.apk', browser_download_url: 'https://github.com/alex-nax/relith/releases/download/v0.4.0/relith-nolf-quest-0.4.0.apk' }
      ])
      expect(picked?.name).toBe('relith-nolf-quest-0.4.0.apk')
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

    it('redirects a plain apk and keeps zip unwrap on the stream path', () => {
      const apk = 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/download/v1.3/Doom3Quest.apk'
      const zip = 'https://github.com/test/RoadRash/releases/download/v0.1.0/RoadRashJailbreak-0.1.0.zip'
      expect(plainApkRedirectTarget(apk)).toBe(apk)
      expect(plainApkRedirectTarget(zip)).toBeNull()
      expect(plainApkRedirectTarget('https://evil.example/game.apk')).toBeNull()
      expect(plainApkRedirectTarget('http://github.com/a/b/releases/download/v1/a.apk')).toBeNull()
      expect(apkProxyRedirectRequested('1')).toBe(true)
      expect(apkProxyRedirectRequested('true')).toBe(true)
      expect(apkProxyRedirectRequested('0')).toBe(false)
      expect(apkProxyRedirectRequested(undefined)).toBe(false)
    })

    it('refuses streams over the cap and leaves unknown lengths alone', () => {
      expect(APK_PROXY_MAX_BYTES_DEFAULT).toBe(157286400)
      expect(apkProxyMaxBytes({})).toBe(157286400)
      expect(apkProxyMaxBytes({ APK_PROXY_MAX_BYTES: '1048576' })).toBe(1048576)
      expect(apkProxyMaxBytes({ APK_PROXY_MAX_BYTES: 'nope' })).toBe(157286400)
      expect(apkProxyMaxBytes({ APK_PROXY_MAX_BYTES: '0' })).toBe(157286400)
      expect(contentLengthBytes('772000000')).toBe(772000000)
      expect(contentLengthBytes(null)).toBeNull()
      expect(exceedsApkProxyCap(157286401, 157286400)).toBe(true)
      expect(exceedsApkProxyCap(157286400, 157286400)).toBe(false)
      expect(exceedsApkProxyCap(null, 157286400)).toBe(false)
      const directUrl = 'https://github.com/Team-Beef-Studios/Doom3Quest/releases/download/v1.3/Doom3Quest.apk'
      expect(apkTooLargeBody(772 * 1024 * 1024, directUrl)).toEqual({
        reason: 'too_large',
        size: 772 * 1024 * 1024,
        directUrl
      })
      expect(tooLargeInstallMessage(772 * 1024 * 1024)).toBe(
        'This port is large (772 MB). Download it with the direct link and install with SideQuest, or use the QuestPorts app.'
      )
      expect(knownApkByteSize(125 * 1024 * 1024)).toBe(125 * 1024 * 1024)
      expect(knownApkByteSize(undefined)).toBeNull()
      expect(exceedsApkProxyCap(knownApkByteSize(125 * 1024 * 1024), APK_PROXY_MAX_BYTES_DEFAULT)).toBe(false)
      expect(exceedsApkProxyCap(knownApkByteSize(465 * 1024 * 1024), APK_PROXY_MAX_BYTES_DEFAULT)).toBe(true)
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

describe('origin transfer guards', () => {
  it('caches catalog HTML on Vercel ISR and leaves API and admin dynamic', () => {
    const config = readFileSync(new URL('../nuxt.config.ts', import.meta.url), 'utf8')
    expect(config).toContain("'/': { isr: { expiration: 600, passQuery: true } }")
    expect(config).toContain("'/ports/**': { isr: { expiration: 600, passQuery: true } }")
    expect(config).toContain("'/api/**': { isr: false }")
    expect(config).toContain("'/admin/**': { isr: false }")
    expect(config).not.toMatch(/['"]\/\*\*['"]:\s*\{[^}]*\bisr\b/)
  })

  it('redirects plain apks before streaming and aborts an oversized body', () => {
    const handler = readFileSync(new URL('../server/api/apk-proxy.get.ts', import.meta.url), 'utf8')
    const redirectAt = handler.indexOf('return sendRedirect')
    const headAt = handler.indexOf("fetchUpstream(url, 'HEAD'")
    const streamAt = handler.indexOf('return sendStream')
    expect(redirectAt).toBeGreaterThan(0)
    expect(headAt).toBeGreaterThan(redirectAt)
    expect(streamAt).toBeGreaterThan(headAt)
    expect(handler).toContain('plainApkRedirectTarget')
    expect(handler).toContain('apkTooLargeBody')
    expect(handler).toContain('res.body.cancel()')
    expect(handler).toContain("'X-QuestPorts-Unwrap': 'apk'")
    expect(handler).toContain('setResponseStatus(event, 413')
  })

  it('keeps WebUSB on the streaming proxy and shows the direct download for a 413', () => {
    const adb = readFileSync(new URL('../app/composables/useQuestAdb.ts', import.meta.url), 'utf8')
    const proxyAt = adb.indexOf('const proxyUrl = `/api/apk-proxy?url=')
    expect(proxyAt).toBeGreaterThan(0)
    expect(adb.slice(proxyAt, proxyAt + 80)).not.toContain('redirect')
    expect(adb).toContain('res.status === 413')
    expect(adb).toContain('new ApkTooLargeError')

    const page = readFileSync(new URL('../app/pages/ports/[slug].vue', import.meta.url), 'utf8')
    expect(page).toContain('data-testid="apk-too-large"')
    expect(page).toContain('data-testid="apk-too-large-download"')
    expect(page).toContain('Download APK directly')
    expect(page).toContain("trackInstall('install_error', 'too_large')")
    expect(page).toContain('tooLarge: Boolean(largePortMessage.value)')
    expect(page).toContain('knownApkByteSize')
  })
})
