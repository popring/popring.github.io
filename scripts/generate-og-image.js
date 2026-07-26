/**
 * 生成通用 OG 分享图 → public/og-default.png (1200×630)。
 *
 * 本机跑一次即可（结果 PNG 已提交，CI/build 不依赖本脚本和字体）：
 *   node scripts/generate-og-image.js
 *
 * 用 next/og(satori) 渲染；字体用系统自带的 Arial Unicode（单面 TTF、覆盖中文）。
 * 改设计就改下面的 JSX，然后重跑本脚本、提交新的 public/og-default.png。
 */
const { ImageResponse } = require('next/og')
const fs = require('fs')
const path = require('path')
const React = require('react')
const h = React.createElement

// satori 要 ttf/otf（不吃 woff2/ttc）。macOS 自带 Arial Unicode 覆盖中英文。
const FONT_PATH = '/Library/Fonts/Arial Unicode.ttf'
const font = fs.readFileSync(FONT_PATH)

const el = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: '#0a0a0a',
      padding: '72px 80px',
      position: 'relative',
    },
  },
  h(
    'div',
    { style: { display: 'flex', alignItems: 'center' } },
    h('div', {
      style: { width: 20, height: 20, borderRadius: 6, background: '#e5e5e5', marginRight: 16 },
    }),
    h('div', { style: { fontSize: 30, color: '#a1a1aa', letterSpacing: 1 } }, 'popring.cn')
  ),
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column' } },
    h('div', { style: { fontSize: 96, color: '#fafafa', fontWeight: 700, lineHeight: 1.1 } }, "popring's blog"),
    h('div', { style: { display: 'flex', marginTop: 24, fontSize: 40, color: '#8b8b93' } }, '探索 · 记录 · 分享')
  ),
  h('div', { style: { display: 'flex', fontSize: 28, color: '#5a5a62' } }, '前端 · 全栈成长 · AI'),
  h('div', {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 12,
      height: '100%',
      background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)',
    },
  })
)

;(async () => {
  const img = new ImageResponse(el, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'AU', data: font, weight: 400, style: 'normal' }],
  })
  const out = path.join(__dirname, '..', 'public', 'og-default.png')
  fs.writeFileSync(out, Buffer.from(await img.arrayBuffer()))
  console.log('written', out)
})().catch((e) => {
  console.error('FAIL', e)
  process.exit(1)
})
