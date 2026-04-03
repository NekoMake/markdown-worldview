# Power - 势力综测

::: tip Phase 4 已完成
此组件已在 Phase 4 完成开发，混合 ECharts + 纯 CSS 实现。
:::

## 组件介绍

Power 组件用于展示势力或组织的综合状态，包括数值统计、趋势分析等。采用混合渲染：头部和趋势使用纯 CSS，数值图表使用 ECharts 柱状图。

## 功能特性

- ✅ 多维度数值展示（柱状图）
- ✅ 趋势标识（上升 ↑ / 稳定 → / 下降 ↓）
- ✅ 状态颜色映射（战争/和平/中立）
- ✅ 领袖信息展示
- ✅ 数值描述支持（可选）
- ✅ 响应式布局

## YAML 语法

````markdown
```power
faction: 凛冬帝国
leader: 亚历山大三世
status: 战争状态
data:
  经济实力: [80, "产出：魔导矿石"]
  军事实力: [95, "常备军：12万"]
  人口规模: [65, "总人口：450万"]
trend:
  经济: rising
  军事: stable
  外交: falling
```
````

## 布局结构

```
┌─────────────────────────┐
│  凛冬帝国 (战争状态)      │ ← 状态颜色高亮
│  领袖：亚历山大三世       │
├─────────────────────────┤
│  [ECharts 柱状图]        │
├─────────────────────────┤
│  趋势：                   │
│    经济 ↑  军事 →  外交 ↓ │
└─────────────────────────┘
```

## 示例

### 完整示例

````markdown
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
````

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

### 简化版（无趋势）

````markdown
```power
faction: 影之国
leader: 暗影女王
status: 中立
data:
  经济实力: 60
  军事实力: 85
  人口规模: 45
  科技水平: 90
```
````

```power
faction: 影之国
leader: 暗影女王
status: 中立
data:
  经济实力: 60
  军事实力: 85
  人口规模: 45
  科技水平: 90
```

## 数据要求

### 必填字段

- **`faction`** - 势力名称（字符串）
- **`data`** - 数值数据（对象）
  - 值可以是数字：`经济实力: 80`
  - 或数组（带描述）：`经济实力: [80, "描述文本"]`
  - 所有值范围：0-100

### 可选字段

- **`leader`** - 领袖名称（字符串）
- **`status`** - 状态标签（字符串）
  - 自动识别关键词映射颜色：
    - 战争状态/危机 → 红色
    - 和平时期/繁荣 → 绿色
    - 中立/稳定 → 灰色
- **`trend`** - 趋势指标（对象）
  - 值可以是：`rising` (↑), `stable` (→), `falling` (↓)

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

组件使用 CSS 变量控制颜色：

```css
:root {
  /* 主色调 */
  --mw-primary-color: #2563eb;
  
  /* 状态颜色 */
  --mw-pos-color: #16a34a;  /* 正面（和平、繁荣） */
  --mw-neg-color: #dc2626;  /* 负面（战争、危机） */
  --mw-neu-color: #6b7280;  /* 中立（稳定） */
}
```

## 技术实现

- **混合渲染**: 头部/趋势用纯 CSS，柱状图用 ECharts
- **按需加载**: 首次使用时动态导入 ECharts
- **响应式**: 移动端自动调整布局

## 相关文档

- [Radar 雷达图](/components/radar) - 多维属性对比
- [Phase 4 完成文档](https://github.com/your-repo/markdown-worldview/blob/main/docs/dev-phases/phase-4-chart-components.md)
- [ECharts 柱状图文档](https://echarts.apache.org/examples/zh/editor.html?c=bar-simple)

---

**完成时间**：2026-04-03  
**Phase**: 4 - 图表组件
