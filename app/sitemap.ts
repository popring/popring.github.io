import { getBlogPosts } from '@/app/blog/utils'
import { getCraftItems } from '@/app/craft/utils'

export const dynamic = 'force-static'
export const baseUrl = 'https://popring.cn'

export default async function sitemap() {
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const crafts = getCraftItems().map((item) => ({
    url: `${baseUrl}/craft/${item.slug}`,
    lastModified: item.updatedAt,
  }))

  const routes = ['', '/blog', '/craft'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs, ...crafts]
}
