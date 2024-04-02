<script setup lang="ts">
import type { SwipeInstance } from 'vant'

import { useCartStore } from '~/stores'
import Pagination from '~/components/Pagination.vue'
import { useHttpPost } from '~/utils/useHttp'

const useCart = useCartStore()
const modifyTime = computed(() => useCart.modifyTime)

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const route = useRoute()
const router = useRouter()
const productId = route.params.productId as string

const skuId = ref(route.params.skuId)
const colorId = ref(route.params.colorId)

const swipeData = ref<any[]>([])
const currentColor = ref<Record<string, any>>({})
const currentSwipeId = ref<string>('')
const skuInfo = ref<Record<string, any>>({})
const skuList = ref<Record<string, any>[]>([])
const imageList = ref<any[]>([])
const videoInfo = ref(null)
const goodsCount = ref(1)
const isMaxStock = ref(false)
const isNotStock = ref(false)

const swipe = ref<SwipeInstance>()
const topSwipe = ref<SwipeInstance>()
const activeName = ref()
const isSelect = ref(false)

const setBtnStatus = (sku: any) => {
  const cartSku = useCart.getSku(productId, sku.id)
  const quantity = cartSku?.quantity || 0
  const online_stock = cartSku ? cartSku['online_stock'] : sku['online_stock']
  const nextCount = goodsCount.value + 1

  isMaxStock.value = nextCount + quantity > online_stock || nextCount >= 999
  isNotStock.value =
    goodsCount.value + quantity > online_stock || online_stock === 0 || quantity >= 999
}

watch([modifyTime], () => {
  setBtnStatus(skuInfo.value)
})

const { data: skuRes } = await useHttpPost({
  url: '/product-sku/online-details',
  body: {
    colorId: colorId.value,
    skuId: skuId.value === '0' ? undefined : skuId.value
  }
})
if (skuRes.value) {
  const { info, list } = skuRes.value
  skuInfo.value = info
  skuList.value = list
  setBtnStatus(info)
}

const colorList = ref([])
useHttpGet({
  url: `/product-color/online-list/${productId}`,
  isLoading: true
}).then(({ data }) => {
  if (data.value) {
    colorList.value = data.value
    const targetColor = data.value.find((d: any) => d.id === colorId.value)
    const fileUrlList = (targetColor?.fileList || []).map((d: any) => ({
      url: d.url,
      id: d.id,
      fileType: d.fileType
    }))
    currentColor.value = {
      ...targetColor,
      productDesc: targetColor.productDesc.replace(/\n/g, '<br />')
    }
    swipeData.value = [
      { url: targetColor.url, id: targetColor.id, fileType: targetColor.fileType },
      ...fileUrlList
    ]
    currentSwipeId.value = targetColor.id
  }
})

const unitList = ref([])
const summaryList = ref([])

useHttpGet({
  url: `/product-unit/online-select/${productId}`
}).then(({ data }) => {
  if (data.value) {
    unitList.value = data.value
  }
})

useHttpGet({
  url: `/product-banner/online-list/${productId}`,
  isLoading: true
}).then(({ data }) => {
  if (data.value) {
    data.value.forEach((d: any) => {
      if (d.type === 'image') {
        imageList.value.push(d)
      } else {
        videoInfo.value = d
      }
    })
  }
})

useHttpGet({
  url: `/product-summary/online-list/${productId}`,
  transform: (res: any) => {
    return res.data.map((d: any) => {
      return {
        ...d,
        desc: d.desc.replace(/\n/g, '<br />')
      }
    })
  }
}).then(({ data }) => {
  if (data.value) {
    summaryList.value = data.value
  }
})

const currentPage = ref(1)
const reviewData = ref({})
watchEffect(async () => {
  useHttpPost({
    url: `/review/list`,
    body: {
      size: 10,
      current: currentPage.value,
      productId: productId,
      skuId: isSelect.value ? skuInfo.value.id : undefined
    }
  }).then(({ data }) => {
    if (data.value) {
      reviewData.value = data.value
    }
  })
})

const handlePageChange = (current: number) => {
  currentPage.value = current
}

const handleAddGoodsCount = () => {
  if (skuInfo.value['online_stock'] <= 0) return
  if (isMaxStock.value || isNotStock.value) return

  const count = goodsCount.value + 1
  goodsCount.value = count

  const cartSku = useCart.getSku(productId, skuInfo.value.id)
  const nextCount = count + 1
  isMaxStock.value =
    nextCount + (cartSku?.quantity || 0) > skuInfo.value['online_stock'] || nextCount >= 999
}

const handleSubtractGoodsCount = () => {
  if (skuInfo.value['online_stock'] <= 0) return
  if (goodsCount.value <= 1) return
  isMaxStock.value = false
  goodsCount.value = goodsCount.value - 1
}

const handleAddCart = async () => {
  if (skuInfo.value['online_stock'] <= 0) return
  if (isNotStock.value) return

  const tokenCookie = useCookie('token')
  if (!tokenCookie.value) {
    return router.push('/login')
  }
  const quantity = goodsCount.value
  const sku = skuInfo.value
  const { unitIds, tagIds } = sku

  const formatList = unitList.value
    .filter((d: any) => unitIds.includes(d.id))
    .map((d: any) => {
      return {
        unitName: d.name,
        tagName: d.tags.find((t: any) => tagIds.includes(t.id)).name
      }
    })

  const { id, ...other } = sku
  const isAdd = await useCart.addToCart({
    productId: sku.productId,
    productName: sku.product_name,
    children: [
      {
        ...other,
        skuId: id,
        quantity: quantity,
        url: currentColor.value.url,
        format: formatList,
        tagNameStr: formatList.map((d: any) => d.tagName).join(';')
      }
    ]
  })

  if (isAdd) {
    await useCart.getFetchCartList(false)
  }

  goodsCount.value = 1

  setBtnStatus(skuInfo.value)
}

const handleSelect = () => {
  isSelect.value = !isSelect.value
}

const handleChangeSwipe = (index: number) => {
  currentSwipeId.value = swipeData.value[index].id
}

const handlePreview = (data: any[], index: number) => {
  showImagePreview({
    images: data.filter((d: any) => d.fileType !== 'video/mp4').map((d: any) => d.url),
    startPosition: index
  })
}

const handleSwitchSwipe = (index: number) => {
  if (!topSwipe.value) return
  topSwipe.value.swipeTo(index)
}

const jumpSku = (item: any) => {
  router.push(`/details/${item.productId}/${item.id}/0`)
}

const handleSelectTag = (unitId: string, tagId: string) => {
  const targetSku: Record<string, any> | undefined = skuList.value.find(
    (s) => s.unitIds.includes(unitId) && s.tagIds.includes(tagId)
  )
  if (targetSku) {
    skuInfo.value = targetSku
    setBtnStatus(targetSku)
  }
}
</script>

<template>
  <div class="details-page">
    <div class="card sku">
      <div class="page-title" v-show="skuInfo['product_name']">
        {{ skuInfo['color_name'] }} ({{ skuInfo['product_name'] }})
      </div>
      <div class="banner">
        <van-swipe :autoplay="3000" ref="topSwipe" lazy-render @change="handleChangeSwipe">
          <van-swipe-item v-for="(item, index) in swipeData" :key="item.id">
            <video v-if="item.fileType === 'video/mp4'" width="100%" height="100%" controls>
              <source :src="item.url" type="video/mp4" />
              Your browser does not support the Video tag
            </video>

            <van-image
              class="img"
              lazy-load
              v-else
              :src="item.url"
              alt=""
              @click="handlePreview(swipeData, index)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </van-swipe-item>

          <template #indicator="{ active, total }">
            <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
          </template>
        </van-swipe>
      </div>
      <div class="pic-list">
        <div
          class="item"
          v-for="(item, index) in swipeData"
          :class="item.id === currentSwipeId && 'active'"
          :key="item.id"
          @click="handleSwitchSwipe(index)"
        >
          <video v-if="item.fileType === 'video/mp4'" width="100%" height="100%">
            <source :src="item.url" type="video/mp4" />
            Your browser does not support the Video tag
          </video>

          <van-image class="img" lazy-load v-else :src="item.url" alt="">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </div>
      <div class="info">
        <span class="unit">$</span>
        <span class="price">{{ skuInfo['online_price'] }}</span>
        <span class="start">
          <van-rate v-model="reviewData['totalScore']" allow-half readonly />
        </span>
        <span class="count">{{ reviewData['reviewCount'] }}+ </span>
        <span class="tips">Reviews</span>
      </div>

      <div class="split-line"></div>

      <div class="sku-type">
        <div class="title">COLOR：</div>
        <div class="tips">
          <span class="type">{{ currentColor.name }}</span
          >({{ currentColor.desc }})
        </div>

        <div class="list">
          <div
            class="item"
            v-for="item in colorList"
            :class="item.id === currentColor.id && 'active'"
            :key="item"
            @click="jumpSku(item)"
          >
            <van-image class="img" lazy-load :src="item.url" :alt="item['online_objectKey']">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </div>
        </div>
      </div>

      <div class="split-line"></div>

      <div class="unit-container" v-if="unitList.length" v-for="unit in unitList" :key="unit.id">
        <div class="title">{{ unit.name }}：</div>
        <div class="list">
          <div
            class="item"
            v-for="item in unit.tags"
            :class="[
              skuInfo['tagIds'] && skuInfo['tagIds'].some((d) => d === item.id) && 'active',
              skuList.every((d) => !d['tagIds'].includes(item.id)) && 'disabled'
            ]"
            :key="item.id"
            @click="handleSelectTag(unit.id, item.id)"
          >
            {{ item['online_name'] }}
          </div>
        </div>
      </div>
    </div>

    <div class="product-details">
      <div class="top">Product Introduction</div>
      <div class="swipe-container">
        <van-swipe :autoplay="3000" ref="swipe" lazy-render :show-indicators="false">
          <van-swipe-item v-for="(item, index) in imageList" :key="item.url">
            <van-image
              class="img"
              lazy-load
              :src="item.url"
              :alt="item['online_objectKey']"
              @click="
                showImagePreview({
                  images: imageList.map((d) => d['url']),
                  startPosition: index
                })
              "
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </van-swipe-item>
        </van-swipe>
        <div class="switch-btn left" @click="swipe['prev']">
          <van-icon name="arrow-left" />
        </div>
        <div class="switch-btn right" @click="swipe['next']">
          <van-icon name="arrow" />
        </div>
      </div>

      <div class="title">{{ currentColor['productName'] }}</div>
      <div class="details" v-html="currentColor['productDesc']"></div>

      <div class="video-container" v-if="videoInfo">
        <video width="100%" height="100%" controls>
          <source :src="videoInfo['url']" type="video/mp4" />
          Your browser does not support the Video tag
        </video>
      </div>

      <div class="menu">
        <van-collapse v-model="activeName" accordion :border="false">
          <van-collapse-item :title="item.name" :name="item.id" v-for="item in summaryList">
            <div v-html="item.desc"></div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

    <div class="card reviews">
      <div class="top">
        <span class="title">Customer Reviews</span>
        <span class="count">{{ reviewData.total }}+ </span>
        <span class="tips">Reviews</span>
      </div>
      <div class="select" @click="handleSelect">
        <van-icon :name="isSelect ? 'checked' : 'circle'" />
        <span class="label">Just look at the current item</span>
      </div>
      <div class="list">
        <div class="item" v-for="item in reviewData.records" :key="item">
          <div class="top">
            <div class="info">
              <span class="name">{{ item['nickname'] }}</span>
            </div>
            <span class="tips">{{ item['createTime'].substring(0, 10) }}</span>
          </div>
          <div class="start">
            <van-rate v-model="item['score']" readonly />
            <span class="unit">{{ item['tagNameStr'] }}</span>
          </div>
          <div class="content">
            {{ item['content'] }}
          </div>
          <div class="img-list">
            <div
              class="img"
              :class="item['imageList'].length === 1 && 'big-img'"
              v-for="(url, index) in item['imageList']"
              :key="url"
            >
              <van-image
                class="img"
                lazy-load:src="url"
                :src="url"
                alt=""
                @click="
                  showImagePreview({
                    images: item['imageList'],
                    startPosition: index
                  })
                "
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
          </div>
        </div>
      </div>
      <div class="jump-btn">
        <Pagination
          v-if="reviewData['records'] && reviewData['records'].length"
          :pageTotal="reviewData['total']"
          @pageChange="handlePageChange"
        />
      </div>
    </div>

    <div class="card follow-container">
      <FollowUs />
    </div>

    <div class="add-cart">
      <div class="count btn" :class="skuInfo['online_stock'] <= 0 && 'disabled'">
        <van-icon
          name="minus"
          :style="{ color: goodsCount <= 1 ? '#D8D8D8' : '#1E1E1E' }"
          @click="handleSubtractGoodsCount"
        />
        <span class="value" :style="{ color: isMaxStock && isNotStock ? '#D8D8D8' : '#1E1E1E' }">{{
          goodsCount
        }}</span>
        <van-icon
          name="plus"
          :style="{ color: isMaxStock || isNotStock ? '#D8D8D8' : '#1E1E1E' }"
          @click="handleAddGoodsCount"
        />
      </div>
      <div class="add btn" :class="isNotStock && 'disabled'" @click="handleAddCart">
        <van-icon name="plus" />
        <span>&nbsp;Add Cart</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.details-page {
  @apply w-full
  relative;
  background-color: $view-color;

  .card {
    @apply w-full
    p-x-0.16rem
    m-b-0.1rem;
    background-color: $white-color;

    .split-line {
      @apply w-full
      h-0px
      m-y-0.24rem;

      border-top: 1px solid $border-color;
    }
  }

  .sku {
    .page-title {
      @apply p-t-0.32rem
      m-b-0.24rem;
      @include title-font-26;
      color: $text-high-color;

      font-family: 'Sinerva', Arial, sans-serif;
      transform: translateY(0.04rem);
    }

    .banner {
      @apply w-full
      h-4.77rem
      relative;

      height: calc(100vw - 0.32rem);

      .van-swipe {
        @apply h-full
        rd-0.06rem
        overflow-hidden;

        .img {
          @apply block
          w-full
          h-full;
        }

        .custom-indicator {
          @apply absolute
          right-0
          bottom-0
          w-0.43rem
          h-0.26rem
          flex
          items-center
          justify-center
          overflow-hidden;

          border-radius: 0 0 0.06rem 0;

          background-color: rgba(16, 16, 16, 0.5);
          color: $white-color;
          font-size: 0.14rem;
          line-height: 0.18rem;
          @include number-font;
        }
      }
    }

    .pic-list {
      @apply w-full
      h-0.6rem
      flex
      justify-start
      items-center
      flex-nowrap
      overflow-x-auto
      overflow-y-hidden
      m-t-0.16rem
      m-b-0.24rem;

      .item {
        @apply w-0.6rem
        min-w-0.6rem
        h-full
        m-l-0.14rem
        rd-0.04rem
        overflow-hidden;

        border: 2px solid transparent;

        .img {
          @apply block
          w-full
          h-full;
        }

        &:first-child {
          @apply m-l-0;
        }

        &.active {
          border-color: $text-special-color;
        }
      }
    }

    .info {
      @apply w-full
      h-0.28rem
      flex
      items-center
      justify-between;

      color: $red-color;

      .unit {
        @apply p-r-0.02rem;

        @include general-font-14;

        transform: translateY(2px);
      }

      .price {
        @apply flex-1
        p-l-0.02rem;

        @include number-font;
        @include title-font-22;
      }

      .count {
        @apply m-l-0.08rem;

        @include general-font-14;
        @include number-font;
        color: $text-low-color;
      }

      .tips {
        @apply p-l-0.08rem;

        @include general-font-14;
        @include english-font;
        color: $text-low-color;
      }
    }

    .sku-type {
      .title {
        @apply w-full
        h-0.18rem;

        @include general-font-14;
        color: $text-high-color;
      }

      .tips {
        @apply w-full
        m-t-0.08rem
        m-b-0.02rem;

        @include general-font-14;
        color: $text-low-color;

        .type {
          @include primary-font-14;
          color: $text-high-color;
        }
      }

      .list {
        @apply w-full
        flex
        items-start
        flex-wrap;

        .item {
          @apply w-0.48rem
          h-0.48rem
          rd-50%
          m-t-0.14rem
          m-r-0.14rem
          overflow-hidden;

          border: 2px solid transparent;

          &:nth-child(6n + 6) {
            @apply m-r-0;
          }

          .img {
            @apply block
            w-full
            h-full
            rd-50%
            overflow-hidden;
          }

          &.active {
            @apply p-0.02rem;
            border-color: $text-special-color;
          }
        }
      }
    }

    .unit-container {
      .title {
        @apply w-full
        h-0.18rem;

        @include general-font-14;
        color: $text-high-color;
      }

      .list {
        @apply w-full
        m-t-0.16rem
        p-b-0.32rem
        grid
        justify-between;

        grid-template-columns: repeat(5, 0.56rem);
        row-gap: 0.16rem;
        column-gap: 0.16rem;

        .item {
          @apply w-0.56rem
          h-0.40rem
          rd-0.04rem
          flex
          justify-center
          items-center;

          @include general-font-14;
          color: $text-high-color;
          background-color: $placeholder-color;

          //&:nth-child(5n + 5) {
          //  @apply m-r-0;
          //}

          &.active {
            color: $white-color;
            background-color: $primary-color;
          }

          &.disabled {
            opacity: 0.5;
          }
        }
      }
    }
  }

  .product-details {
    @apply m-b-0.1rem;

    background-color: $white-color;

    .top {
      @apply w-full
      p-b-0.24rem
      p-t-0.32rem
      p-x-0.16rem
      text-center;

      @include title-font-22;
      color: $text-high-color;
      font-family: 'Sinerva', Arial, sans-serif;
      transform: translateY(0.04rem);
    }

    .swipe-container {
      @apply w-full
      h-2.92rem
      relative;

      .van-swipe {
        @apply h-full;

        :deep(.van-swipe__track) {
          width: 100% !important;

          .van-swipe-item {
            width: 100% !important;
          }
        }

        .img {
          @apply block
          w-full
          h-full;
        }
      }

      .switch-btn {
        @apply absolute
        top-50%
        w-0.44rem
        h-0.44rem
        flex
        justify-center
        items-center
        font-size-0.16rem
        rd-50%
        overflow-y-hidden;

        background-color: rgba(16, 16, 16, 0.5);
        color: $white-color;

        transform: translateY(-50%);

        &.left {
          left: 0.16rem;
        }

        &.right {
          @apply right-0.16rem;
        }
      }
    }

    .title {
      @apply m-b-0.08rem
      p-t-0.16rem
      p-x-0.16rem;

      color: $text-high-color;
      @include title-font-26;

      font-family: 'Sinerva', Arial, sans-serif;
      transform: translateY(0.05rem);
    }

    .details {
      @apply p-x-0.16rem;

      color: $text-high-color;
      @include general-font-loose-14;

      @apply pb-0.16rem;
    }

    .video-container {
      @apply w-full
      h-2.92rem;
    }

    .menu {
      @apply p-t-0.24rem
      p-x-0.16rem;

      :deep(.van-collapse) {
        .van-collapse-item {
          border-top: 1px solid $border-color;
          background-color: $white-color;
        }

        .van-collapse-item__title--expanded:after {
          border: none;
        }

        .van-cell {
          padding: 0;
          height: 0.6rem;
          line-height: 0.6rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          background-color: $white-color;

          .van-cell__title {
            @include primary-font-14;
            color: $text-high-color;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .van-icon {
            color: $text-high-color;
          }
        }

        .van-collapse-item__content {
          @include general-font-loose-14;
          color: $text-high-color;
          padding: 0 0 0.16rem 0;
        }
      }
    }
  }

  .reviews {
    @apply w-full
    p-t-0.32rem;

    .top {
      @apply w-full
      flex
      justify-between
      items-center;

      .title {
        flex: 1;
        @include title-font-22;
        color: $text-high-color;
        font-family: 'Sinerva', Arial, sans-serif;
        transform: translateY(0.04rem);
      }

      .count {
        @apply m-l-0.08rem;

        @include general-font-14;
        @include number-font;
        color: $text-low-color;
      }

      .tips {
        @apply p-l-0.08rem;

        @include general-font-14;
        @include english-font;
        color: $text-low-color;
      }
    }

    .select {
      @apply flex
      justify-start
      items-center
      m-t-0.16rem;

      .van-icon {
        @apply m-r-0.08rem;
        font-size: 0.2rem;
        color: $primary-color;
      }

      .label {
        @include general-font-14;
        color: $text-high-color;
      }
    }

    .list {
      .item {
        @apply m-t-0.16rem
        p-0.16rem
        w-full;

        background-color: $view-color;

        .top {
          @apply flex
          justify-between
          items-center;

          .tips {
            @include general-font-12;
            @include number-font;
            color: $text-low-color;
          }

          .info {
            @apply flex-1;

            .name {
              @include primary-font-16;
              color: $text-high-color;
            }
          }
        }

        .start {
          @apply m-t-0.08rem
          m-b-0.16rem
          flex
          justify-start
          items-center;

          .unit {
            @include general-font-12;
            color: $text-low-color;

            @apply m-l-0.12rem
            p-l-0.12rem
            relative;

            transform: translateY(1px);

            &:before {
              content: '';
              height: 0.12rem;
              width: 1px;
              background-color: $border-color;
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
            }
          }
        }

        .content {
          @include general-font-loose-14;
          color: $text-high-color;
        }

        .img-list {
          @apply w-full
          grid
          justify-between
          items-start
          flex-wrap
          m-t-0.08rem;

          grid-template-columns: repeat(3, 1.06rem);
          row-gap: 0.04rem;
          column-gap: 0.04rem;

          .img {
            @apply w-1.06rem
            h-1.06rem;

            img {
              @apply block
              w-full
              h-full;
            }

            &.big-img {
              @apply w-1.6rem
              h-1.6rem;
            }
          }
        }
      }
    }

    .jump-btn {
      @apply p-t-0.16rem
      p-b-0.32rem;
    }
  }

  .follow-container {
    @apply p-t-0.32rem;
  }

  .add-cart {
    @apply w-full
    h-0.8rem
    p-x-0.16rem
    flex
    justify-between
    items-center
    fixed
    left-0
    bottom-0
    z-1;

    background-color: $white-color;

    .btn {
      @apply h-0.48rem
      flex
      justify-center
      items-center
      rd-0.48rem;

      @include title-font-18;
      border: 2px solid $primary-color;

      &.disabled {
        color: #d8d8d8;
      }
    }

    .count {
      @apply w-1.2rem
      justify-around
      px-0.14rem;

      color: $text-high-color;
    }

    .add {
      @apply w-2.23rem;

      background-color: $primary-color;
      color: $white-color;
    }
  }
}
</style>
