import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CRAFT_DIR = path.join(process.cwd(), 'craft')
const THUMB_PUBLIC_DIR = path.join(process.cwd(), 'public', 'craft')
const THUMB_EXTS = ['gif', 'png', 'webp', 'jpg', 'jpeg'] as const

export type CraftItem = {
  slug: string
  title: string
  description: string
  thumb: string | null
  content: string
  format: 'md' | 'mdx'
  year: string | null
  updatedAt: string
}

function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1].trim() ?? null
}

function extractDescription(content: string): string {
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('<')) continue
    if (trimmed.startsWith('import') || trimmed.startsWith('export')) continue
    return trimmed.replace(/[*_`]/g, '').slice(0, 140)
  }
  return ''
}

function findThumb(slug: string): string | null {
  const dir = path.join(THUMB_PUBLIC_DIR, slug)
  if (!fs.existsSync(dir)) return null
  for (const ext of THUMB_EXTS) {
    if (fs.existsSync(path.join(dir, `thumb.${ext}`))) {
      return `/craft/${slug}/thumb.${ext}`
    }
  }
  return null
}

export function getCraftItems(): CraftItem[] {
  if (!fs.existsSync(CRAFT_DIR)) return []
  const files = fs.readdirSync(CRAFT_DIR).filter((f) => f.endsWith('.mdx'))
  const items = files.map((file): CraftItem => {
    const filePath = path.join(CRAFT_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const slug = (data.slug as string) || path.basename(file, '.mdx')
    const stat = fs.statSync(filePath)
    const year =
      typeof data.year === 'string' || typeof data.year === 'number'
        ? String(data.year)
        : null
    return {
      slug,
      title: (data.title as string) || extractTitle(content) || slug,
      description:
        (data.description as string) ||
        (data.summary as string) ||
        extractDescription(content),
      thumb: findThumb(slug),
      content,
      format: (data.format as 'md' | 'mdx') || 'mdx',
      year,
      updatedAt: stat.mtime.toISOString().slice(0, 10),
    }
  })
  return items.sort((a, b) => {
    const ay = a.year ?? ''
    const by = b.year ?? ''
    if (ay !== by) return by.localeCompare(ay)
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}

export function getCraftItem(slug: string): CraftItem | undefined {
  return getCraftItems().find((i) => i.slug === slug)
}
