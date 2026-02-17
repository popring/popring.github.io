import Link from 'next/link'
import { AnimateIn } from '@/components/animate-in'

export default function NotFound() {
  return (
    <AnimateIn>
      <section>
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          404 - 页面未找到
        </h1>
        <p className="mb-4">你访问的页面不存在。</p>
        <Link
          href="/"
          className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors underline underline-offset-2"
        >
          返回首页
        </Link>
      </section>
    </AnimateIn>
  )
}
