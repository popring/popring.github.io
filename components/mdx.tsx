import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React, { ComponentProps } from 'react'
import { CopyButton } from './copy-button'
import { CodePreview } from './code-preview'
import { Playground } from './playground'
import { ZoomableImage } from './zoomable-image'
import { FaviconAnimationDemo } from './craft/favicon-animation-demo'
import remarkGfm from 'remark-gfm'

function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props: { href: string; children: React.ReactNode }) {
  const href = props.href

  if (href.startsWith('/')) {
    return (
      <Link {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: { src: string; alt: string }) {
  return <ZoomableImage src={props.src} alt={props.alt} />
}

function Code({ children, ...props }: { children: string }) {
  const codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function TableWrapper(props: React.ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  )
}

function Pre({ children, ...props }: { children: React.ReactElement<{ children: string; className?: string }> }) {
  const codeString = children?.props?.children || ''
  const className = children?.props?.className || ''
  const language = className.replace(/language-/, '')
  return (
    <div className="relative group">
      {language && (
        <span className="absolute right-10 top-0 z-10 rounded-b-md bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 select-none">
          {language}
        </span>
      )}
      <CopyButton text={codeString} />
      <pre {...props}>
        {children}
      </pre>
    </div>
  )
}

export function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\p{L}\p{N}\-]+/gu, '') // Keep all Unicode letters/numbers and hyphens
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 标题里有 inline code（`foo`）等子元素时，children 是 React 数组而不是 string。
// 直接 slugify 数组会经 toString() 变成 "[object Object]"。这里递归扁平出纯文本。
function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props
    return extractText(props?.children)
  }
  return ''
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(extractText(children))
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

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
  Playground,
  FaviconAnimationDemo,
}

export function CustomMDX(props: ComponentProps<typeof MDXRemote> & { format?: 'md' | 'mdx' }) {
  const { format = 'md', ...rest } = props
  return (
    <MDXRemote
      {...rest}
      options={{
        mdxOptions: {
          format,
          remarkPlugins: [remarkGfm],
        },
        // next-mdx-remote v6 blocks JSX/JS in MDX by default. We trust our own
        // blog content, so allow it; keep blockDangerousJS on to still block
        // eval/Function/require globals.
        blockJS: false,
      }}
      components={{ ...components, ...(rest.components || {}) }}
    />
  )
}
