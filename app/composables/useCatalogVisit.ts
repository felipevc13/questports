import { onMounted, ref } from 'vue'
import { armLastVisitWrite, readLastVisit } from '~/lib/catalogVisit'

const ready = ref(false)
const lastVisit = ref<number | null>(null)
let started = false

/**
 * Reads the previous visit once, on the client, so catalog cards can render
 * the New badge after hydration without a mismatch. The stored stamp updates
 * on leave and after a delay; this ref keeps the value from the start of the visit.
 */
export function useCatalogVisit() {
  onMounted(() => {
    if (started) return
    started = true
    lastVisit.value = readLastVisit(window.localStorage)
    ready.value = true
    armLastVisitWrite(window.localStorage)
  })

  return { ready, lastVisit }
}
