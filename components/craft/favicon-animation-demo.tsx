'use client'

import { useEffect, useRef, useState } from 'react'

export const MODES = [
  { key: 'pacman', label: '吃豆人', emoji: '🟡' },
  { key: 'equalizer', label: '音频条', emoji: '📊' },
  { key: 'orbit', label: '轨道', emoji: '🪐' },
  { key: 'pulse', label: '心跳', emoji: '❤️' },
] as const

type Mode = (typeof MODES)[number]['key'] | 'stop'

// 所有形状用 32×32 网格设计（favicon 原生分辨率），再用 s = size/32 放缩到目标尺寸。
// 这样同一份代码能给 worker 画 32×32 的真 favicon，也能给主线程的预览 canvas 画 384×384 的高清版。
export function drawFrame(ctx: any, t: number, mode: string, size: number) {
  const s = size / 32
  const noise = (t: number, k: number) =>
    Math.sin(t * 7.3 + k) * 0.5 +
    Math.sin(t * 13.7 + k * 2.1) * 0.3 +
    Math.sin(t * 23.1 + k * 3.7) * 0.2

  ctx.clearRect(0, 0, size, size)

  if (mode === 'pacman') {
    ctx.fillStyle = '#0f0f12'
    ctx.fillRect(0, 0, size, size)
    const m = (Math.sin(t * Math.PI * 5) * 0.5 + 0.5) * 0.42 * Math.PI + 0.02
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.moveTo(16 * s, 16 * s)
    ctx.arc(16 * s, 16 * s, 14 * s, m, Math.PI * 2 - m)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#0f0f12'
    ctx.beginPath()
    ctx.arc(17 * s, 9 * s, 2 * s, 0, Math.PI * 2)
    ctx.fill()
    const beadProgress = (t * 0.8) % 1
    const beadX = (32 - beadProgress * 16)
    if (beadX > 16) {
      ctx.fillStyle = '#fde047'
      ctx.beginPath()
      ctx.arc(beadX * s, 16 * s, 1.5 * s, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (mode === 'equalizer') {
    ctx.fillStyle = '#0f0f12'
    ctx.fillRect(0, 0, size, size)
    const bars = 4, barW = 5, gap = 2
    const startX = (32 - (bars * barW + (bars - 1) * gap)) / 2
    for (let i = 0; i < bars; i++) {
      const h = 6 + (Math.sin(t * 4 + i * 1.3) * 0.5 + 0.5) * 22
      const grad = ctx.createLinearGradient(0, (32 - h) * s, 0, 32 * s)
      grad.addColorStop(0, '#fde047')
      grad.addColorStop(1, '#10b981')
      ctx.fillStyle = grad
      ctx.fillRect((startX + i * (barW + gap)) * s, (32 - h) * s, barW * s, h * s)
    }
  } else if (mode === 'orbit') {
    // 中心球 + 卫星绕轨道转，带 trail
    ctx.fillStyle = '#0f0f12'
    ctx.fillRect(0, 0, size, size)
    const cx = 16, cy = 16, R = 11
    // 轨道线（淡灰）
    ctx.lineWidth = 0.8 * s
    ctx.strokeStyle = '#27272a'
    ctx.beginPath()
    ctx.arc(cx * s, cy * s, R * s, 0, Math.PI * 2)
    ctx.stroke()
    // 中心球
    ctx.fillStyle = '#a78bfa'
    ctx.beginPath()
    ctx.arc(cx * s, cy * s, 3.5 * s, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.arc((cx - 1) * s, (cy - 1) * s, 1.1 * s, 0, Math.PI * 2)
    ctx.fill()
    // 卫星 + trail
    const orbitPeriod = 1.4
    for (let i = 7; i >= 0; i--) {
      const lag = i * 0.04
      const angle = (t - lag) * Math.PI * 2 / orbitPeriod - Math.PI / 2
      const x = cx + Math.cos(angle) * R
      const y = cy + Math.sin(angle) * R
      const alpha = (1 - i / 8) * 0.95
      const sz = Math.max(0.7, 2.6 - i * 0.22)
      ctx.fillStyle = 'rgba(251, 146, 60, ' + alpha + ')'
      ctx.beginPath()
      ctx.arc(x * s, y * s, sz * s, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (mode === 'pulse') {
    // ECG 心跳波形：横线 + 主峰 + 副峰副谷，从右向左滚动
    // 节律：奇数 beat 是"大波"（振幅 ~1.5x），偶数 beat 正常（~0.85x），形成 small/BIG/small/BIG 交替
    // 再叠一层 noise 给每个 beat 微小抖动，避免完全节拍器感
    ctx.fillStyle = '#0f0f12'
    ctx.fillRect(0, 0, size, size)
    const baseY = 19
    const period = 44
    const cycleT = (t * 22) % period
    const beatIndex = Math.floor((t * 22) / period)
    const isBig = beatIndex % 2 === 1
    const ampN = noise(beatIndex, 4.3)
    const ampScale = isBig ? 1.5 + ampN * 0.08 : 0.85 + ampN * 0.12
    const peakOffset = noise(beatIndex, 1.7) * 1.4
    const peakX = 36 - cycleT + peakOffset
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 1.5 * s
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let x = 0; x <= 32; x += 0.5) {
      const dx = x - peakX
      let y = baseY + Math.sin(t * 9 + x * 1.7) * 0.18 + noise(t * 0.4, x * 0.5) * 0.25
      y -= 10 * ampScale * Math.exp(-(dx * dx) / 1.4)
      y -= 2.5 * ampScale * Math.exp(-((dx + 4) * (dx + 4)) / 1.6)
      y += 3 * ampScale * Math.exp(-((dx - 3) * (dx - 3)) / 2)
      if (x === 0) ctx.moveTo(x * s, y * s)
      else ctx.lineTo(x * s, y * s)
    }
    ctx.stroke()
    // 峰头光点：大波更亮更大
    if (peakX > -2 && peakX < 34) {
      const peakY = baseY - 10 * ampScale
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(peakX * s, peakY * s, (isBig ? 2 : 1.4) * s, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = isBig ? 'rgba(167, 243, 208, 0.9)' : 'rgba(167, 243, 208, 0.6)'
      ctx.beginPath()
      ctx.arc(peakX * s, peakY * s, (isBig ? 1 : 0.7) * s, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// Worker 在后台线程画 32×32 favicon 帧 —— 用 worker 是为了切到后台 tab 时
// setTimeout 不被节流，favicon 还能继续动。
//
// 注意：必须用 `const drawFrame = ${drawFrame.toString()}` 显式绑定一个固定名字。
// 生产构建会 minify 函数名（drawFrame → s 之类），.toString() 拿到的是 "function s(...){...}"。
// 如果直接 ${drawFrame.toString()} 注入，worker 里调 `drawFrame(...)` 就成了 ReferenceError，
// 整个 favicon 动画静默失效（dev 不 minify 所以看不出来）。
const WORKER_SOURCE = `
const drawFrame = ${drawFrame.toString()};

const canvas = new OffscreenCanvas(32, 32);
const ctx = canvas.getContext('2d');
let mode = 'pacman';
let startTime = performance.now();
let running = false;

async function tick() {
  if (!running) return;
  const t = (performance.now() - startTime) / 1000;
  drawFrame(ctx, t, mode, 32);
  try {
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    self.postMessage({ type: 'frame', blob });
  } catch (e) {}
  setTimeout(tick, 33);
}

self.onmessage = (e) => {
  const d = e.data;
  if (d.type === 'start') {
    mode = d.mode;
    startTime = performance.now();
    if (!running) { running = true; tick(); }
  } else if (d.type === 'stop') {
    running = false;
  }
};
`

const PREVIEW_CSS_SIZE = 192

export function FaviconAnimationDemo() {
  const [mode, setMode] = useState<Mode>('pacman')
  const workerRef = useRef<Worker | null>(null)
  const linkRef = useRef<HTMLLinkElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const originalHrefRef = useRef<string | null>(null)
  const linkWasCreatedRef = useRef(false)
  // stop 后到达的残余帧要丢弃，否则会覆盖刚恢复的 favicon。
  const stoppedRef = useRef(false)
  const tabCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  // 桥接 mount useEffect 内的闭包给 mode useEffect 使用。
  const ensureLinkRef = useRef<(() => HTMLLinkElement) | null>(null)
  const restoreFaviconRef = useRef<(() => void) | null>(null)

  // mount: 设置 preview canvas 的真实像素大小（DPR-aware），让矢量绘制在高分屏也清晰
  useEffect(() => {
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = PREVIEW_CSS_SIZE * dpr
    canvas.height = PREVIEW_CSS_SIZE * dpr
  }, [])

  useEffect(() => {
    const ensureLink = () => {
      if (linkRef.current && linkRef.current.isConnected) return linkRef.current
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
      if (link) {
        if (originalHrefRef.current === null) originalHrefRef.current = link.href
        linkWasCreatedRef.current = false
      } else {
        link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/png'
        document.head.appendChild(link)
        linkWasCreatedRef.current = true
      }
      linkRef.current = link
      return link
    }

    const restoreFavicon = () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      const link = linkRef.current
      if (!link) return
      if (linkWasCreatedRef.current) {
        link.remove()
        linkRef.current = null
      } else if (originalHrefRef.current !== null) {
        link.href = originalHrefRef.current
      }
    }

    ensureLinkRef.current = ensureLink
    restoreFaviconRef.current = restoreFavicon

    ensureLink()

    const blobUrl = URL.createObjectURL(
      new Blob([WORKER_SOURCE], { type: 'application/javascript' })
    )
    const worker = new Worker(blobUrl)
    URL.revokeObjectURL(blobUrl)
    workerRef.current = worker

    worker.onmessage = async (e) => {
      if (e.data.type !== 'frame' || stoppedRef.current) return

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = URL.createObjectURL(e.data.blob)
      if (linkRef.current) linkRef.current.href = objectUrlRef.current

      if (document.hidden) return
      try {
        const bmp = await createImageBitmap(e.data.blob)
        // stop 可能在 await 期间发生，再次检查
        if (stoppedRef.current) {
          bmp.close()
          return
        }
        tabCanvasRef.current
          ?.getContext('2d')
          ?.drawImage(bmp, 0, 0, 16, 16)
        bmp.close()
      } catch {}
    }

    return () => {
      stoppedRef.current = true
      worker.terminate()
      restoreFavicon()
    }
  }, [])

  // mode 变化：worker 切模式 + 大预览 canvas 起一条 RAF 直绘高清帧
  useEffect(() => {
    const w = workerRef.current
    if (!w) return
    if (mode === 'stop') {
      stoppedRef.current = true
      w.postMessage({ type: 'stop' })
      restoreFaviconRef.current?.()
      tabCanvasRef.current?.getContext('2d')?.clearRect(0, 0, 16, 16)
      return
    }
    ensureLinkRef.current?.()
    stoppedRef.current = false
    w.postMessage({ type: 'start', mode })

    const canvas = previewCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const start = performance.now()
    let raf = 0
    let cancelled = false
    const loop = () => {
      if (cancelled) return
      const t = (performance.now() - start) / 1000
      drawFrame(ctx, t, mode, canvas.width)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [mode])

  return (
    <div className="not-prose my-6">
      {/* 舞台 */}
      <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 overflow-hidden">
        {/* 顶部条：模拟 tab + 真实 tab 引导 */}
        <div className="px-5 pt-5 pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <canvas
                ref={tabCanvasRef}
                width={16}
                height={16}
                aria-hidden
                style={{ imageRendering: 'pixelated', width: 16, height: 16 }}
              />
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                Favicon 动画
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 text-[10px] ml-0.5">
                ✕
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              ← 模拟 tab（实际 16×16）
            </span>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <span aria-hidden className="inline-block animate-bounce">↑</span>
            <span>浏览器顶栏真实 tab 也同步</span>
          </div>
        </div>

        {/* 大预览舞台 */}
        <div className="relative px-5 pb-10 pt-4 flex flex-col items-center">
          <div className="relative">
            {/* 柔光底 */}
            <div
              aria-hidden
              className="absolute inset-0 -m-6 rounded-full bg-neutral-200/40 dark:bg-neutral-800/30 blur-2xl"
            />
            <canvas
              ref={previewCanvasRef}
              className="relative block rounded-xl bg-neutral-100 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 shadow-sm"
              style={{ width: PREVIEW_CSS_SIZE, height: PREVIEW_CSS_SIZE }}
            />
            <span className="absolute -bottom-2 right-1 translate-y-full text-[10px] text-neutral-400 dark:text-neutral-600 tabular-nums">
              高清矢量预览 · favicon 仍是 32×32
            </span>
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {MODES.map((m) => {
          const active = mode === m.key
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm border transition-all cursor-pointer ${
                active
                  ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900 shadow'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm'
              }`}
              aria-pressed={active}
            >
              <span aria-hidden>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setMode('stop')}
          className={`ml-auto px-3.5 py-2 rounded-lg text-sm border transition-all cursor-pointer ${
            mode === 'stop'
              ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm'
          }`}
          aria-pressed={mode === 'stop'}
        >
          停止
        </button>
      </div>

      {/* 参考 + 源码 */}
      <div className="mt-4 text-[12px] text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <a
          href="https://favicon.im/zh/blog/animated-favicon-live-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          参考文章
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
        <a
          href="https://github.com/popring/popring.github.io/blob/main/components/craft/favicon-animation-demo.tsx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          查看源码
        </a>
      </div>
    </div>
  )
}
