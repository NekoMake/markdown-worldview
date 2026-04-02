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
import 'markdown-worldview/style.css'

const md = new MarkdownIt()

md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    console.log('导航到:', event.path)
    // 在这里实现你的导航逻辑
    // 例如: router.push(event.path)
  }
})

const html = md.render('你的 markdown 内容')
```

### 在 VitePress 中使用

在 `.vitepress/config.ts` 中配置：

```typescript
import { defineConfig } from 'vitepress'
import { markdownWorldviewPlugin } from 'markdown-worldview'

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(markdownWorldviewPlugin, {
        onNavigate: (event) => {
          // VitePress 导航逻辑
          window.location.href = event.path
        }
      })
    }
  }
})
```

在 `.vitepress/theme/index.ts` 中导入样式：

```typescript
import DefaultTheme from 'vitepress/theme'
import 'markdown-worldview/style.css'

export default {
  extends: DefaultTheme
}
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
