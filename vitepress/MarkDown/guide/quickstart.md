# 快速开始

Markdown-WorldView 是一个 markdown-it 插件，用于在 Markdown 文档中渲染交互式的世界观组件。

## 安装

```bash
npm install markdown-worldview
```

## 基本使用

### 在 markdown-it 中使用

```javascript
import MarkdownIt from 'markdown-it'
import { markdownWorldviewPlugin } from 'markdown-worldview'
import { initMarkdownWorldview } from 'markdown-worldview/client'
import 'markdown-worldview/style.css'

const md = new MarkdownIt()

// 服务端：配置插件（只负责渲染 HTML）
md.use(markdownWorldviewPlugin, {
  debug: true  // 可选：启用调试模式
})

// 渲染 Markdown 为 HTML
const html = md.render('你的 markdown 内容')

// 客户端：初始化图表和导航（在浏览器中执行）
await initMarkdownWorldview({
  debug: true,
  onNavigate: (event) => {
    console.log('导航到:', event.path)
    // 在这里实现你的导航逻辑
    // 例如: router.push(event.path)
  }
})
```

### 在 VitePress 中使用

**步骤 1：配置 markdown-it 插件** - 在 `.vitepress/config.ts` 中：

```typescript
import { defineConfig } from 'vitepress'
import { markdownWorldviewPlugin } from 'markdown-worldview'

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(markdownWorldviewPlugin, {
        debug: true  // 服务端只需要配置 debug 选项
        // ❌ 不需要 onNavigate - 导航应该在客户端处理
      })
    }
  }
})
```

**步骤 2：创建自定义 Layout** - 创建 `.vitepress/theme/Layout.vue`：

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

// 初始化函数
const init = async () => {
  await nextTick()
  cleanup = await initMarkdownWorldview({ 
    debug: true,
    // ✅ 客户端导航处理 - 这是唯一需要配置 onNavigate 的地方
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

**步骤 3：注册主题** - 在 `.vitepress/theme/index.ts` 中：

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

## 组件语法

所有组件都使用 YAML 语法在代码块中定义。基本格式为：

````markdown
```组件名称
字段1: 值1
字段2: 值2
```
````

## 可用组件

- **Card** - 介绍卡片，用于展示角色、物品等的基本信息
- **Numerical** - 数值面板，用于展示属性、状态值等
- **Inventory** - 物品网格，用于展示物品清单

更多组件正在开发中...

## 下一步

- 查看 [Card 组件文档](/components/card)
- 查看 [Numerical 组件文档](/components/numerical)
- 查看 [Inventory 组件文档](/components/inventory)
