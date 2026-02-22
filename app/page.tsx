import Link from 'next/link'
import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'

function GitHubIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  )
}

export default function Page() {
  return (
    <section>
      {/* Hero */}
      <AnimateIn>
        <h1 className="mb-2 text-2xl font-semibold tracking-tighter">
          popring
        </h1>
      </AnimateIn>
      <AnimateIn delay={1}>
        <p className="mb-4">
          全栈工程师，写代码也写博客。从前端一路走来，现在对 AI
          能改变什么充满好奇——正在探索它在开发、产品和日常生活中的各种可能性。相信好的技术值得被记录和分享，欢迎找我聊聊。
        </p>
        <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
          <a
            href="https://github.com/popring"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://x.com/Harry5Sea"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
            aria-label="X (Twitter)"
          >
            <XIcon />
          </a>
        </div>
      </AnimateIn>

      {/* 最近文章 */}
      <AnimateIn delay={2} className="my-8">
        <BlogPosts limit={5} />
      </AnimateIn>

      {/* 推荐阅读 */}
      <AnimateIn delay={3}>
        <h2 className="mt-8 mb-4 text-lg font-medium tracking-tight">推荐阅读</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>
            <a
              href="https://book.douban.com/subject/5325618/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-2 hover:decoration-neutral-500 dark:hover:decoration-neutral-400 transition-all"
            >
              高效能人士的七个习惯
            </a>
          </li>
          <li>
            前端技术书指引 →{' '}
            <a
              href="https://www.douban.com/doulist/160109862/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-2 hover:decoration-neutral-500 dark:hover:decoration-neutral-400 transition-all"
            >
              豆瓣
            </a>
          </li>
          <li>
            我的读书笔记 →{' '}
            <Link
              href="/blog/2025-reading-notes"
              className="underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-2 hover:decoration-neutral-500 dark:hover:decoration-neutral-400 transition-all"
            >
              2025 年读书笔记汇总
            </Link>
          </li>
        </ul>
      </AnimateIn>

      {/* 座右铭 */}
      <AnimateIn delay={3}>
        <h2 className="mt-8 mb-4 text-lg font-medium tracking-tight">座右铭</h2>
        <blockquote className="my-4 border-l-2 border-neutral-300 dark:border-neutral-600 pl-4 text-neutral-600 dark:text-neutral-400 italic">
          "这个时代缺的不是完美的人，缺的是从自己心底里给出的，真心、正义、无畏和同情。" ——无问西东
        </blockquote>
        <blockquote className="my-4 border-l-2 border-neutral-300 dark:border-neutral-600 pl-4 text-neutral-600 dark:text-neutral-400 italic">
          "技术是给业务赋能的，而业务是给用户赋能的。"
        </blockquote>
        <blockquote className="my-4 border-l-2 border-neutral-300 dark:border-neutral-600 pl-4 text-neutral-600 dark:text-neutral-400 italic">
          "世上只有一种英雄主义，就是在认清生活真相之后依然热爱生活。" ——罗曼·罗兰
        </blockquote>
      </AnimateIn>
    </section>
  )
}
