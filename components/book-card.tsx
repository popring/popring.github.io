import React from 'react'
import { monoStyle } from './terminal-header'

interface BookCardProps {
  /** 书名，含副标题，自带书名号 */
  title: string
  /** 作者，含国别前缀，如 "[美] 芭芭拉·明托" */
  author: string
  /** 译者 */
  translator?: string
  /** 出版社 */
  publisher?: string
  /** 出版年 */
  year?: string | number
  /** 一句话简介 */
  description?: string
  /** 豆瓣评分，如 8.3 */
  rating?: number
  /** 评价人数，已格式化的字符串，如 "19.2万" */
  ratingCount?: string
  /** 豆瓣链接 */
  url: string
  /** 封面图路径（建议放 public/book-covers/ 用本地图，豆瓣有防盗链） */
  cover?: string
}

export function BookCard({
  title,
  author,
  translator,
  publisher,
  year,
  description,
  rating,
  ratingCount,
  url,
  cover,
}: BookCardProps) {
  const meta = [author, translator && `译｜${translator}`, publisher, year]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="not-prose group my-6 flex items-start gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/40 sm:gap-5 sm:p-5">
      {cover && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          aria-label={title}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 本地静态封面，无需 next/image */}
          <img
            src={cover}
            alt={title}
            loading="lazy"
            className="w-20 rounded-md shadow-md ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.02] dark:ring-white/10 sm:w-24"
          />
        </a>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="m-0 text-base leading-snug font-semibold text-neutral-900 dark:text-neutral-50 sm:text-lg">
          {title}
        </h3>

        <p className="m-0 text-[13px] text-neutral-500 dark:text-neutral-400">{meta}</p>

        {description && (
          <p className="m-0 text-sm leading-snug text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-neutral-200/80 pt-2.5 dark:border-neutral-800/80">
          {rating != null && (
            <span className="flex items-center gap-2">
              <span className="relative inline-block text-sm leading-none tracking-wide" aria-hidden>
                <span className="text-neutral-300 dark:text-neutral-700">★★★★★</span>
                <span
                  className="absolute inset-0 overflow-hidden whitespace-nowrap text-amber-500 dark:text-amber-400"
                  style={{ width: `${(rating / 10) * 100}%` }}
                >
                  ★★★★★
                </span>
              </span>
              <span
                className="text-sm font-bold text-neutral-900 tabular-nums dark:text-neutral-50"
                style={monoStyle}
              >
                {rating.toFixed(1)}
              </span>
              {ratingCount && (
                <span
                  className="text-xs text-neutral-400 tabular-nums dark:text-neutral-500"
                  style={monoStyle}
                >
                  {ratingCount}人评价
                </span>
              )}
            </span>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-neutral-500 transition-colors hover:text-amber-700 dark:text-neutral-400 dark:hover:text-amber-400"
            style={monoStyle}
          >
            豆瓣 ↗
          </a>
        </div>
      </div>
    </div>
  )
}
