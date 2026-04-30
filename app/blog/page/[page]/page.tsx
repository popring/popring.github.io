import Link from 'next/link'
import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'
import { TerminalHeader, monoStyle } from '@/components/terminal-header'
import { getBlogPosts } from '@/app/blog/utils'

const PAGE_SIZE = 10

export function generateStaticParams() {
  const total = getBlogPosts().length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }))
}

export const metadata = {
  title: 'Blog',
  description: '探索、记录、分享',
}

const filters = [
  { href: '/blog/recommended-articles', label: '★ recommended' },
  { href: '/blog/tags', label: '# tags' },
  { href: '/blog/categories', label: '@ categories' },
  { href: '/blog/search', label: '? search' },
]

type PageProps = {
  params: Promise<{ page: string }>
}

export default async function Page({ params }: PageProps) {
  const { page } = await params
  const pageNum = parseInt(page, 10)
  const total = getBlogPosts().length

  return (
    <section>
      <AnimateIn>
        <TerminalHeader
          path="~/blog"
          count={total}
          comment="探索、记录、分享"
        />
        <div
          className="flex flex-wrap gap-x-3 gap-y-1.5 mb-8 text-xs"
          style={monoStyle}
        >
          {filters.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="text-neutral-500 dark:text-neutral-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              <span className="text-neutral-400 dark:text-neutral-600">[</span>
              {f.label}
              <span className="text-neutral-400 dark:text-neutral-600">]</span>
            </Link>
          ))}
        </div>
      </AnimateIn>
      <AnimateIn delay={1}>
        <BlogPosts page={pageNum} pageSize={PAGE_SIZE} />
      </AnimateIn>
    </section>
  )
}
