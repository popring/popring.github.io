import { BlogIndex } from '@/components/posts'

export const metadata = {
  title: 'Blog',
  description: '探索、记录、分享',
}

export default function Page() {
  return <BlogIndex page={1} />
}
