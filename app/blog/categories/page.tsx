import { getAllCategories } from '@/app/blog/utils'
import { PageHeader, StickyNote } from '@/components/paper'

export const metadata = {
  title: '分类',
  description: '按分类浏览文章',
}

const tilts = [-1.4, 0.8, -0.4]

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <section>
      <PageHeader eyebrow="按主题翻" title="分类" sub={`${categories.length} 个分类，每篇文章只属于一个。`} />
      <div className="grid grid-cols-2 gap-[18px] sm:grid-cols-4">
        {categories.map(({ category, count }, i) => (
          <StickyNote
            key={category}
            href={`/blog/categories/${encodeURIComponent(category)}`}
            tilt={tilts[i % tilts.length]}
            className="px-4 pb-4"
          >
            <b className="block text-[17px] font-semibold text-ink">{category}</b>
            <span className="mt-2 block font-hand text-[30px] leading-none text-muted">{count} 篇</span>
          </StickyNote>
        ))}
      </div>
    </section>
  )
}
