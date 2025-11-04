# 项目打包与部署指南

本指南将帮助你打包并部署 Vue 3 组件库项目和 VitePress 文档到服务器。

## 📦 项目结构说明

本项目包含两部分：
1. **主应用**（Vue 3 组件库演示）：打包后输出到 `dist/`
2. **文档站点**（VitePress）：打包后输出到 `docs/.vitepress/dist/`

---

## 🔨 打包步骤

### 1. 安装依赖（如果还没安装）

```bash
npm install
```

### 2. 打包主应用

```bash
npm run build
```

打包完成后，静态文件会生成在 `dist/` 目录。

### 3. 打包文档

```bash
npm run docs:build
```

打包完成后，文档静态文件会生成在 `docs/.vitepress/dist/` 目录。

### 4. 本地预览（可选）

打包完成后，你可以本地预览验证：

```bash
# 预览主应用
npm run preview

# 预览文档（需要新开终端）
npm run docs:preview
```

---

## 🚀 部署方式

### 方式一：Nginx 部署（推荐）

#### 1. 准备服务器

确保服务器已安装 Nginx：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

#### 2. 上传文件到服务器

使用以下方式之一上传构建好的文件：

**方式 A：使用 SCP 命令**
```bash
# 上传主应用
scp -r dist/* root@your-server-ip:/var/www/html/

# 上传文档（如果要部署文档）
scp -r docs/.vitepress/dist/* root@your-server-ip:/var/www/html/docs/
```

**方式 B：使用 SFTP 工具**
- 使用 FileZilla、WinSCP 等工具
- 将 `dist/` 目录内容上传到服务器

#### 3. 配置 Nginx

编辑 Nginx 配置文件：

```bash
sudo vim /etc/nginx/sites-available/default
```

**主应用配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名
    
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**文档站点配置示例（如果要单独部署）：**

```nginx
server {
    listen 80;
    server_name docs.your-domain.com;  # 文档子域名
    
    root /var/www/html/docs;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**或者将文档部署在子路径下：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html;
    index index.html;

    # 主应用
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 文档部署在 /docs 路径
    location /docs {
        alias /var/www/html/docs;
        try_files $uri $uri/ /docs/index.html;
    }
}
```

#### 4. 重启 Nginx

```bash
# 测试配置是否正确
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
```

#### 5. 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

### 方式二：使用 Node.js + PM2 部署

#### 1. 安装 PM2

```bash
npm install -g pm2
```

#### 2. 安装 serve（静态文件服务器）

```bash
npm install -g serve
```

#### 3. 启动应用

```bash
# 启动主应用
pm2 serve dist 3000 --name "element-ui-app"

# 启动文档（如果需要）
pm2 serve docs/.vitepress/dist 3001 --name "element-ui-docs"
```

#### 4. 设置 PM2 开机自启

```bash
pm2 startup
pm2 save
```

#### 5. 配置 Nginx 反向代理（推荐）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 方式三：GitHub Pages 部署（适合文档）

#### 1. 修改 VitePress 配置

编辑 `docs/.vitepress/config.ts`，修改 `base` 路径：

```typescript
export default defineConfig({
  // 如果部署在 GitHub Pages 的仓库根目录
  base: '/',
  
  // 如果部署在子路径，如 /element-ui/
  base: '/element-ui/',
  
  // ... 其他配置
})
```

#### 2. 使用自动化部署脚本

项目已包含 `vitepress-starter/deploy.sh` 脚本，修改其中的仓库地址：

```bash
# 编辑 deploy.sh
vim vitepress-starter/deploy.sh

# 修改这一行
git push -f git@github.com:你的用户名/你的仓库名.git master:gh-pages
```

#### 3. 执行部署

```bash
chmod +x vitepress-starter/deploy.sh
./vitepress-starter/deploy.sh
```

#### 4. 配置 GitHub Pages

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 设置
3. 选择 `gh-pages` 分支
4. 保存后访问：`https://你的用户名.github.io/仓库名/`

---

### 方式四：使用 Docker 部署

#### 1. 创建 Dockerfile

在主项目目录创建 `Dockerfile`：

```dockerfile
# 使用多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build
RUN npm run docs:build

# 使用 nginx 作为生产服务器
FROM nginx:alpine

# 复制构建好的文件
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html/docs

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /docs {
        alias /usr/share/nginx/html/docs;
        try_files $uri $uri/ /docs/index.html;
    }
}
```

#### 3. 构建和运行

```bash
# 构建镜像
docker build -t element-ui:latest .

# 运行容器
docker run -d -p 80:80 --name element-ui element-ui:latest
```

---

## 📝 部署前检查清单

- [ ] 确保所有依赖已安装：`npm install`
- [ ] 测试主应用构建：`npm run build`
- [ ] 测试文档构建：`npm run docs:build`
- [ ] 本地预览验证：`npm run preview` 和 `npm run docs:preview`
- [ ] 检查构建输出目录是否存在文件
- [ ] 确认服务器已安装必要软件（Nginx/Node.js）
- [ ] 配置正确的域名和路径
- [ ] 检查防火墙设置（开放 80/443 端口）

---

## 🔧 常见问题

### 1. 路由 404 问题

**问题**：刷新页面后出现 404

**解决**：配置 Nginx `try_files` 规则，或使用 Vue Router 的 history 模式配置

### 2. 静态资源路径错误

**问题**：图片、CSS、JS 文件加载失败

**解决**：检查 `vite.config.ts` 中的 `base` 配置，确保与实际部署路径一致

### 3. 文档路径问题

**问题**：VitePress 文档链接不正确

**解决**：修改 `docs/.vitepress/config.ts` 中的 `base` 配置

### 4. API 请求跨域问题

**问题**：如果有后端 API，可能遇到跨域问题

**解决**：在 Nginx 中配置代理：

```nginx
location /api {
    proxy_pass http://your-api-server:port;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 📚 相关命令速查

```bash
# 开发
npm run dev                    # 启动主应用开发服务器
npm run docs:dev              # 启动文档开发服务器

# 构建
npm run build                 # 构建主应用
npm run docs:build           # 构建文档

# 预览
npm run preview               # 预览主应用
npm run docs:preview         # 预览文档

# Nginx 命令
sudo systemctl status nginx   # 查看状态
sudo systemctl restart nginx  # 重启
sudo nginx -t                 # 测试配置
```

---

## 🌐 推荐部署方案

### 小型项目/个人项目
- **主应用 + 文档**：都部署到同一台服务器的不同路径
- **使用 Nginx** 作为 Web 服务器

### 企业项目
- **主应用**：独立服务器或 CDN
- **文档**：GitHub Pages 或独立子域名
- **使用 HTTPS** 和 CDN 加速

### 开源组件库
- **文档**：GitHub Pages（免费且自动部署）
- **Demo**：可以部署到 Netlify、Vercel 等平台

---

祝你部署顺利！🚀

