<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'
import md5 from 'md5'

const router = useRouter()

const tokenCookie = useCookie('token')
const userCookie = useCookie<Record<string, any>>('user')

if (!userCookie.value) {
  router.push('/login?redirect=/')
}
const userInfo = ref<Record<string, any>>(userCookie.value || {})

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const checkPasswordLength = (val: string) => {
  if (val.length < 6) return false
  if (val.length > 20) return false
}

const onSubmit = async () => {
  if (!oldPassword.value && !checkPasswordLength(oldPassword.value)) {
    return showToast('Password length is 6-20')
  }
  if (!newPassword.value && !checkPasswordLength(newPassword.value)) {
    return showToast('Password length is 6-20')
  }
  if (!confirmPassword.value && !checkPasswordLength(confirmPassword.value)) {
    return showToast('Password length is 6-20')
  }
  if (newPassword.value !== confirmPassword.value) {
    return showToast('Passwords are inconsistent')
  }

  const { data } = await useHttpPost({
    url: '/customer/modifyPwd',
    body: {
      id: userInfo.value.userId,
      oldPassword: md5(oldPassword.value).substring(8, 26),
      password: md5(confirmPassword.value).substring(8, 26)
    },
    isLoading: true
  })
  if (!data.value) return
  await handleLogOut()
}

const handleLogOut = async () => {
  if (!userCookie.value) return
  await useHttpGet({ url: `/auth/customer/logout/${userInfo.value.userId}`, isLoading: true })
  tokenCookie.value = undefined
  userCookie.value = {}
  await router.push('/login?redirect=/')
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Information" />

    <div class="row-container">
      <div class="row">
        <span class="label">Current password</span>
        <van-field
          class="value"
          v-model="oldPassword"
          clearable
          type="password"
          maxlength="20"
          name="oldPassword"
          placeholder="Please enter"
          :border="false"
        >
        </van-field>
      </div>

      <div class="row">
        <span class="label" style="margin-top: 0.4rem">New password</span>
        <van-field
          class="value"
          v-model="newPassword"
          clearable
          type="password"
          maxlength="20"
          :readonly="!oldPassword"
          name="newPassword"
          placeholder="Please enter"
          :border="false"
        >
        </van-field>
      </div>

      <div class="row">
        <span class="label">Password confirmation</span>
        <van-field
          class="value"
          v-model="confirmPassword"
          clearable
          maxlength="20"
          type="password"
          :readonly="!oldPassword"
          name="confirmPassword"
          placeholder="Please enter"
          :border="false"
        >
        </van-field>
      </div>
    </div>

    <div class="container">
      <div class="btn" @click="onSubmit">Confirm</div>
    </div>
    <copy-right />
  </div>
</template>

<style scoped lang="scss">
@import '../style';

.row {
  @apply w-full
  flex
  flex-col
  justify-start
  items-start;

  .label {
    @apply p-x-0.16rem
    m-b-0.08rem
    m-t-0.16rem;

    @include primary-font-16;
    color: $text-mid-color;
    font-weight: normal;
  }

  .value {
    @apply w-full
    min-h-0.64rem
    flex
    justify-between
    items-center
    p-x-0.16rem;

    text-align: right;
    @include general-font-14;
    color: $text-high-color;

    background-color: $white-color;
  }

  .van-icon {
    color: $text-high-color;
  }
}
</style>
