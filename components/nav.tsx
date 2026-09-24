'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { Logo } from './logo'

const navItems = [
  { href: '/', name: '首页' },
  { href: '/blog', name: '文章' },
  { href: '/craft', name: 'Craft' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="mb-14 flex items-center justify-between" aria-label="站点导航">
      <Logo />
      <div className="flex items-center gap-1">
        {navItems.map(({ href, name }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors duration-150 hover:bg-hover hover:text-ink ${
                isActive ? 'bg-hover text-ink' : 'text-muted'
              }`}
            >
              {name}
            </Link>
          )
        })}
        <ThemeToggle />
      </div>
    </nav>
  )
}
