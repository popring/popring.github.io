import { getAllCategories, getPostsByCategory } from '@/app/blog/utils'
import { TermPosts } from '@/components/posts'

export async function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({
    category,
  }))
}

type PageProps = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  return {
    title: `分类: ${decoded}`,
    description: `${decoded} 分类下的所有文章`,
    keywords: [decoded],
    alternates: { canonical: `/blog/categories/${encodeURIComponent(decoded)}` },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  return <TermPosts kind="分类" name={decoded} backHref="/blog/categories" posts={getPostsByCategory(decoded)} />
}
