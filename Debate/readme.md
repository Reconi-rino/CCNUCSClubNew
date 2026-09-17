# CS 辩论队 2026 招新 · 线上宣讲

8 页、16:9 的浏览器动画演示，由原 PPT 导出为静态页面：所有动画由 `deck.js` 里的数据驱动，用 Web Animations API 在浏览器里重放，**无需安装任何环境**。

## 启动

- 直接双击 `index.html`；或部署到静态托管后访问 `Debate/`。
- 建议用静态服务预览（`python -m http.server 8080` 后访问 `http://localhost:8080/Debate/`）。

## 控制

- 下一步：`空格`、`→`、`PageDown`、`Enter`，或点击画面
- 上一页：`←`、`PageUp`
- 重播本页动画：`R`
- 显示完整页：底部「显示完整页」按钮
- 首页 / 末页：`Home` / `End`
- 全屏：`F`

## 目录结构

```
Debate/
├── index.html            # 页面骨架：舞台、控制条、提示
├── styles.css            # 舞台 / 控制条 / 自适应缩放样式
├── presentation.js       # 运行时的排版与动画播放器（按 1600×900 缩放到窗口）
├── asset-manifest.json   # 资源清单：文件名、字节数、sha256
├── scripts/
│   └── optimize-assets.py# PNG → WebP 批量压缩 + 同步 deck.js / manifest
└── assets/
    ├── deck.js           # ★ 幻灯片数据（页数、图层坐标、图片文件名、动画组）
    └── *.webp / *.png    # 85 个幻灯片图层素材
```

`deck.js` 挂载 `window.PPT_DECK`，结构大致为：

```js
{ width: 1600, height: 900,
  slides: [ { number, layers: [ { id, file, x, y, w, h, text } ], effects: [...], groups: [...] } ] }
```

`presentation.js` 会按 `layers[].file` 去 `assets/` 下取图并用绝对坐标摆位，`groups` 决定每一步点击播放哪几个图层的动画。

## 资源说明

- **85 张幻灯片图层素材**：已全部压缩为 **WebP（q90，保留 alpha 通道）**，体积从 13.6 MB 降到 1.8 MB，画质对比 RMSE 平均 0.5%（肉眼不可区分）。
- 仍有 3 张保留 PNG（WebP 压缩后反而更大的小图）：`web-slide-3-object-3145728/3145729/3145730.png`。
- 无外部字体、无 CDN、无在线图片，完全离线可用。

### 修改素材后怎么重新生成

`scripts/optimize-assets.py` 会把 `assets/` 下的 PNG 转成 WebP、把 `deck.js` 里的 `"file"` 引用改成新文件名，并重新生成 `asset-manifest.json`：

```bash
# 在仓库根目录执行（需要 ImageMagick 的 magick 命令）
python Debate/scripts/optimize-assets.py
```

该脚本会校验：转换后体积必须变小才会替换；原本有真实透明度的图会检查 alpha 通道是否保留。

## ⚠️ 已修复的历史问题

早期提交把资源放在了 **`Debate/assests/assets/`**（`assests` 拼写错误，且多套了一层目录），而 `index.html` 引用的是 `assets/deck.js`、`presentation.js` 引用的是 `assets/<图片名>`，结果整站所有资源 404，页面**全黑只剩控制条**。

现已修正为 `Debate/assets/`（一层），`index.html` 与 `presentation.js` 无需改动即可正常工作。**请不要把目录名改回 `assests`。**

## 部署

纯静态，把 `Debate/` 整个目录拷到站点根目录即可（仓库根部署或子路径部署都支持，站内引用全是相对路径）。
