<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuestAdb, type AdbFileEntry } from '~/composables/useQuestAdb'
import type { Port } from '~/types/port'
import type { PortPackageConfig } from '~/data/portPackageMap'

const props = defineProps<{
  rootPath: string
  rootLabel?: string
  port?: Port | null
  config?: PortPackageConfig
  expectedFiles?: string[]
}>()

const emit = defineEmits<{
  (e: 'files-changed'): void
}>()

const adb = useQuestAdb()
const {
  isConnected,
  listRemoteDirectoryDetails,
  createRemoteDir,
  pushFileToPath,
  deleteRemotePath
} = adb

// Navigation State
const currentSubPath = ref<string>('') // Relative to rootPath, e.g. "" or "files/ObjectData"
const entries = ref<AdbFileEntry[]>([])
const isLoading = ref<boolean>(false)
const isDragOver = ref<boolean>(false)

// Upload state
const isUploading = ref<boolean>(false)
const uploadProgress = ref<{
  current: number
  total: number
  fileName: string
  percent: number
  mbUploaded: string
  mbTotal: string
} | null>(null)

// New Folder Modal
const showNewFolderModal = ref<boolean>(false)
const newFolderName = ref<string>('')
const newFolderError = ref<string | null>(null)

// Delete Confirm
const itemToDelete = ref<AdbFileEntry | null>(null)
const isDeleting = ref<boolean>(false)

// Input refs
const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)

// Current Absolute Path on Quest
const currentFullPath = computed(() => {
  const base = props.rootPath.endsWith('/') ? props.rootPath : `${props.rootPath}/`
  if (!currentSubPath.value) return base
  const cleanSub = currentSubPath.value.replace(/^\/+|\/+$/g, '')
  return `${base}${cleanSub}/`
})

// Breadcrumbs Breakdown
const breadcrumbs = computed(() => {
  const pathParts = (props.rootPath || '').replace(/\/+$/, '').split('/').filter(Boolean)
  const defaultRootName = pathParts[pathParts.length - 1] || 'Root'
  const rootName = props.rootLabel || defaultRootName
  const crumbs = [{ label: rootName, path: '' }]

  if (currentSubPath.value) {
    const parts = currentSubPath.value.split('/').filter(Boolean)
    let accumulated = ''
    for (const part of parts) {
      accumulated = accumulated ? `${accumulated}/${part}` : part
      crumbs.push({ label: part, path: accumulated })
    }
  }
  return crumbs
})

// Load entries in currently open folder
const loadEntries = async () => {
  if (!isConnected.value || !props.rootPath) {
    entries.value = []
    return
  }
  isLoading.value = true
  try {
    entries.value = await listRemoteDirectoryDetails(currentFullPath.value)
  } catch (err) {
    console.error('Failed to load directory entries:', err)
    entries.value = []
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(() => props.rootPath, () => {
  currentSubPath.value = ''
  loadEntries()
})

watch(() => currentSubPath.value, () => {
  loadEntries()
})

onMounted(() => {
  loadEntries()
})

// Navigate into a subfolder
const navigateTo = (subPath: string) => {
  currentSubPath.value = subPath
}

const openFolder = (entry: AdbFileEntry) => {
  if (!entry.isDirectory) return
  if (!currentSubPath.value) {
    currentSubPath.value = entry.name
  } else {
    currentSubPath.value = `${currentSubPath.value}/${entry.name}`
  }
}

const navigateUp = () => {
  if (!currentSubPath.value) return
  const parts = currentSubPath.value.split('/').filter(Boolean)
  parts.pop()
  currentSubPath.value = parts.join('/')
}

// Formatting helpers
const formatSize = (bytes: number): string => {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

const formatDate = (ms: number): string => {
  if (!ms || ms <= 0) return '—'
  const date = new Date(ms)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

// Check if a file matches critical/expected files
const isVerifiedFile = (entry: AdbFileEntry): boolean => {
  if (entry.isDirectory) return false
  const fullRelative = currentSubPath.value ? `${currentSubPath.value}/${entry.name}` : entry.name
  const expected = props.expectedFiles || props.config?.criticalFiles || []
  return expected.some(exp => exp.toLowerCase() === entry.name.toLowerCase() || exp.toLowerCase() === fullRelative.toLowerCase())
}

// Handle File Selection from Browser
const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  await uploadFileList(Array.from(target.files))
  target.value = ''
}

// Handle Folder Selection from Browser
const handleFolderSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  await uploadFileList(Array.from(target.files))
  target.value = ''
}

// Helper to traverse dropped folders recursively
const traverseFileTree = async (item: any, path = ''): Promise<{ file: File, relPath: string }[]> => {
  if (item.isFile) {
    return new Promise((resolve) => {
      item.file((f: File) => {
        resolve([{ file: f, relPath: path }])
      })
    })
  } else if (item.isDirectory) {
    const dirReader = item.createReader()
    const entries: any[] = await new Promise((resolve) => {
      const allEntries: any[] = []
      const readNext = () => {
        dirReader.readEntries((ents: any[]) => {
          if (!ents || ents.length === 0) {
            resolve(allEntries)
          } else {
            allEntries.push(...ents)
            readNext()
          }
        }, () => resolve(allEntries))
      }
      readNext()
    })
    const results: { file: File, relPath: string }[] = []
    const subFolder = path ? `${path}/${item.name}` : item.name
    for (const child of entries) {
      results.push(...await traverseFileTree(child, subFolder))
    }
    return results
  }
  return []
}

// Upload Files Batch with optional relative path
const uploadFileBatch = async (items: { file: File, relPath?: string }[]) => {
  if (!isConnected.value || items.length === 0) return
  isUploading.value = true

  const totalFiles = items.length
  try {
    for (let i = 0; i < totalFiles; i++) {
      const item = items[i]
      if (!item || !item.file) continue
      const file = item.file

      // Determine destination directory
      let targetDir = currentFullPath.value

      if (item.relPath) {
        const cleanRel = item.relPath.replace(/^\/+|\/+$/g, '')
        if (cleanRel) {
          targetDir = `${currentFullPath.value}${cleanRel}/`
        }
      } else if (file.webkitRelativePath) {
        const parts = file.webkitRelativePath.split('/')
        if (parts.length > 1) {
          const innerSub = parts.slice(0, parts.length - 1).join('/')
          if (innerSub) {
            targetDir = `${currentFullPath.value}${innerSub}/`
          }
        }
      }

      uploadProgress.value = {
        current: i + 1,
        total: totalFiles,
        fileName: file.name,
        percent: Math.round(((i) / totalFiles) * 100),
        mbUploaded: '0',
        mbTotal: (file.size / (1024 * 1024)).toFixed(1)
      }

      await pushFileToPath(file, targetDir, (pct, msg) => {
        if (uploadProgress.value) {
          uploadProgress.value.percent = Math.round(((i + (pct / 100)) / totalFiles) * 100)
          uploadProgress.value.mbUploaded = ((file.size * (pct / 100)) / (1024 * 1024)).toFixed(1)
        }
      })
    }
    await loadEntries()
    emit('files-changed')
  } catch (err: any) {
    console.error('File upload error:', err)
    alert(`Failed to upload files: ${err?.message || 'ADB error'}`)
  } finally {
    isUploading.value = false
    uploadProgress.value = null
  }
}

const uploadFileList = async (files: File[]) => {
  await uploadFileBatch(files.map(f => ({ file: f })))
}

// Drag & Drop
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  if (!e.dataTransfer) return

  const items = e.dataTransfer.items
  if (items && items.length > 0 && typeof items[0]?.webkitGetAsEntry === 'function') {
    const collected: { file: File, relPath: string }[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const entry = item && typeof item.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null
      if (entry) {
        collected.push(...await traverseFileTree(entry, ''))
      }
    }
    if (collected.length > 0) {
      await uploadFileBatch(collected)
      return
    }
  }

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    await uploadFileList(Array.from(e.dataTransfer.files))
  }
}

// Create New Folder
const handleCreateFolder = async () => {
  const name = newFolderName.value.trim()
  if (!name) return
  if (name.includes('/') || name.includes('..')) {
    newFolderError.value = 'Invalid folder name. Slashes are not allowed.'
    return
  }

  const target = `${currentFullPath.value}${name}/`
  try {
    const ok = await createRemoteDir(target)
    if (ok) {
      showNewFolderModal.value = false
      newFolderName.value = ''
      newFolderError.value = null
      await loadEntries()
      emit('files-changed')
    } else {
      newFolderError.value = 'Failed to create directory on headset.'
    }
  } catch (err: any) {
    newFolderError.value = err?.message || 'Error creating directory'
  }
}

// Delete Item
const confirmDelete = (entry: AdbFileEntry) => {
  itemToDelete.value = entry
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  isDeleting.value = true
  const target = `${currentFullPath.value}${itemToDelete.value.name}`
  try {
    await deleteRemotePath(target)
    itemToDelete.value = null
    await loadEntries()
    emit('files-changed')
  } catch (err: any) {
    alert(`Failed to delete item: ${err?.message || 'Error'}`)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div
    class="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm flex flex-col transition-all"
    :class="{ 'ring-2 ring-primary/60 border-primary/60': isDragOver }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Hidden file/folder inputs -->
    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />
    <input
      ref="folderInputRef"
      type="file"
      webkitdirectory
      directory
      multiple
      class="hidden"
      @change="handleFolderSelect"
    />

    <!-- File Manager Header & Breadcrumbs Toolbar -->
    <div class="p-4 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Left: Breadcrumbs -->
      <div class="flex items-center gap-1.5 flex-wrap text-xs font-mono min-w-0">
        <button
          v-if="currentSubPath"
          @click="navigateUp"
          class="p-1.5 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors mr-1 cursor-pointer shrink-0"
          title="Go Up One Folder"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span class="text-muted-foreground mr-0.5">/</span>

        <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.path">
          <button
            @click="navigateTo(crumb.path)"
            class="px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer truncate max-w-[140px]"
            :class="idx === breadcrumbs.length - 1
              ? 'bg-primary/15 text-primary font-bold border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'"
          >
            <span v-if="idx === 0">📁 </span>
            <span>{{ crumb.label }}</span>
          </button>
          <span v-if="idx < breadcrumbs.length - 1" class="text-muted-foreground/60 text-xs">/</span>
        </template>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Upload Files -->
        <button
          @click="fileInputRef?.click()"
          :disabled="isUploading"
          class="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-card hover:bg-muted text-foreground border border-border text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          title="Upload individual files to this folder"
        >
          <svg class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Upload Files</span>
        </button>

        <!-- Upload Folder -->
        <button
          @click="folderInputRef?.click()"
          :disabled="isUploading"
          class="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
          title="Upload an entire directory structure from your computer"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <span>Upload Folder</span>
        </button>

        <!-- New Folder -->
        <button
          @click="showNewFolderModal = true"
          :disabled="isUploading"
          class="inline-flex items-center gap-1 px-2.5 h-8 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border text-xs transition-colors cursor-pointer"
          title="Create a new subfolder"
        >
          <span>+ Folder</span>
        </button>

        <!-- Refresh -->
        <button
          @click="loadEntries"
          :disabled="isLoading || isUploading"
          class="p-2 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border text-xs transition-colors cursor-pointer"
          title="Refresh files"
        >
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Active Upload Progress Banner -->
    <div
      v-if="uploadProgress"
      class="px-5 py-3 bg-primary/10 border-b border-primary/20 flex flex-col gap-2 animate-in fade-in"
    >
      <div class="flex items-center justify-between text-xs font-mono">
        <span class="text-primary font-semibold flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Uploading ({{ uploadProgress.current }} / {{ uploadProgress.total }})</span>
          <span class="text-foreground truncate max-w-xs">{{ uploadProgress.fileName }}</span>
        </span>
        <span class="text-primary font-bold">{{ uploadProgress.percent }}%</span>
      </div>

      <div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          class="h-full bg-primary rounded-full transition-all duration-200"
          :style="{ width: `${uploadProgress.percent}%` }"
        ></div>
      </div>
    </div>

    <!-- Files Table -->
    <div class="relative min-h-[220px] max-h-[380px] overflow-y-auto">
      <!-- Loading Spinner Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center z-10"
      >
        <div class="flex items-center gap-2.5 text-xs font-mono text-muted-foreground">
          <svg class="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Reading Quest filesystem...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!isLoading && entries.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center space-y-3"
      >
        <div class="w-12 h-12 rounded-2xl bg-muted/40 border border-border flex items-center justify-center text-2xl">
          📂
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-foreground">No files to show in this directory</p>
          <p class="text-[11px] text-muted-foreground max-w-sm">
            Drag and drop your game assets or folder here, or click the buttons above to transfer them to your Quest.
          </p>
        </div>
        <div class="flex items-center gap-2 pt-2">
          <button
            @click="folderInputRef?.click()"
            class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Upload Game Folder
          </button>
          <button
            @click="fileInputRef?.click()"
            class="px-3 py-1.5 rounded-lg bg-card text-foreground border border-border hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
          >
            Upload Files
          </button>
        </div>
      </div>

      <!-- Files List / Table -->
      <table v-else class="w-full text-left text-xs border-collapse">
        <thead class="sticky top-0 bg-muted/40 border-b border-border/80 text-[10px] font-mono text-muted-foreground uppercase tracking-wider select-none z-5">
          <tr>
            <th class="py-2.5 px-4 font-semibold">Name</th>
            <th class="py-2.5 px-4 font-semibold text-right w-24">Size</th>
            <th class="py-2.5 px-4 font-semibold text-right w-36 hidden sm:table-cell">Modified</th>
            <th class="py-2.5 px-3 text-right w-16"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/40 font-mono">
          <tr
            v-for="entry in entries"
            :key="entry.name"
            class="group hover:bg-muted/30 transition-colors"
            :class="{ 'cursor-pointer': entry.isDirectory }"
            @click="entry.isDirectory ? openFolder(entry) : null"
          >
            <!-- Name Column -->
            <td class="py-2.5 px-4">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="text-sm shrink-0">
                  {{ entry.isDirectory ? '📁' : '📄' }}
                </span>
                <span
                  class="truncate text-foreground font-medium"
                  :class="{ 'text-primary font-bold hover:underline': entry.isDirectory }"
                >
                  {{ entry.name }}
                </span>

                <!-- Verified Asset Badge -->
                <span
                  v-if="isVerifiedFile(entry)"
                  class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0"
                >
                  ✓ Verified
                </span>
              </div>
            </td>

            <!-- Size Column -->
            <td class="py-2.5 px-4 text-right text-muted-foreground text-[11px] whitespace-nowrap">
              {{ entry.isDirectory ? '—' : formatSize(entry.size) }}
            </td>

            <!-- Modified Column -->
            <td class="py-2.5 px-4 text-right text-muted-foreground text-[11px] whitespace-nowrap hidden sm:table-cell">
              {{ formatDate(entry.mtime) }}
            </td>

            <!-- Action Column (Delete) -->
            <td class="py-2.5 px-3 text-right" @click.stop>
              <button
                @click="confirmDelete(entry)"
                class="p-1.5 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                :title="entry.isDirectory ? 'Delete Folder' : 'Delete File'"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Drag & Drop Overlay Indicator -->
    <div
      v-if="isDragOver"
      class="p-3 bg-primary/10 border-t border-primary/30 text-center text-xs font-mono text-primary font-semibold flex items-center justify-center gap-2"
    >
      <span>⬇️</span>
      <span>Drop game files or folders here to upload into {{ currentFullPath }}</span>
    </div>

    <!-- New Folder Dialog / Prompt -->
    <div
      v-if="showNewFolderModal"
      class="p-4 border-t border-border/80 bg-muted/30 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-150"
    >
      <div class="flex-1 w-full space-y-1">
        <label class="text-[11px] font-mono font-medium text-foreground">New Folder Name:</label>
        <input
          v-model="newFolderName"
          type="text"
          placeholder="e.g. data or sound"
          class="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-foreground font-mono text-xs focus:outline-hidden focus:border-primary"
          @keyup.enter="handleCreateFolder"
          autofocus
        />
        <p v-if="newFolderError" class="text-[10px] text-destructive font-mono">{{ newFolderError }}</p>
      </div>

      <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          @click="showNewFolderModal = false; newFolderError = null"
          class="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="handleCreateFolder"
          :disabled="!newFolderName.trim()"
          class="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          Create Folder
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="itemToDelete"
      class="p-4 border-t border-destructive/30 bg-destructive/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150"
    >
      <div class="space-y-0.5">
        <p class="text-xs font-bold text-destructive flex items-center gap-1.5">
          <span>⚠️</span>
          <span>Delete {{ itemToDelete.isDirectory ? 'Folder' : 'File' }}?</span>
        </p>
        <p class="text-[11px] text-muted-foreground font-mono">
          Permanently remove <strong class="text-foreground">{{ itemToDelete.name }}</strong> from Quest storage?
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="itemToDelete = null"
          class="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="executeDelete"
          :disabled="isDeleting"
          class="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-mono font-semibold hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          <span v-if="isDeleting">Deleting...</span>
          <span v-else>Confirm Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>
