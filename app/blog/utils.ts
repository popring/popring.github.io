import fs from 'fs'
import path from 'path'

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
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}
  let currentKey = ''

  frontMatterLines.forEach((line) => {
    // Handle YAML array items (e.g., "  - tag")
    const arrayItemMatch = line.match(/^\s+-\s+(.+)/)
    if (arrayItemMatch && currentKey) {
      const arr = metadata[currentKey as keyof Metadata]
      if (Array.isArray(arr)) {
        arr.push(arrayItemMatch[1].trim())
      }
      return
    }

    const [key, ...valueArr] = line.split(': ')
    const trimmedKey = key.trim()
    let value = valueArr.join(': ').trim()

    // Handle "tags:" with no inline value (YAML array follows)
    if (trimmedKey === 'tags' && !value) {
      metadata.tags = []
      currentKey = 'tags'
      return
    }

    currentKey = ''
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[trimmedKey as keyof Metadata] = value as never
  })

  return { metadata: metadata as Metadata, content }
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
  const map = new Map<string, number>()
  posts.forEach((post) => {
    const cat = post.metadata.category
    if (cat) map.set(cat, (map.get(cat) || 0) + 1)
  })
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getBlogPosts()
  const map = new Map<string, number>()
  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      map.set(tag, (map.get(tag) || 0) + 1)
    })
  })
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
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
