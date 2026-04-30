import { type ReactNode } from 'react'

const monoFont = {
  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
}

type TerminalHeaderProps = {
  path: string
  count?: number | string
  comment?: ReactNode
}

export function TerminalHeader({ path, count, comment }: TerminalHeaderProps) {
  const countLabel =
    typeof count === 'number' ? String(count).padStart(2, '0') : count

  return (
    <header className="mb-10">
      <div
        className="flex items-baseline justify-between mb-1.5"
        style={monoFont}
      >
        <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 tracking-tight flex items-baseline">
          {path}
          <span
            aria-hidden
            className="ml-1.5 inline-block w-[0.5em] h-[1em] translate-y-[0.12em] bg-amber-600 dark:bg-amber-400 animate-pulse"
          />
        </h1>
        {countLabel !== undefined && (
          <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
            [{countLabel}]
          </span>
        )}
      </div>
      {comment && (
        <p
          className="text-sm text-neutral-500 dark:text-neutral-400"
          style={monoFont}
        >
          <span className="text-neutral-400 dark:text-neutral-600">{'//'}</span>{' '}
          {comment}
        </p>
      )}
    </header>
  )
}

export const monoStyle = monoFont
