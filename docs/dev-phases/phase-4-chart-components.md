# Phase 4: 图表组件实现 (ECharts)

## 🎯 本阶段目标

1. ✅ 实现 Radar（雷达图）组件 - 展示多维素质平衡
2. ✅ 实现 Power（势力综测面板）组件 - 展示综合国力
3. ✅ 创建客户端 ECharts 管理器 - 懒加载、生命周期管理、响应式调整
4. ✅ 提供统一的 `initMarkdownWorldview()` 初始化函数
5. ✅ 按需导入 ECharts（体积优化：1.5MB → ~450KB）
6. ✅ 更新构建配置支持多入口点

**完成日期**：2026-04-03

---

## ✅ 已完成的工作

### 1. ECharts 管理器（客户端核心）

#### 文件路径
- `src/client/echarts-manager.ts`

#### 核心功能
- ✅ **懒加载策略**：首次需要时动态 `import()` ECharts 库
- ✅ **按需导入**：
  - `echarts/core` (核心)
  - `echarts/charts` (RadarChart, BarChart)
  - `echarts/components` (GridComponent, TooltipComponent, TitleComponent)
  - `echarts/renderers` (CanvasRenderer)
- ✅ **生命周期管理**：
  - `initChart()` - 初始化单个图表实例
  - `initializePageCharts()` - 扫描并初始化所有图表 (`[data-mw-chart-type]`)
  - `destroyAll()` - 销毁所有实例并清理资源
- ✅ **响应式支持**：
  - `ResizeObserver` 监听容器尺寸变化
  - `resizeAll()` 调整所有图表
- ✅ **错误处理**：失败时显示降级 UI

#### 关键实现
```typescript
class EChartsManager {
  private echartsPromise: Promise<typeof echarts> | null = null;
  private instances = new Map<HTMLElement, echarts.ECharts>();
  private resizeObserver: ResizeObserver | null = null;

  async getECharts() { /* 懒加载并缓存 */ }
  async initChart(container, config) { /* 初始化图表 */ }
  async initializePageCharts() { /* 批量初始化 */ }
  resizeAll() { /* 响应式调整 */ }
  destroyAll() { /* 清理资源 */ }
}

export const echartsManager = new EChartsManager(); // 单例
```

---

### 2. 图表配置构建器（客户端）

#### 文件路径
- `src/client/chart-configs.ts`

#### 核心功能
- ✅ `buildRadarConfig(data)` - 将 YAML 数据转换为 ECharts 雷达图配置
- ✅ `buildPowerConfig(data)` - 将 YAML 数据转换为 ECharts 柱状图配置
- ✅ 统一的主题适配（使用 CSS 变量）
- ✅ 类型安全的数据验证

#### 主题集成
```typescript
// 使用 CSS 变量实现主题
textStyle: {
  color: 'var(--mw-text-color)'
},
lineStyle: {
  color: 'var(--mw-primary-color)'
}
```

---

### 3. Radar 组件（服务端渲染器）

#### 文件路径
- `src/components/radar.ts`

#### 接口定义
```typescript
interface RadarData {
  title?: string;                 // 可选：标题
  data: Record<string, number>;   // 必填：维度数据（0-100）
}
```

#### YAML 示例
```yaml
title: 苍之剑圣 · 阿尔忒尼斯
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```

#### 输出 HTML
```html
<div 
  class="mw-chart mw-chart-radar"
  data-mw-chart-type="radar"
  data-mw-chart-config='{"title":"...","data":{...}}'
  style="height: 400px; width: 100%;"
>
  <div class="mw-chart-loading">加载中...</div>
</div>
```

#### 验证规则
- ✅ `data` 必须是对象
- ✅ 所有值必须是数字
- ✅ 数值范围：0-100
- ✅ XSS 防护（escapeHtml）

---

### 4. Power 组件（服务端渲染器）

#### 文件路径
- `src/components/power.ts`

#### 接口定义
```typescript
interface PowerData {
  faction: string;                                   // 必填：势力名称
  leader?: string;                                   // 可选：领袖
  status?: string;                                   // 可选：状态
  data: Record<string, number | [number, string]>;  // 必填：数值数据
  trend?: Record<string, 'rising' | 'stable' | 'falling'>;  // 可选：趋势
}
```

#### YAML 示例
```yaml
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

#### 混合渲染策略
- **纯 CSS（服务端）**：
  - 头部（faction, leader, status）
  - 趋势指示器（↑ → ↓）
- **ECharts（客户端）**：
  - 柱状图（data 数值）

#### 状态映射
```typescript
const STATUS_MAP = {
  '战争状态': 'neg',  // --mw-neg-color (红色)
  '和平时期': 'pos',  // --mw-pos-color (绿色)
  '中立': 'neu'      // --mw-neu-color (灰色)
};
```

---

### 5. 统一初始化函数（客户端入口）

#### 文件路径
- `src/client/init.ts`

#### 核心 API
```typescript
async function initMarkdownWorldview(options?: InitOptions): Promise<() => void>
```

#### InitOptions
```typescript
interface InitOptions {
  debug?: boolean;  // 调试模式（显示详细日志）
}
```

#### 职责分离
- **服务端**（markdown-it 配置）：配置 `onNavigate`，渲染 HTML
- **客户端**（`initMarkdownWorldview`）：只负责图表等需要 DOM API 的功能
- **导航处理**：由服务端配置的 `onNavigate` 自动处理

#### 使用示例
```typescript
// VitePress 主题
import { initMarkdownWorldview } from 'markdown-worldview/client';

export default {
  async enhanceApp({ router }) {
    if (typeof window !== 'undefined') {
      const cleanup = await initMarkdownWorldview({ debug: true });
      
      router.onBeforeRouteChange = () => cleanup();
      router.onAfterRouteChanged = async () => {
        await initMarkdownWorldview({ debug: true });
      };
    }
  }
}
```

---

### 6. 组件注册表更新

#### 文件路径
- `src/components/registry.ts`

#### 修改内容
```typescript
// 新增导入
import { renderRadar } from './radar';
import { renderPower } from './power';

// 替换占位符
componentRegistry.register('radar', renderRadar);
componentRegistry.register('power', renderPower);
```

---

### 7. CSS 样式

#### 文件 A: `src/styles/components/radar.css`
- `.mw-chart-radar` - 图表容器样式
- `.mw-chart-loading` - 加载占位符
- 深色模式适配

#### 文件 B: `src/styles/components/power.css`
- `.mw-power` - 组件容器
- `.mw-power-header` - 头部信息
- `.mw-power-status` - 状态标签（pos/neg/neu）
- `.mw-power-trend` - 趋势指示器
- `.mw-trend-icon` - 趋势图标（↑/→/↓）
- 响应式布局（移动端优化）

#### 文件 C: `src/styles/index.css`
```css
@import './components/radar.css';
@import './components/power.css';
```

---

### 8. 构建配置更新

#### 文件 A: `vite.config.ts`

**关键修改**：
- ✅ 多入口点：`{ index, client }`
- ✅ 仅 ESM 格式（多入口不支持 UMD）
- ✅ External 配置：`markdown-it`, `js-yaml`, `echarts/*`
- ✅ 文件命名：
  - `dist/index.js` (主入口)
  - `dist/client.js` (客户端入口)
  - `dist/style.css` (样式)

```typescript
build: {
  lib: {
    entry: {
      index: resolve(__dirname, 'src/index.ts'),
      client: resolve(__dirname, 'src/client/init.ts'),
    },
    formats: ['es'],
    fileName: (format, entryName) => `${entryName}.js`,
  },
  rollupOptions: {
    external: [
      'markdown-it',
      'js-yaml',
      'echarts',
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers',
    ],
  },
}
```

---

#### 文件 B: `package.json`

**新增导出**：
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "types": "./dist/client.d.ts",
      "import": "./dist/client.js"
    },
    "./style.css": "./dist/style.css"
  },
  "peerDependencies": {
    "markdown-it": "^14.0.0",
    "echarts": "^5.5.0"
  }
}
```

**说明**：
- `echarts` 作为 `peerDependency`，用户需要自行安装
- 支持树摇优化（按需导入 ECharts 组件）

---

### 9. 使用示例文档

#### 文件路径
- `examples/phase4-charts.md`

#### 包含内容
- ✅ Radar 组件示例（3 个）
- ✅ Power 组件示例（3 个）
- ✅ 服务端配置说明
- ✅ 客户端初始化说明
- ✅ 普通网页使用示例
- ✅ 样式定制指南
- ✅ 技术细节说明
- ✅ 故障排查指南

---

## 🧪 验证结果

### 1. 构建成功 ✅
```bash
$ npm run build
✓ 14 modules transformed.
dist/style.css  30.06 kB
dist/client.js   7.41 kB
dist/index.js   14.00 kB
✓ built in 5.21s
```

### 2. 生成文件 ✅
- `dist/index.js` - 主入口（14KB）
- `dist/index.d.ts` - 类型声明
- `dist/client.js` - 客户端入口（7.4KB）
- `dist/client.d.ts` - 客户端类型声明
- `dist/style.css` - 样式文件（30KB）
- 所有 `.map` 文件（source maps）

### 3. 类型检查通过 ✅
```bash
$ npm run type-check
# 无错误
```

---

## 🔗 相关文件清单

### 新增文件
- `src/client/echarts-manager.ts` - ECharts 实例管理器
- `src/client/chart-configs.ts` - 图表配置构建函数
- `src/client/init.ts` - 统一初始化函数
- `src/components/radar.ts` - Radar 组件渲染器
- `src/components/power.ts` - Power 组件渲染器
- `src/styles/components/radar.css` - Radar 样式
- `src/styles/components/power.css` - Power 样式
- `examples/phase4-charts.md` - 使用示例文档

### 修改文件
- `src/components/registry.ts` - 注册 radar/power 渲染器
- `src/styles/index.css` - 导入新样式
- `vite.config.ts` - 多入口配置
- `package.json` - 新增 `./client` 导出和 echarts peerDependency

---

## 📌 给下一阶段 AI 的提示

### 1. ECharts 主题适配
目前使用硬编码的颜色值（如 `rgba(37, 99, 235, 0.1)`）。如果需要动态适配主题，可以：
- 方案 A：客户端读取 CSS 变量（`getComputedStyle`）
- 方案 B：提供主题配置对象

### 2. 图表交互增强
当前图表是静态的。未来可以考虑：
- 点击数据点跳转到相关页面
- Tooltip 中嵌入链接
- 图例交互

### 3. 性能优化
如果页面有大量图表（>10 个）：
- 方案 A：懒加载（Intersection Observer）
- 方案 B：虚拟滚动
- 方案 C：图表池（复用实例）

### 4. SSR 兼容性
`initMarkdownWorldview()` 使用了 `document` 和 `ResizeObserver`。在 SSR 环境：
- ✅ 已添加 `typeof window !== 'undefined'` 检查
- ⚠️ 确保在 VitePress 等 SSR 框架中正确使用

### 5. 单元测试
Phase 4 未包含单元测试。建议添加：
- `radar.test.ts` - 服务端渲染测试
- `power.test.ts` - 服务端渲染测试
- `echarts-manager.test.ts` - 生命周期管理测试（需要 jsdom）

---

## 🔗 决策记录

### 为什么只输出 ESM 格式？
- **问题**：Vite 不支持多入口点同时输出 UMD 格式
- **解决**：只输出 ESM（`formats: ['es']`）
- **影响**：不支持旧式 `<script>` 标签引入，必须使用模块系统

### 为什么 ECharts 是 peerDependency？
- 避免强制打包 1.5MB 的 ECharts
- 用户可以自主选择版本
- 支持树摇优化（按需导入组件）

### 为什么使用 ResizeObserver？
- `window.resize` 无法检测容器大小变化（如侧边栏折叠）
- ResizeObserver 提供更精确的响应式支持
- 现代浏览器均已支持

### 为什么 initMarkdownWorldview() 不负责导航？
- **职责分离**：导航是插件配置的一部分（服务端）
- **避免重复**：用户无需在服务端和客户端两处配置
- **架构清晰**：客户端只负责需要 DOM API 的功能

---

## 📅 完成时间

**实际完成**: 2026-04-03  
**预计时间**: 2026-04-04  
**提前**: 1 天

---

**下一阶段**: Phase 5 - 图形组件（Relations, Hierarchy, Timeline）使用 vis-network 和 vis-timeline
