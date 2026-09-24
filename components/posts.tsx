import Link from 'next/link'
import { getBlogPosts } from '@/app/blog/utils'
import { ArrowShort, Circled } from './doodle'
import { PageHeader, PostRow, Sheet, monthDay } from './paper'

type Post = ReturnType<typeof getBlogPosts>[number]

const pill = 'rounded-[14px_10px_16px_9px/10px_15px_9px_14px] border px-3.5 py-1.5 text-sm transition-colors duration-150'

const tabs = [
  { href: '/blog', label: '全部' },
  { href: '/blog/recommended-articles', label: '推荐' },
  { href: '/blog/tags', label: '标签' },
  { href: '/blog/categories', label: '分类' },
  { href: '/blog/search', label: '搜索' },
]

/** /blog 与 /blog/page/N 共用：页头 + 筛选 tab + 按年分组列表 + 分页 */
export function BlogIndex({ page, pageSize = 10 }: { page: number; pageSize?: number }) {
  const total = getBlogPosts().length
  return (
    <section>
      <PageHeader
        eyebrow="全部文章"
        title="文章"
        sub="按时间倒序。踩过的坑、读过的书、想通的事，都在这。"
        note={
          <>
            一共 <Circled>{total}</Circled> 篇
          </>
        }
      />
      <nav aria-label="筛选" className="mb-10 flex flex-wrap gap-2">
        {tabs.map((t) =>
          t.href === '/blog' ? (
            <Link key={t.href} href={t.href} aria-current="page" className={`${pill} border-transparent bg-inv text-inv-ink`}>
              {t.label}
            </Link>
          ) : (
            <Link
              key={t.href}
              href={t.href}
              className={`${pill} border-line bg-card text-body hover:border-line-strong hover:text-ink`}
            >
              {t.label}
            </Link>
          ),
        )}
      </nav>
      <BlogPosts page={page} pageSize={pageSize} />
    </section>
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
