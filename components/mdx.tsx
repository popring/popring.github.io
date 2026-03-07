import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React, { ComponentProps } from 'react'
import { CopyButton } from './copy-button'
import { CodePreview } from './code-preview'
import { ZoomableImage } from './zoomable-image'
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

function Pre({ children, ...props }: { children: React.ReactElement<{ children: string }> }) {
  const codeString = children?.props?.children || ''
  return (
    <div className="relative group">
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

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children)
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
      }}
      components={{ ...components, ...(rest.components || {}) }}
    />
  )
}
