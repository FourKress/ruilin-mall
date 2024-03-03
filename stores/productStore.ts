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
      const runtimeConfig = useRuntimeConfig()
      const baseUrl = runtimeConfig.public.baseUrl

      const { data: productList }: any = await useFetch(`${baseUrl}/product/list`, {
        method: 'get',
        transform: (res: any) => {
          return res.data
        }
      })
      this.productList = productList
    }
  }
})
