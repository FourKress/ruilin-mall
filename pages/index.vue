<script setup lang="ts">
import { useHttpGet, useHttpPost } from '~/utils/useHttp'

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const router = useRouter()

const skuList = ref<any[]>([])

const actions = [
  { name: 'New', value: 1 },
  { name: 'Hot', value: 2 }
]

const showPicker = ref(false)
const currentAction = ref<any>(actions[0])

const { data: swipeData } = await useHttpGet({
  url: '/banner/list'
})

watchEffect(async () => {
  const { data: resData } = await useHttpPost({
    url: '/product-sku/online-page',
    body: {
      size: 10,
      current: 1,
      isHot: currentAction.value.value === 2
    },
    transform: (res: any) => {
      return res.data.records
    }
  })
  if (resData.value) {
    skuList.value = resData.value
  }
})

const onSelect = (item: any) => {
  currentAction.value = item
}

const handleJump = (url: string) => {
  if (!url) return
  window.open(url, '_blank')
}

const jumpSku = (sku: any) => {
  router.push(`/details/${sku.productId}/${sku['colorId']}/${sku.id}`)
}
</script>

<template>
  <div class="home">
    <div class="swipe-container">
      <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="item in swipeData" :key="item.id">
          <img :src="item.url" :alt="item['objectKey']" @click="handleJump(item.url)" />
        </van-swipe-item>

        <template #indicator="{ active, total }">
          <div class="indicator-container">
            <div
              class="indicator"
              v-for="(item, index) in swipeData"
              :key="item.id"
              :class="active === index ? 'active' : ''"
            ></div>
          </div>
        </template>
      </van-swipe>
    </div>

    <div class="product-container">
      <div class="top">
        <div class="label">Products</div>
        <div class="picker" @click="showPicker = true">
          <span class="label">{{ currentAction.name }}</span>
          <van-icon name="arrow-down" />
        </div>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in skuList" :key="index" @click="jumpSku(item)">
          <div class="image">
            <img :src="item['url']" :alt="item['online_objectKey']" />
          </div>
          <div class="info">
            <div class="title">{{ item['color_name'] }}</div>
            <div class="row">
              <span class="unit">$</span>
              <span class="price">{{ item['online_price'] }}</span>
            </div>
          </div>
        </div>
      </div>

      <nuxt-link class="jump-btn" to="/product/0">
        <span>View more products</span>
        <van-icon name="arrow" />
      </nuxt-link>
    </div>

    <div class="blog-container">
      <div class="top">
        <div class="label">Blog</div>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in 10" :key="index">
          <div class="image">
            <img src="" alt="" />
          </div>
          <div class="info">
            <div class="title">Customers like us</div>
            <div class="details">
              Malibu Dream (Hair Weft)Malibu Dream (Hair Weft)Malibu Dream (Hair Weft)Malibu Dream
              (Hair Weft)Malibu Dream (Hair Weft)Malibu Dream (Hair Weft)Malibu Dream (Hair
              Weft)Malibu Dream (Hair Weft)Malibu Dream (Hair Weft)Malibu Dream (Hair Weft)
            </div>
          </div>
        </div>
      </div>

      <div class="jump-btn">
        <span>View more blogs</span>
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="about-container">
      <FollowUs />
    </div>

    <van-action-sheet
      v-model:show="showPicker"
      :actions="actions"
      cancel-text="Cancel"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>

<style scoped lang="scss">
.home {
  @apply w-screen;

  background-color: $view-color;

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

  .jump-btn {
    @apply w-2.2rem
    h-0.4rem
    rd-0.2rem
    text-center
    flex
    items-center
    justify-center
    m-t-0.24rem
    m-x-auto;

    @include english-font;
    @include primary-font-16;

    color: $text-high-color;
    border: 1px solid $text-mid-color;

    .van-icon {
      @apply m-l-0.02rem;
      font-size: 16px;
    }
  }

  .product-container {
    @apply w-full
    p-x-0.16rem
    p-t-0.14rem
    m-t-0.16rem;

    background-color: $view-color;

    .top {
      @apply w-full
      flex
      items-center
      justify-between;

      .label {
        @include english-font;
        @include title-font-22;
        color: $text-high-color;
      }

      .picker {
        @apply h-0.3rem
        min-w-0.66rem
        rd-0.2rem
        flex
        items-center
        justify-between
        cursor-pointer
        px-0.09rem;

        color: $text-mid-color;
        border: 1px solid $text-mid-color;

        .label {
          @include english-font;
          @include general-font-14;
        }
      }
    }

    .list {
      @apply w-full
      flex
      flex-wrap
      justify-between
      items-start;

      .item {
        @apply w-1.71rem
        h-2.53rem
        m-t-0.16rem
        rd-0.06rem
        overflow-hidden;

        .image {
          @apply w-full
          h-1.71rem;

          img {
            @apply block
            w-full
            h-full;
          }
        }

        .info {
          @apply w-full
          h-0.82rem
          p-x-0.12rem
          p-y-0.08rem;

          background-color: $white-color;

          .title {
            @apply w-full
            h-0.36rem
            overflow-hidden
            text-ellipsis
            m-b-0.08rem;

            display: -webkit-box;
            -webkit-line-clamp: 2;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;

            @include english-font;
            @include primary-font-14;

            color: $text-high-color;
          }

          .row {
            @apply flex
            items-center
            justify-start;

            color: $red-color;

            .unit {
              @include general-font-14;

              transform: translateY(0.5px);
            }

            .price {
              @apply p-l-0.02rem
              p-r-0.08rem;

              @include number-font;
              @include primary-font-16;
            }
          }
        }
      }
    }
  }

  .blog-container {
    @apply w-full
    p-t-0.14rem
    m-t-0.16rem;

    .top {
      @apply w-full
      p-x-0.16rem
      flex
      items-center
      justify-between;

      .label {
        @include english-font;
        @include title-font-22;
        color: $text-high-color;
      }
    }

    .list {
      @apply w-full
      p-x-0.16rem
      flex
      justify-start
      items-start
      m-t-0.16rem
      overflow-x-auto
      overflow-y-hidden;

      .item {
        @apply w-3.2rem
        min-w-3.2rem
        h-3.2rem
        m-r-0.16rem;

        &:last-child {
          @apply m-r-0;
        }

        background-color: black;

        .image {
          @apply w-full
          h-1.8rem;

          img {
            @apply block
            w-full
            h-full;
          }
        }

        .info {
          @apply w-full
          h-1.42rem
          p-x-0.16rem;

          background-color: $white-color;

          .title {
            @apply w-full
            h-0.38rem
            overflow-hidden
            text-ellipsis
            p-y-0.08rem;

            white-space: nowrap;

            @include title-font-18;

            color: $text-high-color;
          }

          .details {
            @apply w-full
            overflow-hidden
            text-ellipsis;

            display: -webkit-box;
            -webkit-line-clamp: 4;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;

            color: $text-high-color;

            @include general-font-loose-14;

            transform: scaleY(0.9);
            transform-origin: top;
          }
        }
      }
    }
  }

  .about-container {
    @apply w-full
    p-t-0.14rem
    p-x-0.16rem
    m-t-0.16rem;
  }
}
</style>
