<script setup lang="ts">
import { useInfoStore } from '~/stores'

const route = useRoute()

const mallInfo = computed(() => useInfoStore().details)

const { data: aboutDetails } = await useHttpGet({
  url: `/about/details/`
})
</script>

<template>
  <div class="about-details-page">
    <div class="container" v-html="aboutDetails.content"></div>
    <div class="row">
      <div class="label">Phone</div>
      <div class="value">{{ mallInfo['phone'] }}</div>
    </div>
    <div class="row">
      <div class="label">Email</div>
      <div class="value">{{ mallInfo['email'] }}</div>
    </div>
    <div class="row">
      <div class="label">Address</div>
      <div class="value">{{ mallInfo['address'] }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-details-page {
  @apply p-0.16rem;

  background-color: $white-color;

  .container {
    @apply m-b-0.16rem;
  }

  .row {
    @apply w-full
    flex
    flex-col
    items-start
    m-b-0.16rem
    rd-0.08rem
    p-y-0.08rem
    px-0.16rem;

    border: 1px solid $border-color;

    color: $text-high-color;

    .label {
      @include primary-font-16;
      padding-bottom: 0.04rem;
    }

    .value {
      @include general-font-14;
    }

    &:last-child {
      @apply m-0;
    }
  }
}
</style>
