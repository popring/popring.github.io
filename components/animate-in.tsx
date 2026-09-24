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

/** 线稿描线入场：只在整站首次进入时画，站内跳转回来不再重播 */
export function DrawIn({
  children,
  className = '',
  late = false,
}: {
  children: React.ReactNode
  className?: string
  late?: boolean
}) {
  const [shouldAnimate] = useState(() => !appMounted)

  useEffect(() => {
    appMounted = true
  }, [])

  const cls = shouldAnimate ? `doodle-draw${late ? ' doodle-draw-late' : ''}` : ''
  return <span className={`${cls} ${className}`.trim()}>{children}</span>
}
