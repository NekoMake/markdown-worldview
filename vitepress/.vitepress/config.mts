import { defineConfig } from 'vitepress'
import { markdownWorldviewPlugin } from 'markdown-worldview'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "MarkDown",
  
  title: "Markdown-WorldView",
  description: "用于渲染交互式世界观组件的 Markdown-it 插件",
  
  // 配置 markdown-it 插件
  markdown: {
    config: (md) => {
      md.use(markdownWorldviewPlugin, {
        onNavigate: (event) => {
          // VitePress 中的链接跳转处理
          if (typeof window !== 'undefined') {
            // 客户端端跳转
            const link = event.path.startsWith('/') ? event.path : `/${event.path}`
            window.location.href = link
          }
        }
      })
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/quickstart' },
      { text: '组件', link: '/components/card' },
    ],

    // 基于路径的侧边栏配置
    sidebar: {
      '/guide/': [
        {
          text: '开发指南',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '安装与配置', link: '/guide/installation' },
            { text: '主题定制', link: '/guide/theming' }
          ]
        }
      ],
      '/components/': [
        {
          text: '纯 CSS 组件',
          collapsed: false,
          items: [
            { text: 'Card 介绍卡片', link: '/components/card' },
            { text: 'Numerical 数值面板', link: '/components/numerical' },
            { text: 'Inventory 物品网格', link: '/components/inventory' }
          ]
        },
        {
          text: '图表组件（开发中）',
          collapsed: true,
          items: [
            { text: 'Radar 雷达图', link: '/components/radar' },
            { text: 'Power 势力综测', link: '/components/power' }
          ]
        },
        {
          text: '图形组件（开发中）',
          collapsed: true,
          items: [
            { text: 'Relations 关系图', link: '/components/relations' },
            { text: 'Hierarchy 层级架构', link: '/components/hierarchy' },
            { text: 'Timeline 时间线', link: '/components/timeline' }
          ]
        }
      ]
    },

    // 页面底部的上下页导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲标题
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 返回顶部按钮文字
    returnToTopLabel: '返回顶部',

    // 移动端菜单文字
    sidebarMenuLabel: '菜单',

    // 深色模式切换文字
    darkModeSwitchLabel: '主题',

    // 外部链接图标
    externalLinkIcon: true,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-repo/markdown-worldview' }
    ]
  }
})
