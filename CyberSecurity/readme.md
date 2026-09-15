# 信息安全协会 2026 招新演示

纯离线、9 页、16:9 的浏览器动态演示文稿，无需安装 Node.js、Python 或 Office。

## 启动

- 双击 `START.bat`：优先使用 Microsoft Edge 全屏打开。
- 或直接双击 `index.html`。

## 控制

- 下一页：`→`、`Space`、`PageDown`、向下滚轮、点击画面右侧
- 上一页：`←`、`PageUp`、向上滚轮、点击画面左侧
- 首页 / 末页：`Home` / `End`
- 全屏：`F`
- 退出全屏：`Esc`

## 修改招新信息与二维码

编辑 `js/config.js` 中的四个字段。二维码图片建议放在 `assets/images/`，例如：

```js
qrImage: "assets/images/recruitment-qr.png"
```

二维码留空时，末页会显示明确的本地占位框，不会生成无法扫描的伪二维码。

## 离线说明

项目没有 CDN、在线字体、远程图片、在线脚本或 API 请求。所有动画均由本地 CSS、SVG、Canvas 和原生 JavaScript 实现。
