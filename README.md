# CCNUCSClubNew

华中师范大学计算机学院 **2026 年社团招新**站点集合。

仓库根目录是一个**集中站（Hub）**：横幅轮换展示各社团主视觉，下方卡片汇总各社团介绍并跳转到各自的招新网站；每个社团的站点独立存放在自己的子目录里（ACM 协会的内容托管在它自己的 Wiki 上，卡片直接跳外链）。

---

## 一、目录结构

```
CCNUCSClubNew/
├── index.html                 # ★ 集中站（纯静态，无构建步骤）
├── assets/hub/                # ★ 集中站自己的资源
│   ├── hub.css                #   样式（系统字体，无外部 CDN）
│   ├── hub.js                 #   轮播逻辑（渐进增强，无 JS 也能看）
│   ├── favicon.svg
│   └── img/                   #   横幅主图 / 卡片图 / 分享封面（全部 WebP）
│       ├── banner-cyber.webp      # 信息安全协会主视觉
│       ├── banner-debate.webp     # CS 辩论队主视觉
│       ├── banner-iot.webp        # 物联网协会主视觉
│       ├── banner-pentium.webp    # 奔腾服务队主视觉
│       ├── banner-acm.webp        # ACM 协会主视觉（脚本生成）
│       └── og-cover.webp          # 社交分享封面（og:image）
├── CyberSecurity/             # 信息安全协会：纯离线演示文稿（HTML/CSS/JS）
├── Debate/                    # CS 辩论队：8 页动画演示（预编译静态站）
├── IoT/                       # 物联网协会：Astro 源码 + dist 预编译产物
│   ├── src/ public/           #   源码与原始素材
│   └── dist/                  #   ★ 已入库的静态产物（免构建可直接部署）
├── Pentium/                   # 奔腾服务队：静态单页（HTML/CSS/JS）
├── ACM/                       # ACM 协会：内容托管在 wiki.ccnuacm.com（本目录为空）
└── Robot/                     # 机器人协会：未提供网页，集中站暂不收录
```

集中站收录的五个条目：

| 社团 | 入口 | 技术栈 | 是否免构建 |
| --- | --- | --- | --- |
| 信息安全协会 | `CyberSecurity/` | 原生 HTML + CSS + JS | ✅ 免构建 |
| CS 辩论队 | `Debate/` | 预编译静态站（deck.js 驱动） | ✅ 免构建 |
| 物联网协会 | `IoT/dist/` | Astro 5 → 静态 HTML | ✅ 免构建（产物已入库） |
| 奔腾服务队 | `Pentium/` | 原生 HTML + CSS + JS | ✅ 免构建 |
| ACM 协会 | <https://wiki.ccnuacm.com> | 外部站点（新窗口打开） | — |
| 机器人协会 | — | 对方未提供网页，**暂不收录** | — |

---

## 二、本地预览

集中站的链接**全部是相对路径**（`./CyberSecurity/`、`./assets/hub/...`），因此必须以站点根目录启动一个静态服务来预览（直接双击 `index.html` 时 `file://` 协议下也能看，但建议用服务）：

```bash
# 在仓库根目录执行任意一种
python -m http.server 8080
npx serve .
```

然后访问 `http://localhost:8080/`。

---

## 三、静态部署

整个仓库根目录就是一份可以直接丢给静态托管的产物，**不依赖 Node、后端、数据库、外部 CDN**：

```bash
# 任选其一，把仓库根目录作为站点根
# GitHub Pages：Settings → Pages → Source 选 main 分支 /(root)
# Nginx：
#   root /path/to/CCNUCSClubNew;
#   index index.html;
# Vercel / Netlify / Cloudflare Pages：Build command 留空，Output directory 填 ./
```

因为全站使用相对路径，下面三种部署方式都能正常工作：

- 用户主页 `https://<user>.github.io/`（站点在根路径）
- 项目主页 `https://<user>.github.io/CCNUCSClubNew/`（站点在子路径）✅ 已验证
- 自建域名 / 任意子目录 / 离线打开

> ⚠️ 唯一注意点：如果你在子路径下部署，**不要**把各站点里的绝对路径（以 `/` 开头）改回来。IoT 的构建脚本 `IoT/scripts/relativize.mjs` 会自动处理这一步。

---

## 四、怎么新增 / 接入一个社团

1. 在对应社团目录（如 `ACM/`、`Robot/`）里放入它的网页。要求：
   - 入口固定为 `index.html`；
   - 站内所有资源引用使用**相对路径**；
   - 不引用外部 CDN / 在线字体 / 外链图片（保证离线与校内网络可用）。
2. 在根目录 `index.html` 中：
   - 在 `<ul class="slides">` 里复制一个 `<li class="slide">`，替换主视觉图片与文案，并把每张的 `aria-label`（`1 / 5` 之类）改成新的总数；
   - 在 `<div class="cards">` 里复制一个 `<article class="card">`，把 `href` 指向该社团目录，并把 `--accent` 改成该社团的强调色；
   - 如果社团暂时没有网页，用现成的占位模板 `<article class="card is-soon">` + `<span class="card__badge">网站建设中</span>`（样式已保留在 `hub.css` 里，见 `Robot/readme.md` 的示例）。
3. 为该社团生成主视觉图（建议 `1920×900`，输出 WebP，控制在 200 KB 以内），放到 `assets/hub/img/`。
4. 在该社团目录下写一份 `readme.md`，说明目录结构、资源清单和部署方式。

> 外部站点（如 ACM 的 Wiki）直接用绝对 URL 写在 `card__link` / `btn` 的 `href` 上，并加 `target="_blank" rel="noopener noreferrer"`，CTA 文案结尾用 `↗` 表示会跳到站外。

---

## 五、资产与体积

所有图片都做过针对性压缩，仓库整体（不含 `node_modules`）约 **11 MB**：

| 位置 | 处理方式 | 结果 |
| --- | --- | --- |
| `Debate/assets/` | 85 张幻灯片 PNG → WebP（q90，保留 alpha），同步更新 `deck.js` 与 `asset-manifest.json` | 13.6 MB → **1.8 MB** |
| `IoT/public/assets/showcase/` | 长边限到 1600、重新编码；照片转 JPEG、证书类 PNG 量化 | 9.6 MB → **3.0 MB** |
| `IoT/public/assets/` | 原本依赖 Unsplash 外链 → 下载并转成 WebP 入库（`hero.webp`、`group-*.webp`） | 离线可用 |
| `CyberSecurity/Prizes/`、`advertising_page.png` | JPEG 重压缩、PNG 量化 | 3.2 MB → **1.1 MB** |
| `assets/hub/img/` | 5 张横幅（1920×900 WebP）+ 分享封面 | **476 KB** |

字体一律使用系统字体栈，**没有**任何 `fonts.googleapis.com`、CDN 或远程图片请求。

---

## 六、各社团站点说明

每个社团目录下都有自己的 `readme.md`，写明结构、资源与部署方式：

- [`CyberSecurity/readme.md`](CyberSecurity/readme.md)
- [`Debate/readme.md`](Debate/readme.md)
- [`IoT/readme.md`](IoT/readme.md)
- [`Pentium/readme.md`](Pentium/readme.md)
- [`ACM/readme.md`](ACM/readme.md) · [`Robot/readme.md`](Robot/readme.md)

---

## 七、提交规范

成为 contributor 或者提交 PR 都可以。提交前请自查：

- [ ] 新增页面在仓库根目录起静态服务后，能在**子路径**下正常显示（打开 DevTools 看有没有 404）；
- [ ] 没有引入外部 CDN / 在线字体 / 外链图片；
- [ ] 新图片已压缩，单个不超过 ~300 KB；
- [ ] 更新了对应社团目录下的 `readme.md`。

---

## 如果你是大语言模型（LLM）或 AI Agent，请阅读以下内容

本仓库已经完成过一轮「静态可部署性 + 资产体积」的整理，当前状态与约定如下，请勿回退：

1. **预编译产物入库**：`IoT/dist/` 已经入库（`.gitignore` 中不再忽略 `dist/`），目的是让上游 owner 免构建直接部署。修改 IoT 源码后请务必执行
   ```bash
   cd IoT && npm install && npm run build     # build 会自动运行 scripts/relativize.mjs
   ```
   并把 `IoT/dist/` 一起提交。`relativize.mjs` 会把 Astro 输出的 `/_astro/`、`/assets/` 改写成相对路径，这是子路径部署能正常工作的前提。
2. **不要引入外部依赖**：不要添加 Google Fonts、CDN 脚本、外链图片。IoT 早期的 Unsplash 背景图和 Google Fonts 已本地化，CyberSecurity / Pentium / Debate 本来就是离线实现。
3. **路径一律相对**：集中站与各站点内部都使用 `./` 或 `../` 相对路径，保证「项目主页子路径部署」和「仓库根目录部署」都能跑。
4. **`Debate/` 的目录名不要改回 `assests`**：历史提交里资源被放在 `Debate/assests/assets/` 下，而 `index.html` / `presentation.js` 引用的是 `assets/...`，导致整个演示**打不开（全黑）**。已修正为 `Debate/assets/`。
5. **改 `Debate/assets/` 里的图片后**，请同步重新生成 `Debate/asset-manifest.json`（记录文件字节数与 sha256），保持文档与实际文件一致。
6. **集中站（根 `index.html`）的社团数据是写死在 HTML 里的**，不是运行时拉取；新增/删除社团请手动增删 slide 与 card（同时改掉每张 slide 的 `aria-label` 序号），以保证无 JS 时也能看到完整列表。
7. **不要给集中站的图片加 `decoding="async"`**：实测会导致图片偶发不绘制（出现空框），本地小图并行解码的收益不值得这个风险。
8. **机器人协会（`Robot/`）暂时没有网页，集中站刻意不收录**；等你拿到他们的网页再按第四节接入。ACM 协会的入口是外部 Wiki，不要擅自改成本地路径。
9. 提交信息建议使用 `feat(hub): ...` / `fix(Debate): ...` 这类带范围前缀的格式。
