import { canonicalHeadset, isMockDeviceSerial, type VerificationChecks } from '~/lib/verification'

export interface InstallVerificationInput {
  mockEnabled: boolean
  deviceSerial: string | null | undefined
  deviceModel: string | null | undefined
  slug: string
  testedVersion: string | null | undefined
  apkInstalled: boolean
  gameFilesDetected: boolean | null
  storagePathConfirmed: boolean | null
}

/** Payload for POST /api/verifications. Null when the install cannot be recorded. */
export function buildInstallVerificationBody(input: InstallVerificationInput): Record<string, unknown> | null {
  if (!input.apkInstalled || input.mockEnabled) return null
  if (isMockDeviceSerial(input.deviceSerial)) return null
  if (!canonicalHeadset(input.deviceModel)) return null
  const testedVersion = input.testedVersion?.trim() || ''
  if (!testedVersion) return null

  const checks: VerificationChecks = { apk_installed: true }
  if (input.gameFilesDetected !== null) {
    checks.game_files_detected = input.gameFilesDetected
    checks.data_copied_by_site = input.gameFilesDetected
  }
  if (input.storagePathConfirmed !== null) checks.storage_path_confirmed = input.storagePathConfirmed

  return {
    slug: input.slug,
    testedVersion,
    headsetModel: input.deviceModel,
    deviceSerial: input.deviceSerial?.trim() || '',
    checks
  }
}
