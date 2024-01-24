<script setup lang="ts">
import { ref, Transition, defineEmits } from 'vue'

const router = useRouter()
const route = useRoute()

const emits = defineEmits<{
  openModal: [status: boolean]
}>()

const drawerStatus = ref(false)

const handleSwitchDrawerStatus = () => {
  const status = !drawerStatus.value
  emits('openModal', status)
  drawerStatus.value = status
}

const handleJumpMenu = (link: string) => {
  if (link) {
    handleSwitchDrawerStatus()
    if (route.path === link) {
      return location.reload()
    }
    return router.push(link)
  }
}

const list = ref<any[]>([
  {
    label: 'Log in/Sign up',
    link: ''
  },
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
        label: 'Contact us',
        link: ''
      }
    ]
  }
])
</script>

<template>
  <div class="main-header">
    <div class="left" @click="handleSwitchDrawerStatus"></div>
    <div class="logo" @click="handleJumpMenu('/')">
      <img src="~/assets/images/Logo.png" alt="" />
    </div>
    <van-badge :content="10" max="99" position="top-left">
      <div class="right"></div>
    </van-badge>

    <Transition name="fade" :duration="0.5">
      <div class="drawer" v-if="drawerStatus">
        <div class="menu">
          <div class="menu-item" v-for="(item, index) in list" :key="index">
            <div class="top" @click="handleJumpMenu(item.link)">
              <span class="label">{{ item.label }}</span>
              <span class="btn" v-if="!item.children"></span>
            </div>
            <div class="list">
              <div
                class="row"
                v-for="row in item.children"
                :key="item.link"
                @click="handleJumpMenu(row.link)"
              >
                <span class="label">{{ row.label }}</span>
                <span class="btn"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.main-header {
  @apply w-screen
  h-0.64rem
  flex
  justify-between
  items-center
  p-x-0.16rem;

  background-color: $white-color;

  .left,
  .right {
    @apply w-0.24rem
    h-0.24rem
    cursor-pointer;

    background-color: black;
  }

  .right {
    @apply relative;
  }

  .logo {
    @apply w-0.8rem
    h-0.4rem;

    img {
      @apply block
      w-full
      h-full;
    }
  }

  .drawer {
    @apply fixed
    w-screen
    h-full
    left-0
    top-0.64rem
    z-99;

    padding-bottom: env(safe-area-inset-bottom);

    transition: all 0.5s;

    .menu {
      @apply p-0.16rem overflow-y-auto;

      height: calc(100% - 0.64rem);

      background-color: $white-color;

      .menu-item {
        @apply w-full
        min-h-0.6rem;

        border-bottom: 1px solid $border-color;

        &:last-child {
          border-bottom: none;
        }

        .top {
          @apply w-full
          h-0.60rem
          flex
          justify-between
          items-center;

          color: $text-high-color;

          .label {
            @include primary-font-14;
            @include english-font;
          }

          .btn {
            @apply w-0.16rem
            h-0.16rem
            cursor-pointer;

            background-color: red;
          }
        }

        .list {
          @apply w-full;

          .row {
            @apply w-full
            h-0.48rem
            flex
            justify-between
            items-center;

            @include general-font-loose-14;
            @include english-font;

            color: $text-high-color;
          }
        }
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
