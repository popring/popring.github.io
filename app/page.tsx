import { AnimateIn } from '@/components/animate-in'
import { TerminalHeader, monoStyle } from '@/components/terminal-header'

const links = [
  { id: 'gh', label: 'github.com/popring', href: 'https://github.com/popring' },
  { id: 'x', label: 'x.com/Harry5Sea', href: 'https://x.com/Harry5Sea' },
] as const

const now = [
  { label: '在学', text: 'Go 并发、SQL 事务与锁' },
  { label: '在做', text: '折腾 AI agent 工作流' },
  { label: '在读', text: '《金字塔原理》' },
] as const

const exploring = [
  'AI agent',
  '增长实验',
  '交互与动效',
  '全栈工程',
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
        <div className="space-y-3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
          <p>
            既对技术本身好奇，也关心它能不能让产品和增长真的发生。
          </p>
          <p>
            日常在 AI、增长和前后端之间来回，看到值得记的——一个好设计、一次踩坑、一个想通的点——就写在这。
          </p>
        </div>

        <SectionHeading label="now" meta="最近在做" />
        <ul className="space-y-1.5" style={monoStyle}>
          {now.map((n) => (
            <li key={n.label} className="text-sm flex items-baseline gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 shrink-0 w-14">
                {n.label}
              </span>
              <span className="text-neutral-700 dark:text-neutral-300">
                {n.text}
              </span>
            </li>
          ))}
        </ul>

        <SectionHeading label="exploring" />
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5" style={monoStyle}>
          {exploring.map((e) => (
            <li
              key={e}
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              <span className="text-neutral-300 dark:text-neutral-700">#</span>
              {e}
            </li>
          ))}
        </ul>

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
