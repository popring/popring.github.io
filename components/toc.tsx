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

  return (
    <aside className='hidden xl:block absolute -left-48 top-0 w-40 h-full'>
      <nav
        aria-label='目录'
        className='sticky top-24 text-xs max-h-[calc(100vh-8rem)] overflow-y-auto'
      >
        <ul className='space-y-1.5'>
          {headings.map((h) => (
            <li key={h.slug} className={h.level === 3 ? 'ml-3' : ''}>
              <a
                href={`#${h.slug}`}
                onClick={(e) => handleClick(e, h.slug)}
                className={`transition-colors leading-snug block ${
                  activeSlug === h.slug
                    ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                    : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
