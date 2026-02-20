import Link from 'next/link'
import { getAllTags } from '@/app/blog/utils'

export const metadata = {
  title: '标签',
  description: '按标签浏览文章',
}

export default function TagsPage() {
  const tags = getAllTags()
  const maxCount = Math.max(...tags.map((t) => t.count))
  const minCount = Math.min(...tags.map((t) => t.count))

  function getFontSize(count: number) {
    if (maxCount === minCount) return 16
    return 12 + ((count - minCount) / (maxCount - minCount)) * 12
  }

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">标签</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/blog/tags/${encodeURIComponent(tag)}`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
            style={{ fontSize: `${getFontSize(count)}px` }}
          >
            {tag}
            <sup className="text-xs ml-0.5 text-neutral-400 dark:text-neutral-600">
              {count}
            </sup>
          </Link>
        ))}
      </div>
    </section>
  )
}
