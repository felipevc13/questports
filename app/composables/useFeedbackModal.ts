export const useFeedbackModal = () => {
  const isOpen = useState('feedback-modal-open', () => false)
  const pagePath = useState('feedback-modal-path', () => '')

  const open = (path = '') => {
    pagePath.value = path
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    pagePath.value = ''
  }

  return {
    isOpen,
    pagePath,
    open,
    close
  }
}
