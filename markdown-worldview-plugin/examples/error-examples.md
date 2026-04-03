# 错误处理示例

本文件展示各种错误场景，用于验证错误提示机制。

## ✅ 正常示例（对照组）

:::card
name: 正常的卡片
description: 这个卡片可以正常渲染
tags: [正常, 示例]
:::

---

## ❌ 错误示例

### 1. 未知组件类型

:::unknown-component
name: 测试
:::

:::wrongtype
data: test
:::

### 2. YAML 格式错误

#### 引号未闭合

:::card
name: "未闭合的引号
description: 这会导致 YAML 解析错误
:::

#### 缩进错误

:::card
name: 测试
description:这里缺少空格
tags: [错误]
:::

#### 数组格式错误

:::numerical
title: 测试
items:
  - label: 错误
    value: 100
    max: "应该是数字不是字符串"
:::

#### 冒号缺失

:::card
name 测试名称
description: 缺少冒号的字段
:::

### 3. 缺少必需字段（如果有的话）

:::inventory
title: 缺少 items 字段
:::

### 4. 字段类型错误

:::numerical
title: 类型错误
items:
  - label: 测试
    value: "应该是数字"
    max: 100
:::

---

## 🔧 调试提示

**查看本文件的渲染效果：**

1. **生产模式**（`debug: false`）
   - 错误显示为灰色信息框
   - 文字为中性灰，图标为 ℹ️
   - 简化的错误消息

2. **开发模式**（`debug: true`）
   - 错误显示为红色警告框
   - 文字为错误红，图标为 ⚠️
   - 完整的技术错误详情

**在浏览器中测试：**

```bash
# 开发模式
npm run docs:dev

# 生产模式
npm run docs:build
npm run docs:preview
```

**检查控制台：**

按 F12 打开开发者工具，查看控制台输出：
- 生产模式：`console.warn` 警告日志
- 开发模式：`console.error` 错误日志

---

**文件用途**：内部测试  
**创建日期**：2026-04-03  
**相关实现**：Phase 3 错误处理改进
