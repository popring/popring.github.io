---
title: CSS3 新特性
date: 2020-02-01 15:51:33
tags:
- css3
categories:
- css
---

css3 新特性

- scroll-behavior
- clip-path
- background-clip
- ::selection
- ::placeholder

<!-- more -->



## 锚点滚动更加丝滑

```css
html {
  scroll-behavior: smooth;
}
```

## 剪切可视区域图片

```css
div {
  clip-path: circle(40%); //圆形显示
  clip-path: ellipse(130px 140px at 10% 20%); // 椭圆
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); // 多边形
}
```

## 元素背景延伸到边框

```css
div {
  background-clip: border-box;  // 包括边框
  background-clip: padding-box;
  background-clip: content-box;	// 内容
  
  // 试验API，不建议使用
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

## 选中文本样式

```css
::selection {
  background-color: rgba(238, 99, 82,1);
  color: white;
}
```

## 自定义输入框placeholder

```css
input { 
  font-weight: 800;
  color: #d27054;
}

::placeholder {
  opacity: 1;
  font-weight: 300;
  color: #666;
  font-size: 1rem;
}
```

