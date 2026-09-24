#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""手写字体子集化：只打包站点真正用到的手写字，产物提交进仓库。

为什么不直接用 Google Fonts：读者主要在国内，fonts.googleapis.com 打不开；
Long Cang 全量 5MB，按实际用字裁完只有几十 KB。

用法（需要 fonttools + brotli：pip install fonttools brotli）：
    pnpm build && python3 scripts/subset-hand-font.py

取字来源（取并集）：
1. 构建产物 out/**/*.html 里所有 font-hand 元素的文字（最准，先 build）
2. 源码里含 Hand / font-hand / eyebrow= / note= 的行（兜住只在客户端渲染的文案）
3. CLIENT_ONLY：只在浏览器里才出现、上面两步都抓不到的手写文案

什么时候要重跑：新增了手写文案或文章分类。漏掉的字不会崩，只会回落到楷体。
"""
import html.parser
import pathlib
import re
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'fonts'
OUT = ROOT / 'app' / 'fonts'

SOURCES = {
    'zh': ('LongCang-Regular.ttf', 'https://github.com/google/fonts/raw/main/ofl/longcang/LongCang-Regular.ttf'),
    'latin': ('Caveat.ttf', 'https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf'),
}

# 手写体会出现的地方：<Hand> 组件、font-hand 类、PageHeader 的 eyebrow / note
HAND_LINE = re.compile(r'Hand|font-hand|eyebrow=|note=')
CJK = re.compile(r'[　-〿一-鿿＀-￯]')
# 动态内容里一定会用到的字（日期、计数、分页）
ALWAYS = '篇年月日共第页上下一个写于最新前后回到文章目录'
# 只在客户端渲染的手写文案（搜索结果数、空状态）
CLIENT_ONLY = '找到篇本子里没写过换个词试试动画增长'


class HandText(html.parser.HTMLParser):
    """收集 class 含 font-hand 的元素（含子元素）里的文字"""

    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'ellipse', 'line', 'rect'}

    def __init__(self) -> None:
        super().__init__()
        self.stack: list[bool] = []
        self.chars: set[str] = set()

    def handle_starttag(self, tag, attrs):
        if tag in self.VOID:
            return
        hand = 'font-hand' in (dict(attrs).get('class') or '')
        self.stack.append(hand or (bool(self.stack) and self.stack[-1]))

    def handle_endtag(self, tag):
        if tag not in self.VOID and self.stack:
            self.stack.pop()

    def handle_data(self, data):
        if self.stack and self.stack[-1]:
            self.chars.update(CJK.findall(data))


def fetch(name: str, url: str) -> pathlib.Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f'下载 {name} …')
        urllib.request.urlretrieve(url, path)
    return path


def collect_zh() -> str:
    chars = set(ALWAYS) | set(CLIENT_ONLY)
    out_dir = ROOT / 'out'
    if out_dir.exists():
        parser = HandText()
        for f in out_dir.rglob('*.html'):
            parser.feed(f.read_text(encoding='utf-8'))
        chars |= parser.chars
    else:
        print('⚠️  没有 out/，只按源码抓字。先 pnpm build 再跑更准')
    for f in list((ROOT / 'app').rglob('*.tsx')) + list((ROOT / 'components').rglob('*.tsx')):
        for line in f.read_text(encoding='utf-8').splitlines():
            if HAND_LINE.search(line):
                chars.update(CJK.findall(line))
    # 分类名会用手写体显示
    for f in (ROOT / 'blog').glob('*.mdx'):
        m = re.search(r"^category:\s*['\"]?(.+?)['\"]?\s*$", f.read_text(encoding='utf-8'), re.M)
        if m:
            chars.update(CJK.findall(m.group(1)))
    return ''.join(sorted(chars))


def subset(src: pathlib.Path, out: pathlib.Path, text: str | None, unicodes: str | None, features: str = '*') -> None:
    cmd = [sys.executable, '-m', 'fontTools.subset', str(src), f'--output-file={out}', '--flavor=woff2', f'--layout-features={features}']
    if text:
        cmd.append(f'--text={text}')
    if unicodes:
        cmd.append(f'--unicodes={unicodes}')
    subprocess.run(cmd, check=True)
    print(f'{out.relative_to(ROOT)}  {out.stat().st_size / 1024:.1f} KB')


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    zh = collect_zh()
    print(f'中文手写字 {len(zh)} 个')
    subset(fetch(*SOURCES['zh']), OUT / 'hand-zh.woff2', zh + '0123456789', None)
    # 拉丁手写：Caveat 是可变字体，全量 72KB；只切出用到的 500 / 700 两个静态字重，各约 17KB
    caveat = fetch(*SOURCES['latin'])
    for weight in (500, 700):
        static = CACHE / f'Caveat-{weight}.ttf'
        subprocess.run([sys.executable, '-m', 'fontTools.varLib.instancer', str(caveat), f'wght={weight}', '-o', str(static), '-q'], check=True)
        subset(static, OUT / f'hand-latin-{weight}.woff2', None, 'U+0020-007E,U+2013-2026,U+2190-2193', 'kern')


if __name__ == '__main__':
    main()
