'use client'

import { motion, AnimatePresence, stagger } from 'motion/react'
import { themes } from 'prism-react-renderer'
import * as React from 'react'
import { useState } from 'react'
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live'
import { ReloadButton } from './reload-button'

type Props = {
  jsx: string
  scope?: Record<string, unknown>
  noInline?: boolean
  isDark?: boolean
  height: number
  bg?: string
}

const tabBtnClass = (selected: boolean) =>
  `px-4 py-2 font-medium transition-colors outline-none ${
    selected
      ? 'text-ink border-b-2 border-ink -mb-px'
      : 'hover:text-ink'
  }`

// Default scope available in every JSX Playground — saves ceremony in MDX.
const DEFAULT_SCOPE = {
  motion,
  AnimatePresence,
  stagger,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useReducer: React.useReducer,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  React,
}

export default function PlaygroundReact({ jsx, scope, noInline = false, isDark = false, height, bg }: Props) {
  const theme = isDark ? themes.oneDark : themes.oneLight
  const mergedScope = { ...DEFAULT_SCOPE, ...scope }
  const [mobileView, setMobileView] = useState<'code' | 'preview'>('code')
  const [reloadKey, setReloadKey] = useState(0)
  return (
    <LiveProvider code={jsx.trim()} scope={mergedScope} noInline={noInline} theme={theme}>
      <div className='border-b border-line text-xs text-muted'>
        <div className='flex md:grid md:grid-cols-2'>
          <div className='flex md:border-r border-line'>
            <button
              type="button"
              onClick={() => setMobileView('code')}
              className={tabBtnClass(mobileView === 'code')}
            >
              Code <span className='ml-2 font-mono text-faint'>jsx</span>
            </button>
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
          className={`${mobileView === 'preview' ? 'hidden' : ''} md:block md:border-r border-line bg-paper text-[13px] leading-relaxed font-mono overflow-auto`}
          style={{ maxHeight: height }}
        >
          <LiveEditor className='!bg-transparent' />
        </div>
        <div
          className={`${mobileView === 'code' ? 'hidden' : 'flex'} md:flex relative p-4 bg-white flex-col items-center justify-center gap-3 overflow-auto`}
          style={{ maxHeight: height, backgroundColor: bg }}
        >
          <ReloadButton
            onClick={() => setReloadKey((k) => k + 1)}
            spinKey={reloadKey}
          />
          <div key={reloadKey} className='contents'>
            <LivePreview />
          </div>
          <LiveError className='w-full text-red-500 text-xs whitespace-pre-wrap font-mono text-left' />
        </div>
      </div>
    </LiveProvider>
  )
}
