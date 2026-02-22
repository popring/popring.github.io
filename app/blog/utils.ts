import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  slug?: string
  image?: string
  tags?: string[]
  category?: string
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
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = content.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length
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

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
