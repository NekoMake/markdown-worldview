# Relations - 关系图

::: warning 开发中
此组件正在开发中，预计在 Phase 5 完成。
:::

## 组件介绍

Relations 组件用于展示角色、势力之间的关系网络，采用力导向图布局。

## 计划功能

基于 vis-network 实现，支持：

- 🕸️ 力导向图自动布局
- 🔗 关系类型可视化（盟友/敌对/中立）
- 🎯 节点点击跳转
- 🎨 自定义节点和边样式
- 📱 拖拽和缩放交互

## YAML 语法（规划中）

````markdown
```relations
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
````

## 关系类型

| 类型 | 颜色 | 样式 |
|:-----|:-----|:-----|
| ally（盟友） | 绿色 | 实线 |
| enemy（敌对） | 红色 | 虚线 |
| neutral（中立） | 灰色 | 实线 |

## 开发进度

- [ ] vis-network 动态加载
- [ ] YAML 数据转换
- [ ] 力导向布局配置
- [ ] 节点点击事件
- [ ] 关系样式映射

## 相关文档

- [开发计划 - Phase 5](/DEVELOPMENT_PLAN.md#51-relations-关系图---优先级)
- [vis-network 文档](https://visjs.github.io/vis-network/docs/network/)

---

**预计完成时间**：待定  
**优先级**：⭐⭐⭐ 高
