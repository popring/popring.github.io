---
title: Chrome 调试技巧
tags: Chrome
categories: 技术
abbrlink: f8120d2
date: 2020-01-29 17:35:04
---

> 参考 掘金小册 和 chrome 官方文档，这些东西基本都过一遍有个印象就行，需要用的时候，再看也不迟。
>
> 简单列举，并不全面。

<!-- more -->

## 八大面板

1. 元素面板
2. 控制台面板
3. 源代码面板
4. 网络面板
5. 性能面板
6. 内存面板
7. 应用面板
8. 安全面板



## 小技巧

### 公共 `API` 函数

>  [Console Utilities API Reference](https://developers.google.com/web/tools/chrome-devtools/console/utilities)

#### copy()

复制到剪贴板

#### clear()

清空 `console` 面板历史

#### queryObjects()

对象查询方法

#### log 输出增强

使用 `ES6` 增强对象文字面量（结构赋值）

```js
const a = 123;
const b = '456';
const c = true;

console.log({a,b,c})
```

#### 输出开启 时间戳

`ctrl + shift + p` 

输入  *timestamps* 

#### console 面板

点击 眼睛 ( `create live expression` )

可以定义任何表达式，它会不断更新。

## 快捷键

> [键盘快捷键参考](https://developers.google.com/web/tools/chrome-devtools/shortcuts)

### 打开 `dev tools` 控制台

`ctrl + shift + J`

`ctrl + shift + I`

### 切换 `dev tools` 窗口展示布局

> 需先打开控制台 切换为：底部或右边

`ctrl + shift + D`

### 切换 `Dev Tools` 面板 聚焦

左移 `ctrl + [` 

右移 `ctrl + ]`

### 调整数值

> 下箭头同理

`alt + 上箭头` : 提高数值 `0.1`

普通  `上箭头` ：提高数值 `1`

`shift + 上箭头` :   提高数值 `10`

`ctrl + 上箭头` :  提高数值 `100`

### `h` 隐藏DOM元素

将焦点放在 `DOM` 元素，按 `H` 隐藏 `DOM`

## 参考

- [掘金小册](https://juejin.im/book/5c526902e51d4543805ef35e/section/5c526943e51d451fb9559f80#heading-5)

- [chrome文档](https://developers.google.com/web/tools/chrome-devtools)