# Markdown-Worldview

> 一个用于渲染交互式世界观组件的 markdown-it 插件，使用 YAML 语法

**状态**: 🚧 正在积极开发中（Phase 1 已完成）

## 特性

- 🎨 **8 种交互式组件**: 卡片、数值、雷达图、势力、关系图、层级图、时间线、物品栏
- 📝 **YAML 驱动**: 简洁清晰的内容定义语法
- 🎭 **主题系统**: 通过 CSS 变量完全自定义
- 🔗 **Wiki 集成**: 内置导航适配器，无缝页面跳转
- 📱 **响应式**: 支持桌面和移动端
- ⚡ **高性能**: 第三方库按需延迟加载

## 快速开始

### 安装

```bash
npm install markdown-worldview
```

### 基础用法

```javascript
import MarkdownIt from 'markdown-it';
import { markdownWorldviewPlugin } from 'markdown-worldview';
import 'markdown-worldview/style.css';

const md = new MarkdownIt();

md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    // 处理导航
    console.log('导航到:', event.path);
    // window.location.href = event.path;
  }
});

const html = md.render(yourMarkdownContent);
```

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

## 开发路线图

- [x] Phase 1: 项目基础和基础架构
- [ ] Phase 2: CSS 主题系统
- [ ] Phase 3: 纯 CSS 组件（Card, Numerical, Inventory）
- [ ] Phase 4: 图表组件（Radar, Power）
- [ ] Phase 5: 图形组件（Relations, Hierarchy, Timeline）
- [ ] Phase 6: VitePress 集成和示例
- [ ] Phase 7: 测试和优化
- [ ] Phase 8: 发布准备

## 许可证

MIT

## 贡献

欢迎贡献！请阅读 [AI_GUIDE.md](./AI_GUIDE.md) 了解开发指南。
