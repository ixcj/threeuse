import { defineConfig } from 'vitepress'
import { applyPlugins } from '@ruabick/md-demo-plugins'
import { genTemp } from '@ruabick/vite-plugin-gen-temp'
import { genApiDoc } from '@ruabick/vite-plugin-gen-api-doc'
import { resolve } from 'path'

const Guide = [
  { text: '快速开始', link: '/guide/' },
]

const Core = [
  { text: '创建应用', link: '/core/' },
]

const Other = [
  { text: 'useRollingData 滚动数据', link: '/hooks/other/rolling-data/' },
]

const Hooks = [
  { text: 'useRain 雨', link: '/hooks/rain/' },
  { text: 'useSkyBox 天空盒', link: '/hooks/sky-box/' },
  { text: '其他', items: Other },
]

const Expands = [
  { text: 'useLoader 加载器', link: '/expands/loader/' },
  { text: 'useRenderClock 渲染时钟', link: '/expands/render-clock/' },
]

const Plugins = [
  { text: 'stats 性能监测', link: '/plugins/stats/' },
  { text: 'cameraRange 相机范围', link: '/plugins/cameraRange/' },
]

const sidebar = [
  { text: '指引', items: Guide },
  { text: '核心', items: Core },
  { text: '功能', items: Hooks },
  { text: '扩展', items: Expands },
  { text: '插件', items: Plugins },
]

export default defineConfig({
  lang: 'zh-CN',
  lastUpdated: true,
  title: 'ThreeUse',
  vue: {},
  vite: {
    plugins: [genTemp(), genApiDoc()],
    resolve: {
      alias: {
        '@': resolve('./src/'),
        'threeuse': resolve('./src/')
      },
    },
    ssr: {
      noExternal: [
        'echarts',
        'vue-echarts'
      ]
    }
  },
  markdown: {
    config: (md) => {
      applyPlugins(md)
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  buildEnd() {
    process.exit(0)
  },
  themeConfig: {
    sidebar,
    logo: '/logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/ixcj/threeuse' }],
    outlineTitle: '本页目录',
    footer: {
      message: 'MIT Licensed.',
      copyright: 'Copyright © 2023-PRESENT XCJ',
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/svg+xml' }],
  ],
})
