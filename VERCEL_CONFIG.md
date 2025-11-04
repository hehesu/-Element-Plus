# Vercel 部署配置说明

## ⚠️ 重要：修改 base 路径

在部署到 Vercel 之前，需要根据部署方式修改 `base` 路径。

### 当前配置

```typescript
// docs/.vitepress/config.ts
base: '/element-ui/'
```

### 部署到 Vercel 默认域名

如果使用 Vercel 提供的默认域名（如 `your-project.vercel.app`），需要修改为：

```typescript
base: '/'
```

**修改步骤**：
1. 打开 `docs/.vitepress/config.ts`
2. 将第 65 行的 `base: '/element-ui/'` 改为 `base: '/'`
3. 保存文件
4. 提交并推送到 GitHub

### 使用自定义域名

如果使用自定义域名，可以保持 `base: '/'`。

---

## 📝 完整部署步骤（快速版）

### 1. 修改配置（必须）

编辑 `docs/.vitepress/config.ts`：

```typescript
export default defineConfig({
  // ... 其他配置
  base: '/',  // 改为根路径
})
```

### 2. 推送到 GitHub

```bash
git add .
git commit -m "准备部署到 Vercel"
git push
```

### 3. 在 Vercel 部署

1. 访问 https://vercel.com
2. 登录（使用 GitHub）
3. 点击 "Add New Project"
4. 导入你的 GitHub 仓库
5. 配置：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run docs:build`
   - **Output Directory**: `docs/.vitepress/dist`
6. 点击 "Deploy"

### 4. 完成！

几分钟后，你的文档就会上线！

---

## 🔧 vercel.json 已创建

我已经为你创建了 `vercel.json` 配置文件，包含正确的构建配置。

这个文件会自动告诉 Vercel：
- 如何构建你的文档
- 输出目录在哪里
- 如何处理路由

你不需要手动配置，Vercel 会自动读取这个文件。

