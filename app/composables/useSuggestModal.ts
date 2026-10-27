export const useSuggestModal = () => {
  const isOpen = useState('suggest-modal-open', () => false)
  const prefillTitle = useState('suggest-modal-title', () => '')
  const fromSearch = useState('suggest-modal-from-search', () => false)

  const open = (title = '', options?: { fromSearch?: boolean }) => {
    prefillTitle.value = title
    fromSearch.value = options?.fromSearch === true
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    prefillTitle.value = ''
    fromSearch.value = false
  }

  return {
    isOpen,
    prefillTitle,
    fromSearch,
    open,
    close
  }
}
