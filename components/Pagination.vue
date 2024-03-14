<script setup lang="ts">
const currentPage = ref(1)
const props = defineProps({
  pageTotal: Number
})

const handlePageChange = (current: number) => {
  emits('pageChange', current)
}

const emits = defineEmits<{
  pageChange: [current: number]
}>()
</script>

<template>
  <van-pagination
    v-model="currentPage"
    force-ellipses
    :total-items="pageTotal"
    :show-page-size="5"
    @change="handlePageChange"
  >
    <template #prev-text>
      <van-icon name="arrow-left" />
    </template>
    <template #next-text>
      <van-icon name="arrow" />
    </template>
  </van-pagination>
</template>

<style scoped lang="scss">
:deep(.van-pagination__items) {
  @apply justify-between;

  .van-pagination__item {
    height: 24px !important;
    max-width: 24px !important;
    min-width: 24px !important;
    width: 24px !important;
    flex: unset !important;
    padding: 0 !important;
    opacity: 1;
    background: transparent;
    color: $text-high-color;
    @include primary-font-16;
    box-shadow: none;
  }

  .van-pagination__item--active {
    background-color: rgba(198, 156, 109, 0.3);
  }

  .van-hairline--surround:after {
    border: none;
  }

  .van-pagination__item--disabled {
    color: #bbbbbb;
  }
}
</style>
