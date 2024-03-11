<script setup lang="ts">
import orderStatusTipsMap from '~/utils/orderStatusMap'

const orderList = ref<any>([])

const { data } = await useHttpPost({
  url: `/order/list/`,
  body: { size: 10, current: 1 },
  transform: (res) => {
    return res.data.records
  }
})
console.log(data.value)
if (data.value && data.value.length) {
  orderList.value = data.value
}

const showAction = ref(false)
const actions = [
  { name: 'All', value: '' },
  { name: orderStatusTipsMap[0], value: 0 },
  { name: orderStatusTipsMap[1], value: 1 },
  { name: orderStatusTipsMap[2], value: 2 },
  { name: orderStatusTipsMap[3], value: 3 },
  { name: orderStatusTipsMap[4], value: 4 },
  { name: orderStatusTipsMap[5], value: 5 },
  { name: orderStatusTipsMap['-1'], value: -1 }
]
const currentAction = ref<any>(actions[0])

const onSelect = (item: any) => {
  currentAction.value = item
}
</script>

<template>
  <div class="order-page">
    <main-nav-bar :title="`Orders`" :count="orderList.length" :alignCenter="false">
      <div class="select-btn" @click="showAction = true">
        <span>{{ currentAction.name }}</span>
        <van-icon name="arrow" />
      </div>
    </main-nav-bar>
    <div class="container">
      <order :orderList="orderList" />
    </div>

    <van-action-sheet
      v-model:show="showAction"
      :actions="actions"
      cancel-text="Cancel"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>

<style scoped lang="scss">
.order-page {
  @apply w-screen
  h-full
  overflow-y-auto;

  .select-btn {
    @apply min-w-0.6rem
    h-0.3rem
    rd-0.3rem
    flex
    justify-center
    items-center
    p-x-0.08rem;

    border: 1px solid $text-mid-color;
    color: $text-mid-color;
    @include general-font-14;

    .van-icon {
      @apply m-l-0.04rem;
    }
  }

  .container {
    @apply p-0.16rem;

    background-color: #f5f5f5;
  }
}
</style>
