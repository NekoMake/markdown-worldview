# Radar - 雷达图

::: tip Phase 4 已完成
此组件已在 Phase 4 完成开发，基于 ECharts 实现。
:::

## 组件介绍

Radar 组件用于展示多维度属性对比，适合角色能力、势力综合实力等场景。基于 ECharts 雷达图实现，支持自动响应式调整。

## 功能特性

- ✅ 多维度数据可视化
- ✅ 自动最大值设置（默认 100）
- ✅ 主题颜色自适应（CSS 变量）
- ✅ 响应式图表大小（ResizeObserver）
- ✅ 按需加载 ECharts（懒加载）

## YAML 语法

````markdown
```radar
title: 阿尔忒尼斯
description: 传奇剑士，以剑术和速度闻名于世
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```
````

## 示例

### 基础示例

````markdown
```radar
title: 苍之剑圣 · 阿尔忒尼斯
description: 传奇剑士，以剑术和速度闻名于世
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```
````

```radar
title: 苍之剑圣 · 阿尔忒尼斯
description: 传奇剑士，以剑术和速度闻名于世
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```

### 无标题示例

````markdown
```radar
data:
  攻击力: 85
  防御力: 70
  速度: 90
  智力: 75
  魅力: 65
```
````

```radar
data:
  攻击力: 85
  防御力: 70
  速度: 90
  智力: 75
  魅力: 65
```

## 数据要求

- **`data`** (必填) - 对象类型，键为维度名称，值为 0-100 的数字
- **`title`** (可选) - 字符串类型，图表标题

## 客户端初始化

::: warning 重要
使用图表组件需要在客户端初始化 ECharts。详见[安装与配置 - 客户端初始化](/guide/installation#客户端初始化-phase-4)
:::

```typescript
import { initMarkdownWorldview } from 'markdown-worldview/client'

// 初始化所有图表
await initMarkdownWorldview({ debug: true })
```

## 样式定制

图表颜色由 CSS 变量控制：

```css
:root {
  --mw-primary-color: #2563eb;  /* 雷达图主色 */
  --mw-text-color: #1f2937;     /* 文字颜色 */
  --mw-border-color: #e5e7eb;   /* 边框颜色 */
}
```

## 技术实现

- **渲染方式**: 服务端生成 HTML 容器 + 客户端 ECharts 渲染
- **按需加载**: 首次使用时动态导入 ECharts（~450KB）
- **响应式**: ResizeObserver 自动调整图表尺寸

## 相关文档

- [Power 势力综测](/components/power) - 柱状图组件
- [Phase 4 完成文档](https://github.com/your-repo/markdown-worldview/blob/main/docs/dev-phases/phase-4-chart-components.md)
- [ECharts 官方文档](https://echarts.apache.org/)

---

**完成时间**：2026-04-03  
**Phase**: 4 - 图表组件
