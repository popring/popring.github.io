import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '友情链接',
  description: '友情链接 - 交换友链',
}

const links = [
  {
    name: '刷新',
    url: 'https://home.shuaxinjs.cn/',
    avatar: 'https://github.com/shuaxinjs.png',
    description: '刷新的个人主页',
  },
]

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
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-sm"
          >
            <img
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
        <p className="mb-2">交换友链</p>
        <p>
          欢迎留言或发送邮件到{' '}
          <a
            href="mailto:koler778@gmail.com"
            className="underline hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            koler778@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}
