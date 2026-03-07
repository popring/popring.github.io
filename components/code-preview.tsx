'use client'

import { type ReactNode } from 'react'
import { highlight } from 'sugar-high'
import { CopyButton } from './copy-button'

type CodePreviewProps = {
  code: string
  lang?: string
  children: ReactNode
}

export function CodePreview({ code, lang = 'html', children }: CodePreviewProps) {
  const codeHTML = highlight(code)

  return (
    <div className="my-6 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      {/* Header */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex-1 px-4 py-2 font-medium border-r border-neutral-200 dark:border-neutral-800">
          Code
          {lang && (
            <span className="ml-2 text-neutral-400 dark:text-neutral-500">
              {lang}
            </span>
          )}
        </div>
        <div className="flex-1 px-4 py-2 font-medium">Preview</div>
      </div>
      {/* Body */}
      <div className="flex flex-col md:flex-row">
        {/* Source code panel */}
        <div className="flex-1 relative group md:border-r border-b md:border-b-0 border-neutral-200 dark:border-neutral-800 overflow-auto">
          <CopyButton text={code} />
          <pre
            className="bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-[13px] leading-relaxed m-0 border-0 rounded-none"
            style={{
              fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
            }}
          >
            <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
          </pre>
        </div>
        {/* Preview panel */}
        <div className="flex-1 not-prose p-4 bg-white dark:bg-neutral-950 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
