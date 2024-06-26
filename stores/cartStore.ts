import { defineStore } from 'pinia'
import { Decimal } from 'decimal.js'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: ref<any[]>([]),
    rawCart: [],
    totalPrice: ref('0.0'),
    modifyTime: ref(0),
    selectList: []
  }),
  actions: {
    clear() {
      this.cart = []
      this.totalPrice = '0.0'
      this.modifySku()
    },
    handleGrouped(cartList: any[]): any[] {
      const grouped = cartList.reduce((result: any, item: any) => {
        if (!result[item.productId]) {
          result[item.productId] = {
            productId: item.productId,
            productName: item['product_name'],
            children: []
          }
        }

        result[item.productId].children.push(item)

        return result
      }, {})

      return Object.values(grouped).map((d: any) => {
        const selectCount = d.children.filter((c: any) => c.select).length
        return {
          ...d,
          select: selectCount === d.children.length
        }
      })
    },
    async getFetchCartList(isLoading = false) {
      const { data } = await useHttpGet({
        url: `/shop-cart/list`,
        isLoading
      })
      if (!data.value) return

      this.rawCart = data.value
      this.cart = this.handleGrouped(data.value)

      this.computeTotalPrice(this.cart)
    },
    async getPaymentGoodsList() {
      await this.getFetchCartList()
      const rawCartList = this.rawCart.filter((d: any) => d.select)
      const cartList = this.handleGrouped(rawCartList)
      this.computeTotalPrice(cartList)
      return cartList
    },
    getCartCount() {
      return this.cart.reduce((pre, cur) => {
        const count = cur.children.filter(
          (c: any) => c['quantity'] > 0 || c['online_stock'] > 0
        ).length
        return pre + count
      }, 0)
    },
    getCartSelectList() {
      const selectList = this.cart.reduce((pre, cur) => {
        const selectList = cur.children.filter((d: any) => d.select)
        pre.push(...selectList)
        return pre
      }, [])
      this.selectList = selectList
      return selectList
    },
    getSku(productId: string, skuId: string) {
      return this.cart
        .find((d: any) => d.productId === productId)
        ?.children.find((d: any) => d.skuId === skuId)
    },
    modifySku() {
      this.modifyTime = Date.now()
    },

    computeTotalPrice(cart?: any[]) {
      const cartList = cart || this.cart
      this.totalPrice = cartList.reduce((pre: any, cur: any) => {
        const price = cur.children.reduce((a: any, b: any) => {
          const { quantity, select, online_price } = b
          if (select) {
            const price = new Decimal(online_price).times(quantity).valueOf()
            return new Decimal(a).plus(price).valueOf()
          }
          return a
        }, '0.0')
        return new Decimal(pre).plus(price).valueOf()
      }, '0.0')
    },

    async changeSelect(status: boolean, targetId?: string, skuIds?: string[]) {
      const isAll = !targetId
      await this.handleSelect(skuIds ? skuIds : targetId ? [targetId] : [], status)
      this.cart = this.cart.map((d) => {
        const { children, productId } = d
        if (isAll || productId === targetId) {
          const notSelect = children.every((e: any) => e['quantity'] <= 0 || e['online_stock'] <= 0)
          return {
            ...d,
            select: notSelect ? false : status,
            children: children.map((c: any) => {
              return {
                ...c,
                select: c['quantity'] <= 0 || c['online_stock'] <= 0 ? false : status
              }
            })
          }
        }

        const childrenTarget = children.find((c: any) => c.skuId === targetId)
        if (childrenTarget) {
          let tempSelectCount = 0
          const newChildren = children.map((c: any) => {
            const select = c.skuId === targetId ? status : c.select
            if (select) {
              tempSelectCount++
            }
            return {
              ...c,
              select
            }
          })
          return {
            ...d,
            select: children.length === tempSelectCount,
            children: newChildren
          }
        }
        return d
      })
      this.computeTotalPrice()
    },

    async changeQuantity(target: any, type: string, count = 1) {
      const realQuantity = type === 'ADD' ? target.quantity + count : target.quantity - count
      const res = await this.handleUpdate(target.id, realQuantity)
      if (!res) return

      this.cart = this.cart.map((d) => {
        const { children, ...other } = d
        return {
          ...other,
          children: children.map((c: any) => {
            const { quantity, skuId } = c
            const newQuantity = skuId === target.skuId ? realQuantity : quantity
            return {
              ...c,
              quantity: newQuantity
            }
          })
        }
      })
      this.computeTotalPrice()
      this.modifySku()
    },
    async changeSku(modifySkuId: string, newSku: any) {
      let removeId = ''
      const newCart = this.cart.map((d: any) => {
        const { children } = d
        const modifySku = children.find((c: any) => c.skuId === modifySkuId)
        const modifyIndex = children.findIndex((c: any) => c.skuId === modifySkuId)
        const hasSku = children.find((c: any) => c.skuId === newSku.skuId)

        const newChildren = children
          .map((c: any, index: number) => {
            const { quantity, skuId, id } = c

            if (hasSku) {
              if (c.skuId === newSku.skuId) {
                return { ...c, quantity: c.quantity + modifySku.quantity }
              }
              if (index === modifyIndex) {
                removeId = id
                return false
              }
            }

            if (!hasSku && skuId === modifySkuId) {
              removeId = id
              return { ...newSku, quantity }
            }
            return c
          })
          .filter((d: any) => d)

        return {
          ...d,
          children: newChildren
        }
      })

      if (removeId) {
        const res = await this.handleDelete(removeId)
        if (!res) return
      }

      const res = await this.handleFetchCrate(newCart)
      if (!res) return
      await this.getFetchCartList()
      this.modifySku()
    },

    // 从购物车删除
    async deleteFromCart(productId: string, sku: any) {
      // 请求删除接口更新数据库
      const res = await this.handleDelete(sku.id)
      if (!res) return

      this.cart = this.cart
        .map((d) => {
          if (d.productId === productId) {
            const children = d.children.filter((s: any) => s.skuId !== sku.skuId)
            const selectCount = children.filter((s: any) => s.select).length
            if (children.length) {
              return {
                ...d,
                select: selectCount === children.length,
                children
              }
            }
            return false
          }
          return d
        })
        .filter((d) => d)

      this.computeTotalPrice()
      this.modifySku()
    },

    // 加入购物车
    async addToCart(product: any) {
      const newSku = product.children[0]
      const targetSku = this.getSku(product.productId, newSku.skuId)
      if (targetSku) {
        await this.changeQuantity(targetSku, 'ADD', newSku.quantity)
        return false
      }
      const cartList = [...this.cart]
      cartList.push({
        ...product,
        children: [{ ...newSku }]
      })

      await this.handleFetchCrate(cartList)
      return true
    },

    async handleUpdate(id: string, quantity: number) {
      const { data } = await useHttpPost({
        url: `/shop-cart/update`,
        body: {
          id,
          quantity
        },
        isLoading: true
      })
      return !!data.value
    },

    async handleSelect(ids: string[], select: boolean) {
      const { data } = await useHttpPost({
        url: `/shop-cart/select`,
        body: {
          ids,
          select
        },
        isLoading: true
      })
      return !!data.value
    },

    async handleDelete(id: string) {
      // 请求删除接口更新数据库
      const { data } = await useHttpGet({
        url: `/shop-cart/delete/${id}`,
        isLoading: true
      })
      return !!data.value
    },

    async handleFetchCrate(cartList: any[]): Promise<boolean> {
      const { data } = await useHttpPost({
        url: '/shop-cart/create',
        body: {
          cartList: cartList
            .map((d) => {
              const { children } = d
              return children.map((c: any) => {
                const {
                  quantity,
                  productId,
                  colorId,
                  skuId,
                  id,
                  tagNameStr,
                  format,
                  select = 1
                } = c
                return {
                  quantity,
                  productId,
                  colorId,
                  skuId,
                  id,
                  format,
                  tagNameStr,
                  select: id ? select > 0 : true
                }
              })
            })
            .flat()
        },
        isLoading: true
      })

      return data.value
    }
  }
})
