# UI 设计语言

popring.cn 的视觉规则。改 UI 之前先翻一遍，避免飘走。

## 基调

手绘笔记本。暖白纸面、粗黑标题、线稿小人，个性全靠手写批注和几笔线条撑，版面本身很克制。
参考过 Humation 文档站：没有强调色、层级靠字重和灰度拉开。

## 颜色

全部用 `app/global.css` 里的 token，浅色 / 深色自动切换，**组件里不写 hex、不写 `neutral-*`、不写 `dark:`**。

| 工具类 | 用途 |
|---|---|
| `bg-paper` | 页面底（暖白 / 近黑） |
| `bg-card` | 纸片、便利贴、代码卡 |
| `text-ink` | 标题、强调 |
| `text-body` | 正文 |
| `text-muted` / `text-faint` | 批注、日期、次要信息 |
| `border-line` / `border-line-strong` | 细线 / 虚线分隔 |
| `bg-hover` | hover 底色 |
| `bg-inv` + `text-inv-ink` | 反色块（当前 tab、主按钮） |
| `bg-tape` | 胶带 |
| `.hl` | 荧光笔（导语关键句、正文加粗） |

- **没有强调色。** 只有黑白灰、代码高亮、荧光笔黄。别再加琥珀、蓝、紫。
- 语义色（错误红等）只在真的表达状态时用。

## 字体

| 角色 | 字体 | 怎么用 |
|---|---|---|
| 正文 / 标题 | Geist + 系统中文 | 默认 `font-sans` |
| 代码 | Geist Mono | `font-mono` |
| 手写 | Caveat（拉丁）+ Long Cang（中文） | `<Hand>` 或 `font-hand` |

- 标题：粗（700–800）、大、字距收紧（`tracking-[-0.04em]` 左右）。
- 手写体**只用在批注性质的地方**：页头小字、日期、分类、计数、「翻翻全部」这类链接、签名。文章标题和正文永远不用手写。
- 手写字体是子集，只含用到的字。**加了新手写文案要重跑** `python3 scripts/subset-hand-font.py`，漏字会回落楷体。

## 组件

| 组件 | 文件 | 用途 |
|---|---|---|
| `Face` `Underline` `Arrow` `ArrowShort` `Circled` `Pen` `Book` `CodeMark` `Hand` | `components/doodle.tsx` | 线稿元素，全是 `currentColor` 描边 |
| `PageHeader` | `components/paper.tsx` | 列表页页头（手写小字 + 大标题 + 手绘下划线 + 右侧批注） |
| `Sheet` + `PostRow` | `components/paper.tsx` | 「本子上的一页」文章列表，所有文章列表共用 |
| `StickyNote` | `components/paper.tsx` | 便利贴（带胶带，`tilt` 控制歪斜，hover 摆正） |
| `DrawIn` | `components/animate-in.tsx` | 线稿描线入场，只在整站首次进入时画 |

新列表页**必须**用 `PageHeader` + `Sheet`，不要自己拼。

## 形状

- 纸页：手绘不规则圆角 `rounded-[4px_18px_6px_16px/16px_6px_18px_4px]`。
- 便利贴：小圆角 `rounded-[3px]` + `shadow-note` + 顶部胶带。
- 列表分隔：虚线 `divide-dashed divide-line-strong`。
- 卡片边框用 `border-line`（半透明），不用实色灰。

## 动效

- **全站只有一处编排动画**：首页 / 404 的线稿描线（`DrawIn`），之后两侧批注淡入（`.note-pop`）。
- 其余只有 hover 微动：便利贴摆正、箭头右移 4px、标题出波浪下划线。时长 150–250ms，`--ease-out-strong`。
- 切页、列表都不加入场动画。`prefers-reduced-motion` 下全部关掉。

## 数据展示

- 列表里的日期：手写 `MM/DD`（`monthDay()`），年份做成手写大字分组。
- 详情页日期：手写 `YYYY.MM.DD`。
- 数字：`tabular-nums`。

## 文案

- 口语、短句，像随手写在本子上的。别写「这里是」「欢迎来到」。
- 定位：全栈 / 增长 / AI 在前，「前端」不打头。

## 不要做的

- 不要加强调色、渐变、大阴影。
- 不要在正文、文章标题里用手写体。
- 不要满屏批注：一个页面最多两三处手写批注。
- 不要给列表、分页、切换加动画。
