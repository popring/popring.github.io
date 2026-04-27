'use client'

import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}
