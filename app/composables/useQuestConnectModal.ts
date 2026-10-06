import { useState } from '#imports'

export interface PendingInstall {
  title: string
  apkUrl?: string
  file?: File
  slug?: string
}

export const useQuestConnectModal = () => {
  const isOpen = useState('quest-modal-open', () => false)
  const pendingInstall = useState<PendingInstall | null>('quest-modal-pending-install', () => null)

  const open = (installData?: PendingInstall) => {
    if (installData) {
      pendingInstall.value = installData
    }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const clearPendingInstall = () => {
    pendingInstall.value = null
  }

  return {
    isOpen,
    pendingInstall,
    open,
    close,
    clearPendingInstall
  }
}
