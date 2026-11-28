import { describe, expect, it } from 'vitest'
import { traverseDroppedEntry } from '../app/lib/droppedEntries'
import { destinationDirForDroppedFile } from '../app/lib/dropPaths'

const file = (name: string) => ({ isFile: true, name, file: (ok: (f: unknown) => void) => ok({ name }) })
const directory = (name: string, batches: any[]) => ({
  isDirectory: true, name,
  createReader: () => ({ readEntries: (ok: (v: any[]) => void, fail: (e: Error) => void) => {
    const batch = batches.shift()
    if (batch instanceof Error) fail(batch)
    else ok(batch || [])
  } })
})

describe('0 A.D. folder transfer', () => {
  it('collects every directory batch and preserves nested paths', async () => {
    const root = directory('data', [[directory('mods', [[file('one.zip')], [file('two.zip')], []])], []])
    const result = await traverseDroppedEntry(root)
    expect(result.map(x => x.file.name)).toEqual(['one.zip', 'two.zip'])
    expect(result.map(x => destinationDirForDroppedFile('/sdcard/0AD/data/', x.relPath, x.file.name)))
      .toEqual(['/sdcard/0AD/data/mods/', '/sdcard/0AD/data/mods/'])
  })
  it('rejects a failed directory read instead of returning a partial list', async () => {
    await expect(traverseDroppedEntry(directory('data', [[file('one.zip')], new Error('denied')]))).rejects.toThrow('denied')
  })
  it('rejects a failed file read instead of hanging or copying a partial list', async () => {
    const broken = { isFile: true, file: (_ok: unknown, fail: (e: Error) => void) => fail(new Error('file denied')) }
    await expect(traverseDroppedEntry(directory('data', [[file('one.zip'), broken], []]))).rejects.toThrow('file denied')
  })
})
