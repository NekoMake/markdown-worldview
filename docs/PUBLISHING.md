# 发布指南 (Publishing Guide)

本文档提供将 `markdown-worldview` 发布到 npm 的完整步骤。

## 📋 发布前检查清单

### 1. npm 账号准备

- [ ] 在 [https://www.npmjs.com/signup](https://www.npmjs.com/signup) 注册 npm 账号
- [ ] 验证邮箱（npm 会发送验证邮件）
- [ ] 在终端运行 `npm login` 登录账号

### 2. 代码质量检查

```bash
# 运行类型检查
npm run type-check

# 运行测试
npm test

# 构建
npm run build
```

### 3. 版本信息确认

- [ ] 检查 `package.json` 中的版本号（当前：`0.1.0-alpha.0`）
- [ ] 确认 `author` 字段已填写
- [ ] 确认 `repository` URL 正确
- [ ] 确认 `keywords` 合适（帮助用户搜索）

### 4. 文档完整性

- [ ] README.md 包含基本使用说明
- [ ] LICENSE 文件存在（当前：MIT）
- [ ] CHANGELOG 记录了本次发布的变更（可选）

### 5. 构建产物确认

运行 `npm run build` 后，确认 `dist/` 目录包含：

- [ ] `index.d.ts` - TypeScript 类型定义
- [ ] `markdown-worldview.js` - ES Module 版本
- [ ] `markdown-worldview.umd.cjs` - UMD 版本
- [ ] `markdown-worldview.css` - 样式文件

---

## 🚀 发布步骤

### 步骤 1: 注册并登录 npm

如果还没有 npm 账号：

```bash
# 注册新账号（会打开浏览器）
npm adduser
```

如果已有账号：

```bash
# 登录已有账号
npm login
```

按提示输入：
- Username（用户名）
- Password（密码）
- Email（邮箱）
- One-time password（如果启用了 2FA）

验证登录状态：

```bash
npm whoami
```

### 步骤 2: 最终检查

```bash
# 进入项目目录
cd markdown-worldview-plugin

# 查看将要发布的文件列表
npm pack --dry-run

# 这会显示哪些文件会被包含在包中
# 应该只包含 dist/ 目录和必要的文档文件
```

### 步骤 3: 发布

#### Alpha 版本发布（首次发布推荐）

```bash
# 发布 alpha 版本（不会成为 latest 标签）
npm publish --tag alpha
```

#### 正式版本发布（稳定后使用）

```bash
# 发布正式版本
npm publish
```

### 步骤 4: 验证发布

访问你的包页面：
```
https://www.npmjs.com/package/markdown-worldview
```

尝试安装：

```bash
# 安装 alpha 版本
npm install markdown-worldview@alpha

# 或安装特定版本
npm install markdown-worldview@0.1.0-alpha.0
```

---

## 🔄 后续版本发布

### 更新版本号

使用 npm 的版本管理命令：

```bash
# Alpha 版本递增（0.1.0-alpha.0 → 0.1.0-alpha.1）
npm version prerelease --preid=alpha

# Beta 版本（0.1.0-alpha.0 → 0.1.0-beta.0）
npm version prerelease --preid=beta

# 小版本更新（0.1.0 → 0.1.1）
npm version patch

# 次版本更新（0.1.0 → 0.2.0）
npm version minor

# 主版本更新（0.1.0 → 1.0.0）
npm version major
```

### 快速发布流程

```bash
# 1. 更新代码后运行测试
npm test

# 2. 构建
npm run build

# 3. 更新版本号
npm version prerelease --preid=alpha

# 4. 发布
npm publish --tag alpha

# 5. 推送到 Git（包含新的 tag）
git push && git push --tags
```

---

## ⚠️ 注意事项

### 版本策略

- **Alpha 版本** (`0.1.0-alpha.x`)：早期开发版本，功能不完整，API 可能变动
- **Beta 版本** (`0.1.0-beta.x`)：功能基本完整，进行测试和修复 bug
- **正式版本** (`0.1.0`)：稳定版本，可用于生产环境

### npm publish 标签说明

- `--tag alpha`：用户需要显式安装 `@alpha` 才能获取
- `--tag beta`：用户需要显式安装 `@beta` 才能获取
- 无标签（或 `--tag latest`）：`npm install` 默认安装的版本

### 发布后无法撤销

- npm 发布后 **24 小时内**可以使用 `npm unpublish` 撤销
- 24 小时后只能废弃版本：`npm deprecate markdown-worldview@0.1.0-alpha.0 "This version is deprecated"`
- 已发布的版本号**永远不能再次使用**

### 包名注意事项

- 包名 `markdown-worldview` 必须在 npm 上是唯一的
- 如果该名称已被占用，需要修改为其他名称
- 可以使用 scope 包名：`@your-username/markdown-worldview`

---

## 🐛 常见问题

### 1. 包名已存在

错误：`npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/markdown-worldview`

解决方案：
- 修改 `package.json` 中的 `name` 字段为其他名称
- 或使用 scoped 包名：`@NekoMake/markdown-worldview`

### 2. 邮箱未验证

错误：`npm ERR! 403 Forbidden - you must verify your email`

解决方案：
- 检查注册邮箱的验证邮件
- 或访问 [https://www.npmjs.com/email-edit](https://www.npmjs.com/email-edit) 重新发送

### 3. 2FA 验证失败

如果启用了双因素认证：
- 使用 Authenticator App（如 Google Authenticator）获取验证码
- 或生成 Access Token：[https://www.npmjs.com/settings/~/tokens](https://www.npmjs.com/settings/~/tokens)

### 4. 构建失败

确保安装了所有依赖：

```bash
npm install
npm run build
```

检查 TypeScript 错误：

```bash
npm run type-check
```

---

## 📚 参考资源

- [npm 官方文档](https://docs.npmjs.com/)
- [npm 包发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [语义化版本规范](https://semver.org/lang/zh-CN/)

---

**最后更新**：2026-04-02  
**当前版本**：0.1.0-alpha.0  
**维护者**：NekoMake
