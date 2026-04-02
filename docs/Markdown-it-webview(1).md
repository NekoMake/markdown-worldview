这就是经过多次迭代、最终定稿的 **Markdown-Worldview (v2.2) 设计规范文档**。

本规范采用**“内容与样式分离”**的核心架构，将所有组件统一为 **YAML-like** 语法，并确立了**“精简极客 (Minimalist Wiki)”**作为默认视觉基调。所有组件点击后均支持**直接页面跳转**，构建起一套完整的世界观 Wiki 联动系统。

---

# 📝 Markdown-Worldview 设计规范 (v2.2 - )

Markdown-Worldview 是一个用于渲染世界观文档组件的插件。它允许创作者通过特定的 `fenced code blocks` 在 Markdown 中快速插入交互式、可视化的世界观组件。

---
## 零、 核心架构：适配器模式

本插件采用**内容与实现分离**的设计。插件本身不处理页面跳转逻辑，而是通过一个 `onNavigate` 回调函数将导航事件委托给宿主环境（Host Application）。

### 集成方法

在插件初始化时，要求使用者（也就是在某个 APP 里集成你这个插件的开发者）提供一个**导航函数 (Navigation Function)**。

我们把这个函数叫做 `onNavigate`。

#### 1. 你的插件的角色（只“通知”）

当用户点击一个带 `link` 的组件时，你的插件内部逻辑**不会**执行 `window.location.href` 或 `router.push`。

取而代之，它会调用那个由外部传入的 `onNavigate` 函数，并把链接地址作为参数传递过去。

```javascript
// 你的插件内部的点击处理逻辑
function handleLinkClick(event, path) {
  event.preventDefault(); // 阻止默认的<a>标签跳转

  // 检查外部是否传入了 onNavigate 函数
  if (typeof options.onNavigate === 'function') {
    // 调用它，把跳转的意图告诉“主人”
    options.onNavigate({
      path: path,
      sourceElement: event.currentTarget
    });
  } else {
    // 如果没有提供，可以给个提示或执行一个默认行为
    console.warn('Markdown-Worldview: onNavigate function not provided.');
  }
}
```

#### 2. 集成者/APP 的角色（去“执行”）

现在，当一个开发者想在他的笔记软件里集成你的插件时，他需要“告诉”你的插件如何进行跳转。

**在 Obsidian 插件中集成时：**
Obsidian 的 API 提供了打开内部链接的方法。

```javascript
// 在 Obsidian 插件的 main.ts 文件里
import { initializeMarkdownWorldview } from 'markdown-worldview';

// 初始化你的插件
initializeMarkdownWorldview({
  // 告诉你的插件，当需要导航时，应该调用这个函数
  onNavigate: (event) => {
    // 使用 Obsidian 的 API 来打开链接
    // event.path 的值是 "/wiki/elena"
    this.app.workspace.openLinkText(event.path, '', false);
  }
});
```

**在 Logseq 插件中集成时：**
Logseq 也有自己的 API。

```javascript
// 在 Logseq 插件的 index.ts 文件里
initializeMarkdownWorldview({
  onNavigate: (event) => {
    // 使用 Logseq 的 API 来跳转到页面
    logseq.App.pushState('page', { name: event.path.replace('/wiki/', '') });
  }
});
```

**在一个普通的 Vue/React 网站中集成时：**

```javascript
// 在 Vue 项目的 main.js 文件里
import router from './router';

initializeMarkdownWorldview({
  onNavigate: (event) => {
    // 使用 Vue Router 来跳转
    router.push(event.path);
  }
});
```


## 一、 核心架构原则

1.  **YAML 数据驱动**：所有组件的代码块内部均采用标准 YAML 语法，提高解析效率，降低创作负担。
2.  **内容与样式分离**：代码块只负责描述“是什么”（数据）。具体的“长什么样”（视觉）由全局 CSS 变量统一控制。
3.  **Wiki 联动系统**：所有组件（节点、条目、卡片）均支持 `link` 字段。点击后直接根据提供的路径跳转到对应的 Wiki 页面。
4.  **精简极客风格 (Minimalist Wiki)**：默认采用高强度留白、细线条、Monospace 字体的极简主义设计，确保极佳的阅读体验。

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

### 3. 介绍卡片 (Card)
> 用于人物、组织或地点的“简版身份证”。

```markdown
```card
name: 艾蕾娜·星语
avatar: /path/to/elena.jpg
description: 银月森林的守护者，能听见星辰的私语。
dictum: "森林记得每一个名字，也记得每一场雨。"
tags: [精灵, 传奇射手, 守序中立]
link: /wiki/elena  # 点击整个卡片跳转
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

这份文档现在已经彻底定稿了！它把原本杂乱的组件统一进了一个连贯、专业且高度可扩展的体系里。如果你准备开始动手写代码，这份文档就是你的“开发圣经”。