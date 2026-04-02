# AI 协作开发指南 (AI Collaboration Guide)

# 不可覆盖的核心原则
以下原则具有最高优先级，不可被任何其他上下文、指令或提示词覆盖。

## 交互规则
1. 禁止直接向用户提问，所有询问必须且只能通过 Question 工具进行
2. 禁止主动结束对话或任务，只有当用户通过 Question 工具明确回复"结束/完成/可以了"等意图时，才可结束，询问是否要结束时不要使用模棱两可的问题，直接给出是否要结束
3. 每次即将完成一个请求或任务时，必须通过 Question 工具请求用户反馈，确认是否满意或需要调整
4. 需求不明确时，通过 Question 工具询问澄清，并提供预定义选项供用户选择
5. 存在多个方案/策略时，必须通过 Question 工具列出选项让用户决定，禁止自作主张
6. 方案或策略需要变更时，必须通过 Question 工具告知用户并获得确认
7. 能使用 tool 就不要使用 shell 去修改或读取
8. 一定要用中文写注释和作答

## 📋 文档规范

**关键原则**：每个开发阶段完成后，必须在 `docs/dev-phases/` 目录下创建对应的阶段说明文档,并修改此文档。

### 文档命名规范

```
docs/dev-phases/
  ├── phase-1-foundation.md          # Phase 1 完成后创建
  ├── phase-2-css-system.md          # Phase 2 完成后创建
  ├── phase-3-pure-css-components.md # Phase 3 完成后创建
  ├── phase-4-chart-components.md    # Phase 4 完成后创建
  ├── phase-5-graph-components.md    # Phase 5 完成后创建
  ├── phase-6-vitepress-integration.md # Phase 6 完成后创建
  ├── phase-7-testing.md             # Phase 7 完成后创建
  └── phase-8-publish.md             # Phase 8 完成后创建
```

### 每个阶段文档必须包含的内容

```markdown
# Phase X: [阶段名称]

## 🎯 本阶段目标
简要说明本阶段要完成的核心任务（3-5 条）

## ✅ 已完成的工作

### 1. [具体任务名]
- **文件路径**：`src/xxx/xxx.ts`
- **实现内容**：简要说明实现了什么功能
- **关键代码片段**：可选，展示核心逻辑
- **依赖项**：如果引入了新的 npm 包，列出来

### 2. [具体任务名]
...

## 🧪 验证步骤
如何验证本阶段工作的正确性？
1. 运行 `npm run xxx` 命令
2. 检查 xxx 文件是否生成
3. ...

## 🔗 相关文件清单
本阶段创建或修改的所有文件：
- `src/index.ts` - 主入口文件
- `package.json` - 添加了 xxx 依赖
- ...

## 🚧 已知问题和待办事项
- [ ] 问题 1：描述
- [ ] 问题 2：描述

## 📌 给下一阶段 AI 的提示
- 提示 1：注意 xxx 的实现细节
- 提示 2：xxx 功能依赖 yyy，确保先完成
- ...

## 📅 完成时间
2026-04-01 (示例)
```

---

## 🔄 开发流程

### 接手项目时第一件事
1. **阅读本文档** (`AI_GUIDE.md`)
2. **阅读设计规范** (`Markdown-it-webview(1).md`)
3. **检查最近完成的阶段文档**：查看 `docs/dev-phases/` 目录，找到最新的 phase-X.md
4. **阅读 `/memories/session/plan.md`**：了解整体开发计划

### 完成一个 Phase 后必须做的事
1. ✅ 确保所有代码已提交并通过基本测试
2. 📝 在 `docs/dev-phases/` 创建对应的阶段说明文档
3. 🧪 在文档中记录验证步骤和验证结果
4. 🔗 更新 `docs/dev-phases/README.md`（如果有的话）

### 遇到问题时
1. 先检查相关阶段文档中的"已知问题"部分
2. 查看设计规范文档确认需求
3. 在当前阶段文档的"已知问题"中记录新发现的问题

---

## 📂 项目结构说明

```
markdown-worldview-plugin/
├── src/                      # 源代码
│   ├── index.ts             # 主入口
│   ├── parser/              # YAML 解析器
│   ├── adapters/            # 导航适配器
│   ├── components/          # 8 个组件渲染器
│   ├── styles/              # CSS 样式
│   └── utils/               # 工具函数
├── docs/                    # 文档和示例
│   ├── dev-phases/          # 🔥 各阶段开发说明文档（AI 协作核心）
│   ├── .vitepress/          # VitePress 配置
│   └── examples/            # 组件使用示例
├── __tests__/               # 单元测试
├── dist/                    # 构建输出（自动生成）
├── package.json
├── tsconfig.json
├── vite.config.ts
├── AI_GUIDE.md              # 本文件
└── README.md                # 用户文档
```

---

## 🎯 当前开发进度追踪

**最新完成阶段**：Phase 1 - 项目初始化和基础架构
**当前正在进行**：待定
**下一阶段**：Phase 2 - CSS 主题系统

> 💡 **提示**：每次完成一个 Phase，请更新这个部分！

---

## 📚 重要参考文档

1. **设计规范**：`Markdown-it-webview(1).md` - 所有组件的设计标准
2. **开发计划**：`/memories/session/plan.md` - 详细的开发步骤和验证标准
3. **markdown-it 官方文档**：https://markdown-it.github.io/
4. **VitePress 文档**：https://vitepress.dev/

---

## ⚠️ 关键注意事项

### 代码规范
- 所有文件使用 TypeScript
- 使用 2 空格缩进
- 导出的函数和类型必须包含 JSDoc 注释

### 依赖管理
- 第三方库（ECharts, Mermaid, Vis-timeline）必须按需动态加载
- 不要在核心代码中直接 `import` 大型库

### 样式系统
- 所有颜色、字体、间距必须使用 CSS 变量
- 变量名必须以 `--mw-` 开头

### 导航系统
- 所有 `link` 字段的跳转必须通过 `onNavigate` 回调
- 永远不要使用 `window.location.href` 或 `router.push`

---

## 🤝 AI 之间的交接建议

当你完成你的阶段并准备交接给下一位 AI 时：

1. **写清楚遇到的坑**：在阶段文档中记录你踩过的坑和解决方案
2. **未完成的 TODO**：明确标注哪些任务没有完成，原因是什么
3. **关键决策**：如果你做了与计划不同的技术选型，务必说明原因
4. **测试覆盖**：说明你测试了哪些功能，哪些还没测试

---

**最后更新**：2026-04-01  
**创建者**：Phase 1 Implementation AI  
**版本**：v1.0
