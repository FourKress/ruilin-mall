<script setup lang="ts"></script>

<template>
  <div class="enter">
    <div class="container">
      <div class="title">RuiLin Hair</div>
      <div class="info">
        Company introduction, brand introduction.Company introduction, brand introduction.Company
        introduction, brand introduction.Company introduction.
      </div>
      <div class="btn-container">
        <nuxt-link class="create btn" to="/sign-up">Sign up</nuxt-link>
        <nuxt-link class="login btn" to="/login">Log in</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.enter {
  @apply h-full
  flex-1
  flex
  flex-col;

  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('@/assets/images/bg.png');

  .container {
    @apply w-full
    h-full
    p-x-0.16rem
    flex-1;

    background-color: rgba(16, 16, 16, 0.8);

    .title {
      @apply p-t-0.32rem
      p-b-0.16rem;

      @include title-font-26;
      color: $white-color;
    }

    .info {
      @include general-font-loose-14;
      color: $white-color;
    }

    .btn-container {
      .btn {
        @apply h-0.48rem
        w-full
        flex
        justify-center
        items-center
        rd-0.48rem
        m-t-0.32rem;

        @include title-font-18;
        border: 2px solid $primary-color;
      }

      .login {
        color: $primary-color;
        background-color: transparent;
      }

      .create {
        background-color: $primary-color;
        color: $white-color;
      }
    }
  }
}
</style>
