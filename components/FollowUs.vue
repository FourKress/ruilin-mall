<script setup lang="ts">
// const runtimeConfig = useRuntimeConfig()
// const baseUrl = runtimeConfig.public.baseUrl

const { data: insMediaList } = await useFetch(
  `https://service.vinnhair.com/api/v1/media/ins/list`,
  {
    method: 'get',
    transform: (res: any) => {
      return res.data
    }
  }
)

const jumpIns = () => {
  window.open('https://www.instagram.com/vinnhairextensions/', '_blank')
}
const jumpFaceBook = () => {
  window.open('https://www.facebook.com/vinnhair/', '_blank')
}
</script>

<template>
  <div class="follow-us">
    <div class="top">
      <div class="label">Follow Us</div>
    </div>
    <div class="list">
      <div class="item" v-for="item in insMediaList" :key="item.id">
        <img v-if="item['media_type'] === 'IMAGE'" :src="item['media_url']" alt="" />
        <video v-if="item['media_type'] === 'VIDEO'" width="100%" height="100%" controls>
          <source :src="item['media_url']" type="video/mp4" />
          Your browser does not support the Video tag
        </video>
      </div>
    </div>

    <div class="jump-btn">
      <span>@RuiLinHair</span>
      <van-icon name="arrow" />
    </div>

    <div class="tabs">
      <div class="btn" @click="jumpIns">
        <img src="https://assets.vinnhair.com/static/instagram-fill.png" alt="" />
      </div>
      <div class="btn" @click="jumpFaceBook">
        <img src="https://assets.vinnhair.com/static/facebook-fill.png" alt="" />
      </div>
      <div class="btn">
        <img src="" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.follow-us {
  @apply w-full;

  .top {
    @apply w-full
    flex
    items-center
    justify-between;

    .label {
      @include english-font;
      @include title-font-22;
      color: $text-high-color;
      font-family: 'Sinerva', Arial, sans-serif;
    }
  }

  .list {
    @apply w-full
    m-t-0.16rem
    grid
    justify-between;

    grid-template-columns: repeat(3, 1.18rem);
    row-gap: 0.02rem;
    column-gap: 0.02rem;

    .item {
      @apply w-1.18rem
      h-1.18rem;

      img,
      video {
        @apply block
        w-full
        h-full;
      }
    }
  }

  .jump-btn {
    @apply w-2.2rem
    h-0.4rem
    rd-0.2rem
    text-center
    flex
    items-center
    justify-center
    m-t-0.24rem
    m-x-auto;

    @include english-font;
    @include primary-font-16;

    color: $text-high-color;
    border: 1px solid $text-mid-color;

    .van-icon {
      @apply m-l-0.02rem;
      font-size: 0.16rem;
    }
  }

  .tabs {
    @apply w-full
    h-0.72rem
    flex
    items-center
    justify-center
    p-y-0.18rem;

    .btn {
      @apply w-0.36rem
      h-0.36rem
      rd-0.08rem
      flex
      items-center
      justify-center
      m-r-0.16rem;

      &:last-child {
        @apply m-r-0;
      }

      img {
        @apply block
        w-0.24rem
        h-0.24rem;
      }

      border: 1px solid $view-color;

      &.active {
        border-color: $border-color;
      }
    }
  }
}
</style>
