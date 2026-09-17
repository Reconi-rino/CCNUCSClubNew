# 信息安全协会 2026 招新演示

纯离线、9 页、16:9 的浏览器动态演示文稿，无需安装 Node.js、Python 或 Office。

## 启动

- 双击 `START.bat`：优先使用 Microsoft Edge 全屏打开。
- 或直接双击 `index.html`。
- 部署后访问 `CyberSecurity/`。

## 控制

- 下一页：`→`、`Space`、`PageDown`、向下滚轮、点击画面右侧
- 上一页：`←`、`PageUp`、向上滚轮、点击画面左侧
- 首页 / 末页：`Home` / `End`
- 全屏：`F`
- 退出全屏：`Esc`

## 目录结构

```
CyberSecurity/
├── index.html          # 9 页幻灯片的 DOM 结构与文案
├── START.bat           # Windows 一键全屏启动（可选）
├── css/
│   ├── reset.css       # 基础重置
│   └── presentation.css# 演示文稿样式与动画
├── js/
│   ├── config.js       # ★ 招新信息集中配置（群号 / 地点 / 二维码）
│   ├── effects.js      # Canvas 背景、终端打字等视觉特效
│   └── presentation.js # 翻页 / 揭示动画控制
├── Prizes/             # 获奖证书配图（4 张，已压缩）
├── assets/images/      # 预留：放招新二维码等后续图片
├── Logo-ccnu.png       # 校徽（页眉展示）
└── advertising_page.png# 招新宣传海报（用于集中站横幅与对外宣传）
```

## 资源说明

| 资源 | 说明 |
| --- | --- |
| `Prizes/*` | 竞赛获奖证明（ISCC / CISCN / CNVD / 高校 SRC），已在 `index.html` 中直接引用；已重新压缩，2.4 MB → 0.8 MB |
| `advertising_page.png` | 招新海报，集中站（仓库根 `index.html`）的横幅由它裁切生成 |
| `Logo-ccnu.png` | 页眉校徽，8 KB |
| `assets/images/` | 仅有一个 `.gitkeep` 占位，用于放二维码等后续图片 |

全部资源均为本地文件，**不使用 CDN、在线字体或外链图片**，校园网与离线环境都能正常显示。站内引用全部是相对路径，放在任意子目录下部署都可以。

## 修改招新信息与二维码

编辑 `js/config.js` 中的四个字段。二维码图片建议放在 `assets/images/`，例如：

```js
qrImage: "assets/images/recruitment-qr.png"
```

二维码留空时，末页会显示明确的本地占位框，不会生成无法扫描的伪二维码。

## 离线说明

项目没有 CDN、在线字体、远程图片、在线脚本或 API 请求。所有动画均由本地 CSS、SVG、Canvas 和原生 JavaScript 实现。
