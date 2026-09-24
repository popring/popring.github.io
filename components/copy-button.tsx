'use client'

import { useState, useCallback } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? '已复制' : '复制代码'}
      className="inline-grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-hover hover:text-ink active:scale-[0.96]"
    >
      <span className="relative size-4">
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-200 ${copied ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 text-ink transition-all duration-200 ${copied ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </button>
  )
}
