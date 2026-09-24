import Link from 'next/link'
import { FaviconAnimationPreview } from '@/components/craft/favicon-animation-preview'
import { PageHeader } from '@/components/paper'
import { getCraftItems } from './utils'

// 每个 craft 可以注册自己的 live preview 组件，用 slug 做 key。
// 没注册的回落到 thumb 图，再回落到空白点阵。
const LIVE_PREVIEWS: Record<string, () => React.ReactElement> = {
  'favicon-animation': FaviconAnimationPreview,
}

export const metadata = {
  title: 'Craft',
  description: '随手做的 demo 和小实验',
}

export default function Page() {
  const items = getCraftItems()

  return (
    <section>
      <PageHeader eyebrow="做着玩的" title="Craft" sub="交互和动效的小实验，每个都能直接上手玩。" />

      {items.length === 0 ? (
        <p className="text-muted">还没有作品</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2">
          {items.map((item) => {
            const LivePreview = LIVE_PREVIEWS[item.slug]
            return (
              <li key={item.slug}>
                <Link href={`/craft/${item.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[4px_18px_6px_16px/16px_6px_18px_4px] border border-line bg-card bg-[radial-gradient(var(--line-strong)_0.7px,transparent_0.7px)] bg-size-[12px_12px] transition-colors group-hover:border-line-strong">
                    {LivePreview ? (
                      <LivePreview />
                    ) : (
                      item.thumb && (
                        /* biome-ignore lint/performance/noImgElement: 站点为静态导出且 images.unoptimized，next/image 无收益 */
                        <img
                          src={item.thumb}
                          alt={item.title}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                        />
                      )
                    )}
                  </div>
                  <div className="mt-3.5 flex items-baseline justify-between gap-3">
                    <h2 className="text-[17px] font-semibold text-ink decoration-faint decoration-wavy decoration-1 underline-offset-[5px] group-hover:underline">
                      {item.title}
                    </h2>
                    {item.year && (
                      <span className="shrink-0 font-hand text-[22px] text-muted tabular-nums">{item.year}</span>
                    )}
                  </div>
                  {item.description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
