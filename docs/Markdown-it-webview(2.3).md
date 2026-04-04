这就是经过多次迭代、最终定稿的 **Markdown-Worldview (v2.3) 设计规范文档**。

本规范采用**"内容与样式分离"**的核心架构，将所有组件统一为 **YAML-like** 语法，并确立了**"精简极客 (Minimalist Wiki)"**作为默认视觉基调。所有组件点击后均支持**直接页面跳转**，构建起一套完整的世界观 Wiki 联动系统。

---

# 📝 Markdown-Worldview 设计规范 (v2.3 - 2026-04-04)

Markdown-Worldview 是一个用于渲染世界观文档组件的插件。它允许创作者通过特定的 `fenced code blocks` 在 Markdown 中快速插入交互式、可视化的世界观组件。

---
## 零、 核心架构：服务端与客户端分离

本插件采用**职责分离**的设计架构，将渲染（服务端）与交互（客户端）完全解耦。

### 架构总览

```
┌─────────────────────────────────────────────────────────┐
│  服务端 (markdown-it 插件)                               │
│  - 运行环境：Node.js (构建时/SSR)                        │
│  - 职责：YAML → HTML                                    │
│  - 输出：带 data-mw-link 属性的 HTML                    │
│  - 配置：debug, classPrefix                             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  客户端 (initMarkdownWorldview)                          │
│  - 运行环境：浏览器 (运行时)                             │
│  - 职责：DOM 交互（图表、导航）                          │
│  - 输入：HTML + onNavigate 回调                         │
│  - 配置：debug, onNavigate                              │
└─────────────────────────────────────────────────────────┘
```

### 集成方法（两步配置）

#### 第一步：服务端配置 (markdown-it 插件)

在 markdown-it 配置中注册插件，此时**不需要**配置导航相关内容。

```typescript
import MarkdownIt from 'markdown-it';
import { markdownWorldviewPlugin } from 'markdown-worldview';

const md = new MarkdownIt();
md.use(markdownWorldviewPlugin, {
  debug: true,        // 可选：启用调试模式
  classPrefix: 'mw'   // 可选：自定义类名前缀
  // ❌ 不要在这里配置 onNavigate！
});
```

**服务端插件的职责**：
- 解析 YAML 代码块
- 渲染成 HTML
- 为带 `link` 字段的组件添加 `data-mw-link` 属性

**渲染输出示例**：
```html
<!-- Card 组件渲染结果 -->
<div 
  class="mw-card" 
  data-mw-link="/wiki/elena"  <!-- ← 服务端添加的属性 -->
>
  <img src="/path/to/elena.jpg" alt="艾蕾娜·星语">
  <h3>艾蕾娜·星语</h3>
  <p>银月森林的守护者，能听见星辰的私语。</p>
</div>
```

#### 第二步：客户端初始化 (浏览器端)

在浏览器环境中调用 `initMarkdownWorldview()`，提供 `onNavigate` 回调函数。

**方式 A：VitePress 集成**
```typescript
// .vitepress/theme/index.ts
import { initMarkdownWorldview } from 'markdown-worldview/client';
import { useRouter } from 'vitepress';

export default {
  async enhanceApp({ router }) {
    if (typeof window !== 'undefined') {
      await initMarkdownWorldview({
        debug: true,
        onNavigate: (event) => {
          // 使用 VitePress 路由进行导航
          router.go(event.path);
        }
      });
    }
  }
}
```

**方式 B：Obsidian 插件集成**
```typescript
// main.ts
import { initMarkdownWorldview } from 'markdown-worldview/client';

export default class MyPlugin extends Plugin {
  async onload() {
    // 在 DOM 加载后初始化
    this.registerDomEvent(document, 'DOMContentLoaded', async () => {
      await initMarkdownWorldview({
        debug: true,
        onNavigate: (event) => {
          // 使用 Obsidian API 打开链接
          this.app.workspace.openLinkText(event.path, '', false);
        }
      });
    });
  }
}
```

**方式 C：Logseq 插件集成**
```typescript
// index.ts
import { initMarkdownWorldview } from 'markdown-worldview/client';

await initMarkdownWorldview({
  onNavigate: (event) => {
    // 使用 Logseq API 跳转页面
    logseq.App.pushState('page', { 
      name: event.path.replace('/wiki/', '') 
    });
  }
});
```

**方式 D：普通网页集成**
```typescript
import { initMarkdownWorldview } from 'markdown-worldview/client';

document.addEventListener('DOMContentLoaded', async () => {
  await initMarkdownWorldview({
    debug: true,
    onNavigate: (event) => {
      // 使用原生浏览器导航
      window.location.href = event.path;
    }
  });
});
```

### 导航工作原理

#### 1. 服务端渲染阶段
组件渲染器检测到 `link` 字段时，添加 `data-mw-link` 属性：

```typescript
// src/components/card.ts
function renderCard(content: string): string {
  const data = parseYAML(content);
  let html = '<div class="mw-card"';
  
  if (data.link) {
    html += ` data-mw-link="${escapeHtml(data.link)}"`;
  }
  
  html += '>...</div>';
  return html;
}
```

#### 2. 客户端交互阶段
使用**事件委托（Event Delegation）**处理点击：

```typescript
// src/client/navigation.ts
export function setupNavigationHandlers(
  containerElement: HTMLElement,
  onNavigate: NavigateFunction
): () => void {
  const handleClick = (event: MouseEvent) => {
    // 查找最近的带 data-mw-link 属性的元素
    const target = (event.target as HTMLElement)
      .closest('[data-mw-link]') as HTMLElement;
    
    if (target) {
      event.preventDefault();
      const link = target.getAttribute('data-mw-link');
      
      // 调用用户提供的导航函数
      onNavigate({
        path: link,
        sourceElement: target
      });
    }
  };
  
  containerElement.addEventListener('click', handleClick);
  
  // 返回清理函数
  return () => {
    containerElement.removeEventListener('click', handleClick);
  };
}
```

### 设计优势

1. **职责清晰**：服务端不需要知道如何导航，客户端不需要知道如何渲染
2. **SSR 友好**：服务端代码不依赖浏览器 API
3. **框架无关**：不绑定任何特定的路由系统
4. **性能优化**：事件委托，100 个组件只需 1 个监听器
5. **灵活集成**：不同的宿主环境可以提供不同的导航实现

---

## 一、 核心架构原则

1.  **YAML 数据驱动**：所有组件的代码块内部均采用标准 YAML 语法，提高解析效率，降低创作负担。
2.  **内容与样式分离**：代码块只负责描述"是什么"（数据）。具体的"长什么样"（视觉）由全局 CSS 变量统一控制。
3.  **Wiki 联动系统**：所有组件（节点、条目、卡片）均支持 `link` 字段。点击后直接根据提供的路径跳转到对应的 Wiki 页面。
4.  **精简极客风格 (Minimalist Wiki)**：默认采用高强度留白、细线条、Monospace 字体的极简主义设计，确保极佳的阅读体验。
5.  **职责分离架构**：服务端（markdown-it）负责渲染 HTML，客户端（initMarkdownWorldview）负责交互处理。

---

## 二、 全局样式系统 (CSS 变量)

开发者可以通过在项目中覆盖以下 CSS 变量来定制主题。

```css
:root {
  /* 基础颜色 (亮色模式) */
  --mw-primary-color: #2563eb;      /* 主色调 (蓝色) */
  --mw-bg-color: #ffffff;           /* 背景色 */
  --mw-text-color: #1f2937;         /* 正文颜色 */
  --mw-text-muted: #6b7280;         /* 次要文字颜色 */
  --mw-border-color: #e5e7eb;       /* 1px 细边框颜色 */

  /* 状态颜色 (由组件 status 字段映射) */
  --mw-pos-color: #16a34a;          /* 盟友 / 上升 / 增益 */
  --mw-neg-color: #dc2626;          /* 敌对 / 下降 / 减益 */
  --mw-neu-color: #6b7280;          /* 中立 / 稳定 */

  /* 稀有度颜色 (由 rarity 字段映射) */
  --mw-rarity-common: #9ca3af;
  --mw-rarity-rare: #3b82f6;
  --mw-rarity-epic: #8b5cf6;
  --mw-rarity-legendary: #f59e0b;

  /* 字体系统 */
  --mw-font-sans: 'Inter', -apple-system, sans-serif;
  --mw-font-mono: 'Fira Code', 'JetBrains Mono', monospace;
}
```

---

## 三、 组件设计规范

### 1. 雷达图 (Radar)
> 展示单一实体（人物、魔兽、遗物）的多维素质平衡。

```markdown
```radar
title: 苍之剑圣 · 阿尔忒尼斯
data:
  武力: 98
  敏捷: 92
  神秘: 45
  谋略: 72
  幸运: 60
```
```

### 2. 数值面板 (Numerical)
> 展示具体的量化进度指标。

```markdown
```numerical
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
```

### 3. 介绍卡片 (Card)
> 用于人物、组织或地点的"简版身份证"。

```markdown
```card
name: 艾蕾娜·星语
avatar: /path/to/elena.jpg
description: 银月森林的守护者，能听见星辰的私语。
dictum: "森林记得每一个名字，也记得每一场雨。"
tags: [精灵, 传奇射手, 守序中立]
link: /wiki/elena  # 点击整个卡片跳转
```
```

### 4. 势力综测面板 (Power)
> 全方位展示国家、教派或军团的综合国力。

```markdown
```power
faction: 凛冬帝国
leader: 亚历山大三世
status: 战争状态   # 关联 --mw-neg-color
data:
  经济实力: [80, "产出：魔导矿石"]
  军事实力: [95, "常备军：12万"]
  人口规模: [65, "总人口：450万"]
trend: 
  经济: rising    # 渲染为上升图标
  军事: stable    # 渲染为稳定图标
  外交: falling   # 渲染为下降图标
```
```

### 5. 势力外交关系图 (Relations)
> 基于力导向图展示多个势力间的外交态势。

```markdown
```relations
title: 大陆外交局势图
nodes:
  - id: A
    name: 凛冬帝国
    link: /factions/winter  # 点击节点跳转
  - id: B
    name: 影之国
    link: /factions/shadow
edges:
  - from: A
    to: B
    status: enemy # 关联 --mw-neg-color
    label: 边境战争
```
```

#### 人物关系图示例：
```markdown
```relations
title: 星语家族与宿敌关系
nodes:
  - id: elena
    name: 艾蕾娜
    link: /chars/elena
    type: hero           # 可以通过 type 触发不同的 CSS 形状或头像
  - id: kael
    name: 凯尔
    link: /chars/kael
edges:
  - from: elena
    to: kael
    status: enemy        # 关联 --mw-neg-color (红色连线)
    label: 宿敌
```
```

### 6. 组织层级架构 (Hierarchy)
> 展现垂直隶属关系，如军事编制、行政层级。

```markdown
```hierarchy
title: 帝国北方军团编制
direction: TB # 自上而下
nodes:
  - name: 军团长：弗拉基米尔
    link: /chars/vladimir  # 点击节点跳转
    children:
      - name: 第三旗团 (重装步兵)
      - name: 第七旗团 (狮鹫骑士)
        children:
          - name: 第一大队
          - name: 第二大队
```
```

### 7. 交互时间线 (Timeline)
> 可拖动、缩放的历史长卷。

```markdown
```timeline
groups: [历史大事件, 个人传记]
events:
  - time: "前纪元 320"
    group: 历史大事件
    content: 万物凋零，魔力潮汐开始衰退。
  - time: "124.06.12"
    group: 个人传记
    content: 艾蕾娜出生。
    link: /events/elena-born  # 点击内容跳转
```
```

### 8. 物品/装备网格 (Inventory)
> 游戏风格的网格背包，通过 rarity 实现边框变色。

```markdown
```inventory
columns: 4
items:
  - name: 誓约之剑
    rarity: epic  # 关联 --mw-rarity-epic
    icon: /img/items/sword.png
    type: 武器
    desc: 传说中斩裂黑夜的名剑。
    link: /wiki/items/oath-sword  # 点击卡片跳转
  - name: 治愈药水
    rarity: common
    icon: /img/items/potion.png
    amount: 12
    type: 消耗品
```
```

---

## 四、 技术实现路线建议

| 组件类型 | 推荐库 | 实现难点 |
| :--- | :--- | :--- |
| **Radar / Power** | **ECharts** | 极坐标系适配手机端显示 |
| **Relations** | **vis-network** | 力导向图布局算法调优 |
| **Hierarchy** | **vis-network** | 树形布局与点击事件绑定 |
| **Timeline** | **vis-timeline** | 时间轴的自定义缩放刻度 |
| **Numerical / Card / Inventory** | **Pure CSS (Grid/Flex)** | 响应式布局下的一致性 |

---

## 五、 版本更新记录

### v2.3 (2026-04-04)
- ✅ **架构重构**：导航系统迁移至客户端
- ✅ **职责分离**：服务端（渲染）与客户端（交互）完全解耦
- ✅ **事件委托**：使用 `data-mw-link` 属性 + 事件委托处理点击
- ✅ **SSR 友好**：服务端代码不依赖浏览器 API

### v2.2 (2026-04-03)
- ✅ 完成 ECharts 图表组件（Radar, Power）
- ✅ 实现客户端图表管理器
- ✅ 按需导入 ECharts 模块，体积优化

### v2.1 (2026-04-02)
- ✅ 实现纯 CSS 组件（Card, Numerical, Inventory）
- ✅ 建立主题系统（CSS 变量）

### v2.0 (2026-04-01)
- ✅ 初始设计规范
- ✅ YAML 语法统一
- ✅ 8 大组件定义

---

这份文档现在已经完全反映了最新的架构设计！
