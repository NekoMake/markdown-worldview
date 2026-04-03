// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'

// 导入 markdown-worldview 插件样式
import 'markdown-worldview/style.css'

export default {
  extends: DefaultTheme,
  // 使用自定义 Layout，在其中处理图表初始化
  Layout
} satisfies Theme
