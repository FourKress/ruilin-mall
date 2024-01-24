<script setup lang="ts">
import { MainFooter, MainHeader } from '#components'
</script>

<template>
  <div class="warp">
    <div class="header">
      <main-header />
    </div>
    <div class="main">
      <slot />
    </div>
    <div class="footer">
      <main-footer />
    </div>
  </div>
</template>

<style scoped></style>
