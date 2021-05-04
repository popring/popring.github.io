---
title: 从输入url到页面显示经过了什么
date: 2021-03-06 14:51:51
tags: interview
categories: 简单聊
---



大致分为以下几个过程

- URL 解析
- DNS 解析
- HTTP 握手
- 检查是否有缓存
- 构建 DOM 树，解析 html
- 构建 CSSOM
- 执行 JavaScript 代码
- 构建渲染树：根据 DOM 树和 CSSOM 生成渲染树
- 根据渲染树对每个节点布局在正确位置
- 对每个元素进行绘制



<!-- more -->



![](https://raw.githubusercontent.com/popring/assets-repo/master/img/20201003104407.png)