import Link from 'next/link'
import { getAllCategories } from '@/app/blog/utils'

export const metadata = {
  title: '分类',
  description: '按分类浏览文章',
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">分类</h1>
      <div>
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            href={`/blog/categories/${encodeURIComponent(category)}`}
            className="flex justify-between items-center py-3 pl-3 border-l-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 transition-all group"
          >
            <span className="text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
              {category}
            </span>
            <span className="text-neutral-500 dark:text-neutral-500 text-sm">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
