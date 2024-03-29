<script setup lang="ts">
import orderStatusTipsMap from '~/utils/orderStatusMap'

const orderList = ref<any>([])

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const showAction = ref(false)
const actions = [
  { name: 'All', value: -2 },
  { name: orderStatusTipsMap[0], value: 0 },
  { name: orderStatusTipsMap[1], value: 1 },
  { name: orderStatusTipsMap[2], value: 2 },
  { name: orderStatusTipsMap[3], value: 3 },
  { name: orderStatusTipsMap[4], value: 4 },
  { name: orderStatusTipsMap[5], value: 5 },
  { name: orderStatusTipsMap['-1'], value: -1 }
]
const currentAction = ref<any>(actions[0])
const pageCurrent = ref(1)

const onLoad = async (clear = false) => {
  const status = currentAction.value.value
  const { data } = await useHttpPost({
    url: `/order/online-list/`,
    body: { size: 5, current: pageCurrent.value, status: status === -2 ? undefined : status },
    transform: (res) => {
      return res.data
    }
  })
  pageCurrent.value = pageCurrent.value + 1
  refreshing.value = false
  loading.value = false
  if (clear) orderList.value = []
  if (data.value) {
    const { records, total, size, current } = data.value
    orderList.value.push(...records)
    finished.value = size * current >= total
  }
}

const onRefresh = () => {
  pageCurrent.value = 1
  finished.value = false
  loading.value = true
  onLoad(true)
}

const onSelect = (item: any) => {
  currentAction.value = item
  loading.value = true
  pageCurrent.value = 1
  onLoad(true)
}
</script>

<template>
  <div class="order-page">
    <main-nav-bar :title="`Orders`" :count="orderList.length" :alignCenter="false" to="/center">
      <div class="select-btn" @click="showAction = true">
        <span>{{ currentAction.name }}</span>
        <van-icon name="arrow" />
      </div>
    </main-nav-bar>
    <div class="container">
      <van-pull-refresh
        v-model="refreshing"
        loading-text="Loading..."
        pulling-text="Pull down to refresh..."
        loosing-text="Release to refresh..."
        @refresh="onRefresh"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="— No More —"
          loading-text="Loading...."
          offset="100"
          @load="onLoad"
        >
          <order :orderList="orderList" />
        </van-list>
      </van-pull-refresh>
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
  flex-1;

  background-color: $view-color;

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

    background-color: $view-color;
  }
}
</style>
