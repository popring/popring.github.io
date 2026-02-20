'use client'

import { useEffect, useRef } from 'react'

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('.giscus')) return

    const getTheme = () =>
      document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'popring/popring.github.io')
    script.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkyMjkyODc3Mjc=')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDODaqnL84C216c')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', getTheme())
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    ref.current.appendChild(script)

    const updateGiscusTheme = () => {
      const iframe = document.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame'
      )
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: getTheme() } } },
        'https://giscus.app'
      )
    }

    const observer = new MutationObserver(updateGiscusTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return <div ref={ref} className="mt-16" />
}
