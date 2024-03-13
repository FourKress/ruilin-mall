export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    if (process.client) {
      document.querySelector('.app-warp')?.scrollTo(0, 0)
    }
  })
})
