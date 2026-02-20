import type { Metadata } from 'next'
import { getBlogPosts } from '@/app/blog/utils'
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
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">搜索</h1>
      <SearchClient posts={posts} />
    </section>
  )
}
