<script setup lang="ts">
import Rules from '~/components/Rules.vue'
import { useCartStore, useRuleStore } from '~/stores'
import { Decimal } from 'decimal.js'

const route = useRoute()
const router = useRouter()
const skuIds = route.query?.skuIds as string[]

if (!skuIds || !skuIds.length) {
  router.back()
}

const useCart = useCartStore()
const useRule = useRuleStore()

const goodsList = await useCart.getPaymentGoodsList(skuIds)

const cartTotalPrice = computed(() => useCart.totalPrice)

const ruleList = useRule.ruleList
const matchedRule = ref<any>({})

const orderAmount = ref('0.0')
const rawAmount = ref('0.0')

watchEffect(() => {
  const totalPrice = cartTotalPrice.value
  orderAmount.value = totalPrice
  rawAmount.value = totalPrice

  if (cartTotalPrice.value) {
    const rule = useRule.getMatched(cartTotalPrice.value)
    if (!rule) {
      matchedRule.value = {}
      return
    }
    matchedRule.value = rule
    const amount = new Decimal(cartTotalPrice.value).minus(rule['faceValue']).valueOf()
    orderAmount.value = amount
    rawAmount.value = amount
  }
})

const showRulesDialog = ref(false)
const showCodeDialog = ref(false)
const promoCode = ref('')
const promoInfo = ref<any>({})

const promoCodeList = ref<any[]>([])

const handleCodeClose = () => {
  showCodeDialog.value = false
}
const handleCodeOpen = () => {
  if (promoInfo.value.code) return
  promoCodeList.value = JSON.parse(localStorage.getItem('promoCodeList') || '[]')
  showCodeDialog.value = true
}
const handleClearPromo = () => {
  orderAmount.value = rawAmount.value
  promoInfo.value = {}
}

const handlePayment = async () => {
  const { data } = await useHttpPost({
    url: `/order/create`,
    body: {
      goodsIds: goodsList.reduce((pre, cur: any) => {
        const ids = cur.children.map((d: any) => d.id)
        pre.push(...ids)
        return pre
      }, []),
      couponId: promoInfo.value?.id || undefined
    },
    isLoading: true
  })
  if (!data.value) return
  console.log('订单创建成功')
  await router.push('/')
}

const handleActivePromoCode = async () => {
  if (!promoCode.value) return

  const { data: promoRes } = await useHttpPost({
    url: `/coupon/check/${promoCode.value}`,
    body: {
      amount: new Decimal(rawAmount.value).toNumber()
    },
    isLoading: true
  })
  if (!promoRes.value.id) return

  promoInfo.value = promoRes.value
  orderAmount.value = new Decimal(rawAmount.value).minus(promoRes.value['faceValue']).valueOf()

  showCodeDialog.value = false

  const historyList = promoCodeList.value.filter((d) => d.code !== promoCode.value)
  historyList.unshift({
    code: promoInfo.value.code,
    faceValue: promoInfo.value.faceValue,
    thresholdValue: promoInfo.value.thresholdValue
  })
  const saveList = historyList.slice(0, 3)
  promoCode.value = ''
  promoCodeList.value = saveList
  localStorage.setItem('promoCodeList', JSON.stringify(saveList))
}
</script>

<template>
  <div class="payment-page">
    <main-nav-bar title="Goods Settlement" />
    <div class="container">
      <div class="product-list">
        <div class="item" v-for="goods in goodsList" :key="goods.id">
          <div class="item-top">
            <span>{{ goods['productName'] }}</span>
          </div>
          <div class="panel" v-for="item in goods.children" :key="item.id">
            <div class="panel-right">
              <div class="pic">
                <img :src="item.url" alt="" />
              </div>
              <div class="info-container">
                <div class="info-title">{{ item['color_name'] }}</div>
                <div class="tips">
                  <span>{{ item['tagNameStr'] }}&nbsp;</span>
                </div>
                <div class="row">
                  <span class="unit">$</span>
                  <span class="price">{{ item['online_price'] }}</span>
                  <span class="stepper">
                    <span class="count">x{{ item['quantity'] }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-row">
        <div class="row">
          <div class="label">Amount</div>
          <span class="price">$ {{ cartTotalPrice }}</span>
        </div>
        <div class="row">
          <div class="label">Freight</div>
          <span class="tag">Free</span>
        </div>
      </div>

      <div class="card-row" v-if="ruleList.length">
        <div class="row">
          <div class="label">Money off</div>
          <div class="promo-code" @click="showRulesDialog = true">
            <span class="row-active" v-if="matchedRule.id">
              <span class="price">Reduced ${{ matchedRule['faceValue'] }}</span>
              <span class="tag"
                >${{ matchedRule['faceValue'] }} off ${{ matchedRule['thresholdValue'] }}</span
              >
            </span>
            <span class="row-text" v-else>Condition not met</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="card-row">
        <div class="row">
          <div class="label">Promo Code</div>
          <div class="promo-code" @click="handleCodeOpen">
            <span class="row-active" v-if="promoInfo.code">
              <span class="price">{{ promoInfo.code }}</span>
              <span class="tag"
                >${{ promoInfo['faceValue'] }} off ${{ promoInfo['thresholdValue'] }}</span
              >
            </span>
            <span class="row-text" v-else>Please enter</span>
            <van-icon name="cross" v-if="promoInfo.code" @click="handleClearPromo" />
            <van-icon name="arrow" v-else />
          </div>
        </div>
      </div>
      <div class="card-row">
        <div class="row">
          <div class="label">Payment method</div>
          <div class="method">
            <img class="logo" src="../../assets/images/paypal.png" alt="" />
            <span class="label">PayPal</span>
            <van-icon name="checked" />
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="info">
        <span class="row">
          <span class="label">Total Price:</span>
          <span class="unit">$</span>
          <span class="price">{{ orderAmount }}</span>
        </span>
      </div>
      <div class="btn" @click="handlePayment">Payment</div>
    </div>

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

    <van-overlay
      :show="showCodeDialog"
      :lock-scroll="false"
      @click.self.stop="showCodeDialog = false"
    >
      <div class="code-dialog">
        <div class="dialog-top">
          <span class="label">Promo Code</span>
          <van-icon name="cross" @click="handleCodeClose" />
        </div>
        <div class="dialog-main">
          <div class="input">
            <van-field v-model="promoCode" center clearable placeholder="Please enter">
              <template #button>
                <van-button
                  size="small"
                  type="success"
                  :disabled="!promoCode || promoCode.length < 4"
                  @click="handleActivePromoCode"
                  >Confirm</van-button
                >
              </template>
            </van-field>
          </div>
          <div class="title" v-if="promoCodeList.length">History:</div>
          <div class="row" v-for="item in promoCodeList" :key="item" @click="promoCode = item.code">
            <div class="code">{{ item.code }}</div>
            <span class="tag"> ${{ item['faceValue'] }} off ${{ item['thresholdValue'] }} </span>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped lang="scss">
.payment-page {
  @apply w-screen
  h-full
  overflow-y-auto;

  .container {
    @apply p-x-0.16rem
    p-y-0.12rem;

    background-color: $view-color;

    .product-list {
      @apply w-full;

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
        }

        .panel {
          @apply w-full
          h-1.1rem
          flex
          justify-between
          items-center;

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

    .card-row {
      @apply w-full
      min-h-0.5rem
      rd-0.08rem
      p-x-0.15rem
      m-t-0.12rem;

      background-color: $white-color;

      .row {
        @apply w-full
        min-h-0.5rem
        flex
        items-center
        justify-between;

        border-top: 1px solid $border-color;

        &:first-child {
          border-top: none;
        }

        .van-icon-arrow {
          @apply m-l-0.08rem;
        }

        .row-active {
          @apply flex-col
          flex
          items-end
          justify-center
          h-0.77rem;

          .tag {
            @apply m-t-0.04rem;
          }
        }
        .row-text {
          color: $text-low-color;
          @include general-font-14;
        }

        .label {
          @include general-font-14;
          color: $text-high-color;
        }

        .tag {
          @apply h-0.20rem
          p-x-0.08rem
          rd-0.04rem;

          @include primary-font-12;
          color: $red-color;
          border: 1px solid $red-color;
          line-height: 0.17rem;
        }

        .price {
          @include primary-font-14;
          color: $text-high-color;
        }

        .money-off {
          @apply flex
          items-center
          justify-center;

          transform: translateX(0.04rem);
        }

        .promo-code {
          @apply flex
          items-center
          justify-center;

          transform: translateX(0.04rem);

          .van-field {
            @apply w-1.2rem;
          }

          .van-icon-cross {
            @apply m-l-0.08rem;
          }
        }

        .method {
          @apply flex
          items-center
          justify-center;

          color: $primary-color;
          font-size: 20px;

          .logo {
            @apply w-0.42rem
            h-0.22rem;
          }

          .label {
            @include primary-font-14;
            color: $text-high-color;
            margin: 0 16px 0 -4px;
          }
        }
      }
    }
  }

  .footer {
    @apply fixed
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
        }

        .price {
          @apply p-l-0.02rem;

          @include number-font;
          @include title-font-18;
        }
      }
    }
  }

  .code-dialog {
    @apply absolute
    left-0
    bottom-0
    w-full
    h-3.4rem
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

    .dialog-main {
      @apply w-full
      flex-1
      overflow-hidden;

      .van-cell {
        @apply rd-0.04rem;
        border: 1px solid $border-color;
      }

      .title {
        @apply m-t-0.24rem;
        @include primary-font-14;
        color: $text-mid-color;
      }

      .row {
        @apply w-full
        h-0.4rem
        flex
        m-t-0.16rem
        flex
        justify-between
        items-center
        rd-0.04rem
        p-x-0.12rem;

        background-color: $placeholder-color;

        .code {
          @include title-font-14;
          color: $text-high-color;
        }

        .tag {
          @apply h-0.21rem
          flex
          items-center
          justify-between
          rd-0.04rem
          p-x-0.08rem;

          @include primary-font-12;

          line-height: 0.17rem;
          color: $red-color;
          border: 1px solid $red-color;
        }

        .tips {
          @include general-font-14;
          color: $text-high-color;
        }
      }
    }
  }
}
</style>
