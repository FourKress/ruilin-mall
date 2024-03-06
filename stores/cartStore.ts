import { defineStore } from 'pinia'
import { Decimal } from 'decimal.js'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: ref<any[]>([]),
    totalPrice: ref('0.0'),
    modifyTime: ref(0)
  }),
  actions: {
    getCartCount() {
      return this.cart.reduce((pre, cur) => {
        const count = cur.children.length
        return pre + count
      }, 0)
    },
    getCartSelectCount() {
      return this.cart.reduce((pre, cur) => {
        const count = cur.children.filter((d: any) => d.select).length
        return pre + count
      }, 0)
    },
    getSku(productId: string, skuId: string) {
      return this.cart
        .find((d: any) => d.productId === productId)
        ?.children.find((d: any) => d.id === skuId)
    },
    modifySku() {
      this.modifyTime = Date.now()
    },

    computeTotalPrice() {
      this.totalPrice = this.cart.reduce((pre: any, cur: any) => {
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

    changeSelect(status: boolean, targetId?: string) {
      const isAll = !targetId
      this.cart = this.cart.map((d) => {
        const { children, productId } = d
        if (isAll || productId === targetId) {
          return {
            ...d,
            select: status,
            children: children.map((c: any) => {
              return {
                ...c,
                select: status
              }
            })
          }
        }

        const childrenTarget = children.find((c: any) => c.id === targetId)
        if (childrenTarget) {
          let tempSelectCount = 0
          const newChildren = children.map((c: any) => {
            const select = c.id === targetId ? status : c.select
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

    changeQuantity(targetId: string, type: string) {
      this.cart = this.cart.map((d) => {
        const { children, ...other } = d
        return {
          ...other,
          children: children.map((c: any) => {
            const { quantity, id, select } = c
            const newQuantity =
              id === targetId ? (type === 'ADD' ? quantity + 1 : quantity - 1) : quantity
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
    changeSku(modifySkuId: string, newSku: any) {
      this.cart = this.cart.map((d: any) => {
        const { children } = d
        const modifySku = children.find((c: any) => c.id === modifySkuId)
        const modifyIndex = children.findIndex((c: any) => c.id === modifySkuId)
        const hasSku = children.find((c: any) => c.id === newSku.id)

        const newChildren = children
          .map((c: any, index: number) => {
            const { quantity, url, select, id } = c

            if (hasSku && c.id === newSku.id) {
              return { ...c, quantity: c.quantity + modifySku.quantity }
            }

            if (hasSku && index === modifyIndex) {
              return false
            }

            if (!hasSku && id === modifySkuId) {
              return { ...newSku, quantity, url, select }
            }
            return c
          })
          .filter((d: any) => d)

        return {
          ...d,
          children: newChildren
        }
      })

      this.computeTotalPrice()
      this.modifySku()
    },

    // 从购物车删除
    async deleteFromCart(productId: string, skuId: any) {
      this.cart = this.cart
        .map((d) => {
          if (d.productId === productId) {
            const children = d.children.filter((s: any) => s.id !== skuId)
            if (children.length) {
              return {
                ...d,
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
      // 请求删除接口更新数据库
      // await $fetch('http://xxxxx' + product.id, {
      //     method: 'delete'
      // })
    },
    // 增加商品数量
    async addQuantity(product: any) {
      let targetProduct
      this.cart = this.cart.map((d) => {
        if (d.productId === product.productId) {
          const { children } = d
          const sku = product.children[0]
          const targetSku = children.find((s: any) => s.id === sku.id)
          if (targetSku) {
            targetSku.quantity += sku.quantity
            targetProduct = targetSku
          } else {
            children.push({
              ...sku,
              select: false
            })
            targetProduct = sku
          }
        }
        return d
      })

      this.computeTotalPrice()
      // 请求接口增加商品数量
      // await $fetch('http://xxxxx' + product.id, {
      //     method: 'put',
      //     body: JSON.stringify(updatedProduct)
      // })
    },

    // 减少商品数量
    async decQuantity(product: any) {
      let targetProduct
      this.cart = this.cart.map((p) => {
        if (p.id === product.id && p.quantity > 1) {
          p.quantity--
          targetProduct = p
        }
        return p
      })
      // 减少商品数量接口
      // if (updatedProduct) {
      //     await $fetch('http://xxxx' + product.id, {
      //         method: 'put',
      //         body: JSON.stringify(updatedProduct)
      //     })
      // }
    },
    // 加入购物车
    async addToCart(product: any) {
      const exists = this.cart.some((d) => d.productId === product.productId)
      if (exists) {
        await this.addQuantity(product)
        return
      }
      if (!exists) {
        const sku = product.children[0]
        this.cart.push({
          ...product,
          select: false,
          children: [{ ...sku, select: false }]
        })
        // 加入购物车接口请求更新数据库
        // await $fetch('http://xxxxx', {
        //     method: 'post',
        //     body: JSON.stringify({...product, quantity: 1})
        // })
      }
      this.computeTotalPrice()
    }
  }
})
