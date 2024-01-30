<script setup lang="ts"></script>

<template>
  <div class="main-nav-bar">
    <div class="left"></div>
    <div class="label">Order settlement</div>
    <div class="right"></div>
  </div>
</template>

<style scoped lang="scss">
.main-nav-bar {
  @apply w-screen
  h-0.5rem
  flex
  items-center
  justify-between
  p-x-0.16rem;

  .left,
  .right {
    @apply w-0.24rem
    h-0.24rem
    flex
    justify-center
    items-center;

    background-color: black;

    .title {
      @include title-font-18;
      color: $text-high-color;
    }
  }
}
</style>
