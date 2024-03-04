interface IConfig {
  url: string
  method?: 'post' | 'get'
  isLoading?: boolean
  body?: Record<string, any>
  transform?: (res: any) => any
}

interface IResponseData {
  code: number
  data: globalThis.Ref<any>
  message: 'success' | 'error'
  success: boolean
}

let dialogInstance: any = null

const useHttp = async (config: IConfig) => {
  const tokenCookie = useCookie('token')
  const userCookie = useCookie<Record<string, any>>('user')

  const {
    url,
    method,
    body,
    isLoading = false,
    transform = (res: any) => {
      return res.data
    }
  } = config

  if (isLoading) {
    showLoadingToast({
      message: 'Loading...',
      forbidClick: true
    })
  }

  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.baseUrl
  const router = useRouter()

  const token = useCookie('token')

  const { data, error } = await useFetch(url, {
    baseURL,
    method,
    body: method === 'post' ? body : undefined,
    transform,
    onRequest({ request, options }) {
      if (token.value) {
        options.headers = (options.headers || {}) as Record<string, string>
        options.headers['Authorization'] = `Bearer ${token.value}`
      }
    },
    onResponse({ response }) {
      if (isLoading) closeToast()
      const { code, message, data } = response._data as IResponseData
      if (code === 10100) {
        message && showFailToast(message)
      }
      return null
    }
  })

  if (error.value && error.value.message) {
    if (error.value.message.includes('401')) {
      tokenCookie.value = undefined
      userCookie.value = {}
      if (!dialogInstance) {
        showDialog({
          message: 'Login failed, please log in again'
        }).then(() => {
          dialogInstance = null
          router.push('/login')
        })
      }
    }
  }

  return { data, error }
}

export const useHttpPost = (config: IConfig) =>
  useHttp({
    ...config,
    method: 'post'
  })

export const useHttpGet = (config: IConfig) =>
  useHttp({
    ...config,
    method: 'get'
  })

export default useHttp
