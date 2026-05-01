'use client'

import { monoStyle } from './terminal-header'

type Props = {
  onClick: () => void
  spinKey: number
}

export function ReloadButton({ onClick, spinKey }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='absolute top-2 right-2 z-10 inline-flex items-center justify-center w-7 h-7 rounded-md text-base leading-none bg-white/85 backdrop-blur-sm border border-neutral-200 shadow-sm text-neutral-500 hover:text-amber-700 hover:border-neutral-300 hover:bg-neutral-100 active:scale-90 transition-all outline-none'
      style={monoStyle}
      aria-label='Reload preview'
      title='Reload preview'
    >
      <span
        key={spinKey}
        className='inline-block transition-colors'
        style={{
          animation:
            spinKey > 0
              ? 'reloadSpin 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              : undefined,
        }}
      >
        ↻
      </span>
    </button>
  )
}
