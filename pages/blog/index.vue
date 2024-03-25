<script setup lang="ts">
const blogList = ref<any>([])
const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const pageCurrent = ref(1)

const onLoad = async (clear = false) => {
  const { data } = await useHttpPost({
    url: `/blog/list/`,
    body: { size: 3, current: pageCurrent.value },
    transform: (res) => {
      return res.data
    }
  })
  pageCurrent.value = pageCurrent.value + 1
  refreshing.value = false
  loading.value = false
  if (clear) blogList.value = []
  if (data.value) {
    const { records, total, size, current } = data.value
    blogList.value.push(...records)
    finished.value = size * current >= total
  }
}

const onRefresh = () => {
  pageCurrent.value = 1
  finished.value = false
  loading.value = true
  onLoad(true)
}

const jumpBlogDetails = (id: string) => {
  router.push(`/blog/${id}`)
}
</script>

<template>
  <div class="blog-page">
    <div class="container">
      <van-pull-refresh
        v-model="refreshing"
        loading-text="Loading..."
        pulling-text="Pull down to refresh..."
        loosing-text="Release to refresh..."
        @refresh="onRefresh"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="— No More —"
          loading-text="Loading...."
          offset="100"
          @load="onLoad"
        >
          <div
            class="item"
            v-for="item in blogList"
            :key="item.id"
            @click="jumpBlogDetails(item.id)"
          >
            <div
              class="image"
              :style="{
                height: 'calc((100vw - 0.32rem) * (9/16))'
              }"
            >
              <img :src="item.url" alt="" />
            </div>
            <div class="info">
              <div class="title">{{ item.name }}</div>
              <div class="details" v-html="item.text"></div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog-page {
  @apply w-screen
  h-full
  flex-1;

  background-color: $view-color;

  .container {
    @apply p-0.16rem;

    background-color: $view-color;

    .item {
      @apply w-full
      m-b-0.16rem
      overflow-hidden;

      border-radius: 0.08rem 0.08rem 0 0;

      &:last-child {
        @apply m-r-0;
      }

      .image {
        @apply w-full;

        img {
          @apply block
          w-full
          h-full;
        }
      }

      .info {
        @apply w-full
        h-1.34rem
        p-x-0.16rem;

        background-color: $white-color;

        .title {
          @apply w-full
          h-0.38rem
          overflow-hidden
          text-ellipsis
          p-y-0.08rem;

          white-space: nowrap;

          @include title-font-18;

          color: $text-high-color;
        }

        .details {
          @apply w-full
          overflow-hidden
          text-ellipsis;

          display: -webkit-box;
          -webkit-line-clamp: 3;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;

          @include general-font-loose-14;
        }
      }
    }
  }
}
</style>
