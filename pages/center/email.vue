<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'

const userCookie = useCookie<Record<string, any>>('user')
const userInfo = ref<any>(userCookie.value || {})

const router = useRouter()

const email = ref(userInfo.value.email)

const onSubmit = async () => {
  if (!email.value || !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email.value)) {
    showToast('Email address format error')
    return
  }

  const { data } = await useHttpPost({
    url: '/customer/update',
    body: {
      ...userInfo.value,
      id: userInfo.value.userId,
      email: email.value
    },
    isLoading: true
  })
  if (!data.value) return
  userCookie.value = {
    ...userInfo.value,
    email: email.value
  }
  router.back()
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Email">
      <span @click="onSubmit">Save</span>
    </main-nav-bar>
    <div class="form">
      <van-field
        required="auto"
        v-model="email"
        clearable
        type="email"
        name="email"
        placeholder="Please enter"
        :border="false"
      >
        <template #button>
          <van-button size="small" type="primary">Send</van-button>
        </template>
      </van-field>
    </div>
    <div class="tips">
      Please confirm that you have provided the correct email address, otherwise the order may not
      be delivered correctly.
    </div>

    <copy-right />
  </div>
</template>

<style scoped lang="scss">
@import './style';
</style>
