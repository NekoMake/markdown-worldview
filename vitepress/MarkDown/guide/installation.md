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

### 服务端配置（markdown-it 插件）

服务端插件配置用于将 YAML 代码块渲染为 HTML。

```typescript
interface PluginOptions {
  debug?: boolean        // 调试模式（默认 false）
  classPrefix?: string  // CSS 类名前缀（默认 "mw"）
}
```

**示例**：

```typescript
import { markdownWorldviewPlugin } from 'markdown-worldview'

md.use(markdownWorldviewPlugin, {
  debug: true,
  classPrefix: 'mw'
})
```

### 客户端配置（浏览器初始化）

客户端初始化用于启用交互功能（图表、导航等）。

```typescript
interface ClientInitOptions {
  debug?: boolean                    // 调试模式
  onNavigate?: (event: NavigationEvent) => void  // 导航回调
}

interface NavigationEvent {
  path: string          // 目标路径
  sourceElement?: HTMLElement  // 触发导航的 DOM 元素
}
```

**示例**：

```typescript
import { initMarkdownWorldview } from 'markdown-worldview/client'

await initMarkdownWorldview({
  debug: true,
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

> **重要：服务端 vs 客户端**  
> - **服务端（markdown-it 插件）**：只负责将 Markdown 渲染为 HTML，不处理用户交互  
> - **客户端（initMarkdownWorldview）**：处理所有交互功能（图表、点击事件、导航等）  
> - **onNavigate 只应该在客户端配置**，因为只有浏览器才能处理点击事件

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
        debug: true  // 服务端只需要 debug 选项
        // ❌ 不需要 onNavigate - 导航应该在客户端处理
      })
    }
  }
})
```

**步骤 2：创建自定义 Layout** - 在 `.vitepress/theme/Layout.vue` 中初始化图表和导航

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { initMarkdownWorldview } from 'markdown-worldview/client'

const { Layout } = DefaultTheme
const route = useRoute()
const router = useRouter()

let cleanup: (() => void) | null = null

const init = async () => {
  await nextTick()
  cleanup = await initMarkdownWorldview({ 
    debug: true,
    // ✅ 客户端导航处理
    onNavigate: (event) => {
      router.go(event.path)
    }
  })
}

onMounted(init)

onUnmounted(() => {
  if (cleanup) cleanup()
})

watch(() => route.path, async () => {
  if (cleanup) cleanup()
  await init()
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
> - **服务端（markdown-it）**：只负责将 YAML 渲染为 HTML，生成带有 `data-mw-link` 属性的元素  
> - **客户端（initMarkdownWorldview）**：负责所有交互功能：  
>   - 初始化图表（ECharts）  
>   - 设置点击事件监听器  
>   - 处理导航跳转  
> - 这是 **职责分离** 的正确做法，符合 SSR + CSR 的最佳实践

### Obsidian 插件

```typescript
import { Plugin } from 'obsidian'
import { markdownWorldviewPlugin } from 'markdown-worldview'
import { initMarkdownWorldview } from 'markdown-worldview/client'

export default class MyPlugin extends Plugin {
  async onload() {
    // 服务端：注册 markdown-it 插件
    this.registerMarkdownCodeBlockProcessor('card', (source, el, ctx) => {
      // 使用 markdown-worldview 渲染
    })
    
    // 客户端：初始化图表和导航
    await initMarkdownWorldview({
      debug: true,
      onNavigate: (event) => {
        // Obsidian 导航逻辑
        this.app.workspace.openLinkText(event.path, '', false)
      }
    })
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
    debug: true
  })
  
  // 客户端初始化
  const cleanup = await initMarkdownWorldview({ 
    debug: true,
    onNavigate: (event) => {
      navigateTo(event.path)
    }
  })
  
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
    debug: true  // 服务端只需要 debug
  })
  
  return md
}
```

**客户端初始化** - `components/MarkdownContent.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { initMarkdownWorldview } from 'markdown-worldview/client'
import { useRouter } from 'next/navigation'
import 'markdown-worldview/style.css'

export function MarkdownContent({ html }: { html: string }) {
  const router = useRouter()
  
  useEffect(() => {
    let cleanup: (() => void) | null = null
    
    initMarkdownWorldview({ 
      debug: true,
      onNavigate: (event) => {
        router.push(event.path)
      }
    }).then(fn => {
      cleanup = fn
    })
    
    return () => cleanup?.()
  }, [html, router])
  
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
      debug: true
    })

    // 2. 渲染
    document.getElementById('content').innerHTML = md.render(yourMarkdown)

    // 3. 客户端初始化（图表 + 导航）
    await initMarkdownWorldview({ 
      debug: true,
      onNavigate: (event) => {
        window.location.href = event.path
      }
    })
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
// 服务端类型
import type { 
  PluginOptions,
  NavigationEvent,
  NavigateFunction
} from 'markdown-worldview'

// 客户端类型
import type {
  ClientInitOptions,
  NavigationEvent,
  NavigateFunction
} from 'markdown-worldview/client'
```
