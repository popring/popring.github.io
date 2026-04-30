'use client'

import dynamic from 'next/dynamic'
import { Highlight, themes, type PrismTheme } from 'prism-react-renderer'
import { useMemo, useState } from 'react'
import Editor from 'react-simple-code-editor'
import { useDarkMode } from './use-dark-mode'

const PlaygroundReact = dynamic(() => import('./playground-react'), {
  ssr: false,
  loading: () => <Skeleton label='jsx' />,
})

type ReactProps = {
  jsx: string
  scope?: Record<string, unknown>
  noInline?: boolean
}

type HtmlProps = {
  html: string
  css?: string
  js?: string
}

export type PlaygroundProps = ReactProps | HtmlProps

export function Playground(props: PlaygroundProps) {
  const isDark = useDarkMode()
  return (
    <div className='not-prose my-6 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors'>
      {'jsx' in props ? (
        <PlaygroundReact {...props} isDark={isDark} />
      ) : (
        <PlaygroundHtml {...props} isDark={isDark} />
      )}
    </div>
  )
}

function Skeleton({ label }: { label: string }) {
  return (
    <>
      <div className='grid grid-cols-2 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400'>
        <div className='px-4 py-2 font-medium border-r border-neutral-200 dark:border-neutral-800'>
          Code <span className='ml-2 text-neutral-400 dark:text-neutral-500'>{label}</span>
        </div>
        <div className='px-4 py-2 font-medium'>Preview</div>
      </div>
      <div className='h-80 bg-neutral-50 dark:bg-neutral-900' />
    </>
  )
}

type Tab = 'html' | 'css' | 'js'

const PRISM_LANG: Record<Tab, string> = {
  html: 'markup',
  css: 'css',
  js: 'javascript',
}

function highlightCode(code: string, lang: Tab, theme: PrismTheme) {
  return (
    <Highlight code={code} language={PRISM_LANG[lang]} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line })
            return (
              <div key={i} {...lineProps}>
                {line.map((token, j) => {
                  const tokenProps = getTokenProps({ token })
                  return <span key={j} {...tokenProps} />
                })}
              </div>
            )
          })}
        </>
      )}
    </Highlight>
  )
}

const PREVIEW_BASE_CSS = `
html, body { margin: 0; }
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Helvetica Neue", sans-serif;
}
`

function PlaygroundHtml({ html, css, js, isDark }: HtmlProps & { isDark: boolean }) {
  const [htmlCode, setHtmlCode] = useState(html.trim())
  const [cssCode, setCssCode] = useState(css?.trim() ?? '')
  const [jsCode, setJsCode] = useState(js?.trim() ?? '')

  const tabs = useMemo<Tab[]>(() => {
    const list: Tab[] = ['html']
    if (css !== undefined) list.push('css')
    if (js !== undefined) list.push('js')
    return list
  }, [css, js])

  const [active, setActive] = useState<Tab>('html')
  const [mobileView, setMobileView] = useState<'code' | 'preview'>('code')

  const srcDoc = useMemo(
    () =>
      `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${PREVIEW_BASE_CSS}</style><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`,
    [htmlCode, cssCode, jsCode]
  )

  const value = active === 'html' ? htmlCode : active === 'css' ? cssCode : jsCode
  const setValue = active === 'html' ? setHtmlCode : active === 'css' ? setCssCode : setJsCode
  const theme = isDark ? themes.oneDark : themes.oneLight

  const tabBtnClass = (selected: boolean) =>
    `px-4 py-2 font-medium transition-colors outline-none ${
      selected
        ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 -mb-px'
        : 'hover:text-neutral-700 dark:hover:text-neutral-300'
    }`

  return (
    <>
      <div className='border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400'>
        <div className='flex md:grid md:grid-cols-2'>
          <div className='flex md:border-r border-neutral-200 dark:border-neutral-800'>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActive(t)
                  setMobileView('code')
                }}
                className={tabBtnClass(active === t && mobileView === 'code')}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setMobileView('preview')}
              className={`md:hidden ${tabBtnClass(mobileView === 'preview')}`}
            >
              preview
            </button>
          </div>
          <div className='hidden md:block px-4 py-2 font-medium'>Preview</div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div
          className={`${mobileView === 'preview' ? 'hidden' : ''} md:block md:border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-auto max-h-80`}
        >
          <Editor
            key={active}
            value={value}
            onValueChange={setValue}
            highlight={(code) => highlightCode(code, active, theme)}
            padding={16}
            tabSize={2}
            insertSpaces
            textareaClassName='!outline-none'
            preClassName='!m-0 !border-0 !rounded-none !bg-transparent !overflow-visible hover:!border-transparent'
            className='text-[13px] leading-relaxed min-h-80'
            style={{
              fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
              background: 'transparent',
            }}
          />
        </div>
        <div className={`${mobileView === 'code' ? 'hidden' : ''} md:block bg-white dark:bg-neutral-100`}>
          <iframe
            title='HTML preview'
            srcDoc={srcDoc}
            sandbox='allow-scripts'
            className='w-full h-80 border-0'
          />
        </div>
      </div>
    </>
  )
}
