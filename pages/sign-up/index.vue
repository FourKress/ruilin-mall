<script setup lang="ts">
import type { FormInstance } from 'vant'
import md5 from 'md5'
import phoneCode from '~/utils/phoneCode'

const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseUrl

const tokenCookie = useCookie('token')
const userCookie = useCookie<Record<string, any>>('user')
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const firstPassword = ref('')
const secondPassword = ref('')
const phone = ref('')
const code = ref('+1')
const address = ref('')
const formRef = ref<FormInstance>()

const showPicker = ref(false)
const currentItem = ref([code.value])

const checkPasswordLength = (val: string) => {
  if (val.length < 6) return false
  if (val.length > 20) return false
}

const handleCreate = () => {
  formRef.value?.submit()
}

const onSubmit = async (values: any) => {
  const { email, secondPassword, firstName, lastName, phone = '', address = '', code = '' } = values
  const { data, error } = await useHttpPost({
    url: '/customer/register',
    body: {
      email,
      password: md5(secondPassword).substring(8, 26),
      nickname: `${firstName} ${lastName}`,
      code: code ? code.replace('+', '') : '',
      phone,
      address
    },
    isLoading: true
  })

  if (error.value) {
    return
  }

  if (data.value) {
    const { token, ...other } = data.value
    tokenCookie.value = token
    userCookie.value = other
    await router.push('/')
  }
}

const handleReset = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  firstPassword.value = ''
  secondPassword.value = ''
  formRef?.value?.resetValidation()
}

const onConfirm = ({ selectedOptions }: { selectedOptions: any[] }) => {
  showPicker.value = false
  code.value = `+${selectedOptions[0].code}`
}
</script>

<template>
  <div class="sign-up">
    <div class="title">Sign Up</div>
    <div class="form">
      <van-form label-align="top" ref="formRef" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            required="auto"
            v-model="firstName"
            clearable
            name="firstName"
            label="First name"
            placeholder="Please enter"
            :border="false"
            :rules="[{ required: true, message: 'Please enter' }]"
          />
          <van-field
            required="auto"
            v-model="lastName"
            clearable
            name="lastName"
            label="Last name"
            placeholder="Please enter"
            :border="false"
            :rules="[{ required: true, message: 'Please enter' }]"
          />
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
            v-model="firstPassword"
            clearable
            type="password"
            maxlength="20"
            name="firstPassword"
            label="Password"
            placeholder="Please enter"
            :border="false"
            :rules="[
              { required: true, message: 'Please choose' },
              {
                validator: checkPasswordLength,
                message: 'Password length is 6-20'
              }
            ]"
          />
          <van-field
            required="auto"
            v-model="secondPassword"
            clearable
            type="password"
            maxlength="20"
            name="secondPassword"
            label="Password confirmation"
            placeholder="Please enter"
            :border="false"
            :rules="[
              { required: true, message: 'Please enter' },
              {
                validator: checkPasswordLength,
                message: 'Password length is 6-20'
              },
              {
                validator: (val) => {
                  if (firstPassword !== val) return false
                },
                message: 'Passwords are inconsistent'
              }
            ]"
          />

          <van-field
            required="auto"
            v-model="code"
            readonly
            clearable
            name="code"
            label="Phone code"
            placeholder="Please enter"
            :border="false"
            @click="showPicker = true"
          />

          <van-field
            required="auto"
            v-model="phone"
            clearable
            name="phone"
            label="Phone number"
            placeholder="Please enter"
            :border="false"
          />

          <van-field
            required="auto"
            v-model="address"
            clearable
            name="address"
            label="Contact address"
            placeholder="Please enter"
            :border="false"
          />
        </van-cell-group>
      </van-form>

      <div class="btn-container">
        <div class="cancel btn" @click="handleReset">Cancel</div>
        <van-button
          loading-text="Create Account..."
          type="primary"
          class="create btn"
          @click="handleCreate"
          >Create Account</van-button
        >
      </div>

      <div class="tips">
        Already have an account?<nuxt-link class="link" to="/login?redirect=/">Log in</nuxt-link>
      </div>
    </div>

    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        v-model="currentItem"
        :columns="phoneCode"
        :columns-field-names="{ text: 'name', value: 'code' }"
        confirm-button-text="Confirm"
        cancel-button-text="Cancel"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
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
    font-family: 'Sinerva', Arial, sans-serif;
    transform: translateY(0.05rem);
  }

  :deep(.van-cell-group) {
    margin: 0;

    .van-cell {
      padding: 0 0 10px 0;
    }

    .van-cell__value {
      width: 100%;
    }

    .van-field__body {
      height: 0.4rem;
      border: 1px solid #c5b19b;
      padding: 0 0.1rem;
      border-radius: 0.04rem;
    }

    .van-cell__title {
      flex: none !important;

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
