<script setup lang="ts">
import orderStatusTipsMap from '~/utils/orderStatusMap'
import handlePayNow from '~/utils/payNow'

const router = useRouter()

const props = defineProps({
  orderList: {
    type: Array,
    required: true
  },
  bg: {
    type: String,
    default: '#fff'
  },
  toPath: {
    type: String
  }
})

const handleJump = (order: any) => {
  router.push(`order/${order.id}`)
}
</script>

<template>
  <div
    class="order-container"
    :style="{ backgroundColor: bg }"
    v-if="orderList.length"
    v-for="order in orderList"
    :key="order.id"
    @click="handleJump(order)"
  >
    <div class="row">
      <div class="left">ID:{{ order['orderNo'] }}</div>
      <div
        class="right"
        :class="{
          'is-pay': order.status === 0,
          'is-end': [-1, 5].includes(order.status)
        }"
      >
        {{ orderStatusTipsMap[order.status] }}
      </div>
    </div>
    <div class="panel">
      <template v-if="order.productList.length === 1">
        <div class="pic">
          <img :src="order.productList[0].url" alt="" />
        </div>
        <div class="goods-info">
          <span class="name">{{ order['productList'][0]['colorName'] }}</span>
          <span class="tips">{{ order['productList'][0]['tagNameStr'] }}</span>
        </div>
      </template>
      <template v-else>
        <div class="pic-list">
          <div class="pic" v-for="item in order.productList" :key="item.id">
            <img :src="item.url" alt="" />
          </div>
          <div v-if="order.productList.length > 3">
            <van-icon name="weapp-nav" />
          </div>
        </div>
      </template>

      <div class="count">
        <div class="price">
          <span class="unit">$</span>
          <span class="value">{{ order['payAmount'] }}</span>
        </div>
        <div class="tips">Total 1 goods</div>
      </div>
    </div>

    <div class="footer" v-if="[0, 3, 4].includes(order.status)">
      <div class="left" v-if="order.status === 0">
        <span class="tips">Payment countdown:</span>
        <span class="time"><van-count-down :time="order['countdown']" format="HH:mm:ss" /></span>
      </div>
      <div class="btn-list" v-if="order.status === 0 && order['countdown']">
        <div class="btn" @click.stop.self="handlePayNow(order)">Pay Now</div>
      </div>
      <div class="btn-list" v-if="order.status === 3">
        <div class="btn">Confirm receipt</div>
        <div class="btn">Logistics status</div>
      </div>
      <div class="btn-list" v-if="order.status === 4">
        <div class="btn">Logistics status</div>
        <div class="btn">Confirm receipt</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-container {
  @apply min-h-1.34rem
  max-h-1.87rem
  w-full
  rd-0.08rem
  p-x-0.16rem
  p-y-0.12rem
  m-b-0.16rem;

  &:last-child {
    margin-bottom: 0;
  }

  .row {
    @apply w-full
    h-0.18rem
    flex
    items-center
    justify-between;

    .left {
      @apply max-w-1.5rem
      overflow-hidden;

      @include general-font-14;
      color: $text-low-color;
    }

    .right {
      @include primary-font-14;
      color: $text-high-color;

      &.is-end {
        color: $text-low-color;
      }

      &.is-pay {
        color: $yellow-color;
      }
    }
  }

  .panel {
    @apply flex
    items-center
    justify-between
    w-full
    h-0.8rem
    m-t-0.12rem;

    .pic-list {
      @apply flex
      items-center;

      .pic {
        @apply m-r-0.08rem;
      }
    }

    .pic {
      @apply w-0.6rem
      h-0.8rem;

      img {
        @apply block
        w-full
        h-full;
      }
    }

    .goods-info {
      @apply ml-0.08rem
      w-1.47rem
      h-full
      max-w-1.47rem
      flex
      flex-col
      justify-start;

      .name {
        @include title-font-18;
        color: $text-high-color;
      }

      .tips {
        padding-top: 0.02rem;
        @include general-font-12;
        color: $text-low-color;
      }
    }

    .count {
      @apply flex-1
      flex
      flex-col
      justify-center
      items-end;

      .price {
        @apply flex
        items-center
        justify-start;

        color: $red-color;

        .unit {
          @include general-font-12;
          transform: translateY(0.5px);
        }

        .value {
          @apply p-l-0.02rem;

          @include number-font;
          @include primary-font-16;
        }
      }

      .tips {
        @include general-font-12;
        color: $text-low-color;
      }
    }
  }

  .footer {
    @apply w-full
    h-0.40rem
    flex
    justify-between
    items-center
    p-t-0.08rem
    m-t-0.12rem;

    border-top: 1px solid $border-color;

    .left {
      @apply flex
      justify-between
      items-center;

      .tips {
        @include general-font-14;
        color: $text-high-color;
      }

      .time {
        @include number-font;
        @include primary-font-16;
        color: $text-high-color;
        padding-left: 0.08rem;
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
          color: $primary-color;
        }

        &:last-child {
          background-color: $primary-color;
          color: $white-color;
        }
      }
    }
  }
}
</style>
