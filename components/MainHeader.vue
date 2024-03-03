<script setup lang="ts">
import { Decimal } from 'decimal.js'

import { menuConfig } from '~/utils/menuConfig'
import Rules from '~/components/Rules.vue'
import { useProductStore } from '~/stores'

const productList = useProductStore().getProductList()

const router = useRouter()
const route = useRoute()

const emits = defineEmits<{
  openModal: [status: boolean]
}>()

const drawerStatus = ref(false)
const openShoppingCart = ref(false)
const moneyOff = ref(0.0)
const totalPrice = ref(0.0)
const selectList = ref<any[]>([])
const skuList = ref<any[]>([
  {
    id: '1',
    select: false,
    children: [
      { id: '111', select: false, price: 0.1, count: 1 },
      { id: '444', select: false, price: 0.2, count: 1 }
    ]
  },
  { id: '2', select: false, children: [{ id: '132', select: false, price: 0.1, count: 1 }] },
  { id: '3', select: false, children: [{ id: '43', select: false, price: 0.7, count: 1 }] },
  { id: '4', select: false, children: [{ id: '123', select: false, price: 0.4, count: 1 }] }
])
const isSelectAll = ref(false)
const menuList = ref<any[]>([
  {
    label: 'Log in/Sign up',
    link: '/enter'
  },
  ...menuConfig.map((d) => {
    if (d.label === 'Product') {
      d.children = productList.map((d) => ({ label: d.name, link: `/product/${d.id}` }))
    }
    return d
  })
])
const showUnitDialog = ref(false)
const showRulesDialog = ref(false)

const handleSwitchDrawerStatus = () => {
  const status = !drawerStatus.value
  emits('openModal', status)
  drawerStatus.value = status
}

const handleJumpMenu = (link: string) => {
  if (link) {
    handleSwitchDrawerStatus()
    if (route.path === link) {
      return location.reload()
    }
    return router.push(link)
  }
}

const handleSwitchShoppingCart = (status: boolean) => {
  handleSwitchDrawerStatus()
  openShoppingCart.value = status
}

const computedTotalPrice = () => {
  const total = selectList.value.map((d) => d.price).reduce((a, b) => new Decimal(a).plus(b), 0)
  totalPrice.value = total.valueOf()
}

const handleSelectAll = () => {
  const status = !isSelectAll.value
  isSelectAll.value = status

  const list: any[] = []
  skuList.value = skuList.value.map((d) => {
    const { children, select, ...other } = d
    if (status) {
      list.push(...children)
    }
    return {
      ...other,
      select: status,
      children: children.map((c: any) => {
        return {
          ...c,
          select: status
        }
      })
    }
  })
  selectList.value = list
  computedTotalPrice()
}

const handleSelect = (targetId: string) => {
  let tempSelectCount = 0
  skuList.value = skuList.value.map((d) => {
    const { children, select, id } = d
    tempSelectCount += children.length
    if (id === targetId) {
      if (!select) {
        selectList.value.push(...children)
      } else {
        const childrenIds = children.map((c: any) => c.id)
        selectList.value = selectList.value.filter((s) => !childrenIds.includes(s.id))
      }
      return {
        ...d,
        select: !select,
        children: children.map((c: any) => {
          return {
            ...c,
            select: !select
          }
        })
      }
    }
    const childrenTarget = children.find((c: any) => c.id === targetId)
    if (childrenTarget) {
      const temp = children.map((c: any) => {
        return {
          ...c,
          select: c.id === targetId ? !c.select : c.select
        }
      })
      const tempSelectCount = temp.filter((t: any) => t.select).length
      if (!childrenTarget.select) {
        selectList.value.push(childrenTarget)
      } else {
        selectList.value = selectList.value.filter((s) => s.id !== targetId)
      }
      return {
        ...d,
        select: tempSelectCount === temp.length,
        children: temp
      }
    }
    return {
      ...d
    }
  })
  computedTotalPrice()
  const selectCount = selectList.value.length
  isSelectAll.value = selectCount === tempSelectCount
}

const handleChangeCount = (targetId: string, type: string) => {
  skuList.value = skuList.value.map((d) => {
    const { children, ...other } = d
    return {
      ...other,
      children: children.map((c: any) => {
        const { count, id } = c
        if (id !== targetId)
          return {
            ...c
          }
        if (type === 'ADD') {
          return {
            ...c,
            count: count + 1
          }
        }
        if (count - 1 <= 1) {
          showConfirmDialog({
            message: 'Are you sure you want to delete this product?',
            theme: 'round-button'
          })
            .then(() => {
              // on confirm
            })
            .catch(() => {
              // on cancel
            })
        }
        return {
          ...c,
          count: Math.max(count - 1, 1)
        }
      })
    }
  })
}
const handleAddCount = (id: string) => {
  handleChangeCount(id, 'ADD')
}

const handleReduceCount = (id: string) => {
  handleChangeCount(id, 'REDUCE')
}

const handleCheckOut = () => {
  if (selectList.value?.length <= 0) {
    showToast({
      message: "You haven't selected any products yet!",
      duration: 3000
    })
    return
  }
  const token = sessionStorage.getItem('token')
  console.log(token)
  if (!token) {
    handleSwitchShoppingCart(false)
    router.push('/payment')
  }
}
</script>

<template>
  <div class="main-header">
    <div class="left" @click="handleSwitchDrawerStatus"></div>
    <div class="logo" @click="handleJumpMenu('/')">
      <img src="~/assets/images/Logo.png" alt="" />
    </div>
    <van-badge :content="10" max="99" position="top-left">
      <div class="right" @click="handleSwitchShoppingCart(true)"></div>
    </van-badge>

    <Transition name="fade" :duration="0.5">
      <div class="drawer" v-if="drawerStatus">
        <div class="menu">
          <div class="menu-item" v-for="(item, index) in menuList" :key="index">
            <div class="top" @click="handleJumpMenu(item.link)">
              <span class="label">{{ item.label }}</span>
              <van-icon name="arrow" v-if="!item.children" />
            </div>
            <div class="list">
              <div
                class="row"
                v-for="row in item.children"
                :key="item.link"
                @click="handleJumpMenu(row.link)"
              >
                <span class="label">{{ row.label }}</span>
                <span class="btn"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade" :duration="0.5">
      <div class="shopping-cart" v-if="openShoppingCart">
        <div class="top">
          <span class="left-btn" @click="handleSelectAll">
            <span class="icon">
              <van-icon :name="isSelectAll ? 'checked' : 'circle'" />
            </span>
            <span>All</span>
          </span>
          <span class="label">购物车 </span>
          <span class="count"
            >({{ skuList.reduce((pre, cur) => (pre += cur.children.length), 0) }})</span
          >
          <span class="btn" @click="handleSwitchShoppingCart(false)">
            <van-icon name="cross" />
          </span>
        </div>
        <div class="container">
          <div class="main" v-if="skuList.length">
            <div class="product-list" :style="{ height: `calc(100% - ${0.8 + 0.4}rem)` }">
              <div class="item" v-for="product in skuList" :key="product.id">
                <div class="item-top">
                  <span class="icon" @click="handleSelect(product.id)">
                    <van-icon :name="product.select ? 'checked' : 'circle'" />
                  </span>
                  <span>Tape-in Extension</span>
                </div>
                <div class="panel" v-for="item in product.children" :key="item.id">
                  <div class="select-btn" @click="handleSelect(item.id)">
                    <van-icon :name="item.select ? 'checked' : 'circle'" />
                  </div>
                  <div class="panel-right">
                    <div class="pic">
                      <img src="" alt="" />
                    </div>
                    <div class="info-container">
                      <div class="info-title">lnjection Tape-in</div>
                      <div class="tips" @click="showUnitDialog = true">
                        <span>color ; Length&nbsp;</span><van-icon name="arrow-down" />
                      </div>
                      <div class="row">
                        <span class="unit">$</span>
                        <span class="price">{{ item.price }}</span>
                        <span class="stepper">
                          <span class="pre" @click="handleReduceCount(item.id)"></span>
                          <span class="count">{{ item.count }}</span>
                          <span class="next" @click="handleAddCount(item.id)"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="money-off">
              <span class="tag">$10 off $100</span>
              <span class="text">Already $90 off</span>
              <van-icon name="arrow" @click="showRulesDialog = true" />
            </div>
            <div class="footer">
              <div class="info">
                <span class="row">
                  <span class="label">{{ selectList.length }} Items Selected, Total:</span>
                  <span class="unit">$</span>
                  <span class="price">{{ totalPrice }}</span>
                </span>
                <span class="tips"
                  >Money Off：$ <span class="price">{{ moneyOff }}</span></span
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
                        <img src="" alt="" />
                      </div>
                      <div class="info">
                        <div class="info-title">lnjection Tape-in</div>
                        <div class="row">
                          <span class="unit">$</span>
                          <span class="price">{{ 12 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="card" v-for="item in 4" :key="item">
                    <div class="card-top">Length</div>
                    <div class="unit-list">
                      <div class="item active">12"</div>
                      <div class="item">22"</div>
                      <div class="item">32"</div>
                    </div>
                  </div>
                </div>
                <div class="dialog-footer" @click="showUnitDialog = false">Save</div>
              </div>
            </van-overlay>

            <van-overlay
              :show="showRulesDialog"
              :lock-scroll="false"
              @click.self.stop="showRulesDialog = false"
            >
              <Rules @close="showRulesDialog = false" />
            </van-overlay>
          </div>
          <div class="not-data" v-else>
            <img src="~/assets/images/not-data.png" alt="" />
            <div class="tips">— No products —</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.main-header {
  @apply w-screen
  h-0.64rem
  flex
  justify-between
  items-center
  p-x-0.16rem
  fixed
  left-0
  top-0
  z-99;

  background-color: $white-color;

  .left,
  .right {
    @apply w-0.24rem
    h-0.24rem
    cursor-pointer;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .left {
    background-image: url('@/assets/images/menu.png');
  }

  .right {
    @apply relative;

    background-image: url('@/assets/images/car.png');
  }

  .logo {
    @apply w-0.8rem
    h-0.4rem;

    img {
      @apply block
      w-full
      h-full;
    }
  }

  .drawer {
    @apply fixed
    w-screen
    h-full
    left-0
    top-0.64rem
    z-99;

    padding-bottom: env(safe-area-inset-bottom);

    transition: all 0.5s;

    .menu {
      @apply p-0.16rem overflow-y-auto;

      height: calc(100% - 0.64rem);

      background-color: $white-color;

      .menu-item {
        @apply w-full
        min-h-0.6rem;

        border-bottom: 1px solid $border-color;

        &:last-child {
          border-bottom: none;
        }

        .top {
          @apply w-full
          h-0.60rem
          flex
          justify-between
          items-center;

          color: $text-high-color;

          .label {
            @include primary-font-14;
            @include english-font;
          }
        }

        .list {
          @apply w-full;

          .row {
            @apply w-full
            h-0.48rem
            flex
            justify-between
            items-center;

            @include general-font-loose-14;
            @include english-font;

            color: $text-high-color;
          }
        }
      }
    }
  }

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
      h-0.5rem
      flex
      items-center
      justify-center
      text-center
      relative;

      background-color: $white-color;

      .label {
        @apply p-r-0.04rem;

        @include title-font-18;

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
        font-size-0.18rem;

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

      height: calc(100% - 0.5rem);

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

          background-color: black;
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
            @apply w-0.96rem
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
            font-size: 16px;
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

          border-radius: 8px 8px 0 0;
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
            @apply w-full
            h-0.48rem
            text-center
            rd-0.48rem;

            color: $white-color;

            @include title-font-18;

            line-height: 48px;

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
                  lh-0.3rem
                  rd-0.04rem
                  m-t-0.16rem
                  p-x-0.12rem;

                  color: $text-high-color;
                  background-color: $placeholder-color;

                  &.active {
                    color: $white-color;
                    background-color: $primary-color;
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
                @apply w-0.6rem
                h-0.80rem;

                img {
                  @apply block
                  w-full
                  h-full;

                  background-color: black;
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
            p-x-0.16rem
            m-b-0.12rem;

            &:last-child {
              @apply m-b-0;
            }

            background-color: $white-color;

            .item-top {
              @apply w-full
              h-0.4rem
              flex
              items-center
              justify-start;

              @include general-font-14;

              color: $text-high-color;

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
              h-1.1rem
              flex
              justify-between
              items-center;

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

                border-top: 1px solid $border-color;

                .pic {
                  @apply w-0.6rem
                  h-0.8rem
                  m-r-0.08rem;

                  img {
                    @apply block
                    w-full
                    h-full;
                  }

                  background-color: black;
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

                        background-color: $placeholder-color;
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

  .fade-enter-from,
  .fade-leave-to {
    transform: translateX(0.2rem);
    opacity: 0;
  }
}
</style>
