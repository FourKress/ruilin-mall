<script setup lang="ts">
import { useInfoStore } from '~/stores'

const mallInfo = computed(() => useInfoStore().details)
</script>

<template>
  <div class="enter">
    <div class="container">
      <div class="title">{{ mallInfo.name }}</div>
      <div class="info">
        {{ mallInfo['introduce'] }}
      </div>
      <div class="btn-container">
        <nuxt-link class="create btn" to="/sign-up">Sign up</nuxt-link>
        <nuxt-link class="login btn" to="/login?redirect=/">Log in</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.enter {
  @apply min-h-4.92rem
  flex-1
  flex
  flex-col;

  background-repeat: no-repeat;
  background-size: 100% 4.92rem;
  background-image: url('@/assets/images/bg.png');

  background-color: #e6eaeb;

  .container {
    @apply w-full
    h-full
    p-x-0.16rem
    flex-1;

    background-color: rgba(16, 16, 16, 0.8);

    .title {
      @apply p-t-0.32rem
      p-b-0.16rem;

      @include title-font-26;
      color: $white-color;
      font-family: 'Sinerva', Arial, sans-serif;
      transform: translateY(0.05rem);
    }

    .info {
      @include general-font-loose-14;
      color: $white-color;
    }

    .btn-container {
      .btn {
        @apply h-0.48rem
        w-full
        flex
        justify-center
        items-center
        rd-0.48rem
        m-t-0.32rem;

        @include title-font-18;
        border: 2px solid $primary-color;
      }

      .login {
        color: $primary-color;
        background-color: transparent;
      }

      .create {
        background-color: $primary-color;
        color: $white-color;
      }
    }
  }
}
</style>
