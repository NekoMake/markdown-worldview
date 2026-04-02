# Timeline - 时间线

::: warning 开发中
此组件正在开发中，预计在 Phase 5 完成。
:::

## 组件介绍

Timeline 组件用于展示历史事件、剧情线、角色经历等时间序列数据。

## 计划功能

基于 Vis-timeline 实现，支持：

- ⏱️ 可缩放时间轴
- 📅 事件分组展示
- 🔗 事件点击跳转
- 🎨 自定义事件样式
- 📱 触控拖动支持

## YAML 语法（规划中）

````markdown
```timeline
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
````

## 时间格式支持

- 标准日期：`2024-01-15`
- 带时间：`2024-01-15 14:30`
- 自定义纪元：`前纪元 320`
- 相对时间：`战争爆发后第 3 年`

## 分组展示

支持将事件按类别分组，每组独立显示在不同的泳道中：

- 📜 历史大事件
- 👤 角色传记
- ⚔️ 战争与冲突
- 🏛️ 王朝更迭

## 开发进度

- [ ] Vis-timeline 动态加载
- [ ] 时间格式解析
- [ ] 事件分组渲染
- [ ] 点击事件处理
- [ ] 自定义纪元支持

## 相关文档

- [开发计划 - Phase 5](/DEVELOPMENT_PLAN.md#53-timeline-时间线---优先级)
- [Vis-timeline 文档](https://visjs.github.io/vis-timeline/docs/timeline/)

---

**预计完成时间**：待定  
**优先级**：⭐⭐ 中
