<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'

const router = useRouter()

const userCookie = useCookie<Record<string, any>>('user')
if (!userCookie.value) {
  router.push('/login?redirect=/')
}
const userInfo = ref<any>(userCookie.value || {})
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Information" />

    <div class="row-container">
      <nuxt-link class="row" to="/center/info/name">
        <span class="label">Name</span>
        <span class="value">{{ userInfo['nickname'] }}</span>
        <van-icon name="arrow" />
      </nuxt-link>

      <nuxt-link class="row" to="/center/info/address" style="margin-bottom: 0.16rem">
        <span class="label">Contact address</span>
        <span class="value empty">Revise</span>
        <van-icon name="arrow" />
      </nuxt-link>

      <nuxt-link class="row" to="/center/info/password">
        <span class="label">Password</span>
        <span class="value empty">Revise</span>
        <van-icon name="arrow" />
      </nuxt-link>
    </div>

    <div class="empty"></div>

    <copy-right />
  </div>
</template>

<style scoped lang="scss">
.modify-page {
  @apply w-full
  flex-1
  flex
  flex-col
  justify-between;

  background-color: $view-color;

  .row-container {
    @apply w-full
    m-t-0.16rem;

    .row {
      @apply w-full
      h-0.6rem
      flex
      justify-between
      items-center
      px-0.16rem;

      background-color: $white-color;

      border-bottom: 1px solid $view-color;

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

      .van-icon {
        color: $text-high-color;
      }
    }
  }

  .empty {
    @apply flex-1;
  }
}
</style>
