@AGENTS.md

## Project

Personal blog (popring.github.io). Next.js 16.2 App Router · React 19 · Tailwind 4 · MDX. Statically exported to GitHub Pages.

## Layout

- Posts: `blog/*.mdx` — kebab-case filenames, gray-matter frontmatter. (`source/` is legacy Hexo, unused.)
- MDX renderer + component map: `components/mdx.tsx`.
- Components: `components/*.tsx` (kebab-case files).

## Commands

- `pnpm dev` / `pnpm build` / `pnpm lint`.
- pnpm only — do not introduce npm or yarn lockfiles.

## Gotchas

- `next.config.ts` sets `output: 'export'` only when `NODE_ENV=production`; dev runs as a normal Next server.
- ESLint pinned to v9 — `eslint-config-next` transitive deps don't yet support v10.
