/** Directory a dropped file should land in, keeping subfolders the detector looks for. */

export function campaignLeaf(fullPath: string): string {
  const parts = fullPath.replace(/\\/g, '/').replace(/\/+$/, '').split('/').filter(Boolean)
  return parts[parts.length - 1] || ''
}

/**
 * `relativePath` is either a parent directory (`data`, `art/frontend`) or a
 * webkitRelativePath that still includes the file name. A leading folder that
 * repeats the campaign directory is removed so `DATA/` dropped onto `.../DATA/`
 * does not become `DATA/DATA/`.
 */
export function destinationDirForDroppedFile(campaignPath: string, relativePath: string | undefined, fileName: string): string {
  const base = campaignPath.replace(/\\/g, '/').replace(/\/+$/, '') + '/'
  const rel = (relativePath || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
  const parts = rel.split('/').filter(Boolean)
  if (parts.length && fileName && parts[parts.length - 1].toLowerCase() === fileName.toLowerCase()) {
    parts.pop()
  }
  const leaf = campaignLeaf(base).toLowerCase()
  if (parts.length && leaf && parts[0].toLowerCase() === leaf) {
    parts.shift()
  }
  if (!parts.length) return base
  return `${base}${parts.join('/')}/`
}
