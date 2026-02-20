'use client'

export function TableOfContents({
  headings,
}: {
  headings: { level: number; text: string; slug: string }[]
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault()
    const el = document.getElementById(slug)
    if (!el) return

    history.replaceState(null, '', `#${slug}`)
    el.scrollIntoView({ behavior: 'smooth' })

    // Wait for scroll to finish, then trigger highlight
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          el.classList.remove('toc-highlight')
          // Force reflow to restart animation
          void el.offsetWidth
          el.classList.add('toc-highlight')
        }
      },
      { threshold: 1 }
    )
    observer.observe(el)

    // Fallback: disconnect after 2s in case element never fully intersects
    setTimeout(() => observer.disconnect(), 2000)
  }

  return (
    <aside className="hidden xl:block absolute -left-48 top-0 w-40 h-full">
      <nav className="sticky top-24 text-xs max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="text-neutral-400 dark:text-neutral-500 mb-2 font-medium">目录</p>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.slug} className={h.level === 3 ? 'ml-3' : ''}>
              <a
                href={`#${h.slug}`}
                onClick={(e) => handleClick(e, h.slug)}
                className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors leading-snug block"
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
