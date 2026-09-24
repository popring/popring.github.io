import Link from 'next/link'
import type { ReactNode } from 'react'
import { DrawIn } from '@/components/animate-in'
import { Arrow, ArrowShort, Book, Circled, Face, Hand, Pen, Underline } from '@/components/doodle'
import { monthDay, PostRow, Sheet, StickyNote } from '@/components/paper'
import { getBlogPosts } from '@/app/blog/utils'

const now: { label: string; title: string; sub: string; href: string }[] = [
  {
    label: '在学',
    title: 'Go',
    sub: '阶段二走了一半，并发还没开始',
    href: '/blog/frontend-to-go-pitfalls',
  },
  {
    label: '在读',
    title: '《增长黑客》',
    sub: '肖恩·埃利斯',
    href: 'https://book.douban.com/subject/27593848/',
  },
]

const exploring = ['增长实验', '交互体验', '全栈工程'] as const

const quotes = [
  {
    text: '"这个时代缺的不是完美的人，缺的是从自己心底里给出的，真心、正义、无畏和同情。"',
    source: '无问西东',
  },
  { text: '"技术是给业务赋能的，而业务是给用户赋能的。"', source: null },
  {
    text: '"世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。"',
    source: '罗曼·罗兰',
  },
] as const

const mottoTilts = ['-rotate-[0.8deg]', 'rotate-[0.6deg]', '-rotate-[0.4deg]']

function SectionHeading({ icon, title, note }: { icon: ReactNode; title: string; note?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon}
      <h2 className="text-[22px] font-bold tracking-[-0.02em] text-ink">{title}</h2>
      {note && <Hand className="ml-auto whitespace-nowrap text-[23px] text-muted">{note}</Hand>}
    </div>
  )
}

const iconCls = 'h-[38px] w-[38px] shrink-0 text-ink'

export default function Page() {
  const posts = getBlogPosts().sort((a, b) => (a.metadata.publishedAt < b.metadata.publishedAt ? 1 : -1))

  return (
    <section>
      <header className="relative text-center">
        <span className="note-pop absolute top-9 left-0 hidden -rotate-6 text-end font-hand text-[25px] leading-[1.15] text-muted sm:block">
          写全栈
          <br />
          也做增长
          <Arrow dir="left" className="ml-auto block h-[34px] w-16 text-faint" />
        </span>
        <span className="note-pop absolute top-[92px] right-0 hidden rotate-[5deg] font-hand text-[25px] leading-[1.15] text-muted sm:block">
          <Arrow dir="right" className="block h-[34px] w-16 text-faint" />
          最近在学 Go
        </span>

        <DrawIn className="mx-auto block h-44 w-44 text-ink">
          <Face className="h-full w-full" />
        </DrawIn>
        <p className="mt-2 font-hand text-[26px] text-muted">Harry 的笔记本</p>
        <h1 className="mt-1 mb-6 text-[clamp(44px,8vw,64px)] font-bold leading-none tracking-[-0.045em] text-ink">
          <span className="relative inline-block">
            popring
            <DrawIn late>
              <Underline className="pointer-events-none absolute -bottom-3.5 -left-[4%] h-[18px] w-[108%] text-ink" />
            </DrawIn>
          </span>
        </h1>
        <p className="mx-auto max-w-[34em] text-[17px] leading-[1.8] text-pretty text-body">
          对技术好奇，更关心它能不能让<mark className="hl">产品和增长真的发生</mark>
          。平时在 AI、增长和前后端之间来回跑，踩了坑、想通了什么，就记下来。
        </p>
        <p className="mt-4 flex flex-wrap justify-center gap-4 font-hand text-[22px] text-muted sm:hidden">
          <span>写全栈，也做增长</span>
          <span>最近在学 Go</span>
        </p>
      </header>

      <div className="mt-24 grid gap-[72px]">
        <section>
          <SectionHeading icon={<Pen className={iconCls} />} title="最近在忙" />
          <div className="grid gap-5 sm:grid-cols-2">
            {now.map((n, i) => {
              const external = !n.href.startsWith('/')
              const body = (
                <>
                  <Hand className="mb-1 block text-2xl text-muted">{n.label}</Hand>
                  <b className="text-base font-semibold leading-normal text-ink">
                    {n.title}
                    {external && (
                      <span aria-hidden="true" className="ml-1 text-xs font-normal text-faint">
                        ↗
                      </span>
                    )}
                  </b>
                  <small className="mt-1 block text-sm leading-normal text-muted">{n.sub}</small>
                </>
              )
              const tilt = i % 2 ? 1.4 : -1.2
              // StickyNote 用 next/link，外链要 target=_blank，所以外链手写一份同样的类
              return external ? (
                <a
                  key={n.label}
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticky-note relative block rounded-[3px] border border-line bg-card px-5 pt-[22px] pb-5"
                  style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
                >
                  {body}
                </a>
              ) : (
                <StickyNote key={n.label} href={n.href} tilt={tilt}>
                  {body}
                </StickyNote>
              )
            })}
          </div>
        </section>

        <section>
          <SectionHeading
            icon={<Book className={iconCls} />}
            title="最近写的"
            note={
              <>
                一共 <Circled>{posts.length}</Circled> 篇
              </>
            }
          />
          <Sheet>
            {posts.slice(0, 6).map((post) => (
              <PostRow
                key={post.slug}
                href={`/blog/${post.slug}`}
                date={monthDay(post.metadata.publishedAt)}
                title={post.metadata.title}
                category={post.metadata.category}
              />
            ))}
          </Sheet>
          <Link href="/blog" className="group mt-4 inline-flex items-center gap-1.5 font-hand text-2xl text-ink">
            翻翻全部
            <ArrowShort className="h-4 w-9 transition-transform duration-250 ease-(--ease-out-strong) group-hover:translate-x-1" />
          </Link>
        </section>

        <section>
          <SectionHeading
            icon={
              <span aria-hidden="true" className="w-[38px] shrink-0 text-center font-hand text-[30px] text-ink">
                #
              </span>
            }
            title="一直在琢磨"
          />
          <ul className="flex flex-wrap gap-3">
            {exploring.map((e, i) => (
              <li
                key={e}
                className={`bg-tape px-3 py-0.5 text-sm text-body ${i % 2 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'}`}
              >
                {e}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto grid w-full max-w-[460px] gap-10">
          {quotes.map((q, i) => (
            <figure
              key={q.text}
              className={`relative border border-line bg-card px-7 pt-8 pb-6 shadow-note ${mottoTilts[i]}`}
            >
              <span aria-hidden="true" className="absolute -top-2.5 -left-3.5 h-5 w-16 -rotate-[28deg] bg-tape" />
              <span aria-hidden="true" className="absolute -top-2.5 -right-3.5 h-5 w-16 rotate-[28deg] bg-tape" />
              <blockquote className="text-lg leading-[1.75] text-balance text-ink">{q.text}</blockquote>
              {q.source && (
                <figcaption className="mt-3 text-end font-hand text-[22px] text-muted">{q.source}</figcaption>
              )}
            </figure>
          ))}
        </section>
      </div>
    </section>
  )
}
