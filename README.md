# Huihui 个人空间静态站点

一个可直接部署到 GitHub Pages 的静态网站，展示 Huihui 的教学与法硕/法考笔记、AI 创作、博客文章、相册与资料下载。

## 文件结构
```
.
├── index.html                # 首页，含快速入口与最近更新
├── about.html                # 关于我
├── teaching.html             # 教学与法硕资料库
├── works.html                # AI 与创作作品
├── blog.html                 # 博客列表
├── gallery.html              # 相册图库
├── downloads.html            # 下载中心
├── contact.html              # 联系方式
├── blog/
│   ├── 2025-01-01-hello.html
│   ├── 2025-02-10-cabling.html
│   └── 2025-03-05-psychlaw.html
├── assets/
│   ├── css/style.css         # 样式与暗色模式
│   ├── js/main.js            # 导航、数据渲染、灯箱、目录
│   ├── images/placeholder.svg
│   └── files/
│       ├── README.txt        # 下载文件说明
│       └── example.pdf       # 占位示例 PDF
├── data/
│   ├── posts.json            # 博客文章数据
│   ├── works.json            # 作品数据
│   ├── gallery.json          # 相册数据
│   └── files.json            # 下载资料数据
└── README.md
```

## 本地预览
1. **直接双击 `index.html`**，浏览器即可打开，适合快速查看静态页面效果。
2. **VS Code Live Server**：在 VS Code 中安装 *Live Server* 扩展，右键 `index.html` 选择 “Open with Live Server”。
3. **Python 简易服务器**：在项目根目录运行 `python -m http.server 8000`，浏览器访问 <http://localhost:8000>。

## GitHub Pages 部署
1. 推送代码到 GitHub 仓库。
2. 打开仓库 `Settings → Pages`。
3. 在 "Build and deployment" 中选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/ (root)`。
5. 保存后等待几分钟，即可通过提示的 URL 访问站点。

## 更新内容
- **博客与页面数据**：编辑 `data/posts.json`、`data/works.json`、`data/gallery.json`、`data/files.json` 即可更新页面展示内容。
- **下载资料**：将文件放入 `assets/files/` 目录（或替换为外部链接），并在 `data/files.json` 中更新路径与元信息。
- **图片资源**：将图片放入 `assets/images/` 并在对应 JSON 中引用。

更新 JSON 后刷新页面即可看到最新内容，无需构建流程。

## 内容版权与联系
站点内容版权归 Huihui 所有。转载或引用请注明来源，如需商业合作、讲座或课程咨询，请通过 `contact.html` 提供的邮箱与社交平台联系。

可选的访问统计（如 Google Analytics 或 umami）可在页面中按需自行添加 `<script>`，本模板默认不含统计脚本。
