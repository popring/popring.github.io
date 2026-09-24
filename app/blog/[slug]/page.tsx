import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomMDX, createSlugger } from '@/components/mdx';
import { formatDate, getBlogPosts, getReadingStats } from '@/app/blog/utils';
import { baseUrl } from '@/app/sitemap';
import { ArrowShort } from '@/components/doodle';
import { GiscusComments } from '@/components/giscus';
import { StickyNote } from '@/components/paper';
import { TableOfContents } from '@/components/toc';

function getHeadings(content: string) {
  // 去掉围栏代码块，避免代码里的 # 注释被当成标题。
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  // 扫描全部级别并共用 slugger，使去重计数与 MDX 渲染时的标题 id 完全对齐，
  // 只把 h2/h3 放进目录。
  const slugger = createSlugger();
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string; slug: string }[] = [];
  for (const match of withoutCode.matchAll(headingRegex)) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = slugger(text);
    if (level === 2 || level === 3) {
      headings.push({ level, text, slug });
    }
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
    updatedAt,
    summary: description,
    image,
    tags,
  } = post.metadata;
  const ogImage = image || '/og-default.png';

  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: PageProps) {
  const { slug } = await params;
  const posts = getBlogPosts().sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  const index = posts.findIndex((post) => post.slug === slug);
  const post = posts[index];

  if (!post) {
    notFound();
  }

  // 列表按新到旧排：前一项更新（下一篇），后一项更旧（上一篇）
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const { category, tags, publishedAt } = post.metadata;
  const { wordCount, readingTime } = getReadingStats(post.content);
  const headings = getHeadings(post.content);
  const date = formatDate(publishedAt);

  return (
    <section className='mx-auto w-full max-w-[680px]'>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.updatedAt || post.metadata.publishedAt,
            description: post.metadata.summary,
            keywords: post.metadata.tags?.join(', '),
            image: `${baseUrl}${post.metadata.image || '/og-default.png'}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'popring',
            },
          }),
        }}
      />
      <Link
        href='/blog'
        className='mb-7 inline-flex items-center gap-1.5 font-hand text-[22px] text-muted transition-colors hover:text-ink'
      >
        <ArrowShort className='h-3.5 w-[30px] -scale-x-100' />
        回到文章
      </Link>
      <p className='mb-2.5 flex flex-wrap gap-x-4 gap-y-1 font-hand text-[22px] text-muted tabular-nums'>
        {category && (
          <Link
            href={`/blog/categories/${encodeURIComponent(category)}`}
            className='transition-colors hover:text-ink'
          >
            {category}
          </Link>
        )}
        <span>{date}</span>
      </p>
      <h1 className='mb-4 text-[clamp(30px,5.2vw,42px)] font-bold leading-[1.25] tracking-[-0.035em] text-balance text-ink'>
        {post.metadata.title}
      </h1>
      <p className='mb-10 text-sm text-faint tabular-nums'>
        {wordCount} 字 · {readingTime} 分钟读完
      </p>
      <div className='relative'>
        {headings.length > 0 && <TableOfContents headings={headings} />}
        <article className='prose'>
          <CustomMDX source={post.content} format={post.metadata.format} />
        </article>
      </div>
      <div className='mt-16 grid gap-7'>
        {tags && tags.length > 0 && (
          <div className='flex flex-wrap gap-2.5'>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className='tape-tag inline-block bg-tape px-3 py-1 text-sm text-ink'
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <p className='text-right font-hand text-2xl text-muted'>
          写于 {date}
          <b className='ml-1.5 text-[32px] font-bold text-ink'>Harry</b>
        </p>
        {(older || newer) && (
          <nav aria-label='上下篇' className='grid gap-5 sm:grid-cols-2'>
            {older && (
              <StickyNote href={`/blog/${older.slug}`} tilt={-1}>
                <span className='block font-hand text-[21px] text-muted'>← 上一篇</span>
                <span className='text-[15px] font-semibold leading-normal text-ink'>{older.metadata.title}</span>
              </StickyNote>
            )}
            {newer && (
              <StickyNote
                href={`/blog/${newer.slug}`}
                tilt={1}
                className='text-right sm:col-start-2'
              >
                <span className='block font-hand text-[21px] text-muted'>下一篇 →</span>
                <span className='text-[15px] font-semibold leading-normal text-ink'>{newer.metadata.title}</span>
              </StickyNote>
            )}
          </nav>
        )}
        <section aria-labelledby='comments-title' className='rounded-[14px] border-[1.5px] border-dashed border-line-strong p-4 sm:p-6'>
          <h2 id='comments-title' className='mb-3 font-hand text-[26px] text-ink'>
            留言
          </h2>
          <GiscusComments />
        </section>
      </div>
    </section>
  );
}
