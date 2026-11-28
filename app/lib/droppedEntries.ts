/** Collect every file before copying; a partial folder must never be treated as complete. */
export async function traverseDroppedEntry(item: any, path = ''): Promise<{ file: File, relPath: string }[]> {
  if (item.isFile) {
    return new Promise((resolve, reject) => {
      item.file((file: File) => resolve([{ file, relPath: path }]), reject)
    })
  }
  if (!item.isDirectory) return []
  const reader = item.createReader()
  const entries: any[] = []
  while (true) {
    const batch = await new Promise<any[]>((resolve, reject) => reader.readEntries(resolve, reject))
    if (!batch.length) break
    entries.push(...batch)
  }
  const subFolder = path ? `${path}/${item.name}` : item.name
  const results: { file: File, relPath: string }[] = []
  for (const child of entries) results.push(...await traverseDroppedEntry(child, subFolder))
  return results
}
