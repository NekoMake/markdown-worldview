# 错误处理 🛠️

当组件渲染失败时会显示错误提示：

## 常见错误 + 示例

### 1️⃣ 未知组件

**示例（会报错）：**
```markdown
:::unknowntype
name: 测试
:::
```

**显示：** ℹ️ 未知的组件类型

**解决：** 检查拼写，可用组件：`card`、`numerical`、`inventory`


### 2️⃣ YAML 格式错误

**示例（会报错）：**
```markdown
:::card
name: "未闭合引号
tags: [错误格式
:::
```

**显示：** ℹ️ 数据格式错误

**常见错误：**
| 问题 | 错误 | 正确 |
|------|------|------|
| 引号 | `name: "测试` | `name: "测试"` |
| 冒号 | `name 测试` | `name: 测试` |
| 缩进 | `tags:[a,b]` | `tags: [a, b]` |

**解决：** 使用 [YAML验证器](https://www.yamllint.com/)


### 3️⃣ 字段类型错误

**示例（会报错）：**
```markdown
:::numerical
items:
  - label: 测试
    value: "应该是数字"
    max: 100
:::
```

**显示：** ℹ️ 组件渲染失败

**解决：** 检查字段类型（如 `value` 和 `max` 应为数字）


## 调试技巧

1. **按 F12 看控制台** - 所有错误都会输出日志
2. **先用最小示例** - 从简单的开始逐步添加字段
3. **开启 debug 模式** - 查看详细错误信息

```markdown
<!-- ✅ 先确认最小示例能用 -->
:::card
name: 测试
:::

<!-- 然后逐步添加 -->
:::card
name: 测试
description: 描述
tags: [标签1]
:::
```

## FAQ

**Q: 组件完全不显示？**  
A: 检查插件和样式是否正确导入

**Q: 生产环境怎么调试？**  
A: 临时设置 `debug: true`，调试完改回 `false`

**Q: 能在 YAML 里写注释吗？**  
A: 不支持，请把注释写在代码块外面

**Q: 怎么自定义错误样式？**  
A: 参考 [主题定制](/guide/theming) 的错误样式配置

## 实际测试

下面是几个故意写错的示例，看看错误提示效果：

### ❌ 错误 1：未知组件
```wrongtype
test: data
```

### ❌ 错误 2：YAML 格式错误
```card
name: "未闭合
```

### ✅ 正常对照
```card
name: 艾蕾娜·星语
description: 银月森林的精灵守护者，世代守护着古老的魔法结界
```
---

💡 更多帮助：[快速开始](/guide/quickstart) · [组件文档](/components/card) · [GitHub Issues](https://github.com/your-repo/issues)
