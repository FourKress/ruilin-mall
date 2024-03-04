<script setup lang="ts">
const props = defineProps({
  matchedRuleId: {
    type: String,
    required: true
  },
  ruleList: {
    type: Array,
    required: true
  }
})

const emits = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emits('close')
}
</script>

<template>
  <div class="rules-dialog">
    <div class="dialog-top">
      <span class="label">Money off rules</span>
      <van-icon name="cross" @click="handleClose" />
    </div>
    <div class="dialog-main">
      <div class="row" v-for="item in ruleList" :key="item">
        <div class="tips">
          Spend ${{ item['thresholdValue'] }} or more, get ${{ item['faceValue'] }} off
        </div>
        <span class="tag">
          <span class="label">${{ item['faceValue'] }} off ${{ item['thresholdValue'] }}</span>
          <span class="status" v-if="matchedRuleId === item.id">matched</span>
        </span>
      </div>
    </div>
    <div class="dialog-footer" @click="handleClose">Confirm</div>
  </div>
</template>

<style scoped lang="scss">
.rules-dialog {
  @apply absolute
  left-0
  bottom-0
  w-full
  h-3.9rem
  flex
  flex-col
  justify-between
  items-start
  p-y-0.16rem
  overflow-hidden;

  border-radius: 8px 8px 0 0;
  background-color: $view-color;

  .dialog-top {
    @apply w-full
    h-0.24rem
    flex
    items-center
    justify-between
    m-b-0.15rem
    p-x-0.16rem;

    .label {
      @include title-font-18;
      color: $text-high-color;
    }
  }

  .dialog-footer {
    @apply w-1.16rem
    h-0.48rem
    text-center
    rd-0.48rem
    m-x-0.16rem
    flex
    justify-center
    items-center;

    color: $white-color;

    @include title-font-18;

    background-color: $primary-color;
  }

  .dialog-main {
    @apply w-full
    flex-1
    overflow-y-auto
    m-b-0.16rem
    p-x-0.16rem;

    .row {
      @apply w-full
      h-0.4rem
      flex
      flex-col
      m-t-0.17rem;

      .tag {
        @apply h-0.21rem
        flex
        items-center
        justify-between
        m-t-0.02rem;

        .label {
          @apply p-x-0.08rem
          h-0.19rem
          rd-0.04rem
          overflow-hidden;

          @include primary-font-12;

          line-height: 0.17rem;

          color: $red-color;
          background-color: $white-color;
          border: 1px solid $red-color;
        }

        .status {
          @apply p-x-0.08rem
          h-0.19rem
          rd-0.04rem;

          @include primary-font-12;
          line-height: 0.17rem;
          color: $white-color;
          background-color: $red-color;
        }
      }

      .tips {
        @include general-font-14;
        color: $text-low-color;
      }
    }
  }
}
</style>
