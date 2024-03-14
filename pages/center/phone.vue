<script setup lang="ts">
import phoneCode from '~/utils/phoneCode'
import CopyRight from '~/components/copy-right.vue'

const userCookie = useCookie<Record<string, any>>('user')
const userInfo = ref<any>(userCookie.value || {})

const phone = ref(userInfo.value.phone)
const code = ref(userInfo.value.code || '1')

const router = useRouter()

const showPicker = ref(false)
const currentItem = ref([code.value])

const onSubmit = async () => {
  const { data } = await useHttpPost({
    url: '/customer/update',
    body: {
      ...userInfo.value,
      id: userInfo.value.userId,
      phone: phone.value,
      code: code.value
    },
    isLoading: true
  })
  if (!data.value) return
  userCookie.value = {
    ...userInfo.value,
    phone: phone.value,
    code: code.value
  }
  router.back()
}

const onConfirm = ({ selectedOptions }: { selectedOptions: any[] }) => {
  showPicker.value = false
  code.value = selectedOptions[0].code
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Phone">
      <span @click="onSubmit">Save</span>
    </main-nav-bar>

    <div class="form">
      <div class="select">
        <span>+</span>
        <span>{{ code }}</span>
        <van-icon name="arrow-down" @click="showPicker = true" />
      </div>
      <van-field
        required="auto"
        v-model="phone"
        clearable
        maxlength="15"
        type="number"
        name="phone"
        placeholder="Please enter"
        :border="false"
      />
    </div>

    <div class="tips">
      Please confirm that you have provided the correct phone number, otherwise the order may not be
      delivered correctly.
    </div>

    <copy-right />

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
@import './style';

.form {
  @apply flex
  justify-between
  items-center;

  background-color: $white-color;

  .select {
    @apply min-w-0.95rem
    text-center;

    .van-icon {
      padding-left: 0.06rem;
    }
  }
}
</style>
