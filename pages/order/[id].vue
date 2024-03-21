<script setup lang="ts">
import orderStatusTipsMap from '~/utils/orderStatusMap'
import handlePayNow from '~/utils/payNow'
import { useCartStore } from '~/stores'

const route = useRoute()
const router = useRouter()
const order = ref<any>({})
const goodsList = ref<any[]>([])
const useCart = useCartStore()

const showCall = ref(false)
const openShoppingCart = ref(false)
const openLogs = ref(false)
const openRefund = ref(false)
const refundRemark = ref('')
const statusMap = ref<any[]>([])
const email = ref('service@vinnhair.com')

if (!route.params?.id) {
  router.push('/')
}

const { data } = await useHttpGet({
  url: `/order/online_details/${route.params?.id}`
})

if (data.value) {
  const { productList } = data.value
  order.value = data.value

  const grouped = productList.reduce((result: any, item: any) => {
    if (!result[item.productId]) {
      result[item.productId] = {
        productId: item.productId,
        productName: item['productName'],
        children: []
      }
    }

    result[item.productId].children.push(item)

    return result
  }, {})
  const { statusMap: map, status, updateTime } = data.value
  goodsList.value = Object.values(grouped)
  statusMap.value = [
    ...map.filter((d: any) => ![6, 7].includes(d.status)),
    {
      status,
      time: updateTime
    }
  ].reverse()
}

const handleActionCancelOrder = async (order: any) => {
  const { data } = await useHttpPost({
    url: `/order/online-cancel/${order.id}`,
    body: {
      refundRemark: order['paymentTime'] ? refundRemark.value : ''
    },
    isLoading: true
  })
  if (data.value) await router.push('/order')
}
const handleCancelOrder = (order: any) => {
  showConfirmDialog({
    title: 'Confirm action',
    message: 'Are you sure you want to cancel the order?',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    theme: 'round-button'
  })
    .then(async () => {
      const { data } = await useHttpGet({
        url: `/order/online-cancel/${order.id}`,
        body: {
          refundRemark: ''
        }
      })
      if (data.value) await router.push('/order')
    })
    .catch(() => {})
}

const handleOpenRefund = () => {
  openRefund.value = true
  refundRemark.value = ''
}
const handleDeleteOrder = (order: any) => {
  showConfirmDialog({
    message: 'Are you sure you want to delete the order?',
    theme: 'round-button'
  })
    .then(async () => {
      const { data } = await useHttpGet({
        url: `/order/online-delete/${order.id}`
      })
      if (data.value) await router.push('/order')
    })
    .catch(() => {})
}

const handleReOrder = async (order: any) => {
  await useCart.getFetchCartList(true)
  const goodsList = order.productList
  await Promise.all(
    goodsList.map(async (d: any) => {
      await useCart.addToCart({
        productId: d.productId,
        productName: order.productName,
        children: [
          {
            skuId: d.skuId,
            quantity: d.quantity,
            url: d.url,
            format: d.format,
            tagNameStr: d.tagNameStr,
            productId: d.productId,
            colorId: d.colorId
          }
        ]
      })
    })
  )
  await useCart.getFetchCartList(true)
  openShoppingCart.value = true
}

const handleRemindOrder = async (order: any) => {
  const { data } = await useHttpGet({
    url: `/order/remind/${order.id}`
  })
  if (data.value) {
    await showToast('Reminder successful')
  }
}

const handleReceiptOrder = async (order: any) => {
  const { data } = await useHttpGet({
    url: `/order/receipt/${order.id}`
  })
  if (data.value) await router.push('/order')
}

const handleCall = () => {
  showCall.value = true
}

const handleCopy = async () => {
  navigator.clipboard
    .writeText(email.value)
    .then(() => {
      showToast('Copied successfully')
    })
    .catch(() => {
      showToast('Copy failed')
    })
}
</script>

<template>
  <div class="order-page" v-if="order">
    <main-nav-bar :title="`${orderStatusTipsMap[order.status]}`" to="/order">
      <div class="call-btn" @click="handleCall"></div>
    </main-nav-bar>
    <div class="container">
      <div class="card logistics-container" v-if="order['address']">
        <van-steps :active="0" direction="vertical">
          <van-step>
            <template #active-icon>
              <div class="active-icon"></div>
            </template>
            <p class="bold">
              {{ orderStatusTipsMap[order.status] }}
            </p>
            <p class="tips" v-if="order.status === 1">
              Your order is awaiting merchant review, please be patient
            </p>
            <p class="tips" v-if="order.status === 2">
              Your order is being prepared and will be shipped out to you shortly upon completion
            </p>
            <p class="tips" v-if="order.status === 3">
              Your order is being prepared and will be shipped out to you shortly upon completion
            </p>
            <p class="tips" v-if="order.status === 4">
              The item has been delivered. Please collect it promptly. If there are any issues with
              the item, feel free to contact us for assistance
            </p>
            <p class="tips" v-if="[5, -1].includes(order.status)">Welcome to continue shopping</p>
            <p class="tips">{{ order['updateTime'] }}</p>
          </van-step>
          <van-step>
            <template #inactive-icon>
              <div class="address-icon"></div>
            </template>
            <p class="tips">
              {{ order['address']['area'] }} &nbsp;{{ order['address']['postal_code'] }}
            </p>
            <p class="bold">
              {{ order['address']['details'] }}
            </p>
            <p class="tips">{{ order['receiver'] }}&nbsp;&nbsp;{{ order['email'] }}</p>
          </van-step>
        </van-steps>
        <div class="more" v-if="order['statusMap']?.length > 1" @click="openLogs = true">
          <span>More</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="product-list">
        <div class="item" v-for="goods in goodsList" :key="goods.id">
          <div class="item-top">
            <span>{{ goods['productName'] }}</span>
          </div>
          <div class="panel" v-for="item in goods.children" :key="item.id">
            <div class="pic">
              <img :src="item.url" alt="" />
            </div>
            <div class="info-container">
              <div class="info-title">
                <span>{{ item['colorName'] }}</span>
                <span
                  ><span class="unit">$</span> <span class="price">{{ item['price'] }}</span></span
                >
              </div>
              <div class="tips">
                <span>{{ item['tagNameStr'] }}&nbsp;</span>
                <span class="count">x{{ item['quantity'] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card price-info">
        <div class="row">
          <span class="label">Total price</span>
          <span class="value">$ {{ order['totalAmount'] }}</span>
        </div>
        <div class="row">
          <span class="label">Freight</span>
          <span class="value">$ 0.00</span>
        </div>
        <div class="row">
          <span class="label">Money Off</span>
          <span class="value">— $ {{ order['ruleAmount'] || '0.00' }}</span>
        </div>
        <div class="row">
          <span class="label">Promo Code</span>
          <span class="value">— $ {{ order['couponAmount'] || '0.00' }}</span>
        </div>
        <div class="row">
          <span class="label">Price Adjustment</span>
          <span class="value">— $ {{ order['modifyAmount'] || '0.00' }}</span>
        </div>
        <div class="footer-row">
          <span class="left">
            <span>Total discounts: </span>
            <span class="price">$ {{ order['discountAmount'] }}</span>
          </span>
          <span class="right">Actual payment: $ {{ order['payAmount'] }} </span>
        </div>
      </div>

      <div class="card order-info" v-if="order['refundAmount']">
        <div class="row">
          <span class="label">Refund amount</span>
          <span class="value">$ {{ order['refundAmount'] }}</span>
        </div>
        <div class="row">
          <span class="label">Refund time</span>
          <span class="value">{{ order['refundTime'] }}</span>
        </div>
        <div class="row">
          <span class="label">Refund channels</span>
          <span class="value">PayPal</span>
        </div>
        <div class="row">
          <span class="label">Refund remark</span>
          <span class="value">{{ order['refundRemark'] || '-' }}</span>
        </div>
      </div>

      <div class="card order-info">
        <div class="row">
          <span class="label">Order number</span>
          <span class="va lue">{{ order['orderNo'] }}</span>
        </div>
        <div class="row">
          <span class="label">Order time</span>
          <span class="value">{{ order['createTime'] }}</span>
        </div>
        <div class="row" v-if="order['paymentTime']">
          <span class="label">Payment time</span>
          <span class="value">{{ order['paymentTime'] }}</span>
        </div>
        <div class="row" v-if="order['paymentTime']">
          <span class="label">Payment method</span>
          <span class="value">PayPal</span>
        </div>
        <div class="row" v-if="order['fexExNumber']">
          <span class="label">Delivery method</span>
          <span class="value">FedEx</span>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <div class="left" v-if="order.status === 0">
        <span class="tips">Payment countdown:</span>
        <span class="time"><van-count-down :time="order['countdown']" format="HH:mm:ss" /></span>
      </div>
      <div class="left" v-if="[-1, 5].includes(order.status)">
        <span class="delete-btn" @click="handleDeleteOrder(order)">Delete order</span>
      </div>

      <div class="btn-list" v-if="order.status === 0">
        <div class="btn" @click="handleCancelOrder(order)">Cancel order</div>
        <div class="btn" @click="handlePayNow(order)">Pay Now</div>
      </div>
      <div class="btn-list" v-if="order.status === 1">
        <div class="btn cancel" @click="handleOpenRefund()">Request refund</div>
      </div>
      <div class="btn-list" v-if="[2, 3, 4].includes(order.status)">
        <div class="btn" @click="handleOpenRefund()">Request refund</div>
        <div class="btn" v-if="order.status === 2" @click="handleRemindOrder(order)">
          Remind to ship
        </div>
        <div class="btn" v-if="[3, 4].includes(order.status)" @click="handleReceiptOrder(order)">
          Confirm receipt
        </div>
      </div>
      <div class="btn-list" v-if="[-1, 5, 6, 7, 8].includes(order.status)">
        <!--        <div class="btn" v-if="order.status === 5">Go to review</div>-->
        <div class="btn" @click="handleReOrder(order)">ReOrder</div>
      </div>
    </div>

    <van-dialog v-model:show="showCall" title="Contact seller" confirmButtonText="Confirm">
      <div class="dialog-container">
        <span>{{ email }}</span>
        <span class="btn" @click="handleCopy">Copy</span>
      </div>
    </van-dialog>

    <Transition name="fade" :duration="0.5">
      <ShoppingCart v-if="openShoppingCart" @close="openShoppingCart = false" />
    </Transition>

    <van-overlay :show="openLogs" z-index="3" :lock-scroll="false">
      <div class="log-main" @click.self.stop="openLogs = false">
        <div class="card logistics-container" style="padding: 0 !important" v-if="openLogs">
          <van-steps :active="0" direction="vertical">
            <van-step v-for="item in statusMap">
              <template #active-icon>
                <div class="active-icon"></div>
              </template>
              <p class="bold">{{ orderStatusTipsMap[item.status] }}</p>
              <p class="tips" v-if="item.status === 1">
                Your order is awaiting merchant review, please be patient
              </p>
              <p class="tips" v-if="item.status === 2">
                Your order is being prepared and will be shipped out to you shortly upon completion
              </p>
              <p class="tips" v-if="item.status === 3">
                Your order is being prepared and will be shipped out to you shortly upon completion
              </p>
              <p class="tips" v-if="item.status === 4">
                The item has been delivered. Please collect it promptly. If there are any issues
                with the item, feel free to contact us for assistance
              </p>
              <p class="tips" v-if="[5, -1].includes(item.status)">Welcome to continue shopping</p>
              <p class="tips">{{ item['time'] }}</p>
            </van-step>
            <van-step>
              <template #inactive-icon>
                <div class="address-icon"></div>
              </template>
              <p class="tips">
                {{ order['address']['area'] }} &nbsp;{{ order['address']['postal_code'] }}
              </p>
              <p class="bold">
                {{ order['address']['details'] }}
              </p>
              <p class="tips">{{ order['receiver'] }}&nbsp;&nbsp;{{ order['email'] }}</p>
            </van-step>
          </van-steps>
        </div>
      </div>
    </van-overlay>

    <van-overlay :show="openRefund" z-index="3" :lock-scroll="false">
      <div class="refund-main" @click.self.stop="openRefund = false">
        <div class="title">Request Refund</div>
        <div class="tips">
          Are you sure you want to request a refund? If you encounter any problems, please feel free
          to contact us, we will do our best to solve the problem for you!
        </div>
        <div class="remark">
          <van-field
            v-model="refundRemark"
            clearable
            rows="6"
            type="textarea"
            name="refundRemark"
            placeholder="Please tell us why you refunded the money in order to facilitate our efforts to improve"
            :border="false"
          >
          </van-field>
        </div>
        <div class="btn-list">
          <div class="btn" @click="handleActionCancelOrder(order)">Confirm</div>
          <div class="btn" @click="openRefund = false">Cancel</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped lang="scss">
.order-page {
  @apply w-screen
  h-full
  overflow-y-auto
  flex-1;

  background-color: $view-color;

  .call-btn {
    @apply w-0.24rem
    h-0.24rem;

    background-image: url('@/assets/images/call.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .log-main {
    @apply w-full
    h-full
    flex
    justify-center
    items-center
    p-x-0.16rem;
  }

  .logistics-container {
    @apply w-full
    max-h-4.22rem
    rd-0.08rem
    m-b-0.16rem
    min-h-1.06rem
    overflow-hidden;

    overflow-y: auto;

    padding: 0.08rem 0 0 0 !important;

    :deep(.van-step__line) {
      background-color: rgba(198, 156, 109, 0.4) !important;
    }

    p {
      margin-bottom: 0.04rem;
    }

    .tips {
      @include general-font-12;
      color: $text-low-color;
    }

    .bold {
      @include primary-font-16;
      color: $text-high-color;
    }

    .address-icon {
      @apply w-0.18rem
      h-0.18rem;
      background-image: url('@/assets/images/address.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .active-icon {
      @apply w-0.18rem
      h-0.18rem
      rd-50%
      flex
      justify-center
      items-center
      overflow-hidden;

      background-color: rgba(198, 156, 109, 0.2);

      &:before {
        content: '';
        display: block;
        width: 0.08rem;
        height: 0.08rem;
        background-color: rgba(198, 156, 109, 1);
        border-radius: 50%;
      }
    }

    .more {
      @apply w-0.8rem
      h-0.32rem
      rd-0.32rem
      overflow-hidden
      flex
      items-center
      justify-center;

      margin: 0.12rem auto 0.24rem;

      border: 1px solid $border-color;

      @include general-font-14;
      color: $text-high-color;

      .van-icon {
        padding-left: 0.02rem;
        font-weight: bold;
      }
    }
  }

  .container {
    @apply p-0.16rem;

    background-color: $view-color;

    .card {
      @apply rd-0.08rem
      p-0.16rem
      m-b-0.16rem;

      background-color: $white-color;
    }

    .product-list {
      @apply w-full
      rd-0.08rem
      overflow-hidden
      m-b-0.16rem;

      .item {
        @apply w-full
        min-h-1.5rem
        p-x-0.16rem;

        background-color: $white-color;

        .item-top {
          @apply w-full
          h-0.4rem
          flex
          items-center
          justify-start;

          @include general-font-14;

          color: $text-high-color;
        }

        .panel {
          @apply w-full
          h-1.1rem
          p-y-0.15rem
          flex
          justify-between
          items-center;

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
          }

          .info-container {
            @apply flex-1
            h-full
            flex
            flex-col
            justify-start
            overflow-hidden;

            .info-title {
              @apply w-full
              h-0.22rem
              overflow-hidden
              text-ellipsis
              flex
              justify-between
              items-center;

              white-space: nowrap;

              @include title-font-18;
              color: $text-high-color;

              .unit {
                @include general-font-14;
                color: $red-color;

                transform: translateY(0.5px);
              }

              .price {
                @apply flex-1
                p-l-0.02rem;
                color: $red-color;

                @include number-font;
                @include primary-font-16;
              }
            }

            .tips {
              @apply w-auto
              max-w-full
              h-0.2rem
              m-y-0.08rem
              flex
              justify-between
              items-center;

              white-space: nowrap;

              @include general-font-14;

              color: $text-low-color;
            }
          }
        }
      }
    }

    .price-info {
      .row {
        @apply flex
        justify-between
        items-center
        h-0.26rem;

        @include general-font-loose-14;

        .label {
          color: $text-high-color;
        }
        .value {
          color: $red-color;
          @include number-font;
        }

        &:first-child {
          @include primary-font-14;

          .value {
            color: $text-high-color;
            @include number-font;
          }
        }
      }

      .footer-row {
        @apply flex
        justify-between
        items-center
        h-0.26rem
        p-t-0.08rem
        m-t-0.08rem;

        border-top: 1px solid $border-color;

        .left {
          @include general-font-loose-14;
          color: $text-high-color;
          .price {
            color: $red-color;
            @include number-font;
          }
        }
        .right {
          @include primary-font-14;
          color: $text-high-color;
        }
      }
    }

    .order-info {
      .row {
        @apply flex
        justify-between
        items-center
        h-0.26rem;

        @include general-font-loose-14;

        .label {
          color: $text-low-color;
        }

        .value {
          color: $text-high-color;
        }
      }
    }
  }

  .footer-bar {
    @apply w-full
    h-0.8rem
    fixed
    left-0
    bottom-0
    px-0.16rem
    z-2
    flex
    justify-between
    items-center;

    background-color: $white-color;
    border-top: 1px solid $border-color;

    .left {
      @apply flex
      flex-col
      justify-between
      items-start;

      .tips {
        @include general-font-12;
        color: $text-high-color;
      }

      .time {
        @include number-font;
        @include primary-font-16;
        color: $text-high-color;
      }

      .delete-btn {
        @include general-font-14;
        color: $red-color;
      }
    }

    .btn-list {
      @apply flex-1
      flex
      justify-end
      items-center;

      .btn {
        @apply min-w-0.8rem
        h-0.32rem
        rd-0.32rem
        text-center
        m-l-0.08rem
        p-x-0.08rem;

        @include primary-font-14;
        border: 1px solid $primary-color;

        line-height: 0.3rem;

        &:first-child {
          background-color: $white-color;
          border-color: $border-color;
          color: $text-mid-color;
        }

        &:last-child {
          background-color: $primary-color;
          color: $white-color;
        }

        &.cancel {
          background-color: $white-color;
          border-color: $border-color;
          color: $text-mid-color;
        }
      }
    }
  }

  .dialog-container {
    @apply flex
    justify-center
    items-center
    py-0.24rem;

    .btn {
      @apply m-l-0.08rem;
      color: #1989fa;
    }
  }

  .refund-main {
    @apply w-3.42rem
    h-3.92rem
    fixed
    left-50%
    top-50%
    p-0.24rem
    rd-0.08rem;

    background-color: $white-color;
    transform: translate(-50%, -50%);

    .title {
      @include title-font-22;
      color: $text-high-color;

      text-align: center;
    }

    .tips {
      @apply pt-0.08rem
      pb-0.28rem;

      @include general-font-loose-14;
      color: #9e9e9e;
    }

    .remark {
      @apply m-b-0.24rem
      h-1.2rem
      rd-0.06rem
      p-0.16rem
      overflow-hidden;

      background-color: #efefef;

      :deep(.van-field) {
        background-color: transparent;
        padding: 0;
        height: 100% !important;
      }

      :deep(.van-field__control) {
        height: 100% !important;
        @include general-font-loose-14;
        color: $text-high-color;

        &::placeholder {
          color: #9e9e9e;
        }
      }
    }

    .btn-list {
      @apply flex
      w-full
      justify-between
      items-center;

      .btn {
        @apply w-1.38rem
        h-0.4rem
        rd-0.4rem
        flex
        justify-center
        items-center;

        border: 1px solid transparent;

        &:first-child {
          border-color: $border-color;
          @include title-font-14;
          color: $text-high-color;
          background-color: $white-color;
        }

        &:last-child {
          border-color: $primary-color;
          @include title-font-14;
          color: $white-color;
          background-color: $primary-color;
        }
      }
    }
  }
}
</style>
