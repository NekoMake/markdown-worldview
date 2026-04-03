# 主题定制指南 🎨

## 什么是主题定制？

简单来说，就像给你的网页"换装"。你可以改变所有组件的外观：
- 把蓝色改成红色
- 让卡片更大或更圆
- 调整间距和字体
- 改变物品网格列数

**最棒的是**：不需要改代码，只需要在CSS文件里写几行配置！


## 🚀 三步快速上手

**第1步：创建主题文件**

新建一个CSS文件（比如 `my-theme.css`）

**第2步：写入配置**

```css
:root {
  --mw-primary-color: #ff5733;     /* 主色调 */
  --mw-card-avatar-size: 150px;    /* 头像大小 */
  --mw-inventory-columns: 6;       /* 物品列数 */
}
```

**第3步：导入到项目**

具体方法见下文"在不同环境中使用"


## 📖 配置项速查

### 🎨 颜色

| 配置项 | 说明 | 默认 |
|--------|------|------|
| `--mw-primary-color` | 主色调 | 蓝色 |
| `--mw-bg-color` | 背景色 | 白色 |
| `--mw-text-color` | 文字色 | 深灰 |
| `--mw-border-color` | 边框色 | 浅灰 |
| `--mw-pos-color` | 正面元素（盟友、增益、↑） | 绿色 |
| `--mw-neg-color` | 负面元素（敌人、减益、↓） | 红色 |
| `--mw-neu-color` | 中性元素 | 灰色 |
| `--mw-rarity-common` | 普通物品 | 灰色 |
| `--mw-rarity-rare` | 稀有物品 | 蓝色 |
| `--mw-rarity-epic` | 史诗物品 | 紫色 |
| `--mw-rarity-legendary` | 传说物品 | 金色 |

### 📏 大小和间距

| 配置项 | 说明 | 默认 |
|--------|------|------|
| `--mw-spacing-sm` | 小间距 | 8px |
| `--mw-spacing-md` | 中间距 | 16px |
| `--mw-spacing-lg` | 大间距 | 24px |
| `--mw-radius-sm` | 小圆角 | 4px |
| `--mw-radius-md` | 中圆角 | 8px |
| `--mw-radius-lg` | 大圆角 | 12px |
| `--mw-shadow-sm` | 淡阴影 | - |
| `--mw-shadow-md` | 中阴影 | - |
| `--mw-shadow-lg` | 深阴影 | - |

### 🎴 组件专用

| 配置项 | 说明 | 默认 | 示例 |
|--------|------|------|------|
| `--mw-card-avatar-size` | 卡片头像大小 | 120px | 角色图鉴用 `180px` |
| `--mw-numerical-icon-size` | 数值面板图标 | 2rem | 小一点用 `1.5rem` |
| `--mw-numerical-progress-height` | 进度条粗细 | 8px | 更粗用 `12px` |
| `--mw-inventory-columns` | 物品网格列数 | 4 | 大屏用 `6`，手机用 `2` |
| `--mw-inventory-icon-size` | 物品图标大小 | 48px | 看不清就用 `64px` |

### ⚠️ 错误提示样式

| 配置项 | 说明 | 默认 |
|--------|------|------|
| `--mw-error-border` | 开发模式错误边框色 | `#dc2626`（红色） |
| `--mw-error-bg` | 开发模式错误背景色 | `#fee`（浅红） |
| `--mw-error-text` | 开发模式错误文字色 | `#dc2626`（红色） |
| `--mw-info-border` | 生产模式提示边框色 | `#d1d5db`（淡灰） |
| `--mw-info-bg` | 生产模式提示背景色 | `#f9fafb`（浅灰） |
| `--mw-info-text` | 生产模式提示文字色 | `#6b7280`（中灰） |

> 💡 **提示**：关于错误处理的详细说明，请参考 [错误处理指南](/guide/error-handling)


## 🎨 高级：CSS类名

如果CSS变量不够用，可以直接用类名控制：

### Card 卡片

| 类名 | 说明 |
|------|------|
| `.mw-card` | 整个卡片 |
| `.mw-card-avatar` | 头像 |
| `.mw-card-name` | 名字 |
| `.mw-card-desc` | 描述 |
| `.mw-clickable` | 加上后悬停会浮起 |
| `.mw-error` | 红色边框 |

### Numerical 数值面板

| 类名 | 说明 |
|------|------|
| `.mw-numerical` | 整个面板 |
| `.mw-numerical-item` | 单个数值项 |
| `.mw-numerical-value` | 数值 |
| `.mw-trend-up` | 上升↑ |
| `.mw-trend-down` | 下降↓ |

### Inventory 物品网格

| 类名 | 说明 |
|------|------|
| `.mw-inventory` | 整个物品栏 |
| `.mw-inventory-item` | 单个格子 |
| `.mw-inventory-icon` | 物品图标 |
| `.mw-rarity-common` | 普通边框 |
| `.mw-rarity-rare` | 稀有边框 |
| `.mw-rarity-epic` | 史诗边框 |
| `.mw-rarity-legendary` | 传说边框 |

**示例：**
```css
/* 让卡片名字变紫色 */
.mw-card-name { color: #8b5cf6; }

/* 让传说物品边框更粗 */
.mw-rarity-legendary {
  border-width: 3px;
  box-shadow: 0 0 20px gold;
}
```


## 💡 使用技巧

### ✅ 推荐

**优先用CSS变量**
```css
:root { --mw-primary-color: #ff5733; }
```

**响应式设计**
```css
:root { --mw-card-avatar-size: 100px; }

@media (min-width: 768px) {
  :root { --mw-card-avatar-size: 140px; }
}
```

**深色模式**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --mw-primary-color: #60a5fa;
    --mw-bg-color: #1f2937;
    --mw-text-color: #f3f4f6;
  }
}
```

### ❌ 避免

```css
/* ❌ 不要用 !important */
.mw-card { border-color: red !important; }

/* ✅ 应该用变量 */
:root { --mw-border-color: red; }
```


## 🔧 在不同环境中使用

### HTML

```html
<link rel="stylesheet" href="path/to/markdown-worldview/style.css">
<link rel="stylesheet" href="my-theme.css">
```

### VitePress

```typescript
// .vitepress/theme/index.ts
import 'markdown-worldview/style.css'
import './style.css'
```

### Obsidian

1. 设置 → 外观 → CSS代码片段
2. 新建 `worldview.css`
3. 写入配置并启用

### 其他编辑器

- **Typora**：主题 → 打开主题文件夹
- **Mark Text**：偏好设置 → 主题
- **VS Code**：workspace设置添加样式

### JavaScript

```javascript
import MarkdownIt from 'markdown-it'
import { markdownWorldviewPlugin } from 'markdown-worldview'
import 'markdown-worldview/style.css'
import './my-theme.css'

const md = new MarkdownIt()
md.use(markdownWorldviewPlugin)
```


## 🐛 常见问题

**Q: 改了颜色但没变化？**

A: 检查导入顺序，你的主题要在默认样式**之后**：
```typescript
import 'markdown-worldview/style.css'  // 先
import './my-theme.css'                 // 后
```

**Q: 怎么调试？**

A: 按F12打开开发者工具 → 检查元素 → Computed → 搜索 `--mw-`

**Q: 只想改某个组件？**

A: 用类名限定：
```css
.mw-card { --mw-primary-color: #8b5cf6; }
```

**Q: 深色模式看不清？**

A: 加深色模式配置：
```css
@media (prefers-color-scheme: dark) {
  :root {
    --mw-primary-color: #60a5fa;
    --mw-bg-color: #1f2937;
  }
}
```

**Q: 手机上太挤？**

A: 用媒体查询：
```css
@media (max-width: 768px) {
  :root { --mw-inventory-columns: 2; }
}
```

**Q: 能在YAML里写样式吗？**

A: 目前不支持，请用CSS变量。

## 💬 更多帮助

- 📚 [组件文档](/components/card)
- �️ [错误处理指南](/guide/error-handling) - 遇到问题时查看
- �🔍 完整变量列表：源码 `variables.css`
- 💡 [GitHub仓库](https://github.com/your-repo)
- ❤️ 分享你的主题到Issues
