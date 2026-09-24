import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/paper'

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
      <PageHeader eyebrow="朋友们" title="友链" />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.url}
            href={withUTM(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="block -rotate-[1.6deg] border border-line bg-card px-3.5 pt-3.5 pb-[18px] shadow-note transition-transform duration-250 ease-(--ease-out-strong) even:rotate-[1.4deg] hover:translate-y-[-3px] hover:rotate-0 motion-reduce:transition-none"
          >
            <Image
              src={link.avatar}
              alt={link.name}
              width={240}
              height={240}
              className="aspect-square w-full border border-line bg-paper object-cover"
            />
            <b className="mt-2.5 block truncate font-hand text-[26px] leading-[1.1] font-bold text-ink">{link.name}</b>
            <span className="block truncate text-[13px] text-muted">{link.description}</span>
          </a>
        ))}
      </div>
      <section className="mt-14 max-w-[420px]">
        <h2 className="mb-3 text-xl font-bold text-ink">交换友链</h2>
        <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
          <dt className="text-faint">站点名称</dt>
          <dd className="text-body">popring</dd>
          <dt className="text-faint">站点地址</dt>
          <dd className="break-all text-body">https://popring.cn</dd>
          <dt className="text-faint">头像</dt>
          <dd className="break-all text-body">https://popring.cn/avatar.jpg</dd>
          <dt className="text-faint">描述</dt>
          <dd className="text-body">AI 公司做增长的全栈工程师，既对技术本身好奇，也关心它怎么真的改变产品与增长</dd>
        </dl>
        <p className="text-[15px] text-body">
          欢迎留言或发邮件到{' '}
          <a
            href="mailto:koler778@gmail.com"
            className="font-mono text-sm text-ink underline decoration-faint underline-offset-4 select-all hover:decoration-wavy"
          >
            koler778@gmail.com
          </a>
        </p>
      </section>
    </section>
  )
}
