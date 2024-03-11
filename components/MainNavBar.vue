<script setup lang="ts">
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  alignCenter: {
    type: Boolean,
    default: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="main-nav-bar">
    <div class="container">
      <div class="left" @click="handleBack">
        <van-icon name="arrow-left" />
      </div>
      <div class="label" :style="{ justifyContent: alignCenter ? 'center' : 'flex-start' }">
        {{ title }}
        <span class="tips" v-if="count">({{ count }})</span>
      </div>
      <div class="right">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-nav-bar {
  @apply w-screen
  h-0.6rem;

  .container {
    @apply w-full
    h-0.6rem
    fixed
    left-0
    top-0
    flex
    items-center
    justify-between
    p-x-0.16rem
    z-9;

    background-color: $white-color;

    .label {
      @apply flex-1
      flex
      items-center
      p-l-0.085rem;
      @include title-font-22;
      color: $text-high-color;

      .tips {
        @include general-font-14;
        color: $text-mid-color;
        margin-left: 0.08rem;
        transform: translateY(0.01rem);
      }
    }

    .left {
      @apply w-0.24rem
      h-0.24rem
      flex
      justify-center
      items-center
      font-size-0.24rem;

      .title {
        @include title-font-18;
        color: $text-high-color;
      }
    }
  }
}
</style>
