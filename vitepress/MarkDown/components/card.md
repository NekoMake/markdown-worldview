# Card - 介绍卡片

Card 组件用于展示角色、势力、物品等的基本信息，适合作为百科条目的头部展示。

## 基本用法

````markdown
```card
name: 艾蕾娜·星语
avatar: /neko.png
description: 银月森林的精灵守护者，世代守护着古老的魔法结界
dictum: "森林记得每一个名字"
tags: [精灵, 传奇射手, 守序中立]
```
````

**预览效果：**

```card
name: 艾蕾娜·星语
avatar: /neko.png
description: 银月森林的精灵守护者，世代守护着古老的魔法结界
dictum: "森林记得每一个名字"
tags: [精灵, 传奇射手, 守序中立]
```

## 带链接的卡片

添加 `link` 字段可以让卡片可点击，点击后会触发 `onNavigate` 回调。

````markdown
```card
name: 亚瑟·潘德拉贡
avatar: /neko.png
description: 不列颠的传奇国王，拔出石中剑的王者
dictum: "我是王者，但首先我是骑士"
tags: [人类, 统治者, 守序善良]
link: /wiki/arthur
```
````

**预览效果：**

```card
name: 亚瑟·潘德拉贡
avatar: /neko.png
description: 不列颠的传奇国王，拔出石中剑的王者
dictum: "我是王者，但首先我是骑士"
tags: [人类, 统治者, 守序善良]
link: /wiki/arthur
```

## 最小化卡片

只有 `name` 是必填字段，其他字段都是可选的。

````markdown
```card
name: 神秘旅者
```
````

**预览效果：**

```card
name: 神秘旅者
```

## 完整示例

````markdown
```card
name: 瓦尔基里·冰霜之心
avatar: /neko.png
description: 北境雪山的冰霜女王，掌控着寒冰与风暴的力量。传说她的泪水能冻结时间。
dictum: "冰封万物，唯心不灭"
tags: [冰霜巨人, 女王, 混乱中立, 传奇法师]
link: /characters/valkyrie
```
````

**预览效果：**

```card
name: 瓦尔基里·冰霜之心
avatar: /neko.png
description: 北境雪山的冰霜女王，掌控着寒冰与风暴的力量。传说她的泪水能冻结时间。
dictum: "冰封万物，唯心不灭"
tags: [冰霜巨人, 女王, 混乱中立, 传奇法师]
link: /characters/valkyrie
```

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
|:-----|:-----|:-----|:-----|
| `name` | string | ✅ | 名称 |
| `avatar` | string | ❌ | 头像图片 URL |
| `description` | string | ❌ | 描述文本 |
| `dictum` | string | ❌ | 座右铭/名言 |
| `tags` | array | ❌ | 标签列表 |
| `link` | string | ❌ | 点击后跳转的链接 |

## 样式定制

Card 组件使用以下 CSS 变量：

```css
:root {
  --mw-primary-color: #2563eb;      /* 链接和强调色 */
  --mw-bg-color: #ffffff;           /* 背景色 */
  --mw-text-color: #1f2937;         /* 文本颜色 */
  --mw-text-muted: #6b7280;         /* 次要文本颜色 */
  --mw-border-color: #e5e7eb;       /* 边框颜色 */
  --mw-radius-md: 8px;              /* 圆角大小 */
  --mw-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
}
```

你可以在你的 CSS 中覆盖这些变量来自定义样式。

## 响应式设计

Card 组件在移动端会自动调整布局：
- 桌面端：头像在左侧
- 移动端：头像移到顶部

## 实际应用场景

### 角色介绍

```card
name: 梅林
avatar: /neko.png
description: 亚瑟王的宫廷魔法师，预言家，智者
dictum: "未来已被书写，但命运仍可改变"
tags: [半人类, 大法师, 守序中立]
link: /characters/merlin
```

### 势力介绍

```card
name: 影刃公会
avatar: /neko.png
description: 主大陆最神秘的刺客组织，只为信仰而非金钱服务
dictum: "黑暗是我们的家，沉默是我们的誓言"
tags: [刺客组织, 中立邪恶, 隐秘结社]
link: /factions/shadowblade
```

### 物品介绍

```card
name: 誓约之剑
avatar: /neko.png
description: 传说中斩裂黑夜的神剑，只认可纯洁心灵的持有者
tags: [神器, 长剑, 传说级]
link: /items/oath-sword
```
