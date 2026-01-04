---
title: SEO 优化
categories: 技术
abbrlink: e092deb0
date: 2025-05-27 22:55:44
tags:
---

`ahrefs` 的 `SEO` 系列文章讲的挺好，推荐

英文：https://ahrefs.com/blog/how-do-search-engines-work/

中文：https://ahrefs.com/blog/zh/how-do-search-engines-work/

google 文档：https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-cn

还有 posthog 的这篇 SEO 入门文章也不错 https://newsletter.posthog.com/p/non-obvious-seo-advice-for-startups

<!-- more -->

常用网站：

[Google Search Console](https://search.google.com/search-console/welcome?hl=zh-cn)：Google 官方的 `SEO` 工具

[百度站长平台](https://ziyuan.baidu.com/property/index)：百度官方的 `SEO` 工具，可以查看网站的 `SEO` 状态，关键词排名，竞争对手等。

[Bing Webmasters](https://www.bing.com/webmasters/searchperf)：Bing 官方的 `SEO` 工具，可以查看网站的 `SEO` 状态，关键词排名，竞争对手等。


[aitdk](https://aitdk.com/zh)： 插件，可以查看网站的 `SEO` 状态，有一些小工具也可以生成更适合的 SEO 标题和描述等。

[Google Analytics](https://analytics.google.com/analytics/web/)： 查看网站的流量来源，用户行为等。

[Ahrefs](https://ahrefs.com/)： 查看网站的 `SEO` 状态，关键词排名，竞争对手等，也有一些免费的小工具，比如 `Site Audit` 可以查看网站的 `SEO` 状态，`Keyword Explorer` 可以查看关键词排名，竞争对手等。

[Semrush](https://zh.semrush.com/projects/)：比 `Ahrefs` 更全面，但是需要付费。


以下是总结的 `ahrefs` 的 `SEO` 系列文章，有兴趣的可以看看。

## 一、搜索引擎工作机制（理解原理）

### 1. 搜索引擎的三大核心流程

* **抓取（Crawl）**：爬虫程序访问网页并下载内容。
* **索引（Index）**：处理并存储网页信息，加入搜索索引库。
* **排序（Rank）**：依据算法决定结果的展示顺序。

✅ 实践建议：

* 使用 `robots.txt` 控制抓取权限。
* 提交网站地图到 Google Search Console（GSC）。
* 检查是否有被 noindex 阻止索引的页面。

---

## 二、网站抓取与索引优化

### 1. 确保页面可被抓取

* 正确配置 robots.txt，不屏蔽重要路径。
* 使用站内链接和 XML sitemap 引导搜索引擎发现页面。

### 2. 页面可渲染

* 避免关键内容依赖 JS 异步加载。
* 使用服务端渲染（SSR）或预渲染（prerender）技术提升可见性。

✅ 检查工具：

* Google Search Console > URL 检查。
* Screaming Frog 或 Ahrefs 抓取报告。

---

## 三、关键词研究（流量来源基础）

### 1. 关键词选择策略

* 确保关键词具有：

  * 足够的搜索量（Search Volume）；
  * 明确的搜索意图；
  * 适中的竞争度（Keyword Difficulty）。

### 2. 工具推荐

* Ahrefs、Google Keyword Planner、Ubersuggest。

✅ 实践操作：

* 建立关键词清单，分组标记意图（信息型、导航型、交易型）。
* 针对每个关键词创建单独目标页面。

---

## 四、页面内容优化（On-page SEO）

### 1. 内容结构优化

* H1 仅出现一次，准确概括页面主题。
* 合理使用 H2/H3 拓展子主题，帮助机器理解内容结构。

### 2. 内容匹配用户意图

* 分析 SERP 排名前10内容，确认目标用户意图。
* 回答用户常见问题、提供明确的解决方案。

### 3. 多媒体和辅助元素

* 添加图片并设置描述性文件名和 alt 属性。
* 使用列表、表格、引用等提升可读性。

✅ 检查清单：

* 页面是否包含目标关键词？
* 是否满足 E-E-A-T（经验、专业性、权威性、可信度）？

---

## 五、URL、标题与元标签优化

### 1. URL 优化

* 简短、有意义、包含关键词，例如 `/best-running-shoes`。
* 避免动态参数、无意义数字。

### 2. Title 与 Meta Description

* Title 控制在 55–60 字符，包含关键词、吸引点击。
* Description 用于吸引点击，概述页面内容。

✅ 工具推荐：

* Yoast SEO（WordPress 插件）
* Ahrefs > Site Audit > On-page issues

---

## 六、技术 SEO 核心要点

### 1. 网站结构清晰

* 使用面包屑导航和内部链接构建清晰路径。
* 控制页面层级，重要页面不超过 3 层。

### 2. 页面加载性能

* 图片压缩、启用缓存、使用 CDN。
* 检查 Core Web Vitals 指标（LCP、CLS、FID）。

### 3. 移动适配与 HTTPS

* 实现响应式设计，移动设备体验良好。
* 网站使用 HTTPS，SSL 证书配置正确。

✅ 实践工具：

* PageSpeed Insights / Lighthouse
* Mobile-Friendly Test
* Ahrefs > Site Audit 报告

---

## 七、用户行为与搜索个性化因素

* 搜索引擎会基于用户位置、设备、历史行为对结果排序。
* 需结合用户画像进行内容、关键词、页面设计的差异化适配。

✅ 小结建议：

* 针对本地关键词做专页（如 "北京健身房推荐"）。
* 针对移动用户优化 CTA 按钮、加载速度与可读性。

---

## 🔚 结语：推荐实施路径

1. **诊断**：用 GSC、Ahrefs 做抓取与内容审核。
2. **关键词规划**：提取目标关键词 + 构建内容地图。
3. **页面重构**：优化结构、内容、URL、Meta 标签。
4. **技术增强**：提速、改错、强化移动体验。
5. **持续监测**：通过 GSC + Ahrefs 观察流量、排名、点击率变化。
