// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vant/nuxt', '@unocss/nuxt'],
  alias: {
    '@': './'
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
    host: '192.168.2.6'
  },
  css: ['@/assets/styles/base.scss'],
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
        minPixelValue: 1,
        unitPrecision: 6,
        selectorBlackList: ['html', '.rem-ignore']
      }
    }
  }
})
