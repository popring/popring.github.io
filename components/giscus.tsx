'use client'

import { useEffect, useRef } from 'react'

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('.giscus')) return

    // 纸面主题 CSS 在 public/giscus/。Giscus 跑在 https 的 iframe 里，加载不了
    // http://localhost 的 CSS（混合内容会被拦），所以本地开发退回官方主题。
    const getTheme = () => {
      const mode = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
      return location.protocol === 'https:'
        ? `${location.origin}/giscus/paper-${mode}.css`
        : mode
    }

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
