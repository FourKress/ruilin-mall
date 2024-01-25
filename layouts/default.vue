<script setup lang="ts">
const warpRef = ref<HTMLDivElement>()

const handleOpenModal = (status: boolean) => {
  const warpDom = warpRef.value!
  if (status) {
    warpDom.classList.add('fixed')
  } else {
    warpDom.classList.remove('fixed')
  }
}
</script>

<template>
  <div class="warp" ref="warpRef">
    <main-header @openModal="handleOpenModal" />
    <div class="main-container">
      <slot />
    </div>
    <main-footer />
  </div>
</template>

<style scoped lang="scss">
.warp {
  @apply w-screen;

  &.fixed {
    @apply fixed
    left-0
    top-0;
  }

  .main-container {
    @apply p-t-0.64rem;
  }
}
</style>
