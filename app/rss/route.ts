export const dynamic = 'force-static'
import { baseUrl } from '@/app/sitemap'
import { getBlogPosts } from '@/app/blog/utils'

// title / summary 直接插进 XML 会炸整个 feed：只要正文摘要里出现 <hr>、<object>、
// <div id="app"> 这类标签（前端类文章很常见），解析器就报 tag mismatch 并停在第一个错误处。
// & 必须先替换，否则会把后面替换出来的实体再转义一次。
function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const allBlogs = await getBlogPosts()

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</link>
          <description>${escapeXml(post.metadata.summary || '')}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>popring's blog</title>
        <link>${baseUrl}</link>
        <description>探索、记录、分享</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
