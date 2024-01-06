// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  app: {
    head: {
      meta: [],
      title: 'Hello Nuxt'
    }
  },
  devServer: {
    port: 4444,
  }
})
