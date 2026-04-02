/**
 * 快速开始示例
 * 
 * 该文件演示如何使用 Markdown-Worldview 插件。
 * 运行命令：node examples/quickstart.js
 */

import MarkdownIt from 'markdown-it';
import { markdownWorldviewPlugin } from '../dist/markdown-worldview.js';

// 创建 markdown-it 实例
const md = new MarkdownIt();

// 注册插件并提供自定义导航处理器
md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    console.log('\n🔗 触发导航!');
    console.log('  目标路径:', event.path);
    console.log('  源元素:', event.sourceElement?.className || 'N/A');
  },
  debug: true,
  classPrefix: 'mw'
});

// 包含所有 8 种组件类型的示例 markdown 内容
const markdown = `
# Markdown-Worldview 示例

## 1. Card 组件 (Phase 3)

\`\`\`card
name: Elena Starwhisper
avatar: /images/elena.jpg
description: Guardian of the Silver Forest, capable of hearing the whispers of stars.
dictum: "The forest remembers every name, and every rain."
tags: [Elf, Legendary Archer, Neutral Good]
link: /wiki/elena
\`\`\`

## 2. Radar 组件 (Phase 4)

\`\`\`radar
title: Artemis the Sword Saint
data:
  Strength: 98
  Agility: 92
  Mystery: 45
  Strategy: 72
  Luck: 60
\`\`\`

## 3. Numerical 组件 (Phase 3)

\`\`\`numerical
title: 当前状态
items:
  - label: 生命值
    value: 85
    max: 100
    icon: ❤️
  - label: 以太储备
    value: 420
    max: 2000
    icon: ✨
\`\`\`

## 4. Power 组件 (Phase 4)

\`\`\`power
faction: 冬境帝国
leader: 亚历山大三世
status: 战争中
data:
  Economic Strength: [80, "产出：魔法矿石"]
  Military Strength: [95, "常备军：12万"]
  Population: [65, "总人口：450万"]
trend:
  economy: rising
  military: stable
  diplomacy: falling
\`\`\`

## 5. Relations 组件 (Phase 5)

\`\`\`relations
title: 大陆外交局势
nodes:
  - id: A
    name: 冬境帝国
    link: /factions/winter
  - id: B
    name: 暗影邦国
    link: /factions/shadow
edges:
  - from: A
    to: B
    status: enemy
    label: 边境战争
\`\`\`

## 6. Hierarchy 组件 (Phase 5)

\`\`\`hierarchy
title: 北方军团结构
direction: TB
nodes:
  - name: 军团长：弗拉基米尔
    link: /chars/vladimir
    children:
      - name: 第3旗团（重装步兵）
      - name: 第7旗团（翅鹰骑士）
        children:
          - name: 第1中队
          - name: 第2中队
\`\`\`

## 7. Timeline 组件 (Phase 5)

\`\`\`timeline
groups: [历史事件, 个人传记]
events:
  - time: "320 BCE"
    group: 历史事件
    content: 大枯萎，魔法潮汐开始退潮。
  - time: "124.06.12"
    group: 个人传记
    content: 艾伦娜出生。
    link: /events/elena-born
\`\`\`

## 8. Inventory 组件 (Phase 3)

\`\`\`inventory
columns: 4
items:
  - name: 誓约之剑
    rarity: epic
    icon: /img/items/sword.png
    type: 武器
    desc: 割裂长夜的传说兵刃。
    link: /wiki/items/oath-sword
  - name: 治疗药水
    rarity: common
    icon: /img/items/potion.png
    amount: 12
    type: 消耗品
\`\`\`

## 普通代码块（不应被影响）

\`\`\`javascript
console.log('这是一个普通的代码块');
const x = 42;
\`\`\`
`;

// 渲染 markdown
console.log('='.repeat(80));
console.log('MARKDOWN-WORLDVIEW 插件 - 快速开始示例');
console.log('='.repeat(80));
console.log('\n📄 正在渲染包含 8 种组件类型的 markdown...\n');

const html = md.render(markdown);

console.log(html);

console.log('\n' + '='.repeat(80));
console.log('✅ 渲染完成！');
console.log('='.repeat(80));
console.log('\n注意：组件目前显示的是占位符 (Phase 1)。');
console.log('完整实现将在 Phase 3-5 提供。');
