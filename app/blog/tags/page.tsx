import Link from 'next/link'
import { getAllTags } from '@/app/blog/utils'
import { PageHeader } from '@/components/paper'

export const metadata = {
  title: '标签',
  description: '按标签浏览文章',
}

export default function TagsPage() {
  const tags = getAllTags()
  const maxCount = Math.max(...tags.map((t) => t.count))
  const minCount = Math.min(...tags.map((t) => t.count))
  const scale = (count: number) => (maxCount === minCount ? 0.3 : (count - minCount) / (maxCount - minCount))

  return (
    <section>
      <PageHeader eyebrow="更细一点" title="标签" sub="一篇文章可以有好几个标签。字越大，写得越多。" />
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2.5">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/blog/tags/${encodeURIComponent(tag)}`}
            className="text-body decoration-faint decoration-wavy decoration-1 underline-offset-[5px] transition-colors duration-150 hover:text-ink hover:underline"
            style={{ fontSize: `${Math.round(14 + scale(count) * 18)}px`, fontWeight: scale(count) > 0.35 ? 600 : 400 }}
          >
            {tag}
            <sup className="ml-0.5 align-[0.4em] font-hand text-[0.7em] leading-none font-normal text-faint">{count}</sup>
          </Link>
        ))}
      </div>
    </section>
  )
}
