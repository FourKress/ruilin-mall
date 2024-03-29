<script setup lang="ts">
const activeName = ref()
const list = ref<any[]>([])

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const pageCurrent = ref(1)

const onLoad = async (clear = false) => {
  const { data } = await useHttpPost({
    url: `/question/list/`,
    body: { size: 5, current: pageCurrent.value },
    transform: (res) => {
      return res.data
    }
  })
  pageCurrent.value = pageCurrent.value + 1
  refreshing.value = false
  loading.value = false
  if (clear) list.value = []
  if (data.value) {
    const { records, total, size, current } = data.value
    list.value.push(...records)
    finished.value = size * current >= total
  }
}

const onRefresh = () => {
  pageCurrent.value = 1
  finished.value = false
  loading.value = true
  onLoad(true)
}
</script>

<template>
  <div class="faq-page">
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
          <div class="menu">
            <van-collapse v-model="activeName" accordion :border="false">
              <van-collapse-item :title="item.name" :name="item.id" v-for="item in list">
                <div class="img" v-if="item.url">
                  <img :src="item.url" alt="" />
                </div>
                <div v-html="item.content" class="content"></div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style scoped lang="scss">
.faq-page {
  @apply p-0.16rem
  flex-1;

  background-color: $view-color;

  .menu {
    :deep(.van-collapse) {
      .van-collapse-item {
        background-color: $white-color;
      }

      .van-collapse-item__title--expanded:after {
        border: none;
      }

      .van-collapse-item {
        @apply p-x-0.16rem
        rd-0.08rem
        m-b-0.16rem;
      }

      .van-cell {
        padding: 0;
        min-height: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: $white-color;

        .van-cell__title {
          @include primary-font-16;
          color: $text-high-color;
          margin: 0.1rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 64px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

        .van-icon {
          color: $text-high-color;
        }
      }

      .van-collapse-item__content {
        padding: 0.14rem 0 0.14rem 0;
        @include general-font-loose-14;

        border-top: 1px solid $placeholder-color;

        color: $text-high-color;

        .img {
          @apply max-w-full
          m-b-0.14rem;

          img {
            @apply block
            max-w-full;

            margin: 0 auto;
          }
        }

        .content {
          word-break: break-all;
        }
      }
    }
  }
}
</style>
