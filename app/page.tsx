import Link from 'next/link'
import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'

export default function Page() {
  return (
    <section>
      <AnimateIn>
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          popring
        </h1>
      </AnimateIn>
      <AnimateIn delay={1}>
        <p className="mb-4">
          {`前端开发者，关注 Web 技术与开发体验。喜欢探索新工具、记录学习过程、分享实践经验。`}
        </p>
      </AnimateIn>
      <AnimateIn delay={2}>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          探索、记录、分享
        </p>
      </AnimateIn>
      <AnimateIn delay={3}>
        <blockquote className="my-6 border-l-2 border-neutral-300 dark:border-neutral-600 pl-4 text-neutral-600 dark:text-neutral-400 italic">
          "世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。" ——罗曼·罗兰
        </blockquote>
        <div className="flex gap-4 text-sm mb-8">
          <a
            href="https://bento.me/popring"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            bento.me ↗
          </a>
          <Link
            href="/blog/2025-nian-du-shu-bi-ji-hui-zong"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            读书笔记 →
          </Link>
        </div>
      </AnimateIn>
      <AnimateIn delay={3} className="my-8">
        <BlogPosts limit={5} />
      </AnimateIn>
    </section>
  )
}
