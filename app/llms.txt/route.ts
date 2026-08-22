export const dynamic = 'force-static'
import { baseUrl } from '@/app/sitemap'
import { getBlogPosts } from '@/app/blog/utils'

// llms.txt（https://llmstxt.org/）：给 AI 爬虫/助手的站点导览，
// 按分类列出全部文章的标题、链接和一句话摘要。
export async function GET() {
  const posts = getBlogPosts().sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
  )

  const byCategory = new Map<string, typeof posts>()
  for (const post of posts) {
    const cat = post.metadata.category || '未分类'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(post)
  }

  const sections = [...byCategory.entries()]
    .map(
      ([cat, items]) =>
        `## ${cat}\n\n` +
        items
          .map(
            (p) =>
              `- [${p.metadata.title}](${baseUrl}/blog/${p.slug}): ${p.metadata.summary || ''}`
          )
          .join('\n')
    )
    .join('\n\n')

  const body = `# popring.cn

> Harry（popring）的个人博客：全栈 + 增长工程师。内容覆盖前端/全栈开发、增长工程与 A/B 实验、AI 工具实战（Claude Code 等）、读书笔记与年度总结。中文写作。

- [博客列表](${baseUrl}/blog)
- [RSS](${baseUrl}/rss)

${sections}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
