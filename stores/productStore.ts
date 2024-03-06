import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    productList: ref<any>([])
  }),
  actions: {
    async getProductList() {
      const { data: res } = await useHttpGet({
        url: '/product/list'
      })

      this.productList = res.value
    }
  }
})
