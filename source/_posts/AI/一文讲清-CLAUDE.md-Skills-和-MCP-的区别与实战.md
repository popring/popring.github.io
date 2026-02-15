---
title: 一文讲清 CLAUDE.md、Skills 和 MCP 的区别与实战
tags:
  - AI
  - Claude
  - Agent
  - MCP
categories: AI
abbrlink: claude-md-skills-mcp-guide
date: 2026-02-15 20:00:00
---

## 背景

最近用 Claude Code 写了不少项目，发现很多人（包括早期的我）都搞不清楚：CLAUDE.md、Skills、MCP 这几个东西到底是什么关系？什么时候用哪个？怎么把它们组合起来让 Agent 真正高效地工作？

这篇文章用最通俗的方式讲清楚它们的区别、使用场景，以及如何用它们编排一个完整的 Agent 工作流。

<!-- more -->

## 先说结论：一个比喻搞懂全部

想象你招了一个超级聪明的新员工。他学什么都快，但刚入职，对你的公司一无所知。

你需要给他三样东西：

- **员工手册**（CLAUDE.md）— 告诉他公司做什么、团队规范、项目结构
- **标准操作流程 SOP**（Skills）— 遇到特定任务该怎么一步步执行
- **工具箱接口**（MCP）— 让他能操作外部工具，比如数据库、Slack、Figma

三者的定位完全不同：

| | CLAUDE.md | Skills | MCP |
|---|---|---|---|
| 类比 | 员工手册 | SOP 流程 | 工具箱接口 |
| 解决什么问题 | "你是谁、项目是什么" | "遇到 X 该怎么做" | "能用什么工具" |
| 表现形式 | Markdown 文件 | Markdown 文件 | Server 服务 |
| 加载方式 | 自动加载 | 按需触发 | 按需连接 |
| 本质 | 静态上下文 | 可复用的流程 | 可执行的能力 |

下面逐个展开。

---

## CLAUDE.md：给 Agent 一本员工手册

### 它是什么

CLAUDE.md 是放在项目中的一个 Markdown 文件。Agent 启动时会自动读取它，作为理解你项目的"背景知识"。

你可以把它理解成**新员工入职第一天拿到的那本手册**——公司做什么、团队用什么技术栈、代码怎么组织、有哪些潜规则。

### 写什么：WHY、WHAT、HOW 框架

一个好的 CLAUDE.md 应该回答三个问题：

- **WHY**（为什么）— 这个项目是做什么的？解决什么问题？
- **WHAT**（是什么）— 技术栈、目录结构、关键模块
- **HOW**（怎么做）— 用什么工具、怎么跑测试、怎么验证改动

```markdown
# CLAUDE.md

## 项目概览（WHY）
这是一个面向 B2C 的电商项目，支持多语言、多币种。

## 技术栈与目录结构（WHAT）
Next.js + TypeScript + Tailwind CSS
src/
├── app/          # Next.js App Router 页面
├── components/   # 共享组件
├── lib/          # 工具函数
└── services/     # API 调用层

## 开发规范（HOW）
- 使用 pnpm 作为包管理器（不要用 npm）
- 提交前运行 pnpm lint && pnpm test
- 不要修改 .env 文件
- API Key 绝对不能提交到代码里
```

### 关键原则：少即是多

这一点非常重要，很多人写 CLAUDE.md 会踩坑——**写太多了**。

为什么？因为 LLM 是无状态的。CLAUDE.md 是每次对话都会自动加载的唯一文件，它会占用宝贵的上下文窗口。研究表明，前沿 LLM 大约能稳定遵循 150-200 条指令，而 Claude Code 的系统提示已经占了约 50 条。留给你的空间其实不多。

**几个实操建议**：

- **控制在 300 行以内**，越短越好。HumanLayer 团队的根目录 CLAUDE.md 只有不到 60 行
- **只放全局通用的信息**。如果一条指令只在特定任务中有用（比如"如何设计数据库 schema"），就不要放在 CLAUDE.md 里，否则做无关任务时它反而会干扰 Agent
- **不要把代码风格写进 CLAUDE.md**。格式化交给 ESLint、Prettier、Biome 这些工具，别让 Agent 浪费 token 在缩进和分号上
- **指向而非复制**。引用具体文件路径（如 `src/lib/auth.ts:42`）比直接粘贴代码片段更好，因为代码会变，CLAUDE.md 里的副本很快就过时了

### 渐进式信息披露

既然 CLAUDE.md 要保持精简，那详细的文档放哪？答案是**单独的文档目录** + 在 CLAUDE.md 中列出索引：

```markdown
# CLAUDE.md

## 详细文档
在开始任务前，根据需要阅读以下文档：
- `agent_docs/building_the_project.md` — 构建和部署流程
- `agent_docs/running_tests.md` — 测试策略和命令
- `agent_docs/service_architecture.md` — 服务架构说明
- `agent_docs/database_schema.md` — 数据库设计
```

这样 CLAUDE.md 保持轻量，Agent 只在需要时才去读取具体文档。这个思路跟 Skills 的渐进式加载不谋而合。

### 层级机制：三层生效

CLAUDE.md 支持三个层级，从大到小依次覆盖：

```
~/.claude/CLAUDE.md          ← 全局：所有项目通用的偏好
项目根目录/CLAUDE.md          ← 项目级：团队共享的规范（会提交到 Git）
项目子目录/CLAUDE.md          ← 模块级：特定目录的规则
```

比如你可以在全局配置里写"我偏好 TypeScript"，在项目级写"用 pnpm 不要用 npm"，在 `src/components/` 下写"组件必须导出 Props 类型"。

### 核心定位

CLAUDE.md 是**静态上下文**。它解决的是"Agent 理解你的项目"这个问题。

它不会教 Agent 怎么做事，只告诉它**这是什么**。

---

## Skills：给 Agent 一套 SOP

### 它是什么

Skills 是可复用的工作流模板——告诉 Agent 遇到特定场景该怎么一步步做。

如果 CLAUDE.md 是"员工手册"，那 Skills 就是**各种标准操作流程（SOP）**。比如"收到客户投诉怎么处理""新功能上线前要检查什么"。

### 跟 CLAUDE.md 的关键区别

| | CLAUDE.md | Skills |
|---|---|---|
| 加载时机 | Agent 启动时自动加载 | 需要时才触发 |
| 内容类型 | 背景知识、规范 | 操作步骤、流程 |
| 类比 | 随时翻阅的手册 | 遇到特定场景才翻的 SOP |

CLAUDE.md 是"永远在线的背景知识"，Skills 是"按需触发的操作指南"。

### 文件结构

一个 Skill 本质上是一个**文件夹**，包含以下内容：

```
code-review/
├── SKILL.md        # 必须：主文件，包含指令（注意必须全大写）
├── scripts/        # 可选：可执行脚本（Python、Bash 等）
├── references/     # 可选：参考文档，按需加载
└── assets/         # 可选：模板、图标等资源
```

其中 `SKILL.md` 是核心，由 YAML 头部 + Markdown 正文组成。

### 渐进式加载

Skills 有一个精妙的设计——**渐进式加载**（Progressive Disclosure），分三层：

1. **YAML 头部**：始终加载到 Agent 上下文中，让 Agent 知道"有这个 Skill"和"什么时候该用"
2. **SKILL.md 正文**：Agent 判断当前任务需要时才加载，包含完整的操作指令
3. **关联文件**：references/ 和 scripts/ 中的内容，Agent 执行过程中按需读取

这个设计的好处是**省 token**。你可以装 50 个 Skills，但 Agent 只会加载当前真正需要的那几个。

### 一个 Skill 长什么样

```markdown
---
name: code-review
description: 代码审查流程，确保代码质量和规范一致性。Use when user asks to "review code", "check PR", or "审查代码".
---

## 审查流程

1. 读取变更文件列表（git diff）
2. 对照项目的代码规范逐文件检查：
   - 命名是否符合规范
   - 是否有安全漏洞（XSS、SQL 注入等）
   - 是否有明显的性能问题
3. 输出审查报告，按严重程度分级：
   - 🔴 必须修复
   - 🟡 建议优化
   - 🟢 可以忽略
4. 如果发现 🔴 级别问题，阻止合并

## Troubleshooting
Error: No diff found
Cause: Working on main branch with no changes
Solution: Switch to feature branch first
```

注意 `description` 字段——它不只是描述，还包含**触发条件**（"Use when..."）。这是 Agent 判断是否加载这个 Skill 的关键依据。根据 Anthropic 官方指南：description 必须同时包含"做什么"和"什么时候用"两部分。

### 触发方式

- **手动触发**：用户输入 `/code-review`，Agent 加载并执行对应 Skill
- **自动识别**：Agent 根据 description 中的触发条件判断，自动加载

### 核心定位

Skills 是**可复用的流程知识**。写一次，反复用。

适合的场景：
- 团队统一工作标准（所有人的 code review 流程一致）
- 个人固化最佳实践（每次 debug 都按同一套方法论排查）
- 复杂流程不遗漏（发布上线要检查 10 个步骤，Skill 帮你记住）

---

## MCP：给 Agent 一个工具箱接口

### 它是什么

MCP（Model Context Protocol）是一个标准化协议，让 Agent 能连接外部工具和数据源。

前面讲的 CLAUDE.md 和 Skills 都是"知识"——本质是 Markdown 文本，Agent 读了之后更聪明，但它还是只能"说"不能"做"。

MCP 让 Agent 真正能**动手**。

Anthropic 官方指南里有一个很好的比喻：**MCP 是专业厨房，Skills 是菜谱**。厨房里有各种工具、食材、设备（MCP 提供的能力），但光有厨房不够，你还需要菜谱告诉你怎么把这些东西组合成一道菜（Skills 定义的流程）。

### 另一个比喻：USB-C

在 MCP 出现之前，每个 AI 工具要连接外部服务都得单独写适配器。假设有 N 个 Agent 和 M 个工具，就需要 N × M 种集成方式。

MCP 的思路跟 USB-C 一样——**定义一个统一接口**。每个工具只要实现 MCP 协议，任何支持 MCP 的 Agent 都能直接调用。N + M 就够了。

```
没有 MCP：                    有了 MCP：
Agent A ──┬── Slack           Agent A ──┐
Agent A ──┼── GitHub                    │
Agent B ──┼── Slack           Agent B ──┼── MCP ──┬── Slack
Agent B ──┼── GitHub                    │        ├── GitHub
Agent C ──┼── Slack           Agent C ──┘        ├── DB
Agent C ──┘── GitHub                             └── Figma
(6 种集成)                    (3 + 4 = 7 个接口，但可任意组合)
```

### 配置示例

在 Claude Code 中，通过 JSON 配置连接 MCP Server：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost:5432/mydb"]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"]
    }
  }
}
```

配置之后，Agent 就能：
- 通过 GitHub MCP 读取 PR、提交 Review Comments
- 通过 Postgres MCP 查询数据库
- 通过 Slack MCP 发送消息通知

你不需要写任何胶水代码。

### 核心定位

MCP 是**能力扩展层**。

三者的关系可以这样理解：
- CLAUDE.md 告诉 Agent **"你在哪"**（上下文）
- Skills 告诉 Agent **"怎么做"**（流程）
- MCP 让 Agent **"真的能做"**（能力）

---

## 全景图：三者如何协作

把三者放在一起看：

```
┌──────────────────────────────────────────────┐
│              Agent 执行层                     │
│         (Claude Code / Cursor 等)            │
├──────────────────────────────────────────────┤
│                                              │
│   ┌────────────┐    ┌─────────────────────┐  │
│   │ CLAUDE.md  │    │      Skills         │  │
│   │  (上下文)   │    │    (工作流程)        │  │
│   │            │    │                     │  │
│   │ • 项目背景  │    │ • /commit           │  │
│   │ • 代码规范  │    │ • /code-review      │  │
│   │ • 目录结构  │    │ • /debug            │  │
│   │ • 注意事项  │    │ • /deploy           │  │
│   └────────────┘    └─────────────────────┘  │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │          MCP (工具能力)               │   │
│   │                                      │   │
│   │  GitHub │ Slack │ DB │ Figma │ ...   │   │
│   └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

**数据流向**：
1. Agent 启动 → 自动读取 CLAUDE.md → 理解项目上下文
2. 用户下达任务 → 触发对应 Skill → Agent 按流程执行
3. 执行过程中需要操作外部工具 → 通过 MCP 调用

三者各司其职，互不替代。

---

## 实战：编排一个完整的 Agent 工作流

理论讲够了，来看一个真实场景。

### 场景：自动化 PR 审查 + 团队通知

需求很常见：每次提交 PR，希望 Agent 自动审查代码，发现问题直接在 PR 上留 comment，审查完在 Slack 通知团队。

### Step 1 — CLAUDE.md 提供项目上下文

```markdown
# CLAUDE.md

## 代码规范
- 禁止使用 any 类型，必须显式声明类型
- React 组件必须定义 Props 接口
- API 请求统一通过 services/ 层，不要在组件中直接 fetch
- CSS 使用 Tailwind，禁止内联 style

## PR 审查重点
- 关注安全性：用户输入必须校验
- 关注性能：避免不必要的 re-render
- 关注可维护性：函数不超过 50 行
```

这是 Agent 的"背景知识"——它知道这个项目关心什么。

### Step 2 — Skill 定义审查流程

```markdown
---
name: pr-review
description: PR 自动审查流程
---

## 流程

1. 获取当前 PR 的变更文件列表
2. 读取项目 CLAUDE.md 中的代码规范和审查重点
3. 逐文件检查：
   - 是否违反代码规范
   - 是否有安全风险（XSS、注入等）
   - 是否有性能问题
4. 生成审查报告，按严重程度分级
5. 在 PR 上留下 review comments
6. 汇总结果，通过 Slack 通知团队
   - 🔴 有严重问题 → 通知并标记需要修复
   - 🟢 审查通过 → 通知并建议合并
```

这是 Agent 的"操作手册"——它知道一步步该做什么。

### Step 3 — MCP 提供执行能力

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"]
    }
  }
}
```

这是 Agent 的"工具箱"——它能操作 GitHub 和 Slack。

### 编排后的完整流程

```
PR 被创建
  │
  ▼
Agent 启动，自动加载 CLAUDE.md
  │  → 理解项目规范和审查重点
  ▼
触发 pr-review Skill
  │  → 按流程逐步执行
  ▼
通过 GitHub MCP 读取 PR diff
  │  → 获取所有变更文件
  ▼
逐文件审查（结合 CLAUDE.md 中的规范）
  │  → 生成审查报告
  ▼
通过 GitHub MCP 提交 Review Comments
  │  → 在 PR 上留下具体的行级评论
  ▼
通过 Slack MCP 发送通知
  │  → "@channel PR #123 审查完成，发现 2 个问题需要修复"
  ▼
完成 ✅
```

这就是三者配合的完整闭环：**CLAUDE.md 提供语境 → Skill 定义步骤 → MCP 执行动作**。

---

## 进阶：五种常见的 Agent 编排模式

根据 Anthropic 官方 Skills 指南，实际使用中有五种常见的编排模式。了解它们能帮你设计更好的 Agent 工作流。

### 模式 1：顺序工作流（Sequential Workflow）

**适用场景**：步骤之间有严格的先后顺序和依赖关系。

上面的 PR Review 例子就属于这种模式——必须先读取 diff，才能审查，审查完才能通知。

关键技巧：明确步骤顺序、定义步骤间的数据依赖、在每步加入验证、提供失败时的回滚指令。

### 模式 2：多 MCP 协调（Multi-MCP Coordination）

**适用场景**：一个工作流需要跨多个外部服务。

比如"设计交付"流程：从 Figma 导出设计稿（Figma MCP）→ 上传到 Google Drive（Drive MCP）→ 在 Linear 创建开发任务（Linear MCP）→ 在 Slack 通知团队（Slack MCP）。

关键技巧：清晰的阶段划分、MCP 之间的数据传递、每个阶段完成后再进入下一阶段。

### 模式 3：迭代精炼（Iterative Refinement）

**适用场景**：输出质量需要多轮迭代提升。

比如"报告生成"：先拉取数据生成初稿 → 运行验证脚本检查质量 → 修复发现的问题 → 重新验证 → 直到达标。

关键技巧：定义明确的质量标准、限制最大迭代次数（避免死循环）、每轮只修复已识别的问题。

### 模式 4：上下文感知选择（Context-Aware Tool Selection）

**适用场景**：同一个目标，根据不同上下文选择不同的执行路径。

比如"文件存储"：大文件用云存储 MCP，协作文档用 Notion MCP，代码文件用 GitHub MCP，临时文件用本地存储。

关键技巧：清晰的决策树、每个分支的执行逻辑、向用户解释为什么选择了某个路径。

### 模式 5：领域专家（Domain-Specific Intelligence）

**适用场景**：Skill 不仅编排工具，还嵌入了专业领域知识。

比如"支付合规检查"：在处理交易前，先根据嵌入的合规规则检查制裁名单、验证管辖区、评估风险等级，通过后才调用支付 MCP 执行交易。

关键技巧：把领域知识写进 Skill 或 references/、先检查再执行、完整的审计日志。

---

## 写好配置的几条建议

### 最佳实践

**CLAUDE.md**：
- 控制在 300 行以内，越短越好
- 遵循 WHY/WHAT/HOW 框架，只放全局通用的信息
- 善用层级机制：通用偏好放全局，项目规则放项目级
- 代码风格交给 Linter，不要写进 CLAUDE.md
- 用 `agent_docs/` 目录做渐进式信息披露，CLAUDE.md 只放索引
- 不要用 `/init` 自动生成——这是你最高杠杆的配置文件，值得手写

**Skills**：
- 单一职责，一个 Skill 只做一件事
- `description` 必须包含"做什么"和"什么时候用"，不要只写"Helps with projects"
- 步骤要具体可执行，不要写"确保代码质量"这种模糊的话
- 把详细文档放到 `references/` 目录，SKILL.md 保持在 5000 词以内
- 考虑异常路径，比如"如果没有变更文件，直接跳过审查"
- 用 `name: kebab-case` 命名，不要用空格或大写

**MCP**：
- 按需接入，不要一次连 20 个 Server
- 注意权限最小化，只给 Agent 必要的访问权限
- 优先使用官方或社区维护的 MCP Server

### 常见误区

| 误区 | 正确做法 |
|---|---|
| 把工作流程写在 CLAUDE.md 里 | 流程用 Skills，CLAUDE.md 只放上下文 |
| 一个 Skill 里塞了 10 个不同任务 | 拆分成多个 Skill，各自单一职责 |
| 不写 MCP，直接让 Agent 跑 shell 命令操作外部服务 | 用 MCP 获得结构化的工具接口，更安全可控 |
| CLAUDE.md 写了 500 行 | 精简到 300 行以内，详细文档放 agent_docs/ |
| 把代码风格规则写进 CLAUDE.md | 交给 ESLint/Prettier/Biome，别浪费 token |
| 用 /init 自动生成 CLAUDE.md | 手写。这是最高杠杆的配置，值得花时间 |
| 从不更新 CLAUDE.md | 项目演进时同步更新，过时的信息比没有信息更糟 |
| Skill 的 description 写得太模糊 | 包含具体的触发词，如"Use when user asks to..." |
| Skill 文件夹里放了 README.md | 所有文档放在 SKILL.md 或 references/ 中 |

---

## 总结

用三句话记住这套体系：

- **CLAUDE.md** — 告诉 Agent "你是谁"（上下文）
- **Skills** — 告诉 Agent "怎么做"（流程）
- **MCP** — 让 Agent "能动手"（能力）

它们不是互相替代的关系，而是互补的三层。组合起来，就是一套完整的 Agent 编排方案。

与其花时间在每次对话里重复解释项目背景、手动指导操作步骤，不如花 30 分钟把这三样配好。**教会 Agent 一次，受益每一次。**

---

## 参考资料

- [The Complete Guide to Building Skills for Claude](https://claude.com/blog/complete-guide-to-building-skills-for-claude) — Anthropic 官方 Skills 构建指南（含 PDF 下载）
- [Model Context Protocol 官方文档](https://modelcontextprotocol.io) — MCP 协议规范与实现
- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code) — Claude Code 使用指南
- [Anthropic Skills 示例仓库](https://github.com/anthropics/skills) — 官方维护的 Skills 示例，可直接参考和复用
- [Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md) — HumanLayer 团队关于如何写好 CLAUDE.md 的深度分析
