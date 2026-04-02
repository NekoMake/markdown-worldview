# Phase 3 组件示例

这个文件展示了 Card、Numerical 和 Inventory 三个纯 CSS 组件的使用示例。

## Card（介绍卡片）

### 完整字段示例

```card
name: 艾蕾娜·星语
avatar: /assets/elena.jpg
description: 银月森林的守护者，能听见星辰的私语。
dictum: 森林记得每一个名字，也记得每一场雨。
tags: [精灵, 传奇射手, 守序中立]
link: /wiki/elena
```

### 最小字段示例

```card
name: 简单角色
```

### 无头像示例

```card
name: 神秘旅者
description: 来历不明的旅行者，总是戴着兜帽。
tags: [神秘, 旅者]
link: /wiki/traveler
```

---

## Numerical（数值面板）

### 完整字段示例

```numerical
title: 当前状态
items:
  - label: 生命值
    value: 85
    max: 100
    icon: ❤️
  - label: 魔力值
    value: 60
    max: 100
    icon: ✨
  - label: 体力值
    value: 45
    max: 100
    icon: ⚡
```

### 仅数值（无进度条）

```numerical
title: 角色属性
items:
  - label: 力量
    value: 18
    icon: 💪
  - label: 敏捷
    value: 15
    icon: 🏃
  - label: 智力
    value: 20
    icon: 🧠
```

### 无标题无图标

```numerical
items:
  - label: 经验值
    value: 1500
    max: 2000
  - label: 金币
    value: 9999
```

---

## Inventory（物品网格）

### 完整字段示例（4列）

```inventory
columns: 4
items:
  - name: 誓约之剑
    rarity: legendary
    icon: /assets/items/sword.png
    type: 武器
    desc: 传说中斩裂黑夜的名剑。
    link: /wiki/items/oath-sword
    amount: 1
  - name: 龙鳞盾
    rarity: epic
    icon: /assets/items/shield.png
    type: 防具
    desc: 由远古巨龙的鳞片锻造而成。
    link: /wiki/items/dragon-shield
    amount: 1
  - name: 治愈药水
    rarity: common
    icon: /assets/items/potion.png
    type: 消耗品
    desc: 恢复 50 点生命值。
    amount: 12
  - name: 魔力水晶
    rarity: rare
    icon: /assets/items/crystal.png
    type: 材料
    desc: 蕴含纯净魔力的水晶。
    amount: 5
```

### 简化版本（无图标）

```inventory
columns: 3
items:
  - name: 面包
    rarity: common
    amount: 20
  - name: 水壶
    rarity: common
    amount: 1
  - name: 地图
    rarity: rare
    link: /wiki/map
```

### 6列网格

```inventory
columns: 6
items:
  - name: 铜币
    rarity: common
    amount: 999
  - name: 银币
    rarity: common
    amount: 150
  - name: 金币
    rarity: rare
    amount: 25
  - name: 铂金币
    rarity: epic
    amount: 5
  - name: 魔法石
    rarity: legendary
    amount: 1
  - name: 空位
    rarity: common
```

---

## 组合使用示例

可以在同一页面中混合使用多个组件：

```card
name: 勇者·凯尔
avatar: /assets/kael.jpg
description: 从偏远村庄走出的勇者，立志拯救世界。
tags: [人类, 勇者, 主角]
link: /wiki/kael
```

```numerical
title: 凯尔的当前状态
items:
  - label: 生命值
    value: 120
    max: 120
    icon: ❤️
  - label: 魔力值
    value: 80
    max: 100
    icon: ✨
```

```inventory
columns: 4
items:
  - name: 新手之剑
    rarity: common
    type: 武器
  - name: 皮甲
    rarity: common
    type: 防具
  - name: 治愈药水
    rarity: common
    amount: 5
  - name: 面包
    rarity: common
    amount: 10
```

---

## 注意事项

1. **Card 组件**：
   - `name` 为必填字段
   - 有 `link` 时卡片可点击
   - `tags` 为数组格式

2. **Numerical 组件**：
   - `items` 为必填字段且不能为空
   - 每个 item 必须包含 `label` 和 `value`
   - 有 `max` 时显示进度条，否则只显示数值

3. **Inventory 组件**：
   - `items` 为必填字段且不能为空
   - 每个 item 必须包含 `name`
   - `columns` 默认为 4
   - `rarity` 可选值：common、rare、epic、legendary
   - `amount` 大于 1 时显示数量徽章
