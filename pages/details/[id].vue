<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'

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
const startValue = ref(4)
const swipe = ref(null)
const activeName = ref()
const isSelect = ref(false)

const route = useRoute()
console.log(route.params.id)

const handleSelect = () => {
  isSelect.value = !isSelect.value
}
</script>

<template>
  <div class="details-page">
    <div class="card sku">
      <div class="page-title">Obsidian (Genius Weft)</div>
      <div class="banner">
        <van-swipe :autoplay="3000" lazy-render>
          <van-swipe-item v-for="item in images" :key="item.imgUrl">
            <img :src="item.imgUrl" alt="" />
          </van-swipe-item>

          <template #indicator="{ active, total }">
            <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
          </template>
        </van-swipe>
      </div>
      <div class="pic-list">
        <div class="item" v-for="item in 8" :class="item === 2 && 'active'" :key="item">
          <img src="" alt="" />
        </div>
      </div>
      <div class="info">
        <span class="unit">$</span>
        <span class="price">123.00</span>
        <span class="start">
          <van-rate v-model="startValue" readonly />
        </span>
        <span class="count">100+ </span>
        <span class="tips">Reviews</span>
      </div>

      <div class="split-line"></div>

      <div class="sku-type">
        <div class="title">COLOR：</div>
        <div class="tips">
          <span class="type">Obsidian</span>(Obsidian has a neutral level 4 root that melts into
          bright level 9 ends)
        </div>

        <div class="list">
          <div class="item" v-for="item in 8" :class="item === 2 && 'active'" :key="item">
            <img src="" alt="" />
          </div>
        </div>
      </div>

      <div class="split-line"></div>

      <div class="unit-container">
        <div class="title">CHOOSE LENGTH：</div>
        <div class="list">
          <div class="item" v-for="item in 8" :class="item === 2 && 'active'" :key="item">18"</div>
        </div>
      </div>
    </div>

    <div class="card product-details">
      <div class="top">Product Introduction</div>
      <div class="title">Genius Wefts</div>
      <div class="details">
        Genius Wefts combine the best attributes from hand-tied wefts and flat wefts to create the
        most perfect weft imaginable. This virtually invisible weft is almost as thin as a hand-tied
        weft but can be cut for easy customization like a flat weft, and has no return hairs that
        can irritate the scalp. Some might just call it, Genius!
      </div>
    </div>

    <div class="swipe-container">
      <van-swipe ref="swipe" lazy-render :show-indicators="false">
        <van-swipe-item v-for="item in images" :key="item.imgUrl">
          <img :src="item.imgUrl" alt="" />
        </van-swipe-item>
      </van-swipe>
      <div class="switch-btn left" @click="swipe.prev">
        <van-icon name="arrow-left" />
      </div>
      <div class="switch-btn right" @click="swipe.next">
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="card menu">
      <van-collapse v-model="activeName" accordion :border="false">
        <van-collapse-item :title="`title_${item}`" :name="item" v-for="item in 5">
          We recommend installing Ruilin genius wefts using the natural beaded row method (Original
          or Flip Up), where wefts are sewn onto beaded rows to create a comfortable, natural and
          beautiful result. This method creates maximum length and fullness while resulting in zero
          damage, making it perfect for the most fine-haired of clients.
        </van-collapse-item>
      </van-collapse>
    </div>

    <!--    <div class="card reviews">-->
    <!--      <div class="top">-->
    <!--        <span class="title">Customer Reviews</span>-->
    <!--        <span class="count">100+ </span>-->
    <!--        <span class="tips">Reviews</span>-->
    <!--      </div>-->
    <!--      <div class="select" @click="handleSelect">-->
    <!--        <van-icon :name="isSelect ? 'checked' : 'circle'" />-->
    <!--        <span class="label">Just look at the current item</span>-->
    <!--      </div>-->
    <!--      <div class="list">-->
    <!--        <div class="item" v-for="item in 5" :key="item">-->
    <!--          <div class="top">-->
    <!--            <div class="info">-->
    <!--              <span class="name">Nickname</span>-->
    <!--              <span class="tips">City/Country</span>-->
    <!--            </div>-->
    <!--            <span class="tips">02/12/2024</span>-->
    <!--          </div>-->
    <!--          <div class="start">-->
    <!--            <van-rate v-model="startValue" readonly />-->
    <!--            <span class="unit">Color ; Length</span>-->
    <!--          </div>-->
    <!--          <div class="content">-->
    <!--            The content display area of customer reviews.The length limit is 500 characters-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="jump-btn">-->
    <!--        <Pagination />-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="card follow-container">
      <FollowUs />
    </div>
  </div>
</template>

<style scoped lang="scss">
.details-page {
  @apply w-full;
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
      @apply m-t-0.32rem
      m-b-0.24rem;
      @include title-font-26;
      color: $text-high-color;
    }

    .banner {
      @apply w-full
      h-4.77rem
      relative;

      .van-swipe {
        @apply h-full;

        img {
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
          justify-center;

          background-color: rgba(16, 16, 16, 0.5);
          color: $white-color;
          font-size: 14px;
          line-height: 18px;
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
        m-l-0.14rem;

        border: 2px solid transparent;

        img {
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

        background-color: yellow;
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

          img {
            @apply block
            w-full
            h-full
            rd-50%
            overflow-hidden;

            background-color: black;
          }

          &.active {
            @apply p-0.02rem;
            border-color: $text-special-color;
          }

          background-color: yellow;
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

        grid-template-columns: repeat(5, 56px);
        row-gap: 16px;
        column-gap: 16px;

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
        }
      }
    }
  }

  .product-details {
    .top {
      @apply w-full
      p-b-0.24rem
      p-t-0.32rem
      text-center;

      @include title-font-22;
      color: $text-high-color;
    }
    .title {
      @apply m-b-0.08rem;
      color: $text-high-color;
      @include title-font-26;
    }

    .details {
      color: $text-high-color;
      @include general-font-loose-14;

      @apply pb-0.16rem;
    }
  }

  .swipe-container {
    @apply w-full
    h-5.2rem
    m-t--0.1rem
    relative;

    .van-swipe {
      @apply h-full;

      img {
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

  .menu {
    @apply p-t-0.24rem;

    ::v-deep .van-collapse {
      .van-collapse-item {
        border-top: 1px solid $border-color;
        background-color: $white-color;
      }

      .van-collapse-item__title--expanded:after {
        border: none;
      }

      .van-cell {
        padding: 0;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: $white-color;

        .van-cell__title {
          @include primary-font-14;
          color: $text-high-color;
        }

        .van-icon {
          color: $text-high-color;
        }
      }

      .van-collapse-item__content {
        @include general-font-loose-14;
        color: $text-high-color;
        padding: 0 0 16px 0;
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
        font-size: 20px;
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
            .tips {
              @include english-font;
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
              height: 12px;
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
}
</style>
