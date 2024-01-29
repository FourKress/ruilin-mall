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

const isLayout = ref(true)
const router = useRouter()
watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    //要执行的方法
    const query = router.currentRoute.value.query
    console.log(toPath)
    isLayout.value = toPath !== '/shopping-cart'
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="warp" ref="warpRef">
    <div class="header-container" v-if="isLayout">
      <main-header @openModal="handleOpenModal" />
    </div>
    <div class="main-container">
      <slot />
    </div>
    <main-footer v-if="isLayout" />
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

  .header-container {
    @apply h-0.64rem;
  }
}
</style>
