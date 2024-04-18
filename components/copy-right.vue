<script setup lang="ts">
import { useInfoStore } from '~/stores'

const mallInfo = computed(() => useInfoStore().details)
</script>

<template>
  <div class="copy-right">COPYRIGHT 2024 {{ mallInfo.name }} <br />ALL RIGHTS RESERVED</div>
</template>

<style scoped lang="scss">
.copy-right {
  @apply p-0.16rem;

  @include general-font-loose-12;
  @include english-font;
  color: $text-low-color;

  background-color: #dee3e8;
}
</style>
