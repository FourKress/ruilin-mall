import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    productList: []
  }),
  actions: {
    getProductList(): any[] {
      return this.productList
    },

    async setProductList() {
      const { data: productList } = await useHttpGet({
        url: '/product/list'
      })

      this.productList = productList.value
    }
  }
})
