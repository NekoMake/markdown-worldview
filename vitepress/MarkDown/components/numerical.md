# Numerical - 数值面板

Numerical 组件用于展示角色属性、资源状态、势力数据等数值信息，支持进度条可视化。

## 基本用法

````markdown
```numerical
title: 角色状态
items:
  - label: 生命值
    value: 85
    max: 100
  - label: 魔力值
    value: 42
    max: 80
  - label: 体力
    value: 60
    max: 100
```
````

**预览效果：**

```numerical
title: 角色状态
items:
  - label: 生命值
    value: 85
    max: 100
  - label: 魔力值
    value: 42
    max: 80
  - label: 体力
    value: 60
    max: 100
```

## 带图标的数值

````markdown
```numerical
title: 资源储备
items:
  - label: 金币
    value: 1250
    max: 5000
    icon: 💰
  - label: 以太水晶
    value: 420
    max: 2000
    icon: 💎
  - label: 经验值
    value: 8750
    max: 10000
    icon: ⭐
```
````

**预览效果：**

```numerical
title: 资源储备
items:
  - label: 金币
    value: 1250
    max: 5000
    icon: 💰
  - label: 以太水晶
    value: 420
    max: 2000
    icon: 💎
  - label: 经验值
    value: 8750
    max: 10000
    icon: ⭐
```

## 无最大值的数值

当不需要进度条时，可以省略 `max` 字段。

````markdown
```numerical
title: 基础属性
items:
  - label: 力量
    value: 18
    icon: 💪
  - label: 敏捷
    value: 14
    icon: 🏃
  - label: 智力
    value: 16
    icon: 🧠
  - label: 魅力
    value: 12
    icon: ✨
```
````

**预览效果：**

```numerical
title: 基础属性
items:
  - label: 力量
    value: 18
    icon: 💪
  - label: 敏捷
    value: 14
    icon: 🏃
  - label: 智力
    value: 16
    icon: 🧠
  - label: 魅力
    value: 12
    icon: ✨
```

## 复杂示例

````markdown
```numerical
title: 帝国月度报告
items:
  - label: 国库储备
    value: 287500
    max: 500000
    icon: 👑
  - label: 军队规模
    value: 125000
    max: 200000
    icon: ⚔️
  - label: 人口总数
    value: 4500000
    icon: 👥
  - label: 领土面积（平方公里）
    value: 285000
    icon: 🗺️
  - label: 魔法污染指数
    value: 35
    max: 100
    icon: ☠️
```
````

**预览效果：**

```numerical
title: 帝国月度报告
items:
  - label: 国库储备
    value: 287500
    max: 500000
    icon: 👑
  - label: 军队规模
    value: 125000
    max: 200000
    icon: ⚔️
  - label: 人口总数
    value: 4500000
    icon: 👥
  - label: 领土面积（平方公里）
    value: 285000
    icon: 🗺️
  - label: 魔法污染指数
    value: 35
    max: 100
    icon: ☠️
```

## 字段说明

### 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|:-----|:-----|:-----|:-----|
| `title` | string | ❌ | 面板标题 |
| `items` | array | ✅ | 数值项列表 |

### items 数组元素

| 字段 | 类型 | 必填 | 说明 |
|:-----|:-----|:-----|:-----|
| `label` | string | ✅ | 标签名称 |
| `value` | number | ✅ | 当前值 |
| `max` | number | ❌ | 最大值（显示进度条） |
| `icon` | string | ❌ | 图标（Emoji 或图片） |

## 进度条颜色

进度条会根据百分比自动变色：

- **0-30%**: 红色（危险状态）
- **30-60%**: 黄色（警告状态）
- **60-100%**: 绿色（正常状态）

你也可以通过 CSS 变量自定义颜色：

```css
:root {
  --mw-neg-color: #dc2626;  /* 低值颜色（红） */
  --mw-neu-color: #f59e0b;  /* 中等值颜色（黄） */
  --mw-pos-color: #16a34a;  /* 高值颜色（绿） */
}
```

## 样式定制

Numerical 组件使用以下 CSS 变量：

```css
:root {
  --mw-primary-color: #2563eb;
  --mw-bg-color: #ffffff;
  --mw-text-color: #1f2937;
  --mw-border-color: #e5e7eb;
  --mw-radius-sm: 4px;
}
```

## 实际应用场景

### 角色面板

```numerical
title: 瓦尔基里·冰霜之心
items:
  - label: 生命值
    value: 950
    max: 1200
    icon: ❤️
  - label: 魔力值
    value: 1850
    max: 2000
    icon: 💧
  - label: 护甲
    value: 280
    icon: 🛡️
  - label: 魔法抗性
    value: 450
    icon: ✨
```

### 城市状态

```numerical
title: 王都·艾尔特里亚
items:
  - label: 繁荣度
    value: 85
    max: 100
    icon: 🏛️
  - label: 防御值
    value: 720
    max: 1000
    icon: 🏰
  - label: 人口
    value: 450000
    icon: 👥
  - label: 工业产值
    value: 12500
    icon: ⚙️
```

### Boss 属性

```numerical
title: 古龙·巴哈姆特
items:
  - label: 生命值
    value: 9850000
    max: 10000000
    icon: 💀
  - label: 护盾
    value: 500000
    max: 500000
    icon: 🔰
  - label: 狂暴值
    value: 75
    max: 100
    icon: 😡
```
