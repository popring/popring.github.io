import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { transliterate } from 'transliteration'

const HEXO_POSTS = '/Users/harryhao/code/my-project/popring.github.io/source/_posts'
const HEXO_DRAFTS = '/Users/harryhao/code/my-project/popring.github.io/source/_drafts'
const TARGET_DIR = path.resolve('blog')

// Check if an abbrlink is a semantic slug (not a CRC32 hash)
function isSemanticSlug(abbrlink) {
  if (!abbrlink) return false
  // Semantic slugs contain hyphens and have letter-based words
  // CRC32 hashes are 6-8 hex chars like "e5ee95a5", "34845574"
  if (abbrlink.includes('-')) return true
  // Pure hex string of 6-8 chars = hash
  if (/^[0-9a-f]{5,8}$/i.test(abbrlink)) return false
  return false
}

// Generate a slug from title
function slugFromTitle(title) {
  // transliterate Chinese to pinyin, keep English as-is
  const slug = transliterate(title, { trim: true })
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-|-$/g, '') // trim leading/trailing hyphens
    .substring(0, 60)

  return slug || 'untitled'
}

// Generate slug: prefer semantic abbrlink, otherwise generate from title
function generateSlug(title, abbrlink) {
  if (isSemanticSlug(abbrlink)) {
    return abbrlink
  }
  return slugFromTitle(title)
}

// Ensure slug is unique
function ensureUniqueSlug(slug, existingSlugs) {
  let uniqueSlug = slug
  let counter = 2
  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }
  existingSlugs.add(uniqueSlug)
  return uniqueSlug
}

// Extract summary from content
function generateSummary(content) {
  // Strip <!-- more --> first so it doesn't interfere
  const stripped = content.replace(/<!--\s*more\s*-->/g, '')

  // 1. Check for <!-- more --> marker - use content before it
  const moreMatch = content.match(/<!--\s*more\s*-->/)
  if (moreMatch) {
    const before = content.substring(0, moreMatch.index)
    const cleaned = cleanMarkdown(before)
    if (cleaned.length > 10) {
      return truncate(cleaned, 200)
    }
  }

  // 2. Extract first meaningful paragraph(s) from stripped content
  const lines = stripped.split('\n')
  const paragraphs = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('#')) continue
    if (trimmed.startsWith('```')) continue
    if (trimmed.startsWith('![')) continue
    if (trimmed.startsWith('<!--')) continue
    const cleaned = cleanMarkdown(trimmed.replace(/^>\s*/, ''))
    if (cleaned.length > 5) {
      paragraphs.push(cleaned)
      if (paragraphs.join(' ').length > 30) break
    }
  }

  if (paragraphs.length > 0) {
    return truncate(paragraphs.join(' '), 200)
  }

  return truncate(cleanMarkdown(stripped), 200)
}

// Strip markdown syntax for plain text
function cleanMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // images
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // bold/italic
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/^>\s+/gm, '') // blockquotes
    .replace(/^[-*+]\s+/gm, '') // list items
    .replace(/^\d+\.\s+/gm, '') // ordered lists
    .replace(/\n+/g, ' ') // newlines to spaces
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim()
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str
  return str.substring(0, maxLen).trim()
}

// Convert CSS property to camelCase (e.g., "background-color" -> "backgroundColor")
function cssPropToCamel(prop) {
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

// Convert HTML style="..." to JSX style={{...}}, skipping code blocks
function convertInlineStyles(content) {
  // Split content into code blocks and non-code blocks
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g)

  return parts
    .map((part, i) => {
      // Odd indices are code blocks - leave them alone
      if (i % 2 === 1) return part

      // Convert style="..." in non-code parts
      return part.replace(
        /(<[a-zA-Z][^>]*?)style="([^"]*?)"([^>]*?>)/g,
        (match, before, styleStr, after) => {
          try {
            const pairs = styleStr
              .split(';')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((pair) => {
                const colonIdx = pair.indexOf(':')
                if (colonIdx === -1) return null
                const prop = cssPropToCamel(pair.substring(0, colonIdx).trim())
                const val = pair.substring(colonIdx + 1).trim()
                return `${prop}: "${val}"`
              })
              .filter(Boolean)

            if (pairs.length === 0) return match
            return `${before}style={{${pairs.join(', ')}}}${after}`
          } catch {
            return match
          }
        }
      )
    })
    .join('')
}

// Convert other HTML attributes and tags that differ in JSX/MDX
function convertHtmlToJsx(content) {
  // Split into code blocks vs non-code
  const parts = content.split(/(```[\s\S]*?```)/g)

  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part // code block, skip

      let result = convertInlineStyles(part)

      // HTML attributes to JSX
      result = result.replace(/frameborder="/g, 'frameBorder="')
      result = result.replace(/allowtransparency="/g, 'allowTransparency="')
      result = result.replace(/\ballowfullscreen(?:="true")?\b/g, 'allowFullScreen')
      result = result.replace(/\bclass="/g, 'className="')
      result = result.replace(/\bfor="/g, 'htmlFor="')
      result = result.replace(/\btabindex="/g, 'tabIndex="')
      result = result.replace(/\bautofocus\b/g, 'autoFocus')
      result = result.replace(/\bcellpadding="/g, 'cellPadding="')
      result = result.replace(/\bcellspacing="/g, 'cellSpacing="')
      result = result.replace(/\bcolspan="/g, 'colSpan="')
      result = result.replace(/\browspan="/g, 'rowSpan="')

      // Self-closing void elements (br, hr, img without /)
      result = result.replace(/<br\s*>/g, '<br />')
      result = result.replace(/<hr\s*>/g, '<hr />')
      // img tags that aren't self-closed
      result = result.replace(/<img ([^>]*[^/])>/g, '<img $1 />')

      return result
    })
    .join('')
}

// Remove <!-- more --> from content
function cleanContent(content) {
  let result = content.replace(/<!--\s*more\s*-->\n?/g, '')
  result = convertHtmlToJsx(result)
  return result
}

// Build frontmatter string manually to control output format
function buildFrontmatter(meta) {
  const lines = ['---']
  lines.push(`title: '${meta.title.replace(/'/g, "''")}'`)
  lines.push(`publishedAt: '${meta.publishedAt}'`)
  lines.push(`summary: '${meta.summary.replace(/'/g, "''")}'`)
  lines.push(`slug: '${meta.slug}'`)

  if (meta.tags && meta.tags.length > 0) {
    lines.push('tags:')
    for (const tag of meta.tags) {
      lines.push(`  - ${tag}`)
    }
  }

  if (meta.category) {
    lines.push(`category: '${meta.category}'`)
  }

  lines.push('---')
  return lines.join('\n')
}

// Collect all .md files recursively
function collectMarkdownFiles(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  return files
}

// Main migration
function migrate() {
  const existingSlugs = new Set()
  const results = []
  const warnings = []

  // Collect all posts
  const postFiles = collectMarkdownFiles(HEXO_POSTS)
  const draftFiles = fs.existsSync(HEXO_DRAFTS)
    ? collectMarkdownFiles(HEXO_DRAFTS)
    : []

  const allFiles = [
    ...postFiles.map((f) => ({ path: f, isDraft: false })),
    ...draftFiles.map((f) => ({ path: f, isDraft: true })),
  ]

  console.log(`Found ${postFiles.length} posts and ${draftFiles.length} drafts`)

  for (const file of allFiles) {
    try {
      const raw = fs.readFileSync(file.path, 'utf-8')
      const { data, content } = matter(raw)

      const title = data.title || path.basename(file.path, '.md')
      const dateStr = data.date
        ? new Date(data.date).toISOString().split('T')[0]
        : '2024-01-01'

      // Handle tags - can be string, array, or undefined
      let tags = data.tags || []
      if (typeof tags === 'string') tags = [tags]
      tags = tags.filter(Boolean)

      // Handle categories - extract from path or frontmatter
      let category = data.categories || ''
      if (Array.isArray(category)) category = category[0] || ''
      if (!category) {
        // Extract from directory name
        const relPath = path.relative(HEXO_POSTS, file.path)
        const parts = relPath.split(path.sep)
        if (parts.length > 1) category = parts[0]
      }

      // Generate slug
      const rawSlug = generateSlug(title, data.abbrlink?.toString())
      const slug = ensureUniqueSlug(rawSlug, existingSlugs)

      // Generate summary
      const summary = generateSummary(content)
      if (summary.length < 20) {
        warnings.push(`Short summary: ${title} → "${summary}"`)
      }

      // Clean content
      const cleanedContent = cleanContent(content)

      // Build output
      const meta = {
        title,
        publishedAt: dateStr,
        summary,
        slug,
        tags: tags.length > 0 ? tags : undefined,
        category: category || undefined,
      }

      const frontmatter = buildFrontmatter(meta)
      const output = `${frontmatter}\n\n${cleanedContent.trim()}\n`

      // Write file (use slug as filename)
      const targetPath = path.join(TARGET_DIR, `${slug}.mdx`)
      fs.writeFileSync(targetPath, output, 'utf-8')

      results.push({
        title,
        slug,
        category,
        isDraft: file.isDraft,
        source: path.basename(file.path),
      })

      console.log(`✓ ${file.isDraft ? '[DRAFT] ' : ''}${title} → ${slug}.mdx`)
    } catch (err) {
      console.error(`✗ Failed: ${file.path}`, err.message)
      warnings.push(`Failed: ${file.path} - ${err.message}`)
    }
  }

  // Summary
  console.log(`\n=== Migration Summary ===`)
  console.log(`Total migrated: ${results.length}`)

  const byCategory = {}
  for (const r of results) {
    const cat = r.category || 'uncategorized'
    byCategory[cat] = (byCategory[cat] || 0) + 1
  }
  console.log('By category:')
  for (const [cat, count] of Object.entries(byCategory).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${cat}: ${count}`)
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`)
    for (const w of warnings) {
      console.log(`  - ${w}`)
    }
  }

  // Save migration log
  fs.writeFileSync(
    path.join(TARGET_DIR, '_migration-log.json'),
    JSON.stringify({ results, warnings }, null, 2)
  )
  console.log(`\nMigration log saved to blog/_migration-log.json`)
}

migrate()
