<script setup lang="ts">
import { menuConfig } from '~/utils/menuConfig'

import { useProductStore, useCartStore } from '~/stores'

const cartCount = computed(() => useCartStore().getCartCount())

const productList = useProductStore().productList

const router = useRouter()
const route = useRoute()
const tokenCookie = useCookie('token')

const emits = defineEmits<{
  openModal: [status: boolean]
}>()

const drawerStatus = ref(false)
const openShoppingCart = ref(false)

const menuList = ref<any[]>([])

if (tokenCookie.value) {
  await useCartStore().getFetchCartList()
} else {
  useCartStore().clear()
}

const handleInitData = async () => {
  if (tokenCookie.value) {
    await useCartStore().getFetchCartList()
  } else {
    useCartStore().clear()
  }
  menuList.value = [
    ...[
      tokenCookie.value
        ? {
            label: 'Account',
            link: '/center'
          }
        : {
            label: 'Log in/Sign up',
            link: '/enter'
          }
    ],
    ...menuConfig.map((d) => {
      if (d.label === 'Products') {
        d.children = productList.map((d: any) => ({ label: d.name, link: `/product/${d.id}` }))
      }
      return d
    })
  ]
}

await handleInitData()

watch([tokenCookie], async () => {
  await handleInitData()
})

watch(
  () => router.currentRoute.value.path,
  () => {
    openShoppingCart.value = false
    drawerStatus.value = false
  },
  { immediate: true, deep: true }
)

const handleSwitchDrawerStatus = (status = !drawerStatus.value) => {
  emits('openModal', status)
  drawerStatus.value = status
}

const handleJumpMenu = async (link: string) => {
  if (link) {
    if (route.path === link) {
      return location.reload()
    }
    await router.push(link)
  }
  handleSwitchDrawerStatus(false)
}

const handleSwitchShoppingCart = (status: boolean) => {
  handleSwitchDrawerStatus(false)
  openShoppingCart.value = status
}
</script>

<template>
  <div class="main-header">
    <div class="left" @click="handleSwitchDrawerStatus()"></div>
    <div class="logo" @click="handleJumpMenu('/')">
      <img src="~/assets/images/Logo.png" alt="" />
    </div>
    <van-badge :content="cartCount" max="99" :show-zero="false" position="top-left">
      <div class="right" @click="handleSwitchShoppingCart(true)"></div>
    </van-badge>

    <Transition name="fade" :duration="0.5">
      <div class="drawer" v-if="drawerStatus">
        <div class="menu">
          <div class="menu-item" v-for="(item, index) in menuList" :key="index">
            <div class="top" @click="handleJumpMenu(item.link)">
              <span class="label">{{ item.label }}</span>
              <van-icon name="arrow" v-if="!item.children" />
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

    <Transition name="fade" :duration="0.5">
      <ShoppingCart v-if="openShoppingCart" @close="handleSwitchShoppingCart(false)" />
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
  p-x-0.16rem
  fixed
  left-0
  top-0
  z-99;

  background-color: $white-color;

  .left,
  .right {
    @apply w-0.24rem
    h-0.24rem
    cursor-pointer;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .left {
    background-image: url('@/assets/images/menu.png');
  }

  .right {
    @apply relative;

    background-image: url('@/assets/images/car.png');
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
      @apply p-0.16rem overflow-y-auto pt-0;

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
