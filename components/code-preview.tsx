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
    <div className="not-prose my-6 overflow-hidden rounded-[14px] border border-line bg-card">
      {/* Header */}
      <div className="flex items-center border-b border-line text-xs">
        <div className="flex flex-1 items-center justify-between border-r border-line py-1.5 pr-1.5 pl-4">
          <span className="font-mono text-faint">{lang}</span>
          <CopyButton text={code} />
        </div>
        <div className="flex-1 px-4 font-mono text-faint">preview</div>
      </div>
      {/* Body */}
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 overflow-auto border-b border-line bg-paper md:border-r md:border-b-0">
          <pre className="m-0 px-5 py-[18px] font-mono text-[13px] leading-[1.7]">
            <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
          </pre>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}
