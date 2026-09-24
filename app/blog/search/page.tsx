import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getBlogPosts } from '@/app/blog/utils'
import { PageHeader } from '@/components/paper'
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
    <section>
      <PageHeader eyebrow="找一篇" title="搜索" />
      <Suspense>
        <SearchClient posts={posts} />
      </Suspense>
    </section>
  )
}
