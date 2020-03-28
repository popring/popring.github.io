---
title: em、rem和vw(vh)区别
date: 2020-03-28 15:58:01
tags: html
categories: html
---

## 前言

CSS的**单位长度**分为

- 绝对长度单位
- 相对长度单位

其中

绝对长度单位分为 `cm`（厘米）, `mm`（毫米）, `in`（英寸）. `pt`（点）, `px`（像素）

相对长度单位分为 `em`（父元素字体大小）, `rem`（根元素字体大小）, `vw`（视窗宽度）, `vh`（视窗高度）

大家都喜欢只对比 `em` 和 `rem` ，但 `vw` `vh` 也是属于绝对长度，并且也比较常用，所以这里我放在一起对比了。

<!-- more -->

## `vw` 和 `vh`

`vw` 和 `vh` 都是展现的为视窗的高度，也就是页面显示内容的总高度，分为 100 份

> 假如你的页面显示宽度为 1920，那么当你设置你的元素为 `10vw` ，那么当前元素的宽度则为 192。



**example**

```html
<!DOCTYPE html>
<html>
<head>
	<title>111</title>
	<style type="text/css">	
		* {
			margin: 0;
			padding: 0;
		}
		#fa {
			width: 100vw;
			height: 100vh;
			background: red;
		}
	</style>
</head>
<body>
	<div id="fa">
		
	</div>
</body>
</html>
```

![](https://raw.githubusercontent.com/popring/assets-repo/master/img/20200328163110.png)

## em

`em` 是根据元素自身的字体大小来定义的，但看到网上很多说的都是根据 父元素的字体大小，其实这个说法不完全正确 

[代码](#show-you-code)

**如果不定义元素自身字体大小，默认继承父节点字体大小**

> 当父元素的字体设置为 `20px`，那么当前子元素的 `1em` 的值可以认为是 `20px` ，则可以得出 子元素设置宽度为 `5em` 可以换算成 `100px` 

## rem

`rem` 和 `em` 他们不光像亲兄弟，因为他们的使用方法也很像。

`rem` 这里的 `r` 指的是 `root` ，连起来就是 `root em`。此时你应该可以理解了吧。

`rem` 是根据根节点元素的字体大小来定义的，这里的根节点通常指的是标签为 `html` 的元素。



## show you code

<iframe height="318" style="width: 100%;" scrolling="no" title="abOPEaE" src="https://codepen.io/popring/embed/abOPEaE?height=318&theme-id=light&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/popring/pen/abOPEaE'>abOPEaE</a> by HarryHao
  (<a href='https://codepen.io/popring'>@popring</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>



以上代码的 `fa` 代表父节点， `ch` 代表子节点

根节点字体大小 `10px`，子节点（#ch）宽度为 `2rem`，转换后为 `20px`

父节点字体大小 `20px` ，子节点（#ch2）宽度为 `2em` ，转换后为 `40px`

父节点字体大小 `20px` ，子节点（#ch3）字体大小为 `15px`， 子节点（#ch3） 宽度为 `2em` ，转换后为 `30px`

Ending.