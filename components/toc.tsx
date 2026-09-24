'use client'

import { useState, useEffect } from 'react'

type Heading = {
  level: number
  text: string
  slug: string
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug ?? '')

  useEffect(() => {
    const slugs = headings.map((h) => h.slug)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )

    for (const slug of slugs) {
      const el = document.getElementById(slug)
      if (el) observer.observe(el)
    }

    // Initial check: find heading currently visible in the observation zone
    const topBound = 80
    const bottomBound = window.innerHeight * 0.3
    let initialSlug = ''
    for (const slug of slugs) {
      const el = document.getElementById(slug)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top >= topBound && rect.top <= bottomBound) {
          initialSlug = slug
          break
        }
      }
    }
    // Fallback: pick the last heading above the observation zone
    if (!initialSlug) {
      for (const slug of [...slugs].reverse()) {
        const el = document.getElementById(slug)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top < topBound) {
            initialSlug = slug
            break
          }
        }
      }
    }
    // Default to first heading if nothing else matched
    if (!initialSlug && headings.length > 0) {
      initialSlug = headings[0].slug
    }
    const frame = window.requestAnimationFrame(() => {
      setActiveSlug(initialSlug)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [headings])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    e.preventDefault()
    const el = document.getElementById(slug)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', `#${slug}`)
    }
  }

  const items = (compact: boolean) =>
    headings.map((h) => (
      <li key={h.slug} className={h.level === 3 ? (compact ? 'ml-3' : 'ml-4 text-[14px]') : ''}>
        <a
          href={`#${h.slug}`}
          onClick={(e) => handleClick(e, h.slug)}
          className={
            compact
              ? `block leading-snug transition-colors ${
                  activeSlug === h.slug ? 'font-medium text-ink' : 'text-muted hover:text-ink'
                }`
              : 'text-body decoration-faint decoration-wavy decoration-1 underline-offset-4 transition-colors hover:text-ink hover:underline'
          }
        >
          {h.text}
        </a>
      </li>
    ))

  return (
    <>
      {/* 窄屏：正文上方的折叠目录 */}
      <details className='group mb-10 rounded-[10px] border border-dashed border-line-strong px-[18px] py-3.5 xl:hidden'>
        <summary className='cursor-pointer list-none font-hand text-2xl text-ink after:text-faint after:content-["_+"] group-open:after:content-["_−"] [&::-webkit-details-marker]:hidden'>
          目录
        </summary>
        <ul className='mt-2 text-[15px] leading-[1.9]'>{items(false)}</ul>
      </details>
      {/* 宽屏：左侧 sticky */}
      <aside className='absolute top-0 -left-52 hidden h-full w-40 xl:block'>
        <nav aria-label='目录' className='sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto text-[13px]'>
          <p className='mb-2 font-hand text-[22px] text-ink'>目录</p>
          <ul className='space-y-1.5'>{items(true)}</ul>
        </nav>
      </aside>
    </>
  )
}
