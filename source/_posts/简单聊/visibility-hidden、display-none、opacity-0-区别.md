---
title: 'visibility: hidden、display: none、opacity: 0 区别'
tags: css
categories: 简单聊
abbrlink: 540f9cbc
date: 2020-10-16 16:52:36
---

## 结论

做了以下的实验，可以得出结论，

-  `visibility: hidden;` 只是在视觉上隐藏，但没有影响布局，但绑定的事件也无法触发。
- `display:none;` 元素被彻底隐藏，在页面上完全不显示，不占位，无宽高
- `opacity: 0;` 只会修改元素透明度，并不影响布局及事件触发。



<!-- more -->

## 样式属性

### visibility

> 控制 显示/隐藏 元素，不会影响布局。

- `visible` 元素正常显示
- `hidden` 隐藏元素，但不影响布局。**子元素设置为 `visible` 则子元素仍然可见**
- `collapse` 用于隐藏表格的行、列。

### display

> 官网介绍了很多类型，并且分为六大类，具体请看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)
>
> - `display-outside ` 
> - `display-inside` 
> - `display-listitem` 
> - `display-internal`
> - `display-legacy`
> - `display-box`

这里就介绍一下常用的几个

- `block` 将元素设置为块级元素
- `inline` 将元素设置为行内元素
- `inline-block` 将元素设置为行内块元素
- `table` 表格样式
- `flex` 弹性布局
- `grid` 网格布局
- `none` 使元素不显示（后代元素也将隐藏），不占位，切换则会影响布局。

### opacity

> 更改元素的透明度（使用opacity属性，当属性值不为1时，会把元素放置在一个新的[层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)中。）

- `number值` 此值应为 `0.0 ~ 1.0` 之间



## 三个样式隐藏的区别

原始代码

> 在 box 外层加了一个 div 添加边框，更加可以直观的看出各个样式的区别。

```html
<style>
  .wrap {
    border: 1px solid #000;
    margin: 10px 0;
    overflow: hidden;
  }
  .wrap > div {
    height: 100px;
  }
  .box1 {
    background-color: red;
  }
  .box2 {
    background-color: yellow;
  }
  .box3 {
    background-color: skyblue;
  }
</style>
<div class="wrap">
  <div class="box1"></div>
</div>
<div class="wrap">
  <div class="box2"></div>
</div>
<div class="wrap">
  <div class="box3"></div>
</div>
```

![image-20201016225251216](https://raw.githubusercontent.com/popring/assets-repo/master/img/20201016225256.png)

### 页面展示效果

> 根据以上代码进行修改，将每个 box 添加以上三种的隐藏样式后效果

```css
.box1 {
  background-color: red;
  visibility: hidden;
}
.box2 {
  background-color: yellow;
  display: none;
}
.box3 {
  background-color: skyblue;
  opacity: 0;
}
```

![image-20201016225828692](https://raw.githubusercontent.com/popring/assets-repo/master/img/20201016230147.png)

![image-20201016233414985](https://raw.githubusercontent.com/popring/assets-repo/master/img/20201016233415.png)

可以看出，只有 `display: none;` 没有宽度了（尝试添加高度之后仍然没有显示出来）。而剩下的 `visibility: hidden;` `opacity: 0;` 仍然会占据位置（从外层 div 的边框线就可以看出来）。



### 性能区别

> 以下**切换样式**指的就是样式从显示到隐藏或从隐藏到显示。
>
> 比如： 
>
> visibility: hidden; -> visibility: visible;
>
> opacity: 0; -> opacity: 1;
>
> display: block; -> display: none;

根据上述 页面展示效果 可以看出，`visibility: hidden;` `opacity: 0;` 只会对元素进行隐藏，并不会改变页面布局，所以如果**切换样式**只会造成**页面重绘（repaint）**并不会回流。

而如果是修改 `display` 属性的话，则会影响布局，**造成页面回流（reflow），同时也会造成重绘（repaint）**。



### 点击效果

> 根据以上代码，进行改造，添加 js 代码，用来监听点击事件，点击输出当前被点击元素的类名

```html
<style>
  .wrap {
    border: 1px solid #000;
    margin: 10px 0;
    overflow: hidden;
  }
  .wrap > div {
    height: 100px;
  }
  .box1 {
    background-color: red;
    visibility: hidden;
  }
  .box2 {
    background-color: yellow;
    display: none;
  }
  .box3 {
    background-color: skyblue;
    opacity: 0;
  }
</style>
<div class="wrap">
  <div class="box1"></div>
</div>
<div class="wrap">
  <div class="box2"></div>
</div>
<div class="wrap">
  <div class="box3"></div>
</div>

<script>
  window.onload = function () {
    for (let i = 1; i <= 3; i++) {
      let box = document.getElementsByClassName(`box${i}`)[0]
      box.addEventListener('click', function() {
        console.log(this.className);
      })
    }
  }
</script>
```



然后依次进行点击（第二个盒子因为完全隐藏，所以点击不到）

![image-20201016232532906](https://raw.githubusercontent.com/popring/assets-repo/master/img/20201016232532.png)





看点击结果只有最后一个盒子被点击到。

小结

-  `visibility: hidden;` `display:none;`无法被点击
-  `opacity: 0;` 可被点击



[结论在开头](#结论)

## 参考

[MDN](https://developer.mozilla.org/zh-CN)