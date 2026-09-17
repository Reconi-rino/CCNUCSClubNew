# ACM 协会（华中师大程序设计协会）

**本目录目前没有本地网页** —— ACM 协会的内容统一放在自己的 Wiki 上，集中站（仓库根 `index.html`）的 ACM 卡片与轮播横幅**直接跳转外部站点**：

- 招新站 / 知识库：<https://wiki.ccnuacm.com>
- 在线评测 OJ：<https://ac.ccnuacm.com>
- 组织 GitHub：<https://github.com/CCNU-ACM-Official>

新窗口打开（`target="_blank" rel="noopener noreferrer"`），因为它是另一个域名。

## 集中站里 ACM 的文案出处

卡片与横幅文案不是编的，来自他们自己的 Wiki：

| 位置 | 文案 | 出处 |
| --- | --- | --- |
| 副标题 | 华中师大程序设计协会 | Wiki 首页站点名 |
| 标语 | 算法 —— 计算机程序设计艺术 | Wiki 首页 |
| 简介 | 从零基础培养算法、思维和编程能力，感受 AC（通过题目）的乐趣，并参加省级、国家级程序设计竞赛 | Wiki 首页「协会工作」 |
| 标签 | C++ 与算法 / 数据结构 / 程序设计竞赛 | Wiki 首页「培训内容」+ 导航栏 |
| 链接 | 学习资源、活动日历、协会成果 | Wiki 导航栏实际栏目 |

主视觉 `assets/hub/img/banner-acm.webp` 是按上述信息用脚本生成的（蓝色渐变 + ACM 水印 + `WIKI.CCNUACM.COM`），随时可以换成他们的真图。

## 如果以后想改成自己托管

1. 把网页放进本目录，入口 `ACM/index.html`，站内引用用相对路径，不要引外部 CDN / 在线字体。
2. 打开根目录 `index.html`，把这两处的外部链接改成本地路径：
   - 轮播里 `<li ... aria-label="5 / 5：ACM 协会">` 中的 `<a class="btn" href="https://wiki.ccnuacm.com" ...>`
   - 卡片里 `<a class="card__link" href="https://wiki.ccnuacm.com" ...>`
   改成 `href="./ACM/"`，并去掉 `target="_blank" rel="noopener noreferrer"`。
3. 把第 2 步里 `card__cta` 的 `↗` 换回 `→`。
4. 在本文件里补上目录结构与资源清单。

## 相关约定

仓库整体的部署约定、资产压缩规范见根目录 [`../README.md`](../README.md)。
