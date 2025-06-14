---
title: v-if和v-show区别
tags: Vue
categories: 简单聊
abbrlink: e9ac0758
date: 2020-10-17 21:59:20
---



### `v-if`

根据表达式的真假值来决定是否渲染，它会造成真实DOM元素的渲染和销毁。



### `v-show`

根据表达式之真假值，切换元素的 `display` CSS property。

当条件变化时该指令触发过渡效果。



### `v-if` 和 `v-show` 区别

- `v-if` 会 “真正” 条件的渲染，它要确定事件监听器和子组件的正确创建和销毁（切换自组件会经历生命周期函数）
- `v-if` 如果初始条件为假，则不会渲染，只有当值为真是才会进行渲染
- `v-show` 无论在什么条件下都会进行渲染 DOM 元素，只是简单的切换 css 样式，来进行视觉上的显示和隐藏。
- `v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。如果元素频繁的切换，建议使用 `v-show` ；如果运行后条件很少改变，则使用 `v-if`
- `v-if` 切换会造成回流和重绘，`v-show` 则会造成重绘。



关联文章：

[visibility: hidden、display: none、opacity: 0 区别](https://popring.github.io/2020/10/16/css/visibility-hidden%E3%80%81display-none%E3%80%81opacity-0-%E5%8C%BA%E5%88%AB/)
