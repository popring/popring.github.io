import Link from 'next/link'
import { getAllCategories, getPostsByCategory, formatDate } from '@/app/blog/utils'

export async function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({
    category,
  }))
}

type PageProps = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  return {
    title: `分类: ${decoded}`,
    description: `${decoded} 分类下的所有文章`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  const posts = getPostsByCategory(decoded)

  return (
    <section>
      <Link
        href="/blog/categories"
        className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
      >
        ← 所有分类
      </Link>
      <h1 className="font-semibold text-2xl mt-4 mb-8 tracking-tighter">
        {decoded}
      </h1>
      <div>
        {posts.map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4 group pl-3 border-l-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
