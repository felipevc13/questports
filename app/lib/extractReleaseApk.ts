import { pickPreferredApkPath } from '../../server/utils/apkAssetPicker'

export async function extractReleaseApk(bytes: Uint8Array): Promise<Uint8Array> {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(bytes)
  const names = Object.keys(zip.files).filter(name => !zip.files[name]?.dir)
  const apkPath = pickPreferredApkPath(names)
  if (!apkPath) {
    throw new Error('The release archive does not contain an .apk. Use Manual APK Download.')
  }
  const entry = zip.file(apkPath)
  if (!entry) {
    throw new Error(`Could not read ${apkPath} from the release archive.`)
  }
  return entry.async('uint8array')
}

export function responseLooksLikeZip(headers: Headers): boolean {
  const unwrap = (headers.get('x-questports-unwrap') || '').toLowerCase()
  const type = (headers.get('content-type') || '').toLowerCase()
  return unwrap === 'apk' || type.includes('zip')
}
