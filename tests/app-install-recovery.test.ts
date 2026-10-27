import { describe, expect, it } from 'vitest'
import {
  APP_INSTALL_RECOVERY_MS,
  appInstallRecoveryDecision,
  readPendingAppInstall,
  takeAppInstallResult,
  writePendingAppInstall,
  type KeyValueStore,
  type PendingAppInstall
} from '../app/lib/appInstallRecovery'

function memory(): KeyValueStore {
  const data = new Map<string, string>()
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: key => {
      data.delete(key)
    }
  }
}

function pending(over: Partial<PendingAppInstall> = {}): PendingAppInstall {
  return {
    requestId: 'req-1',
    slug: 'sega-rally-vr',
    packageName: 'io.port0r.segarally',
    path: '/ports/sega-rally-vr',
    startedAt: 1_000,
    progressAt: 1_000,
    wasInstalled: false,
    previousVersion: null,
    ...over
  }
}

describe('app install recovery', () => {
  it('records one result per request and still allows an empty id', () => {
    const store = memory()
    writePendingAppInstall(store, pending())
    expect(takeAppInstallResult(store, 'req-1')).toBe(true)
    expect(readPendingAppInstall(store)).toBeNull()
    expect(takeAppInstallResult(store, 'req-1')).toBe(false)
    expect(takeAppInstallResult(store, '')).toBe(true)
    expect(takeAppInstallResult(store, '  ')).toBe(true)
  })

  it('counts a newly installed package, and an update only when the version changes', () => {
    const fresh = pending()
    expect(appInstallRecoveryDecision({
      pending: fresh,
      now: 2_000,
      installed: true,
      version: null
    })).toBe('success')
    expect(appInstallRecoveryDecision({
      pending: fresh,
      now: 2_000,
      installed: false,
      version: null
    })).toBe('wait')

    const update = pending({ wasInstalled: true, previousVersion: '1.0' })
    expect(appInstallRecoveryDecision({
      pending: update,
      now: 2_000,
      installed: true,
      version: '1.0'
    })).toBe('wait')
    expect(appInstallRecoveryDecision({
      pending: update,
      now: 2_000,
      installed: true,
      version: null
    })).toBe('wait')
    expect(appInstallRecoveryDecision({
      pending: update,
      now: 2_000,
      installed: true,
      version: '1.1'
    })).toBe('success')
  })

  it('times out after ten minutes without progress', () => {
    const row = pending({ progressAt: 5_000 })
    expect(appInstallRecoveryDecision({
      pending: row,
      now: 5_000 + APP_INSTALL_RECOVERY_MS - 1,
      installed: false,
      version: null
    })).toBe('wait')
    expect(appInstallRecoveryDecision({
      pending: row,
      now: 5_000 + APP_INSTALL_RECOVERY_MS,
      installed: false,
      version: null
    })).toBe('timeout')
    expect(appInstallRecoveryDecision({
      pending: row,
      now: 5_000 + APP_INSTALL_RECOVERY_MS,
      installed: true,
      version: '9'
    })).toBe('success')
  })
})
