# 开发阶段文档

本目录包含 Markdown-Worldview 插件各个开发阶段的详细文档。

## ✅ 已完成阶段

1. [Phase 1: 项目基础和基础架构](./phase-1-foundation.md) — 2026-04-01
   - 项目初始化、TypeScript 配置、Vite 构建
   - 基础 YAML 解析器和插件注册机制
   
2. [Phase 2: CSS 变量系统](./phase-2-css-system.md) — 2026-04-02
   - 建立 16 个核心 CSS 变量
   - 定义颜色、字体、间距规范
   
3. [Phase 3: 纯 CSS 组件实现](./phase-3-pure-css-components.md) — 2026-04-02
   - Card 组件（人物/物品/地点卡片）
   - Numerical 组件（数值面板）
   - Inventory 组件（物品栏）
   
4. [Phase 3.5: 主题系统增强](./phase-3.5-theme-system.md) — 2026-04-03
   - 扩展至 55+ CSS 变量
   - 添加阴影、动画、过渡变量
   - 创建预设主题（极简、暗黑森林）
   
5. [Phase 4: 图表组件实现](./phase-4-chart-components.md) — 2026-04-03 ⭐ **最新**
   - Radar 组件（雷达图）
   - Power 组件（势力面板）
   - ECharts 管理器和按需加载
   - 客户端初始化系统

## ⏳ 即将推出的阶段

- **Phase 5**: 图形组件（Relations, Hierarchy, Timeline）— **下一步**
- **Phase 6**: VitePress 集成和完整示例
- **Phase 7**: 测试覆盖和性能优化
- **Phase 8**: 1.0 正式版发布准备

## 文档规范

每个阶段文档必须包含：
1. **目标 (Objectives)** — 本阶段要完成的任务
2. **已完成的工作 (Completed Work)** — 详细列出文件路径和实现内容
3. **验证步骤 (Verification Steps)** — 如何验证工作成果
4. **相关文件清单 (Related Files)** — 所有创建/修改的文件
5. **已知问题 (Known Issues)** — 问题和待办事项
6. **给下一阶段的提示 (Tips for Next Phase)** — 继续开发的重要提示

完整模板参见 [AI_GUIDE.md](../../AI_GUIDE.md)。
