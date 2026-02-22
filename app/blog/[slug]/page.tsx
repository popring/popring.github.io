import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomMDX, slugify } from '@/components/mdx';
import { formatDate, getBlogPosts, getReadingStats } from '@/app/blog/utils';
import { baseUrl } from '@/app/sitemap';
import { AnimateIn } from '@/components/animate-in';
import { GiscusComments } from '@/components/giscus';
import { TableOfContents } from '@/components/toc';

function getHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; slug: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      slug: slugify(match[2]),
    });
  }
  return headings;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image ? image : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function Blog({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : undefined,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'popring',
            },
          }),
        }}
      />
      <AnimateIn>
        <h1 className='title font-semibold text-2xl tracking-tighter'>
          {post.metadata.title}
        </h1>
      </AnimateIn>
      <AnimateIn delay={1}>
        <div className='flex justify-between items-center mt-2 mb-8 text-sm'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            {formatDate(post.metadata.publishedAt)}
            {(() => {
              const { wordCount, readingTime } = getReadingStats(post.content)
              return ` · ${wordCount}字 · ${readingTime}分钟阅读`
            })()}
          </p>
        </div>
      </AnimateIn>
      <div className='relative'>
        {(() => {
          const headings = getHeadings(post.content);
          if (headings.length === 0) return null;
          return <TableOfContents headings={headings} />;
        })()}
        <AnimateIn delay={2}>
          <article className='prose'>
            <CustomMDX source={post.content} />
          </article>
        </AnimateIn>
      </div>
      {(post.metadata.category || (post.metadata.tags && post.metadata.tags.length > 0)) && (
        <div className='mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800'>
          <div className='flex flex-wrap items-center gap-2 text-sm'>
            {post.metadata.category && (
              <Link
                href={`/blog/categories/${encodeURIComponent(post.metadata.category)}`}
                className='text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors'
              >
                {post.metadata.category}
              </Link>
            )}
            {post.metadata.category && post.metadata.tags && post.metadata.tags.length > 0 && (
              <span className='text-neutral-300 dark:text-neutral-700'>|</span>
            )}
            {post.metadata.tags?.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className='rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-0.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors'
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
      <GiscusComments />
    </section>
  );
}
