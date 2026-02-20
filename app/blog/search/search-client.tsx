'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'

type PostItem = {
  slug: string
  title: string
  summary: string
  publishedAt: string
  tags: string[]
  category: string
}

export function SearchClient({ posts }: { posts: PostItem[] }) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'summary', weight: 1 },
          { name: 'tags', weight: 1.5 },
          { name: 'category', weight: 1 },
        ],
        threshold: 0.4,
        includeMatches: true,
      }),
    [posts]
  )

  const results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : []

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入关键词搜索文章..."
        className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
        autoFocus
      />
      {query.trim() && (
        <p className="mt-4 mb-2 text-sm text-neutral-500">
          找到 {results.length} 篇文章
        </p>
      )}
      <div>
        {results.map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4 group pl-3 border-l-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums shrink-0">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
