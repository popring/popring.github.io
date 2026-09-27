import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getBlogPosts } from '@/app/blog/utils'
import { BlogShell } from '@/components/posts'
import { SearchClient } from './search-client'

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索文章',
}

export default function SearchPage() {
  const posts = getBlogPosts()
    .map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      summary: post.metadata.summary,
      publishedAt: post.metadata.publishedAt,
      tags: post.metadata.tags || [],
      category: post.metadata.category || '',
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

  return (
    <BlogShell active="搜索">
      <Suspense>
        <SearchClient posts={posts} />
      </Suspense>
    </BlogShell>
  )
}
