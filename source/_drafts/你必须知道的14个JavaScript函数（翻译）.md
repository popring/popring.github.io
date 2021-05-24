---
title: 你必须知道的14个JavaScript函数（翻译）
date: 2021-05-22 17:15:52
tags:
categories: JavaScript
---





---



> 翻译自作者 `bytefish` 文章 [You Must Understand These 14 JavaScript Functions](https://javascript.plainenglish.io/you-must-understand-these-14-javasript-functions-1f4fa1c620e2)



# 1. 确定任意对象的指定类型

总所周知，在 `JavaScript` 中有6个原始数据类型（Boolean, Number, String, Null, Undefined, Symbol）当然还有对象数据类型。但是你知道对象数据类型能被分割成很多子类型吗？一个对象可能为一个 `array`，`function`, `map` 等等类型。如果我们想要获得一个对象的具体类型，应该怎么做？

## 代码

```js
function toRawType (value) {
  let _toString = Object.prototype.toString;
  
  let str = _toString.call(value)

  return str.slice(8, -1)
}
```

## 解释

ECMAScript 有如下定义：

![From ECMAScript](https://miro.medium.com/max/3080/1*6zOf6Cdx72xWsgea9Z56OA.png)

对于不同对象，当调用 `Object.prototype.toString()` 将会返回不同的结果。

![From Chrome‘s Console](https://miro.medium.com/max/2332/1*5dOTZxfy2756XJD6WCOixg.png)

此外， `Object.prototype.toString()` 返回值的格式为 `[object tag]` 。如果我们只想要中间的 `tag` ，我们可以通过正则匹配或 `String.prototype.slice()`来获取。

## 范例

> [toRawType 在代码处](#代码)

```js
toRawType(null)
// "Null"

toRawType(/sdfsd/) 
//"RegExp
```



# 2. 缓存函数计算结果

如果有这么一个函数：

```js
function computed(str) {
  // 假设函数运行非常耗时
  console.log('2000s have passed')
  return 'a result'
}
```

我们想要去缓存函数运行后的结果。当被调用后，如果参数一样，这个函数将不再被计算，结果在缓存中将会立马被返回。

## 代码

```js
function cached(fn) {
  // 创建一个对象去存储每个函数执行后返回的结果
  const cache = Object.create(null);
  
  // 返回一个 wrapped 函数
  return function(str) {
    if( !cache[str] ) {
      let result = fn(str);
      
      // 存储函数执行后的结果在缓存中
      cache[str] = result;
    }
  }
}
```

## 范例

![img](https://miro.medium.com/max/2528/1*h0lugcvB2U-DgAgbgZcKWw.png)



# 3. 实现 `Array.prototype.map`

这是一个非常有用的 `JavaScript` 内置方法，但是你也应能够自己实现这个函数。

## 代码

```js
const selfMap = function (fn, context) {
    let arr = Array.prototype.slice.call(this)
    let mappedArr = Array()
    for (let i = 0; i < arr.length; i++) {
        if (!arr.hasOwnProperty(i)) continue;
        mappedArr[i] = fn.call(context, arr[i], i, this)
    }
    return mappedArr
}

Array.prototype.selfMap = selfMap;
```

## 范例

![img](https://miro.medium.com/max/2828/1*wB4tzaNs7jVZUOB4sJvt1w.png)

# 4. 实现 `Array.prototype.filter`

这是一个非常有用的 `JavaScript` 内置方法，但是你也应能够自己实现这个函数。

## 代码

```js
const selfFilter = function (fn, context) {
    let arr = Array.prototype.slice.call(this)
    let filteredArr = []
    for (let i = 0; i < arr.length; i++) {
        if(!arr.hasOwnProperty(i)) continue;
         fn.call(context, arr[i], i, this) && filteredArr.push(arr[i])
    }
    return filteredArr
}

Array.prototype.selfFilter = selfFilter;
```

## 范例

![img](https://miro.medium.com/max/2824/1*sDTb5kehevishFG4nwfxAA.png)

# 5. 实现 `Array.prototype.some`



## 代码

```js
const selfSome = function (fn, context) {
    let arr = Array.prototype.slice.call(this)
    if(!arr.length) return false
    for (let i = 0; i < arr.length; i++) {
        if(!arr.hasOwnProperty(i)) continue;
        let res = fn.call(context,arr[i],i,this)
        if(res)return true
    }
    return false
}

Array.prototype.selfSome = selfSome;
```

## 范例

![img](https://miro.medium.com/max/2344/1*ZTzttvyKyks70C19-s5BMA.png)

# 6. 实现 `Array.prototype.reduce`



## 代码

```js
const selfReduce = function (fn, initialValue) {
    let arr = Array.prototype.slice.call(this)
    let res
    let startIndex
    if (initialValue === undefined) {
        for (let i = 0; i < arr.length; i++) {
            if (!arr.hasOwnProperty(i)) continue
            startIndex = i
            res = arr[i]
            break
        }
    } else {
        res = initialValue
    }

    for (let i = ++startIndex || 0; i < arr.length; i++) {
        if (!arr.hasOwnProperty(i)) continue
        res = fn.call(null, res, arr[i], i, this)
    }
    return res
}

Array.prototype.selfReduce = selfReduce;
```

## 范例

![img](https://miro.medium.com/max/2220/1*4hTaEUegyhuguAIyC0jLVA.png)

# 7. 实现 `Array.prototype.flat`

## 代码

```js

const selfFlat = function (depth = 1) {
    let arr = Array.prototype.slice.call(this)
    if (depth === 0) return arr
    return arr.reduce((pre, cur) => {
        if (Array.isArray(cur)) {
            return [...pre, ...selfFlat.call(cur, depth - 1)]
        } else {
            return [...pre, cur]
        }
    }, [])
}

Array.prototype.selfFlat = selfFlat;
```

## 范例

![img](https://miro.medium.com/max/3008/1*JAxIsprA8OuS4xxITRnBHw.png)

# 8. 科里化

科里化是一个将多个参数的函数求值转换为单个参数的函数序列的技术。

换言之，当一个函数不是一次获取所有参数，而是获取第一个参数并返回一个新函数，该函数获取第二个参数并返回一个新函数，该函数获取第三个参数，依此类推，直到所有参数都已完成。

为什么有用？

- 科里化帮你避免一遍又一遍的传递同一个变量
- 可以创建一个高阶函数，对于时间处理非常有用。
- 一小块儿（代码）能够配置和重复使用。

让我们一起来看下一个简单的 `add` 函数。它接受三个参数运算，并且将三个参数的和作为结果返回。

```js
function add(a,b,c) {
  return a+b+c;
}
```

你调用它时可以传入很少的参数（结果很怪），或者传入很多参数（多余的将会被忽略）。

```js
add(1,2,3) --> 6 
add(1,2) --> NaN
add(1,2,3,4) --> 6 //Extra parameters will be ignored.
```

如何将一个已存在的函数转化为颗粒化版本？

## 代码

```js
function curry(fn) {
    if (fn.length <= 1) return fn;
    const generator = (...args) => {
        if (fn.length === args.length) {

            return fn(...args)
        } else {
            return (...args2) => {

                return generator(...args, ...args2)
            }
        }
    }
    return generator
}
```

## 范例

![img](https://miro.medium.com/max/3172/1*xWlaYdGM43c5UtE-2sDbLw.png)

# 9. 防抖

防抖

















