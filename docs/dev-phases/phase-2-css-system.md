# Phase 2: CSS 主题系统完善

## 🎯 本阶段目标

1. 完善 CSS 变量系统（交互状态、响应式断点、语义化颜色）
2. 创建通用组件样式（容器、标题、链接、卡片基础、徽章）
3. 创建布局系统（Grid、Flexbox、响应式工具类）
4. 创建工具类库（间距、文本、显示控制）
5. 创建样式入口文件并优化暗色模式

**完成日期**：2026-04-02

---

## ✅ 已完成的工作

### 1. CSS 变量系统扩展

#### 文件路径
- `src/styles/variables.css`

#### 实现内容
完善了全局 CSS 变量定义，新增以下变量组：

**交互状态变量**：
- `--mw-hover-color`: 悬停状态颜色
- `--mw-focus-color`: 焦点状态颜色
- `--mw-active-color`: 激活状态颜色
- `--mw-focus-ring`: 焦点环效果

**语义化颜色**：
- `--mw-success-color`: 成功状态（绿色）
- `--mw-warning-color`: 警告状态（黄色）
- `--mw-error-color`: 错误状态（红色）
- `--mw-info-color`: 信息状态（蓝色）

**响应式断点**：
- `--mw-breakpoint-mobile`: 320px
- `--mw-breakpoint-tablet`: 768px
- `--mw-breakpoint-desktop`: 1024px

**Z-Index 分层**：
- `--mw-z-base`: 1
- `--mw-z-dropdown`: 100
- `--mw-z-sticky`: 200
- `--mw-z-tooltip`: 300
- `--mw-z-modal`: 400
- `--mw-z-popover`: 500

**间距系统扩展**：
- 新增 `--mw-spacing-2xs`、`--mw-spacing-2xl`、`--mw-spacing-3xl`
- 完整覆盖 2xs → 3xl 八级间距

---

### 2. 通用组件样式

#### 文件路径
- `src/styles/components.css`

#### 实现内容

**容器系统**：
```css
.mw-container {
  max-width: 1200px;
  margin: auto;
  padding: var(--mw-spacing-md);
}
```

**排版系统**：
- `.mw-title`: 标题样式（1.25rem, 600 font-weight）
- `.mw-subtitle`: 副标题样式（1rem, 500 font-weight）

**链接系统**：
- `.mw-link`: 基础链接样式
- hover/focus/visited 状态处理
- 焦点环效果

**卡片基础**：
- `.mw-card-base`: 可复用的卡片容器
- 背景、边框、阴影、圆角统一配置

**徽章组件**：
- `.mw-badge`: 标签/徽章样式
- 小巧、圆角、背景色处理

**其他工具**：
- `.mw-divider`: 分隔线
- `.mw-button`: 按钮基础样式
- `.mw-icon-button`: 图标按钮

---

### 3. 布局系统

#### 文件路径
- `src/styles/layout.css`

#### 实现内容

**CSS Grid 系统**：
- `.mw-grid`: 基础网格容器
- `.mw-grid-2`, `.mw-grid-3`, `.mw-grid-4`, `.mw-grid-6`: 固定列数布局
- `.mw-grid-auto`: 自适应网格（auto-fit, minmax）
- `.mw-gap-sm/md/lg`: 间距变体

**Flexbox 系统**：
- `.mw-flex`: 基础 flex 容器
- `.mw-flex-row`, `.mw-flex-col`: 方向控制
- `.mw-flex-wrap`, `.mw-flex-nowrap`: 换行控制
- `.mw-items-center/start/end`: 对齐控制
- `.mw-justify-*`: 主轴对齐控制

**现代布局模式**：
- `.mw-stack`: 垂直堆叠（统一间距）
- `.mw-cluster`: 水平排列（自动换行）

**响应式工具**：
- `.mw-hide-mobile`: 移动端隐藏
- `.mw-hide-tablet`: 平板隐藏
- `.mw-hide-desktop`: 桌面端隐藏
- `.mw-show-mobile/tablet/desktop`: 显示控制

---

### 4. 工具类库

#### 文件路径
- `src/styles/utilities.css`

#### 实现内容

**间距工具类**：
- Margin: `.mw-m-*`, `.mw-mt-*`, `.mw-mb-*`, `.mw-ml-*`, `.mw-mr-*`
- Padding: `.mw-p-*`, `.mw-pt-*`, `.mw-pb-*`, `.mw-pl-*`, `.mw-pr-*`
- 尺寸: `0`, `xs`, `sm`, `md`, `lg`, `xl`

**文本工具类**：
- 对齐: `.mw-text-left/center/right`
- 样式: `.mw-text-muted`, `.mw-text-bold`, `.mw-text-mono`, `.mw-text-italic`
- 大小: `.mw-text-xs/sm/base/lg/xl/2xl`
- 截断: `.mw-truncate`, `.mw-line-clamp-2`, `.mw-line-clamp-3`

**显示控制**：
- `.mw-hidden`, `.mw-visible`, `.mw-invisible`
- `.mw-block`, `.mw-inline`, `.mw-inline-block`

**宽度工具**：
- `.mw-w-full`, `.mw-w-auto`
- `.mw-w-half`, `.mw-w-third`, `.mw-w-quarter` 等（使用语义化命名替代反斜杠）

**边框工具**：
- `.mw-border`, `.mw-border-t/b/l/r`
- `.mw-rounded-sm/md/lg`

**阴影工具**：
- `.mw-shadow-sm/md/lg`

---

### 5. 样式入口文件

#### 文件路径
- `src/styles/index.css`

#### 实现内容

**导入顺序**：
```css
1. variables.css   (CSS 变量)
2. components.css  (通用组件)
3. layout.css      (布局系统)
4. utilities.css   (工具类)
5. components/*.css (组件样式)
```

**全局重置**：
```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

### 6. 暗色模式优化

#### 实现内容

**颜色变量调整**：
在 `@media (prefers-color-scheme: dark)` 中调整所有颜色：
- 背景色: `#1f2937` (深灰)
- 文本色: `#f3f4f6` (近白)
- 边框色: `#374151` (中灰)
- 稀有度颜色: 提高亮度以适应深色背景

**对比度验证**：
- 所有文本与背景对比度 ≥ 4.5:1
- 使用 Chrome DevTools 验证通过

---

### 7. 响应式设计

#### 实现内容

**三断点策略**：
- **Mobile (320px)**：移动设备优先
- **Tablet (768px)**：平板设备
- **Desktop (1024px)**：桌面设备

**响应式特性**：
- Grid 自动适配列数
- Flexbox 方向切换
- 字体大小缩放
- 间距动态调整
- 显示/隐藏控制

---

## 🧪 验证步骤

### 构建验证
```bash
npm run build
```
**结果**: ✅ 构建成功，生成 `dist/style.css` (19.73 KB, gzip: 4.20 KB)

### 样式检查
1. 所有 CSS 变量以 `--mw-` 开头 ✅
2. 所有类名以 `.mw-` 开头 ✅
3. 无硬编码颜色值 ✅

### 响应式测试
- 320px (移动端): ✅ 布局正常
- 768px (平板): ✅ 布局正常
- 1024px (桌面): ✅ 布局正常

### 暗色模式测试
- 自动切换: ✅ `prefers-color-scheme: dark` 生效
- 文本可读: ✅ 对比度 ≥ 4.5:1

---

## 🔗 相关文件清单

### 新建文件
- `src/styles/components.css` - 通用组件样式
- `src/styles/layout.css` - 布局系统
- `src/styles/utilities.css` - 工具类库
- `src/styles/index.css` - 样式入口

### 修改文件
- `src/styles/variables.css` - 扩展 CSS 变量
- `src/index.ts` - 导入样式入口文件

---

## 🚧 已知问题和待办事项

- [x] CSS 变量完整定义
- [x] 响应式断点配置
- [x] 暗色模式适配
- [ ] ⚠️ 某些浏览器可能需要 `-webkit-` 前缀（已在 components.css 添加）
- [ ] 📝 未来可考虑支持自定义主题 hook

---

## 📌 给下一阶段 AI 的提示

1. **样式系统已完备**：Phase 3 的组件实现可以直接使用这些样式
2. **CSS 变量优先**：所有组件样式应使用 CSS 变量，避免硬编码
3. **响应式优先**：默认考虑移动端，使用 `@media (min-width: ...)` 渐进增强
4. **暗色模式自动**：无需特殊处理，CSS 变量自动切换
5. **工具类辅助**：可在组件中组合使用工具类减少自定义样式

---

## 📅 完成时间

2026-04-02

---

## 🎨 样式系统架构总结

```
src/styles/
├── variables.css      (CSS 变量定义 - 主题核心)
├── components.css     (通用组件基础样式)
├── layout.css         (Grid/Flex 布局系统)
├── utilities.css      (单用途工具类)
├── index.css          (样式汇总入口)
└── components/
    ├── card.css       (Phase 3)
    ├── numerical.css  (Phase 3)
    └── inventory.css  (Phase 3)
```

**设计原则**：
1. **内容与样式分离**: 数据由 YAML 定义，视觉由 CSS 变量控制
2. **移动优先**: 默认移动端布局，渐进增强到桌面端
3. **暗色模式自动**: 通过媒体查询自动适配
4. **极简主义**: 遵循 Minimalist Wiki 设计风格
5. **语义化命名**: 类名和变量名清晰表达用途
