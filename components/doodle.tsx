// 手绘线稿：只描边、currentColor，自动跟随深浅色。
// 每条路径都带 pathLength={1}，外层加 .doodle-draw 就能一笔笔画出来（见 global.css）。
import type { ReactNode, SVGProps } from 'react'

type SvgProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function Face(props: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" strokeWidth={2.2} {...stroke} {...props}>
      <path pathLength={1} d="M20 30c-1-9 5-16 13-16 7 0 12 5 12 12 0 3-.5 5-1.5 7" />
      <path pathLength={1} d="M20 30c0 9 5 15 12 15 5 0 9-3 11-8" />
      <path pathLength={1} d="M21 25c4-1 8-4 10-8 2 4 7 7 13 7" />
      {/* 眼镜：上边平、下边圆的方框（照 Harry 本人的眼镜） */}
      <path pathLength={1} d="M22.8 29.4C22.8 28.4 23.5 27.8 24.6 27.8H28.4C29.6 27.8 30.2 28.5 30.2 29.6V31C30.2 33 29 34.2 27 34.2H26C24 34.2 22.8 33 22.8 31Z" />
      <path pathLength={1} d="M34.8 29.4C34.8 28.4 35.5 27.8 36.6 27.8H40.4C41.6 27.8 42.2 28.5 42.2 29.6V31C42.2 33 41 34.2 39 34.2H38C36 34.2 34.8 33 34.8 31Z" />
      <path pathLength={1} d="M30.2 30.4C31.7 29.6 33.3 29.6 34.8 30.4" />
      <path pathLength={1} d="M30 39c1.5 1 3.5 1 5 0" />
      <path pathLength={1} d="M24 45l-3 5c-4 1-7 4-8 9M40 45l3 5c4 1 7 4 8 9" />
      <path pathLength={1} d="M28 52l4 3 4-3" />
    </svg>
  )
}

export function Underline(props: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 18" preserveAspectRatio="none" strokeWidth={3} {...stroke} {...props}>
      <path pathLength={1} d="M3 10c40-6 90-7 140-4 20 1 36 3 54 6" />
      <path pathLength={1} d="M20 15c50-4 110-4 160-1" opacity=".5" strokeWidth={2} />
    </svg>
  )
}

/** 弯箭头：left = 从左上弯到右下，right = 从右上弯到左下，down = 向下指 */
export function Arrow({ dir = 'left', ...props }: SvgProps & { dir?: 'left' | 'right' | 'down' }) {
  if (dir === 'down') {
    return (
      <svg aria-hidden="true" viewBox="0 0 40 32" strokeWidth={1.8} {...stroke} {...props}>
        <path d="M36 4C26 3 12 8 8 26" />
        <path d="M3 20l5 7 6-5" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 70 36" strokeWidth={1.8} {...stroke} {...props}>
      {dir === 'left' ? (
        <>
          <path d="M4 6c18-2 40 4 58 24" />
          <path d="M52 29l10 1 0-10" />
        </>
      ) : (
        <>
          <path d="M66 6C48 4 26 10 8 30" />
          <path d="M18 29l-10 1 0-10" />
        </>
      )}
    </svg>
  )
}

/** 短直箭头，用在「翻翻全部 →」「回到文章」这类链接后 */
export function ArrowShort(props: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 16" strokeWidth={1.8} {...stroke} {...props}>
      <path d="M3 9c10-2 22-2 32-1" />
      <path d="M29 3l6 5-6 5" />
    </svg>
  )
}

/** 手绘圈，绝对定位盖在文字上：<Circled>96</Circled> */
export function Circled({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block px-1">
      {children}
      <svg aria-hidden="true"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        strokeWidth={1.6}
        {...stroke}
        className="pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+20px)] text-faint"
      >
        <path d="M60 4C30 2 4 9 4 21s26 17 50 16 42-6 42-17S76 3 52 5" />
      </svg>
    </span>
  )
}

export function Pen(props: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" strokeWidth={1.8} {...stroke} {...props}>
      <path d="M8 32l3-9 16-16c2-2 4.5-2 6 0s1.5 4 0 6L17 29z" />
      <path d="M11 23l6 6M24 10l6 6" />
      <path d="M6 35c6 1 12-1 18 0" />
    </svg>
  )
}

export function Book(props: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" strokeWidth={1.8} {...stroke} {...props}>
      <path d="M6 10c5-2 10-2 14 1 4-3 9-3 14-1v20c-5-2-10-2-14 1-4-3-9-3-14-1z" />
      <path d="M20 11v20" />
      <path d="M10 16c2-.5 4-.5 6 .3M10 21c2-.5 4-.5 6 .3M24 16.3c2-.8 4-.8 6-.3" />
    </svg>
  )
}

export function CodeMark(props: SvgProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" strokeWidth={1.8} {...stroke} {...props}>
      <path d="M7 9c9-1 18-1 26 .5 1 7 1 14-.5 21.5-8 1-17 1-25.5-.5C6 23 6 16 7 9z" />
      <path d="M14 17l-3.5 3.5L14 24M26 17l3.5 3.5L26 24M22 15.5l-4 10" />
    </svg>
  )
}

/** 手写体文字。改了这里的文案要重跑 scripts/subset-hand-font.py */
export function Hand({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`font-hand ${className}`.trim()}>{children}</span>
}
