<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const order = ref<any>({})

const paypalOrderId = route.query.token
console.log(paypalOrderId)

const { data } = await useHttpGet({
  url: `/order/detailsByPayId/${paypalOrderId}`
})
if (data.value) {
  console.log(data.value)
  order.value = data.value
}
</script>

<template>
  <div class="result">
    <div class="bg"></div>
    <div class="card">
      <div class="container">
        <div class="top">
          <span class="unit">$</span>
          <span class="price">{{ order['payAmount'] }}</span>
        </div>

        <div class="row">
          <span class="label">Order No</span>
          <span class="text">{{ order['orderNo'] }}</span>
        </div>
        <div class="row">
          <span class="label">Order Time</span>
          <span class="text">{{ order['createTime'] }}</span>
        </div>
        <div class="row">
          <span class="label">Payment Method</span>
          <span class="text">PayPal</span>
        </div>
      </div>
    </div>
    <div class="btn-list error">
      <nuxt-link class="btn" to="/">Home</nuxt-link>
      <nuxt-link class="btn" :to="`/order/${order.id}`">Order Details</nuxt-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.result {
  @apply w-full
  h-full
  flex-1;

  background-color: $view-color;

  .bg {
    @apply w-full
    h-3rem
    relative
    z-1;

    background-color: #ccc;
  }

  .card {
    @apply w-full
    h-1.6rem
    p-x-0.16rem
    m-t--0.4rem
    relative
    z-2;

    .container {
      @apply w-full
      h-full
      p-x-0.16rem
      rd-0.08rem;

      background-color: $white-color;
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.1);

      .top {
        @apply w-full
        p-y-0.16rem
        flex
        items-end
        justify-center;

        color: $text-high-color;

        border-bottom: 1px dashed $border-color;

        .unit {
          @apply p-r-0.02rem;

          @include general-font-14;

          transform: translateY(-2px);
        }

        .price {
          @include number-font;
          @include title-font-22;
        }
      }

      .row {
        @apply flex
        items-center
        justify-between
        m-t-0.06rem;

        @include general-font-loose-14;
        color: #9e9e9e;
      }
    }
  }

  .btn-list {
    @apply w-full
    p-x-0.16rem
    m-t-0.24rem
    flex
    items-center
    justify-between;

    .btn {
      @include title-font-18;

      @apply w-1.71rem
      h-0.48rem
      lh-0.44rem
      text-center
      rd-0.48rem;

      border: 2px solid $primary-color;
      background-color: $view-color;
      color: $primary-color;

      &:last-child {
        background-color: $primary-color;
        color: $white-color;
      }
    }

    &.error {
      .btn {
        border-color: $red-color;
        color: $red-color;

        &:last-child {
          color: $white-color;
          background-color: $red-color;
        }
      }
    }
  }
}
</style>
