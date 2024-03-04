<script setup lang="ts">
const router = useRouter()
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
      <div class="label">Goods Settlement</div>
      <div class="right"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-nav-bar {
  @apply w-screen
  h-0.5rem;

  .container {
    @apply w-full
    h-0.5rem
    fixed
    left-0
    top-0
    flex
    items-center
    justify-between
    p-x-0.16rem
    z-9;

    background-color: $white-color;

    .left,
    .right {
      @apply w-0.24rem
      h-0.24rem
      flex
      justify-center
      items-center
      font-size-0.18rem;

      .title {
        @include title-font-18;
        color: $text-high-color;
      }
    }
  }
}
</style>
