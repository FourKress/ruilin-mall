<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'

const userCookie = useCookie<Record<string, any>>('user')
const userInfo = ref<any>(userCookie.value || {})

const router = useRouter()
const route = useRoute()

if (!userCookie.value) {
  router.push('/login?redirect=/')
}

const step = route.params.step as string
if (!step) {
  router.push('/center')
}

const email = ref(userInfo.value.email)
const newEmail = ref('')
const code = ref('')
const timer = ref<any>(null)

const countdown = ref(0)

const handleCountdown = () => {
  timer.value = setInterval(() => {
    const num = countdown.value - 1
    if (num <= 0) {
      countdown.value = 0
      handleClearInterval()
      timer.value = null
      return
    }
    countdown.value = num
  }, 1000)
}

if (step === '2') {
  countdown.value = 59
  handleCountdown()
}

const handleClearInterval = () => {
  if (timer.value) {
    clearInterval(timer.value)
    countdown.value = 0
  }
}

const onSubmit = async () => {
  if (!newEmail.value || !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(newEmail.value)) {
    showToast('Email address format error')
    return
  }

  const status = await handleCheckCode()
  if (!status) return

  const { data } = await useHttpPost({
    url: '/customer/update',
    body: {
      ...userInfo.value,
      id: userInfo.value.userId,
      email: newEmail.value
    },
    isLoading: true
  })
  if (!data.value) return
  userCookie.value = {
    ...userInfo.value,
    email: newEmail.value
  }
  await router.replace('/center')
}

const onSendEmail = async () => {
  const { data } = await useHttpPost({
    url: '/customer/sendModifyEmail',
    isLoading: true
  })
  if (!data.value) return
  await router.push('/center/email/2')
}

const onNext = async () => {
  const status = await handleCheckCode()
  if (!status) return
  await router.push('/center/email/3')
}

const handleCheckCode = async () => {
  const { data } = await useHttpPost({
    url: `/customer/checkCode`,
    body: {
      code: code.value,
      type: step === '2' ? 'modifyEmail' : 'newEmail'
    },
    isLoading: true
  })
  return data.value
}

const reSendCode = async () => {
  if (step === '3') {
    if (!newEmail.value || !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(newEmail.value)) {
      showToast('Email address format error')
      return
    }
  }

  const { data } = await useHttpPost({
    url: `/customer/${step === '3' ? 'sendNewEmail' : 'sendModifyEmail'}`,
    body: {
      email: newEmail.value
    },
    isLoading: true
  })
  if (!data.value) return
  countdown.value = 59
  handleCountdown()
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Email" />
    <div class="form">
      <van-field
        v-if="step === '1'"
        v-model="email"
        readonly
        clearable
        type="email"
        name="email"
        :border="false"
      >
      </van-field>
      <van-field
        v-if="step === '3'"
        v-model="newEmail"
        clearable
        type="email"
        name="email"
        placeholder="New email address"
        :border="false"
      >
      </van-field>
      <van-field
        v-if="['2', '3'].includes(step)"
        v-model="code"
        clearable
        type="number"
        name="code"
        placeholder="Enter a verification code"
        :border="false"
      >
        <template #button>
          <span class="send-btn" :class="countdown && 'disabled'" @click="reSendCode">{{
            countdown ? `${countdown}s resend` : 'Send Code'
          }}</span>
        </template>
      </van-field>
    </div>

    <div class="container">
      <div class="tips">
        Please confirm that you have provided the correct email address, otherwise the order may not
        be delivered correctly.
      </div>
      <div class="btn" v-if="step === '1'" @click="onSendEmail">Change Email</div>
      <div class="btn" v-if="step === '2'" @click="onNext">Next</div>
      <div class="btn" v-if="step === '3'" @click="onSubmit">Confirm</div>
    </div>

    <copy-right />
  </div>
</template>

<style scoped lang="scss">
@import '../style';
</style>
