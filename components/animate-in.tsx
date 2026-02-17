'use client'

import { useEffect, useState } from 'react'

let appMounted = false

export function AnimateIn({
  children,
  className = '',
  delay,
}: {
  children: React.ReactNode
  className?: string
  delay?: 1 | 2 | 3
}) {
  const [shouldAnimate] = useState(() => !appMounted)

  useEffect(() => {
    appMounted = true
  }, [])

  const animClass = shouldAnimate
    ? delay
      ? `animate-in-delay-${delay}`
      : 'animate-in'
    : ''

  return (
    <div className={`${animClass} ${className}`.trim()}>
      {children}
    </div>
  )
}
