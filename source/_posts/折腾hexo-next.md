---
title: 折腾hexo + next
date: 2019-02-01 11:46:47
tags: 
- hexo
- next
categories: 其他
---

- hexo 安装

- 使用 Next 主题
- 创建页面
- 本文无亮点，观看需谨慎。
- 最后想说，先去翻翻官方文档，再看第三方的，毕竟，官方的才正宗。

<!--more-->

## [下载安装hexo](https://hexo.io/zh-cn/)

这一步没什么难度，就像官网所说的一样

```bash
npm install hexo-cli -g
```

一行命令解决，当然，首先你要安装上node.js

然后就是创建文件夹，安装 `hexo` 依赖，运行，这样你的博客就搭建起来了。

```bash
hexo init blog
cd blog
npm install
hexo server
```

然后就是自定义自己网站的标题，作者。。。

统一在 `_config.yml` 文件内。详情信息，请翻官方文档。

### [hexo 命令](https://hexo.io/zh-cn/docs/commands)

```bash
# 初始化
hexo init blog 
# 开启 heox 服务器
hexo s || hexo server
# 生成静态文件
hexo g || hexo generate
```



## [Next 主题](http://theme-next.iissnan.com/)

在刚开始用主题的时候，各种不熟悉，导致怎么都不会用，后来渐渐的对`Next` 有了新的认知，不仅美观，而且还优雅，功能还有一大堆。最主要的是还有官方文档说明。



### 下载主题

```bash
git clone https://github.com/iissnan/hexo-theme-next.git
```

并将主题放在 `hexo` 下的`/themes` 文件夹中。

接下来修改 `hexo` 根目录下的 `_config.yml` 文件中的 `theme` 修改为主题名 

![1](/折腾hexo-next/hexo1.jpg)



## 创建页面

### 添加 [标签] 页面

```
hexo new page tags
```

### 添加 [分类] 页面

```bash
hexo new page categories
```

### 添加 [关于] 页面

```bash
hexo new page about
```

关于 `md` 文件位置： `blog/source/about/index.md`

修改内容，即可修改 关于 页面内容。

> tips: 标签和分类页面的 `md` 文件 修改无效果，页面是自动生成的。

## 命令

### 开启服务器

```bash
hexo s || hexo server
	-s # 启动静态页面
```

