import Link from 'next/link'
import { formatDate, getBlogPosts } from '@/app/blog/utils'

type BlogPostsProps = {
  limit?: number
  page?: number
  pageSize?: number
}

export function BlogPosts({ limit, page, pageSize = 5 }: BlogPostsProps) {
  const allBlogs = getBlogPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  let posts = allBlogs
  let totalPages = 1

  if (page) {
    totalPages = Math.max(1, Math.ceil(allBlogs.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize
    posts = allBlogs.slice(start, start + pageSize)
  } else if (limit) {
    posts = allBlogs.slice(0, limit)
  }

  return (
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
      {page && totalPages > 1 && (
        <nav className="flex items-center justify-between mt-8 text-sm text-neutral-600 dark:text-neutral-400">
          {page > 1 ? (
            <Link
              href={page === 2 ? '/blog' : `/blog?page=${page - 1}`}
              className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              上一页
            </Link>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-700">上一页</span>
          )}
          <span>{page} / {totalPages}</span>
          {page < totalPages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              下一页
            </Link>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-700">下一页</span>
          )}
        </nav>
      )}
    </div>
  )
}
