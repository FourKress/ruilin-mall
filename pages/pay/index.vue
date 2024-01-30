<script setup lang="ts">
const totalPrice = ref(11)
const productList = ref<any[]>([
  {
    id: '1',
    select: false,
    children: [
      { id: '111', select: false, price: 0.1, count: 1 },
      { id: '444', select: false, price: 0.2, count: 1 }
    ]
  },
  { id: '2', select: false, children: [{ id: '132', select: false, price: 0.1, count: 1 }] },
  { id: '3', select: false, children: [{ id: '43', select: false, price: 0.7, count: 1 }] },
  { id: '4', select: false, children: [{ id: '123', select: false, price: 0.4, count: 1 }] }
])

const handlePay = () => {}
</script>

<template>
  <div class="pay-page">
    <main-nav-bar />
    <div class="address">
      <div class="details"></div>
      <div class="split">
        <div class="item" v-for="index in 10" :key="index"></div>
      </div>
    </div>
    <div class="container">
      <div class="product-list">
        <div class="item" v-for="product in productList" :key="product.id">
          <div class="item-top">
            <span>Tape-in Extension</span>
          </div>
          <div class="panel" v-for="item in product.children" :key="item.id">
            <div class="panel-right">
              <div class="pic">
                <img src="" alt="" />
              </div>
              <div class="info-container">
                <div class="info-title">lnjection Tape-in</div>
                <div class="tips">
                  <span>color ; Length&nbsp;</span>
                </div>
                <div class="row">
                  <span class="unit">$</span>
                  <span class="price">{{ item.price }}</span>
                  <span class="stepper">
                    <span class="count">x{{ item.count }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-row">
        <div class="row">
          <div class="label">Amount</div>
          <span class="price">$ 10.00</span>
        </div>
        <div class="row">
          <div class="label">Freight</div>
          <span class="tag">Free</span>
        </div>
      </div>

      <div class="card-row">
        <div class="row">
          <div class="label">Money off</div>
        </div>
      </div>
      <div class="card-row">
        <div class="row">
          <div class="label">Promo Code</div>
          <div class="promo-code">
            <span class="tag">$100 off $1000</span>
            <van-field placeholder="Please enter" input-align="right" />
          </div>
        </div>
      </div>
      <div class="card-row">
        <div class="row">
          <div class="label">Payment method</div>
          <div class="method">
            <img class="logo" src="~/assets/images/pay.png" alt="" />
            <span class="label">PayPal</span>
            <van-icon name="checked" />
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="info">
        <span class="row">
          <span class="label">Total:</span>
          <span class="unit">$</span>
          <span class="price">{{ totalPrice }}</span>
        </span>
      </div>
      <div class="btn" @click="handlePay">Pay</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pay-page {
  @apply w-screen
  h-full
  max-h-full
  overflow-hidden;

  .address {
    @apply w-full
    h-1.1rem;

    background-color: $white-color;

    .split {
      @apply h-0.04rem
      flex
      items-center
      justify-between;

      width: calc(100% + 0.02rem);

      .item {
        @apply h-0.04rem
        w-0.32rem
        min-w-0.32rem;

        &:nth-child(odd) {
          background-image: url('@/assets/images/split-1.png');
          background-size: 100% 100%;
        }

        &:nth-child(even) {
          background-image: url('@/assets/images/split-2.png');
          background-size: 100% 100%;
        }
      }
    }

    .details {
      @apply w-full
      h-1.06rem;
    }
  }

  .container {
    @apply overflow-y-auto
    p-x-0.16rem
    p-y-0.12rem;

    max-height: calc(100% - 2.4rem);
    background-color: $view-color;

    .product-list {
      @apply w-full
      overflow-x-hidden
      overflow-y-auto;

      .item {
        @apply w-full
        min-h-1.5rem
        rd-0.08rem
        p-x-0.16rem
        m-b-0.12rem;

        &:last-child {
          @apply m-b-0;
        }

        background-color: $white-color;

        .item-top {
          @apply w-full
          h-0.4rem
          flex
          items-center
          justify-start;

          @include general-font-14;

          color: $text-high-color;
        }

        .panel {
          @apply w-full
          h-1.1rem
          flex
          justify-between
          items-center;

          .panel-right {
            @apply flex-1
            flex
            items-center
            justify-between
            p-t-0.14rem
            p-b-0.16rem
            overflow-hidden;

            border-top: 1px solid $border-color;

            .pic {
              @apply w-0.6rem
              h-0.8rem
              m-r-0.08rem;

              img {
                @apply block
                w-full
                h-full;
              }

              background-color: black;
            }

            .info-container {
              @apply flex-1
              flex
              flex-col
              justify-center
              items-start
              overflow-hidden;

              .info-title {
                @apply w-full
                h-0.22rem
                overflow-hidden
                text-ellipsis;

                white-space: nowrap;

                @include title-font-18;
                color: $text-high-color;
              }

              .tips {
                @apply w-auto
                max-w-full
                h-0.2rem
                m-y-0.06rem
                overflow-hidden
                text-ellipsis
                rd-0.02rem
                p-x-0.08rem
                flex
                justify-start
                items-center;

                white-space: nowrap;

                @include general-font-14;

                color: $text-mid-color;
                background-color: $placeholder-color;
              }

              .row {
                @apply w-full
                h-0.26rem
                flex
                items-center
                justify-start;

                color: $red-color;

                .unit {
                  @apply p-r-0.02rem;

                  @include general-font-14;

                  transform: translateY(0.5px);
                }

                .price {
                  @apply flex-1
                  p-l-0.02rem;

                  @include number-font;
                  @include primary-font-16;
                }

                .stepper {
                  @apply flex
                  items-center
                  justify-center;

                  .count {
                    @apply w-0.26rem
                    h-0.18rem
                    m-x-0.02rem
                    text-center;

                    @include primary-font-14;
                    color: $text-high-color;
                  }
                }
              }
            }
          }
        }
      }
    }

    .card-row {
      @apply w-full
      min-h-0.5rem
      rd-0.08rem
      p-x-0.15rem
      m-t-0.12rem;

      background-color: $white-color;

      .row {
        @apply w-full
        h-0.5rem
        flex
        items-center
        justify-between;

        border-top: 1px solid $border-color;

        &:first-child {
          border-top: none;
        }

        .label {
          @include general-font-14;
          color: $text-high-color;
        }

        .tag {
          @apply h-0.20rem
          p-x-0.08rem
          rd-0.04rem;

          @include primary-font-12;
          color: $red-color;
          border: 1px solid $red-color;
        }

        .price {
          @include primary-font-14;
          color: $text-high-color;
        }

        .promo-code {
          @apply flex
          items-center
          justify-center;

          transform: translateX(0.16rem);

          .van-field {
            @apply w-1.2rem;
          }
        }

        .method {
          @apply flex
          items-center
          justify-center;

          color: $primary-color;
          font-size: 20px;

          .logo {
            @apply w-0.42rem
            h-0.22rem;
          }

          .label {
            @include primary-font-14;
            color: $text-high-color;
            margin: 0 16px 0 -4px;
          }
        }
      }
    }
  }

  .footer {
    @apply fixed
    left-0
    bottom-0
    w-full
    h-0.8rem
    flex
    justify-between
    items-start;

    padding: 0.16rem;
    background-color: $white-color;

    .btn {
      @apply w-1.16rem
      h-0.48rem
      rd-0.5rem
      text-center
      flex
      items-center
      justify-center;

      color: $white-color;
      background-color: $primary-color;

      @include title-font-18;
    }

    .info {
      @apply flex
      flex-col
      justify-center
      items-start
      h-0.48rem;

      .row {
        @apply h-0.18rem
        flex-1
        flex
        items-center
        justify-start;

        color: $red-color;

        .label {
          @include primary-font-14;
          color: $text-high-color;
        }

        .unit {
          @apply p-l-0.04rem;

          @include general-font-14;
        }

        .price {
          @apply p-l-0.02rem;

          @include number-font;
          @include title-font-18;
        }
      }
    }
  }
}
</style>
