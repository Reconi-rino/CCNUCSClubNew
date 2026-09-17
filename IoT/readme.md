# IoT 物联网协会 — 招新网站

2026 年 CCNU 计算机学院社团招新 · IoT 物联网协会宣传页。

技术栈：**Astro 5**（纯静态站点，无后端、无数据库）。

> **部署最省事的方式**：仓库里已经提交了预编译产物 `IoT/dist/`，**免构建**，把它（或整个仓库根目录）丢给静态托管即可，见第三节。

---

## 一、目录结构

```
IoT/
├── astro.config.mjs        # Astro 配置（静态输出）
├── package.json            # 依赖与 npm scripts
├── package-lock.json
├── .gitignore              # 忽略 node_modules / .astro（dist 已入库，见下）
├── scripts/
│   └── relativize.mjs      # ★ 构建后处理：把根绝对路径改成相对路径
├── public/                 # 静态资源，构建时原样拷贝到 dist/
│   └── assets/
│       ├── hero.webp                     # 首屏主视觉（已本地化，原为 Unsplash 外链）
│       ├── group-hardware.webp           # 硬件组配图（已本地化）
│       ├── group-software.webp           # 应用组配图（已本地化）
│       ├── group-algorithm.webp          # 算法组配图（已本地化）
│       ├── group-qr.png.jpg              # 招新 QQ 群二维码（页脚展示）
│       ├── groups/.gitkeep               # 预留：社团分组图片
│       └── showcase/                     # 获奖 / 活动展示墙图片（22 张，已压缩）
├── src/
│   ├── pages/index.astro   # 唯一页面：整站所有 section 的结构与样式
│   ├── data/
│   │   ├── showcase.ts     # 展示墙数据（图片路径、标题、描述）
│   │   └── groups.ts       # 三个组别的数据（含配图路径）
│   └── styles/global.css   # 全局样式（系统字体栈，无在线字体）
└── dist/                   # ★ 预编译静态产物（已入库，可直接部署）
```

### 页面 Section 构成（`src/pages/index.astro`）

| 顺序 | Section | 说明 |
| --- | --- | --- |
| 1 | Hero 首屏 | 主视觉（`assets/hero.webp`）与社团标语 |
| 2 | 关于协会 | 社团介绍 |
| 3 | 展示墙 Showcase | 横向滚动画廊，数据来自 `src/data/showcase.ts` |
| 4 | 招新信息 | 招新要求 / 三个组别 |
| 5 | 二维码 | 招新群二维码（`public/assets/group-qr.png.jpg`） |
| 6 | Footer | 页脚信息 |

> 特色：多层 sticky 堆叠滚动 + 分层遮罩（`feat: stacked sticky scroll with per-layer masking`）。

---

## 二、资源说明

| 资源 | 路径 | 是否需要打包 |
| --- | --- | --- |
| 主视觉 / 组别配图（4 张） | `public/assets/*.webp` | 需要，已入库（约 366 KB） |
| 展示墙图片（22 张） | `public/assets/showcase/` | 需要，已入库（约 3 MB） |
| 招新群二维码 | `public/assets/group-qr.png.jpg` | 需要，已入库 |
| CSS / JS | 由 Astro 构建生成 | 构建时打包进 `dist/_astro/` |
| `node_modules/`、`.astro/` | — | **不上传**，见 `.gitignore` |
| `dist/` | — | **已入库**（免构建部署用） |

### 已做的离线化 / 压缩处理

- **去掉外部依赖**：删除了 `@import url('https://fonts.googleapis.com/...')`，字体改用系统字体栈；首屏背景与三个组别配图原本直接用 `images.unsplash.com` 外链，现已下载转成 WebP 入库。**国内网络与完全离线环境都能正常显示。**
- **展示墙压缩**：22 张图统一长边 ≤1600 重新编码（照片转 JPEG q80，证书类 PNG 量化到 256 色），9.6 MB → 3.0 MB。
- **路径相对化**：`scripts/relativize.mjs` 在构建后把 `/_astro/`、`/assets/` 改成相对路径，因此**子路径部署**（如 `https://user.github.io/CCNUCSClubNew/IoT/dist/`）不会 404。

---

## 三、部署说明

### 方式 A：免构建直接部署（推荐）

仓库已提交 `IoT/dist/`，这是完整的静态站点：

```bash
# 把 IoT/dist/ 作为静态站点根目录
# Nginx 示例
root /path/to/CCNUCSClubNew/IoT/dist;
index index.html;
```

或者直接把**仓库根目录**作为站点根：集中站入口是 `/`，本协会入口是 `/IoT/dist/`。

### 方式 B：从源码重新构建

```bash
cd IoT
npm install
npm run build      # astro build + node scripts/relativize.mjs → 输出到 IoT/dist/
npm run preview    # 本地预览 http://localhost:4321
```

> `npm run build` 已经包含相对路径处理；若只想跑原生 Astro 构建，用 `npm run build:raw`（产物是根绝对路径，仅适合部署在域名根目录）。
> 改完源码后请把 `IoT/dist/` 一起提交，保证别人拉下来就能直接部署。

---

## 四、本地开发

```bash
npm install
npm run dev        # http://localhost:4321
```

## 五、维护提示

- 新增展示作品：把图片（建议先压到 1600px 以内）放进 `public/assets/showcase/`，并在 `src/data/showcase.ts` 中登记；若图片不是 `.jpg`，同步修改该文件的扩展名。
- 更换首屏主视觉：覆盖 `public/assets/hero.webp`（建议 2000px 宽、WebP q75 左右）。
- 更新二维码：直接覆盖 `public/assets/group-qr.png.jpg`。
- 请不要提交 `node_modules/`、`.astro/`；`dist/` 需要提交。
- 不要引入外部 CDN、在线字体或外链图片。
