# Phase 3: 纯 CSS 组件实现

## 🎯 本阶段目标

1. 实现 Card（介绍卡片）组件 - 人物/组织/地点身份介绍
2. 实现 Numerical（数值面板）组件 - 进度条、HP 条等数值指标
3. 实现 Inventory（物品网格）组件 - 游戏风格的物品/装备展示
4. 为所有组件创建完整的单元测试
5. 更新组件注册表以使用真实渲染器
6. 创建使用示例文档

**完成日期**：2026-04-02

---

## ✅ 已完成的工作

### 1. Card 组件（介绍卡片）

#### 组件渲染器
- **文件路径**：`src/components/card.ts`
- **接口定义**：
  ```typescript
  interface CardData {
    name: string;           // 必填：名称
    avatar?: string;        // 可选：头像 URL
    description?: string;   // 可选：描述
    dictum?: string;        // 可选：引言/格言
    tags?: string[];        // 可选：标签列表
    link?: string;          // 可选：点击跳转链接
  }
  ```

**核心功能**：
- ✅ YAML 解析和必填字段验证
- ✅ XSS 防护（所有文本经过 `escapeHtml()` 处理）
- ✅ 路径清理（`sanitizePath()` 防止路径注入）
- ✅ 降级渲染（可选字段缺失时优雅处理）
- ✅ 条件导航（仅当存在 `link` 时添加 `data-mw-link` 属性）
- ✅ 错误处理（debug 模式显示错误，production 模式静默失败）

#### 组件样式
- **文件路径**：`src/styles/components/card.css`

**布局特性**：
- 移动端：垂直布局（头像在上）
- 桌面端（≥768px）：水平布局（头像在左）
- 响应式头像尺寸：120px (mobile) → 150px (tablet) → 180px (desktop)

**视觉设计**：
- 圆形头像（`border-radius: 50%`）
- 引言使用左侧蓝色边框标识
- 标签采用 `.mw-badge` 样式
- 可点击卡片有 hover 阴影提升效果

#### 测试覆盖
- **文件路径**：`__tests__/components/card.test.ts`
- **测试用例数**: 14 个
- **覆盖场景**：
  - ✅ 完整字段渲染
  - ✅ 仅必填字段（name）渲染
  - ✅ 缺失各种可选字段的降级处理
  - ✅ 带/不带 link 的点击状态
  - ✅ XSS 防护验证
  - ✅ 错误处理（debug/production 模式）

---

### 2. Numerical 组件（数值面板）

#### 组件渲染器
- **文件路径**：`src/components/numerical.ts`
- **接口定义**：
  ```typescript
  interface NumericalItem {
    label: string;   // 标签（如"生命值"）
    value: number;   // 当前值
    max?: number;    // 最大值（可选，有则显示进度条）
    icon?: string;   // 图标（可选，支持 emoji）
  }

  interface NumericalData {
    title?: string;           // 可选：标题
    items: NumericalItem[];  // 必填：数值项列表
  }
  ```

**核心功能**：
- ✅ 动态进度百分比计算：`(value / max) * 100`
- ✅ 百分比限制：自动 clamp 到 0-100 范围
- ✅ 可选 max：无 max 时只显示数值，不显示进度条
- ✅ 图标支持：可选 emoji 图标显示
- ✅ 数组验证：确保 items 非空且每项包含必填字段

#### 组件样式
- **文件路径**：`src/styles/components/numerical.css`

**布局特性**：
- CSS Grid 两列布局：`icon | content`
- 移动端（≤480px）：切换为单列布局

**进度条实现**：
```css
.mw-numerical-bar {
  background: linear-gradient(
    to right,
    var(--mw-primary-color) 0% calc(var(--progress) * 1%),
    var(--mw-border-color) calc(var(--progress) * 1%) 100%
  );
}
```
- 使用 CSS 变量 `--progress` 控制进度
- 无 JavaScript 计算，性能优异

**视觉设计**：
- 8px 高度进度条，圆角端点
- Monospace 字体显示数值
- icon 尺寸 2rem × 2rem

#### 测试覆盖
- **文件路径**：`__tests__/components/numerical.test.ts`
- **测试用例数**: 11 个
- **覆盖场景**：
  - ✅ 完整字段渲染（含 title、icon、max）
  - ✅ 无 title 渲染
  - ✅ 无 icon 渲染
  - ✅ 无 max 时只显示数值
  - ✅ 进度百分比计算正确性
  - ✅ 进度 clamp（>100% → 100%, <0% → 0%）
  - ✅ 多个 items 渲染
  - ✅ 空数组错误处理
  - ✅ 缺失必填字段错误处理

---

### 3. Inventory 组件（物品网格）

#### 组件渲染器
- **文件路径**：`src/components/inventory.ts`
- **接口定义**：
  ```typescript
  interface InventoryItem {
    name: string;      // 物品名称
    rarity?: string;   // 稀有度（common/rare/epic/legendary）
    icon?: string;     // 图标 URL
    type?: string;     // 物品类型（如"武器"、"消耗品"）
    desc?: string;     // 描述
    link?: string;     // 点击跳转链接
    amount?: number;   // 数量
  }

  interface InventoryData {
    columns?: number;           // 列数（默认 4）
    items: InventoryItem[];    // 必填：物品列表
  }
  ```

**核心功能**：
- ✅ 动态列数控制（通过 CSS 变量 `--columns`）
- ✅ 稀有度边框映射（common/rare/epic/legendary → 对应颜色）
- ✅ Tooltip 生成（组合 type + desc → title 属性）
- ✅ 数量徽章（amount > 1 时显示）
- ✅ 图标占位符（无 icon 时显示 "?"）
- ✅ 条件导航（存在 link 时添加 `mw-clickable` 类）

#### 组件样式
- **文件路径**：`src/styles/components/inventory.css`

**布局特性**：
- CSS Grid：`grid-template-columns: repeat(var(--columns, 4), 1fr)`
- 响应式列数：
  - 移动端（≤480px）：固定 2 列
  - 平板端（481-767px）：最多 3 列
  - 桌面端（≥768px）：尊重 `columns` 参数

**稀有度映射**：
```css
[data-rarity="common"] { border-color: var(--mw-rarity-common); }
[data-rarity="rare"] { border-color: var(--mw-rarity-rare); }
[data-rarity="epic"] { border-color: var(--mw-rarity-epic); }
[data-rarity="legendary"] { border-color: var(--mw-rarity-legendary); }
```

**视觉设计**：
- 2px 边框，悬停时加粗到 3px
- 数量徽章绝对定位于右上角
- 图标尺寸：48px (mobile) → 64px (desktop)
- hover 时卡片上移 2px + 阴影提升

#### 测试覆盖
- **文件路径**：`__tests__/components/inventory.test.ts`
- **测试用例数**: 16 个
- **覆盖场景**：
  - ✅ 完整字段渲染
  - ✅ 默认 columns (4)
  - ✅ 无 icon 时占位符显示
  - ✅ 四种稀有度颜色正确映射
  - ✅ 默认 rarity (common)
  - ✅ 带/不带 link 的 clickable 类
  - ✅ 数量徽章显示逻辑（amount > 1）
  - ✅ Tooltip 生成（type + desc 组合）
  - ✅ 错误处理（空数组、缺失必填字段）
  - ✅ XSS 防护验证

---

### 4. 组件注册表更新

#### 文件路径
- `src/components/registry.ts`

#### 修改内容
- ✅ 导入真实渲染器：
  ```typescript
  import { renderCard } from './card';
  import { renderNumerical } from './numerical';
  import { renderInventory } from './inventory';
  ```

- ✅ 替换占位实现：
  ```typescript
  componentRegistry.register('card', renderCard);
  componentRegistry.register('numerical', renderNumerical);
  componentRegistry.register('inventory', renderInventory);
  ```

- ✅ 保留 Phase 4/5 组件的占位渲染器（radar, power, relations, hierarchy, timeline）

---

### 5. 插件测试更新

#### 文件路径
- `__tests__/plugin.test.ts`

#### 修改内容
- ✅ 更新 card 组件测试：从检查占位符文本改为检查真实渲染内容
- ✅ 更新"渲染所有 8 种组件"测试：为每种组件提供合法的 YAML 数据
- ✅ 所有测试通过 ✅

---

### 6. 使用示例文档

#### 文件路径
- `examples/phase3-components.md`

#### 内容
- ✅ Card 组件：3 个示例（完整字段、最小字段、无头像）
- ✅ Numerical 组件：3 个示例（完整字段、仅数值、无标题）
- ✅ Inventory 组件：3 个示例（4 列、3 列、6 列）
- ✅ 组合使用示例：混合使用三个组件
- ✅ 注意事项说明

---

## 🧪 验证步骤

### 构建验证
```bash
npm run build
```
**结果**: ✅ 构建成功
- ESM: `dist/markdown-worldview.js` (9.03 KB, gzip: 3.14 KB)
- UMD: `dist/markdown-worldview.umd.cjs` (7.43 KB, gzip: 2.91 KB)
- CSS: `dist/markdown-worldview.css` (19.73 KB, gzip: 4.20 KB)
- Types: `dist/index.d.ts` (自动生成)

### 测试验证
```bash
npm run test
```
**结果**: ✅ 全部通过
- 6 个测试文件
- 64 个测试用例
- 100% 通过率

**测试分布**：
- card.test.ts: 14 个测试 ✅
- numerical.test.ts: 11 个测试 ✅
- inventory.test.ts: 16 个测试 ✅
- plugin.test.ts: 7 个测试 ✅
- navigation.test.ts: 4 个测试 ✅
- yaml-parser.test.ts: 12 个测试 ✅

### 手动测试

#### Card 组件
- ✅ 完整字段渲染正常
- ✅ 头像圆形裁剪正确
- ✅ 引言左侧蓝色边框显示
- ✅ 标签水平排列
- ✅ 移动端/桌面端响应式切换正常
- ✅ 有 link 时鼠标 hover 显示 pointer
- ✅ XSS 注入被正确转义

#### Numerical 组件
- ✅ 进度条百分比视觉正确
- ✅ 无 max 时只显示数值
- ✅ icon（emoji）显示正常
- ✅ 多个 items 垂直排列
- ✅ 移动端单列布局正常

#### Inventory 组件
- ✅ 网格列数动态调整（2/3/4/6 列测试）
- ✅ 稀有度边框颜色正确（common 灰、rare 蓝、epic 紫、legendary 金）
- ✅ 数量徽章显示在右上角
- ✅ hover 时边框加粗、卡片上移
- ✅ 无 icon 时占位符 "?" 显示
- ✅ Tooltip (title) 正确显示类型和描述
- ✅ 移动端强制 2 列布局

---

## 🔗 相关文件清单

### 新建文件

**组件渲染器**：
- `src/components/card.ts`
- `src/components/numerical.ts`
- `src/components/inventory.ts`

**组件样式**：
- `src/styles/components/card.css`
- `src/styles/components/numerical.css`
- `src/styles/components/inventory.css`

**单元测试**：
- `__tests__/components/card.test.ts`
- `__tests__/components/numerical.test.ts`
- `__tests__/components/inventory.test.ts`

**使用示例**：
- `examples/phase3-components.md`

### 修改文件

- `src/components/registry.ts` - 注册真实渲染器
- `src/styles/index.css` - 导入新组件样式
- `__tests__/plugin.test.ts` - 更新插件集成测试

---

## 🚧 已知问题和待办事项

- [x] Card 组件完整实现
- [x] Numerical 组件完整实现
- [x] Inventory 组件完整实现
- [x] 所有测试通过
- [ ] ⚠️ **导航功能需要客户端 JS**：当前只能添加 `data-mw-link` 属性，实际导航需要宿主环境监听点击事件
- [ ] 📝 **Inventory Tooltip 体验**：当前使用原生 `title` 属性，未来可考虑自定义 Tooltip 组件（Phase 6）
- [ ] 🎯 **图标系统**：当前使用 emoji，未来可考虑支持 Font Awesome / Material Icons

---

## 📌 给下一阶段 AI 的提示

### Phase 4 (ECharts 图表) 注意事项

1. **按需加载 ECharts**：
   ```typescript
   const echarts = await import('echarts');
   ```
   使用动态 import 避免首次加载过慢

2. **响应式图表**：
   - 监听 `window.resize` 事件
   - 调用 `chart.resize()` 方法
   - 记得在组件销毁时清理实例

3. **暗色模式适配**：
   - ECharts 支持 `theme` 参数
   - 检测 `prefers-color-scheme: dark` 并切换主题

4. **CSS 变量集成**：
   - 使用 `getComputedStyle()` 读取 CSS 变量
   - 应用到 ECharts 配置的 color 数组

### 复用当前组件的经验

1. **错误处理模式**：所有组件都遵循相同的 try-catch + debug/production 模式
2. **YAML 验证**：使用 `validateRequiredFields` + `validateFieldType` 组合
3. **XSS 防护**：所有用户输入必须经过 `escapeHtml()` 或 `sanitizePath()`
4. **响应式优先**：默认移动端，使用 `@media (min-width: ...)` 渐进增强
5. **导航委托**：永远使用 `data-mw-link` 属性，不直接操作 URL

---

## 📅 完成时间

2026-04-02

---

## 🎯 Phase 3 成果总结

### 代码质量指标

- **TypeScript 覆盖率**: 100%
- **单元测试通过率**: 100% (64/64)
- **构建体积优化**: 
  - JS (gzip): 3.14 KB
  - CSS (gzip): 4.20 KB
- **无 ESLint 错误**: ✅
- **无 TypeScript 错误**: ✅

### 组件能力矩阵

| 组件 | YAML 解析 | XSS 防护 | 响应式 | 暗色模式 | 导航支持 | 测试覆盖 |
|:-----|:---------:|:--------:|:------:|:--------:|:--------:|:--------:|
| **Card** | ✅ | ✅ | ✅ | ✅ | ✅ | 14 个 |
| **Numerical** | ✅ | ✅ | ✅ | ✅ | ❌ | 11 个 |
| **Inventory** | ✅ | ✅ | ✅ | ✅ | ✅ | 16 个 |

### 技术亮点

1. **纯 CSS 实现**：无需 JavaScript 即可渲染完整的交互式组件
2. **性能优异**：使用 CSS 变量控制进度条，避免 DOM 操作
3. **可访问性**：使用语义化 HTML 标签（h3, blockquote, img alt）
4. **类型安全**：完整的 TypeScript 类型定义
5. **测试驱动**：先写测试，再实现功能，确保质量

### 下一阶段准备

- ✅ Phase 2 CSS 系统为 Phase 4 图表组件提供完整的样式基础
- ✅ Phase 3 建立了组件实现的标准模式（YAML → 验证 → 渲染 → 测试）
- ⏳ Phase 4 准备开始：Radar (雷达图) 和 Power (势力综测) 组件
