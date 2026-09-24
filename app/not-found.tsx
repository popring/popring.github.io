import Link from 'next/link'
import { DrawIn } from '@/components/animate-in'
import { Face } from '@/components/doodle'

const btn =
  'inline-flex h-11 items-center rounded-[14px_10px_16px_9px/10px_15px_9px_14px] border-[1.5px] border-ink px-5 text-[15px] font-semibold transition-transform duration-150 active:scale-[0.97]'

export default function NotFound() {
  return (
    <section className="py-10 text-center">
      <div className="relative mx-auto size-[200px] text-ink">
        <DrawIn className="block size-full">
          <Face className="size-full" />
        </DrawIn>
        <span aria-hidden="true" className="absolute -top-1.5 -right-7 rotate-12 font-hand text-[64px] leading-none text-muted">
          ?
        </span>
      </div>
      <h1 className="mt-4 text-[clamp(64px,14vw,120px)] font-bold leading-none tracking-[-0.06em] text-ink">404</h1>
      <p className="mt-3 mb-8 text-[17px] text-body">这一页不在本子上，可能是链接写错了。</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={`${btn} bg-inv text-inv-ink`}>
          回首页
        </Link>
        <Link href="/blog" className={`${btn} text-ink`}>
          去看文章
        </Link>
      </div>
    </section>
  )
}
