<script setup lang="ts">
import Rules from '~/components/Rules.vue'
import { Decimal } from 'decimal.js'

import { useCartStore, useRuleStore } from '~/stores'

const emits = defineEmits<{
  close: []
}>()

const router = useRouter()

const useCart = useCartStore()
const useRule = useRuleStore()

const cartList = computed(() => useCart.cart)
const cartTotalPrice = computed(() => useCart.totalPrice)
const cartCount = computed(() => useCart.getCartCount())
const cartSelectList = computed(() => useCart.getCartSelectList())

const ruleList = useRule.ruleList
const matchedRule = ref<any>({})
const typeConfig = ref({})

const isSelectAll = computed(
  () => cartSelectList.value.length === cartCount.value && cartCount.value > 0
)

const showUnitDialog = ref(false)
const showRulesDialog = ref(false)

const orderAmount = ref('0.0')

const skuInfo = ref<Record<string, any>>({})
const currentSku = ref<Record<string, any>>({})
const skuList = ref<Record<string, any>[]>([])
const unitList = ref<any[]>([])

watchEffect(() => {
  orderAmount.value = cartTotalPrice.value

  if (cartTotalPrice.value) {
    const rule = useRule.getMatched(cartTotalPrice.value)
    if (!rule) {
      matchedRule.value = {}
      return
    }
    matchedRule.value = rule
    orderAmount.value = new Decimal(cartTotalPrice.value).minus(rule['faceValue']).valueOf()
  }
})

const handleSelectAll = () => {
  if (cartCount.value <= 0) return
  const status = !isSelectAll.value
  useCart.changeSelect(status)
}

const handleSelectSku = (status: boolean, targetId: string, sku: any) => {
  if (checkDisabled(sku, false)) return
  useCart.changeSelect(status, targetId)
}

const handleSelectProduct = (status: boolean, targetId: string, product: any) => {
  if (checkDisabledProduct(product)) return
  const skuIds = product.children.map((d: any) => d.skuId)
  console.log(product, skuIds)
  useCart.changeSelect(status, targetId, skuIds)
}

const handleChangeQuantity = (targetId: string, type: string) => {
  useCart.changeQuantity(targetId, type)
}

const handleAddQuantity = (sku: any) => {
  if (sku['quantity'] >= sku['online_stock'] || sku['quantity'] >= 999) return
  if (checkDisabled(sku, true)) return
  handleChangeQuantity(sku, 'ADD')
}

const handleReduceQuantity = (productId: string, item: any) => {
  const { quantity } = item
  if (checkDisabled(item, false)) return

  if (quantity <= 1) {
    showConfirmDialog({
      title: 'Confirm action',
      message: 'Are you sure you want to delete this goods?',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      theme: 'round-button'
    })
      .then(() => {
        useCart.deleteFromCart(productId, item)
      })
      .catch(() => {})
    return
  }
  handleChangeQuantity(item, 'REDUCE')
}

const beforeClose = (position: string, productId: string, item: any) => {
  if (position !== 'right') return true
  return new Promise((resolve) => {
    showConfirmDialog({
      title: 'Confirm action',
      message: 'Are you sure you want to delete this goods?',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      theme: 'round-button'
    })
      .then(() => {
        useCart.deleteFromCart(productId, item)
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

const handleCheckOut = async () => {
  if (cartSelectList.value.length <= 0) {
    showToast({
      message: "You haven't selected any goods yet!",
      duration: 3000
    })
    return
  }
  showLoadingToast({
    message: 'Loading...',
    forbidClick: true
  })
  await router.push({
    path: '/payment'
  })
  closeToast()
}

const handleSwitchShoppingCart = () => {
  emits('close')
}

const handleOpenUnitDialog = async (productId: string, sku: Record<string, any>) => {
  if (currentSku.value.skuId === sku.skuId) {
    showUnitDialog.value = true
    return
  }
  const { data: skuRes } = await useHttpPost({
    url: '/product-sku/online-details',
    body: {
      colorId: sku.colorId,
      skuId: sku.skuId
    },
    isLoading: true
  })

  if (!skuRes.value) return
  const { info, list } = skuRes.value
  currentSku.value = sku
  skuInfo.value = info
  skuList.value = list

  const { data: res } = await useHttpGet({
    url: `/product-unit/online-select/${productId}`,
    isLoading: true
  })
  if (!res.value) return
  unitList.value = res.value
  const config: any = {}
  skuInfo.value['unitIds'].forEach((s: any) => {
    const unitTarget = res.value.find((t: any) => s === t.id)
    config[s] = skuInfo.value['tagIds'].find((t: any) =>
      unitTarget.tags.some((c: any) => c.id === t)
    )
  })
  typeConfig.value = config
  showUnitDialog.value = true
}

const handleSelectTag = (unitId: string, tagId: string) => {
  const newTypeConfig = {
    ...typeConfig.value,
    [unitId]: tagId
  }
  typeConfig.value = newTypeConfig
  const tagIds = Object.values(newTypeConfig)
  const targetSku: Record<string, any> | undefined = skuList.value.find((s) =>
    s.tagIds.every((d: any) => tagIds.includes(d))
  )
  if (!targetSku) return
  skuInfo.value = targetSku
}

const handleUpdateSku = () => {
  showUnitDialog.value = false

  if (currentSku.value.skuId === skuInfo.value.id) return

  const { unitIds, tagIds } = skuInfo.value
  const formatList = unitList.value
    .filter((d: any) => unitIds.includes(d.id))
    .map((d: any) => {
      return {
        unitName: d.name,
        tagName: d.tags.find((t: any) => tagIds.includes(t.id)).name
      }
    })

  const { id, ...other } = skuInfo.value

  useCart.changeSku(currentSku.value.skuId, {
    ...other,
    skuId: id,
    format: formatList,
    tagNameStr: formatList.map((d: any) => d.tagName).join(';')
  })
}

const checkDisabled = (sku: any, isAdd: boolean) => {
  if (isAdd) return sku['quantity'] >= sku['online_stock']
  return sku['quantity'] <= 0 || sku['online_stock'] <= 0
}

const checkDisabledProduct = (cart: any) =>
  cart['children'].every((e: any) => e['quantity'] <= 0 || e['online_stock'] <= 0)
</script>

<template>
  <div class="shopping-cart">
    <div class="top">
      <span
        class="left-btn"
        @click="handleSelectAll"
        :style="{ color: parseInt(cartCount) === 0 ? '#D8D8D8' : '#C69C6D' }"
      >
        <span class="icon">
          <van-icon
            :name="isSelectAll ? 'checked' : 'circle'"
            :style="{ color: parseInt(cartCount) === 0 ? '#D8D8D8' : '#C69C6D' }"
          />
        </span>
        <span>All</span>
      </span>
      <span class="label">Shopping Cart </span>
      <span class="count">({{ cartCount }})</span>
      <span class="btn" @click="handleSwitchShoppingCart">
        <van-icon name="cross" />
      </span>
    </div>
    <div class="container">
      <div class="main" v-if="cartList.length">
        <div
          class="product-list"
          :style="{ height: `calc(100% - ${0.8 + (ruleList.length ? 0.4 : 0)}rem)` }"
        >
          <div class="item" v-for="cart in cartList" :key="cart.productId">
            <div class="item-top">
              <span
                class="icon"
                :style="{ color: checkDisabledProduct(cart) ? '#D8D8D8' : '#C69C6D' }"
                @click="handleSelectProduct(!cart.select, cart.productId, cart)"
              >
                <van-icon :name="cart.select ? 'checked' : 'circle'" />
              </span>
              <span>{{ cart['productName'] }}</span>
            </div>
            <div class="panel" v-for="item in cart.children" :key="item.id">
              <van-swipe-cell
                :before-close="({ position }) => beforeClose(position, cart.productId, item)"
              >
                <div class="swipe-container">
                  <div
                    class="select-btn"
                    :style="{ color: checkDisabled(item, false) ? '#D8D8D8' : '#C69C6D' }"
                    @click="handleSelectSku(!item.select, item.skuId, item)"
                  >
                    <van-icon :name="item.select ? 'checked' : 'circle'" />
                  </div>
                  <div class="panel-right">
                    <div class="pic">
                      <van-image class="img" lazy-load :src="item.url" alt="">
                        <template v-slot:loading>
                          <van-loading type="spinner" size="20" />
                        </template>
                      </van-image>
                    </div>
                    <div class="info-container">
                      <div class="info-title">{{ item['color_name'] }}</div>
                      <div class="tips" @click="handleOpenUnitDialog(cart.productId, item)">
                        <span>{{ item['tagNameStr'] }}&nbsp;</span><van-icon name="arrow-down" />
                      </div>
                      <div class="row">
                        <span class="unit">$</span>
                        <span class="price">{{ item['online_price'] }}</span>
                        <span class="stepper">
                          <span
                            class="pre"
                            :style="{ color: checkDisabled(item, false) ? '#D8D8D8' : '#1E1E1E' }"
                            @click="handleReduceQuantity(cart.productId, item)"
                            ><van-icon name="minus"
                          /></span>
                          <span
                            class="count"
                            :style="{ color: checkDisabled(item, false) ? '#D8D8D8' : '#1E1E1E' }"
                            >{{ item['quantity'] }}</span
                          >
                          <span
                            class="next"
                            :style="{ color: checkDisabled(item, true) ? '#D8D8D8' : '#1E1E1E' }"
                            @click="handleAddQuantity(item)"
                          >
                            <van-icon name="plus" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button :style="{ height: '100%' }" square type="danger" text="Delete" />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
        <div class="money-off" v-if="ruleList.length && matchedRule['faceValue']">
          <span class="tag"
            >${{ matchedRule['faceValue'] }} off ${{ matchedRule['thresholdValue'] }}</span
          >
          <span class="text">Already ${{ matchedRule['faceValue'] }} off</span>
          <van-icon name="arrow" @click="showRulesDialog = true" />
        </div>
        <div class="footer">
          <div class="info">
            <span class="row">
              <span class="label">{{ cartSelectList.length }} Items Selected, Total:</span>
              <span class="unit">$</span>
              <span class="price">{{ orderAmount }}</span>
            </span>
            <span class="tips"
              >Money Off：$ <span class="price">{{ matchedRule['faceValue'] || '0.0' }}</span></span
            >
          </div>
          <div class="btn" @click="handleCheckOut">Check Out</div>
        </div>

        <van-overlay
          :show="showUnitDialog"
          :lock-scroll="false"
          @click.self.stop="showUnitDialog = false"
        >
          <div class="dialog">
            <div class="dialog-top">
              <span class="label">Product specifications</span>
              <van-icon name="cross" @click="showUnitDialog = false" />
            </div>
            <div class="dialog-main">
              <div class="card">
                <div class="panel">
                  <div class="pic">
                    <van-image class="img" lazy-load :src="currentSku.url" alt="">
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                    </van-image>
                  </div>
                  <div class="info">
                    <div class="info-title">{{ skuInfo['color_name'] }}</div>
                    <div class="row">
                      <span class="unit">$</span>
                      <span class="price">{{ skuInfo['online_price'] }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card" v-for="unit in unitList" :key="unit.id">
                <div class="card-top">{{ unit.name }}</div>
                <div class="unit-list">
                  <div
                    class="item"
                    :class="[
                      typeConfig[unit.id] === tag.id && 'active',
                      skuList.every((d) => !d['tagIds'].includes(tag.id)) && 'disabled'
                    ]"
                    v-for="tag in unit.tags"
                    :key="tag.id"
                    @click="handleSelectTag(unit.id, tag.id)"
                  >
                    {{ tag.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="dialog-footer" @click="handleUpdateSku">Save</div>
          </div>
        </van-overlay>

        <van-overlay
          :show="showRulesDialog"
          :lock-scroll="false"
          @click.self.stop="showRulesDialog = false"
        >
          <Rules
            @close="showRulesDialog = false"
            :ruleList="ruleList"
            :matchedRuleId="matchedRule.id"
          />
        </van-overlay>
      </div>
      <div class="not-data" v-else>
        <img src="~/assets/images/cart-bg.png" alt="" />
        <div class="tips">— No products —</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shopping-cart {
  @apply fixed
  w-screen
  h-full
  left-0
  top-0
  z-99;

  transition: all 0.5s;

  .top {
    @apply w-full
    h-0.6rem
    flex
    items-center
    justify-center
    text-center
    relative;

    background-color: $white-color;

    .label {
      @apply p-r-0.04rem;

      @include title-font-22;

      color: $text-high-color;
    }

    .count {
      @include english-font;
      @include general-font-14;

      color: $text-mid-color;
    }

    .btn {
      @apply w-0.24rem
      h-0.24rem
      lh-0.24rem
      right-0.16rem
      top-50%
      absolute
      font-size-0.24rem;

      transform: translateY(-50%);
    }

    .left-btn {
      @apply h-0.24rem
      flex
      items-center
      justify-center
      absolute
      top-50%
      left-0.16rem;

      @include general-font-14;

      color: $text-mid-color;
      transform: translateY(-50%);

      .icon {
        @apply h-0.24rem
        w-0.24rem
        block
        m-r-0.04rem
        flex
        items-center
        justify-center;

        font-size: 0.2rem;

        color: $primary-color;
      }
    }
  }

  .container {
    @apply w-full
    relative;

    height: calc(100% - 0.6rem);

    background-color: $view-color;

    .not-data {
      @apply fixed
      left-50%
      top-50%
      w-1.6rem;

      transform: translateX(-50%) translateY(-50%);

      img {
        @apply w-1.6rem
        h-1.6rem
        block;
      }

      .tips {
        @apply p-t-0.16rem
        text-center
        flex
        items-center
        justify-center;

        @include general-font-14;

        color: $text-low-color;
      }
    }

    .main {
      @apply w-full
      h-full
      relative;

      .money-off {
        @apply absolute
        left-0
        bottom-0.8rem
        w-full
        h-0.4rem
        flex
        items-center
        justify-start
        p-x-0.12rem;

        color: $red-color;
        background-color: #ffdedb;

        @include primary-font-14;

        .tag {
          @apply min-w-1rem
          h-0.2rem
          p-x-0.08rem
          rd-0.02rem
          m-r-0.04rem
          text-center;

          @include general-font-12;

          line-height: unset;

          border: 1px solid $red-color;
        }

        .text {
          @apply flex-1;
        }

        .van-icon {
          font-size: 0.16rem;
          color: $red-color;
        }
      }

      .dialog {
        @apply fixed
        left-0
        bottom-0
        w-full
        h-5.85rem
        flex
        flex-col
        justify-between
        items-start
        p-0.16rem
        overflow-hidden;

        border-radius: 0.08rem 0.08rem 0 0;
        background-color: $view-color;

        .dialog-top {
          @apply w-full
          h-0.24rem
          flex
          items-center
          justify-between
          m-b-0.15rem;

          .label {
            @include title-font-18;
            color: $text-high-color;
          }
        }

        .dialog-footer {
          @apply w-1.16rem
          h-0.48rem
          text-center
          rd-0.48rem
          flex
          items-center
          justify-center;

          color: $white-color;

          @include title-font-18;

          background-color: $primary-color;
        }

        .dialog-main {
          @apply w-full
          flex-1
          overflow-y-auto
          m-b-0.16rem;

          .card {
            @apply rd-0.04rem
            p-x-0.16rem
            p-b-0.16rem
            p-t-0.12rem
            m-b-0.12rem;

            &:last-child {
              @apply m-b-0;
            }

            background-color: $white-color;

            .card-top {
              @apply w-full
              h-0.17rem;

              @include title-font-14;

              color: $text-high-color;
            }

            .unit-list {
              @apply flex
              flex-wrap
              justify-between
              items-start;

              .item {
                @apply w-1.55rem
                h-0.3rem
                rd-0.04rem
                m-t-0.16rem
                p-x-0.12rem
                flex
                items-center;

                color: $text-high-color;
                background-color: $placeholder-color;

                &.active {
                  color: $white-color;
                  background-color: $primary-color;
                }

                &.disabled {
                  opacity: 0.5;
                }
              }
            }
          }

          .panel {
            @apply w-full
            h-full
            flex
            items-center
            justify-between
            p-t-0.02rem;

            .pic {
              @apply w-0.75rem
              h-0.75rem
              rd-0.04rem
              overflow-hidden;

              .img {
                @apply block
                w-full
                h-full;
              }
            }

            .info {
              @apply h-0.8rem
              flex-1
              flex
              flex-col
              justify-start
              items-start
              m-l-0.08rem;

              .info-title {
                @apply w-full
                h-0.22rem
                overflow-hidden
                text-ellipsis;

                white-space: nowrap;

                @include title-font-18;
                color: $text-high-color;
              }

              .row {
                @apply w-full
                h-0.22rem
                flex
                items-center
                justify-start
                m-t-0.08rem;

                color: $red-color;

                .unit {
                  @apply p-r-0.02rem;

                  @include general-font-14;

                  transform: translateY(0.5px);
                }

                .price {
                  @apply flex-1
                  p-l-0.02rem;

                  @include number-font;
                  @include primary-font-16;
                }
              }
            }
          }
        }
      }

      .footer {
        @apply absolute
        left-0
        bottom-0
        w-full
        h-0.8rem
        flex
        justify-between
        items-start;

        padding: 0.16rem;
        background-color: $white-color;

        .btn {
          @apply w-1.16rem
          h-0.48rem
          rd-0.5rem
          text-center
          flex
          items-center
          justify-center;

          color: $white-color;
          background-color: $primary-color;

          @include title-font-18;
        }

        .info {
          @apply flex
          flex-col
          justify-center
          items-start
          h-0.48rem;

          .row {
            @apply h-0.18rem
            flex-1
            flex
            items-center
            justify-start;

            color: $red-color;

            .label {
              @include primary-font-14;
              color: $text-high-color;
            }

            .unit {
              @apply p-l-0.04rem;

              @include general-font-14;

              transform: translateY(0.5px);
            }

            .price {
              @apply p-l-0.02rem;

              @include number-font;
              @include title-font-18;
            }
          }

          .tips {
            @include general-font-12;

            color: $text-mid-color;

            .price {
              @include number-font;
            }
          }
        }
      }

      .product-list {
        @apply w-full
        overflow-x-hidden
        overflow-y-auto
        p-x-0.16rem
        p-y-0.12rem;

        height: calc(100% - 0.8rem);

        .item {
          @apply w-full
          min-h-1.5rem
          rd-0.08rem
          m-b-0.12rem
          p-l-0.16rem;

          &:last-child {
            @apply m-b-0;
          }

          background-color: $white-color;

          .item-top {
            @apply w-full
            h-0.4rem
            flex
            items-center
            justify-start
            p-r-0.16rem
            relative;

            @include general-font-14;

            color: $text-high-color;

            &:after {
              @apply h-1px
              absolute
              bottom-0
              left-0.28rem
              m-r-0.16rem;

              content: '';
              width: calc(100% - 0.44rem);

              background-color: $border-color;
            }

            .icon {
              @apply h-0.24rem
              w-0.24rem
              block
              m-r-0.04rem
              flex
              items-center
              justify-center
              m-r-0.04rem;

              font-size: 0.2rem;

              color: $primary-color;
            }
          }

          .panel {
            @apply w-full
            h-1.1rem;

            .swipe-container {
              @apply w-full
              h-1.1rem
              flex
              justify-between
              items-center
              p-r-0.16rem;

              &:after {
                @apply h-1px
                absolute
                bottom-0
                left-0.28rem
                m-r-0.16rem;

                content: '';
                width: calc(100% - 0.44rem);

                background-color: $border-color;
              }
            }

            &:last-child {
              .swipe-container {
                &:after {
                  display: none;
                }
              }
            }

            :deep(.van-swipe-cell__right) {
              right: -1px !important;
            }

            .select-btn {
              @apply h-0.24rem
              w-0.24rem
              block
              m-r-0.04rem
              flex
              items-center
              justify-center;

              font-size: 0.2rem;

              color: $primary-color;
            }

            .panel-right {
              @apply flex-1
              flex
              items-center
              justify-between
              p-t-0.14rem
              p-b-0.16rem
              overflow-hidden;

              .pic {
                @apply w-0.75rem
                h-0.75rem
                m-r-0.08rem
                rd-0.04rem
                overflow-hidden;

                .img {
                  @apply block
                  w-full
                  h-full;
                }
              }

              .info-container {
                @apply flex-1
                flex
                flex-col
                justify-center
                items-start
                overflow-hidden;

                .info-title {
                  @apply w-full
                  h-0.22rem
                  overflow-hidden
                  text-ellipsis;

                  white-space: nowrap;

                  @include title-font-18;
                  color: $text-high-color;
                }

                .tips {
                  @apply w-auto
                  max-w-full
                  h-0.2rem
                  m-y-0.06rem
                  overflow-hidden
                  text-ellipsis
                  rd-0.02rem
                  p-x-0.08rem
                  flex
                  justify-start
                  items-center;

                  white-space: nowrap;

                  @include general-font-14;

                  color: $text-mid-color;
                  background-color: $placeholder-color;
                }

                .row {
                  @apply w-full
                  h-0.26rem
                  flex
                  items-center
                  justify-start;

                  color: $red-color;

                  .unit {
                    @apply p-r-0.02rem;

                    @include general-font-14;

                    transform: translateY(0.5px);
                  }

                  .price {
                    @apply flex-1
                    p-l-0.02rem;

                    @include number-font;
                    @include primary-font-16;
                  }

                  .stepper {
                    @apply flex
                    items-center
                    justify-center;

                    .pre,
                    .next {
                      @apply w-0.26rem
                      h-0.26rem
                      rd-0.02rem
                      flex
                      items-center
                      justify-center;
                      color: $text-high-color;
                      background-color: $placeholder-color;

                      &.disabled {
                        color: $text-low-color;
                      }
                    }

                    .count {
                      @apply w-0.26rem
                      h-0.18rem
                      m-x-0.02rem
                      text-center;

                      @include primary-font-14;
                      color: $text-high-color;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
