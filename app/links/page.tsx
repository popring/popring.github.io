import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '友情链接',
  description: '友情链接 - 交换友链',
}

const links = [
  {
    name: '刷新',
    url: 'https://home.shuaxinjs.cn/',
    avatar: 'https://avatars.githubusercontent.com/u/32100575?v=4',
    description: '刷新的个人主页',
  },
  {
    name: '大橙子',
    url: 'https://log.660066.xyz/',
    avatar: 'https://log.660066.xyz/about/index/avatar.jpg',
    description: '新的斗争开始了',
  },
]

// 给友链外跳带上标准 UTM，朋友的 GA / Plausible / Umami 都能识别。
// 已存在的 utm_source 不覆盖（比如对方提供的 URL 自己已经带了追踪）。
function withUTM(url: string): string {
  const u = new URL(url)
  if (!u.searchParams.has('utm_source')) {
    u.searchParams.set('utm_source', 'popring.cn')
    u.searchParams.set('utm_medium', 'blogroll')
  }
  return u.toString()
}

export default function LinksPage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        友情链接
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.url}
            href={withUTM(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-sm"
          >
            <Image
              src={link.avatar}
              alt={link.name}
              width={48}
              height={48}
              className="rounded-full transition-transform group-hover:scale-110"
            />
            <div className="min-w-0">
              <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {link.name}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-12 text-sm text-neutral-500 dark:text-neutral-400">
        <p className="mb-4">交换友链</p>
        <p className="mb-3">
          欢迎留言或发送邮件到{' '}
          <a
            href="mailto:koler778@gmail.com"
            className="underline hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            koler778@gmail.com
          </a>
        </p>
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-1 font-mono text-xs">
          <p><span className="text-neutral-400">站点名称：</span>popring</p>
          <p><span className="text-neutral-400">站点地址：</span>https://popring.cn</p>
          <p><span className="text-neutral-400">头像：</span>https://popring.cn/avatar.jpg</p>
          <p><span className="text-neutral-400">描述：</span>前端出身，向全栈延伸，探索技术与增长的交叉地带</p>
        </div>
      </div>
    </section>
  )
}
