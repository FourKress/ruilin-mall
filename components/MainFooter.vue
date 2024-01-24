<script setup lang="ts">
import { ref } from 'vue'
import { Transition } from 'vue'
const active = ref<number>(-1)

const router = useRouter()
const route = useRoute()

const handleActive = (link: string, index: number) => {
  if (link) {
    if (route.path === link) {
      return location.reload()
    }
    return router.push(link)
  }
  active.value = active.value === index ? -1 : index
}

const list = ref<any[]>([
  {
    label: 'Home',
    link: '/'
  },
  {
    label: 'Product',
    children: [
      {
        label: 'Tape-in Extension    ',
        link: ''
      },
      {
        label: 'Prebonded Tips',
        link: ''
      },
      {
        label: 'Hair Weft',
        link: ''
      },
      {
        label: 'Clip-in',
        link: ''
      },
      {
        label: 'Hair Accessories',
        link: ''
      }
    ]
  },
  {
    label: 'Customer service',
    link: ''
  },
  {
    label: 'Customer Support',
    children: [
      {
        label: 'FAQ',
        link: ''
      },
      {
        label: 'Blog',
        link: ''
      },
      {
        label: 'About Us',
        link: ''
      },
      {
        label: 'Contact Us',
        link: ''
      }
    ]
  }
])
</script>

<template>
  <div class="main-footer">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="top" @click="handleActive(item.link, index)">
        <span class="label">{{ item.label }}</span>
        <span class="btn"></span>
      </div>
      <Transition name="fade" :duration="0.5">
        <div class="list" v-show="active === index">
          <div class="row" v-for="row in item.children" :key="item.link">{{ row.label }}</div>
        </div>
      </Transition>
    </div>

    <div class="copy-right">COPYRIGHT 2024 QINGDAO RUI LIN HAIR <br />ALL RIGHTS RESERVED</div>
  </div>
</template>

<style scoped lang="scss">
.main-footer {
  @apply w-screen
  min-h-2.9rem
  p-0.16rem;

  background-color: rgba(198, 156, 109, 0.3);

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

      .btn {
        @apply w-0.14rem
        h-0.14rem
        cursor-pointer;

        background-color: red;
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

  .copy-right {
    @apply p-t-0.16rem;

    @include general-font-loose-12;
    @include english-font;
    color: #a5927c;
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: translateX(0.2rem);
    opacity: 0;
  }
}
</style>
