import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'

export const metadata = {
  title: 'Blog',
  description: '探索、记录、分享',
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)

  return (
    <section>
      <AnimateIn>
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">文章</h1>
      </AnimateIn>
      <AnimateIn delay={1}>
        <BlogPosts page={currentPage} pageSize={10} />
      </AnimateIn>
    </section>
  )
}
