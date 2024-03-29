<script setup lang="ts">
import { handleFileUpdate } from '~/utils/upload'

const router = useRouter()
const route = useRoute()

const { id } = route.params
if (!id) {
  router.push('/')
}

const startValue = ref(5)
const content = ref('')
const fileList = ref<any[]>([])

const { data: skuInfo } = await useHttpGet({
  url: `/order/orderSkuDetail/${id}`
})

const handleConfirm = async () => {
  console.log(startValue.value)
  console.log(content.value)
  console.log(fileList.value)
  if (!content.value) {
    showToast('Please fill in the comments')
    return
  }

  let objectKeys: any[] = []
  if (fileList.value) {
    objectKeys = await Promise.all(
      fileList.value.map(async (f) => {
        return await handleFileUpdate(f.file)
      })
    )
  }

  const { data } = await useHttpPost({
    url: `/review/online-create`,
    body: {
      orderProductId: id,
      content: content.value,
      score: startValue.value,
      objectKeys: objectKeys
    }
  })

  if (data.value) {
    router.back()
  }
}

const handleCancel = () => {
  router.back()
}

const afterRead = (file: any) => {}

const onOversize = () => {
  showToast('Image size cannot exceed 10mb')
}
</script>

<template>
  <div class="review-page">
    <main-nav-bar title="Review" />

    <div class="container">
      <div class="card info">
        <div class="panel">
          <div class="pic">
            <img :src="skuInfo.url" alt="" />
          </div>
          <div class="info-container">
            <div class="info-title">
              <span class="name">{{ skuInfo['colorName'] }}</span>
            </div>
            <div class="tips">
              <span>{{ skuInfo['tagNameStr'] }}&nbsp;</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card form">
        <div class="start">
          <span class="label">Score</span>
          <van-rate v-model="startValue" />
        </div>

        <div class="content">
          <van-field
            v-model="content"
            clearable
            rows="10"
            type="textarea"
            name="content"
            placeholder="Say something"
            :border="false"
          >
          </van-field>
        </div>

        <div class="img-warp">
          <van-uploader
            v-model="fileList"
            :after-read="afterRead"
            :max-count="9"
            :max-size="1024 * 1024"
            @oversize="onOversize"
          >
            <div class="upload-btn">
              <img src="~/assets/images/camera.png" alt="" />
              <span>Add Image</span>
            </div>
          </van-uploader>
        </div>
      </div>
    </div>

    <div class="btn-list">
      <div class="btn" @click="handleCancel">Cancel</div>
      <div class="btn" @click="handleConfirm">Submit</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.review-page {
  @apply w-full
  flex-1;

  background-color: $view-color;

  .container {
    @apply p-0.16rem;

    .card {
      @apply rd-0.08rem
      p-x-0.16rem
      m-b-0.16rem;

      background-color: $white-color;
    }

    .info {
      .panel {
        @apply w-full
        h-0.92rem
        p-y-0.16rem
        flex
        justify-between
        items-start;

        .pic {
          @apply w-0.6rem
          h-0.6rem
          m-r-0.08rem
          rd-0.04rem
          overflow-hidden;

          img {
            @apply block
            w-full
            h-full;
          }
        }

        .info-container {
          @apply flex-1
          h-full
          flex
          flex-col
          justify-between
          overflow-hidden;

          .info-title {
            @apply w-full
            h-0.22rem
            overflow-hidden
            text-ellipsis
            flex
            justify-between
            items-center;

            @include title-font-18;
            color: $text-high-color;

            .name {
              @apply flex-1
              overflow-hidden
              text-ellipsis
              p-r-0.08rem;

              white-space: nowrap;
            }
          }

          .tips {
            @apply w-auto
            max-w-full
            h-0.2rem
            m-t-0.08rem
            flex
            justify-between
            items-center;

            white-space: nowrap;

            @include general-font-14;

            color: $text-low-color;
          }
        }
      }
    }

    .form {
      .start {
        @apply w-full
        h-0.6rem
        flex
        justify-between
        items-center;

        .label {
          @include primary-font-16;
          color: $text-high-color;
        }
      }

      .content {
        @apply h-1.6rem
        rd-0.06rem
        p-0.16rem
        overflow-hidden;

        background-color: #f5f5f5;

        :deep(.van-field) {
          background-color: transparent;
          padding: 0;
          height: 100% !important;
        }

        :deep(.van-field__control) {
          height: 100% !important;
          @include general-font-loose-14;
          color: $text-high-color;

          &::placeholder {
            color: #9e9e9e;
          }
        }
      }

      .img-warp {
        @apply p-y-0.16rem;

        .upload-btn {
          @apply w-0.8rem
          h-0.8rem
          flex
          flex-col
          justify-center
          items-center;

          background-color: $view-color;
          @include general-font-12;
          color: $text-high-color;

          img {
            @apply block
            w-0.24rem
            h-0.24rem
            m-b-0.08rem;
          }
        }
      }
    }
  }

  .btn-list {
    @apply flex-1
    flex
    justify-between
    items-center
    px-0.16rem;

    .btn {
      @apply w-1.71rem
      h-0.40rem
      rd-0.40rem
      text-center;

      border: 1px solid $primary-color;

      &:first-child {
        background-color: $white-color;
        border-color: $border-color;
        color: $text-mid-color;
        @include general-font-14;
      }

      &:last-child {
        background-color: $primary-color;
        color: $white-color;
        @include primary-font-14;
      }

      line-height: 0.38rem !important;
    }
  }
}
</style>
