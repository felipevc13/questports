export const useSuggestModal = () => {
  const isOpen = useState('suggest-modal-open', () => false)
  const prefillTitle = useState('suggest-modal-title', () => '')

  const open = (title = '') => {
    prefillTitle.value = title
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    prefillTitle.value = ''
  }

  return {
    isOpen,
    prefillTitle,
    open,
    close
  }
}
