<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'

const router = useRouter()

const userCookie = useCookie<Record<string, any>>('user')
if (!userCookie.value) {
  router.push('/login?redirect=/')
}
const userInfo = ref<Record<string, any>>(userCookie.value || {})
const address = ref(userInfo.value.address)

const onSubmit = async () => {
  if (!address.value) {
    showToast('Please enter Contact address')
    return
  }
  const { data } = await useHttpPost({
    url: '/customer/update',
    body: {
      ...userInfo.value,
      id: userInfo.value.userId,
      address: address.value
    },
    isLoading: true
  })
  if (!data.value) return
  userCookie.value = {
    ...userInfo.value,
    address: address.value
  }
  await router.replace('/center')
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Information" />

    <div class="form">
      <van-field v-model="address" clearable name="address" placeholder="Address" :border="false">
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
