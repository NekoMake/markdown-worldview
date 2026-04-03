# 安装与配置

## 安装

### 1. 安装插件包

使用 npm:

```bash
npm install markdown-worldview echarts
```

使用 yarn:

```bash
yarn add markdown-worldview echarts
```

使用 pnpm:

```bash
pnpm add markdown-worldview echarts
```

> **注意**：`echarts` 是 **peerDependency**，用于渲染图表组件（Radar、Power）。如果你只使用纯 CSS 组件（Card、Numerical、Inventory），可以不安装 echarts。

## 配置选项

### onNavigate 回调

所有包含 `link` 字段的组件都会在用户点击时触发 `onNavigate` 回调。

```typescript
interface NavigationEvent {
  path: string       // 目标路径
  sourceElement: any // 触发导航的 DOM 元素（可选）
}

type NavigationHandler = (event: NavigationEvent) => void
```

### 完整配置示例

```typescript
import { markdownWorldviewPlugin } from 'markdown-worldview'

md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    // 自定义导航逻辑
    console.log('导航到:', event.path)
    
    // 示例: Vue Router
    // router.push(event.path)
    
    // 示例: 原生跳转
    // window.location.href = event.path
    
    // 示例: 单页应用
    // history.pushState({}, '', event.path)
  }
})
```

## 客户端初始化（Phase 4+）

从 Phase 4 开始，图表组件（如 Radar、Power）需要在**客户端初始化**。以下是不同框架的集成方式。

### VitePress（推荐）

**步骤 1：服务端配置** - 在 `.vitepress/config.mts` 中配置插件

```typescript
import { defineConfig } from 'vitepress'
import { markdownWorldviewPlugin } from 'markdown-worldview'

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(markdownWorldviewPlugin, {
        debug: true,
        onNavigate: (event) => {
          // 配置导航逻辑
          if (typeof window !== 'undefined') {
            window.location.href = event.path
          }
        }
      })
    }
  }
})
```

**步骤 2：创建自定义 Layout** - 在 `.vitepress/theme/Layout.vue` 中初始化图表

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { initMarkdownWorldview } from 'markdown-worldview/client'

const { Layout } = DefaultTheme
const route = useRoute()

let cleanup: (() => void) | null = null

// 组件挂载时初始化图表
onMounted(async () => {
  cleanup = await initMarkdownWorldview({ debug: true })
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})

// 监听路由变化，重新初始化图表
watch(() => route.path, async () => {
  if (cleanup) {
    cleanup()
  }
  cleanup = await initMarkdownWorldview({ debug: true })
})
</script>

<template>
  <Layout />
</template>
```

**步骤 3：注册 Layout** - 在 `.vitepress/theme/index.ts` 中引用

```typescript
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import 'markdown-worldview/style.css'

export default {
  extends: DefaultTheme,
  Layout
} satisfies Theme
```

> **为什么这样做？**  
> 使用 Vue 的 `onMounted` 钩子确保 DOM 渲染完成后再初始化图表，比在 `enhanceApp` 中使用 `setTimeout` 更可靠和优雅。这是 VitePress 官方推荐的扩展方式。

### Obsidian 插件

```typescript
import { Plugin } from 'obsidian'
import { markdownWorldviewPlugin } from 'markdown-worldview'
import { initMarkdownWorldview } from 'markdown-worldview/client'

export default class MyPlugin extends Plugin {
  async onload() {
    // 服务端：配置导航
    this.registerMarkdownPostProcessor((element, context) => {
      // 导航处理
      element.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        const link = target.closest('[data-mw-link]')
        if (link) {
          e.preventDefault()
          const path = link.getAttribute('data-mw-link')
          this.app.workspace.openLinkText(path, '', false)
        }
      })
    })
    
    // 客户端：初始化图表
    await initMarkdownWorldview({ debug: true })
  }
}
```

### Nuxt 3

```typescript
// plugins/markdown.client.ts（注意：.client.ts 后缀表示只在客户端运行）
import MarkdownIt from 'markdown-it'
import { markdownWorldviewPlugin } from 'markdown-worldview'
import { initMarkdownWorldview } from 'markdown-worldview/client'

export default defineNuxtPlugin(async (nuxtApp) => {
  const md = new MarkdownIt()
  
  // 服务端配置
  md.use(markdownWorldviewPlugin, {
    onNavigate: (event) => {
      navigateTo(event.path)
    }
  })
  
  // 客户端初始化
  const cleanup = await initMarkdownWorldview({ debug: true })
  
  nuxtApp.provide('md', md)
  nuxtApp.provide('cleanupCharts', cleanup)
})
```

### Next.js

**服务端渲染** - `lib/markdown.ts`

```typescript
import MarkdownIt from 'markdown-it'
import { markdownWorldviewPlugin } from 'markdown-worldview'

export function createMarkdownRenderer() {
  const md = new MarkdownIt()
  
  md.use(markdownWorldviewPlugin, {
    onNavigate: (event) => {
      // Next.js 路由跳转
      window.location.href = event.path
    }
  })
  
  return md
}
```

**客户端初始化** - `components/MarkdownContent.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { initMarkdownWorldview } from 'markdown-worldview/client'
import 'markdown-worldview/style.css'

export function MarkdownContent({ html }: { html: string }) {
  useEffect(() => {
    let cleanup: (() => void) | null = null
    
    initMarkdownWorldview({ debug: true }).then(fn => {
      cleanup = fn
    })
    
    return () => cleanup?.()
  }, [html])
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

### 普通网页（CDN）

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/markdown-worldview/dist/style.css">
</head>
<body>
  <div id="content"></div>

  <script type="module">
    import MarkdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it/+esm'
    import { markdownWorldviewPlugin } from 'https://unpkg.com/markdown-worldview/+esm'
    import { initMarkdownWorldview } from 'https://unpkg.com/markdown-worldview/client/+esm'

    // 1. 配置 markdown-it
    const md = new MarkdownIt()
    md.use(markdownWorldviewPlugin, {
      onNavigate: (event) => {
        window.location.href = event.path
      }
    })

    // 2. 渲染
    document.getElementById('content').innerHTML = md.render(yourMarkdown)

    // 3. 初始化图表
    await initMarkdownWorldview({ debug: true })
  </script>
</body>
</html>
```

## CSS 变量自定义

Markdown-WorldView 使用 CSS 变量来控制样式，你可以覆盖这些变量来自定义外观：

```css
:root {
  /* 主题颜色 */
  --mw-primary-color: #2563eb;
  --mw-bg-color: #ffffff;
  --mw-text-color: #1f2937;
  --mw-border-color: #e5e7eb;
  
  /* 状态颜色 */
  --mw-pos-color: #16a34a;  /* 正面/增益 */
  --mw-neg-color: #dc2626;  /* 负面/减益 */
  --mw-neu-color: #6b7280;  /* 中性 */
  
  /* 稀有度颜色 */
  --mw-rarity-common: #9ca3af;
  --mw-rarity-rare: #3b82f6;
  --mw-rarity-epic: #8b5cf6;
  --mw-rarity-legendary: #f59e0b;
}
```

## TypeScript 支持

Markdown-WorldView 完全支持 TypeScript，并提供完整的类型定义。

```typescript
import type { 
  MarkdownWorldviewOptions,
  NavigationEvent,
  NavigationHandler
} from 'markdown-worldview'
```
