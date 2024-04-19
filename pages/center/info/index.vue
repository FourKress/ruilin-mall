<script setup lang="ts">
import CopyRight from '~/components/copy-right.vue'
import phoneCode from '~/utils/phoneCode'

const router = useRouter()

const userCookie = useCookie<Record<string, any>>('user')
if (!userCookie.value) {
  router.push('/login?redirect=/')
}
const userInfo = ref<any>(userCookie.value || {})

const nicknameStr = userInfo.value.nickname.split(' ')
const firstName = ref(nicknameStr[0])
const lastName = ref(nicknameStr[1])
const address1 = ref(userInfo.value.address1)
const address2 = ref(userInfo.value.address2)
const city = ref(userInfo.value.city)
const country = ref(userInfo.value.country)
const postalCode = ref(userInfo.value.postalCode)

const showPicker = ref(false)
const currentItem = ref([country.value])

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
      nickname: nicknameStr,
      address1: address1.value,
      address2: address2.value,
      city: city.value,
      country: country.value,
      postalCode: postalCode.value
    },
    isLoading: true
  })
  if (!data.value) return
  userCookie.value = {
    ...userInfo.value,
    nickname: nicknameStr,
    address1: address1.value,
    address2: address2.value,
    city: city.value,
    country: country.value,
    postalCode: postalCode.value
  }
  await router.replace('/center')
}

const onConfirm = ({ selectedOptions }: { selectedOptions: any[] }) => {
  showPicker.value = false
  country.value = selectedOptions[0].name
}
</script>

<template>
  <div class="modify-page">
    <main-nav-bar title="Information" />

    <div class="row-container">
      <div class="row">
        <span class="label">Password</span>
        <nuxt-link class="value" to="/center/info/password">
          <span>************</span>
          <van-icon name="arrow" />
        </nuxt-link>
      </div>

      <div class="row">
        <span class="label" style="margin-top: 0.4rem">First Name</span>
        <van-field
          class="value"
          v-model="firstName"
          clearable
          name="firstName"
          placeholder="Please enter"
          :border="false"
        />
      </div>
      <div class="row">
        <span class="label">Last Name</span>
        <van-field
          class="value"
          v-model="lastName"
          clearable
          name="lastName"
          placeholder="Please enter"
          :border="false"
        />
      </div>
      <div class="row">
        <span class="label">Address1</span>
        <van-field
          class="value"
          v-model="address1"
          clearable
          name="address1"
          placeholder="Please enter"
          :border="false"
        />
      </div>
      <div class="row">
        <span class="label">Address2</span>
        <van-field
          class="value"
          v-model="address2"
          clearable
          name="address2"
          placeholder="Please enter"
          :border="false"
        />
      </div>
      <div class="row">
        <span class="label">City</span>
        <van-field
          class="value"
          v-model="city"
          clearable
          name="city"
          placeholder="Please enter"
          :border="false"
        />
      </div>
      <div class="row">
        <span class="label">Country</span>
        <van-field
          class="value"
          v-model="country"
          clearable
          name="country"
          placeholder="Please enter"
          :border="false"
          readonly
          @click="showPicker = true"
        />
      </div>

      <div class="row">
        <span class="label">Postal/Zip Code</span>
        <van-field
          class="value"
          v-model="postalCode"
          clearable
          name="postalCode"
          placeholder="Please enter"
          :border="false"
        />
      </div>
    </div>

    <div class="btn" @click="onSubmit">UPDATE ADDRESS</div>

    <copy-right />

    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        v-model="currentItem"
        :columns="phoneCode"
        :columns-field-names="{ text: 'name', value: 'name' }"
        confirm-button-text="Confirm"
        cancel-button-text="Cancel"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
.modify-page {
  @apply w-full
  flex-1
  flex
  flex-col
  justify-between;

  background-color: $view-color;

  .row-container {
    @apply w-full;

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
  }

  .btn {
    @apply h-0.48rem
    m-x-0.16rem
    flex
    justify-center
    items-center
    rd-0.48rem
    m-y-0.4rem;

    background-color: transparent;
    color: $primary-color;

    @include title-font-18;
    border: 2px solid $primary-color;
  }
}
</style>
