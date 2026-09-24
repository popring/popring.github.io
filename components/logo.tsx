import Link from 'next/link'
import { Face } from './doodle'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="popring 首页"
      className={`inline-flex items-center gap-2.5 text-lg font-bold tracking-[-0.02em] text-ink ${className}`.trim()}
    >
      <Face className="h-[26px] w-[26px]" />
      popring
    </Link>
  )
}
