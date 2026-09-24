'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Fuse from 'fuse.js'
import { Face } from '@/components/doodle'
import { PostRow, Sheet, monthDay } from '@/components/paper'

type PostItem = {
  slug: string
  title: string
  summary: string
  publishedAt: string
  tags: string[]
  category: string
}

export function SearchClient({ posts }: { posts: PostItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  const handleQueryChange = (value: string) => {
    setQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'summary', weight: 1 },
          { name: 'tags', weight: 1.5 },
          { name: 'category', weight: 1 },
        ],
        threshold: 0.4,
        includeMatches: true,
      }),
    [posts]
  )

  const results = query.trim() ? fuse.search(query).map((r) => r.item) : []

  const q = query.trim()

  return (
    <div>
      <label className="relative mb-3 block">
        <span className="sr-only">搜索文章</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="输入关键词，比如 Go"
          autoComplete="off"
          enterKeyHint="search"
          className="w-full bg-transparent pt-2 pr-11 pb-3.5 text-[clamp(24px,4vw,32px)] leading-[1.3] font-semibold tracking-[-0.02em] text-ink outline-none placeholder:font-medium placeholder:text-faint"
          // biome-ignore lint/a11y/noAutofocus: 专用搜索页，进入即聚焦是预期行为
          autoFocus
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 600 12"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          className="pointer-events-none absolute bottom-0 left-0 h-3 w-full text-ink"
        >
          <path d="M2 7c90-4 200-5 300-3s200 3 296-1" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          className="pointer-events-none absolute top-3 right-1 size-7 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </label>
      <p className="mb-7 font-hand text-[22px] text-muted">
        试试
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleQueryChange(s)}
            className="ml-2 cursor-pointer px-0.5 text-ink underline decoration-faint underline-offset-4"
          >
            {s}
          </button>
        ))}
      </p>
      {q &&
        (results.length ? (
          <>
            <p className="mb-3 font-hand text-[22px] text-ink">找到 {results.length} 篇</p>
            <Sheet>
              {results.map((post) => (
                <PostRow
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  date={monthDay(post.publishedAt)}
                  title={highlight(post.title, q)}
                  category={post.category}
                />
              ))}
            </Sheet>
          </>
        ) : (
          <div className="py-10 text-center text-muted">
            <Face className="mx-auto mb-3 block size-24 text-faint" />
            <b className="block font-hand text-[26px] font-medium text-ink">本子里没写过"{q}"</b>
            换个词试试，或者去
            <Link href="/blog/categories" className="mx-0.5 text-ink underline decoration-faint underline-offset-4">
              分类
            </Link>
            里翻翻
          </div>
        ))}
    </div>
  )
}

const suggestions = ['AI', '动画', '增长']

/** 标题里第一处命中关键词的地方涂荧光笔；模糊命中没有原词时原样返回 */
function highlight(text: string, q: string) {
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="hl">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}
