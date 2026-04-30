import Link from 'next/link'
import { formatDate, getBlogPosts } from '@/app/blog/utils'
import { monoStyle } from './terminal-header'

type BlogPostsProps = {
  limit?: number
  page?: number
  pageSize?: number
}

export function BlogPosts({ limit, page, pageSize = 10 }: BlogPostsProps) {
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
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-900">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              className="group flex items-baseline gap-3 py-2.5 transition-colors"
              href={`/blog/${post.slug}`}
            >
              <span
                className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums shrink-0 w-[88px]"
                style={monoStyle}
              >
                {formatDate(post.metadata.publishedAt, false)}
              </span>
              <span
                className="text-neutral-300 dark:text-neutral-700 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors shrink-0"
                style={monoStyle}
                aria-hidden
              >
                {'>'}
              </span>
              <span className="text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug">
                {post.metadata.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {page && totalPages > 1 && (
        <nav
          className="flex items-center justify-between mt-6 text-xs text-neutral-500 dark:text-neutral-400"
          style={monoStyle}
        >
          {page > 1 ? (
            <Link
              href={page === 2 ? '/blog' : `/blog/page/${page - 1}`}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              ← prev
            </Link>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-700">
              ← prev
            </span>
          )}
          <span className="text-neutral-400 dark:text-neutral-600 tabular-nums">
            [{String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}]
          </span>
          {page < totalPages ? (
            <Link
              href={`/blog/page/${page + 1}`}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              next →
            </Link>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-700">
              next →
            </span>
          )}
        </nav>
      )}
    </div>
  )
}
