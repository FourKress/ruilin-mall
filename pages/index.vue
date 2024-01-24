<script setup lang="ts">
import { ref } from 'vue'

const images = ref<any[]>([
  {
    imgUrl:
      'https://images.unsplash.com/photo-1682685796014-2f342188a635?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: ''
  },
  {
    imgUrl:
      'https://plus.unsplash.com/premium_photo-1702834008804-578cea8e1155?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: ''
  },
  {
    imgUrl:
      'https://images.unsplash.com/photo-1682687221213-56e250b36fdd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: ''
  }
])
</script>

<template>
  <div class="home">
    <div class="swipe-container">
      <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="item in images" :key="item.imgUrl">
          <img :src="item.imgUrl" alt="" />
        </van-swipe-item>

        <template #indicator="{ active, total }">
          <div class="indicator-container">
            <div
              class="indicator"
              v-for="(item, index) in images"
              :key="item.imgUrl"
              :class="active === index ? 'active' : ''"
            ></div>
          </div>
        </template>
      </van-swipe>
    </div>

    <div class="product-container">
      <div class="title"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  @apply w-screen;

  .swipe-container {
    @apply w-full
    h-5.2rem
    relative;

    .van-swipe {
      @apply h-full;

      img {
        @apply block
        w-full
        h-full;
      }

      .indicator-container {
        @apply absolute
        left-50%
        bottom-0.2rem
        flex
        items-center
        justify-content;

        transform: translateX(-50%);

        .indicator {
          @apply w-0.2rem
          h-0.04rem
          m-r-0.04rem;

          &:last-child {
            @apply m-r-0;
          }

          background-color: transparent;
          border: 1px solid $white-color;

          &.active {
            background-color: $white-color;
          }
        }
      }
    }
  }
}
</style>
