# 安装与配置

## 安装

使用 npm:

```bash
npm install markdown-worldview
```

使用 yarn:

```bash
yarn add markdown-worldview
```

使用 pnpm:

```bash
pnpm add markdown-worldview
```

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

## 不同框架集成

### Obsidian 插件

```typescript
// Obsidian 插件中使用
md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    // 打开 Obsidian 内部链接
    this.app.workspace.openLinkText(event.path, '', false)
  }
})
```

### Nuxt 3

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ... 其他配置
})

// plugins/markdown.ts
import MarkdownIt from 'markdown-it'
import { markdownWorldviewPlugin } from 'markdown-worldview'

export default defineNuxtPlugin((nuxtApp) => {
  const md = new MarkdownIt()
  
  md.use(markdownWorldviewPlugin, {
    onNavigate: (event) => {
      navigateTo(event.path)
    }
  })
  
  nuxtApp.provide('md', md)
})
```

### Next.js

```typescript
// lib/markdown.ts
import MarkdownIt from 'markdown-it'
import { markdownWorldviewPlugin } from 'markdown-worldview'
import { useRouter } from 'next/navigation'

export function createMarkdownRenderer() {
  const md = new MarkdownIt()
  
  md.use(markdownWorldviewPlugin, {
    onNavigate: (event) => {
      // Next.js App Router
      window.location.href = event.path
    }
  })
  
  return md
}
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
