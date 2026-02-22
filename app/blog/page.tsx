import Link from 'next/link'
import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'

export const metadata = {
  title: 'Blog',
  description: '探索、记录、分享',
}

export default function Page() {
  return (
    <section>
      <AnimateIn>
        <h1 className="font-semibold text-2xl mb-4 tracking-tighter">文章</h1>
        <div className="flex gap-2 text-xs mb-8 flex-wrap">
          <Link
            href="/blog/recommended-articles"
            className="rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            ⭐ 推荐
          </Link>
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
        <BlogPosts page={1} />
      </AnimateIn>
    </section>
  )
}
