<script setup lang="ts">
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
      <span class="btn" @click="handleClose"></span>
    </div>
    <div class="dialog-main">
      <div class="row" v-for="item in 10" :key="item">
        <div class="tips">Spend $100 or more, get $10 off</div>
        <span class="tag">
          <span class="label">$100 off $1000</span>
          <span class="status">matched</span>
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

    .btn {
      @apply w-0.24rem
      h-0.24rem;

      background-color: black;
    }
  }

  .dialog-footer {
    @apply w-full
    h-0.48rem
    text-center
    rd-0.48rem
    p-x-0.16rem;

    color: $white-color;

    @include title-font-18;

    line-height: 48px;

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
