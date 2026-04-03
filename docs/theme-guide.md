# 主题开发指南 (Theme Customization Guide)

本指南详细说明如何为 Markdown-Worldview 插件创建自定义主题，通过覆盖CSS变量或编写完整的CSS样式来定制所有组件的外观。

## 📚 目录

- [快速开始](#快速开始)
- [CSS变量参考](#css变量参考)
- [CSS类名清单](#css类名清单)
- [主题开发方法](#主题开发方法)
- [框架集成指南](#框架集成指南)
- [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 方法1: 仅覆盖CSS变量（推荐）

最简单的主题化方式是覆盖CSS变量：

```css
/* my-theme.css */
:root {
  /* 修改主色调 */
  --mw-primary-color: #ff5733;
  
  /* 调整卡片头像大小 */
  --mw-card-avatar-size: 150px;
  
  /* 更改物品网格列数 */
  --mw-inventory-columns: 6;
  
  /* 增大进度条高度 */
  --mw-numerical-progress-height: 12px;
}
```

### 方法2: 覆盖具体组件样式

如果需要更精细的控制，可以覆盖具体的类样式：

```css
/* my-theme.css */
.mw-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
}

.mw-card-avatar {
  border: 4px solid var(--mw-primary-color);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
}
```

### 方法3: 完整自定义CSS

创建完全自定义的样式，完全替换默认外观：

```css
/* my-theme.css */
@import 'markdown-worldview/style.css'; /* 可选：保留基础样式 */

/* 完全重写卡片样式 */
.mw-card {
  /* 你的自定义样式 */
}
```

---

## 🎨 CSS变量参考

所有CSS变量都定义在 `:root` 中，可以在你的主题CSS中覆盖。

### 基础颜色（亮色模式）

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-primary-color` | `#2563eb` | 主色调（蓝色） |
| `--mw-bg-color` | `#ffffff` | 背景色 |
| `--mw-text-color` | `#1f2937` | 主文本色 |
| `--mw-text-muted` | `#6b7280` | 次要文本色 |
| `--mw-border-color` | `#e5e7eb` | 边框颜色 |

### 状态颜色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-pos-color` | `#16a34a` | 正面状态（盟友、上升、增益） |
| `--mw-neg-color` | `#dc2626` | 负面状态（敌对、下降、减益） |
| `--mw-neu-color` | `#6b7280` | 中性状态（稳定） |

### 稀有度颜色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-rarity-common` | `#9ca3af` | 普通（灰色） |
| `--mw-rarity-rare` | `#3b82f6` | 稀有（蓝色） |
| `--mw-rarity-epic` | `#8b5cf6` | 史诗（紫色） |
| `--mw-rarity-legendary` | `#f59e0b` | 传说（金色） |

### 语义颜色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-success-color` | `#16a34a` | 成功（绿色） |
| `--mw-warning-color` | `#f59e0b` | 警告（黄色） |
| `--mw-error-color` | `#dc2626` | 错误（红色） |
| `--mw-info-color` | `#3b82f6` | 信息（蓝色） |

### 字体系统

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-font-sans` | `'Inter', -apple-system, ...` | 无衬线字体栈 |
| `--mw-font-mono` | `'Fira Code', 'Consolas', ...` | 等宽字体栈 |

### 间距系统

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-spacing-2xs` | `0.125rem` (2px) | 超小间距 |
| `--mw-spacing-xs` | `0.25rem` (4px) | 小间距 |
| `--mw-spacing-sm` | `0.5rem` (8px) | 较小间距 |
| `--mw-spacing-md` | `1rem` (16px) | 中等间距 |
| `--mw-spacing-lg` | `1.5rem` (24px) | 较大间距 |
| `--mw-spacing-xl` | `2rem` (32px) | 大间距 |
| `--mw-spacing-2xl` | `2.5rem` (40px) | 超大间距 |
| `--mw-spacing-3xl` | `3rem` (48px) | 特大间距 |

### 圆角

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-radius-sm` | `4px` | 小圆角 |
| `--mw-radius-md` | `8px` | 中等圆角 |
| `--mw-radius-lg` | `12px` | 大圆角 |

### 阴影

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | 小阴影 |
| `--mw-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | 中等阴影 |
| `--mw-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | 大阴影 |

### 过渡动画

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-transition-fast` | `150ms ease` | 快速过渡 |
| `--mw-transition-base` | `250ms ease` | 标准过渡 |
| `--mw-transition-slow` | `350ms ease` | 慢速过渡 |

### 组件尺寸

#### Card 组件

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-card-avatar-size` | `120px` | 头像大小（移动端） |
| `--mw-card-avatar-border` | `2px` | 头像边框宽度 |
| `--mw-card-max-width` | `none` | 卡片最大宽度 |

> **注意**: 头像在平板上自动放大到 `120px * 1.25 = 150px`，桌面端放大到 `120px * 1.5 = 180px`

#### Numerical 组件

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-numerical-icon-size` | `2rem` (32px) | 图标/emoji尺寸 |
| `--mw-numerical-progress-height` | `8px` | 进度条高度 |

#### Inventory 组件

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--mw-inventory-columns` | `4` | 网格列数 |
| `--mw-inventory-item-min-height` | `100px` | 物品格子最小高度 |
| `--mw-inventory-icon-size` | `48px` | 物品图标尺寸 |
| `--mw-inventory-border-width` | `2px` | 物品边框宽度 |
| `--mw-inventory-border-width-hover` | `3px` | Hover时边框宽度 |

---

## 🏷️ CSS类名清单

所有类名都使用 `mw-` 前缀，避免与其他样式冲突。

### Card 组件（介绍卡片）

```html
<div class="mw-card mw-clickable">
  <img class="mw-card-avatar" src="..." alt="..." />
  <div class="mw-card-body">
    <h3 class="mw-card-name">名称</h3>
    <p class="mw-card-desc">描述</p>
    <blockquote class="mw-card-dictum">"引言"</blockquote>
    <div class="mw-card-tags">
      <span class="mw-badge">标签1</span>
      <span class="mw-badge">标签2</span>
    </div>
  </div>
</div>
```

**类名说明**:
- `.mw-card` - 卡片容器
- `.mw-clickable` - 可点击变体（有hover效果）
- `.mw-card-avatar` - 头像图片
- `.mw-card-body` - 卡片主体内容区
- `.mw-card-name` - 名称/标题
- `.mw-card-desc` - 描述文本
- `.mw-card-dictum` - 引言/格言（blockquote）
- `.mw-card-tags` - 标签容器
- `.mw-badge` - 标签徽章

### Numerical 组件（数值面板）

```html
<div class="mw-numerical">
  <h3 class="mw-numerical-title">属性面板</h3>
  <div class="mw-numerical-item">
    <div class="mw-numerical-icon">💪</div>
    <div class="mw-numerical-content">
      <div class="mw-numerical-label">力量</div>
      <div class="mw-numerical-bar" style="--progress: 75"></div>
      <div class="mw-numerical-value">75/100</div>
    </div>
  </div>
</div>
```

**类名说明**:
- `.mw-numerical` - 数值面板容器
- `.mw-numerical-title` - 标题
- `.mw-numerical-item` - 单个数值条目
- `.mw-numerical-icon` - 图标容器
- `.mw-numerical-content` - 内容区域
- `.mw-numerical-label` - 标签文本
- `.mw-numerical-bar` - 进度条（使用 `--progress` CSS变量）
- `.mw-numerical-value` - 数值显示

### Inventory 组件（物品网格）

```html
<div class="mw-inventory" style="--columns: 4">
  <div class="mw-inventory-item mw-clickable" data-rarity="legendary">
    <span class="mw-inventory-amount">×3</span>
    <img class="mw-inventory-icon" src="..." alt="..." />
    <div class="mw-inventory-name">物品名称</div>
  </div>
  <!-- 或使用占位符 -->
  <div class="mw-inventory-item">
    <div class="mw-inventory-icon-placeholder">?</div>
    <div class="mw-inventory-name">未知物品</div>
  </div>
</div>
```

**类名说明**:
- `.mw-inventory` - 网格容器（使用 `--columns` 变量控制列数）
- `.mw-inventory-item` - 单个物品格子
- `.mw-clickable` - 可点击变体
- `[data-rarity]` - 稀有度属性：`common`、`rare`、`epic`、`legendary`
- `.mw-inventory-amount` - 数量徽章
- `.mw-inventory-icon` - 物品图标
- `.mw-inventory-icon-placeholder` - 占位符图标
- `.mw-inventory-name` - 物品名称

### 通用类

- `.mw-error` - 错误状态（应用于任何组件显示错误信息）
- `.mw-clickable` - 可点击状态（添加hover效果和鼠标样式）

---

## 🛠️ 主题开发方法

### 1. 仅变量覆盖（最简单）

适合快速调整颜色、间距、尺寸等基础样式。

```css
/* minimal-theme.css */
:root {
  /* 配色方案 */
  --mw-primary-color: #10b981;
  --mw-bg-color: #f9fafb;
  
  /* 紧凑布局 */
  --mw-spacing-md: 0.75rem;
  --mw-spacing-lg: 1rem;
  
  /* 更小的圆角 */
  --mw-radius-md: 4px;
  
  /* 组件尺寸 */
  --mw-card-avatar-size: 100px;
  --mw-inventory-columns: 6;
}
```

### 2. 变量 + 部分样式覆盖

在变量基础上，针对特定组件微调。

```css
/* glass-theme.css */
:root {
  --mw-bg-color: rgba(255, 255, 255, 0.1);
  --mw-border-color: rgba(255, 255, 255, 0.2);
}

.mw-card,
.mw-numerical,
.mw-inventory {
  backdrop-filter: blur(10px);
  border: 1px solid var(--mw-border-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 3. 完全自定义

完全控制样式，适合创建高度定制的主题。

```css
/* custom-theme.css */

/* 保留基础样式或完全不导入 */
/* @import 'markdown-worldview/style.css'; */

/* 从头定义所有样式 */
.mw-card {
  display: flex;
  /* ... 你的完整样式 */
}
```

---

## 🔗 框架集成指南

### VitePress

在 `.vitepress/theme/index.ts` 中导入：

```typescript
import DefaultTheme from 'vitepress/theme'
import 'markdown-worldview/style.css'  // 基础样式
import './my-theme.css'                // 你的主题

export default {
  extends: DefaultTheme,
  // ...
}
```

或在 `.vitepress/theme/style.css` 中覆盖变量：

```css
/* .vitepress/theme/style.css */
:root {
  --mw-primary-color: var(--vp-c-brand-1); /* 使用VitePress主题色 */
  --mw-bg-color: var(--vp-c-bg);
  --mw-text-color: var(--vp-c-text-1);
}
```

通过 `config.mts` 引入外部主题：

```typescript
export default defineConfig({
  head: [
    ['link', { 
      rel: 'stylesheet', 
      href: 'https://cdn.example.com/my-theme.css' 
    }]
  ],
  // ...
})
```

### Obsidian

在 `.obsidian/snippets/` 目录下创建CSS文件：

```css
/* .obsidian/snippets/worldview-theme.css */
@import url('app://obsidian.md/path/to/markdown-worldview/style.css');

:root {
  --mw-primary-color: var(--interactive-accent);
  --mw-bg-color: var(--background-primary);
  --mw-text-color: var(--text-normal);
  --mw-border-color: var(--background-modifier-border);
}
```

在 Obsidian 设置中启用该CSS片段。

### 纯HTML项目

在 `<head>` 中引入样式：

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/markdown-worldview/dist/style.css">
  <link rel="stylesheet" href="my-theme.css">
</head>
<body>
  <!-- 你的内容 -->
</body>
</html>
```

### 打包工具（Webpack/Vite/Rollup）

在你的入口文件中导入：

```javascript
// main.js
import 'markdown-worldview/style.css';
import './my-theme.css';
```

---

## ✨ 最佳实践

### 1. 使用CSS变量优先

尽可能通过CSS变量实现主题化，而不是直接覆盖类样式。这样：
- 更容易维护
- 未来新增组件自动应用你的主题
- 减少CSS文件大小

### 2. 保持语义化

覆盖样式时保持语义化的CSS变量命名：

```css
/* ✅ 好的做法 */
:root {
  --mw-primary-color: var(--my-brand-color);
}

/* ❌ 不推荐 */
.mw-card {
  border-color: #ff00ff; /* 硬编码颜色 */
}
```

### 3. 考虑暗色模式

如果你的主题包含自定义颜色，记得提供暗色模式支持：

```css
:root {
  --mw-primary-color: #3b82f6;
}

@media (prefers-color-scheme: dark) {
  :root {
    --mw-primary-color: #60a5fa; /* 暗色模式下稍亮 */
  }
}
```

### 4. 测试响应式

确保在不同屏幕尺寸下测试你的主题：

```css
/* 移动端优化 */
@media (max-width: 768px) {
  :root {
    --mw-card-avatar-size: 80px; /* 更小的头像 */
    --mw-spacing-lg: 0.75rem;    /* 紧凑间距 */
  }
}
```

### 5. 使用CSS变量计算

利用 `calc()` 创建一致的比例关系：

```css
:root {
  --mw-base-size: 16px;
  --mw-card-avatar-size: calc(var(--mw-base-size) * 7.5); /* 120px */
  --mw-inventory-icon-size: calc(var(--mw-base-size) * 3); /* 48px */
}
```

### 6. 避免 `!important`

尽量不使用 `!important`，通过提高CSS特异性解决冲突：

```css
/* ✅ 推荐 */
.my-custom-container .mw-card {
  background: #f0f0f0;
}

/* ❌ 避免 */
.mw-card {
  background: #f0f0f0 !important;
}
```

### 7. 文档化你的主题

如果你创建的主题供他人使用，添加注释说明：

```css
/**
 * Forest Theme for Markdown-Worldview
 * Author: Your Name
 * Description: 自然风格的深色主题
 */

:root {
  /* 主色调 - 森林绿 */
  --mw-primary-color: #10b981;
  
  /* 背景 - 深灰绿 */
  --mw-bg-color: #1a2e1a;
  
  /* ... */
}
```

---

## 🎯 示例主题

查看 `examples/themes/` 目录下的完整示例：

- **dark-forest.css** - 深色森林风格主题
- **light-minimal.css** - 简约亮色主题
- **variables-only.css** - 最小化变量覆盖示例

---

## 📖 进一步阅读

- [CSS自定义属性 (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)
- [CSS变量完整指南 (CSS-Tricks)](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [VitePress主题定制](https://vitepress.dev/guide/extending-default-theme)

---

**有问题？** 请在 [GitHub Issues](https://github.com/NekoMake/markdown-worldview/issues) 提出！
