<script setup lang="ts"></script>

<template>
  <div class="pay-page">
    <div class="a1">中文</div>
    <div class="b2">name</div>
    <div class="c3">1222</div>
  </div>
</template>

<style scoped lang="scss">
@use 'style';

.pay-page {
  .a1 {
    color: red;
    @include chinese-font;
    @include primary-font-16;
  }

  .b2 {
    @include english-font;
    @include primary-font-16;
  }

  .c3 {
    @include number-font;
    @include primary-font-16;
  }
}
</style>
