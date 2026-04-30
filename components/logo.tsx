import Link from 'next/link'

type LogoMarkProps = {
  size?: number
  className?: string
}

export function LogoMark({ size = 24, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="popring"
      className={`shrink-0 ${className}`.trim()}
    >
      <rect width="100" height="100" rx="20" fill="#0a0a0a" />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="68"
        fontWeight="800"
        fill="#ffffff"
      >
        P
      </text>
    </svg>
  )
}

type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 24, className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="popring's blog home"
      className={`inline-flex items-center px-2 py-1 m-1 transition-opacity hover:opacity-80 ${className}`.trim()}
    >
      <LogoMark size={size} />
    </Link>
  )
}
