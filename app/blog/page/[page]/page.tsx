import Link from 'next/link'
import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'
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

type PageProps = {
  params: Promise<{ page: string }>
}

export default async function Page({ params }: PageProps) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  return (
    <section>
      <AnimateIn>
        <h1 className="font-semibold text-2xl mb-4 tracking-tighter">文章</h1>
        <div className="flex gap-2 text-xs mb-8">
          <Link
            href="/blog/tags"
            className="rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            # 标签
          </Link>
          <Link
            href="/blog/categories"
            className="rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            @ 分类
          </Link>
          <Link
            href="/blog/search"
            className="rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            🔍 搜索
          </Link>
        </div>
      </AnimateIn>
      <AnimateIn delay={1}>
        <BlogPosts page={pageNum} pageSize={PAGE_SIZE} />
      </AnimateIn>
    </section>
  )
}
