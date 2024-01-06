// uno.config.ts
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetUno, type UserConfig } from 'unocss'


export default <UserConfig>defineConfig({
    presets: [presetUno()],
    transformers: [transformerDirectives()]
})
