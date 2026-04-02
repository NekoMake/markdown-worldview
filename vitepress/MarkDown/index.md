---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Markdown-WorldView"
  text: "为世界观创作而生的 Markdown 插件"
  tagline: 用 YAML 语法渲染交互式组件，构建你的百科世界
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quickstart
    - theme: alt
      text: 查看组件
      link: /components/card
    - theme: alt
      text: GitHub
      link: https://github.com/your-repo/markdown-worldview

features:
  - icon: 📝
    title: 简洁的 YAML 语法
    details: 使用标准 YAML 语法定义组件，无需学习复杂的 DSL，直观易读
  - icon: 🎨
    title: 8 种世界观组件
    details: 卡片、数值面板、物品网格、雷达图、势力图、关系网络、层级架构、时间线
  - icon: 🔗
    title: 智能导航系统
    details: 通过 onNavigate 回调适配任何路由系统，无缝集成到你的应用
  - icon: 🌓
    title: 深色模式支持
    details: 自动适配系统主题，所有组件完美支持深色模式
  - icon: 📱
    title: 响应式设计
    details: 移动端和桌面端均有良好体验，组件自动适配屏幕尺寸
  - icon: 🎯
    title: TypeScript 支持
    details: 完整的类型定义，享受 IDE 的智能提示和类型检查
  - icon: 🔌
    title: 易于集成
    details: 支持 VitePress、Obsidian、Nuxt、Next.js 等多种平台
  - icon: 🎨
    title: 可定制样式
    details: 基于 CSS 变量，轻松定制颜色、字体、间距等所有样式
---

## 快速体验

在你的 Markdown 文档中写入：

````markdown
```card
name: 艾蕾娜·星语
avatar: https://via.placeholder.com/150
description: 银月森林的精灵守护者，世代守护着古老的魔法结界
dictum: "森林记得每一个名字"
tags: [精灵, 传奇射手, 守序中立]
```
````

立即渲染为精美的交互式卡片！

## 为什么选择 Markdown-WorldView？

### 🎯 专为世界观创作设计

无论你是在创作小说、游戏剧本、TRPG 模组还是个人百科，Markdown-WorldView 提供了一套完整的组件系统来展示你的世界。

### 🚀 开箱即用

```bash
npm install markdown-worldview
```

3 行代码即可集成到你的 markdown-it 项目。

### 🌍 活跃的社区

由社区驱动开发，持续更新，欢迎贡献新的组件和功能。

## 谁在使用？

- **小说作者** - 构建角色关系图和世界观百科
- **游戏策划** - 设计游戏系统和数值平衡
- **TRPG 玩家** - 管理角色卡和战役记录
- **知识管理者** - 在 Obsidian 中构建个人知识图谱

## 开始创作

查看 [快速开始](/guide/quickstart) 文档，5 分钟上手 Markdown-WorldView。


