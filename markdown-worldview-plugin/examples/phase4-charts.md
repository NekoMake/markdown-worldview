# Phase 4: 图表组件示例

本文档展示 Phase 4 实现的两个图表组件：**Radar（雷达图）**和 **Power（势力综测面板）**。

---

## 🎯 Radar 雷达图

展示单一实体（人物、魔兽、遗物）的多维素质平衡。

### 示例 1: 角色属性

```radar
title: 苍之剑圣 · 阿尔忒尼斯
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```

### 示例 2: 无标题雷达图

```radar
data:
  攻击力: 85
  防御力: 70
  速度: 90
  智力: 75
  魅力: 65
```

### 示例 3: 游戏角色面板

```radar
title: 战士职业
data:
  力量: 95
  敏捷: 60
  智力: 40
  体质: 88
  精神: 50
```

---

## 💪 Power 势力综测面板

全方位展示国家、教派或军团的综合国力。

### 示例 1: 完整势力信息

```power
faction: 凛冬帝国
leader: 亚历山大三世
status: 战争状态
data:
  经济实力: [80, "产出：魔导矿石"]
  军事实力: [95, "常备军：12万"]
  人口规模: [65, "总人口：450万"]
  科技水平: [75, "魔法科技发达"]
trend:
  经济: rising
  军事: stable
  外交: falling
```

### 示例 2: 简化版（无描述）

```power
faction: 影之国
leader: 暗影女王
status: 中立
data:
  经济实力: 60
  军事实力: 85
  人口规模: 45
  科技水平: 90
trend:
  经济: stable
  军事: rising
  外交: stable
```

### 示例 3: 无趋势信息

```power
faction: 自由联盟
leader: 议会制
status: 和平时期
data:
  经济实力: [70, "贸易发达"]
  军事实力: [55, "防御型军队"]
  人口规模: [80, "人口众多"]
  科技水平: [65, "科技中等"]
```

---

## 📝 使用说明

### 服务端配置（markdown-it 插件）

在你的 markdown 配置文件中注册插件：

```typescript
// .vitepress/config.mts 或其他 markdown 配置
import { markdownWorldviewPlugin } from 'markdown-worldview';

md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    // 配置导航逻辑（会自动绑定到所有 [data-mw-link] 元素）
    console.log('Navigate to:', event.path);
  },
  debug: true
});
```

### 客户端初始化（图表渲染）

**VitePress 集成（推荐方式）**：

创建 `.vitepress/theme/Layout.vue`：

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

然后在 `.vitepress/theme/index.ts` 中引用：

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

### 普通网页使用

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/markdown-worldview/dist/style.css">
</head>
<body>
  <div id="content"></div>

  <script type="module">
    import MarkdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it/+esm';
    import { markdownWorldviewPlugin } from 'https://unpkg.com/markdown-worldview/+esm';
    import { initMarkdownWorldview } from 'https://unpkg.com/markdown-worldview/client/+esm';

    // 1. 配置 markdown-it
    const md = new MarkdownIt();
    md.use(markdownWorldviewPlugin, {
      onNavigate: (event) => {
        window.location.href = event.path;
      }
    });

    // 2. 渲染 markdown
    document.getElementById('content').innerHTML = md.render(yourMarkdown);

    // 3. 初始化图表
    await initMarkdownWorldview({ debug: true });
  </script>
</body>
</html>
```

---

## 🎨 样式定制

图表使用 CSS 变量，可以通过覆盖变量来定制主题：

```css
:root {
  --mw-primary-color: #2563eb;      /* 主色调（影响图表颜色） */
  --mw-bg-color: #ffffff;           /* 背景色 */
  --mw-text-color: #1f2937;         /* 文字颜色 */
  --mw-border-color: #e5e7eb;       /* 边框颜色 */
  
  /* 状态颜色 */
  --mw-pos-color: #16a34a;          /* 正面/上升 */
  --mw-neg-color: #dc2626;          /* 负面/下降 */
  --mw-neu-color: #6b7280;          /* 中立/稳定 */
}
```

---

## ⚙️ 技术细节

### Radar 组件

- **数据要求**: `data` 必须是对象，值为 0-100 的数字
- **可选字段**: `title`（标题）
- **渲染方式**: 服务端生成 HTML 容器 + 客户端 ECharts 渲染

### Power 组件

- **数据要求**: `data` 值可以是数字或 `[数字, 描述]` 数组
- **必填字段**: `faction`, `data`
- **可选字段**: `leader`, `status`, `trend`
- **状态映射**: 自动识别关键词（如"战争状态"→红色）
- **趋势图标**: `rising` (↑), `stable` (→), `falling` (↓)

---

## 🐛 故障排查

### 图表不显示

1. **检查客户端初始化**: 确保调用了 `initMarkdownWorldview()`
2. **检查 ECharts 安装**: `npm install echarts`
3. **检查控制台错误**: 开启 `debug: true` 查看详细日志

### 样式异常

1. **确保引入样式**: `import 'markdown-worldview/style.css'`
2. **检查 CSS 变量**: 确认主题系统正确加载
3. **深色模式问题**: 检查 `prefers-color-scheme` 媒体查询

### SPA 路由切换后图表消失

确保在路由切换时调用清理函数并重新初始化：

```typescript
router.onBeforeRouteChange = () => cleanup();
router.onAfterRouteChanged = async () => {
  await initMarkdownWorldview();
};
```

---

**Phase 4 完成日期**: 2026-04-03  
**下一阶段**: Phase 5 - 图形组件（Relations, Hierarchy, Timeline）
