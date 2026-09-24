import { getAllTags, getPostsByTag } from '@/app/blog/utils'
import { TermPosts } from '@/components/posts'

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({
    tag,
  }))
}

type PageProps = {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  return {
    title: `标签: ${decoded}`,
    description: `${decoded} 标签下的所有文章`,
    keywords: [decoded],
    alternates: { canonical: `/blog/tags/${encodeURIComponent(decoded)}` },
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  return <TermPosts kind="标签" name={decoded} backHref="/blog/tags" posts={getPostsByTag(decoded)} />
}
