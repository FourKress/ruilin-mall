<script setup lang="ts"></script>

<template>
  <div class="follow-us">
    <div class="top">
      <div class="label">Follow Us</div>
    </div>
    <div class="list"></div>

    <div class="jump-btn">
      <span>@RuiLinHair</span>
      <van-icon name="arrow" />
    </div>

    <div class="tabs">
      <div class="btn active">
        <img src="" alt="" />
      </div>
      <div class="btn">
        <img src="" alt="" />
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
    }
  }

  .list {
    @apply w-full
    h-3.38rem
    m-t-0.16rem;

    background-color: black;
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
      font-size: 16px;
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

        background-color: black;
      }

      border: 1px solid $view-color;

      &.active {
        border-color: $border-color;
      }
    }
  }
}
</style>
