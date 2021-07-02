---
title: JS中的substr和subString还有slice的区别
date: 2019-03-09 23:32:11
tags:
categories: JavaScript
---

区别就是一个长一个短。皮一下，很开心。

注意：

`substr` 官方不推荐不使用

`substring`是全小写，没有按照驼峰命名法来。方法都是不改变原字符串，调用方法后返回一个新字符串。



<!--more-->

[String.prototype.substr()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substr)

[String,prototype.substring()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/substring)

[String.prototype.slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/slice)

> 注意：`substring`是全小写，没有按照驼峰命名法来。方法都是不改变原字符串，调用方法后返回一个新字符串。

### str.substr(start[, length])

> `start` 开始提取字符的位置，如果`start`为负值，则为`strLength + start`
>
> `length ` 可选，提取字符的长度



### str.substring(indexStart[, indexEnd])

> `indexStart`需要截取的第一个字符的索引，该字符作为返回的字符串的首字母。
>
> `indexEnd`可选，返回字符串结尾的位置，当前位置的字符不会返回。



### str.slice(beginSlice[, endSlice])

> `beginSlice`索引开始，提取字符串
>
> `endSlice`，可选，索引结束提取字符串

```js
var str = 'Hello World';

// 输出 Hello
console.log(str.substr(0,5));

// 输出 World
console.log(str.substring(6,11));

// 输出 lo
console.log(str.slice(3,5));
```