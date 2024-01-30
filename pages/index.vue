<script setup lang="ts">
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

const productColumns = [
  { text: 'Hot', value: 1 },
  { text: 'New', value: 2 }
]

const showPicker = ref(false)
const productType = ref<number[]>([productColumns[0].value])

const onConfirm = ({ selectedOptions }: { selectedOptions: any[] }) => {
  showPicker.value = false
  console.log(selectedOptions)
}
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
      <div class="top">
        <div class="label">Products Recommended</div>
        <div class="picker" @click="showPicker = true">
          <span class="label">{{
            productColumns.find((d) => d.value === productType[0]).text
          }}</span>
          <span class="icon"></span>
        </div>
      </div>
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
        </div>
      </div>

      <div class="jump-btn">
        <span>View more products</span>
        <span class="icon"></span>
      </div>
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
        <span class="icon"></span>
      </div>
    </div>

    <div class="about-container">
      <div class="top">
        <div class="label">About Us</div>
      </div>
      <div class="list"></div>

      <div class="jump-btn">
        <span>@RuiLinHair</span>
        <span class="icon"></span>
      </div>

      <div class="tabs">
        <div class="btn active">
          <img src="" alt="" />
        </div>
        <div class="btn">
          <img src="" alt="" />
        </div>
        <div class="btn">
          <img src="" alt="" />
        </div>
      </div>
    </div>

    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        v-model="productType"
        :columns="productColumns"
        :visible-option-num="4"
        cancel-button-text="Cancel"
        confirm-button-text="Confirm"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
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

    .icon {
      @apply w-0.16rem
      h-0.16rem
      m-l-0.02rem;

      background-color: red;
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
        justify-center
        cursor-pointer;

        color: $text-mid-color;
        border: 1px solid $text-mid-color;

        .label {
          @include english-font;
          @include general-font-14;
        }

        .icon {
          @apply w-0.16rem
          h-0.16rem
          m-l-0.02rem;

          background-color: red;
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
        m-t-0.16rem;

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
    }

    .list {
      @apply w-full
      h-3.38rem
      m-t-0.16rem;

      background-color: black;
    }

    .tabs {
      @apply w-full
      h-0.72rem
      flex
      items-center
      justify-center
      p-y-0.18rem;

      .btn {
        @apply w-0.36rem
        h-0.36rem
        rd-0.08rem
        flex
        items-center
        justify-center
        m-r-0.16rem;

        &:last-child {
          @apply m-r-0;
        }

        img {
          @apply block
          w-0.24rem
          h-0.24rem;

          background-color: black;
        }

        border: 1px solid $view-color;

        &.active {
          border-color: $border-color;
        }
      }
    }
  }
}
</style>
