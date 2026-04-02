# Hierarchy - 层级架构

::: warning 开发中
此组件正在开发中，预计在 Phase 5 完成。
:::

## 组件介绍

Hierarchy 组件用于展示组织架构、技能树、任务依赖等树形结构。

## 计划功能

基于 vis-network 分层布局实现，支持：

- 🌳 树形结构自动布局
- 🔄 方向控制（上下/左右）
- 🎯 节点点击跳转
- 📊 多层级展示
- 🎨 自定义节点样式

## YAML 语法（规划中）

````markdown
```hierarchy
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
````

## 布局方向

| 方向 | 说明 | 适用场景 |
|:-----|:-----|:---------|
| UD | 上到下 | 组织架构、技能树 |
| LR | 左到右 | 流程图、任务链 |
| DU | 下到上 | 进化树、成长路线 |
| RL | 右到左 | 历史回溯 |

## 开发进度

- [ ] vis-network 分层布局
- [ ] 递归树形结构解析
- [ ] 方向配置支持
- [ ] 节点点击事件
- [ ] 响应式适配

## 相关文档

- [开发计划 - Phase 5](/DEVELOPMENT_PLAN.md#52-hierarchy-层级架构---优先级)
- [vis-network 分层布局](https://visjs.github.io/vis-network/examples/network/layout/hierarchicalLayout.html)

---

**预计完成时间**：待定  
**优先级**：⭐⭐ 中
