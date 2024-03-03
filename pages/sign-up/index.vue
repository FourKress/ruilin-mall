<script setup lang="ts">
import type { FormInstance } from 'vant'
import md5 from 'md5'

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const firstPassword = ref('')
const secondPassword = ref('')
const formRef = ref<FormInstance>()

const checkPasswordLength = (val: string) => {
  if (val.length < 6) return false
  if (val.length > 10) return false
}

const handleCreate = () => {
  formRef.value?.submit()
}

const onSubmit = async (values: any) => {
  const { email, secondPassword, firstName, lastName } = values
  const { data } = await useFetch(`${baseUrl}/customer/register`, {
    method: 'post',
    body: {
      email,
      password: md5(secondPassword).substring(8, 26),
      nickname: `${firstName} ${lastName}`
    },
    transform: (res: any) => {
      return res.data
    }
  })
  const { token, ...other } = data.value
  localStorage.setItem('token', token)
  localStorage.setItem('userInfo', JSON.stringify(other))
  await router.push('/')
}
</script>

<template>
  <div class="sign-up">
    <div class="title">Sign Up</div>
    <div class="form">
      <van-form label-align="top" ref="formRef" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="firstName"
            name="firstName"
            label="First name"
            placeholder="Please enter"
            :border="false"
            :rules="[{ required: true, message: 'Please enter' }]"
          />
          <van-field
            v-model="lastName"
            name="lastName"
            label="Last name"
            placeholder="Please enter"
            :border="false"
            :rules="[{ required: true, message: 'Please enter' }]"
          />
          <van-field
            required="auto"
            v-model="email"
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
            v-model="firstPassword"
            type="password"
            maxlength="10"
            name="firstPassword"
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
          <van-field
            required="auto"
            v-model="secondPassword"
            type="password"
            maxlength="10"
            name="secondPassword"
            label="Password confirmation"
            placeholder="Please enter"
            :border="false"
            :rules="[
              { required: true, message: 'Please enter' },
              {
                validator: checkPasswordLength,
                message: 'Password length 6-10'
              },
              {
                validator: (val) => {
                  if (firstPassword !== val) return false
                },
                message: 'Passwords are inconsistent'
              }
            ]"
          />
        </van-cell-group>
      </van-form>

      <div class="btn-container">
        <div class="cancel btn">Cancel</div>
        <div class="create btn" @click="handleCreate">Create Account</div>
      </div>

      <div class="tips">
        Already have an account?<nuxt-link class="link" to="/login">Log in</nuxt-link>
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
      @apply h-0.48rem
      flex
      justify-center
      items-center
      rd-0.48rem;

      @include title-font-18;
      border: 2px solid $primary-color;
    }

    .cancel {
      @apply w-1.2rem;

      color: $primary-color;
    }

    .create {
      @apply w-2.14rem;
      background-color: $primary-color;
      color: $white-color;
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
