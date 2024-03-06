<script setup lang="ts">
import type { FormInstance } from 'vant'
import md5 from 'md5'

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const tokenCookie = useCookie('token')
const userCookie = useCookie<Record<string, any>>('user')
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const formRef = ref<FormInstance>()
const isLoading = ref(false)

const checkPasswordLength = (val: string) => {
  if (val.length < 6) return false
  if (val.length > 10) return false
}

const handleLogin = () => {
  formRef.value?.submit()
}

const onSubmit = async (values: any) => {
  const { email, password } = values
  isLoading.value = true
  const { data } = await useHttpPost({
    url: '/auth/customer/login',
    body: {
      username: email,
      password: md5(password).substring(8, 26)
    }
  })
  const { token, ...other } = data.value

  tokenCookie.value = token
  userCookie.value = other
  isLoading.value = false
  const redirect = route.query?.redirect as string | undefined
  if (redirect) {
    await router.push(redirect)
  } else {
    router.back()
  }
}
</script>

<template>
  <div class="sign-up">
    <div class="title">Log in</div>
    <div class="form">
      <van-form label-align="top" ref="formRef" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            required="auto"
            v-model="email"
            clearable
            type="email"
            name="email"
            label="Email address"
            placeholder="Please enter"
            :border="false"
            :rules="[
              { required: true, message: 'Please enter' },
              {
                validator: (val) => {
                  return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val)
                },
                message: 'Email address format error'
              }
            ]"
          />
          <van-field
            required="auto"
            v-model="password"
            clearable
            type="password"
            maxlength="10"
            name="password"
            label="Password"
            placeholder="Please enter"
            :border="false"
            :rules="[
              { required: true, message: 'Please enter' },
              {
                validator: checkPasswordLength,
                message: 'Password length 6-10'
              }
            ]"
          />
        </van-cell-group>
      </van-form>

      <div class="btn-container">
        <van-button
          :loading="isLoading"
          loading-text="Log in..."
          type="primary"
          class="btn"
          @click="handleLogin"
          >Log in</van-button
        >
      </div>

      <div class="tips">
        Don't have an account?<nuxt-link class="link" to="/sign-up">Sign up</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sign-up {
  @apply p-x-0.16rem;
  background-color: $white-color;

  .title {
    @apply p-t-0.32rem
    p-b-0.22rem;

    @include title-font-26;
    color: $text-high-color;
  }

  ::v-deep .van-cell-group {
    margin: 0;

    .van-cell {
      padding: 0 0 10px 0;
    }

    .van-field__body {
      height: 0.4rem;
      border: 1px solid #c5b19b;
      padding: 0 0.1rem;
      border-radius: 0.04rem;
    }

    .van-cell__title {
      label {
        @include general-font-14;
        color: $text-high-color;
      }
    }
  }

  .btn-container {
    @apply m-t-0.22rem
    flex
    justify-between;

    .btn {
      @apply w-full
      h-0.48rem
      flex
      justify-center
      items-center
      rd-0.48rem;

      background-color: $primary-color;
      color: $white-color;

      @include title-font-18;
      border: 2px solid $primary-color;
    }
  }

  .tips {
    @apply m-y-0.32rem
    text-center;

    @include primary-font-16;
    color: $text-high-color;

    .link {
      color: $primary-color;
      text-decoration: underline;
      text-underline-offset: 0.03rem;
      padding-left: 0.06rem;
    }
  }
}
</style>
