'use client'

type Props = {
  onClick: () => void
  spinKey: number
}

export function ReloadButton({ onClick, spinKey }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='absolute top-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-lg border border-line bg-card font-mono text-base leading-none text-muted shadow-note outline-none transition-colors hover:text-ink active:scale-90'
      aria-label='Reload preview'
      title='Reload preview'
    >
      <span
        key={spinKey}
        className='inline-block'
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
