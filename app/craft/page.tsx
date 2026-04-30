import Link from 'next/link'
import { AnimateIn } from '@/components/animate-in'
import { getCraftItems } from './utils'

export const metadata = {
  title: 'Craft',
  description: '随手做的 demo 和小实验',
}

const monoFont = {
  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
}

export default function Page() {
  const items = getCraftItems()
  const count = String(items.length).padStart(2, '0')

  return (
    <section>
      <AnimateIn>
        <header className="mb-10">
          <div
            className="flex items-baseline justify-between mb-1.5"
            style={monoFont}
          >
            <h1 className="text-2xl text-neutral-900 dark:text-neutral-100 tracking-tight flex items-baseline">
              ~/craft
              <span
                aria-hidden
                className="ml-1.5 inline-block w-[0.5em] h-[1em] translate-y-[0.12em] bg-amber-600 dark:bg-amber-400 animate-pulse"
              />
            </h1>
            <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
              [{count}]
            </span>
          </div>
          <p
            className="text-sm text-neutral-500 dark:text-neutral-400"
            style={monoFont}
          >
            <span className="text-neutral-400 dark:text-neutral-600">//</span>{' '}
            随手做的 demo 和小实验
          </p>
        </header>
      </AnimateIn>

      <AnimateIn delay={1}>
        {items.length === 0 ? (
          <p
            className="text-sm text-neutral-500 dark:text-neutral-400"
            style={monoFont}
          >
            <span className="text-neutral-400 dark:text-neutral-600">//</span>{' '}
            还没有作品
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, idx) => {
              const num = String(idx + 1).padStart(2, '0')
              return (
                <li key={item.slug}>
                  <Link
                    href={`/craft/${item.slug}`}
                    className="group block rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950 hover:border-amber-500/60 dark:hover:border-amber-400/40 transition-colors"
                  >
                    <div className="relative aspect-[8/5] bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
                      {item.thumb ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.thumb}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center text-neutral-400 dark:text-neutral-700"
                          style={{
                            backgroundImage:
                              'radial-gradient(currentColor 0.6px, transparent 0.6px)',
                            backgroundSize: '10px 10px',
                          }}
                        >
                          <span
                            className="text-[11px] bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 rounded text-neutral-500 dark:text-neutral-500"
                            style={monoFont}
                          >
                            <span className="text-neutral-400 dark:text-neutral-600">
                              //
                            </span>{' '}
                            no preview
                          </span>
                        </div>
                      )}
                      <span
                        className="absolute top-2 left-2 text-[10px] text-neutral-600 dark:text-neutral-400 bg-white/85 dark:bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-sm tabular-nums shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                        style={monoFont}
                      >
                        {num}
                      </span>
                    </div>

                    <div className="p-3 flex items-baseline justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors truncate">
                          <span
                            className="text-neutral-300 dark:text-neutral-700 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mr-1"
                            style={monoFont}
                          >
                            {'>'}
                          </span>
                          {item.title}
                        </h2>
                        <p
                          className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-0.5 truncate"
                          style={monoFont}
                        >
                          {item.slug}
                        </p>
                      </div>
                      {item.year && (
                        <span
                          className="text-[11px] text-neutral-400 dark:text-neutral-600 tabular-nums shrink-0"
                          style={monoFont}
                        >
                          {item.year}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </AnimateIn>
    </section>
  )
}
