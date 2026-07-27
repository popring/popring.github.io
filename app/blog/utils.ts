import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type Metadata = {
  title: string
  publishedAt: string
  updatedAt?: string
  summary: string
  slug?: string
  image?: string
  tags?: string[]
  category?: string
  format?: 'md' | 'mdx'
}

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent)
  return { metadata: data as Metadata, content }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = metadata.slug || path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'blog'))
}

export function getAllCategories(): { category: string; count: number }[] {
  const posts = getBlogPosts()
  const map = new Map<string, { count: number; latest: string }>()
  posts.forEach((post) => {
    const cat = post.metadata.category
    if (cat) {
      const existing = map.get(cat)
      map.set(cat, {
        count: (existing?.count || 0) + 1,
        latest: !existing || post.metadata.publishedAt > existing.latest
          ? post.metadata.publishedAt
          : existing.latest,
      })
    }
  })
  return Array.from(map.entries())
    .map(([category, { count }]) => ({ category, count }))
    .sort((a, b) => {
      const la = map.get(a.category)!.latest
      const lb = map.get(b.category)!.latest
      return lb.localeCompare(la)
    })
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getBlogPosts()
  const map = new Map<string, { count: number; latest: string }>()
  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      const existing = map.get(tag)
      map.set(tag, {
        count: (existing?.count || 0) + 1,
        latest: !existing || post.metadata.publishedAt > existing.latest
          ? post.metadata.publishedAt
          : existing.latest,
      })
    })
  })
  return Array.from(map.entries())
    .map(([tag, { count }]) => ({ tag, count }))
    .sort((a, b) => {
      const la = map.get(a.tag)!.latest
      const lb = map.get(b.tag)!.latest
      return lb.localeCompare(la)
    })
}

export function getPostsByTag(tag: string) {
  return getBlogPosts()
    .filter((post) => post.metadata.tags?.includes(tag))
    .sort((a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
}

export function getPostsByCategory(category: string) {
  return getBlogPosts()
    .filter((post) => post.metadata.category === category)
    .sort((a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
}

export function getReadingStats(content: string) {
  // \u5148\u5265\u6389 JSX/HTML \u6807\u7b7e\u518d\u7edf\u8ba1\u3002\u6807\u7b7e\u5c5e\u6027\uff08className\u3001SVG \u7684 x/y/d \u5750\u6807\u7b49\uff09\u4e0d\u662f\u7ed9\u4eba\u8bfb\u7684\uff0c
  // \u4f46\u6309\u7a7a\u683c\u5207\u8bcd\u65f6\u6bcf\u4e2a\u5c5e\u6027\u90fd\u4f1a\u88ab\u7b97\u6210\u4e00\u4e2a"\u8bcd"\u2014\u2014\u5185\u8054 SVG \u56fe\u8868\u80fd\u628a\u5b57\u6570\u51ed\u7a7a\u6491\u9ad8\u4e0a\u5343\uff0c
  // \u9605\u8bfb\u65f6\u957f\u8ddf\u7740\u865a\u9ad8\u4e00\u500d\u3002\u6807\u7b7e\u5185\u7684\u53ef\u89c1\u6587\u5b57\uff08\u5982 SVG <text> \u7684\u5185\u5bb9\uff09\u4ecd\u4f1a\u88ab\u8ba1\u5165\u3002
  const prose = content.replace(/<[^>]+>/g, ' ')
  const chineseChars = (prose.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = prose.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length
  const totalWords = chineseChars + englishWords
  const readingTime = Math.max(1, Math.ceil(totalWords / 300))
  return { wordCount: totalWords, readingTime }
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const y = targetDate.getFullYear()
  const m = String(targetDate.getMonth() + 1).padStart(2, '0')
  const d = String(targetDate.getDate()).padStart(2, '0')
  const isoDate = `${y}.${m}.${d}`

  if (!includeRelative) return isoDate

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let rel = ''
  if (yearsAgo > 0) rel = `${yearsAgo}y ago`
  else if (monthsAgo > 0) rel = `${monthsAgo}mo ago`
  else if (daysAgo > 0) rel = `${daysAgo}d ago`
  else rel = 'today'

  return `${isoDate} (${rel})`
}
