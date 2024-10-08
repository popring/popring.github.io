---
title: setTimeout为什么会有延迟
tags:
  - 浏览器
  - 面试题
categories: 简单聊
abbrlink: 9a771de5
date: 2023-06-18 13:13:13
---



### what

首先来解释下什么是 [setTimout](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) ：此函数是一个全局函数，可以用来设置一个定时器，在指定时间后触发回掉函数。

其中 setTimeout 有两类用法：

```js
/* 本用法不推荐，code 为字符串，在定时器到期后会进行编译执行code字符串，delay为定时时间 */
setTimeout(code, delay)
```

```js
/* functionRef 定时器到期后的回调函数；delay 定时时间；...params 作为参数传递给回调函数 */
setTimeout(functionRef, delay, param1, param2)
```



`setTimeout` 返回值为一个正整数类型的 `timeoutID` ，可使用 `clearTimeout` 进行取消定时器。



### Why

为什么 setTimeout 会有 4ms 的延迟呢？

实际上题目不完全对，并不完全是会有 4ms 延迟。正如 [HTML 标准](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)中规定的那样，一旦对 `setTimeout` 的嵌套调用被安排了 5 次，浏览器将强制执行 4 毫秒的最小超时。

其他影响 setTimout 延迟因素：

1. 并发任务： 在浏览器中，存在多个任务需要处理，如用户交互、DOM 更新、网络请求等。这些任务会占用浏览器的资源和处理能力。当设置一个 setTimeout 的延迟时间时，浏览器可能会优先处理其他任务，导致 setTimeout 的回调函数的执行被推迟。
2. 执行上下文的切换： 当定时器到期时，浏览器需要切换执行上下文来调用 setTimeout 的回调函数。这个上下文切换可能会引入一定的延迟。浏览器需要在当前任务完成后，选择合适的时机执行回调函数。
3. 系统和硬件因素： 系统负载、设备性能以及浏览器实现的差异等因素也会影响 setTimeout 回调函数的执行时间。不同的浏览器和设备可能有不同的延迟表现。



### 相关文章

[MDN setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)

[为什么 setTimeout 有最小时延 4ms ?](https://juejin.cn/post/6846687590616137742)

[How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/)



