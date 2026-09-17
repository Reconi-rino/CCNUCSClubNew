/**
 * 把 Astro 构建产物里的「根绝对路径」改成「相对路径」。
 *
 * 为什么需要这一步：
 *   本仓库的根目录是一个集中站，IoT 站点会被部署在子路径下
 *   （例如 GitHub Pages 的 https://<user>.github.io/CCNUCSClubNew/IoT/）。
 *   Astro 默认输出 /_astro/... 与 /assets/... 这类以 / 开头的根绝对路径，
 *   一旦部署到子路径就会 404；同时相对路径也让 dist 能直接被 file:// 打开。
 *
 * 用法：npm run build 之后自动执行（见 package.json 的 build:static）。
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('[relativize] 未找到 dist/，请先执行 astro build。');
  process.exit(1);
}

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

let changed = 0;
let totalBytes = 0;
const files = await walk(dist);

for (const file of files) {
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  totalBytes += (await stat(file)).size;

  if (ext === '.html') {
    const before = await readFile(file, 'utf8');
    const after = before
      .replace(/(\s(?:href|src|poster|content)=")\/(?!\/)/g, '$1./')
      .replace(/url\(\/(?!\/)/g, 'url(./');
    if (after !== before) {
      await writeFile(file, after);
      changed++;
    }
  } else if (ext === '.css') {
    const before = await readFile(file, 'utf8');
    // CSS 位于 dist/_astro/，因此回退一级再指向 assets/
    const depth = file.slice(dist.length).split(/[\\/]/).filter(Boolean).length - 1;
    const up = '../'.repeat(depth);
    const after = before.replace(/url\(\/(?!\/)/g, `url(${up}`);
    if (after !== before) {
      await writeFile(file, after);
      changed++;
    }
  }
}

console.log(
  `[relativize] 已处理 ${files.length} 个文件，改写 ${changed} 个（dist 共 ${(totalBytes / 1024 / 1024).toFixed(2)} MB）。`
);
