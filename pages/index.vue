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
const swipeData = ref([])

useHttpGet({
  url: '/banner/list'
}).then(({ data }) => {
  if (data.value) {
    swipeData.value = data.value
      .filter((d: any) => d['objectKeyMobile'])
      .map((d: any) => {
        return {
          ...d,
          name: d?.name ? d?.name.replace(/\n/g, '<br/>') : '',
          subtitle: d?.subtitle ? d?.subtitle.replace(/\n/g, '<br/>') : ''
        }
      })
  }
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

const blogData = ref([])
useHttpPost({
  url: '/blog/list',
  body: { size: 10, current: 1 },
  transform: (res) => {
    return res.data.records
  }
}).then(({ data }) => {
  if (data.value) {
    blogData.value = data.value
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

const jumpBlogDetails = (index: string | number) => {
  router.push(`/blog/${Number(index) + 1}`)
}
</script>

<template>
  <div class="home">
    <div class="swipe-container">
      <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="item in swipeData" :key="item.id">
          <div class="warp">
            <div class="mask">
              <div class="name" v-html="item['name']"></div>
              <div class="subtitle" v-html="item['subtitle']"></div>
              <div class="btn-list" v-if="item['btnList']">
                <template v-for="btn in item['btnList']">
                  <span class="btn" @click="handleJump(btn.link)" v-if="btn.name">{{
                    btn.name
                  }}</span>
                </template>
              </div>
            </div>

            <van-image class="img" lazy-load :src="item['mobile_url']" :alt="item['objectKey']">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
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
            <van-image class="img" lazy-load :src="item['url']" :alt="item['online_objectKey']">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
          <div class="info">
            <div class="title">{{ item['product_name'] }}（{{ item['color_name'] }}）</div>
            <div class="row">
              <span class="unit">$</span>
              <span class="price">{{ item['online_price'] }}</span>
            </div>
          </div>

          <div class="tag grey" v-if="item['online_stock'] <= 0">Out of Stock</div>
          <div class="tag yellow" v-else-if="item['online_stock'] <= 20">Low Stock</div>
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
        <div
          class="item"
          v-for="(item, index) in blogData"
          :key="item.id"
          :style="{
            width: blogData.length > 1 ? '3.2rem' : '100%'
          }"
          @click="jumpBlogDetails(index)"
        >
          <div
            class="image"
            :style="{
              width: blogData.length > 1 ? '3.2rem' : '100%',
              height: blogData.length > 1 ? '1.8rem' : 'calc((100vw - 0.32rem) * (9/16))'
            }"
          >
            <van-image class="img" lazy-load :src="item['url']">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
          <div class="info">
            <div class="title">{{ item.name }}</div>
            <div class="details" v-html="item.text"></div>
          </div>
        </div>
      </div>

      <nuxt-link class="jump-btn" to="/blog">
        <span>View more blogs</span>
        <van-icon name="arrow" />
      </nuxt-link>
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

      .warp {
        @apply h-full
        relative;

        .mask {
          @apply absolute
          left-0.24rem
          bottom-0.8rem
          flex
          flex-col
          items-start
          z-3;

          .name {
            font-size: 0.56rem;
            color: $text-high-color;
            line-height: 0.56rem;
            font-family: 'Sinerva', Arial, sans-serif;
            transform: translateY(0.04rem);

            text-shadow:
              #fff 1px 0 8px,
              #fff 0 1px 8px,
              #fff -1px 0 8px,
              #fff 0 -1px 8px;
          }

          .subtitle {
            @apply m-b-0.2rem;
            @include primary-font-16;
            color: $text-high-color;

            text-shadow:
              #fff 1px 0 4px,
              #fff 0 1px 4px,
              #fff -1px 0 4px,
              #fff 0 -1px 4px;
          }

          .btn-list {
            @apply flex
            w-full
            justify-start
            items-center;

            .btn {
              @apply min-w-1.2rem
              h-0.4rem
              rd-0.4rem
              flex
              justify-center
              items-center;

              border: 2px solid $primary-color;
              @include title-font-18;
              color: $white-color;

              &:last-child {
                background-color: transparent;
              }

              &:first-child {
                background-color: $primary-color;
                margin-right: 0.2rem;
              }
            }
          }
        }
      }

      .img {
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
      font-size: 0.16rem;
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
        font-family: 'Sinerva', Arial, sans-serif;
        transform: translateY(0.04rem);
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
          height: 100%;
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
        overflow-hidden
        relative;

        .image {
          @apply w-full
          h-1.71rem;

          .img {
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

        .tag {
          @apply absolute
          left-0
          top-0.16rem
          h-0.2rem
          flex
          justify-center
          items-center
          p-l-0.04rem
          p-r-0.16rem;

          @include general-font-12;
          color: $white-color;

          background-size: 100% 100%;
          background-repeat: no-repeat;

          &.yellow {
            background-image: url('@/assets/images/tag-1.png');
          }

          &.grey {
            background-image: url('@/assets/images/tag-2.png');
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
        font-family: 'Sinerva', Arial, sans-serif;
        transform: translateY(0.04rem);
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
        m-r-0.16rem;

        &:last-child {
          @apply m-r-0;
        }

        .image {
          @apply w-full;

          .img {
            @apply block
            w-full
            h-full;
          }
        }

        .info {
          @apply w-full
          h-1.34rem
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
            -webkit-line-clamp: 3;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;

            @include general-font-loose-14;
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
