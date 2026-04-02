# Inventory - 物品网格

Inventory 组件用于展示物品清单、装备栏、收藏品等，支持稀有度分级和网格布局。

## 基本用法

````markdown
```inventory
columns: 3
items:
  - name: 生命药水
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 魔法卷轴
    icon: https://via.placeholder.com/80
    rarity: rare
  - name: 誓约之剑
    icon: https://via.placeholder.com/80
    rarity: legendary
```
````

**预览效果：**

```inventory
columns: 3
items:
  - name: 生命药水
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 魔法卷轴
    icon: https://via.placeholder.com/80
    rarity: rare
  - name: 誓约之剑
    icon: https://via.placeholder.com/80
    rarity: legendary
```

## 完整信息的物品

````markdown
```inventory
columns: 4
items:
  - name: 誓约之剑
    rarity: legendary
    icon: https://via.placeholder.com/80
    type: 武器
    desc: 传说中斩裂黑夜的神剑
    link: /items/oath-sword
    amount: 1
  - name: 龙鳞护甲
    rarity: epic
    icon: https://via.placeholder.com/80
    type: 防具
    desc: 由远古巨龙的鳞片锻造
    link: /items/dragon-armor
    amount: 1
  - name: 以太水晶
    rarity: rare
    icon: https://via.placeholder.com/80
    type: 材料
    desc: 蕴含纯净魔力的水晶
    link: /items/ether-crystal
    amount: 99
  - name: 生命药水
    rarity: common
    icon: https://via.placeholder.com/80
    type: 消耗品
    desc: 恢复 500 点生命值
    link: /items/hp-potion
    amount: 15
```
````

**预览效果：**

```inventory
columns: 4
items:
  - name: 誓约之剑
    rarity: legendary
    icon: https://via.placeholder.com/80
    type: 武器
    desc: 传说中斩裂黑夜的神剑
    link: /items/oath-sword
    amount: 1
  - name: 龙鳞护甲
    rarity: epic
    icon: https://via.placeholder.com/80
    type: 防具
    desc: 由远古巨龙的鳞片锻造
    link: /items/dragon-armor
    amount: 1
  - name: 以太水晶
    rarity: rare
    icon: https://via.placeholder.com/80
    type: 材料
    desc: 蕴含纯净魔力的水晶
    link: /items/ether-crystal
    amount: 99
  - name: 生命药水
    rarity: common
    icon: https://via.placeholder.com/80
    type: 消耗品
    desc: 恢复 500 点生命值
    link: /items/hp-potion
    amount: 15
```

## 稀有度等级

Inventory 支持 4 个稀有度等级，每个等级有不同的边框颜色：

````markdown
```inventory
columns: 2
items:
  - name: 普通（Common）
    icon: https://via.placeholder.com/80
    rarity: common
    desc: 灰色边框
  - name: 稀有（Rare）
    icon: https://via.placeholder.com/80
    rarity: rare
    desc: 蓝色边框
  - name: 史诗（Epic）
    icon: https://via.placeholder.com/80
    rarity: epic
    desc: 紫色边框
  - name: 传说（Legendary）
    icon: https://via.placeholder.com/80
    rarity: legendary
    desc: 金色边框
```
````

**预览效果：**

```inventory
columns: 2
items:
  - name: 普通（Common）
    icon: https://via.placeholder.com/80
    rarity: common
    desc: 灰色边框
  - name: 稀有（Rare）
    icon: https://via.placeholder.com/80
    rarity: rare
    desc: 蓝色边框
  - name: 史诗（Epic）
    icon: https://via.placeholder.com/80
    rarity: epic
    desc: 紫色边框
  - name: 传说（Legendary）
    icon: https://via.placeholder.com/80
    rarity: legendary
    desc: 金色边框
```

## 响应式网格

通过 `columns` 字段控制网格列数，在移动端会自动调整为更少的列数。

````markdown
```inventory
columns: 5
items:
  - name: 物品 1
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 物品 2
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 物品 3
    icon: https://via.placeholder.com/80
    rarity: rare
  - name: 物品 4
    icon: https://via.placeholder.com/80
    rarity: epic
  - name: 物品 5
    icon: https://via.placeholder.com/80
    rarity: legendary
  - name: 物品 6
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 物品 7
    icon: https://via.placeholder.com/80
    rarity: rare
  - name: 物品 8
    icon: https://via.placeholder.com/80
    rarity: epic
  - name: 物品 9
    icon: https://via.placeholder.com/80
    rarity: legendary
  - name: 物品 10
    icon: https://via.placeholder.com/80
    rarity: common
```
````

**预览效果：**

```inventory
columns: 5
items:
  - name: 物品 1
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 物品 2
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 物品 3
    icon: https://via.placeholder.com/80
    rarity: rare
  - name: 物品 4
    icon: https://via.placeholder.com/80
    rarity: epic
  - name: 物品 5
    icon: https://via.placeholder.com/80
    rarity: legendary
  - name: 物品 6
    icon: https://via.placeholder.com/80
    rarity: common
  - name: 物品 7
    icon: https://via.placeholder.com/80
    rarity: rare
  - name: 物品 8
    icon: https://via.placeholder.com/80
    rarity: epic
  - name: 物品 9
    icon: https://via.placeholder.com/80
    rarity: legendary
  - name: 物品 10
    icon: https://via.placeholder.com/80
    rarity: common
```

## 字段说明

### 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|:-----|:-----|:-----|:-----|
| `columns` | number | ❌ | 网格列数（默认 4） |
| `items` | array | ✅ | 物品列表 |

### items 数组元素

| 字段 | 类型 | 必填 | 说明 |
|:-----|:-----|:-----|:-----|
| `name` | string | ✅ | 物品名称 |
| `icon` | string | ❌ | 图标 URL |
| `rarity` | string | ❌ | 稀有度：common, rare, epic, legendary |
| `type` | string | ❌ | 物品类型 |
| `desc` | string | ❌ | 描述文本 |
| `link` | string | ❌ | 点击后跳转的链接 |
| `amount` | number | ❌ | 数量（显示在右上角） |

## 稀有度颜色

```css
:root {
  --mw-rarity-common: #9ca3af;      /* 普通 - 灰色 */
  --mw-rarity-rare: #3b82f6;        /* 稀有 - 蓝色 */
  --mw-rarity-epic: #8b5cf6;        /* 史诗 - 紫色 */
  --mw-rarity-legendary: #f59e0b;   /* 传说 - 金色 */
}
```

你可以覆盖这些变量来自定义稀有度颜色。

## 样式定制

Inventory 组件使用以下 CSS 变量：

```css
:root {
  --mw-bg-color: #ffffff;
  --mw-text-color: #1f2937;
  --mw-border-color: #e5e7eb;
  --mw-radius-sm: 4px;
}
```

## 实际应用场景

### 角色装备栏

```inventory
columns: 3
items:
  - name: 龙鳞头盔
    icon: https://via.placeholder.com/80
    rarity: epic
    type: 头部
    desc: 防御 +85
    link: /items/dragon-helm
  - name: 秘银胸甲
    icon: https://via.placeholder.com/80
    rarity: rare
    type: 胸部
    desc: 防御 +120
    link: /items/mithril-chest
  - name: 影行者手套
    icon: https://via.placeholder.com/80
    rarity: epic
    type: 手部
    desc: 敏捷 +15
    link: /items/shadow-gloves
```

### 任务物品

```inventory
columns: 4
items:
  - name: 古老的钥匙
    icon: https://via.placeholder.com/80
    rarity: rare
    type: 钥匙
    desc: 打开禁忌之门的钥匙
    link: /quests/forbidden-door
  - name: 破损的地图
    icon: https://via.placeholder.com/80
    rarity: common
    type: 文书
    desc: 标记着宝藏的位置
    amount: 1
  - name: 神秘符文
    icon: https://via.placeholder.com/80
    rarity: legendary
    type: 魔法物品
    desc: 散发着未知的能量
    amount: 3
```

### 商店物品

```inventory
columns: 3
items:
  - name: 生命药水
    icon: https://via.placeholder.com/80
    rarity: common
    type: 消耗品
    desc: 恢复 500 HP | 价格: 50 金币
    amount: 99
  - name: 魔力药水
    icon: https://via.placeholder.com/80
    rarity: common
    type: 消耗品
    desc: 恢复 300 MP | 价格: 80 金币
    amount: 50
  - name: 复活之石
    icon: https://via.placeholder.com/80
    rarity: rare
    type: 消耗品
    desc: 复活战斗成员 | 价格: 500 金币
    amount: 5
```
