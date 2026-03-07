# CodePreview Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `<CodePreview>` MDX component that shows source code on the left and a live preview on the right.

**Architecture:** A `'use client'` component that detects whether `children` is a string (HTML mode) or React elements (component mode). String children are used for both source display and `dangerouslySetInnerHTML` preview. React element children are rendered directly for preview, with a separate `code` prop for source display. Sugar-high handles syntax highlighting; existing CopyButton is reused.

**Tech Stack:** React, TypeScript, Tailwind CSS, sugar-high, existing CopyButton component

---

### Task 1: Create CodePreview component

**Files:**
- Create: `components/code-preview.tsx`

**Step 1: Create the component file**

```tsx
'use client'

import { useState, type ReactNode } from 'react'
import { highlight } from 'sugar-high'
import { CopyButton } from './copy-button'

function jsxToHtml(code: string): string {
  // Strip function/export wrappers, extract return content
  let html = code
    .replace(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{?\s*/g, '')
    .replace(/function\s+\w+\s*\([^)]*\)\s*\{?\s*/g, '')
    .replace(/return\s*\(\s*/g, '')
    .replace(/\s*\)\s*;?\s*\}?\s*$/g, '')
    .replace(/className=/g, 'class=')
  // Clean up any remaining trailing braces
  html = html.replace(/\s*\}\s*$/, '').trim()
  return html
}

type CodePreviewProps = {
  lang?: string
  code?: string
  children: string | ReactNode
}

export function CodePreview({ lang = 'html', code, children }: CodePreviewProps) {
  const isStringChildren = typeof children === 'string'
  const sourceCode = code || (isStringChildren ? children : '')
  const codeHTML = highlight(sourceCode as string)

  const isJsx = lang === 'jsx' || lang === 'react'

  return (
    <div className="my-6 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      {/* Header */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex-1 px-4 py-2 font-medium border-r border-neutral-200 dark:border-neutral-800">
          Code
        </div>
        <div className="flex-1 px-4 py-2 font-medium">
          Preview
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col md:flex-row">
        {/* Source code panel */}
        <div className="flex-1 relative group md:border-r border-b md:border-b-0 border-neutral-200 dark:border-neutral-800 overflow-auto">
          <CopyButton text={sourceCode as string} />
          <pre className="bg-neutral-50 dark:bg-neutral-900 py-3 px-4 text-[13px] leading-relaxed m-0 border-0 rounded-none" style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
            <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
          </pre>
        </div>
        {/* Preview panel */}
        <div className="flex-1 not-prose p-4 bg-white dark:bg-neutral-950 flex items-start justify-center overflow-auto">
          {isStringChildren ? (
            <div
              dangerouslySetInnerHTML={{
                __html: isJsx ? jsxToHtml(children) : children,
              }}
            />
          ) : (
            <div>{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/code-preview.tsx
git commit -m "feat: add CodePreview component"
```

---

### Task 2: Register CodePreview in MDX components

**Files:**
- Modify: `components/mdx.tsx:1-7` (imports) and `components/mdx.tsx:112-126` (components object)

**Step 1: Add import**

At the top of `components/mdx.tsx`, add after the CopyButton import (line 5):

```typescript
import { CodePreview } from './code-preview'
```

**Step 2: Register in components object**

In the `components` object (line 112-126), add `CodePreview`:

```typescript
const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  pre: Pre,
  table: TableWrapper,
  Table,
  CodePreview,
}
```

**Step 3: Commit**

```bash
git add components/mdx.tsx
git commit -m "feat: register CodePreview in MDX components"
```

---

### Task 3: Verify with dev server

**Step 1: Create a test blog post**

Create a temporary blog post `blog/test-code-preview.mdx`:

```mdx
---
title: 'Test Code Preview'
publishedAt: '2026-03-07'
summary: 'Testing the CodePreview component'
---

## HTML Preview

<CodePreview lang="html">
{`<div class="flex gap-2 p-4">
  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Primary
  </button>
  <button class="border border-neutral-300 px-4 py-2 rounded hover:bg-neutral-100">
    Secondary
  </button>
</div>`}
</CodePreview>

## JSX Preview (string)

<CodePreview lang="jsx">
{`export default function Card() {
  return (
    <div className="p-6 rounded-lg border border-neutral-200 max-w-sm">
      <h3 className="text-lg font-semibold">Card Title</h3>
      <p className="text-neutral-600 mt-2">Card description goes here.</p>
    </div>
  )
}`}
</CodePreview>

## React Component Preview

<CodePreview lang="jsx" code={`<button className="bg-green-500 text-white px-4 py-2 rounded">React Button</button>`}>
  <button className="bg-green-500 text-white px-4 py-2 rounded">React Button</button>
</CodePreview>
```

**Step 2: Start dev server and verify**

```bash
pnpm dev
```

Visit `http://localhost:3000/blog/test-code-preview` and verify:
1. HTML preview renders correctly on the right
2. JSX string preview shows transformed HTML
3. React component preview renders the actual button
4. Source code is syntax highlighted on the left
5. Copy button works
6. Responsive layout works (mobile stacked, desktop side-by-side)

**Step 3: Remove test post and commit**

```bash
rm blog/test-code-preview.mdx
git add -A
git commit -m "feat: verify CodePreview and clean up test post"
```

---

### Task 4: Build verification

**Step 1: Run production build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

**Step 2: Commit if any fixes were needed**
