import { getBlogPosts } from '@/app/blog/utils'
import { BlogIndex } from '@/components/posts'

const PAGE_SIZE = 10

export function generateStaticParams() {
  const total = getBlogPosts().length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }))
}

export const metadata = {
  title: 'Blog',
  description: '探索、记录、分享',
}

type PageProps = {
  params: Promise<{ page: string }>
}

export default async function Page({ params }: PageProps) {
  const { page } = await params
  return <BlogIndex page={parseInt(page, 10)} pageSize={PAGE_SIZE} />
}
