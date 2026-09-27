import Link from 'next/link'
import type { ReactNode } from 'react'
import { getAllCategories, getAllTags, getBlogPosts } from '@/app/blog/utils'
import { ArrowShort, Circled, Underline } from './doodle'
import { PageHeader, PostRow, Sheet, monthDay } from './paper'

type Post = ReturnType<typeof getBlogPosts>[number]

const tabs = [
  { href: '/blog', label: '全部' },
  { href: '/blog/categories', label: '分类' },
  { href: '/blog/tags', label: '标签' },
  { href: '/blog/search', label: '搜索' },
] as const

type Tab = (typeof tabs)[number]['label']

/** 文章区四个 tab 共用：页头固定不变，切 tab 只换下面的内容 */
export function BlogShell({ active, children }: { active: Tab; children: ReactNode }) {
  const counts: Partial<Record<Tab, number>> = {
    全部: getBlogPosts().length,
    分类: getAllCategories().length,
    标签: getAllTags().length,
  }
  return (
    <section>
      <PageHeader
        eyebrow="全部文章"
        title="文章"
        sub="踩过的坑、读过的书、想通的事，都在这。"
        note={
          <>
            一共 <Circled>{counts.全部}</Circled> 篇
          </>
        }
      />
      <nav aria-label="浏览方式" className="mb-10 flex flex-wrap items-baseline gap-x-7 gap-y-3 border-b border-dashed border-line-strong pb-3">
        {tabs.map((t) => {
          const on = t.label === active
          return (
            <Link
              key={t.href}
              href={t.href}
              scroll={false}
              aria-current={on ? 'page' : undefined}
              className={`relative text-[17px] transition-colors duration-150 ${on ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
            >
              {t.label}
              {counts[t.label] !== undefined && (
                <sup className="ml-1 font-hand text-[0.95em] font-normal text-faint">{counts[t.label]}</sup>
              )}
              {on && <Underline className="pointer-events-none absolute -bottom-[15px] -left-[8%] h-2.5 w-[116%] text-ink" />}
            </Link>
          )
        })}
        {/* 推荐是一篇文章不是筛选，放成批注式链接，点了去文章页是意料之中 */}
        <Link
          href="/blog/recommended-articles"
          className="group ml-auto inline-flex items-center gap-1 font-hand text-[21px] text-muted transition-colors hover:text-ink"
        >
          好文推荐
          <ArrowShort className="h-3 w-7 transition-transform duration-250 ease-(--ease-out-strong) group-hover:translate-x-1" />
        </Link>
      </nav>
      {/* 各 tab 内容高矮不一，给个下限，切过去页脚不会上下跳 */}
      <div className="min-h-[70vh]">{children}</div>
    </section>
  )
}

/** /blog 与 /blog/page/N 共用 */
export function BlogIndex({ page, pageSize = 10 }: { page: number; pageSize?: number }) {
  return (
    <BlogShell active="全部">
      <BlogPosts page={page} pageSize={pageSize} />
    </BlogShell>
  )
}

/** 按年分组的纸页列表：左边手写大年份，右边一张 Sheet。posts 需已按时间倒序 */
export function YearSheets({ posts }: { posts: Post[] }) {
  const years = new Map<string, Post[]>()
  for (const p of posts) {
    const y = p.metadata.publishedAt.slice(0, 4)
    years.set(y, [...(years.get(y) ?? []), p])
  }
  return (
    <div className="space-y-10">
      {[...years].map(([year, ps]) => (
        <section key={year} className="grid gap-2 sm:grid-cols-[88px_1fr] sm:gap-5">
          <h2 className="font-hand text-[34px] leading-none font-bold text-ink tabular-nums sm:pt-3.5">
            {year}
            <small className="ml-2 text-xl font-medium text-faint sm:mt-1 sm:ml-0 sm:block">{ps.length} 篇</small>
          </h2>
          <Sheet>
            {ps.map((p) => (
              <PostRow
                key={p.slug}
                href={`/blog/${p.slug}`}
                date={monthDay(p.metadata.publishedAt)}
                title={p.metadata.title}
                category={p.metadata.category}
              />
            ))}
          </Sheet>
        </section>
      ))}
    </div>
  )
}

export function BlogPosts({ page, pageSize = 10 }: { page: number; pageSize?: number }) {
  const allBlogs = getBlogPosts().sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1,
  )
  const totalPages = Math.max(1, Math.ceil(allBlogs.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const posts = allBlogs.slice(start, start + pageSize)

  const prev = safePage > 1 ? (safePage === 2 ? '/blog' : `/blog/page/${safePage - 1}`) : null
  const next = safePage < totalPages ? `/blog/page/${safePage + 1}` : null
  const link = 'inline-flex items-center gap-1.5'

  return (
    <div>
      <YearSheets posts={posts} />
      {totalPages > 1 && (
        <nav aria-label="分页" className="mt-12 flex items-center justify-between font-hand text-2xl">
          {prev ? (
            <Link href={prev} className={`${link} text-ink`}>
              <ArrowShort className="h-3.5 w-8 -scale-x-100" />
              上一页
            </Link>
          ) : (
            <span aria-disabled="true" className={`${link} text-faint`}>
              <ArrowShort className="h-3.5 w-8 -scale-x-100" />
              上一页
            </span>
          )}
          <span className="text-muted tabular-nums">
            {safePage} / {totalPages}
          </span>
          {next ? (
            <Link href={next} className={`${link} text-ink`}>
              下一页
              <ArrowShort className="h-3.5 w-8" />
            </Link>
          ) : (
            <span aria-disabled="true" className={`${link} text-faint`}>
              下一页
              <ArrowShort className="h-3.5 w-8" />
            </span>
          )}
        </nav>
      )}
    </div>
  )
}

/** 单个标签 / 分类页：页头 + 返回链接 + 按年分组列表 */
export function TermPosts({
  kind,
  name,
  backHref,
  posts,
}: {
  kind: '标签' | '分类'
  name: string
  backHref: string
  posts: Post[]
}) {
  return (
    <section>
      <Link
        href={backHref}
        className="group mb-6 inline-flex items-center gap-1.5 font-hand text-[22px] text-muted transition-colors hover:text-ink"
      >
        <ArrowShort className="h-3.5 w-8 -scale-x-100 transition-transform duration-200 group-hover:-translate-x-1" />
        全部{kind}
      </Link>
      <PageHeader
        eyebrow={kind}
        title={name}
        note={
          <>
            <Circled>{posts.length}</Circled> 篇
          </>
        }
      />
      <YearSheets posts={posts} />
    </section>
  )
}
