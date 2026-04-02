# Markdown-Worldview 开发总计划

> **基于**：Markdown-it-webview (v2.2) 设计规范  
> **创建日期**：2026-04-02  
> **项目目标**：构建一个可扩展的、支持 8 种世界观组件的 markdown-it 插件

---

## 📐 核心架构原则

1. **YAML 数据驱动** - 所有组件代码块内部采用标准 YAML 语法
2. **内容与样式分离** - 数据与视觉通过 CSS 变量统一控制
3. **适配器模式** - 通过 `onNavigate` 回调委托导航逻辑给宿主环境
4. **Wiki 联动系统** - 所有组件支持 `link` 字段实现页面跳转
5. **精简极客风格** - 默认采用 Minimalist Wiki 设计

---

## 🎯 8 个组件及其技术栈选型

| 组件名称 | 技术实现 | 优先级 | 复杂度 |
|:--------|:---------|:------|:------|
| **Card (介绍卡片)** | Pure CSS (Flex) | ⭐⭐⭐ 高 | 🟢 低 |
| **Numerical (数值面板)** | Pure CSS (Grid) | ⭐⭐⭐ 高 | 🟢 低 |
| **Inventory (物品网格)** | Pure CSS (Grid) | ⭐⭐ 中 | 🟡 中 |
| **Radar (雷达图)** | ECharts | ⭐⭐⭐ 高 | 🟡 中 |
| **Power (势力综测)** | ECharts | ⭐⭐ 中 | 🟡 中 |
| **Relations (关系图)** | vis-network | ⭐⭐⭐ 高 | 🔴 高 |
| **Hierarchy (层级架构)** | vis-network | ⭐⭐ 中 | 🟡 中 |
| **Timeline (时间线)** | vis-timeline | ⭐⭐ 中 | 🔴 高 |

---

## 📅 开发阶段划分

### ✅ Phase 1: 项目初始化和基础架构（已完成）
**完成日期**：2026-04-01

**核心成果**：
- ✅ TypeScript + Vite + Vitest 完整工具链
- ✅ markdown-it 插件核心架构（fence 代码块拦截）
- ✅ 适配器模式导航系统 (`onNavigate`)
- ✅ YAML 解析器和验证工具
- ✅ 8 个组件占位渲染器
- ✅ 基础 CSS 变量系统

**详细文档**：[Phase 1 Foundation](./dev-phases/phase-1-foundation.md)

---

### ⏳ Phase 2: CSS主题系统与设计变量

**目标**：建立完整的视觉规范体系，为所有组件提供统一的样式基础。

#### 2.1 核心任务

1. **完善 CSS 变量系统** (`src/styles/variables.css`)
   ```css
   :root {
     /* 基础颜色 */
     --mw-primary-color: #2563eb;
     --mw-bg-color: #ffffff;
     --mw-text-color: #1f2937;
     --mw-text-muted: #6b7280;
     --mw-border-color: #e5e7eb;

     /* 状态颜色 */
     --mw-pos-color: #16a34a;   /* 盟友/上升/增益 */
     --mw-neg-color: #dc2626;   /* 敌对/下降/减益 */
     --mw-neu-color: #6b7280;   /* 中立/稳定 */

     /* 稀有度映射 */
     --mw-rarity-common: #9ca3af;
     --mw-rarity-rare: #3b82f6;
     --mw-rarity-epic: #8b5cf6;
     --mw-rarity-legendary: #f59e0b;

     /* 字体系统 */
     --mw-font-sans: 'Inter', -apple-system, sans-serif;
     --mw-font-mono: 'Fira Code', 'JetBrains Mono', monospace;

     /* 间距系统 */
     --mw-space-xs: 0.25rem;
     --mw-space-sm: 0.5rem;
     --mw-space-md: 1rem;
     --mw-space-lg: 1.5rem;
     --mw-space-xl: 2rem;

     /* 圆角 */
     --mw-radius-sm: 4px;
     --mw-radius-md: 8px;
     --mw-radius-lg: 12px;

     /* 阴影 */
     --mw-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
     --mw-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
   }

   /* 深色模式 */
   @media (prefers-color-scheme: dark) {
     :root {
       --mw-bg-color: #111827;
       --mw-text-color: #f9fafb;
       --mw-text-muted: #9ca3af;
       --mw-border-color: #374151;
     }
   }
   ```

2. **创建通用组件样式** (`src/styles/components.css`)
   - 基础容器样式 (`.mw-container`)
   - 标题统一样式 (`.mw-title`)
   - 链接交互效果 (`.mw-link`)
   - 卡片基础样式 (`.mw-card-base`)

3. **创建工具类库** (`src/styles/utilities.css`)
   - 响应式网格系统
   - 间距辅助类
   - 文本对齐类

#### 2.2 验证标准

- [ ] 所有颜色值均使用 CSS 变量定义
- [ ] 深色模式自动适配
- [ ] 所有组件继承统一的设计语言
- [ ] 通过 PostCSS 自动添加浏览器前缀

#### 2.3 关键文件

- `src/styles/variables.css` - 全局变量
- `src/styles/components.css` - 组件基础样式
- `src/styles/utilities.css` - 工具类
- `src/styles/index.css` - 样式汇总入口

---

### ⏳ Phase 3: 纯CSS组件实现

**目标**：完成 Card、Numerical、Inventory 三个基础组件的渲染器。

#### 3.1 Card (介绍卡片) - 优先级⭐⭐⭐

**YAML 示例**：
```yaml
name: 艾蕾娜·星语
avatar: /path/to/elena.jpg
description: 银月森林的守护者
dictum: "森林记得每一个名字"
tags: [精灵, 传奇射手, 守序中立]
link: /wiki/elena
```

**实现要点**：
1. 创建 `src/components/card.ts`
2. 解析 YAML 并验证必填字段 (`name`)
3. 渲染 HTML 结构：
   ```html
   <div class="mw-card">
     <img class="mw-card-avatar" src="..." alt="...">
     <div class="mw-card-body">
       <h3 class="mw-card-name">艾蕾娜·星语</h3>
       <p class="mw-card-desc">...</p>
       <blockquote class="mw-card-dictum">...</blockquote>
       <div class="mw-card-tags">
         <span class="mw-tag">精灵</span>
       </div>
     </div>
   </div>
   ```
4. 绑定点击事件到 `onNavigate`
5. 响应式布局（移动端头像上移）

**测试用例**：
- 完整字段渲染
- 缺失可选字段降级处理
- 无 link 时不绑定事件
- XSS 防护（对 description 进行 HTML 转义）

---

#### 3.2 Numerical (数值面板) - 优先级⭐⭐⭐

**YAML 示例**：
```yaml
title: 当前状态
items:
  - label: 生命值
    value: 85
    max: 100
    icon: ❤️
  - label: 以太存量
    value: 420
    max: 2000
    icon: ✨
```

**实现要点**：
1. 创建 `src/components/numerical.ts`
2. 渲染进度条（使用 CSS `linear-gradient`）
3. 计算百分比：`(value / max) * 100`
4. 支持无 max 时只显示数值
5. icon 可选渲染

**CSS 关键点**：
```css
.mw-numerical-bar {
  background: linear-gradient(
    to right,
    var(--mw-primary-color) 0% calc(var(--progress) * 1%),
    var(--mw-border-color) calc(var(--progress) * 1%) 100%
  );
}
```

**测试用例**：
- 进度条百分比计算正确
- 无 max 时只显示数值
- icon 存在与不存在两种情况

---

#### 3.3 Inventory (物品网格) - 优先级⭐⭐

**YAML 示例**：
```yaml
columns: 4
items:
  - name: 誓约之剑
    rarity: epic
    icon: /img/items/sword.png
    type: 武器
    desc: 传说中斩裂黑夜的名剑
    link: /wiki/items/oath-sword
    amount: 1
```

**实现要点**：
1. 创建 `src/components/inventory.ts`
2. CSS Grid 自适应布局 (`grid-template-columns: repeat(var(--columns), 1fr)`)
3. rarity 映射到 CSS 变量边框颜色
4. Tooltip 显示详细信息（使用 `title` 属性或自定义悬浮层）
5. amount 徽章显示

**rarity 映射逻辑**：
```typescript
const rarityColors = {
  common: 'var(--mw-rarity-common)',
  rare: 'var(--mw-rarity-rare)',
  epic: 'var(--mw-rarity-epic)',
  legendary: 'var(--mw-rarity-legendary)'
};
```

**测试用例**：
- 网格列数动态调整
- rarity 颜色正确映射
- 点击跳转正确触发

---

### ⏳ Phase 4: 图表组件实现 (ECharts)

**目标**：完成 Radar 和 Power 两个图表组件。

#### 4.1 Radar (雷达图) - 优先级⭐⭐⭐

**YAML 示例**：
```yaml
title: 阿尔忒尼斯
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```

**实现要点**：
1. 创建 `src/components/radar.ts`
2. 按需动态加载 ECharts（使用动态 `import()`）
3. 将 YAML 数据转换为 ECharts 配置
4. 响应窗口大小调整
5. 支持主题切换（亮色/深色）

**ECharts 配置模板**：
```typescript
{
  radar: {
    indicator: [
      { name: '武力', max: 100 },
      { name: '敏捷', max: 100 },
      // ...
    ]
  },
  series: [{
    type: 'radar',
    data: [{ value: [98, 92, 45, 72, 60] }]
  }]
}
```

**关键挑战**：
- 动态加载优化（避免首次加载过慢）
- 响应式适配（移动端缩放）
- 内存管理（组件销毁时清理实例）

**测试用例**：
- ECharts 懒加载成功
- 数据正确映射到雷达图
- 窗口调整时图表自动缩放

---

#### 4.2 Power (势力综测面板) - 优先级⭐⭐

**YAML 示例**：
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

**实现要点**：
1. 创建 `src/components/power.ts`
2. 混合渲染：ECharts 柱状图 + 纯 CSS 趋势标识
3. status 映射到颜色变量
4. 趋势图标渲染（↑ rising, → stable, ↓ falling）

**布局结构**：
```
┌─────────────────────────┐
│  凛冬帝国 (战争状态)      │ ← 红色高亮
│  领袖：亚历山大三世       │
├─────────────────────────┤
│  [ECharts 柱状图]        │
├─────────────────────────┤
│  趋势：                   │
│    经济 ↑  军事 →  外交 ↓ │
└─────────────────────────┘
```

**测试用例**：
- status 颜色正确关联
- 趋势图标正确显示
- 柱状图数据准确

---

### ⏳ Phase 5: 图形组件实现 (vis-network & vis-timeline)

**目标**：完成 Relations、Hierarchy、Timeline 三个复杂图形组件，使用 Vis.js 系列库统一实现。

#### 5.1 Relations (关系图) - 优先级⭐⭐⭐

**YAML 示例**：
```yaml
title: 大陆外交局势图
nodes:
  - id: A
    name: 凛冬帝国
    link: /factions/winter
    type: faction
  - id: B
    name: 影之国
    link: /factions/shadow
    type: faction
edges:
  - from: A
    to: B
    status: enemy
    label: 边境战争
```

**实现要点**：
1. 创建 `src/components/relations.ts`
2. 动态加载 vis-network 库
3. 将 YAML 转换为 vis-network 数据格式
4. 配置力导向图布局算法
5. 绑定节点点击事件触发 `onNavigate`
6. status 映射到边的颜色和样式

**vis-network 数据转换**：
```typescript
function toVisData(data) {
  const nodes = data.nodes.map(n => ({
    id: n.id,
    label: n.name,
    color: getNodeColor(n.type), // 根据 type 设置颜色
    font: { color: 'var(--mw-text-color)' }
  }));
  
  const edges = data.edges.map(e => ({
    from: e.from,
    to: e.to,
    label: e.label,
    color: getStatusColor(e.status), // enemy -> red, ally -> green
    dashes: e.status === 'enemy' ? true : false
  }));
  
  return { nodes, edges };
}
```

**vis-network 初始化配置**：
```typescript
const options = {
  physics: {
    enabled: true,
    forceAtlas2Based: {
      gravitationalConstant: -50,
      springLength: 100
    },
    solver: 'forceAtlas2Based'
  },
  interaction: {
    hover: true,
    navigationButtons: false,
    keyboard: false
  },
  edges: {
    width: 2,
    smooth: { type: 'continuous' }
  }
};

const network = new vis.Network(container, visData, options);

// 绑定点击事件
network.on('click', (params) => {
  if (params.nodes.length > 0) {
    const nodeId = params.nodes[0];
    const node = data.nodes.find(n => n.id === nodeId);
    if (node?.link && onNavigate) {
      onNavigate({ path: node.link, sourceElement: params.event.target });
    }
  }
});
```

**测试用例**：
- vis-network 数据转换正确
- 点击节点触发导航
- status 映射到边的颜色和样式（enemy=红色虚线，ally=绿色实线）
- 力导向布局稳定收敛

---

#### 5.2 Hierarchy (层级架构) - 优先级⭐⭐

**YAML 示例**：
```yaml
title: 帝国北方军团编制
direction: UD  # UD=上下, LR=左右, DU=下上, RL=右左
nodes:
  - name: 军团长：弗拉基米尔
    link: /chars/vladimir
    children:
      - name: 第三旗团 (重装步兵)
      - name: 第七旗团 (狮鹫骑士)
        children:
          - name: 第一大队
          - name: 第二大队
```

**实现要点**：
1. 创建 `src/components/hierarchy.ts`
2. 递归解析树形结构生成节点和边
3. 使用 vis-network 的分层布局（hierarchical layout）
4. 支持 direction 方向配置
5. 点击节点触发 onNavigate

**递归树形结构转换**：
```typescript
function flattenTree(nodes, parentId = null, result = { nodes: [], edges: [] }) {
  nodes.forEach((node, idx) => {
    const id = parentId ? `${parentId}-${idx}` : `root-${idx}`;
    
    result.nodes.push({
      id,
      label: node.name,
      level: getLevelDepth(parentId) // 用于分层布局
    });
    
    if (parentId) {
      result.edges.push({ from: parentId, to: id });
    }
    
    if (node.children) {
      flattenTree(node.children, id, result);
    }
  });
  
  return result;
}
```

**vis-network 分层布局配置**：
```typescript
const options = {
  layout: {
    hierarchical: {
      direction: data.direction || 'UD', // UD, DU, LR, RL
      sortMethod: 'directed',
      nodeSpacing: 150,
      levelSeparation: 200
    }
  },
  physics: false, // 分层布局不需要物理引擎
  edges: {
    smooth: { type: 'cubicBezier' },
    arrows: { to: { enabled: true } }
  }
};

const network = new vis.Network(container, visData, options);

// 绑定点击事件
network.on('click', (params) => {
  if (params.nodes.length > 0) {
    const nodeId = params.nodes[0];
    const node = findNodeById(data.nodes, nodeId);
    if (node?.link && onNavigate) {
      onNavigate({ path: node.link, sourceElement: params.event.target });
    }
  }
});
```

**测试用例**：
- 多层级树形结构正确展开
- UD/LR/DU/RL 方向切换正常
- 点击节点触发导航
- 层级间距和节点间距合理

---

#### 5.3 Timeline (时间线) - 优先级⭐⭐

**YAML 示例**：
```yaml
groups: [历史大事件, 个人传记]
events:
  - time: "前纪元 320"
    group: 历史大事件
    content: 万物凋零，魔力潮汐开始衰退。
  - time: "124.06.12"
    group: 个人传记
    content: 艾蕾娜出生。
    link: /events/elena-born
```

**实现要点**：
1. 创建 `src/components/timeline.ts`
2. 动态加载 Vis-timeline 库
3. 解析时间格式（支持自定义纪元）
4. 绑定 select 事件触发导航

**Vis-timeline 配置**：
```typescript
const items = events.map(e => ({
  id: e.id,
  group: e.group,
  content: e.content,
  start: parseDate(e.time)
}));

const timeline = new vis.Timeline(container, items, groups, {
  zoomable: true,
  moveable: true
});

timeline.on('select', (props) => {
  const event = events.find(e => e.id === props.items[0]);
  if (event.link && onNavigate) {
    onNavigate({ path: event.link });
  }
});
```

**关键挑战**：
- 自定义纪元时间解析
- 时间轴缩放交互优化
- 移动端触控支持

**测试用例**：
- 时间格式正确解析
- 点击事件触发导航
- 拖动缩放功能正常

---

### ⏳ Phase 6: VitePress 集成与文档站

**目标**：构建完整的组件文档站，提供交互式示例。

#### 6.1 核心任务

1. **配置 VitePress** (`docs/.vitepress/config.ts`)
   - 导航栏
   - 侧边栏
   - 自定义主题

2. **集成插件** (`docs/.vitepress/theme/index.ts`)
   ```typescript
   import markdownWorldview from 'markdown-worldview';
   import { useRouter } from 'vitepress';

   export default {
     extends: DefaultTheme,
     enhanceApp({ app, router, siteData }) {
       const md = createMarkdownIt();
       md.use(markdownWorldview, {
         onNavigate: (event) => {
           router.go(event.path);
         }
       });
     }
   };
   ```

3. **编写组件示例** (`docs/components/*.md`)
   - 每个组件一个页面
   - 包含多个用例
   - 实时预览效果

4. **编写集成指南** (`docs/guides/integration.md`)
   - Obsidian 集成示例
   - Logseq 集成示例
   - VitePress 集成示例
   - Nuxt 集成示例

#### 6.2 验证标准

- [ ] 所有组件示例正常渲染
- [ ] 可以复制 YAML 代码直接使用
- [ ] 导航跳转在文档站内正常工作
- [ ] 移动端适配良好

---

### ⏳ Phase 7: 测试与优化

**目标**：确保代码质量和性能达标。

#### 7.1 单元测试清单

**YAML 解析器测试** (`__tests__/yaml-parser.test.ts`)
- [ ] 合法 YAML 解析成功
- [ ] 非法 YAML 抛出错误
- [ ] XSS 攻击防护
- [ ] 必填字段验证

**导航适配器测试** (`__tests__/navigation.test.ts`)
- [ ] onNavigate 回调正确触发
- [ ] 无回调时输出警告
- [ ] 路径参数正确传递

**组件渲染测试**
- [ ] Card 组件完整渲染
- [ ] Numerical 进度条计算
- [ ] Inventory 网格布局
- [ ] Radar 数据映射
- [ ] Power 状态颜色
- [ ] Relations 节点点击
- [ ] Hierarchy 树形结构
- [ ] Timeline 时间解析

#### 7.2 性能优化

1. **按需加载第三方库**
   - ECharts 只在使用 radar/power 时加载
   - vis-network 只在使用 relations/hierarchy 时加载
   - vis-timeline 只在使用 timeline 时加载

2. **减少重绘**
   - 使用 CSS Transform 而非 top/left
   - 避免强制同步布局

3. **压缩优化**
   - 使用 Vite 的 Tree Shaking
   - 生产构建启用压缩

#### 7.3 验证标准

- [ ] 测试覆盖率 ≥ 80%
- [ ] 所有测试通过
- [ ] 打包体积 < 50KB (不含第三方库)
- [ ] 首屏渲染时间 < 100ms

---

### ⏳ Phase 8: 发布准备

**目标**：完成 npm 发布前的所有准备工作。

#### 8.1 完善文档

- [ ] README.md（英文）
- [ ] README.zh-CN.md（中文）
- [ ] CHANGELOG.md
- [ ] CONTRIBUTING.md
- [ ] LICENSE（MIT）

#### 8.2 发布清单

1. **语义化版本** (`v1.0.0`)
2. **npm 发布命令**：
   ```bash
   npm run build
   npm run test
   npm version 1.0.0
   npm publish
   ```
3. **创建 GitHub Release**
4. **提交到 npm 和 GitHub**

#### 8.3 验证标准

- [ ] 在新项目中能正常安装
- [ ] TypeScript 类型声明正确
- [ ] 所有示例代码可执行
- [ ] 文档站正常访问

---

## 🧪 全局验证标准

### 代码规范
- ✅ 所有文件使用 TypeScript
- ✅ 使用 2 空格缩进
- ✅ 导出函数包含 JSDoc 注释
- ✅ 通过 ESLint 检查

### 样式规范
- ✅ 所有颜色、字体、间距使用 CSS 变量
- ✅ 变量名以 `--mw-` 开头
- ✅ 支持深色模式

### 导航规范
- ✅ 所有 link 通过 onNavigate 回调
- ✅ 永不使用 window.location.href 或 router.push
- ✅ 提供清晰的警告信息

### 安全规范
- ✅ 所有用户输入经过 HTML 转义
- ✅ 路径参数经过 sanitize 处理
- ✅ 防止 XSS 攻击

---

## 📊 开发进度追踪

| Phase | 状态 | 完成日期 | 关键产出 |
|:------|:----|:---------|:---------|
| Phase 1 | ✅ 已完成 | 2026-04-01 | 基础架构、导航系统、YAML 解析器 |
| Phase 2 | ✅ 已完成 | 2026-04-02 | CSS 主题系统、响应式布局、工具类库 |
| Phase 3 | ✅ 已完成 | 2026-04-02 | Card, Numerical, Inventory 组件 |
| Phase 4 | ⏳ 待开始 | - | Radar, Power |
| Phase 5 | ⏳ 待开始 | - | Relations, Hierarchy, Timeline |
| Phase 6 | ⏳ 待开始 | - | VitePress 文档站 |
| Phase 7 | ⏳ 待开始 | - | 测试覆盖率 80%+ |
| Phase 8 | ⏳ 待开始 | - | npm 发布 v1.0.0 |

---

## 🔗 核心参考文档

1. **设计规范**：[Markdown-it-webview (v2.2)](./Markdown-it-webview(1).md)
2. **AI 协作指南**：[AI_GUIDE.md](../AI_GUIDE.md)
3. **Phase 1 完成报告**：[phase-1-foundation.md](./dev-phases/phase-1-foundation.md)
4. **markdown-it 官方文档**：https://markdown-it.github.io/
5. **VitePress 官方文档**：https://vitepress.dev/

---

## ⚠️ 关键风险与依赖

### 技术风险

1. **第三方库体积**
   - 风险：ECharts + vis-network + vis-timeline 总体积可能超过 800KB
   - 缓解：严格按需加载，考虑 CDN 方案，使用 Tree Shaking

2. **力导向图布局收敛**
   - 风险：vis-network 的力导向算法在节点较多时可能抖动或收敛慢
   - 缓解：调优物理引擎参数（gravitationalConstant、springLength），限制迭代次数

3. **自定义时间格式**
   - 风险：Vis-timeline 不支持自定义纪元（如"前纪元 320"）
   - 缓解：预处理时间字符串，转换为标准 Date 对象

### 依赖关系

```
Phase 1 (基础架构)
  ↓
Phase 2 (CSS 系统)
  ↓
Phase 3 (纯 CSS 组件) ← 依赖 Phase 2
  ↓
Phase 4 (图表组件) ← 依赖 Phase 2, 3
  ↓
Phase 5 (图形组件) ← 依赖 Phase 2, 3, 4
  ↓
Phase 6 (VitePress) ← 依赖所有前置 Phase
  ↓
Phase 7 (测试) ← 依赖所有前置 Phase
  ↓
Phase 8 (发布) ← 依赖所有前置 Phase
```

---

**最后更新**：2026-04-02  
**当前状态**：Phase 1 已完成，准备进入 Phase 2  
**下一步行动**：完善 CSS 变量系统和组件基础样式
