import Link from 'next/link'
import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'
import { TerminalHeader, monoStyle } from '@/components/terminal-header'

const links = [
  { id: 'gh', label: 'github.com/popring', href: 'https://github.com/popring' },
  { id: 'x', label: 'x.com/Harry5Sea', href: 'https://x.com/Harry5Sea' },
] as const

const shelf = [
  {
    id: '01',
    type: 'book',
    title: '高效能人士的七个习惯',
    href: 'https://book.douban.com/subject/5325618/',
    external: true,
  },
  {
    id: '02',
    type: 'list',
    title: '前端技术书指引',
    href: 'https://www.douban.com/doulist/160109862/',
    external: true,
  },
  {
    id: '03',
    type: 'note',
    title: '2025 年读书笔记汇总',
    href: '/blog/2025-reading-notes',
    external: false,
  },
] as const

const quotes = [
  {
    text: '"这个时代缺的不是完美的人，缺的是从自己心底里给出的，真心、正义、无畏和同情。"',
    source: '— 无问西东',
  },
  {
    text: '"技术是给业务赋能的，而业务是给用户赋能的。"',
    source: null,
  },
  {
    text: '"世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。"',
    source: '— 罗曼·罗兰',
  },
] as const

function SectionHeading({
  label,
  meta,
}: {
  label: string
  meta?: string
}) {
  return (
    <div className="mt-12 mb-4 flex items-baseline gap-2" style={monoStyle}>
      <span className="text-amber-600 dark:text-amber-400">▸</span>
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      {meta && (
        <span className="text-xs text-neutral-400 dark:text-neutral-600">
          · {meta}
        </span>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <section>
      <AnimateIn>
        <TerminalHeader path="~" count="hi" comment="popring · 个人空间" />
      </AnimateIn>

      <AnimateIn delay={1}>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          AI 公司做增长的全栈工程师，关注交互、AI 与增长。喜欢一边做一边把问题想明白，这里记录踩坑经历、有趣发现和个人想法。
        </p>

        <SectionHeading label="links" />
        <ul className="space-y-1.5" style={monoStyle}>
          {links.map((l) => (
            <li key={l.id} className="text-sm flex items-baseline gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 tabular-nums">
                [{l.id}]
              </span>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 dark:text-neutral-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                {l.label}
              </a>
              <span className="text-neutral-300 dark:text-neutral-700 text-xs">
                ↗
              </span>
            </li>
          ))}
        </ul>
      </AnimateIn>

      <AnimateIn delay={2}>
        <SectionHeading label="recent" meta="~/blog" />
        <BlogPosts limit={5} />
        <div className="mt-4 text-xs" style={monoStyle}>
          <Link
            href="/blog"
            className="text-neutral-500 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
          >
            <span className="text-neutral-400 dark:text-neutral-600">→</span>{' '}
            all posts
          </Link>
        </div>
      </AnimateIn>

      <AnimateIn delay={3}>
        <SectionHeading label="shelf" meta="recommended" />
        <ul className="space-y-1.5" style={monoStyle}>
          {shelf.map((s) => {
            const inner = (
              <>
                <span className="text-neutral-400 dark:text-neutral-600 tabular-nums shrink-0 w-7">
                  {s.id}
                </span>
                <span className="text-neutral-400 dark:text-neutral-600 shrink-0 w-12">
                  {s.type}
                </span>
                <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {s.title}
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 text-xs ml-auto">
                  {s.external ? '↗' : '→'}
                </span>
              </>
            )
            return (
              <li key={s.id} className="text-sm">
                {s.external ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline gap-2"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={s.href} className="group flex items-baseline gap-2">
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </AnimateIn>

      <AnimateIn delay={3}>
        <SectionHeading label="motto" />
        <ul className="space-y-4">
          {quotes.map((q, i) => (
            <li
              key={i}
              className="border-l-2 border-amber-600/40 dark:border-amber-400/30 pl-4"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
                {q.text}
              </p>
              {q.source && (
                <p
                  className="text-xs text-neutral-400 dark:text-neutral-600 mt-1"
                  style={monoStyle}
                >
                  {q.source}
                </p>
              )}
            </li>
          ))}
        </ul>
      </AnimateIn>
    </section>
  )
}
