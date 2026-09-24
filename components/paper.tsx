// 「本子」系列的纸面组件：页头、纸页列表、便利贴。全站共用，别在页面里再手写一份。
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Arrow, Underline } from './doodle'

/** 列表页统一页头：手写小字 + 大标题（手绘下划线）+ 一句说明 + 右侧手写批注 */
export function PageHeader({
  eyebrow,
  title,
  sub,
  note,
}: {
  eyebrow: string
  title: string
  sub?: ReactNode
  note?: ReactNode
}) {
  return (
    <header className="relative mb-12">
      <p className="font-hand text-[26px] leading-tight text-muted">{eyebrow}</p>
      <h1 className="mt-0.5 mb-7 text-[clamp(40px,7vw,52px)] font-bold leading-none tracking-[-0.045em] text-ink">
        <span className="relative inline-block">
          {title}
          <Underline className="pointer-events-none absolute -bottom-3.5 -left-[4%] h-[18px] w-[108%] text-ink" />
        </span>
      </h1>
      {sub && <p className="max-w-[34em] text-base leading-[1.7] text-body">{sub}</p>}
      {note && (
        <span className="absolute top-7 right-0 hidden rotate-[4deg] font-hand text-2xl text-muted sm:block">
          <Arrow dir="right" className="-ml-2 block h-[30px] w-14 text-faint" />
          {note}
        </span>
      )}
    </header>
  )
}

/** 纸页：一张带手绘不规则圆角的白纸，里面放 PostRow 列表 */
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="sheet rounded-[4px_18px_6px_16px/16px_6px_18px_4px] border border-line bg-card px-5 py-1.5">
      <ul className="divide-y divide-dashed divide-line-strong">{children}</ul>
    </div>
  )
}

/** 纸页里的一行文章：手写日期 · 标题 · 手写分类 */
export function PostRow({
  href,
  date,
  title,
  category,
  children,
}: {
  href: string
  date: string
  title: ReactNode
  category?: string
  children?: ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        className="group grid grid-cols-[44px_1fr] items-baseline gap-4 py-[15px] sm:grid-cols-[52px_1fr_auto]"
      >
        <span className="font-hand text-[22px] text-muted tabular-nums">{date}</span>
        <span className="text-base font-semibold leading-normal text-pretty text-ink decoration-faint decoration-wavy decoration-1 underline-offset-[5px] group-hover:underline">
          {title}
          {children}
        </span>
        {category && (
          <span className="hidden font-hand text-[21px] whitespace-nowrap text-faint sm:inline">{category}</span>
        )}
      </Link>
    </li>
  )
}

/** 便利贴：微微歪着、顶上贴一条胶带，hover 摆正 */
export function StickyNote({
  children,
  href,
  tilt = -1.2,
  className = '',
}: {
  children: ReactNode
  href?: string
  tilt?: number
  className?: string
}) {
  const cls = `sticky-note relative block rounded-[3px] border border-line bg-card px-5 pt-[22px] pb-5 ${className}`.trim()
  const style = { '--tilt': `${tilt}deg` } as React.CSSProperties
  return href ? (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  ) : (
    <div className={cls} style={style}>
      {children}
    </div>
  )
}

/** 月/日，手写日期用 */
export function monthDay(date: string) {
  const [, m, d] = date.split('-')
  return `${m}/${d?.slice(0, 2)}`
}
