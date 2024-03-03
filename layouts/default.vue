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
    isLayout.value = !['/shopping-cart', '/payment', '/result'].includes(toPath)
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
      <div class="page-container">
        <slot />
      </div>
      <main-footer v-if="isLayout" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.warp {
  @apply w-screen
  h-full
  overflow-y-auto;

  &.fixed {
    @apply fixed
    left-0
    top-0;
  }

  .header-container {
    @apply h-0.64rem;
  }

  .main-container {
    @apply flex
    flex-col;

    min-height: calc(100% - 0.64rem);

    .page-container {
      @apply flex-1;
    }
  }
}
</style>
