import { BlogPosts } from '@/components/posts'
import { AnimateIn } from '@/components/animate-in'

export const metadata = {
  title: 'Blog',
  description: '探索、记录、分享',
}

export default function Page() {
  return (
    <section>
      <AnimateIn>
        <h1 className="font-semibold text-2xl mb-8 tracking-tighter">文章</h1>
      </AnimateIn>
      <AnimateIn delay={1}>
        <BlogPosts />
      </AnimateIn>
    </section>
  )
}
