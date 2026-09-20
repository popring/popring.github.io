@docs/ui-design-language.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Project

Personal blog (popring.github.io). Next.js 16.3 App Router · React 19 · Tailwind 4 · MDX. Statically exported to GitHub Pages.

## Layout

- Posts: `blog/*.mdx` — kebab-case filenames, gray-matter frontmatter. (`source/` is legacy Hexo, unused.)
- Drafts: add `draft: true` to frontmatter. Visible in `pnpm dev`, excluded from the production build everywhere (filtered in `getBlogPosts`). Remove the flag to publish.
- MDX renderer + component map: `components/mdx.tsx`.
- Components: `components/*.tsx` (kebab-case files).

## 读书笔记 / 书籍卡片

读书笔记开头统一用 `<BookCard>`（`components/book-card.tsx`，已注册进 `components/mdx.tsx`）。所有数据是**静态 props**——豆瓣无可用 API、图片有防盗链，且本站静态导出无运行时，所以建一本时抓一次、固化进仓库。

加一本书的步骤：

1. 打开豆瓣详情页，记下：书名/副标题、作者(含国别)、译者、出版社、年份、评分、评价人数。
2. 下载封面到 `public/book-covers/`（豆瓣防盗链，curl 带 referer 直下；先从详情页源码 grep 出 `imgN.doubanio.com/view/subject/l/public/sXXXX.jpg`）：
   ```bash
   curl -s -A "Mozilla/5.0" -e "https://book.douban.com/" "<封面URL>" -o public/book-covers/<slug>.jpg
   ```
3. 文章开头放卡片（frontmatter 记得 `format: mdx`）：
   ```mdx
   <BookCard title="《…》" author="[美] …" translator="…" publisher="…"
     year="2019" description="一句话简介" rating={8.0} ratingCount="7514"
     url="https://book.douban.com/subject/XXXX/" cover="/book-covers/<slug>.jpg" />
   ```

`ratingCount` 传已格式化字符串（如 `19.2万`）；`rating` 是 `/10`，卡片内部换算成 5 星部分填充。

## UI defaults

Every component / page must support:

- **Mobile viewports** — use Tailwind responsive prefixes; assume mobile-first and gate desktop layout behind `md:` / `lg:`.
- **Both light and dark mode** — use Tailwind `dark:` variants on every color-bearing class; verify both visually before calling a UI task done.

Dark mode toggles by adding `class="dark"` on `<html>` (set early by an inline script in `app/layout.tsx`). For dynamic theme-aware logic in components, use the `useDarkMode` hook in `components/use-dark-mode.ts`.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint`.
- pnpm only — do not introduce npm or yarn lockfiles.
- Don't auto-`pnpm build` after small edits — dev HMR is sufficient. Reserve build for pre-commit checks or changes that may break static export (new deps, `next.config.ts` edits, client/server boundary shifts, suspected TS issues).

## Gotchas

When you hit a bug or non-obvious behavior in this repo while working, append a one-liner here. Be specific about the cause and the fix so the next session doesn't redo the investigation.

- `next.config.ts` sets `output: 'export'` only when `NODE_ENV=production`; dev runs as a normal Next server.
- **CI/本地都要 Node ≥ 22.13**（`packageManager` 是 `pnpm@11.7.0`，pnpm 11 需要 Node 22）。`.github/workflows/deploy.yml` 的 `setup-node` 必须是 `node-version: 22`——之前卡在 20，pnpm 起不来（`node:sqlite` 缺失），自 pnpm 升 11.x 起部署一直静默失败。
- **pnpm 配了供应链冷却期**：`pnpm-workspace.yaml` 的 `minimumReleaseAge: 4320`（3 天）——新发布的版本满龄 3 天才允许安装。副作用：`pnpm dev/build` 前的 deps 校验会拒绝近 3 天内更新过的已锁定传递依赖（曾被 `@emnapi/runtime` 卡住）。处理：`pnpm clean --lockfile && pnpm install` 重解析到满龄版（首选），或把该包加进 `minimumReleaseAgeExclude`（支持 `pkg@version` / `@scope/*`）。日常加/升级新包时若被拦，是预期行为。
- **Linting is Biome, not ESLint** (`biome.json`, `pnpm lint`). ESLint was removed because TypeScript 7 ships only the Go-native compiler and drops the JS Compiler API that `@typescript-eslint/typescript-estree` loads at startup — ESLint crashes with `Cannot read properties of undefined (reading 'Cjs')` under TS 7. Biome has its own parser and is unaffected. Suppress with `// biome-ignore lint/<rule>: <reason>`; the old `eslint-disable` comments no longer do anything.
- **TypeScript 7 needs no extra Next config here** — `next build` runs its own typecheck (`Finished TypeScript` in the log) and does catch real type errors; verified by injecting one. Typecheck runs in ~170-270ms.
- `next-mdx-remote@6` defaults `blockJS: true`, which silently renders JSX components as plain text. Fix: pass `blockJS: false` in `<MDXRemote options>` (already wired in `components/mdx.tsx`). Keep `blockDangerousJS: true` (default) for safety.
- Posts using JSX components (`<Playground>`, `<CodePreview>`, `<BookCard>`, …) **must** declare `format: mdx` in frontmatter. The default is `md` and skips JSX parsing on purpose, so existing posts stay compatible.
- Custom prose rules in `app/global.css` (e.g., `.prose pre`) don't auto-respect the `not-prose` utility — Tailwind only applies that exclusion to its built-in Typography styles (这里 `.prose` 其实是全自定义、没用 typography 插件，所以 `not-prose` 全靠这些守卫才生效)。所有元素级规则（`a / p / li / h1-h4 / strong / ul / ol / code / blockquote / pre / img`）已加 `:not(.not-prose *)` 守卫，新增同类规则务必照做，否则会漏进 `not-prose` 组件覆盖其样式（曾覆盖 `<BookCard>` 的标题字号/字重、段落颜色/行高、链接下划线）。Even with that, third-party libraries (e.g., `react-simple-code-editor`) that rely on the absence of `padding`/`border` on the underlying element may still need `preClassName='!p-0 !border-0 …'` overrides because their inline styles don't preempt class-based padding from prose.
- `react-simple-code-editor` keeps a single undo stack tied to its component instance. Changing the `value` prop (e.g., switching tabs in a shared editor) writes a new history entry, so Ctrl+Z then jumps back to the *previous tab's* content. Force a per-state Editor instance with `key={activeKey}` to give each state its own history.
- **JSX 块里出现空行，MDX 会把该块的子内容切回 markdown 模式解析**。后果：`<div>…<p className="…">图注</p></div>` 里的 `<p>` 会再被套一层 markdown `<p>`，触发 `<p> cannot be a descendant of <p>` 的 hydration error（内联 SVG 图表最容易踩，因为习惯用空行分组 `<defs>` / `<g>`）。修法：**整块 JSX 内部不留任何空行**；图表统一用 `<figure>` + `<figcaption>`（`<figcaption>` 不是 `<p>`，即使被包也不会非法嵌套）。
- **`getReadingStats` 统计前会剥掉 `<…>` 标签**（`app/blog/utils.ts`）。原因：它按空格切非中文内容来数英文词，内联 SVG 的 `className` / 坐标属性会被算成上千个"词"，把字数和阅读时长撑到虚高一倍。改这个函数时别把 `replace(/<[^>]+>/g, ' ')` 去掉。
- **MDX strips 2 leading spaces from every line of multi-line JSX attribute template literals** (a CommonMark block-parsing artifact, not configurable). For `<Playground>` and any future widget that takes code as a multi-line `prop={`…`}` attribute, write the code with **4-space indent** in the `.mdx` source — MDX strips 2, the editor renders 2. Tested: changing JSX prop layout (column-0 vs indented, single-line vs multi-line) does **not** affect this. **TODO (deferred):** the proper fix is to redesign the API so code is passed via MDX children with fenced code blocks (` ```css … ``` ` inside `<Playground>…</Playground>`), which preserves whitespace because fenced blocks aren't subject to lazy-continuation dedenting. Don't rebuild that until requested.
