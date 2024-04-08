<script setup lang="ts">
const route = useRoute()

const blogDetails = ref({})
const isEnd = ref(false)
const current = Number(route.params?.current)

const { data } = await useHttpPost({
  url: `/blog/list/`,
  body: { size: 1, current: Number(current) },
  transform: (res) => {
    return res.data
  }
})
if (data.value) {
  const { records, total, size, current } = data.value
  blogDetails.value = records[0]
  isEnd.value = size * current >= total
}
</script>

<template>
  <div class="blog-details-page" v-if="blogDetails.name">
    <div class="title">{{ blogDetails.name }}</div>
    <div class="time">{{ blogDetails['createTime'].substring(0, 10) }}</div>
    <div class="container" v-html="blogDetails.content"></div>
    <div
      class="btn-list"
      :style="{
        justifyContent: isEnd ? 'flex-start' : current >= 2 ? 'space-between' : 'flex-end'
      }"
    >
      <nuxt-link class="btn" v-if="current >= 2" :to="`/blog/${current - 1}`">
        <van-icon name="arrow-left" />
        <span>Previous</span>
      </nuxt-link>
      <nuxt-link class="btn" v-if="!isEnd" :to="`/blog/${current + 1}`">
        <span>Next</span>
        <van-icon name="arrow" />
      </nuxt-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog-details-page {
  @apply p-0.16rem
  flex-1
  relative
  flex
  flex-col;

  background-color: $white-color;

  .title {
    @apply p-t-0.08rem;

    @include title-font-22;
    color: $text-high-color;
  }

  .time {
    @apply m-b-0.16rem
    m-t-0.08rem;

    @include general-font-14;
    color: $text-low-color;
  }

  .container {
    @apply flex-1;
  }

  .btn-list {
    @apply flex
    justify-between
    items-center
    m-t-0.16rem

    w-full
    p-x-0.16rem;

    .btn {
      @apply w-1.60rem
      h-0.40rem
      rd-0.4rem
      flex
      justify-center
      items-center;

      border: 1px solid $text-mid-color;
      @include primary-font-16;
      color: $text-high-color;

      .van-icon {
        @apply m-x-0.02rem;
        font-size: 0.16rem;
      }
    }
  }
}
</style>
