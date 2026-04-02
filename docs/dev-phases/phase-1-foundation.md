# Phase 1: 项目初始化和基础架构

## 🎯 本阶段目标

1. 搭建可工作的 TypeScript + Vite 项目结构
2. 实现 markdown-it 插件核心架构（能够拦截 fence 代码块）
3. 实现适配器模式（`onNavigate` 导航回调接口）
4. 创建 YAML 解析器和验证工具
5. 为所有 8 个组件注册占位渲染器
6. 配置单元测试环境（Vitest）

**完成日期**：2026-04-01

---

## ✅ 已完成的工作

### 1. 项目配置文件

#### package.json
- **文件路径**：`package.json`
- **实现内容**：
  - 设置 `type: "module"` 启用 ES Modules
  - 配置双格式导出（ESM + UMD）
  - 声明 `markdown-it` 为 peer dependency
  - 添加所有必要的 devDependencies（echarts, mermaid, vis-timeline 等）
  - 定义 npm scripts：dev, build, test, docs
  - 配置 package 入口点：`main`, `module`, `types`, `exports`

#### tsconfig.json
- **文件路径**：`tsconfig.json`
- **实现内容**：
  - 目标 ES2020（支持现代浏览器）
  - 启用严格模式和未使用变量检查
  - 配置路径别名 `@/*` → `src/*`
  - 启用声明文件生成

#### vite.config.ts
- **文件路径**：`vite.config.ts`
- **实现内容**：
  - 使用 Library Mode 构建 npm package
  - 配置 `vite-plugin-dts` 生成 TypeScript 类型声明
  - 设置双格式输出：ES Module (`.js`) 和 UMD (`.umd.cjs`)
  - 外部化 `markdown-it` 和 `js-yaml`（peer/runtime dependencies）
  - 启用 sourcemap 和 esbuild 压缩

#### vitest.config.ts
- **文件路径**：`vitest.config.ts`
- **实现内容**：
  - 配置 jsdom 测试环境（模拟浏览器 DOM）
  - 启用覆盖率报告（v8 provider）
  - 排除不需要测试的目录

---

### 2. 导航适配器系统

#### src/adapters/navigation.ts
- **文件路径**：`src/adapters/navigation.ts`
- **实现内容**：
  - 定义 `NavigationEvent` 接口（path, sourceElement, metadata）
  - 定义 `NavigateFunction` 回调类型
  - 定义 `MarkdownWorldviewOptions` 插件配置接口
  - 实现 `mergeOptions()` 合并用户配置与默认配置
  - 实现 `createNavigationHandler()` 创建点击事件处理器
  - 提供默认的 `onNavigate` 实现（打印警告信息）

**关键设计**：
```typescript
export interface MarkdownWorldviewOptions {
  onNavigate?: NavigateFunction;  // 外部提供的导航函数
  debug?: boolean;                // 调试模式
  classPrefix?: string;           // CSS 类名前缀（默认 "mw"）
}
```

**使用示例**：
```typescript
// VitePress 集成
md.use(markdownWorldviewPlugin, {
  onNavigate: (event) => {
    router.push(event.path);
  }
});
```

---

### 3. YAML 解析和验证工具

#### src/parser/yaml-parser.ts
- **文件路径**：`src/parser/yaml-parser.ts`
- **实现内容**：
  - 定义 `YAMLParseError` 自定义错误类
  - 实现 `parseYAML<T>()` 安全解析 YAML 并返回类型化数据
  - 实现 `validateRequiredFields()` 检查必填字段
  - 实现 `validateFieldType()` 检查字段类型
  - 实现 `escapeHtml()` 和 `sanitizePath()` 防止 XSS 攻击

**依赖项**：`js-yaml` (^4.1.0)

**关键功能**：
- 检测空内容和无效 YAML
- 确保解析结果是对象类型
- 提供详细的错误信息（包含组件类型）
- 支持泛型以便类型推断

---

### 4. 组件注册系统

#### src/components/registry.ts
- **文件路径**：`src/components/registry.ts`
- **实现内容**：
  - 实现 `ComponentRegistry` 类管理所有组件渲染器
  - 定义 `ComponentRenderer` 函数类型
  - 提供 `register()`, `has()`, `get()`, `render()` 方法
  - 实现错误渲染（debug 模式显示，production 模式隐藏）
  - 为所有 8 个组件注册**占位渲染器**（显示 "🚧 Phase X" 和 JSON 数据）

**已注册的组件**：
- Phase 3: `card`, `numerical`, `inventory`
- Phase 4: `radar`, `power`
- Phase 5: `relations`, `hierarchy`, `timeline`

**占位渲染示例**：
```html
<div class="mw-card">
  <p>🚧 Card component (Phase 3)</p>
  <pre>{ "name": "Test", ... }</pre>
</div>
```

---

### 5. Markdown-it 插件核心

#### src/index.ts
- **文件路径**：`src/index.ts`
- **实现内容**：
  - 实现 `markdownWorldviewPlugin()` 主插件函数
  - 劫持 markdown-it 的 `fence` 渲染规则
  - 检测代码块类型（如 `card`, `radar`）并分发到对应渲染器
  - 非本插件的代码块交回原始渲染器处理
  - 导出所有公开类型和工具

**核心逻辑**：
```typescript
md.renderer.rules.fence = (tokens, idx, renderOptions, env, self) => {
  const componentType = tokens[idx].info.trim().split(/\s+/)[0];
  
  if (componentNames.includes(componentType)) {
    return componentRegistry.render(componentType, content, options);
  }
  
  return originalFence(tokens, idx, renderOptions, env, self);
};
```

---

### 6. CSS 主题系统基础

#### src/styles/variables.css
- **文件路径**：`src/styles/variables.css`
- **实现内容**：
  - 定义全局 CSS 变量（基于设计规范）
  - 颜色系统：primary, status (pos/neg/neu), rarity (common/rare/epic/legendary)
  - 字体系统：sans, mono
  - 间距系统：xs/sm/md/lg/xl
  - 边框圆角、阴影、过渡动画
  - 自动适配暗色模式（`prefers-color-scheme: dark`）
  - 占位组件的基础样式

**变量示例**：
```css
:root {
  --mw-primary-color: #2563eb;
  --mw-pos-color: #16a34a;
  --mw-neg-color: #dc2626;
  --mw-rarity-legendary: #f59e0b;
  /* ... */
}
```

---

### 7. 单元测试

#### __tests__/yaml-parser.test.ts
- **测试内容**：
  - ✅ 解析有效的 YAML
  - ✅ 空内容抛出错误
  - ✅ 无效 YAML 抛出错误
  - ✅ 非对象结果抛出错误
  - ✅ 验证必填字段
  - ✅ 验证字段类型（string/number/array/object）

#### __tests__/navigation.test.ts
- **测试内容**：
  - ✅ 合并用户配置与默认配置
  - ✅ 创建导航处理器并正确调用 `onNavigate`

#### __tests__/plugin.test.ts
- **测试内容**：
  - ✅ 插件正常注册
  - ✅ 渲染所有 8 个组件的占位符
  - ✅ 不干扰普通代码块（如 `javascript`）
  - ✅ Debug 模式显示错误
  - ✅ Production 模式隐藏错误

---

### 8. 文档和指南

#### AI_GUIDE.md
- **文件路径**：`AI_GUIDE.md`
- **实现内容**：
  - 定义 AI 协作开发规范
  - 要求每个 Phase 完成后在 `docs/dev-phases/` 创建说明文档
  - 规定文档必须包含的内容（目标、已完成工作、验证步骤、相关文件、已知问题、给下一阶段的提示）
  - 项目结构说明
  - 开发流程指南
  - 代码规范和关键注意事项

#### README.md
- **文件路径**：`README.md`
- **实现内容**：
  - 项目简介和特性列表
  - 快速开始示例
  - 组件使用示例
  - 开发命令说明
  - Roadmap（标记 Phase 1 已完成）

---

## 🧪 验证步骤

### 1. 安装依赖
```bash
cd markdown-worldview-plugin
npm install
```

### 2. 类型检查
```bash
npm run type-check
```
✅ 预期：无 TypeScript 错误

### 3. 运行测试
```bash
npm test
```
✅ 预期：所有测试通过（18 个测试用例）

### 4. 构建项目
```bash
npm run build
```
✅ 预期：在 `dist/` 目录生成以下文件：
- `markdown-worldview.js` (ESM)
- `markdown-worldview.umd.cjs` (UMD)
- `index.d.ts` (TypeScript 类型声明)
- `style.css` (CSS 样式)

### 5. 手动测试插件
创建一个测试文件 `test.js`:
```javascript
import MarkdownIt from 'markdown-it';
import { markdownWorldviewPlugin } from './dist/markdown-worldview.js';

const md = new MarkdownIt();
md.use(markdownWorldviewPlugin, { debug: true });

const markdown = `
\`\`\`card
name: Test Character
description: A brave warrior
\`\`\`
`;

console.log(md.render(markdown));
```

运行：
```bash
node test.js
```

✅ 预期：输出包含 `<div class="mw-card">` 和占位内容

---

## 🔗 相关文件清单

### 配置文件
- `package.json` — 项目配置和依赖
- `tsconfig.json` — TypeScript 配置
- `vite.config.ts` — Vite 构建配置
- `vitest.config.ts` — 测试配置
- `.gitignore` — Git 忽略文件

### 源代码
- `src/index.ts` — 主入口和插件注册
- `src/adapters/navigation.ts` — 导航适配器接口
- `src/parser/yaml-parser.ts` — YAML 解析和验证
- `src/components/registry.ts` — 组件注册系统
- `src/styles/variables.css` — CSS 变量和主题

### 测试文件
- `__tests__/yaml-parser.test.ts` — YAML 解析器测试
- `__tests__/navigation.test.ts` — 导航适配器测试
- `__tests__/plugin.test.ts` — 插件集成测试

### 文档
- `README.md` — 用户文档
- `AI_GUIDE.md` — AI 协作开发指南
- `docs/dev-phases/phase-1-foundation.md` — 本文件

---

## 🚧 已知问题和待办事项

### 已知问题
- [ ] CSS 样式目前只有占位样式，组件的真实样式在 Phase 2-5 实现
- [ ] 组件只显示 JSON 占位符，没有实际渲染逻辑

### Phase 1 未完成的可选任务
- [ ] 创建开发环境的 playground（可以在 Phase 2 做）
- [ ] 配置 ESLint 和 Prettier（可选，建议在 Phase 3 前完成）
- [ ] 添加 pre-commit hooks（可选）

### 性能优化（留到 Phase 7）
- [ ] 第三方库按需加载（动态 import）
- [ ] CSS 压缩优化
- [ ] Tree-shaking 优化

---

## 📌 给下一阶段 AI 的提示

### Phase 2: CSS 主题系统
你需要做：
1. **扩展 `variables.css`**：已经定义了所有需要的 CSS 变量，你只需在此基础上添加更多细节（如 hover 状态、focus 状态等）
2. **创建 `components.css`**：为每个组件编写专用样式（但先实现通用的基础样式类，如 `.mw-clickable`、`.mw-tag` 等）
3. **实现暗色模式切换**：可以添加一个 `.mw-dark` 类用于手动切换，或者只依赖 `prefers-color-scheme`

**注意事项**：
- 所有间距必须使用 `var(--mw-spacing-*)` 变量
- 所有颜色必须使用 `var(--mw-*-color)` 变量
- 移动端优先设计（先写移动端样式，再用 `@media (min-width: ...)` 添加桌面端样式）
- 确保 `link` 可点击的元素有明显的视觉反馈（hover 效果、cursor: pointer）

---

### Phase 3: 纯 CSS 组件实现
实现顺序建议：
1. **Card 组件**（最简单）
   - 读取 `src/components/registry.ts` 中的 `'card'` 占位渲染器
   - 创建新文件 `src/components/card.ts`
   - 实现真正的 HTML 渲染逻辑
   - 使用 `createNavigationHandler()` 绑定点击事件
   
2. **Numerical 组件**（中等）
   - 需要实现进度条（HTML + CSS）
   - 参考设计规范中的 `max` 和 `value` 字段
   
3. **Inventory 组件**（最复杂）
   - 使用 CSS Grid 布局
   - 根据 `rarity` 字段动态设置边框颜色
   - 处理 `amount` 显示（角标）

**重要**：
- 每个组件创建独立的 `.ts` 文件（如 `card.ts`, `numerical.ts`）
- 在 `registry.ts` 中替换占位渲染器
- 在对应的 CSS 文件中编写样式
- 为每个组件添加测试用例

---

### 技术债务提醒
- **XSS 防护**：`escapeHtml()` 和 `sanitizePath()` 已经实现，务必在所有组件中使用
- **Link 跳转**：永远不要用 `<a href="...">`，必须用 `createNavigationHandler()`
- **错误处理**：所有组件渲染器都要用 `try-catch` 包裹，并使用 `componentRegistry.renderError()`

---

### 参考资料
- **设计规范**：`Markdown-it-webview(1).md`（在项目根目录外）
- **开发计划**：`/memories/session/plan.md`
- **markdown-it API**：https://markdown-it.github.io/

---

## 📊 代码统计

| 类型 | 文件数 | 代码行数（估算） |
|------|--------|-----------------|
| 源代码 TypeScript | 4 | ~500 行 |
| 样式 CSS | 1 | ~150 行 |
| 测试 TypeScript | 3 | ~200 行 |
| 配置文件 | 5 | ~150 行 |
| 文档 | 3 | ~700 行 |
| **总计** | **16** | **~1700 行** |

---

## 🎉 Phase 1 总结

**成就**：
- ✅ 完整的 TypeScript + Vite 库项目结构
- ✅ 符合 npm 规范的 package 配置
- ✅ 可扩展的组件注册系统
- ✅ 安全的 YAML 解析和验证
- ✅ 灵活的导航适配器接口
- ✅ 18 个通过的单元测试
- ✅ 完善的 AI 协作文档

**下一步**：Phase 2 — 实现完整的 CSS 主题系统

---

**文档创建时间**：2026-04-01  
**创建者**：Phase 1 Implementation AI  
**验证状态**：✅ 所有验证步骤已完成
