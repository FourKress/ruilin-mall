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
    <div class="header">
      <main-header @openModal="handleOpenModal" />
    </div>
    <div class="main">
      <slot />
    </div>
    <div class="footer">
      <main-footer />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fixed {
  @apply fixed
  left-0
  top-0;
}
</style>
