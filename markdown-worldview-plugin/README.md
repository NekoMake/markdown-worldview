# Markdown-Worldview

> 一个用于渲染交互式世界观组件的 markdown-it 插件，使用 YAML 语法

**状态**: 🚧 正在积极开发中（Phase 4 已完成 · Beta 阶段）

[![npm version](https://img.shields.io/npm/v/markdown-worldview.svg)](https://www.npmjs.com/package/markdown-worldview)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

## ✨ 特性

- 🎨 **5 种已实现组件**: 
  - **Card** 卡片 - 人物/物品/地点展示
  - **Numerical** 数值面板 - 关键属性展示
  - **Inventory** 物品栏 - 物品清单
  - **Radar** 雷达图 - 多维素质平衡（ECharts）
  - **Power** 势力面板 - 综合国力展示（ECharts）
- 📝 **YAML 驱动**: 简洁清晰的内容定义语法
- 🎭 **完善的主题系统**: 
  - 55+ CSS 变量，覆盖颜色、字体、间距、阴影、动画
  - 支持亮色/暗色主题
  - 预设主题：默认、极简、暗黑森林
- 🔗 **Wiki 集成**: 内置导航适配器，无缝页面跳转
- 📱 **响应式设计**: 完美支持桌面和移动端
- ⚡ **高性能优化**: 
  - ECharts 按需导入（~450KB vs 1.5MB）
  - 懒加载机制
  - 自动清理和资源管理

## 快速开始

### 安装

```bash
# NPM
npm install markdown-worldview

# Yarn
yarn add markdown-worldview

# PNPM
pnpm add markdown-worldview
```

**注意**: 当前版本为 `0.1.0-beta.0`，API 可能会有变动。

### 服务端（SSG/SSR）

```javascript
import MarkdownIt from 'markdown-it';
import { markdownWorldviewPlugin } from 'markdown-worldview';

const md = new MarkdownIt();
md.use(markdownWorldviewPlugin);

const html = md.render(yourMarkdownContent);
```

### 客户端（浏览器）

```javascript
import { initMarkdownWorldview } from 'markdown-worldview/client';
import 'markdown-worldview/style.css';

// 初始化所有组件（包括 ECharts 图表）
initMarkdownWorldview({
  onNavigate: (event) => {
    console.log('导航到:', event.path);
    // 自定义导航逻辑
    // window.location.href = event.path;
  }
});
```

**重要**: ECharts 图表（Radar, Power）需要客户端 JavaScript 初始化。

### VitePress 集成

参见 [VitePress 集成指南](./docs/vitepress-integration.md)（Phase 6 即将推出）

## 组件示例

### Card 组件

\`\`\`markdown
\`\`\`card
name: Elena Starwhisper
avatar: /path/to/elena.jpg
description: Guardian of the Silver Forest
dictum: "The forest remembers every name, and every rain."
tags: [Elf, Legendary Archer, Neutral Good]
link: /wiki/elena
\`\`\`
\`\`\`

### Radar 组件

\`\`\`markdown
\`\`\`radar
title: Artemis the Sword Saint
data:
  Strength: 98
  Agility: 92
  Mystery: 45
  Strategy: 72
  Luck: 60
\`\`\`
\`\`\`

更多示例将在 Phase 6 推出！

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建库
npm run build

# 运行测试
npm test

# 类型检查
npm run type-check

# 文档站点
npm run docs:dev
```

## 项目结构

```
markdown-worldview-plugin/
├── src/                 # 源代码
├── docs/                # 文档和示例
├── __tests__/           # 单元测试
├── dist/                # 构建输出（自动生成）
└── AI_GUIDE.md          # AI 协作指南
```

## 🗺️ 开发路线图

- ✅ **Phase 1**: 项目基础和基础架构
- ✅ **Phase 2**: CSS 变量系统  
- ✅ **Phase 3**: 纯 CSS 组件（Card, Numerical, Inventory）
- ✅ **Phase 3.5**: 完善主题系统（55+ 变量）
- ✅ **Phase 4**: 图表组件（Radar, Power）— **当前版本**
- ⏳ **Phase 5**: 图形组件（Relations, Hierarchy, Timeline）— **下一步**
- ⏳ **Phase 6**: VitePress 集成和完整示例
- ⏳ **Phase 7**: 测试覆盖和性能优化
- ⏳ **Phase 8**: 1.0 正式版发布

## 许可证

MIT

## 贡献

欢迎贡献！请阅读 [AI_GUIDE.md](./AI_GUIDE.md) 了解开发指南。
