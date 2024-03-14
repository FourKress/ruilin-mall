<script setup lang="ts">
import { useRuleStore } from '~/stores'
import Order from '~/components/order.vue'

const tokenCookie = useCookie('token')
const userCookie = useCookie<Record<string, any>>('user')
const userInfo = ref<any>(userCookie.value || {})

const useRule = useRuleStore()

const router = useRouter()
const isLoading = ref(false)

const minRule = useRule.getMinRule()
const orderList = ref<any>([])

const { data } = await useHttpPost({
  url: `/order/list/`,
  body: { size: 1, current: 1 },
  transform: (res) => {
    return res.data.records
  }
})
if (data.value && data.value.length) {
  orderList.value = [data.value[0]]
}

const handleLogOut = async () => {
  if (!userCookie.value) return
  isLoading.value = true
  await useHttpGet({ url: `/auth/customer/logout/${userInfo.value.userId}` })
  tokenCookie.value = undefined
  userCookie.value = {}
  isLoading.value = false
  router.push('/login')
}
</script>

<template>
  <div class="user-center">
    <div class="info">
      <div class="left">
        <span class="name">Hi,{{ userInfo['nickname'] }}</span>
        <span class="email">{{ userInfo['email'] }}</span>
      </div>
      <div class="right">
        <van-icon name="contact" />
      </div>
    </div>

    <div class="rebate" v-if="minRule">
      <div class="left">
        <span class="name">Rebate</span>
        <span class="tips"
          >Spend ${{ minRule['thresholdValue'] }}, get ${{ minRule['faceValue'] }} off</span
        >
      </div>
      <nuxt-link class="btn" to="/product/0">Get</nuxt-link>
    </div>

    <div class="order">
      <div class="top">
        <span class="name">My Orders</span>
        <nuxt-link class="btn" to="/order">All Orders</nuxt-link>
      </div>
      <order :orderList="orderList" bg="#f5f5f5" />
    </div>

    <div class="form">
      <nuxt-link class="row" to="/center/email">
        <span class="icon" />
        <span class="label">Email</span>
        <span class="value">{{ userInfo['email'] }}</span>
        <van-icon name="arrow" />
      </nuxt-link>
      <nuxt-link class="row" to="/center/phone">
        <span class="icon" />
        <span class="label">Phone</span>
        <span class="value" :class="!userInfo['phone'] && 'empty'">{{
          userInfo['phone'] || 'No Phone'
        }}</span>
        <van-icon name="arrow" />
      </nuxt-link>
    </div>

    <van-button
      :loading="isLoading"
      loading-text="Log out..."
      type="primary"
      class="log-out"
      @click="handleLogOut"
      >Log out</van-button
    >
  </div>
</template>

<style scoped lang="scss">
.user-center {
  @apply h-full
  flex-1
  px-0.16rem
  p-t-0.24rem;

  .info {
    @apply w-full
    h-0.72rem
    p-x-0.085rem
    flex
    items-center
    justify-between;

    .right {
      @apply w-0.72rem
      h-0.72rem
      flex
      items-center
      justify-center
      rd-50%
      overflow-hidden;

      background: $primary-color;

      .van-icon {
        font-size: 0.48rem;
        color: $white-color;
      }
    }

    .left {
      @apply flex
      h-full
      flex-col
      items-start
      justify-center;

      .name {
        @apply p-b-0.08rem;
        @include title-font-26;
        color: $text-high-color;
      }

      .email {
        @include general-font-14;
        color: $text-low-color;
      }
    }
  }

  .rebate {
    @apply w-full
    h-0.8rem
    p-0.22rem
    flex
    justify-between
    items-center
    m-t-0.24rem
    rd-0.08rem
    relative
    overflow-hidden;

    box-shadow: 0 6px 12px 0 rgba(32, 36, 47, 0.2);
    background-image: url('@/assets/images/bg-2.png');
    background-size: 140px 80px;
    background-repeat: no-repeat;

    &:before {
      @apply w-full
      h-full
      z--1
      absolute
      left-0
      top-0;

      content: '';
      background: linear-gradient(103deg, #3b4257 0%, #252935 100%);
      backdrop-filter: opacity(20%);
    }

    .btn {
      @apply w-0.64rem
      h-0.36rem
      rd-0.36rem
      flex
      justify-center
      items-center;

      background-color: $primary-color;
      color: $white-color;

      @include title-font-18;
    }

    .left {
      @apply flex
      h-full
      flex-col
      items-start
      justify-center;

      .name {
        @apply p-b-0.08rem;
        @include title-font-18;
        color: #ffead8;
      }

      .tips {
        @include general-font-14;
        color: #ffead8;
      }
    }
  }

  .order {
    @apply w-full;

    .top {
      @apply w-full
      h-0.36rem
      flex
      justify-between
      items-center
      m-t-0.24rem
      m-b-0.08rem;

      .name {
        @include title-font-18;
        color: $text-high-color;
      }

      .btn {
        @apply w-1rem
        h-full
        rd-0.36rem
        text-center;

        @include general-font-14;
        color: $text-high-color;

        line-height: 0.32rem;

        border: 2px solid $border-color;
      }
    }
  }

  .form {
    @apply w-full
    m-y-0.24rem;

    .row {
      @apply w-full
      h-0.6rem
      flex
      justify-between
      items-center;

      border-bottom: 1px solid $view-color;

      .icon {
        @apply w-0.2rem
        h-0.2rem;

        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      &:first-child {
        .icon {
          background-image: url('@/assets/images/email.png');
        }
      }

      &:last-child {
        .icon {
          background-image: url('@/assets/images/phone.png');
        }
      }

      .label {
        @apply p-x-0.08rem;
        @include primary-font-16;
        color: $text-high-color;
      }

      .value {
        flex: 1;
        text-align: right;
        padding-right: 0.08rem;
        @include general-font-14;
        color: $text-high-color;

        &.empty {
          color: $text-low-color;
        }
      }

      .vant-icon {
        color: $text-high-color;
      }
    }
  }

  .log-out {
    @apply w-full
    h-0.6rem
    rd-0.04rem
    text-center
    m-b-0.24rem;

    @include primary-font-16;
    color: $red-color;

    line-height: 0.6rem;

    background: $view-color;
  }
}
</style>
