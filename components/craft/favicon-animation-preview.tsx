'use client'

import { useEffect, useRef } from 'react'
import { MODES, drawFrame } from './favicon-animation-demo'

const TILE_PX = 68

// 列表卡片预览：复用 drawFrame，把 4 种模式同时画在 2×N 网格里。
// MODES 长度变了 grid 自动适应（CSS grid-template-columns: 2），
// 新增 mode 不需要改这里 —— 但若 mode 数量改成奇数，最后一行会空一格。
export function FaviconAnimationPreview() {
  const refs = useRef<(HTMLCanvasElement | null)[]>([])

  useEffect(() => {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    refs.current.forEach((canvas) => {
      if (!canvas) return
      canvas.width = TILE_PX * dpr
      canvas.height = TILE_PX * dpr
    })

    const start = performance.now()
    let raf = 0
    let cancelled = false
    const loop = () => {
      if (cancelled) return
      const t = (performance.now() - start) / 1000
      refs.current.forEach((canvas, i) => {
        if (!canvas || i >= MODES.length) return
        const ctx = canvas.getContext('2d')
        if (ctx) drawFrame(ctx, t, MODES[i].key, canvas.width)
      })
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-1.5">
        {MODES.map((m, i) => (
          <canvas
            key={m.key}
            ref={(el) => {
              refs.current[i] = el
            }}
            style={{ width: TILE_PX, height: TILE_PX }}
            className="rounded-md ring-1 ring-white/5"
            aria-label={m.label}
          />
        ))}
      </div>
    </div>
  )
}
