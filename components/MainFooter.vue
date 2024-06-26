<script setup lang="ts">
import { menuConfig } from '~/utils/menuConfig'
import { useProductStore } from '~/stores'
import CopyRight from '~/components/copy-right.vue'

const productList = useProductStore().productList

const active = ref<number>(-1)

const router = useRouter()
const route = useRoute()

const handleActive = (link: string, index: number) => {
  if (link) {
    active.value = -1
    if (route.path === link) {
      return location.reload()
    }
    return router.push(link)
  }
  active.value = active.value === index ? -1 : index
}

const menuList = ref<any[]>(
  menuConfig.map((d) => {
    if (d.label === 'Products') {
      d.children = productList.map((d: any) => ({ label: d.name, link: `/product/${d.id}` }))
    }
    return d
  })
)
</script>

<template>
  <div class="main-footer">
    <div class="item" v-for="(item, index) in menuList" :key="index">
      <div class="top" @click="handleActive(item.link, index)">
        <span class="label">{{ item.label }}</span>
        <van-icon :name="active === index ? 'cross' : 'plus'" />
      </div>
      <Transition name="fade" :duration="0.5">
        <div class="list" v-show="active === index">
          <div
            class="row"
            v-for="row in item.children"
            :key="item.link"
            @click="handleActive(row.link, index)"
          >
            {{ row.label }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
  <copy-right />
</template>

<style scoped lang="scss">
.main-footer {
  @apply w-screen
  min-h-1.68rem
  p-0.16rem;

  padding-bottom: env(safe-area-inset-bottom);

  background-color: #dee3e8;

  .item {
    @apply w-full
    min-h-0.50rem;

    border-bottom: 1px solid #c5b19b;

    .top {
      @apply w-full
      h-0.50rem
      flex
      justify-between
      items-center;

      color: $text-high-color;

      .label {
        @include primary-font-14;
        @include english-font;
      }
    }

    .list {
      @apply w-full;

      transition: all 1s;

      .row {
        @apply m-b-0.18rem;

        @include general-font-14;
        @include english-font;

        color: $text-high-color;
      }
    }
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: translateX(0.2rem);
    opacity: 0;
  }
}
</style>
