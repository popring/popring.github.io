# UI 设计语言

popring.cn 的视觉规则。改 UI 之前先翻一遍，避免飘走。

## 基调

极客 + 终端审美（terminal aesthetic）。每个页面像一个目录的 `ls`，不是营销页。
Sans 字体撑阅读，mono 字体撑结构、数字和元数据。

## 字体

- **正文 / 标题**：GeistSans（默认）。
- **mono 部分**：通过 `var(--font-geist-mono), ui-monospace, monospace` inline style 引用。`components/terminal-header.tsx` 导出 `monoStyle` 常量，所有用到 mono 的地方 import 这个，不要重复定义。
- **Tailwind 默认 `font-mono`**：不要用 —— 它走的是系统 stack，不是 Geist Mono。除非以后我们决定全局 alias。
- **永远 mono 的内容**：日期、计数 `[NN]`、序号、slug、年份、`//` 注释、`>` prompt、终端路径 `~/...`、链接里的 url、CLI 风副标签。
- **永远不 mono**：中文段落、文章正文、人话标题（craft 标志、博客标题）。

## 颜色

- 基底：`neutral-*`（black/white 两端）。
- **唯一 accent：`amber-700`（light）/ `amber-400`（dark）**。跟 `.prose code` inline 代码块的 amber 完全一致 —— 全站只有这一个高亮色。
- 节制原则：amber 只在三种地方出现：
  1. 终端 cursor 闪烁色块
  2. hover 状态（链接、列表项、`>` prompt 由灰变 amber）
  3. 列表项 active/分组左边的 `border-l` 提示线（home 页座右铭那种）
  - **不要**把 amber 用在大面积背景、大段标题、按钮主色。

## 公用组件

### `<TerminalHeader>`（`components/terminal-header.tsx`）

页面顶部统一 header。三个 props：

- `path`: 字符串，终端路径风格 —— `~`、`~/blog`、`~/craft`。
- `count`: 数字（自动 padStart 两位）或自定义字符串，渲染成右上 `[NN]` 标签。可选。
- `comment`: 副标题文本，前面自动加 `//`。可选。

后跟 amber 色 `animate-pulse` 闪烁色块作 cursor。

新页面**必须**用这个组件，不要自己写 header。

## 装饰元素

| 元素 | 用法 |
|------|------|
| `~/path █` | 页面 header（terminal cursor 永远闪烁） |
| `[NN]` | 集合数量（永远 mono、tabular-nums、padStart 两位） |
| `// comment` | 副标题、空状态、占位文字、注释性段落 |
| `> ` | 列表项标题 prompt，hover 由灰变 amber |
| `[label]` | 链接装饰、序号容器、筛选器形态（如 `[# tags]`） |
| `▸` | section heading 前缀（home 页 `▸ recent`），永远 amber |
| `↗` `→` | 外链 / 内链尾部小标，灰色 mono 字符 |
| dotted radial pattern | 空缩略图占位的网格底（`backgroundImage: radial-gradient(currentColor 0.6px, transparent 0.6px); backgroundSize: 10px 10px;`） |

## 数据展示规则

- **日期**：永远 `YYYY.MM.DD` ISO 风（`formatDate` 已经定死这个格式）。带 relative 时是 `2026.02.15 (3mo ago)`。
- **数字**：永远 `tabular-nums`，避免抖动。
- **序号**：`String(idx + 1).padStart(2, '0')` → `01` `02`，给两位数留空间。
- **count 标签**：同样 padStart 两位。
- **slug 显示**：mono、neutral-400/600 弱色，作为标题下方副信息。

## 三页应用映射

| 页面 | header path | count | 列表形态 |
|------|------------|-------|---------|
| `/` (home) | `~` | `hi`（自定义字符串） | section 切换：links / recent / shelf / motto |
| `/blog` | `~/blog` | 总文章数 | 单列文字列表（日期 + `>` + 标题） |
| `/blog/page/[N]` | `~/blog` | 总文章数 | 同上 + mono 分页器 `[01 / 09]` |
| `/craft` | `~/craft` | item 数 | 2 列卡片网格（缩略图 + mono 序号 + 标题 + slug + year） |
| `/blog/[slug]` (detail) | 不用 TerminalHeader（标题是文章主体） | — | 文章 H1 sans + 元数据条 mono ISO 日期 |
| `/craft/[slug]` (detail) | **不要任何 page header**（沉浸式） | — | 直接是 demo 组件 |

## Nav / Footer

站点 chrome（`components/nav.tsx`、`components/footer.tsx`）**保持现状**，不参与极客装饰。
理由：chrome 跟 page content 两层信息要分开，chrome 极客化会跟 page 内容争抢视觉。

## Hover 反馈统一

列表项 hover 同时触发：

- 标题颜色：`neutral-900/100` → `amber-700/400`
- `>` prompt 颜色：`neutral-300/700` → `amber-600/400`
- 卡片边框（craft）：`neutral-200/800` → `amber-500/60` / `amber-400/40`

`transition-colors` 统一处理，不加 transform 类的视觉抖动（craft 缩略图除外，那个是 `scale-[1.02]` 微动）。

## 中英文混排

- 中文段落正文给足 `leading-relaxed`，跟 mono 元数据并排时不要等行高。
- 中文标题、副标题保留 sans，**不**强行 mono。
- 中英混合的 mono 内容（如 `★ recommended` 这种）OK，但纯中文不应该塞 mono（违和）。

## 不要做的

- 不要自己另发明一个 accent 色（已经定 amber，要换全局换）。
- 不要在 page 之间引入不一致的 header 模式（用 `<TerminalHeader>`）。
- 不要在 craft 详情页加面包屑/标题 —— 沉浸式是它的核心。
- 不要把 nav 或 footer 也极客化。
- 不要给装饰元素（`>`、`▸`、`[01]`）加动画 —— 整个页面只有 cursor 一处闪烁。

## 参考

抄了一点 rauno.me/craft 的"craft" 命名 + 卡片网格语义，但视觉是自己的。
abundance: GitHub Geist 字体 + `.prose code` 的 amber 高亮已经存在，整个语言是顺着这两个既有 token 长出来的，不是另起一套。
