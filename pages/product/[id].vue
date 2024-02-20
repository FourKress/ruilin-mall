<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const route = useRoute()
const productId = ref(route.params.id as string)

const { data: productList }: any = await useFetch(`${baseUrl}/product/list`, {
  method: 'get',
  transform: (res: any) => {
    console.log(res.data)
    return res.data
  }
})

const showAction = ref(false)
const showProductAction = ref(false)
const actions = [
  { name: 'New', value: 1 },
  { name: 'Hot', value: 2 }
]
const productActions = productList.value.map((d: any) => {
  return {
    name: d.name,
    value: d.id
  }
})

const currentAction = ref<any>(actions[0])
const currentProductAction = ref<any>(productActions[0])
const onSelect = (item: any) => {
  currentAction.value = item
}
const onProductSelect = (item: any) => {
  currentProductAction.value = item
}
</script>

<template>
  <div class="product-page">
    <div class="top">
      <div class="title">All Products</div>
      <div class="details" v-if="productId !== '0'">
        Ruilin is aiming to be one of the most reliable China luxury human cuticle hair
        manufacturers since 2008. The philosophy of Ruilin is to create value for customers rather
        than only buy & sell. We are trying our best to meet or even beyond the needs of the
        customers with highly responding, quality and customer driven service.
      </div>
    </div>

    <div class="product-container">
      <div class="btn-list">
        <div class="btn" @click="showProductAction = true">
          <span class="label">{{ currentProductAction.name }}</span
          ><van-icon name="arrow-down" />
        </div>
        <div class="btn" @click="showAction = true">
          <span class="label">{{ currentAction.name }}</span
          ><van-icon name="arrow-down" />
        </div>
      </div>

      <van-action-sheet
        v-model:show="showAction"
        :actions="actions"
        cancel-text="Cancel"
        close-on-click-action
        @select="onSelect"
      />

      <van-action-sheet
        v-model:show="showProductAction"
        :actions="productActions"
        cancel-text="Cancel"
        close-on-click-action
        @select="onProductSelect"
      />

      <div class="list">
        <div class="item" v-for="(item, index) in 10" :key="index">
          <div class="image">
            <img src="" alt="" />
          </div>
          <div class="info">
            <div class="title">Cinnamon Dolce (Clip-in)</div>
            <div class="row">
              <span class="unit">$</span>
              <span class="price">10.00</span>
            </div>
          </div>

          <div class="tag yellow">Low Stock</div>
          <!--          <div class="tag grey">Out of stock</div>-->
        </div>
      </div>

      <div class="jump-btn">
        <Pagination />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-page {
  @apply p-x-0.16rem
  p-t-0.24rem;

  background-color: $white-color;

  .top {
    .title {
      @apply m-b-0.08rem;
      color: $text-high-color;
      @include title-font-26;
    }

    .details {
      color: $text-high-color;
      @include general-font-loose-14;
    }
  }

  .product-container {
    @apply m-t-0.24rem;

    .btn-list {
      @apply w-full
      m-b-0.16rem
      flex
      items-center
      justify-between;

      .btn {
        @include general-font-14;

        @apply w-1.71rem
        h-0.40rem
        lh-0.38rem
        text-center
        rd-0.40rem
        flex
        items-center
        justify-center;

        border: 1px solid $text-mid-color;
        background-color: $white-color;
        color: $text-high-color;

        .van-icon {
          @apply m-l-0.02rem;
          font-size: 16px;
        }

        &:last-child {
          .label {
            @apply w-0.3rem;
          }
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
        h-3.1rem
        m-t-0.16rem
        relative;

        background-color: black;

        .image {
          @apply w-full
          h-2.28rem;

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

    .jump-btn {
      @apply m-t-0.16rem
      m-b-0.24rem
      p-x-0.12rem
      w-full
      h-0.24rem;
    }
  }
}
</style>

<style>
:root {
  --van-pagination-height: 24px;
  --van-pagination-item-width: 24px;
}
</style>
