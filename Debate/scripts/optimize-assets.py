#!/usr/bin/env python3
"""把 Debate 演示文稿的幻灯片素材转成 WebP，并同步更新 deck.js 与 asset-manifest.json。

用法（仓库根目录）：python Debate/scripts/optimize-assets.py
"""
import hashlib
import json
import os
import subprocess
import sys

ASSETS = os.path.join('Debate', 'assets')
DECK = os.path.join(ASSETS, 'deck.js')
MANIFEST = os.path.join('Debate', 'asset-manifest.json')
QUALITY = '90'


def run(*args):
    r = subprocess.run(args, capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(' '.join(args) + '\n' + r.stderr.decode('utf-8', 'replace'))
    return r.stdout.decode('utf-8', 'replace').strip()


def alpha_range(path):
    out = run('magick', path, '-alpha', 'extract', '-format', '%[min] %[max]', 'info:')
    lo, hi = (int(x) for x in out.split())
    return lo, hi


def main():
    pngs = sorted(f for f in os.listdir(ASSETS) if f.lower().endswith('.png'))
    print(f'找到 {len(pngs)} 张 PNG')

    converted, kept, problems = {}, [], []
    before = sum(os.path.getsize(os.path.join(ASSETS, f)) for f in pngs)

    for name in pngs:
        src = os.path.join(ASSETS, name)
        dst = os.path.join(ASSETS, name[:-4] + '.webp')
        run('magick', src, '-strip', '-define', 'webp:method=6',
            '-quality', QUALITY, '-define', 'webp:alpha-quality=92',
            '-define', 'webp:use-sharp-yuv=1', dst)

        if os.path.getsize(dst) >= os.path.getsize(src):
            os.remove(dst)
            kept.append(name)
            continue

        # 校验：原来有真实透明度的图，转换后必须还有 alpha
        lo, _ = alpha_range(src)
        if lo < 65535:
            out_alpha = run('magick', 'identify', '-format', '%[channels]', dst)
            if 'a' not in out_alpha:
                problems.append(name + ' 丢失 alpha 通道')
                os.remove(dst)
                kept.append(name)
                continue

        converted[name] = os.path.basename(dst)

    print(f'转成 WebP：{len(converted)} 张；保留 PNG：{len(kept)} 张')
    if problems:
        print('异常：' + '; '.join(problems))
        return 1

    # ---- 更新 deck.js 里的文件名引用 ----
    deck = open(DECK, encoding='utf-8').read()
    for old, new in converted.items():
        token = '"file":"%s"' % old
        if token not in deck:
            print('deck.js 中找不到引用：' + token)
            return 1
        deck = deck.replace(token, '"file":"%s"' % new)
    open(DECK, 'w', encoding='utf-8').write(deck)

    for old in converted:
        os.remove(os.path.join(ASSETS, old))

    # ---- 重新生成 asset-manifest.json ----
    files = []
    for name in sorted(os.listdir(ASSETS)):
        path = os.path.join(ASSETS, name)
        data = open(path, 'rb').read()
        files.append({
            'path': 'assets/' + name,
            'bytes': len(data),
            'sha256': hashlib.sha256(data).hexdigest(),
        })

    manifest = json.load(open(MANIFEST, encoding='utf-8'))
    manifest['imageCount'] = sum(1 for f in files if f['path'].lower().endswith(('.webp', '.png', '.jpg', '.jpeg', '.gif')))
    manifest['runtimeBytes'] = sum(f['bytes'] for f in files)
    manifest['files'] = files
    manifest['note'] = '幻灯片素材已统一压缩为 WebP（PNG 仅在有收益时保留），其余字段含义不变。'
    json.dump(manifest, open(MANIFEST, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

    after = sum(os.path.getsize(os.path.join(ASSETS, f)) for f in os.listdir(ASSETS) if f != 'deck.js')
    print(f'素材体积：{before/1048576:.1f} MB -> {after/1048576:.1f} MB（deck.js 除外）')
    return 0


if __name__ == '__main__':
    sys.exit(main())
