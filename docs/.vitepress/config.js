import { defineConfig } from 'vitepress';
import { applyPlugins } from '@ruabick/md-demo-plugins';
import { genTemp } from '@ruabick/vite-plugin-gen-temp';
import { genApiDoc } from '@ruabick/vite-plugin-gen-api-doc';
import { resolve } from 'path';

const Guide = [
  { text: '快速开始', link: '/guide/' },
]

const Core = [
  { text: '创建应用', link: '/core/' },
]

const Other = [
  { text: 'useRollingData 滚动数据', link: '/hooks/other/rolling-data/' },
  { text: 'useRenderClock 渲染时钟', link: '/hooks/other/render-clock/' },
]

const Hooks = [
  { text: 'useSkyBox 天空盒', link: '/hooks/sky-box/' },
  { text: '其他', items: Other },
]

const sidebar = [
  { text: '指引', items: Guide },
  { text: '核心', items: Core },
  { text: '功能', items: Hooks },
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
        'threeuse': resolve('./src/index.ts'),
      },
    },
  },
  markdown: {
    config: (md) => {
      applyPlugins(md);
    },
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  buildEnd() {
    process.exit(0);
  },
  themeConfig: {
    sidebar,
    logo: '/logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/ixcj/threeuse' }],
    outlineTitle: '本页目录',
    footer: {
      message: 'MIT Licensed.',
      copyright: 'Copyright © 2023-PRESENT ixcj',
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/svg+xml' }],
  ],
});
