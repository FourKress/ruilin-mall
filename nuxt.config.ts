// https://nuxt.com/docs/api/configuration/nuxt-config

const BASE_URL = 'http://localhost:4000/api/v1'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vant/nuxt', '@unocss/nuxt'],
  runtimeConfig: {
    baseUrl: BASE_URL,
    public: {
      baseUrl: BASE_URL
    }
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'viewport',
          content:
            'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0'
        }
      ],
      title: 'Hello Nuxt'
    }
  },
  devServer: {
    port: 7777,
    // host: '192.168.10.186'
    host: '172.20.10.4'
  },
  css: ['~/assets/styles/base.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variable.scss" as *;'
        }
      }
    }
  },
  postcss: {
    plugins: {
      'postcss-pxtorem': {
        autoprefixer: {
          overrideBrowserslist: ['last 5 version', '>1%', 'ie >=8']
        },
        rootValue({ file }: any) {
          return file.indexOf('vant') !== -1 ? 37.5 : 100
        },
        propList: ['*'],
        mediaQuery: false,
        exclude: /(node_module)/,
        minPixelValue: 2,
        unitPrecision: 6,
        selectorBlackList: ['html', '.rem-ignore']
      }
    }
  }
})
