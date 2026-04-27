@AGENTS.md

## Project

Personal blog (popring.github.io). Next.js 16.2 App Router · React 19 · Tailwind 4 · MDX. Statically exported to GitHub Pages.

## Layout

- Posts: `blog/*.mdx` — kebab-case filenames, gray-matter frontmatter. (`source/` is legacy Hexo, unused.)
- MDX renderer + component map: `components/mdx.tsx`.
- Components: `components/*.tsx` (kebab-case files).

## 写作风格（写博客文章时）

避免 AI 味，写得像真人。具体：

- **开头不要模板句**。不要"这是一篇 X，按 Y 顺序逐个过一遍，方便日常翻阅"这种声明式开场 —— 直接从动机或具体场景切入（"前阵子做 X 时发现..."、"最近想搞清楚 Y..."）。
- **删空话和冗余总结**。"非常好用"、"看起来参数很多但常用的就那几个"、"这是 X 里最重要的部分"、"值得一提的是" —— 全删，让代码和事实说话。
- **该口语就口语**。"趁机"、"当备忘"、"踩了个坑"、"一行搞定" 是好的，比 "便于查阅"、"针对此场景" 自然得多。
- **偶尔的"我"是好的**。"我习惯..."、"我一般..."、"实际开发里我..." 让读者知道是真人经验，不是教科书。
- **结尾不要总结全文**。读者刚看完，不需要再被复述一遍。要么戛然而止，要么留一句立场/原则。

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
- ESLint pinned to v9 — `eslint-config-next` transitive deps don't yet support v10.
- `next-mdx-remote@6` defaults `blockJS: true`, which silently renders JSX components as plain text. Fix: pass `blockJS: false` in `<MDXRemote options>` (already wired in `components/mdx.tsx`). Keep `blockDangerousJS: true` (default) for safety.
- Posts using JSX components (`<Playground>`, `<CodePreview>`, …) **must** declare `format: mdx` in frontmatter. The default is `md` and skips JSX parsing on purpose, so existing posts stay compatible.
- Custom prose rules in `app/global.css` (e.g., `.prose pre`) don't auto-respect the `not-prose` utility — Tailwind only applies that exclusion to its built-in Typography styles. When adding a `.prose <selector>` rule that interactive widgets shouldn't inherit, write it as `.prose <selector>:not(.not-prose *)`. Even with that, third-party libraries (e.g., `react-simple-code-editor`) that rely on the absence of `padding`/`border` on the underlying element may still need `preClassName='!p-0 !border-0 …'` overrides because their inline styles don't preempt class-based padding from prose.
- `react-simple-code-editor` keeps a single undo stack tied to its component instance. Changing the `value` prop (e.g., switching tabs in a shared editor) writes a new history entry, so Ctrl+Z then jumps back to the *previous tab's* content. Force a per-state Editor instance with `key={activeKey}` to give each state its own history.
- **MDX strips 2 leading spaces from every line of multi-line JSX attribute template literals** (a CommonMark block-parsing artifact, not configurable). For `<Playground>` and any future widget that takes code as a multi-line `prop={`…`}` attribute, write the code with **4-space indent** in the `.mdx` source — MDX strips 2, the editor renders 2. Tested: changing JSX prop layout (column-0 vs indented, single-line vs multi-line) does **not** affect this. **TODO (deferred):** the proper fix is to redesign the API so code is passed via MDX children with fenced code blocks (` ```css … ``` ` inside `<Playground>…</Playground>`), which preserves whitespace because fenced blocks aren't subject to lazy-continuation dedenting. Don't rebuild that until requested.
