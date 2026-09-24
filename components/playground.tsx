'use client'

import dynamic from 'next/dynamic'
import { Highlight, themes, type PrismTheme } from 'prism-react-renderer'
import { useMemo, useState } from 'react'
import Editor from 'react-simple-code-editor'
import { useDarkMode } from './use-dark-mode'
import { ReloadButton } from './reload-button'

const PlaygroundReact = dynamic(() => import('./playground-react'), {
  ssr: false,
  loading: () => <Skeleton label='jsx' />,
})

type CommonProps = {
  /** Pane height in px. Applies to both code editor (max-height) and preview (height). Default 320. */
  height?: number
  /** Background color of the preview pane (overrides the default bg-white). */
  bg?: string
}

type ReactProps = CommonProps & {
  jsx: string
  scope?: Record<string, unknown>
  noInline?: boolean
}

type HtmlProps = CommonProps & {
  html: string
  css?: string
  js?: string
}

export type PlaygroundProps = ReactProps | HtmlProps

export const PLAYGROUND_DEFAULT_HEIGHT = 320

export function Playground(props: PlaygroundProps) {
  const isDark = useDarkMode()
  const height = props.height ?? PLAYGROUND_DEFAULT_HEIGHT
  return (
    <div className='not-prose my-6 overflow-hidden rounded-[14px] border border-line bg-card'>
      {'jsx' in props ? (
        <PlaygroundReact {...props} isDark={isDark} height={height} />
      ) : (
        <PlaygroundHtml {...props} isDark={isDark} height={height} />
      )}
    </div>
  )
}

function Skeleton({ label }: { label: string }) {
  return (
    <>
      <div className='grid grid-cols-2 border-b border-line text-xs text-muted'>
        <div className='px-4 py-2 font-medium border-r border-line'>
          Code <span className='ml-2 font-mono text-faint'>{label}</span>
        </div>
        <div className='px-4 py-2 font-medium'>Preview</div>
      </div>
      <div
        className='bg-paper'
        style={{ height: PLAYGROUND_DEFAULT_HEIGHT }}
      />
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

function PlaygroundHtml({
  html,
  css,
  js,
  isDark,
  height,
}: HtmlProps & { isDark: boolean; height: number; bg?: string }) {
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
  const [reloadKey, setReloadKey] = useState(0)

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
        ? 'text-ink border-b-2 border-ink -mb-px'
        : 'hover:text-ink'
    }`

  return (
    <>
      <div className='border-b border-line text-xs text-muted'>
        <div className='flex md:grid md:grid-cols-2'>
          <div className='flex md:border-r border-line'>
            {tabs.map((t) => (
              <button
                type="button"
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
              type="button"
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
          className={`${mobileView === 'preview' ? 'hidden' : ''} md:block md:border-r border-line bg-paper overflow-auto`}
          style={{ maxHeight: height }}
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
            className='text-[13px] leading-relaxed'
            style={{
              fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
              background: 'transparent',
              minHeight: height,
            }}
          />
        </div>
        {/* 预览区固定白底：demo 的 HTML/CSS 是按浅色写死的，不跟主题 */}
        <div className={`${mobileView === 'code' ? 'hidden' : ''} md:block relative bg-white`}>
          <ReloadButton
            onClick={() => setReloadKey((k) => k + 1)}
            spinKey={reloadKey}
          />
          <iframe
            key={reloadKey}
            title='HTML preview'
            srcDoc={srcDoc}
            sandbox='allow-scripts'
            className='w-full border-0'
            style={{ height }}
          />
        </div>
      </div>
    </>
  )
}
