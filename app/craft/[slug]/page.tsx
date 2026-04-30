import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { AnimateIn } from '@/components/animate-in'
import { baseUrl } from '@/app/sitemap'
import { getCraftItem, getCraftItems } from '../utils'

export async function generateStaticParams() {
  return getCraftItems().map((item) => ({ slug: item.slug }))
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const item = getCraftItem(slug)
  if (!item) return
  const ogImage = item.thumb ? `${baseUrl}${item.thumb}` : undefined
  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      type: 'article',
      url: `${baseUrl}/craft/${item.slug}`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function CraftDetail({ params }: PageProps) {
  const { slug } = await params
  const item = getCraftItem(slug)
  if (!item) notFound()

  return (
    <section>
      <AnimateIn>
        <div className="not-prose">
          <CustomMDX source={item.content} format={item.format} />
        </div>
      </AnimateIn>
    </section>
  )
}
