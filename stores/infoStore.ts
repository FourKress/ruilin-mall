import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', {
  state: () => ({
    details: ref<Record<string, any>>({
      url: 'https://assets.vinnhair.com/static/Logo.png',
      name: 'RuiLin Hair',
      email: 'service@vinnhair.com'
    })
  }),
  actions: {
    async getInfoDetails() {
      const { data: res } = await useHttpGet({
        url: `/mall/details`
      })
      if (!res.value) return

      this.details = {
        ...res.value,
        url: `https://assets.vinnhair.com/static/${res.value.objectKey}`
      }
    }
  }
})
