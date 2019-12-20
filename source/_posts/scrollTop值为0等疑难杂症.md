---
title: scrollTop值为0等疑难杂症
date: 2018-10-19 23:54:40
tags: 
- 前端
- 浏览器兼容性
categories: 
- html
---

 自测有效果

IE: `document.documentElement.scrollTop`

edge: `document.body.scrollTop`

Firefox: `document.documentElement.scrollTop`

<!--more-->

**IE6/7/8/9/10：**

对于没有doctype声明的页面里可以使用 document.body.scrollTop 来获取 scrollTop高度 ；
对于有`doctype`声明的页面则可以使用 `document.documentElement.scrollTop` ；

**Safari:**

safari 比较特别，有自己获取`scrollTop`的函数 ： `window.pageYOffset` ；

**Firefox:**

火狐等等相对标准些的浏览器就省心多了，直接用 document.documentElement.scrollTop

**chrome**

`document.body.scrollTop`

or

`document.documentElement.scrollTop`

**总结，一行代码解决兼容性**

```js
var sTop=document.body.scrollTop+document.documentElement.scrollTop;
```