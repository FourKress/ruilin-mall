<script setup lang="ts">
import { ref, Transition } from 'vue'

const drawerStatus = ref(false)

const handleSwitchDrawerStatus = () => {
  drawerStatus.value = !drawerStatus.value
}

const list = ref<any[]>([
  {
    label: 'Log in/Sign up',
    link: ''
  },
  {
    label: 'Home',
    link: ''
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
    label: 'Customer service'
  },
  {
    label: 'Customer Support',
    btnIcon: '',
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
    <div class="logo">
      <img src="" alt="" />
    </div>
    <div class="right">
      <div class="badge">
        <div class="count">99</div>
      </div>
    </div>

    <Transition name="fade" :duration="0.5">
      <div class="drawer" v-if="drawerStatus">
        <div class="menu">
          <div class="menu-item" v-for="(item, index) in list" :key="index">
            <div class="top">
              <span class="label">{{ item.label }}</span>
              <span class="btn" v-if="!item.children"></span>
            </div>
            <div class="list">
              <div class="row" v-for="row in item.children" :key="item.link">
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
  h-64px
  flex
  justify-between
  items-center;
  padding: 0 16px;

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

    .badge {
      @apply absolute
      left--0.14rem
      top--0.05rem
      min-w-0.15rem
      h-0.19rem
      p-1PX
      overflow-hidden;

      background-color: $white-color;

      .count {
        @apply p-0.04rem
        p-y-0
        h-full
        text-center;

        background-color: $red-color;
        color: $white-color;

        @include english-font;
        @include primary-font-12;

        border-radius: 8px;
      }

      border: 1px solid rgba(216, 70, 57, 0.2);
      border-radius: 8px;
    }
  }

  .logo {
    @apply w-80px
    h-40px;

    img {
      @apply block
      w-full
      h-full;

      background-color: red;
    }
  }

  .drawer {
    @apply fixed
    w-screen
    h-full
    left-0
    top-0.64rem;

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
    transform: translateX(20px);
    opacity: 0;
  }
}
</style>
