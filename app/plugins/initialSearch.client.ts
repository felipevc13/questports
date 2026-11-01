/**
 * The catalog page is prerendered at "/" and the router drops the query for a
 * moment while it hydrates. Keep the address as it was when the page loaded so
 * ?cat, ?dev, ?q and ?nopc survive a reload.
 */
export default defineNuxtPlugin(() => {
  return { provide: { initialSearch: window.location.search } }
})
