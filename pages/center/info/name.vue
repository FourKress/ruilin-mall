<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'

const router = useRouter()

const userCookie = useCookie<Record<string, any>>('user')
if (!userCookie.value) {
  router.push('/login?redirect=/')
}
const userInfo = ref<Record<string, any>>(userCookie.value || {})
const nicknameStr = userInfo.value.nickname.split(' ')
const firstName = ref(nicknameStr[0])
const lastName = ref(nicknameStr[1])

const onSubmit = async () => {
  if (!firstName.value || !lastName.value) {
    showToast('Please enter firstname and lastname')
    return
  }
  const nicknameStr = `${firstName.value} ${lastName.value}`
  const { data } = await useHttpPost({
    url: '/customer/update',
    body: {
      ...userInfo.value,
      id: userInfo.value.userId,
      nickname: nicknameStr
    },
    isLoading: true
  })
  if (!data.value) return
  userCookie.value = {
    ...userInfo.value,
    nickname: nicknameStr
  }
  await router.replace('/center')
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Information" />

    <div class="form">
      <van-field
        v-model="firstName"
        clearable
        name="firstName"
        placeholder="first name"
        :border="false"
      >
      </van-field>
      <van-field
        v-model="lastName"
        clearable
        name="lastName"
        placeholder="last name"
        :border="false"
      >
      </van-field>
    </div>

    <div class="container">
      <div class="btn" @click="onSubmit">Confirm</div>
    </div>
    <copy-right />
  </div>
</template>

<style scoped lang="scss">
@import '../style';
</style>
