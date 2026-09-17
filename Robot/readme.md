# 机器人协会

**本目录暂无内容，集中站也暂不收录本社团** —— 对方还没有提供招新网页，所以根目录 `index.html` 里既没有机器人协会的轮播横幅，也没有卡片。

（仓库里保留这个空目录，等网页做好后直接放进来即可。）

## 以后有了网页怎么接入

1. 把网页放到本目录，入口固定为 `Robot/index.html`；站内引用用**相对路径**（`./styles.css`、`./img/x.webp`），不要用 `/xxx` 这种根绝对路径，否则部署到 `https://<user>.github.io/CCNUCSClubNew/` 这类子路径下会 404。
2. 不要引入外部 CDN / 在线字体 / 外链图片；字体用系统字体栈，图片单张压到 300 KB 以内。
3. 生成一张主视觉图（建议 `1920×900`，WebP，≤200 KB）放到 `assets/hub/img/banner-robot.webp`。
4. 在根目录 `index.html` 里加两处：
   - **轮播**：在 `<ul class="slides">` 内复制一个 `<li class="slide">`，`aria-label` 改成 `6 / 6：机器人协会`，并把前面的 `1 / 5` … `5 / 5` 依次改成 `x / 6`；
   - **卡片**：在 `<div class="cards">` 内复制一个 `<article class="card">`，`href` 指向 `./Robot/`。
   如果想先占位、暂时不可点，用现成的模板（样式已保留在 `assets/hub/hub.css` 里）：

   ```html
   <article class="card is-soon" style="--accent:#ff9a46">
     <span class="card__link">
       <span class="card__media">
         <img src="./assets/hub/img/banner-robot.webp" alt="机器人协会" width="1920" height="900" loading="lazy">
         <span class="card__badge">网站建设中</span>
       </span>
       <span class="card__body">
         <span class="card__kicker">06 / ROBOT</span>
         <span class="card__title">机器人协会<small>Robot Association</small></span>
         <span class="card__desc">简介待补充。</span>
         <span class="card__tags card__tags--muted"><span>资料待补充</span></span>
         <span class="card__cta card__cta--muted">即将上线</span>
       </span>
     </span>
   </article>
   ```
5. 最后把本文件补成正常的目录结构 + 资源清单说明。

> 集中站的轮播与卡片内容**写死在 HTML 里**（不做运行时请求），所以必须手动增改 —— 这样关闭 JavaScript 时也能看到完整列表。

## 参考

已完成接入的社团可以抄作业：[`../CyberSecurity/readme.md`](../CyberSecurity/readme.md)、[`../Pentium/readme.md`](../Pentium/readme.md)、[`../IoT/readme.md`](../IoT/readme.md)。仓库整体约定见 [`../README.md`](../README.md)。
