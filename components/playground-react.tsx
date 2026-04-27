'use client'

import { motion, AnimatePresence } from 'motion/react'
import { themes } from 'prism-react-renderer'
import * as React from 'react'
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live'

type Props = {
  jsx: string
  scope?: Record<string, unknown>
  noInline?: boolean
  isDark?: boolean
}

// Default scope available in every JSX Playground — saves ceremony in MDX.
const DEFAULT_SCOPE = {
  motion,
  AnimatePresence,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useReducer: React.useReducer,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  React,
}

export default function PlaygroundReact({ jsx, scope, noInline = false, isDark = false }: Props) {
  const theme = isDark ? themes.oneDark : themes.oneLight
  const mergedScope = { ...DEFAULT_SCOPE, ...scope }
  return (
    <LiveProvider code={jsx.trim()} scope={mergedScope} noInline={noInline} theme={theme}>
      <div className='grid grid-cols-2 border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400'>
        <div className='px-4 py-2 font-medium border-r border-neutral-200 dark:border-neutral-800'>
          Code <span className='ml-2 text-neutral-400 dark:text-neutral-500'>jsx</span>
        </div>
        <div className='px-4 py-2 font-medium'>Preview</div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='md:border-r border-b md:border-b-0 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-[13px] leading-relaxed font-mono overflow-auto max-h-80'>
          <LiveEditor className='!bg-transparent' />
        </div>
        <div className='p-4 bg-white dark:bg-neutral-100 flex flex-col items-center justify-center gap-3 overflow-auto max-h-80'>
          <LivePreview />
          <LiveError className='w-full text-red-500 text-xs whitespace-pre-wrap font-mono text-left' />
        </div>
      </div>
    </LiveProvider>
  )
}
