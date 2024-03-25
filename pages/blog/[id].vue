<script setup lang="ts">
const route = useRoute()

const { data: blogDetails } = await useHttpGet({
  url: `/blog/online-details/${route.params?.id}`
})
</script>

<template>
  <div class="blog-details-page">
    <div class="container" v-html="blogDetails.content"></div>
  </div>
</template>

<style scoped lang="scss">
.blog-details-page {
  @apply p-0.16rem;

  background-color: $white-color;
}
</style>
